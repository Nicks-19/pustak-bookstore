from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from ..database import get_db_connection
from ..models import BookCreate, BookResponse

router = APIRouter(prefix="/api/books", tags=["Books & Shelf Navigation"])

@router.get("", response_model=List[BookResponse])
def get_books(
    search: Optional[str] = Query(None, description="Search by title, author, or ISBN"),
    category: Optional[str] = Query(None, description="Filter by category"),
    is_preowned: Optional[bool] = Query(None, description="Filter new vs pre-owned buyback books"),
    aisle: Optional[str] = Query(None, description="Filter by physical aisle")
):
    """Retrieves all books with optional search, category, pre-owned, and aisle filters."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM books"
    params = []
    conditions = []

    if search:
        s = f"%{search.strip()}%"
        conditions.append("(title LIKE ? OR author LIKE ? OR isbn LIKE ?)")
        params.extend([s, s, s])

    if category:
        conditions.append("category = ?")
        params.append(category)

    if is_preowned is not None:
        conditions.append("is_preowned = ?")
        params.append(1 if is_preowned else 0)

    if aisle:
        conditions.append("aisle_no = ?")
        params.append(aisle)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [
        {
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
        }
        for r in rows
    ]

@router.get("/{book_id}/shelf-location")
def get_shelf_location(book_id: int):
    """
    Physical Store Shelf & Rack Navigator:
    Returns the exact physical coordinate breadcrumb for rapid in-store localization.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, aisle_no, section, rack_id, shelf_level, stock_quantity FROM books WHERE id = ?", (book_id,))
    b = cursor.fetchone()
    conn.close()

    if not b:
        raise HTTPException(status_code=404, detail="Book not found")

    # Map aisle to visual grid coordinates for frontend store-map renderer
    aisle_coords = {
        "Aisle 1": {"x": 20, "y": 40, "color": "#10b981"}, # Emerald
        "Aisle 2": {"x": 50, "y": 40, "color": "#0ea5e9"}, # Sky
        "Aisle 3": {"x": 80, "y": 40, "color": "#f59e0b"}  # Amber
    }

    coord = aisle_coords.get(b["aisle_no"], {"x": 50, "y": 50, "color": "#6366f1"})

    return {
        "book_id": b["id"],
        "title": b["title"],
        "stock_quantity": b["stock_quantity"],
        "location": {
            "aisle": b["aisle_no"],
            "section": b["section"],
            "rack": b["rack_id"],
            "shelf": b["shelf_level"]
        },
        "breadcrumb": f"{b['aisle_no']} -> {b['section']} -> {b['rack_id']} -> {b['shelf_level']}",
        "map_coordinates": coord
    }

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate):
    """Creates a new book inventory record with physical shelf coordinates and Pydantic validation."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check for existing ISBN
    cursor.execute("SELECT id FROM books WHERE isbn = ?", (payload.isbn,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail=f"Book with ISBN '{payload.isbn}' already exists in inventory.")

    cursor.execute("""
    INSERT INTO books (
        isbn, title, author, publisher, edition, category, mrp, selling_price,
        stock_quantity, is_preowned, condition_grade, aisle_no, section, rack_id,
        shelf_level, cover_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        payload.isbn, payload.title.strip(), payload.author.strip(), payload.publisher.strip(),
        payload.edition.strip(), payload.category.strip(), payload.mrp, payload.selling_price,
        payload.stock_quantity, 1 if payload.is_preowned else 0, payload.condition_grade.value,
        payload.aisle_no.strip(), payload.section.strip(), payload.rack_id.strip(),
        payload.shelf_level.strip(), payload.cover_image or "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM books WHERE id = ?", (new_id,))
    r = cursor.fetchone()
    conn.close()

    return {
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
    }

@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
def delete_book(book_id: int):
    """Deletes a book from inventory."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM books WHERE id = ?", (book_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Book not found")

    conn.commit()
    conn.close()
    return {"message": f"Book ID {book_id} removed successfully"}
