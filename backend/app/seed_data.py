from datetime import datetime, timedelta
from .database import get_db_connection

SEED_BOOKS = [
    {
        "isbn": "9788174091955",
        "title": "Higher Engineering Mathematics",
        "author": "Dr. B.S. Grewal",
        "publisher": "Khanna Publishers",
        "edition": "44th Edition",
        "category": "Mathematics",
        "mrp": 850.0,
        "selling_price": 720.0,
        "stock_quantity": 18,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 1",
        "section": "Basic Sciences & Mathematics",
        "rack_id": "Rack A",
        "shelf_level": "Shelf 2 (Eye Level)",
        "cover_image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        "days_ago": 2
    },
    {
        "isbn": "9781118063330",
        "title": "Operating System Concepts",
        "author": "Silberschatz, Galvin & Gagne",
        "publisher": "Wiley India",
        "edition": "9th Edition",
        "category": "Computer Science",
        "mrp": 925.0,
        "selling_price": 790.0,
        "stock_quantity": 12,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 1",
        "section": "Computer Science & IT",
        "rack_id": "Rack B",
        "shelf_level": "Shelf 1 (Top Shelf)",
        "cover_image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        "days_ago": 5
    },
    {
        "isbn": "9780078022159",
        "title": "Database System Concepts",
        "author": "Abraham Silberschatz, Henry Korth",
        "publisher": "McGraw Hill Education",
        "edition": "7th Edition",
        "category": "Computer Science",
        "mrp": 895.0,
        "selling_price": 760.0,
        "stock_quantity": 15,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 1",
        "section": "Computer Science & IT",
        "rack_id": "Rack B",
        "shelf_level": "Shelf 2 (Eye Level)",
        "cover_image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
        "days_ago": 3
    },
    {
        "isbn": "9788183331630",
        "title": "Let Us C",
        "author": "Yashavant Kanetkar",
        "publisher": "BPB Publications",
        "edition": "18th Edition",
        "category": "Computer Science",
        "mrp": 395.0,
        "selling_price": 330.0,
        "stock_quantity": 25,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 1",
        "section": "Computer Science & IT",
        "rack_id": "Rack C",
        "shelf_level": "Shelf 3 (Bottom Shelf)",
        "cover_image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        "days_ago": 1
    },
    {
        "isbn": "9780262033848",
        "title": "Introduction to Algorithms (CLRS)",
        "author": "Cormen, Leiserson, Rivest, Stein",
        "publisher": "PHI Learning",
        "edition": "3rd Edition",
        "category": "Computer Science",
        "mrp": 1495.0,
        "selling_price": 1250.0,
        "stock_quantity": 8,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 1",
        "section": "Computer Science & IT",
        "rack_id": "Rack A",
        "shelf_level": "Shelf 1 (Top Shelf)",
        "cover_image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
        "days_ago": 7
    },
    {
        "isbn": "9788121924405",
        "title": "Basic Electrical Engineering",
        "author": "V.K. Mehta & Rohit Mehta",
        "publisher": "S. Chand Publishing",
        "edition": "Revised Edition",
        "category": "Electrical",
        "mrp": 625.0,
        "selling_price": 530.0,
        "stock_quantity": 14,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 2",
        "section": "Electrical & Electronics",
        "rack_id": "Rack A",
        "shelf_level": "Shelf 2 (Eye Level)",
        "cover_image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
        "days_ago": 4
    },
    {
        "isbn": "9789380358482",
        "title": "Engineering Mechanics",
        "author": "S.S. Bhavikatti",
        "publisher": "New Age International",
        "edition": "7th Edition",
        "category": "Mechanical",
        "mrp": 550.0,
        "selling_price": 465.0,
        "stock_quantity": 16,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 2",
        "section": "Mechanical & Civil",
        "rack_id": "Rack B",
        "shelf_level": "Shelf 1 (Top Shelf)",
        "cover_image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        "days_ago": 6
    },
    {
        "isbn": "9780132350884",
        "title": "Clean Code: Agile Software Craftsmanship",
        "author": "Robert C. Martin",
        "publisher": "Pearson India",
        "edition": "1st Edition",
        "category": "Computer Science",
        "mrp": 799.0,
        "selling_price": 680.0,
        "stock_quantity": 10,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 1",
        "section": "Computer Science & IT",
        "rack_id": "Rack C",
        "shelf_level": "Shelf 2 (Eye Level)",
        "cover_image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        "days_ago": 1
    },
    {
        "isbn": "9781847941831",
        "title": "Atomic Habits",
        "author": "James Clear",
        "publisher": "Random House Business",
        "edition": "Hardcover",
        "category": "Self-Help & General",
        "mrp": 650.0,
        "selling_price": 520.0,
        "stock_quantity": 20,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 3",
        "section": "General Reading & Personality",
        "rack_id": "Rack A",
        "shelf_level": "Shelf 2 (Eye Level)",
        "cover_image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
        "days_ago": 1
    },
    # Pre-Owned / Buyback Book (Student returned)
    {
        "isbn": "9788174091955-PO",
        "title": "Higher Engineering Mathematics (Pre-Owned)",
        "author": "Dr. B.S. Grewal",
        "publisher": "Khanna Publishers",
        "edition": "43rd Edition",
        "category": "Mathematics",
        "mrp": 850.0,
        "selling_price": 420.0,
        "stock_quantity": 3,
        "is_preowned": True,
        "condition_grade": "Good",
        "aisle_no": "Aisle 1",
        "section": "Pre-Owned Student Section",
        "rack_id": "Rack P",
        "shelf_level": "Shelf 1 (Pre-Owned)",
        "cover_image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        "days_ago": 1
    },
    # Dead Stock Items (Untouched for 70-110 days)
    {
        "isbn": "9780131103627",
        "title": "The C Programming Language (Vintage Edition)",
        "author": "Brian W. Kernighan, Dennis M. Ritchie",
        "publisher": "Prentice Hall",
        "edition": "2nd Edition Vintage",
        "category": "Computer Science",
        "mrp": 750.0,
        "selling_price": 600.0,
        "stock_quantity": 14,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 1",
        "section": "Computer Science & IT",
        "rack_id": "Rack D",
        "shelf_level": "Shelf 3 (Bottom Shelf)",
        "cover_image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
        "days_ago": 85  # 85 days without sale -> Trigger Dead Stock Flag!
    },
    {
        "isbn": "9780070634244",
        "title": "Advanced Engineering Thermodynamics",
        "author": "Adrian Bejan",
        "publisher": "McGraw Hill",
        "edition": "3rd Edition",
        "category": "Mechanical",
        "mrp": 1100.0,
        "selling_price": 950.0,
        "stock_quantity": 9,
        "is_preowned": False,
        "condition_grade": "New",
        "aisle_no": "Aisle 2",
        "section": "Mechanical & Civil",
        "rack_id": "Rack C",
        "shelf_level": "Shelf 3 (Bottom Shelf)",
        "cover_image": "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80",
        "days_ago": 110 # 110 days without sale -> Critical Dead Stock!
    }
]

