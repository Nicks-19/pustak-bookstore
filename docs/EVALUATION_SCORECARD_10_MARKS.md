# 📋 10/10 Evaluation Rubric & Codebase Mapping Guide
**Student Name:** Nikita Sharad Pawar | **PRN:** `202401100018` | **Roll No:** `A19`  
**Project Title:** Pustak – Smart Academic Bookstore & Circular Textbook Buyback Platform  
**Target Mark:** 10 / 10  

Use this guide during your individual evaluation to show your subject teacher exactly where each criterion is implemented in your code.

---

## 🏆 Criteria Breakdown (10 Marks Total)

### Criterion 1: Real-World Problem Statement & Innovation (2 Marks)
* **What the Teacher Looks For:** Is this a meaningful real-world problem or just a generic CRUD tutorial app?
* **Your Defense & Evidence:**
  * **Problem:** Campus students face heavy textbook depreciation (₹3,000–₹5,000 every 4 months); campus stores suffer 10–15 minute floor search latency and locked working capital in dormant dead stock.
  * **Novelty:** 5 distinctive features that typical batchmate projects lack:
    1. 🔄 Circular Buyback & Condition Depreciation Engine
    2. 🗺️ 2D Physical Store Shelf & Rack Navigator
    3. 📦 One-Click Academic Syllabus Bundler
    4. 📉 Dead Stock AI & Dormant Capital Liquidation
    5. 🧾 POS Dynamic Digital Invoicing with Wallet Redemption
  * **Code References:**
    * [`backend/app/routes/buyback.py`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/backend/app/routes/buyback.py)
    * [`backend/app/routes/analytics.py`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/backend/app/routes/analytics.py)
  * **Expected Mark:** **2 / 2**

---

### Criterion 2: Full-Stack Implementation & Architecture (2 Marks)
* **What the Teacher Looks For:** Clean separation of frontend, backend, and data persistence; modern engineering standards.
* **Your Defense & Evidence:**
  * **Frontend:** React 18, Vite 5, Tailwind CSS, component-driven design with reactive state hooks (`useState`, `useEffect`).
  * **Backend:** FastAPI (Python 3.12) ASGI asynchronous REST framework with automated OpenAPI 3.1 Swagger docs (`/docs`).
  * **Single-Command Execution:** `run.bat` automatically configures dependencies and runs the entire stack on `http://127.0.0.1:8000`.
  * **Code References:**
    * Frontend: [`frontend/src/App.jsx`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/frontend/src/App.jsx)
    * Backend: [`backend/app/main.py`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/backend/app/main.py)
  * **Expected Mark:** **2 / 2**

---

### Criterion 3: Relational Database Design & Normalization (2 Marks)
* **What the Teacher Looks For:** Normalized schema (3NF), foreign keys, integrity constraints, and ACID transactions.
* **Your Defense & Evidence:**
  * **Engine:** SQLite 3 relational database (`pustak.db`) requiring 0 external server configuration.
  * **Normalization:** 7 relational tables in Third Normal Form (3NF):
    * `books` (Master inventory & 4D physical coordinates)
    * `student_wallets` (Digital store credit balances)
    * `buyback_transactions` (Condition grading audit trail)
    * `syllabus_bundles` (Curriculum kits)
    * `bundle_items` (Many-to-many junction table)
    * `orders` & `order_items` (Transaction ledger)
  * **Integrity Constraints:** `PRAGMA foreign_keys = ON;`, `CHECK(mrp > 0)`, `CHECK(stock_quantity >= 0)`.
  * **Indexing:** B-Tree indexes on `isbn`, `student_prn`, `last_sold_at`.
  * **Code References:**
    * Schema Definition: [`backend/app/database.py`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/backend/app/database.py#L18-L95)
  * **Expected Mark:** **2 / 2**

---

### Criterion 4: Two-Tier Data Validation & Error Handling (2 Marks)
* **What the Teacher Looks For:** Are inputs checked on both client and server? Are edge cases prevented?
* **Your Defense & Evidence:**
  * **Client-Side (React):** Real-time ISBN regex validation (`^(97[89])?[0-9]{9}[0-9Xx]$`), positive price checks, non-negative stock guards, and disabled buttons on error.
  * **Server-Side (FastAPI & Pydantic v2):** Strongly-typed schemas (`Field(gt=0)`, `Field(ge=0)`), enum validation (`Mint`, `Good`, `Fair`, `Poor`), and wallet balance verification.
  * **Race-Condition & Overselling Protection:** Atomic transaction checks inventory availability before decrementing; rolls back on stock deficiency with HTTP 400.
  * **Code References:**
    * Schemas: [`backend/app/models.py`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/backend/app/models.py)
    * Modal Validation: [`frontend/src/components/AddBookModal.jsx`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/frontend/src/components/AddBookModal.jsx)
  * **Expected Mark:** **2 / 2**

---

### Criterion 5: Documentation & Individual Presentation/Demo (2 Marks)
* **What the Teacher Looks For:** Formal documentation PDF, deployment link, automated test results, and clear live demo.
* **Your Defense & Evidence:**
  * **Formal PDF Report:** 10-page report (`202401100018_Nikita_Sharad_Pawar_Project.pdf`) containing project problem, schema diagrams, test cases, and academic declaration.
  * **Live GitHub Deployment URL:** [https://nicks-19.github.io/pustak-bookstore/](https://nicks-19.github.io/pustak-bookstore/)
  * **Local Host:** `http://127.0.0.1:8000` (Unified FastAPI + React Build via `run.bat`)
  * **Automated Testing:** 12/12 passed integration tests (`backend/run_tests.py`).
  * **Built-in Presentation Support:** "Teacher Viva Guide 💡" modal inside the app and standalone [`presentation.html`](file:///C:/Users/NIKITA%20SHARAD%20PAWAR/.gemini/antigravity/scratch/pustak-bookstore/docs/presentation.html) slide deck.
  * **Expected Mark:** **2 / 2**

---

## 🎯 Summary Scorecard

| Assessment Dimension | Maximum Marks | Projected Marks | Proof in Codebase |
| :--- | :---: | :---: | :--- |
| **1. Problem Statement & Novelty** | 2 | **2** | 5 unique circular economy features |
| **2. Full-Stack Implementation** | 2 | **2** | React 18 + FastAPI + Vite architecture |
| **3. Database Design & 3NF** | 2 | **2** | 7 normalized tables, FK cascade, B-tree indexes |
| **4. Two-Tier Validation** | 2 | **2** | Client regex + Pydantic v2 schemas + ACID |
| **5. Documentation & Presentation** | 2 | **2** | 10-page PDF, single-command run.bat, 12/12 tests passed |
| **TOTAL** | **10** | **10 / 10** | **Full Marks Achievable** |
