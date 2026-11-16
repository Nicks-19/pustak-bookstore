import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function DeadStockDashboard({ onClearanceApplied }) {
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [rData, sData] = await Promise.all([
        api.getDeadStockReport(),
        api.getStoreSummary()
      ]);
      setReport(rData);
      setSummary(sData);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyClearance = async (bookId) => {
    try {
      const res = await api.applyClearanceDiscount(bookId);
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(''), 4000);
      loadData();
      if (onClearanceApplied) onClearanceApplied();
    } catch (err) {
      alert(err.message || 'Failed to apply clearance discount');
    }
  };

  if (!report || !summary) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            📉 Working Capital & Turnover Optimizer
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Dead Stock AI & Clearance Automation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Flags books with zero sales in the last 60+ and 90+ days. Enables automated clearance markdowns and bundle recommendations to free up shelf cash flow.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Locked-Up Working Capital:
          </span>
          <span className="font-display font-black text-2xl text-rose-600">
            ₹{report.summary.total_locked_capital_inr}
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <span>🎉 {actionMessage}</span>
        </div>
      )}

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Critical Dead Stock
          </span>
          <span className="font-display font-extrabold text-2xl text-rose-600 mt-1 block">
            {report.summary.critical_dead_stock_count} <span className="text-xs font-normal text-slate-400">titles (90+ days)</span>
          </span>
          <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Needs clearance action</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Slow Moving Inventory
          </span>
          <span className="font-display font-extrabold text-2xl text-amber-600 mt-1 block">
            {report.summary.slow_moving_count} <span className="text-xs font-normal text-slate-400">titles (60-89 days)</span>
          </span>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Bundle with bestsellers</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Pre-Owned Rescued
          </span>
          <span className="font-display font-extrabold text-2xl text-emerald-600 mt-1 block">
            {summary.preowned_books_rescued} <span className="text-xs font-normal text-slate-400">titles</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Via Circular Buyback</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Store Buyback Credit Issued
          </span>
          <span className="font-display font-extrabold text-2xl text-indigo-600 mt-1 block">
            ₹{summary.total_store_credit_issued_inr}
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">Active student wallet credit</span>
        </div>
      </div>

      {/* Critical Dead Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Dormant Shelf Titles Requiring Clearance
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by longest inactivity and locked capital value.
            </p>
          </div>
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full">
            {report.critical_dead_stock.length + report.slow_moving.length} Items Flagged
          </span>
        </div>

        {report.critical_dead_stock.length === 0 && report.slow_moving.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            🎉 Excellent inventory turnover! No dead stock detected in the system.
          </div>
        ) : (
          <div className="space-y-3">
            {[...report.critical_dead_stock, ...report.slow_moving].map((item) => (
              <div
                key={item.book_id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.days_dormant >= 90
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {item.days_dormant} Days Dormant
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{item.category}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    By {item.author} • Location: <strong className="text-indigo-700">{item.location}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Locked Capital:</span>
                    <span className="font-display font-bold text-sm text-slate-900">
                      ₹{item.locked_capital_inr} <span className="text-[10px] font-normal text-slate-500">({item.stock_quantity} units)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block">Current Price: ₹{item.selling_price}</span>
                  </div>

                  <button
                    onClick={() => handleApplyClearance(item.book_id)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs whitespace-nowrap"
                  >
                    ⚡ Apply 30% Clearance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
