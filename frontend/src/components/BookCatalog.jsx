import React, { useState } from 'react';

export default function BookCatalog({ books, onLocateShelf, onAddToCart }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [onlyPreowned, setOnlyPreowned] = useState(false);

  const categories = [
    'All Categories',
    'Computer Science',
    'Mathematics',
    'Mechanical',
    'Electrical',
    'Self-Help & General'
  ];

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !selectedCategory || selectedCategory === 'All Categories' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchPreowned = !onlyPreowned || b.is_preowned;

    return matchSearch && matchCategory && matchPreowned;
  });

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Title, Author, or ISBN-10/13 (e.g. Silberschatz, Let Us C, 9788174091955)..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Pre-owned toggle */}
          <button
            onClick={() => setOnlyPreowned(!onlyPreowned)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 whitespace-nowrap ${
              onlyPreowned
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>{onlyPreowned ? '✓' : '🔄'}</span>
            <span>Pre-Owned Buyback Books ({books.filter(b => b.is_preowned).length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => {
            const isSelected = (!selectedCategory && cat === 'All Categories') || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All Categories' ? '' : cat)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Book Inventory ({filteredBooks.length} titles)
          </span>
          <span className="text-xs text-slate-400">
            Click "📍 Locate Shelf" for indoor aisle navigation
          </span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            No matching books found. Try clearing your search query or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const discountPct = Math.round(((book.mrp - book.selling_price) / book.mrp) * 100);

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Image & Badge */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={book.cover_image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Pre-owned Badge / Condition */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {book.is_preowned ? (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                          🔄 Pre-Owned ({book.condition_grade})
                        </span>
                      ) : (
                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                          ✨ Brand New
                        </span>
                      )}
                      <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        {book.category}
                      </span>
                    </div>

                    {/* Stock status */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                        book.stock_quantity > 5
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : book.stock_quantity > 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {book.stock_quantity > 0 ? `${book.stock_quantity} in stock` : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-display font-bold text-base leading-tight drop-shadow-sm line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        By {book.author} • {book.edition}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Physical Shelf Coordinates Highlight */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 text-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Store Shelf Location:
                          </span>
                          <span className="font-semibold text-slate-800 text-[11px]">
                            {book.aisle_no} ➔ {book.rack_id} ({book.shelf_level})
                          </span>
                        </div>
                        <button
                          onClick={() => onLocateShelf(book)}
                          className="text-[10px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg transition shadow-2xs whitespace-nowrap"
                        >
                          📍 Map View
                        </button>
                      </div>

                      {/* Pricing Bar */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-display font-extrabold text-lg text-slate-900">
                          ₹{book.selling_price}
                        </span>
                        {discountPct > 0 && (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{book.mrp}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              {discountPct}% OFF
                            </span>
                          </>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto font-mono">
                          ISBN: {book.isbn.slice(-6)}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => onAddToCart(book)}
                      disabled={book.stock_quantity <= 0}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold py-2 px-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add to POS Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
