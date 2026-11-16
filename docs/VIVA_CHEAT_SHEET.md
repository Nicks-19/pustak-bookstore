# 🎓 Pustak — Ultimate Viva Voce Defense Cheat Sheet
**Candidate:** Nikita Sharad Pawar | **PRN:** `202401100018` | **Roll:** `A19`  
**Project:** Pustak — Smart Academic Bookstore & Circular Textbook Buyback Platform  
**Target:** 10/10 Marks in Subject Teacher Individual Evaluation

---

## 📌 Top 12 Evaluator Questions & High-Scoring Defense Answers

### Q1: Why did you build "Pustak" instead of a standard CRUD project like an Expense Tracker or Library System?
* **Your Answer:**  
  *"Sir/Ma'am, standard projects only perform basic Create-Read-Update-Delete operations without solving any real economic or operational pain point. On our campus, students spend ₹3,000–₹5,000 every semester on reference books that sit unused after exams. Concurrently, campus stores lose money on dead inventory and students waste 10–15 minutes locating physical books. Pustak bridges this gap through a 4-tier algorithmic buyback engine, 2D shelf navigation coordinates, academic syllabus bundling, and automated dead-stock liquidation."*

---

### Q2: What is the algorithmic formula behind the Circular Buyback engine?
* **Your Answer:**  
  *"The buyback payout is calculated as: `Payout = MRP × Buyback_Ratio[condition]`.  
  Our condition matrix enforces:
  - **Mint (Like New):** 50% MRP (0.50)
  - **Good Condition:** 40% MRP (0.40)
  - **Fair / Usable:** 25% MRP (0.25)
  - **Poor / Worn:** 10% MRP (0.10)  
  The system automatically deposits this credit into the student's digital store wallet and restocks the book as pre-owned on **Rack P** at a 25–30% retail margin (`Payout × 1.25–1.30`). This generates sustainable revenue for the bookstore while giving incoming junior students heavily discounted reference material."*

---

### Q3: Why did you choose SQLite instead of MySQL or MongoDB?
* **Your Answer:**  
  *"Three technical reasons:  
  1. **Zero External Daemon Dependency:** SQLite is an embedded, serverless, self-contained relational database stored in a single file (`pustak.db`). Any evaluator can run `run.bat` and test the project with zero database server setup.  
  2. **ACID Compliance & Foreign Keys:** Unlike NoSQL document databases (like MongoDB) which lack strict multi-document relational constraints, SQLite provides full ACID transactions and relational foreign key cascading (`PRAGMA foreign_keys = ON;`).  
  3. **High Performance:** For campus store workloads (<50,000 titles), SQLite runs in-process with zero network overhead, reading queries in sub-millisecond response times."*

---

### Q4: How do you handle race conditions or overselling during POS checkout?
* **Your Answer:**  
  *"All checkout steps run inside an atomic SQLite transaction. Before updating inventory, the query checks `stock_quantity >= requested_quantity`. If inventory is insufficient, the transaction rolls back immediately and returns an HTTP 400 Bad Request error. Only after quantity is successfully decremented is the order persisted, preventing double-selling or negative stock."*

---

### Q5: How does the Physical Shelf Navigator work without hardware GPS or beacons?
* **Your Answer:**  
  *"GPS does not function reliably indoors. Pustak uses a discrete 4-dimensional spatial hierarchical coordinate system:  
  `Aisle No ➔ Departmental Section ➔ Rack Identifier ➔ Shelf Level (Eye Level / Top / Bottom)`.  
  For example: `Aisle 1 ➔ Computer Science & IT ➔ Rack B ➔ Shelf 1 (Top Shelf)`.  
  The React frontend renders an interactive 2D grid modal that visually highlights the specific aisle and rack bin, allowing store personnel or students to locate any book in under 5 seconds."*

---

### Q6: Explain your Two-Tier Validation strategy.
* **Your Answer:**  
  *"Data integrity is enforced at both client and server boundaries:  
  - **Tier 1 (Client-Side / React):** Immediate UI feedback; regex checks for 10- and 13-digit ISBNs (`^(97[89])?[0-9]{9}[0-9Xx]$`), positive numeric prices (`mrp > 0`), and non-negative integer stock (`stock >= 0`).  
  - **Tier 2 (Server-Side / Pydantic v2):** Strict schema enforcement using `Field(gt=0)`, `Field(ge=0)`, condition enums (`Mint`, `Good`, `Fair`, `Poor`), and wallet balance verification. Malformed requests are rejected with standardized HTTP 422 Unprocessable Entity responses before reaching the database."*

