import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..database import get_db_connection
from ..models import CheckoutRequest, InvoiceResponse, InvoiceItemResponse

router = APIRouter(prefix="/api/billing", tags=["POS Checkout & Digital Invoicing"])

@router.post("/checkout", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def checkout_order(payload: CheckoutRequest):
    """
    POS Checkout & Digital Invoice Generator:
    - Validates stock for each item.
    - Decrements inventory and refreshes last_sold_at timestamp.
    - Redeems student digital store wallet balance if opted.
    - Generates unique invoice number and itemized receipt.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    subtotal = 0.0
    order_items_data = []

    # 1. Validate items and compute subtotal
    for item in payload.items:
        cursor.execute("SELECT id, title, selling_price, stock_quantity FROM books WHERE id = ?", (item.book_id,))
        book = cursor.fetchone()
        if not book:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Book ID {item.book_id} does not exist.")

        if book["stock_quantity"] < item.quantity:
            conn.close()
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{book['title']}'. Requested: {item.quantity}, Available: {book['stock_quantity']}."
            )

        unit_price = float(book["selling_price"])
        line_total = round(unit_price * item.quantity, 2)
        subtotal += line_total

        order_items_data.append({
            "book_id": book["id"],
            "title": book["title"],
            "unit_price": unit_price,
            "quantity": item.quantity,
            "total_price": line_total
        })

    # 2. Wallet Redemption Logic
    wallet_redeemed = 0.0
    if payload.redeem_wallet and payload.customer_prn:
        cursor.execute("SELECT wallet_balance_inr FROM student_wallets WHERE student_prn = ?", (payload.customer_prn,))
        wallet_row = cursor.fetchone()
        if wallet_row:
            current_bal = float(wallet_row["wallet_balance_inr"])
            wallet_redeemed = min(current_bal, subtotal)
            new_bal = round(current_bal - wallet_redeemed, 2)
            cursor.execute("UPDATE student_wallets SET wallet_balance_inr = ? WHERE student_prn = ?", (new_bal, payload.customer_prn))

    total_paid = max(0.0, round(subtotal - wallet_redeemed, 2))
    invoice_no = f"INV-2026-{uuid.uuid4().hex[:6].upper()}"

    # 3. Insert Order
    cursor.execute("""
    INSERT INTO orders (invoice_no, customer_name, customer_prn, subtotal_inr, discount_inr, wallet_redeemed_inr, total_paid_inr, payment_method)
    VALUES (?, ?, ?, ?, 0.0, ?, ?, ?)
    """, (
        invoice_no, payload.customer_name.strip(), payload.customer_prn.strip() if payload.customer_prn else None,
        subtotal, wallet_redeemed, total_paid, payload.payment_method.value
    ))
    order_id = cursor.lastrowid

    # 4. Insert Order Items and Update Inventory Stock & Last Sold Date
    for oi in order_items_data:
        cursor.execute("""
        INSERT INTO order_items (order_id, book_id, title, unit_price, quantity, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (order_id, oi["book_id"], oi["title"], oi["unit_price"], oi["quantity"], oi["total_price"]))

        cursor.execute("""
        UPDATE books 
        SET stock_quantity = stock_quantity - ?,
            last_sold_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """, (oi["quantity"], oi["book_id"]))

    conn.commit()
    cursor.execute("SELECT created_at FROM orders WHERE id = ?", (order_id,))
    created_at = cursor.fetchone()["created_at"]
    conn.close()

    return {
        "invoice_no": invoice_no,
        "customer_name": payload.customer_name,
        "customer_prn": payload.customer_prn,
        "subtotal_inr": subtotal,
        "discount_inr": 0.0,
        "wallet_redeemed_inr": wallet_redeemed,
        "total_paid_inr": total_paid,
        "payment_method": payload.payment_method.value,
        "items": [
            InvoiceItemResponse(
                book_id=oi["book_id"],
                title=oi["title"],
                unit_price=oi["unit_price"],
                quantity=oi["quantity"],
                total_price=oi["total_price"]
            )
            for oi in order_items_data
        ],
        "created_at": str(created_at)
    }

@router.get("/orders", response_model=List[InvoiceResponse])
def get_orders():
    """Lists past billing orders and invoices."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM orders ORDER BY id DESC LIMIT 50")
    orders = cursor.fetchall()

    results = []
    for o in orders:
        cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (o["id"],))
        items = cursor.fetchall()

        results.append({
            "invoice_no": o["invoice_no"],
            "customer_name": o["customer_name"],
            "customer_prn": o["customer_prn"],
            "subtotal_inr": float(o["subtotal_inr"]),
            "discount_inr": float(o["discount_inr"]),
            "wallet_redeemed_inr": float(o["wallet_redeemed_inr"]),
            "total_paid_inr": float(o["total_paid_inr"]),
            "payment_method": o["payment_method"],
            "items": [
                InvoiceItemResponse(
                    book_id=i["book_id"],
                    title=i["title"],
                    unit_price=float(i["unit_price"]),
                    quantity=int(i["quantity"]),
                    total_price=float(i["total_price"])
                )
                for i in items
            ],
            "created_at": str(o["created_at"])
        })

    conn.close()
    return results
