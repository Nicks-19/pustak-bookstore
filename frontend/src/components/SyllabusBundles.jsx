import React from 'react';

export default function SyllabusBundles({ bundles, onAddBundleToCart, onLocateShelf }) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            📦 Pre-Packaged Academic Curriculum Sets
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            One-Click Academic Syllabus Bundler
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for college students: bundle all mandatory semester textbooks into a single kit with an automated 15% discount and 1-click POS billing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            ⚡ 15% Flat Kit Savings
          </span>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {bundle.course_branch}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {bundle.semester}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                    {bundle.bundle_name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {bundle.discount_percent}% Kit Discount
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {bundle.description}
              </p>

              {/* Included Books List */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Included Textbooks ({bundle.books.length} Books):
                </span>
                <div className="space-y-1.5">
                  {bundle.books.map((b) => (
                    <div
                      key={b.id}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-100 flex items-center justify-between text-xs transition"
                    >
                      <div className="pr-2">
                        <span className="font-semibold text-slate-800 block line-clamp-1">{b.title}</span>
                        <span className="text-[10px] text-slate-400">By {b.author} • {b.aisle_no} ({b.rack_id})</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-700">₹{b.selling_price}</span>
                        <button
                          onClick={() => onLocateShelf(b)}
                          className="block text-[9px] font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          📍 Shelf
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing & Checkout Footer */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Total Individual MRP:</span>
                  <span className="line-through text-slate-400 font-semibold">₹{bundle.total_mrp}</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    You Save: ₹{bundle.savings_inr}
                  </span>
                  <span className="font-display font-extrabold text-2xl text-slate-900">
                    ₹{bundle.bundle_price}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onAddBundleToCart(bundle)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>📦 Add Complete Syllabus Kit to Cart</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
