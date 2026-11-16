from fastapi import APIRouter, HTTPException, status
from typing import List
from ..database import get_db_connection
from ..models import BundleCreate, BundleResponse, BookResponse

router = APIRouter(prefix="/api/bundles", tags=["Academic Syllabus Bundles"])

@router.get("", response_model=List[BundleResponse])
def get_bundles():
    """Fetches all academic syllabus kits with computed savings and included book titles."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM syllabus_bundles ORDER BY id DESC")
    bundle_rows = cursor.fetchall()

    results = []
    for b in bundle_rows:
        bundle_id = b["id"]
        cursor.execute("""
        SELECT b.* FROM books b
        JOIN bundle_items bi ON b.id = bi.book_id
        WHERE bi.bundle_id = ?
        """, (bundle_id,))
        book_rows = cursor.fetchall()

        books_list = []
        total_mrp = 0.0

        for r in book_rows:
            total_mrp += float(r["selling_price"])
            books_list.append({
                "id": r["id"],
                "isbn": r["isbn"],
                "title": r["title"],
                "author": r["author"],
                "publisher": r["publisher"],
                "edition": r["edition"],
                "category": r["category"],
                "mrp": float(r["mrp"]),
                "selling_price": float(r["selling_price"]),
                "stock_quantity": int(r["stock_quantity"]),
                "is_preowned": bool(r["is_preowned"]),
                "condition_grade": r["condition_grade"],
                "aisle_no": r["aisle_no"],
                "section": r["section"],
                "rack_id": r["rack_id"],
                "shelf_level": r["shelf_level"],
                "cover_image": r["cover_image"],
                "last_sold_at": str(r["last_sold_at"]),
                "created_at": str(r["created_at"])
            })

        discount_pct = float(b["discount_percent"])
        discount_amount = round(total_mrp * (discount_pct / 100.0), 2)
        bundle_price = round(total_mrp - discount_amount, 2)

        results.append({
            "id": b["id"],
            "bundle_name": b["bundle_name"],
            "course_branch": b["course_branch"],
            "semester": b["semester"],
            "discount_percent": discount_pct,
            "description": b["description"],
            "total_mrp": total_mrp,
            "bundle_price": bundle_price,
            "savings_inr": discount_amount,
            "books": books_list,
            "created_at": str(b["created_at"])
        })

    conn.close()
    return results

@router.post("", response_model=BundleResponse, status_code=status.HTTP_201_CREATED)
def create_bundle(payload: BundleCreate):
    """Creates a new syllabus curriculum kit with Pydantic validation."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO syllabus_bundles (bundle_name, course_branch, semester, discount_percent, description)
    VALUES (?, ?, ?, ?, ?)
    """, (payload.bundle_name.strip(), payload.course_branch.strip(), payload.semester.strip(), payload.discount_percent, payload.description or ""))
    bundle_id = cursor.lastrowid

    for b_id in payload.book_ids:
        cursor.execute("INSERT INTO bundle_items (bundle_id, book_id) VALUES (?, ?)", (bundle_id, b_id))

    conn.commit()
    conn.close()

    # Re-fetch created bundle
    bundles = get_bundles()
    created = next((b for b in bundles if b["id"] == bundle_id), None)
    if not created:
        raise HTTPException(status_code=500, detail="Failed to retrieve created bundle")
    return created

@router.delete("/{bundle_id}", status_code=status.HTTP_200_OK)
def delete_bundle(bundle_id: int):
    """Deletes an academic syllabus bundle."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM syllabus_bundles WHERE id = ?", (bundle_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Bundle not found")

    conn.commit()
    conn.close()
    return {"message": f"Bundle {bundle_id} deleted successfully"}