---

### Q7: How does the Dead Stock AI identify slow-moving inventory?
* **Your Answer:**  
  *"The analytics engine queries SQLite using the `julianday('now') - julianday(last_sold_at)` calculation.  
  - Books with **60–89 days** without sales are flagged as **Slow Moving** with a 25% discount recommendation.  
  - Books with **90+ days** without sales are flagged as **Critical Dead Stock** with a 30%–40% clearance markdown.  
  The system computes the total frozen working capital (e.g., ₹8,550 in demo data) and provides a 1-click markdown button to slash prices and recover liquidity."*

---

### Q8: What is the benefit of the One-Click Academic Syllabus Bundler?
* **Your Answer:**  
  *"College students need complete kits of semester textbooks (e.g., FE Engineering Sem-1 Kit). Scanning 5 individual books at the POS creates queue congestion. Pustak groups mandatory semester curricula into bundles linked via a many-to-many junction table (`bundle_items`). It computes aggregate MRP, applies an automated 15% curriculum discount, and adds all kit titles to the POS cart in a single click."*

---

### Q9: Why did you choose FastAPI over Flask or Django?
* **Your Answer:**  
  *"FastAPI provides three decisive advantages:  
  1. **Asynchronous Concurrency:** Built on Starlette and ASGI (Uvicorn), giving node-like async I/O performance.  
  2. **Native Pydantic v2 Integration:** Automatic type validation and serialization with zero boilerplate.  
  3. **Auto-Generated Documentation:** Automatically generates interactive Swagger UI at `/docs` and ReDoc at `/redoc` adhering to OpenAPI 3.1 standards."*

---

### Q10: How do you serve the React frontend through FastAPI?
* **Your Answer:**  
  *"The React application is compiled into static production assets (`index.html`, minified JavaScript, and CSS) using `vite build` into the `frontend/dist` directory. FastAPI mounts this directory using `StaticFiles(directory='frontend/dist')` and routes non-API traffic to `dist/index.html`. This creates a unified single-binary deployment running on port 8000."*

---

### Q11: How did you test the backend to guarantee reliability?
* **Your Answer:**  
  *"We developed an automated regression test harness in `backend/run_tests.py` covering 12 end-to-end integration test cases:  
  - Database schema & foreign key cascades  
  - Shelf coordinate breadcrumb resolution  
  - Algorithmic buyback depreciation math  
  - Student wallet crediting and debiting  
  - Reverse-logistics inventory restocking  
  - Syllabus bundle 15% discount calculation  
  - Dead stock dormancy detection (>90 days)  
  - Automated 30% clearance price slashing  
  - POS atomic checkout with digital wallet redemption  
  - Pydantic schema validation boundary checks (negative price rejection)  
  **All 12/12 tests passed with 100% success.**"*

---

### Q12: What future enhancements can be added to Pustak?
* **Your Answer:**  
  *"Three natural extensions:  
  1. **Computer Vision Cover Inspection:** Use an OpenCV module to inspect textbook cover images for creases, watermarks, and spine damage to automate grading.  
  2. **Physical Barcode Scanning PWA:** Integrate mobile camera scanning for ISBN-13 barcodes on the retail floor.  
  3. **Inter-Campus Buyback Network:** Connect student wallets across colleges so credits earned at one campus can be spent at another."*

---

## 🎯 Quick Demonstration Flow (Summary)

```
[1. Catalog Tab] ➔ Click "Locate Shelf" (Show 2D Floor Grid & 4D Coordinates)
       ↓
[2. Buyback Tab] ➔ PRN 202401100018 ➔ Mint (50%) ➔ Accept & Credit Wallet
       ↓
[3. Bundles Tab] ➔ View "FE Starter Kit" ➔ Show automated 15% discount math ➔ Add to Cart
       ↓
[4. POS Checkout] ➔ Redeem Student Store Wallet ➔ Complete & Print Thermal Invoice
       ↓
[5. Dead Stock AI] ➔ Show >90 days dormant titles (₹8,550 capital) ➔ Apply 30% Clearance
```
