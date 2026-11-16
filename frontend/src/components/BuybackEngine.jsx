import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BuybackEngine({ onBuybackCompleted, defaultPrn = "202401100018" }) {
  const [studentPrn, setStudentPrn] = useState(defaultPrn);
  const [studentName, setStudentName] = useState('Nikita Sharad Pawar');
  const [contact, setContact] = useState('9876543210');
  const [bookTitle, setBookTitle] = useState('Higher Engineering Mathematics');
  const [isbn, setIsbn] = useState('9788174091955');
  const [mrp, setMrp] = useState(850);
  const [conditionGrade, setConditionGrade] = useState('Mint');

  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  // Condition options
  const conditions = [
    { grade: 'Mint', pct: 50, label: '🌟 Mint / Like New', desc: 'No pencil marks, crisp pages, solid binding (50% Buyback)' },
    { grade: 'Good', pct: 40, label: '👍 Good Condition', desc: 'Minor highlighting, solid spine, clean cover (40% Buyback)' },
    { grade: 'Fair', pct: 25, label: '📖 Fair / Usable', desc: 'Dog-eared pages, moderate pencil notes (25% Buyback)' },
    { grade: 'Poor', pct: 10, label: '⚠️ Worn / Poor', desc: 'Damaged spine, readable, recycled stock (10% Buyback)' }
  ];

  const selectedConfig = conditions.find(c => c.grade === conditionGrade) || conditions[0];
  const calculatedCredit = Math.round(mrp * (selectedConfig.pct / 100));
  const suggestedResale = Math.round(calculatedCredit * 1.30);

  // Fetch student wallet info
  const loadWallet = async (prn) => {
    if (!prn) return;
    try {
      const data = await api.getStudentWallet(prn);
      setWallet(data);
    } catch (err) {
      setWallet(null);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await api.getBuybackHistory();
      setHistory(data);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    loadWallet(studentPrn);
    loadHistory();
  }, [studentPrn]);

  const handleExecuteBuyback = async (e) => {
    e.preventDefault();
    if (!bookTitle || mrp <= 0 || !studentPrn) {
      alert('Please provide student PRN, book title, and valid MRP');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        student_prn: studentPrn.trim(),
        student_name: studentName.trim() || 'Student',
        contact: contact.trim() || '9876543210',
        book_title: bookTitle.trim(),
        isbn: isbn.trim(),
        original_mrp: Number(mrp),
        condition_grade: conditionGrade,
        category: 'Engineering Textbook',
        aisle_no: 'Aisle 1',
        section: 'Pre-Owned Section',
        rack_id: 'Rack P',
        shelf_level: 'Shelf 2 (Pre-Owned)'
      };

      const res = await api.executeBuyback(payload);
      setNotification(`🎉 Credited ₹${res.buyback_amount_credited_inr} to ${studentName}'s wallet! Pre-owned book added to Shelf/Rack P.`);
      setTimeout(() => setNotification(''), 4000);

      loadWallet(studentPrn);
      loadHistory();
      if (onBuybackCompleted) onBuybackCompleted();
    } catch (err) {
      alert(err.message || 'Buyback failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillSampleBuyback = (type) => {
    if (type === 'maths') {
      setBookTitle('Higher Engineering Mathematics (Dr. B.S. Grewal)');
      setMrp(850);
      setConditionGrade('Mint');
    } else if (type === 'os') {
      setBookTitle('Operating System Concepts (Silberschatz)');
      setMrp(925);
      setConditionGrade('Good');
    } else if (type === 'c') {
      setBookTitle('Let Us C (Yashavant Kanetkar)');
      setMrp(395);
      setConditionGrade('Good');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>🔄 Circular Economy & Reverse Logistics</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            Textbook Buyback & Depreciation Engine
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Students return completed semester textbooks. The system algorithmically calculates fair buyback store credit based on physical condition, deposits it into the student's digital wallet, and restocks pre-owned inventory.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="text-emerald-300/80 mr-1 self-center">Demo Presets:</span>
            <button onClick={() => fillSampleBuyback('maths')} className="bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-full">
              📚 B.S. Grewal (Mint 50%)
            </button>
            <button onClick={() => fillSampleBuyback('os')} className="bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-full">
              💻 Silberschatz OS (Good 40%)
            </button>
            <button onClick={() => fillSampleBuyback('c')} className="bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-full">
              ⚡ Let Us C (Good 40%)
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Buyback Terminal + Student Wallet Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Buyback Processing Terminal (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="font-display font-bold text-base text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Process Textbook Buyback Return</span>
            <span className="text-[11px] font-normal text-slate-400 font-mono">POS Reverse Module</span>
          </h3>

          <form onSubmit={handleExecuteBuyback} className="space-y-4">
            
            {/* Student Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student PRN *</label>
                <input
                  type="text"
                  value={studentPrn}
                  onChange={(e) => setStudentPrn(e.target.value)}
                  placeholder="e.g. 202401100018"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Book Title Returning *</label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g. Higher Engineering Mathematics"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Original MRP (₹) *</label>
                <input
                  type="number"
                  min="50"
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none font-bold"
                />
              </div>
            </div>

            {/* Physical Condition Grading Cards (Algorithmic Multiplier) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Physical Book Condition Grade (Depreciation Engine):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {conditions.map((c) => {
                  const isSelected = conditionGrade === c.grade;
                  return (
                    <div
                      key={c.grade}
                      onClick={() => setConditionGrade(c.grade)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                          {c.label}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {c.pct}% Credit
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Calculated Store Credit Payout
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-display font-black text-2xl text-emerald-400">
                    ₹{calculatedCredit}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({selectedConfig.pct}% of ₹{mrp})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Next Student Resale Price: ₹{suggestedResale} on Pre-Owned Rack P
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition shadow-md whitespace-nowrap"
              >
                {submitting ? 'Executing Buyback...' : '✓ Issue Credit to Student Wallet'}
              </button>
            </div>

          </form>
        </div>

        {/* Student Wallet Status & History (1 Col) */}
        <div className="space-y-4">
          {/* Wallet Balance Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Digital Store Credit Wallet
            </span>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="font-display font-extrabold text-2xl text-slate-900">
                  ₹{wallet ? wallet.wallet_balance_inr : 0.0}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  PRN: {studentPrn || 'Enter PRN'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
                💳
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
              💡 Store credit can be automatically redeemed during POS checkout for new semester books.
            </p>
          </div>

          {/* Recent Buybacks List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 mb-3">
              Recent Store Buybacks ({history.length})
            </h4>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No buybacks executed yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {history.slice(0, 6).map((item) => (
                  <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span className="line-clamp-1">{item.book_title}</span>
                      <span className="text-emerald-700 font-bold ml-2 whitespace-nowrap">+₹{item.buyback_amount_inr}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>PRN: {item.student_prn}</span>
                      <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">{item.condition_grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
