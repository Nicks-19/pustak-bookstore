import sqlite3
import os
import shutil

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pustak.db")

def resolve_db_path() -> str:
    """Resolves database path with support for cloud serverless environments (e.g. Vercel)."""
    if os.environ.get("DATABASE_PATH"):
        return os.environ["DATABASE_PATH"]

    # In Vercel serverless functions, the package directory is read-only.
    # Copy the seed database to /tmp so SQLite can execute reads and writes.
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        tmp_db = "/tmp/pustak.db"
        if not os.path.exists(tmp_db):
            if os.path.exists(DEFAULT_DB_PATH):
                try:
                    shutil.copy2(DEFAULT_DB_PATH, tmp_db)
                except Exception:
                    pass
        return tmp_db

    return DEFAULT_DB_PATH

DB_PATH = resolve_db_path()

def get_db_connection() -> sqlite3.Connection:
    """Returns a SQLite connection with dict-like row access and foreign key enforcement."""
    conn = sqlite3.connect(resolve_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Initializes Pustak SQLite relational tables and B-Tree indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Books Table (Master Inventory & Physical Coordinates)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isbn TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        publisher TEXT NOT NULL,
        edition TEXT DEFAULT 'Latest Edition',
        category TEXT NOT NULL,
        mrp REAL NOT NULL CHECK(mrp > 0),
        selling_price REAL NOT NULL CHECK(selling_price > 0),
        stock_quantity INTEGER NOT NULL CHECK(stock_quantity >= 0),
        is_preowned BOOLEAN DEFAULT 0,
        condition_grade TEXT DEFAULT 'New' CHECK(condition_grade IN ('New', 'Mint', 'Good', 'Fair', 'Poor')),
        aisle_no TEXT NOT NULL,
        section TEXT NOT NULL,
        rack_id TEXT NOT NULL,
        shelf_level TEXT NOT NULL,
        cover_image TEXT,
        last_sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Student Wallets Table (Store Credit from Buybacks)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_prn TEXT NOT NULL UNIQUE,
        student_name TEXT NOT NULL,
        contact TEXT NOT NULL,
        wallet_balance_inr REAL DEFAULT 0.0 CHECK(wallet_balance_inr >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. Buyback Transactions Table (Reverse Logistics Engine)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS buyback_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_prn TEXT NOT NULL,
        book_title TEXT NOT NULL,
        isbn TEXT,
        original_mrp REAL NOT NULL CHECK(original_mrp > 0),
        condition_grade TEXT NOT NULL CHECK(condition_grade IN ('Mint', 'Good', 'Fair', 'Poor')),
        depreciation_rate REAL NOT NULL,
        buyback_amount_inr REAL NOT NULL CHECK(buyback_amount_inr > 0),
        store_credit_issued BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_prn) REFERENCES student_wallets(student_prn) ON DELETE CASCADE
    );
    """)

    # 4. Academic Syllabus Bundles Table (Semester Kits)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS syllabus_bundles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bundle_name TEXT NOT NULL,
        course_branch TEXT NOT NULL,
        semester TEXT NOT NULL,
        discount_percent REAL DEFAULT 15.0 CHECK(discount_percent >= 0 AND discount_percent <= 50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 5. Bundle Items Mapping Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bundle_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bundle_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        FOREIGN KEY (bundle_id) REFERENCES syllabus_bundles(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );
    """)

    # 6. Orders / POS Billing Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_no TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_prn TEXT,
        subtotal_inr REAL NOT NULL CHECK(subtotal_inr >= 0),
        discount_inr REAL DEFAULT 0.0,
        wallet_redeemed_inr REAL DEFAULT 0.0,
        total_paid_inr REAL NOT NULL CHECK(total_paid_inr >= 0),
        payment_method TEXT DEFAULT 'Cash' CHECK(payment_method IN ('Cash', 'UPI', 'Store Wallet', 'Card', 'Split')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 7. Order Items Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        book_id INTEGER,
        title TEXT NOT NULL,
        unit_price REAL NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity > 0),
        total_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL
    );
    """)

    # Performance Indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_books_aisle ON books(aisle_no);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_wallets_prn ON student_wallets(student_prn);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_orders_invoice ON orders(invoice_no);")

    conn.commit()
    conn.close()
