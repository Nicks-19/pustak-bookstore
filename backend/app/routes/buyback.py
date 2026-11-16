from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..database import get_db_connection
from ..models import (
    BuybackCalculateRequest, BuybackCalculateResponse,
    BuybackExecuteRequest, ConditionGrade
)

router = APIRouter(prefix="/api/buyback", tags=["Circular Buyback & Textbook Depreciation"])

CONDITION_RATES = {
    ConditionGrade.Mint: {"depreciation_pct": 50.0, "buyback_ratio": 0.50, "resale_markup": 1.25},
    ConditionGrade.Good: {"depreciation_pct": 60.0, "buyback_ratio": 0.40, "resale_markup": 1.30},
    ConditionGrade.Fair: {"depreciation_pct": 75.0, "buyback_ratio": 0.25, "resale_markup": 1.40},
    ConditionGrade.Poor: {"depreciation_pct": 90.0, "buyback_ratio": 0.10, "resale_markup": 1.50}
}

@router.post("/calculate", response_model=BuybackCalculateResponse)
def calculate_buyback_credit(payload: BuybackCalculateRequest):
    """
    Algorithmic Textbook Depreciation Engine:
    Calculates fair buyback credit and suggested pre-owned resale price based on physical condition grade.
    """
    config = CONDITION_RATES.get(payload.condition_grade, CONDITION_RATES[ConditionGrade.Good])
    buyback_amount = round(payload.original_mrp * config["buyback_ratio"], 2)
    resale_price = round(buyback_amount * config["resale_markup"], 2)

    return {
        "book_title": payload.book_title,
        "original_mrp": payload.original_mrp,
        "condition_grade": payload.condition_grade.value,
        "depreciation_rate_percent": config["depreciation_pct"],
        "buyback_amount_inr": buyback_amount,
        "recommended_resale_price_inr": resale_price
    }

@router.post("/execute", status_code=status.HTTP_201_CREATED)
def execute_buyback(payload: BuybackExecuteRequest):
    """
    Executes circular buyback:
    1. Issues digital store credit to student wallet.
    2. Logs buyback transaction.
    3. Seamlessly adds pre-owned textbook into active bookstore inventory on Shelf/Rack P!
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    config = CONDITION_RATES.get(payload.condition_grade, CONDITION_RATES[ConditionGrade.Good])
    buyback_amount = round(payload.original_mrp * config["buyback_ratio"], 2)
    resale_price = round(buyback_amount * config["resale_markup"], 2)

    # 1. Update or create student wallet
    cursor.execute("SELECT id, wallet_balance_inr FROM student_wallets WHERE student_prn = ?", (payload.student_prn,))
    wallet = cursor.fetchone()

    if wallet:
        new_balance = round(wallet["wallet_balance_inr"] + buyback_amount, 2)
        cursor.execute("""
        UPDATE student_wallets 
        SET wallet_balance_inr = ?, student_name = ?, contact = ?
        WHERE student_prn = ?
        """, (new_balance, payload.student_name, payload.contact, payload.student_prn))
    else:
        new_balance = buyback_amount
        cursor.execute("""
        INSERT INTO student_wallets (student_prn, student_name, contact, wallet_balance_inr)
        VALUES (?, ?, ?, ?)
        """, (payload.student_prn, payload.student_name, payload.contact, new_balance))

    # 2. Log buyback transaction
    cursor.execute("""
    INSERT INTO buyback_transactions (
        student_prn, book_title, isbn, original_mrp, condition_grade,
        depreciation_rate, buyback_amount_inr, store_credit_issued
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    """, (
        payload.student_prn, payload.book_title, payload.isbn or "N/A", payload.original_mrp,
        payload.condition_grade.value, config["depreciation_pct"], buyback_amount
    ))
    tx_id = cursor.lastrowid

    # 3. Add to pre-owned books inventory so next student can buy it!
    preowned_isbn = f"{payload.isbn or 'PO'}-USED-{tx_id}"
    cursor.execute("""
    INSERT INTO books (
        isbn, title, author, publisher, edition, category, mrp, selling_price,
        stock_quantity, is_preowned, condition_grade, aisle_no, section, rack_id, shelf_level, cover_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?, ?, ?, ?)
    """, (
        preowned_isbn, f"{payload.book_title} (Pre-Owned)", "Author on Record", "Academic Press",
        f"Used - {payload.condition_grade.value}", payload.category, payload.original_mrp, resale_price,
        payload.condition_grade.value, payload.aisle_no, payload.section, payload.rack_id, payload.shelf_level,
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ))
    new_book_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return {
        "transaction_id": tx_id,
        "student_prn": payload.student_prn,
        "student_name": payload.student_name,
        "buyback_amount_credited_inr": buyback_amount,
        "updated_wallet_balance_inr": new_balance,
        "preowned_book_added_id": new_book_id,
        "resale_price_inr": resale_price,
        "message": f"Successfully credited INR {buyback_amount} to {payload.student_name}'s store wallet!"
    }

@router.get("/wallets/{student_prn}")
def get_student_wallet(student_prn: str):
    """Fetches student digital store wallet balance and recent buyback history."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM student_wallets WHERE student_prn = ?", (student_prn,))
    wallet = cursor.fetchone()

    if not wallet:
        conn.close()
        raise HTTPException(status_code=404, detail=f"No wallet found for PRN '{student_prn}'")

    cursor.execute("SELECT * FROM buyback_transactions WHERE student_prn = ? ORDER BY id DESC", (student_prn,))
    txs = cursor.fetchall()
    conn.close()

    return {
        "student_prn": wallet["student_prn"],
        "student_name": wallet["student_name"],
        "contact": wallet["contact"],
        "wallet_balance_inr": float(wallet["wallet_balance_inr"]),
        "transactions": [
            {
                "id": t["id"],
                "book_title": t["book_title"],
                "condition_grade": t["condition_grade"],
                "buyback_amount_inr": float(t["buyback_amount_inr"]),
                "created_at": str(t["created_at"])
            }
            for t in txs
        ]
    }

@router.get("/history")
def get_buyback_history():
    """Lists all recent circular buyback transactions."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM buyback_transactions ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "student_prn": r["student_prn"],
            "book_title": r["book_title"],
            "isbn": r["isbn"],
            "original_mrp": float(r["original_mrp"]),
            "condition_grade": r["condition_grade"],
            "buyback_amount_inr": float(r["buyback_amount_inr"]),
            "created_at": str(r["created_at"])
        }
        for r in rows
    ]
