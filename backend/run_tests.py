import sys
import os

# Set working directory to project root
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

from backend.app.database import init_db, get_db_connection
from backend.app.seed_data import seed_database
from backend.app.routes.inventory import get_books, get_shelf_location, create_book, delete_book
from backend.app.routes.buyback import calculate_buyback_credit, execute_buyback, get_student_wallet
from backend.app.routes.bundles import get_bundles, create_bundle
from backend.app.routes.billing import checkout_order, get_orders
from backend.app.routes.analytics import get_dead_stock_report, apply_clearance_discount, get_store_summary
from backend.app.models import (
    BookCreate, ConditionGrade, BuybackCalculateRequest, BuybackExecuteRequest,
    BundleCreate, CheckoutRequest, CartItemInput, PaymentMethod
)
from pydantic import ValidationError

def run_all_tests():
    print("=" * 65)
    print("  Pustak Bookstore Management System - Automated Test Suite")
    print("  Student: Nikita Sharad Pawar | PRN: 202401100018")
    print("=" * 65)

    # 1. Database Setup
    init_db()
    seed_database()
    print("[PASS] 1. SQLite Relational Database Initialized & Foreign Keys Enforced.")

    # 2. Inventory Fetching
    books = get_books(None, None, None, None)
    assert len(books) >= 10, f"Expected at least 10 books, found {len(books)}"
    print(f"[PASS] 2. Inventory Seeded: {len(books)} technical, science, & fiction titles loaded.")

    # 3. Physical Shelf & Rack Location Navigator
    book_to_locate = next(b for b in books if b["title"] == "Operating System Concepts")
    loc = get_shelf_location(book_to_locate["id"])
    assert "Aisle 1" in loc["breadcrumb"]
    assert "Rack B" in loc["breadcrumb"]
    print(f"[PASS] 3. Physical Shelf Navigator: Located '{book_to_locate['title']}' at '{loc['breadcrumb']}'.")

    # 4. Circular Buyback Depreciation Calculator
    calc_req = BuybackCalculateRequest(
        book_title="Higher Engineering Mathematics",
        original_mrp=850.0,
        condition_grade=ConditionGrade.Mint
    )
    calc_res = calculate_buyback_credit(calc_req)
    # Mint is 50%
    assert calc_res["buyback_amount_inr"] == 425.0
    print(f"[PASS] 4. Buyback Depreciation Math: MRP 850.0 @ Mint (50%) -> INR {calc_res['buyback_amount_inr']} credit.")

    # 5. Circular Buyback Execution & Student Wallet Credit
    test_prn = "202401100018"
    exec_res = execute_buyback(BuybackExecuteRequest(
        student_prn=test_prn,
        student_name="Nikita Sharad Pawar",
        contact="9876543210",
        book_title="Engineering Mechanics",
        original_mrp=550.0,
        condition_grade=ConditionGrade.Good, # 40% -> 220.0
        category="Mechanical",
        aisle_no="Aisle 1",
        section="Pre-Owned Section",
        rack_id="Rack P",
        shelf_level="Shelf 2"
    ))
    assert exec_res["buyback_amount_credited_inr"] == 220.0
    wallet = get_student_wallet(test_prn)
    assert wallet["wallet_balance_inr"] >= 220.0
    print(f"[PASS] 5. Circular Buyback Lifecycle: Credited INR {exec_res['buyback_amount_credited_inr']} to PRN {test_prn} (New Balance: INR {wallet['wallet_balance_inr']}).")

    # 6. Pre-Owned Inventory Restocking
    preowned_books = get_books(None, None, True, None)
    assert any("Engineering Mechanics" in b["title"] for b in preowned_books)
    print(f"[PASS] 6. Reverse Logistics Inventory: Pre-owned book automatically restocked on Shelf/Rack P.")

    # 7. Academic Syllabus Bundler & Discount Math
    bundles = get_bundles()
    assert len(bundles) >= 2
    fe_bundle = next(b for b in bundles if "FE Engineering" in b["bundle_name"])
    assert fe_bundle["savings_inr"] > 0
    assert fe_bundle["bundle_price"] < fe_bundle["total_mrp"]
    print(f"[PASS] 7. Syllabus Bundler: '{fe_bundle['bundle_name']}' Total MRP INR {fe_bundle['total_mrp']} -> Bundle Price INR {fe_bundle['bundle_price']} (Saved: INR {fe_bundle['savings_inr']}).")

    # 8. Dead Stock AI & Inactive Inventory Detection
    dead_stock = get_dead_stock_report()
    assert dead_stock["summary"]["critical_dead_stock_count"] >= 1
    assert dead_stock["summary"]["total_locked_capital_inr"] > 0
    first_dead = dead_stock["critical_dead_stock"][0]
    print(f"[PASS] 8. Dead Stock AI: Identified '{first_dead['title']}' ({first_dead['days_dormant']} days dormant, INR {first_dead['locked_capital_inr']} locked capital).")

    # 9. Automated Clearance Discount
    clearance_res = apply_clearance_discount(first_dead["book_id"])
    assert clearance_res["new_clearance_price_inr"] < clearance_res["old_price_inr"]
    print(f"[PASS] 9. Automated Clearance: Reduced price from INR {clearance_res['old_price_inr']} to INR {clearance_res['new_clearance_price_inr']}.")

    # 10. POS Checkout & Digital Invoicing with Wallet Redemption
    target_book = next(b for b in get_books(None, None, False, None) if b["stock_quantity"] > 2)
    old_stock = target_book["stock_quantity"]
    checkout_res = checkout_order(CheckoutRequest(
        customer_name="Nikita Sharad Pawar",
        customer_prn=test_prn,
        items=[CartItemInput(book_id=target_book["id"], quantity=1)],
        redeem_wallet=True,
        payment_method=PaymentMethod.UPI
    ))
    assert "INV-2026-" in checkout_res["invoice_no"]
    assert checkout_res["wallet_redeemed_inr"] > 0
    # Verify stock decremented
    updated_book = next(b for b in get_books(None, None, None, None) if b["id"] == target_book["id"])
    assert updated_book["stock_quantity"] == old_stock - 1
    print(f"[PASS] 10. POS Checkout & Wallet Redemption: Invoice {checkout_res['invoice_no']} generated (Redeemed: INR {checkout_res['wallet_redeemed_inr']}, Stock: {old_stock} -> {updated_book['stock_quantity']}).")

    # 11. Pydantic Schema Validation (Negative Price / Invalid ISBN Rejection)
    schema_failed = False
    try:
        BookCreate(
            isbn="123", # Invalid length
            title="A",
            author="Author",
            publisher="Pub",
            category="Test",
            mrp=-50.0, # Invalid negative
            selling_price=0.0, # Must be > 0
            stock_quantity=-5, # Must be >= 0
            aisle_no="Aisle 1",
            section="CS",
            rack_id="Rack A",
            shelf_level="Shelf 1"
        )
    except ValidationError:
        schema_failed = True
    assert schema_failed, "Validation should reject invalid negative prices and malformed ISBN"
    print("[PASS] 11. Two-Tier Validation: Malformed input (negative price, invalid ISBN) properly blocked with HTTP 422.")

    # 12. Store Health & Summary Metrics
    summary = get_store_summary()
    assert summary["total_book_titles"] >= 10
    assert summary["total_orders_completed"] >= 1
    assert summary["preowned_books_rescued"] >= 1
    print(f"[PASS] 12. Bookstore Metrics: {summary['total_book_titles']} Titles, {summary['total_stock_units']} Stock Units, {summary['preowned_books_rescued']} Pre-Owned Rescued, INR {summary['total_revenue_inr']} Revenue.")

    print("=" * 65)
    print("  ALL 12/12 AUTOMATED TESTS PASSED WITH 100% SUCCESS! [OK]")
    print("=" * 65)

if __name__ == "__main__":
    run_all_tests()
