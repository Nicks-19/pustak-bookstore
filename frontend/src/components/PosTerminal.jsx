import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function PosTerminal({ cart, onUpdateQuantity, onRemoveFromCart, onClearCart }) {
  const [customerName, setCustomerName] = useState('Nikita Sharad Pawar');
  const [customerPrn, setCustomerPrn] = useState('202401100018');
  const [redeemWallet, setRedeemWallet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [studentWallet, setStudentWallet] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Check student wallet balance
  const checkWallet = async (prn) => {
    if (!prn) {
      setStudentWallet(null);
      return;
    }
    try {
      const w = await api.getStudentWallet(prn);
      setStudentWallet(w);
    } catch (err) {
      setStudentWallet(null);
    }
  };

  useEffect(() => {
    checkWallet(customerPrn);
  }, [customerPrn]);

  const subtotal = cart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
  const walletAvailable = studentWallet ? studentWallet.wallet_balance_inr : 0.0;
  const walletDiscount = redeemWallet ? Math.min(walletAvailable, subtotal) : 0.0;
  const totalPayable = Math.max(0.0, subtotal - walletDiscount);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty. Please add books from the catalog or syllabus kits.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: customerName.trim() || 'Walk-in Customer',
        customer_prn: customerPrn.trim() || null,
        items: cart.map(item => ({ book_id: item.id, quantity: item.quantity })),
        redeem_wallet: redeemWallet,
        payment_method: paymentMethod
      };

      const invoice = await api.checkoutPOS(payload);
      setReceipt(invoice);
      onClearCart();
      checkWallet(customerPrn);
    } catch (err) {
      alert(err.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Smart POS Billing & Digital Receipts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rapid barcode/ISBN billing terminal with automatic student wallet store-credit redemption and itemized paperless invoices.
          </p>
        </div>

        {studentWallet && (
          <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl text-xs flex items-center gap-3">
            <div>
              <span className="text-[10px] text-indigo-600 font-bold uppercase block">Student Store Credit</span>
              <span className="font-display font-bold text-base text-indigo-950">₹{studentWallet.wallet_balance_inr}</span>
            </div>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cart Items List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-base text-slate-900">
              Active Cart ({cart.length} unique titles)
            </h3>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Your cart is empty. Add books from the <strong>Books & Shelves</strong> tab or add complete <strong>Syllabus Kits</strong>.
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.cover_image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{item.aisle_no} ({item.rack_id})</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-700">₹{item.selling_price} each</span>
                        {item.is_preowned && <span className="text-emerald-700 font-bold">(Pre-Owned)</span>}
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 hover:bg-slate-100 font-bold text-slate-600"
                      >
                        -
                      </button>
                      <span className="px-2.5 font-bold font-mono text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-slate-100 font-bold text-slate-600"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-display font-bold text-sm text-slate-900 w-16 text-right">
                      ₹{item.selling_price * item.quantity}
                    </span>

                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer & Checkout Summary (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <form onSubmit={handleCheckout} className="space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
              Customer Details & Payment
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Student Name"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student PRN (For Wallet Credit)</label>
              <input
                type="text"
                value={customerPrn}
                onChange={(e) => setCustomerPrn(e.target.value)}
                placeholder="e.g. 202401100018"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none"
              />
            </div>

            {/* Wallet Redemption Option */}
            {walletAvailable > 0 && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-indigo-900">
                  <input
                    type="checkbox"
                    checked={redeemWallet}
                    onChange={(e) => setRedeemWallet(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span>Redeem Store Credit (₹{walletAvailable} available)</span>
                </label>
                {redeemWallet && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    ✓ Deducting ₹{walletDiscount} from student wallet balance.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Store Wallet">Store Wallet</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((c, i) => c + i.quantity, 0)} items):</span>
                <span>₹{subtotal}</span>
              </div>
              {walletDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Store Wallet Redeemed:</span>
                  <span>-₹{walletDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable:</span>
                <span className="text-indigo-600 font-display">₹{totalPayable}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm mt-3"
            >
              {submitting ? 'Generating Invoice...' : '✓ Complete Order & Generate Receipt'}
            </button>
          </form>
        </div>

      </div>

      {/* Digital Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                ✓
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Pustak Smart Bookstore
              </h3>
              <p className="text-[11px] text-slate-500">Official Paperless Tax Invoice</p>
              <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 inline-block mt-1">
                {receipt.invoice_no}
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs border-b border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-semibold text-slate-800">{receipt.customer_name}</span>
              </div>
              {receipt.customer_prn && (
                <div className="flex justify-between text-slate-600">
                  <span>Student PRN:</span>
                  <span className="font-mono font-semibold text-slate-800">{receipt.customer_prn}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode:</span>
                <span className="font-semibold text-slate-800">{receipt.payment_method}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date & Time:</span>
                <span className="text-[11px] text-slate-500">{receipt.created_at}</span>
              </div>
            </div>

            {/* Line items */}
            <div className="py-3 space-y-1.5 text-xs max-h-40 overflow-y-auto custom-scrollbar border-b border-slate-100">
              {receipt.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span className="line-clamp-1">{it.quantity}x {it.title}</span>
                  <span className="font-semibold ml-2">₹{it.total_price}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-3 space-y-1 text-xs border-b border-slate-100">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹{receipt.subtotal_inr}</span>
              </div>
              {receipt.wallet_redeemed_inr > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Store Wallet Credit Applied:</span>
                  <span>-₹{receipt.wallet_redeemed_inr}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                <span>Total Paid:</span>
                <span className="text-indigo-600">₹{receipt.total_paid_inr}</span>
              </div>
            </div>

            {/* QR Code Demo */}
            <div className="pt-3 text-center">
              <div className="w-20 h-20 bg-slate-100 border border-slate-200 mx-auto rounded-lg flex items-center justify-center text-slate-400 text-xs font-mono">
                [ QR Code ]
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Scan for digital warranty & receipt copy</p>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => setReceipt(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