def seed_database():
    """Seeds Pustak SQLite database if books table is empty."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM books")
    count = cursor.fetchone()["count"]

    if count == 0:
        now = datetime.now()
        book_ids = {}

        for b in SEED_BOOKS:
            sold_time = now - timedelta(days=b["days_ago"])
            cursor.execute("""
            INSERT INTO books (
                isbn, title, author, publisher, edition, category, mrp, selling_price,
                stock_quantity, is_preowned, condition_grade, aisle_no, section, rack_id,
                shelf_level, cover_image, last_sold_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                b["isbn"], b["title"], b["author"], b["publisher"], b["edition"],
                b["category"], b["mrp"], b["selling_price"], b["stock_quantity"],
                1 if b["is_preowned"] else 0, b["condition_grade"], b["aisle_no"],
                b["section"], b["rack_id"], b["shelf_level"], b["cover_image"],
                sold_time.strftime("%Y-%m-%d %H:%M:%S")
            ))
            book_ids[b["title"]] = cursor.lastrowid

        # Seed Student Wallets (including user's PRN Nikita Sharad Pawar)
        wallets = [
            ("202401100018", "Nikita Sharad Pawar", "9876543210", 425.0),
            ("202401100005", "Pankaj Shinde", "9822334455", 180.0),
            ("202401100006", "Shreyash Telang", "9899887766", 0.0)
        ]
        for w in wallets:
            cursor.execute("""
            INSERT OR IGNORE INTO student_wallets (student_prn, student_name, contact, wallet_balance_inr)
            VALUES (?, ?, ?, ?)
            """, w)

        # Seed sample Buyback transaction (how Nikita earned her wallet balance)
        cursor.execute("""
        INSERT INTO buyback_transactions (
            student_prn, book_title, isbn, original_mrp, condition_grade,
            depreciation_rate, buyback_amount_inr, store_credit_issued
        ) VALUES ('202401100018', 'Higher Engineering Mathematics', '9788174091955', 850.0, 'Mint', 0.50, 425.0, 1)
        """)

        # Seed Academic Syllabus Bundles
        # Bundle 1: First Year Engineering Sem-1 Starter Kit
        cursor.execute("""
        INSERT INTO syllabus_bundles (bundle_name, course_branch, semester, discount_percent, description)
        VALUES ('FE Engineering Sem-1 Complete Starter Kit', 'First Year (Common)', 'Semester 1', 15.0,
                'Complete mandatory syllabus bundle: Maths-1, Engineering Mechanics, Basic Electrical, and Let Us C programming.')
        """)
        bundle1_id = cursor.lastrowid

        # Link FE books
        fe_titles = ["Higher Engineering Mathematics", "Basic Electrical Engineering", "Engineering Mechanics", "Let Us C"]
        for title in fe_titles:
            if title in book_ids:
                cursor.execute("INSERT INTO bundle_items (bundle_id, book_id) VALUES (?, ?)", (bundle1_id, book_ids[title]))

        # Bundle 2: Computer Engineering Sem-3 Core Kit
        cursor.execute("""
        INSERT INTO syllabus_bundles (bundle_name, course_branch, semester, discount_percent, description)
        VALUES ('Computer Engineering Sem-3 Core Kit', 'Computer Engineering', 'Semester 3', 15.0,
                'Core semester set: Operating Systems, Database Management Systems (DBMS), and Algorithms.')
        """)
        bundle2_id = cursor.lastrowid

        cse_titles = ["Operating System Concepts", "Database System Concepts", "Introduction to Algorithms (CLRS)"]
        for title in cse_titles:
            if title in book_ids:
                cursor.execute("INSERT INTO bundle_items (bundle_id, book_id) VALUES (?, ?)", (bundle2_id, book_ids[title]))

        # Seed an initial POS Order / Invoice
        cursor.execute("""
        INSERT INTO orders (invoice_no, customer_name, customer_prn, subtotal_inr, discount_inr, wallet_redeemed_inr, total_paid_inr, payment_method)
        VALUES ('INV-2026-1001', 'Nikita Sharad Pawar', '202401100018', 1210.0, 181.5, 200.0, 828.5, 'UPI')
        """)
        order_id = cursor.lastrowid

        cursor.execute("""
        INSERT INTO order_items (order_id, book_id, title, unit_price, quantity, total_price)
        VALUES (?, ?, 'Operating System Concepts', 790.0, 1, 790.0),
               (?, ?, 'Let Us C', 330.0, 1, 330.0)
        """, (order_id, book_ids.get("Operating System Concepts", 1), order_id, book_ids.get("Let Us C", 2)))

        conn.commit()

    conn.close()
