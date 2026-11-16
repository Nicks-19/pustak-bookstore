import React, { useState } from 'react';

export default function AddBookModal({ isOpen, onClose, onBookAdded }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    isbn: '9780134685991',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    publisher: 'Addison-Wesley',
    edition: '3rd Edition',
    category: 'Computer Science',
    mrp: 899,
    selling_price: 749,
    stock_quantity: 12,
    is_preowned: false,
    condition_grade: 'New',
    aisle_no: 'Aisle 1',
    section: 'Computer Science & IT',
    rack_id: 'Rack B',
    shelf_level: 'Shelf 2 (Eye Level)',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    const cleanIsbn = formData.isbn.replace(/-/g, '').replace(/\s/g, '').trim();

    if (!cleanIsbn || (cleanIsbn.length !== 10 && cleanIsbn.length !== 13)) {
      errs.isbn = 'ISBN must be exactly 10 or 13 digits.';
    }

    if (!formData.title.trim() || formData.title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters.';
    }

    if (!formData.author.trim()) {
      errs.author = 'Author name is required.';
    }

    if (formData.mrp <= 0) {
      errs.mrp = 'MRP must be greater than 0.';
    }

    if (formData.selling_price <= 0) {
      errs.selling_price = 'Selling price must be greater than 0.';
    }

    if (formData.stock_quantity < 0) {
      errs.stock_quantity = 'Stock quantity cannot be negative.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onBookAdded({
        ...formData,
        mrp: Number(formData.mrp),
        selling_price: Number(formData.selling_price),
        stock_quantity: Number(formData.stock_quantity)
      });
      onClose();
    } catch (err) {
      setErrors({ server: err.message || 'Failed to add book' });
    } finally {
      setSubmitting(false);
    }
  };

  const fillSampleData = () => {
    setFormData({
      isbn: '9780134685991',
      title: 'Effective Java (Best Practices)',
      author: 'Joshua Bloch',
      publisher: 'Pearson Professional',
      edition: '3rd Edition',
      category: 'Computer Science',
      mrp: 899,
      selling_price: 749,
      stock_quantity: 10,
      is_preowned: false,
      condition_grade: 'New',
      aisle_no: 'Aisle 1',
      section: 'Computer Science & IT',
      rack_id: 'Rack B',
      shelf_level: 'Shelf 2 (Eye Level)',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display font-bold text-lg">Add New Book Title & Coordinates</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Client & server validation active: ISBN format, positive pricing, and shelf mapping.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillSampleData}
              className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs px-3 py-1.5 rounded-lg transition"
            >
              Fill Sample Data
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
          </div>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          
          {errors.server && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl font-semibold">
              ⚠️ Server validation error: {errors.server}
            </div>
          )}

          {/* ISBN & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ISBN (10/13 digits) *</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="e.g. 9780132350884"
                className={`w-full bg-slate-50 border ${errors.isbn ? 'border-rose-500 bg-rose-50' : 'border-slate-300'} rounded-xl px-3 py-2 font-mono outline-none`}
              />
              {errors.isbn && <p className="text-[10px] text-rose-600 mt-1">{errors.isbn}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Book Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full bg-slate-50 border ${errors.title ? 'border-rose-500 bg-rose-50' : 'border-slate-300'} rounded-xl px-3 py-2 outline-none`}
              />
              {errors.title && <p className="text-[10px] text-rose-600 mt-1">{errors.title}</p>}
            </div>
          </div>

          {/* Author, Publisher, Edition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
              />
              {errors.author && <p className="text-[10px] text-rose-600 mt-1">{errors.author}</p>}
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
              >
                <option value="Computer Science">Computer Science & IT</option>
                <option value="Mathematics">Basic Sciences & Mathematics</option>
                <option value="Mechanical">Mechanical & Civil</option>
                <option value="Electrical">Electrical & Electronics</option>
                <option value="Self-Help & General">Self-Help & General</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
              <input
                type="number"
                min="1"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
              />
              {errors.mrp && <p className="text-[10px] text-rose-600 mt-1">{errors.mrp}</p>}
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                min="1"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-bold"
              />
              {errors.selling_price && <p className="text-[10px] text-rose-600 mt-1">{errors.selling_price}</p>}
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Stock Units *</label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Physical Coordinates (Shelf Navigator Mapping) */}
          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Physical Store Shelf Mapping:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Aisle</label>
                <select
                  value={formData.aisle_no}
                  onChange={(e) => setFormData({ ...formData, aisle_no: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs outline-none"
                >
                  <option value="Aisle 1">Aisle 1 (Tech & Maths)</option>
                  <option value="Aisle 2">Aisle 2 (Core Engg)</option>
                  <option value="Aisle 3">Aisle 3 (General)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rack ID</label>
                <select
                  value={formData.rack_id}
                  onChange={(e) => setFormData({ ...formData, rack_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs outline-none"
                >
                  <option value="Rack A">Rack A</option>
                  <option value="Rack B">Rack B</option>
                  <option value="Rack C">Rack C</option>
                  <option value="Rack D">Rack D</option>
                  <option value="Rack P">Rack P (Pre-Owned)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Shelf Tier</label>
                <select
                  value={formData.shelf_level}
                  onChange={(e) => setFormData({ ...formData, shelf_level: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs outline-none"
                >
                  <option value="Shelf 1 (Top Shelf)">Shelf 1 (Top Shelf)</option>
                  <option value="Shelf 2 (Eye Level)">Shelf 2 (Eye Level - Fast Access)</option>
                  <option value="Shelf 3 (Bottom Shelf)">Shelf 3 (Bottom Shelf)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-xl transition shadow-sm"
            >
              {submitting ? 'Adding...' : 'Save Book to Inventory'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
