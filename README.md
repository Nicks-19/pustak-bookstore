# Pustak — Smart Academic Bookstore & Circular Inventory Management Platform

**Student Name:** Nikita Sharad Pawar  
**PRN:** `202401100018` | **Roll No:** `A19`  
**Course:** Full-Stack Mini Project (Total Marks: 10)  
**Live GitHub Deployment:** [https://nicks-19.github.io/pustak-bookstore/](https://nicks-19.github.io/pustak-bookstore/)  
**Local Application Host:** `http://127.0.0.1:8000` (Unified FastAPI + React Build)  
**Interactive API Documentation:** `http://127.0.0.1:8000/docs`

---

## 📖 1. Problem Statement & Motivation
Campus students routinely face high semester textbook costs (₹3,000–₹5,000 every 4 months), while seniors have idle textbooks with no seamless recycling platform. Concurrently, physical campus bookstores struggle with:
1. **Floor Search Latency:** Customers wander aisles for 10+ minutes searching for specific titles and editions.
2. **Dormant Dead Stock:** 20–35% of working capital sits locked in slow-moving inventory with zero automated markdown strategy.
3. **Friction in Syllabus Purchasing:** Students have to hunt down 4–6 individual reference books semester after semester.

**Pustak** solves these real-world campus challenges by combining **circular textbook buyback**, **2D coordinate-based physical rack navigation**, **automated syllabus bundles**, and **dead-stock liquidation analytics** into a single cohesive full-stack web application.

---

## 🚀 2. Five Unique, High-Scoring Features

### 1. 🔄 Circular Buyback & Textbook Depreciation Engine
* Evaluates used textbooks across 4 algorithmic condition tiers:
  * **Mint (50% MRP Buyback):** Flawless pages, undamaged spine.
  * **Good (40% MRP Buyback):** Minor pencil notes, intact binding.
  * **Fair (25% MRP Buyback):** Dog-eared pages, moderate notes.
  * **Poor (10% MRP Buyback):** Worn cover, readable reference.
* Instantly credits buyback earnings directly into the student's digital store wallet.
* Automatically creates a pre-owned inventory record tagged to physical **Rack P (Pre-Owned)** at a discounted student price (`buyback * 1.25–1.30`).

### 2. 🗺️ Physical Store Shelf & Rack Navigator
* Every book record maintains 4D spatial floor coordinates:  
  `Aisle No` ➔ `Section` ➔ `Rack ID` ➔ `Shelf Level (Eye Level / Top / Bottom)`.
* Visualized via an interactive 2D floor grid modal, reducing customer search latency to under 5 seconds.

### 3. 📦 One-Click Academic Syllabus Bundler
* Bundles all mandatory textbooks for engineering semesters (e.g., *Computer Engineering Sem-3 Kit*, *FE Engineering Sem-1 Starter Kit*).
* Applies an automated 15% curriculum discount.
* Adds all kit books to the POS checkout with a single click.

### 4. 📉 Dead Stock AI & Clearance Automation
* Analytics engine detects books with zero sales in the past 60 or 90 days.
* Computes locked-up working capital across dormant titles.
* One-click clearance markdown action dynamically slashes prices by 30–40% to stimulate cash flow.

### 5. 🏷️ Fast POS Checkout & Dynamic Digital Invoicing
* Validates ISBN-10 / ISBN-13 format.
* Seamlessly redeems student store wallet credit during checkout.
* Decrements physical stock in ACID-compliant transactions.
* Generates an itemized thermal-style digital receipt with unique invoice numbers (`INV-2026-XXXXXX`) and verification QR codes.

---

## 💻 3. Technology Stack Architecture

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS | High-performance SPA with instant component reactivity and modern UI. |
| **Backend** | FastAPI (Python 3.12), Uvicorn | Asynchronous, typed REST API adhering to OpenAPI 3.1 standards. |
| **Data Validation** | Pydantic v2 | Strict client/server validation, field constraints, and custom regex sanitizers. |
| **Database** | SQLite 3 | Relational database with Foreign Key cascading, PRAGMA optimizations, and B-Tree indexing. |
| **Icons & Typography**| Lucide Icons, Plus Jakarta Sans, JetBrains Mono | Clean visual design system suitable for commercial academic retail. |

---

## 🗄️ 4. Normalized Relational Database Schema (3NF)

The database schema (`pustak.db`) consists of 7 normalized tables:
1. `books`: Master inventory storing ISBN, title, author, MRP, selling price, stock quantity, condition grade, pre-owned flag, and physical shelf coordinates (`aisle_no`, `section`, `rack_id`, `shelf_level`, `last_sold_at`).
2. `student_wallets`: Student digital credit balances keyed by `student_prn` (e.g., `202401100018`).
3. `buyback_transactions`: Complete audit log of condition grading, original MRP, depreciation rate, and store credit payout.
4. `syllabus_bundles`: Academic kit definitions with course, semester, and discount percentage.
5. `bundle_items`: Many-to-many junction table mapping books to academic syllabus bundles.
6. `orders`: POS transactions storing invoice numbers, customer PRN, subtotal, wallet credit redeemed, total paid, and payment method.
7. `order_items`: Line-item breakdown of books, unit selling prices, and quantities per order.

---

## 🛡️ 5. Two-Tier Validation Strategy

* **Tier 1 (Client-Side / React):**
  * Real-time ISBN format validation (regex matching 10/13 digit standards).
  * Positive price constraints (`mrp > 0`, `selling_price > 0`).
  * Stock quantity non-negative integer check.
  * Immediate feedback and disabled action buttons for malformed inputs.
* **Tier 2 (Server-Side / Pydantic v2):**
  * Strict typed schemas (`Field(gt=0)`, `Field(ge=0)`).
  * Enum enforcement for book condition (`Mint`, `Good`, `Fair`, `Poor`, `New`).
  * Database-level `CHECK(mrp > 0)` and `CHECK(stock_quantity >= 0)` constraints.
  * Invariant checks preventing wallet redemptions exceeding invoice subtotal or wallet balance.

---

## 🧪 6. Automated Test Suite (12/12 Passed)

Run the automated test suite with:
```bash
python backend/run_tests.py
```

### Test Results Summary:
* `[PASS] 1. SQLite Relational Database Initialized & Foreign Keys Enforced.`
* `[PASS] 2. Inventory Seeded: 12 technical, science, & fiction titles loaded.`
* `[PASS] 3. Physical Shelf Navigator: Located 'Operating System Concepts' at 'Aisle 1 -> Computer Science & IT -> Rack B -> Shelf 1 (Top Shelf)'.`
* `[PASS] 4. Buyback Depreciation Math: MRP 850.0 @ Mint (50%) -> INR 425.0 credit.`
* `[PASS] 5. Circular Buyback Lifecycle: Credited INR 220.0 to PRN 202401100018 (New Balance: INR 645.0).`
* `[PASS] 6. Reverse Logistics Inventory: Pre-owned book automatically restocked on Shelf/Rack P.`
* `[PASS] 7. Syllabus Bundler: 'FE Engineering Sem-1 Complete Starter Kit' Total MRP INR 2045.0 -> Bundle Price INR 1738.25 (Saved: INR 306.75).`
* `[PASS] 8. Dead Stock AI: Identified 'Advanced Engineering Thermodynamics' (109 days dormant, INR 8550.0 locked capital).`
* `[PASS] 9. Automated Clearance: Reduced price from INR 950.0 to INR 665.0.`
* `[PASS] 10. POS Checkout & Wallet Redemption: Invoice generated (Redeemed: INR 645.0, Stock updated).`
* `[PASS] 11. Two-Tier Validation: Malformed input (negative price, invalid ISBN) properly blocked with HTTP 422.`
* `[PASS] 12. Bookstore Metrics: 13 Titles, 164 Stock Units, 2 Pre-Owned Rescued, INR 848.5 Revenue.`

---

## ⚡ 7. How to Run Locally

### Method A: Single-Click Launcher (Windows)
Double-click `run.bat` in the project root. It will install Python requirements and automatically launch the application in your browser at `http://127.0.0.1:8000`.

### Method B: Manual Execution
```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Start the backend server (serves both API & built React frontend)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

# 3. Open browser at:
http://127.0.0.1:8000
```

---

## 🎓 8. Quick 2-Minute Viva Walkthrough for Subject Teacher

1. **Step 1:** Open `Catalog`. Click **"Locate Shelf"** on any technical book to demonstrate the 2D coordinate floor map (`Aisle ➔ Section ➔ Rack ➔ Shelf`).
2. **Step 2:** Switch to **"Circular Buyback"**. Enter PRN `202401100018`, select a book condition (Mint 50%), and click **"Accept & Credit Wallet"**. Show the instant wallet balance increase and pre-owned book restocking on Rack P.
3. **Step 3:** Switch to **"Syllabus Kits"**. Click **"Add Bundle to Cart"** on the *FE Engineering Kit* to show automated 15% discount calculation.
4. **Step 4:** Switch to **"POS Checkout"**. Enter PRN `202401100018`, toggle **"Redeem Store Credit"**, and complete checkout. Show the digital thermal invoice with QR code.
5. **Step 5:** Switch to **"Dead Stock AI"**. Show how dormant inventory (>90 days) is detected with locked capital calculation, and apply the 1-click clearance markdown.
