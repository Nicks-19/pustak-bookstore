# 🗄️ Pustak Database Architecture & System Design Specification

**Candidate:** Nikita Sharad Pawar | **PRN:** `202401100018` | **Roll:** `A19`  
**System:** Pustak — Smart Academic Bookstore & Circular Textbook Buyback Platform  
**Database Engine:** SQLite 3 (ACID Relational, Foreign Keys Enforced, B-Tree Indexed)

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Layer (Browser)"]
        UI["React 18 SPA + Vite 5 + Tailwind CSS"]
        Catalog["Book Catalog & Search"]
        Navigator["2D Shelf Coordinate Floor Map"]
        Buyback["Circular Buyback & Wallet UI"]
        Bundles["Academic Syllabus Kits"]
        POS["POS Billing & Dynamic QR Receipt"]
        DeadStock["Dead Stock AI & Liquidation"]
    end

    subgraph Server ["Backend API Layer (FastAPI / Python 3.12)"]
        Uvicorn["Uvicorn ASGI Server (:8000)"]
        FastAPIApp["FastAPI Application & Router Dispatcher"]
        
        subgraph Routers ["Modular REST Routers"]
            R1["/api/inventory"]
            R2["/api/buyback"]
            R3["/api/bundles"]
            R4["/api/billing"]
            R5["/api/analytics"]
        end

        subgraph Validation ["Two-Tier Validation"]
            Pydantic["Pydantic v2 Strict Typing & Regex Validators"]
        end
    end

    subgraph Storage ["Relational Persistence Layer (SQLite 3)"]
        DB[(pustak.db - 7 Normalized Tables 3NF)]
        FK["Foreign Key Cascade & ACID Transaction Controls"]
        Indexes["B-Tree Indexes (isbn, prn, last_sold_at)"]
    end

    UI --> Uvicorn
    Uvicorn --> FastAPIApp
    FastAPIApp --> Routers
    Routers --> Pydantic
    Pydantic --> DB
    DB --> FK
    DB --> Indexes
```

---

## 2. Entity-Relationship (ER) Diagram (3NF Normalized)

```mermaid
erDiagram
    STUDENT_WALLETS ||--o{ BUYBACK_TRANSACTIONS : "conducts"
    STUDENT_WALLETS ||--o{ ORDERS : "places"
    BOOKS ||--o{ BUNDLE_ITEMS : "included_in"
    SYLLABUS_BUNDLES ||--|{ BUNDLE_ITEMS : "contains"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    BOOKS ||--o{ ORDER_ITEMS : "ordered_as"

    STUDENT_WALLETS {
        string student_prn PK "e.g., 202401100018"
        string student_name "Full Candidate Name"
        string contact "Phone Number"
        real wallet_balance_inr "Available Digital Credit"
        datetime updated_at "Timestamp of last balance change"
    }

    BOOKS {
        integer id PK "Auto Increment"
        string isbn UK "10 or 13-digit Unique Standard"
        string title "Book Title"
        string author "Author / Publication"
        string publisher "Publisher Name"
        string edition "Edition Description"
        string category "Academic Department / Genre"
        real mrp "Maximum Retail Price (>0)"
        real selling_price "Store Selling Price (>0)"
        integer stock_quantity "Available Physical Units (>=0)"
        boolean is_preowned "Flag for Circular Buyback Resale"
        string condition_grade "Mint | Good | Fair | Poor | New"
        string aisle_no "Physical Coordinate: Aisle (1 to 4)"
        string section "Department Section Floor Area"
        string rack_id "Rack Identifier (Rack A/B/C/P)"
        string shelf_level "Shelf Level (Top/Eye/Bottom)"
        string cover_image "Display Cover Asset URL"
        datetime last_sold_at "Last Transaction Date for Dead Stock AI"
    }

    BUYBACK_TRANSACTIONS {
        integer id PK "Auto Increment"
        string student_prn FK "References student_wallets(student_prn)"
        string book_title "Title of Returned Textbook"
        string isbn "Book ISBN"
        real original_mrp "Original MRP in INR"
        string condition_grade "Condition Assessed"
        real depreciation_rate "Percentage Markdown (50%, 40%, 25%, 10%)"
        real buyback_amount_inr "Credit Amount Deposited to Wallet"
        boolean store_credit_issued "Verification Status Flag"
        datetime created_at "Audit Timestamp"
    }

    SYLLABUS_BUNDLES {
        integer id PK "Auto Increment"
        string bundle_name "e.g., FE Engineering Starter Kit"
        string course_branch "e.g., Computer Engineering"
        integer semester "Target Academic Semester (1 to 8)"
        string description "Curriculum Scope Overview"
        real discount_percent "Flat Curriculum Savings (Default 15%)"
        datetime created_at "Creation Date"
    }

    BUNDLE_ITEMS {
        integer id PK "Auto Increment"
        integer bundle_id FK "References syllabus_bundles(id) ON DELETE CASCADE"
        integer book_id FK "References books(id) ON DELETE CASCADE"
    }

    ORDERS {
        integer id PK "Auto Increment"
        string invoice_no UK "Unique Invoice Code (INV-2026-XXXXXX)"
        string customer_name "Student or Walk-in Customer Name"
        string customer_prn FK "Optional student_prn for Wallet Redemption"
        real subtotal_inr "Pre-Discount Cart Total"
        real discount_inr "Promotional Discount Applied"
        real wallet_redeemed_inr "Digital Store Credit Deducted"
        real total_paid_inr "Final Amount Collected"
        string payment_method "Cash | UPI | Card | Wallet Credit"
        datetime created_at "Invoice Generation Timestamp"
    }

    ORDER_ITEMS {
        integer id PK "Auto Increment"
        integer order_id FK "References orders(id) ON DELETE CASCADE"
        integer book_id FK "References books(id)"
        string title "Snapshot of Book Title at Time of Sale"
        real unit_price "Selling Price at Time of Sale"
        integer quantity "Quantity Purchased"
        real total_price "Line Item Subtotal"
    }
```

---

## 3. Database Integrity & Indexing Strategy

To guarantee rapid queries and zero performance bottlenecks during checkout or catalog searches, SQLite B-Tree indexes are explicitly created:

1. **`idx_books_isbn` ON `books(isbn)`**: Enables O(1) instantaneous ISBN lookup during book registration, inventory lookup, and POS barcode scanning.
2. **`idx_books_category` ON `books(category)`**: Accelerates catalog filtering by engineering department (Computer Science, Mechanical, Mathematics).
3. **`idx_books_last_sold` ON `books(last_sold_at)`**: Powers the Dead Stock AI engine by quickly calculating dormant stock without full table scans.
4. **`idx_wallets_prn` ON `student_wallets(student_prn)`**: Instantaneous balance verification and atomic credit updates during circular buyback and POS checkout.
5. **Foreign Key Enforcement**: Initialized with `PRAGMA foreign_keys = ON;` in every database connection to prevent orphan child records when books or orders are modified.
