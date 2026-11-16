import React, { useState } from 'react';

export default function PresentationHelper({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState('script');

  const sections = [
    { id: 'script', label: '⏱️ 2-Min Demo Script' },
    { id: 'problem', label: '🎯 Problem Statement' },
    { id: 'features', label: '🚀 5 Unique Features' },
    { id: 'tech', label: '💻 Tech Stack' },
    { id: 'database', label: '🗄️ Database (7 Tables)' },
    { id: 'validation', label: '🛡️ Two-Tier Validation' },
    { id: 'viva', label: '🎓 Viva Questions & Answers' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-white/20 rounded-xl">🎓</span>
            <div>
              <h2 className="text-xl font-bold font-serif">Project Presentation & Viva Helper</h2>
              <p className="text-xs text-amber-100">
                Prepared for Nikita Sharad Pawar (PRN: 202401100018) • Subject Teacher Demo Guide (10/10 Marks)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto scrollbar-none gap-2 py-2">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeSection === s.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-4">
          
          {/* SECTION: 2-MINUTE DEMO SCRIPT */}
          {activeSection === 'script' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-xl">
                <h3 className="font-bold text-amber-900 text-sm">Follow this exact step-by-step walkthrough during your viva:</h3>
                <p className="text-xs text-amber-700 mt-1">Total time: 2 minutes. Demonstrates frontend, backend, database persistence, and algorithmic logic.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-amber-400 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-600 text-white rounded">STEP 1</span>
                    <h4 className="font-semibold text-sm text-slate-900">Show Catalog & Physical Shelf Navigation</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Open <strong>Catalog</strong> tab. Click <strong>"Locate Shelf"</strong> on CLRS or Operating Systems. 
                    Say: <em>"Unlike generic bookstore apps, Pustak guides the buyer directly to Aisle 1, Rack A, Shelf 2 using a 2D floor grid."</em>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-amber-400 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-600 text-white rounded">STEP 2</span>
                    <h4 className="font-semibold text-sm text-slate-900">Execute Circular Buyback & Digital Wallet</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Go to <strong>Circular Buyback</strong> tab. Select student <strong>202401100018</strong>. Pick a book (e.g., Engineering Mathematics, MRP ₹580) and set condition to <strong>Mint (50%)</strong>. 
                    Click <strong>"Accept & Credit Wallet"</strong>. Point out how ₹290 is instantly deposited into student wallet, and a pre-owned copy is dynamically restocked in inventory at ₹348!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-amber-400 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-600 text-white rounded">STEP 3</span>
                    <h4 className="font-semibold text-sm text-slate-900">1-Click Academic Syllabus Bundler</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Click <strong>Syllabus Bundles</strong> tab. Show the "Computer Engineering - Sem 3 Essential Kit". 
                    Show the teacher: <em>"Instead of scanning 4 individual books, 1-click adds all required textbooks with an automated 15% curriculum discount."</em>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-amber-400 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-600 text-white rounded">STEP 4</span>
                    <h4 className="font-semibold text-sm text-slate-900">POS Checkout with Wallet Redemption</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Go to <strong>POS Billing</strong>. Enter student PRN <strong>202401100018</strong>. Toggle <strong>"Redeem Store Credit"</strong>. 
                    Click <strong>"Complete & Print Invoice"</strong>. Show the thermal invoice with QR code and updated wallet balance.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-amber-400 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-600 text-white rounded">STEP 5</span>
                    <h4 className="font-semibold text-sm text-slate-900">Dead Stock AI & Clearance Automation</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Open <strong>Dead Stock AI</strong> tab. Show how the engine identifies inventory sitting dormant for &gt;60 or &gt;90 days, calculates locked working capital (₹3,560), and offers a 1-click 30% clearance discount markdown.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PROBLEM STATEMENT */}
          {activeSection === 'problem' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">1. Problem Statement & Motivation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional campus and retail bookstore management systems suffer from three critical bottlenecks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="text-lg mb-1">💸 High Semester Book Cost</div>
                  <p className="text-xs text-red-900 font-medium">Students spend thousands every semester on reference books that sit idle after 4 months. No formal buyback recycling mechanism exists.</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-lg mb-1">⏱️ Floor Search Latency</div>
                  <p className="text-xs text-amber-900 font-medium">Physical campus stores store thousands of titles; students and staff spend 10-15 minutes wandering aisles searching for books.</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="text-lg mb-1">📉 Unsold Dead Stock</div>
                  <p className="text-xs text-blue-900 font-medium">Store managers lock up 25-35% of working capital in slow-moving titles with zero predictive clearance strategy.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wide">Pustak's Engineering Solution</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  <strong>Pustak</strong> integrates a circular economy depreciation engine, 2D coordinate-based physical rack navigation, academic syllabus bundling, and automated dead-stock liquidation into a single modern full-stack web application.
                </p>
              </div>
            </div>
          )}

          {/* SECTION: 5 UNIQUE FEATURES */}
          {activeSection === 'features' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">2. Five Novel, Differentiating Features</h3>
              
              <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">1. 🔄 Circular Buyback & Algorithmic Depreciation</span>
                  <span className="text-[10px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Core Innovation</span>
                </div>
                <p className="text-xs text-slate-600">
                  Calculates instant cash credit based on book condition: <strong>Mint (50%)</strong>, <strong>Good (40%)</strong>, <strong>Fair (25%)</strong>, <strong>Poor (10%)</strong>. 
                  Automatically credits the student's digital wallet and injects the book back into store inventory as pre-owned at an affordable student rate.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">2. 🗺️ Physical Store Shelf & Rack Navigator</span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">In-Store UX</span>
                </div>
                <p className="text-xs text-slate-600">
                  Stores 4D physical coordinates for every book: <code>Aisle ➔ Section ➔ Rack ➔ Shelf Level</code>. 
                  Visualized on an interactive store floor plan so staff and students find books in &lt;5 seconds.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">3. 📦 One-Click Academic Syllabus Bundler</span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Semester Kits</span>
                </div>
                <p className="text-xs text-slate-600">
                  Groups full semester curricula (e.g., Computer Engineering Sem-3 Kit) with auto-calculated 15% discount math and 1-click cart addition.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">4. 📉 Dead Stock AI & Clearance Automation</span>
                  <span className="text-[10px] font-mono bg-rose-100 text-rose-700 px-2 py-0.5 rounded">Analytics</span>
                </div>
                <p className="text-xs text-slate-600">
                  Detects dormant inventory with zero sales in 60 or 90 days. Computes locked working capital and allows instant 1-click 30% clearance price slash.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">5. 🧾 Fast ISBN Auto-Lookup & Dynamic Digital Receipt</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">POS Checkout</span>
                </div>
                <p className="text-xs text-slate-600">
                  Fast ISBN validation, real-time wallet credit redemption at checkout, and generates a printable paperless invoice with QR verification code.
                </p>
              </div>
            </div>
          )}

          {/* SECTION: TECH STACK */}
          {activeSection === 'tech' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">3. Full-Stack Technology Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Frontend Layer</h4>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    <li><strong>React 18 + Vite:</strong> Ultra-fast component rendering and HMR</li>
                    <li><strong>Tailwind CSS:</strong> Responsive utility-first design system</li>
                    <li><strong>Lucide Icons & Fonts:</strong> Plus Jakarta Sans & JetBrains Mono</li>
                    <li><strong>State Management:</strong> Native React hooks & resilient local caching</li>
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Backend & Persistence Layer</h4>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    <li><strong>FastAPI (Python 3.12):</strong> High-performance asynchronous REST API</li>
                    <li><strong>Pydantic v2:</strong> Strict schema validation & type coercion</li>
                    <li><strong>SQLite 3:</strong> Zero-configuration relational database with FK cascade</li>
                    <li><strong>Uvicorn:</strong> ASGI production-ready web server</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: DATABASE SCHEMA */}
          {activeSection === 'database' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">4. Normalized Relational Database Schema</h3>
              <p className="text-xs text-slate-600">
                Pustak implements 7 third-normal-form (3NF) relational tables with foreign keys and index optimization:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="font-bold text-slate-900">1. books</div>
                  <div className="text-[11px] text-slate-600">id, isbn, title, author, category, price, stock, is_preowned, condition, aisle, section, rack, shelf_level, days_in_stock</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="font-bold text-slate-900">2. student_wallets</div>
                  <div className="text-[11px] text-slate-600">student_prn (PK), student_name, email, wallet_balance, updated_at</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="font-bold text-slate-900">3. buyback_transactions</div>
                  <div className="text-[11px] text-slate-600">id, student_prn (FK), original_book_id, condition_grade, mrp, credit_percentage, credit_amount, created_at</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="font-bold text-slate-900">4. syllabus_bundles</div>
                  <div className="text-[11px] text-slate-600">id, name, course, semester, discount_percent, is_active</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="font-bold text-slate-900">5. bundle_items</div>
                  <div className="text-[11px] text-slate-600">id, bundle_id (FK), book_id (FK)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="font-bold text-slate-900">6. orders & 7. order_items</div>
                  <div className="text-[11px] text-slate-600">order_number, student_prn, subtotal, discount, wallet_redeemed, total, payment_method</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: TWO-TIER VALIDATION */}
          {activeSection === 'validation' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">5. Two-Tier Validation Strategy</h3>
              <p className="text-xs text-slate-600">
                Data integrity is protected at both client and server boundaries:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-1">Tier 1: Client-Side (React)</h4>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    <li>ISBN regex check: <code>^(97[89])?[0-9]&#123;9&#125;[0-9Xx]$</code></li>
                    <li>Stock non-negative integer guard</li>
                    <li>Price &gt; 0 numeric checks</li>
                    <li>Immediate UI error hints & disabled submit state</li>
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-1">Tier 2: Server-Side (FastAPI & Pydantic)</h4>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    <li>Pydantic v2 schemas: <code>Field(gt=0)</code>, <code>Field(ge=0)</code></li>
                    <li>Condition enum validation: <code>MINT | GOOD | FAIR | POOR</code></li>
                    <li>Student wallet sufficient balance validation</li>
                    <li>Stock availability check prior to order persistence</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: VIVA QUESTIONS */}
          {activeSection === 'viva' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">6. Common Viva Questions & Model Answers</h3>
              
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Q1: How does the Buyback Depreciation formula work?</h4>
                <p className="text-xs text-slate-600">
                  <strong>Answer:</strong> <code>credit = mrp * rate</code> where rate is derived from an algorithmic matrix: Mint = 50%, Good = 40%, Fair = 25%, Poor = 10%. The calculated credit is credited directly to the student's digital wallet, and the book is restocked at <code>credit * 1.20</code> as pre-owned inventory.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Q2: Why use SQLite instead of MySQL or MongoDB for this system?</h4>
                <p className="text-xs text-slate-600">
                  <strong>Answer:</strong> SQLite is an embedded ACID-compliant relational engine requiring zero network latency and zero external server configuration. It guarantees portable 1-click execution for college evaluation while enforcing foreign keys, constraints, and B-Tree indexes.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Q3: How does the Physical Shelf Navigator work without GPS?</h4>
                <p className="text-xs text-slate-600">
                  <strong>Answer:</strong> Indoor retail navigation uses structured discrete coordinate addressing: Aisle (1 to 4) ➔ Section ➔ Rack (A/B/C) ➔ Shelf Level (1 to 4). The frontend translates these spatial coordinates into visual grid highlights on a floor map canvas.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Q4: How do you prevent overselling or race conditions during checkout?</h4>
                <p className="text-xs text-slate-600">
                  <strong>Answer:</strong> Stock is verified and atomically decremented inside an ACID transaction. If quantity falls below the requested count, the transaction rolls back with an HTTP 400 Insufficient Stock response.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Candidate: Nikita Pawar | Roll: A19 | PRN: 202401100018
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all"
          >
            Close Viva Guide
          </button>
        </div>

      </div>
    </div>
  );
}
