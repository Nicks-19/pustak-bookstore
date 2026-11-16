import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BookCatalog from './components/BookCatalog';
import BuybackEngine from './components/BuybackEngine';
import SyllabusBundles from './components/SyllabusBundles';
import PosTerminal from './components/PosTerminal';
import DeadStockDashboard from './components/DeadStockDashboard';
import ShelfNavigatorModal from './components/ShelfNavigatorModal';
import AddBookModal from './components/AddBookModal';
import PresentationHelper from './components/PresentationHelper';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [books, setBooks] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isStoreMapOpen, setIsStoreMapOpen] = useState(false);
  const [targetLocation, setTargetLocation] = useState(null);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isDemoHelperOpen, setIsDemoHelperOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [booksData, bundlesData] = await Promise.all([
        api.getBooks(),
        api.getBundles()
      ]);
      setBooks(booksData);
      setBundles(bundlesData);
    } catch (err) {
      console.error("Failed to load initial bookstore data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Cart operations
  const handleAddToCart = (book, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book_id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book_id === book.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          book_id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          unit_price: book.selling_price,
          quantity: qty,
          shelf_location: `${book.aisle_no} • ${book.rack_id}`,
          is_preowned: book.is_preowned,
          condition_grade: book.condition_grade
        }
      ];
    });
    showToast(`Added "${book.title.slice(0, 28)}..." to POS Cart!`);
  };

  const handleAddBundleToCart = (bundle) => {
    if (!bundle.books || bundle.books.length === 0) return;
    
    // Add all books from the bundle with discounted price
    setCart((prev) => {
      let updatedCart = [...prev];
      const discountFactor = (100 - bundle.discount_percent) / 100;

      bundle.books.forEach((book) => {
        const discountedPrice = Math.round(book.selling_price * discountFactor);
        const existing = updatedCart.find((item) => item.book_id === book.id);
        if (existing) {
          updatedCart = updatedCart.map((item) =>
            item.book_id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updatedCart.push({
            book_id: book.id,
            title: `${book.title} (${bundle.name} Kit)`,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            unit_price: discountedPrice,
            quantity: 1,
            shelf_location: `${book.aisle_no} • ${book.rack_id}`,
            is_preowned: false,
            condition_grade: 'New (Bundle)'
          });
        }
      });
      return updatedCart;
    });

    showToast(`Added ${bundle.books.length} books from ${bundle.name} at 15% discount!`);
    setActiveTab('billing');
  };

  const handleUpdateQuantity = (bookId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.book_id === bookId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.book_id !== bookId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Shelf locator modal
  const handleLocateShelf = (book) => {
    setTargetLocation({
      title: book.title,
      author: book.author,
      aisle_no: book.aisle_no,
      section: book.section,
      rack_id: book.rack_id,
      shelf_level: book.shelf_level
    });
    setIsStoreMapOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddBook={() => setIsAddBookOpen(true)}
        onOpenStoreMap={() => {
          setTargetLocation(null);
          setIsStoreMapOpen(true);
        }}
        onOpenDemoHelper={() => setIsDemoHelperOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">Connecting to Pustak Academic Database...</p>
          </div>
        ) : (
          <>
            {activeTab === 'inventory' && (
              <BookCatalog
                books={books}
                onLocateShelf={handleLocateShelf}
                onAddToCart={handleAddToCart}
              />
            )}

            {activeTab === 'buyback' && (
              <BuybackEngine
                onBuybackCompleted={() => {
                  loadInitialData();
                  showToast('Buyback accepted! Store credit deposited & book restocked.');
                }}
                defaultPrn="202401100018"
              />
            )}

            {activeTab === 'bundles' && (
              <SyllabusBundles
                bundles={bundles}
                onAddBundleToCart={handleAddBundleToCart}
                onLocateShelf={handleLocateShelf}
              />
            )}

            {activeTab === 'billing' && (
              <PosTerminal
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
              />
            )}

            {activeTab === 'analytics' && (
              <DeadStockDashboard
                onClearanceApplied={() => {
                  loadInitialData();
                  showToast('Clearance markdown applied successfully!');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Pustak</strong> — Smart Academic Bookstore & Circular Inventory Management Platform
          </div>
          <div className="text-slate-400">
            Circular Buyback Engine • Shelf Navigation • Syllabus Bundler • POS
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShelfNavigatorModal
        isOpen={isStoreMapOpen}
        onClose={() => setIsStoreMapOpen(false)}
        targetLocation={targetLocation}
      />

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onBookAdded={() => {
          loadInitialData();
          showToast('New book registered with physical shelf coordinates!');
        }}
      />

      <PresentationHelper
        isOpen={isDemoHelperOpen}
        onClose={() => setIsDemoHelperOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
