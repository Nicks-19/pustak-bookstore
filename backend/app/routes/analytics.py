from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from typing import List
from ..database import get_db_connection

router = APIRouter(prefix="/api/analytics", tags=["Dead Stock & Inventory Analytics"])

@router.get("/dead-stock")
def get_dead_stock_report():
    """
    Dead Stock AI & Clearance Automation:
    Identifies books with zero sales in the last 60+ and 90+ days,
    computes locked-up working capital, and generates automated clearance recommendations.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        id, title, author, category, selling_price, stock_quantity,
        aisle_no, rack_id, shelf_level, last_sold_at,
        CAST((julianday('now') - julianday(last_sold_at)) AS INTEGER) as days_dormant
    FROM books
    WHERE stock_quantity > 0
    ORDER BY days_dormant DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    critical_dead_stock = []
    slow_moving = []
    healthy = []

    total_locked_capital_inr = 0.0

    for r in rows:
        days = r["days_dormant"] or 0
        capital = round(float(r["selling_price"]) * int(r["stock_quantity"]), 2)

        item = {
            "book_id": r["id"],
            "title": r["title"],
            "author": r["author"],
            "category": r["category"],
            "selling_price": float(r["selling_price"]),
            "stock_quantity": int(r["stock_quantity"]),
            "days_dormant": days,
            "locked_capital_inr": capital,
            "location": f"{r['aisle_no']} -> {r['rack_id']} ({r['shelf_level']})"
        }

        if days >= 90:
            item["status"] = "Critical Dead Stock"
            item["recommended_clearance_discount"] = 40.0
            item["suggested_new_price"] = round(item["selling_price"] * 0.60, 2)
            critical_dead_stock.append(item)
            total_locked_capital_inr += capital
        elif days >= 60:
            item["status"] = "Slow Moving"
            item["recommended_clearance_discount"] = 25.0
            item["suggested_new_price"] = round(item["selling_price"] * 0.75, 2)
            slow_moving.append(item)
            total_locked_capital_inr += capital
        else:
            item["status"] = "Active Mover"
            healthy.append(item)

    return {
        "summary": {
            "total_items_analyzed": len(rows),
            "critical_dead_stock_count": len(critical_dead_stock),
            "slow_moving_count": len(slow_moving),
            "total_locked_capital_inr": round(total_locked_capital_inr, 2)
        },
        "critical_dead_stock": critical_dead_stock,
        "slow_moving": slow_moving
    }

@router.post("/apply-clearance/{book_id}")
def apply_clearance_discount(book_id: int):
    """Applies automated clearance discount to dead stock book to free up shelf space."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, selling_price, mrp, last_sold_at FROM books WHERE id = ?", (book_id,))
    book = cursor.fetchone()
    if not book:
        conn.close()
        raise HTTPException(status_code=404, detail="Book not found")

    old_price = float(book["selling_price"])
    new_price = round(old_price * 0.70, 2) # 30% discount

    cursor.execute("""
    UPDATE books 
    SET selling_price = ?, edition = edition || ' (Clearance 30% Off)'
    WHERE id = ?
    """, (new_price, book_id))

    conn.commit()
    conn.close()

    return {
        "book_id": book_id,
        "title": book["title"],
        "old_price_inr": old_price,
        "new_clearance_price_inr": new_price,
        "message": f"Applied 30% clearance discount to '{book['title']}'. New price: INR {new_price}."
    }

@router.get("/summary")
def get_store_summary():
    """Returns overarching bookstore metrics for owner dashboard."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(id) as total_books, SUM(stock_quantity) as total_stock FROM books")
    b_stat = cursor.fetchone()

    cursor.execute("SELECT COUNT(id) as preowned_count FROM books WHERE is_preowned = 1")
    preowned_count = cursor.fetchone()["preowned_count"]

    cursor.execute("SELECT COUNT(id) as total_buybacks, COALESCE(SUM(buyback_amount_inr), 0) as total_credited FROM buyback_transactions")
    bb_stat = cursor.fetchone()

    cursor.execute("SELECT COUNT(id) as total_orders, COALESCE(SUM(total_paid_inr), 0) as total_revenue FROM orders")
    ord_stat = cursor.fetchone()

    conn.close()

    return {
        "total_book_titles": b_stat["total_books"] or 0,
        "total_stock_units": b_stat["total_stock"] or 0,
        "preowned_books_rescued": preowned_count,
        "total_buyback_transactions": bb_stat["total_buybacks"] or 0,
        "total_store_credit_issued_inr": round(bb_stat["total_credited"], 2),
        "total_orders_completed": ord_stat["total_orders"] or 0,
        "total_revenue_inr": round(ord_stat["total_revenue"], 2)
    }
