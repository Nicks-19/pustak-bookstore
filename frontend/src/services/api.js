const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000/api' : '/api';

// Fallback seed data for static deployments (e.g. GitHub Pages) where backend is not hosted
const DEFAULT_BOOKS = [
  {
    id: 1,
    isbn: "9788174091955",
    title: "Higher Engineering Mathematics",
    author: "Dr. B.S. Grewal",
    publisher: "Khanna Publishers",
    edition: "44th Edition",
    category: "Mathematics",
    mrp: 850.0,
    selling_price: 720.0,
    stock_quantity: 18,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 1",
    section: "Basic Sciences & Mathematics",
    rack_id: "Rack A",
    shelf_level: "Shelf 2 (Eye Level)",
    cover_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 2,
    isbn: "9781118063330",
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin & Gagne",
    publisher: "Wiley India",
    edition: "9th Edition",
    category: "Computer Science",
    mrp: 925.0,
    selling_price: 790.0,
    stock_quantity: 12,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 1",
    section: "Computer Science & IT",
    rack_id: "Rack B",
    shelf_level: "Shelf 1 (Top Shelf)",
    cover_image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 3,
    isbn: "9780078022159",
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry Korth",
    publisher: "McGraw Hill Education",
    edition: "7th Edition",
    category: "Computer Science",
    mrp: 895.0,
    selling_price: 760.0,
    stock_quantity: 14,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 1",
    section: "Computer Science & IT",
    rack_id: "Rack B",
    shelf_level: "Shelf 2 (Eye Level)",
    cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 4,
    isbn: "9780262033848",
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest, Stein",
    publisher: "MIT Press",
    edition: "3rd Edition",
    category: "Computer Science",
    mrp: 1250.0,
    selling_price: 1100.0,
    stock_quantity: 8,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 2",
    section: "Advanced Computing & Algorithms",
    rack_id: "Rack C",
    shelf_level: "Shelf 2 (Eye Level)",
    cover_image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 5,
    isbn: "9789389872583",
    title: "Engineering Mechanics",
    author: "S.S. Bhavikatti",
    publisher: "New Age International",
    edition: "8th Edition",
    category: "Mechanical",
    mrp: 440.0,
    selling_price: 380.0,
    stock_quantity: 20,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 2",
    section: "Mechanical & Civil Engineering",
    rack_id: "Rack A",
    shelf_level: "Shelf 3 (Bottom Shelf)",
    cover_image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 6,
    isbn: "9780070671133",
    title: "Basic Electrical Engineering",
    author: "D.C. Kulshreshtha",
    publisher: "McGraw Hill India",
    edition: "1st Revised",
    category: "Electrical",
    mrp: 520.0,
    selling_price: 440.0,
    stock_quantity: 15,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 2",
    section: "Electrical & Electronics",
    rack_id: "Rack B",
    shelf_level: "Shelf 2 (Eye Level)",
    cover_image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 7,
    isbn: "9780132126953",
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    publisher: "Pearson India",
    edition: "5th Edition",
    category: "Computer Science",
    mrp: 875.0,
    selling_price: 750.0,
    stock_quantity: 9,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 1",
    section: "Computer Science & IT",
    rack_id: "Rack C",
    shelf_level: "Shelf 1 (Top Shelf)",
    cover_image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 11 * 86400000).toISOString()
  },
  {
    id: 8,
    isbn: "9780471195849",
    title: "Advanced Engineering Thermodynamics",
    author: "Adrian Bejan",
    publisher: "John Wiley & Sons",
    edition: "4th Edition",
    category: "Mechanical",
    mrp: 1150.0,
    selling_price: 950.0,
    stock_quantity: 9,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 3",
    section: "Thermal Sciences & Research",
    rack_id: "Rack A",
    shelf_level: "Shelf 1 (Top Shelf)",
    cover_image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 109 * 86400000).toISOString()
  },
  {
    id: 9,
    isbn: "9780131103627",
    title: "The C Programming Language (Vintage Edition)",
    author: "Brian W. Kernighan, Dennis M. Ritchie",
    publisher: "Prentice Hall",
    edition: "2nd Edition",
    category: "Computer Science",
    mrp: 650.0,
    selling_price: 600.0,
    stock_quantity: 14,
    is_preowned: false,
    condition_grade: "New",
    aisle_no: "Aisle 1",
    section: "Computer Science & IT",
    rack_id: "Rack B",
    shelf_level: "Shelf 3 (Bottom Shelf)",
    cover_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 97 * 86400000).toISOString()
  },
  {
    id: 10,
    isbn: "9780132350884",
    title: "Clean Code: A Handbook of Agile Craftsmanship",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    edition: "1st Edition",
    category: "Computer Science",
    mrp: 999.0,
    selling_price: 499.0,
    stock_quantity: 3,
    is_preowned: true,
    condition_grade: "Good",
    aisle_no: "Aisle 1",
    section: "Pre-Owned Buyback Section",
    rack_id: "Rack P",
    shelf_level: "Shelf 2 (Eye Level)",
    cover_image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
    last_sold_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const DEFAULT_BUNDLES = [
  {
    id: 1,
    bundle_name: "FE Engineering Sem-1 Complete Starter Kit",
    course_branch: "Engineering All Branches",
    semester: 1,
    description: "All mandatory reference books for First Year Semester 1 Engineering (Physics, Mechanics, and Basic Electrical).",
    discount_percent: 15.0,
    books: [DEFAULT_BOOKS[4], DEFAULT_BOOKS[5], DEFAULT_BOOKS[0]]
  },
  {
    id: 2,
    bundle_name: "Computer Engineering Sem-3 Core Kit",
    course_branch: "Computer Engineering",
    semester: 3,
    description: "Standard foundational curriculum pack: Operating Systems, Database Systems, and Algorithms.",
    discount_percent: 15.0,
    books: [DEFAULT_BOOKS[1], DEFAULT_BOOKS[2], DEFAULT_BOOKS[3]]
  }
];

// Helper to access persistent local fallback store
function getLocalBooks() {
  const stored = localStorage.getItem('pustak_fallback_books');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('pustak_fallback_books', JSON.stringify(DEFAULT_BOOKS));
  return DEFAULT_BOOKS;
}

function saveLocalBooks(books) {
  localStorage.setItem('pustak_fallback_books', JSON.stringify(books));
}

function getLocalWallet(prn) {
  const key = `pustak_wallet_${prn}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  const defaultWallet = {
    student_prn: prn || "202401100018",
    student_name: "Nikita Sharad Pawar",
    contact: "+91 98765 43210",
    wallet_balance_inr: 425.0
  };
  localStorage.setItem(key, JSON.stringify(defaultWallet));
  return defaultWallet;
}

function saveLocalWallet(wallet) {
  localStorage.setItem(`pustak_wallet_${wallet.student_prn}`, JSON.stringify(wallet));
}

export const api = {
  // Books & Inventory
  async getBooks(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category) query.append('category', params.category);
      if (params.is_preowned !== undefined) query.append('is_preowned', params.is_preowned);
      if (params.aisle) query.append('aisle', params.aisle);

      const res = await fetch(`${API_BASE}/books?${query.toString()}`);
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch (err) {
      // Offline fallback
      let list = getLocalBooks();
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(b => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s) || b.isbn.includes(s));
      }
      if (params.category) {
        list = list.filter(b => b.category === params.category);
      }
      if (params.is_preowned !== undefined) {
        list = list.filter(b => b.is_preowned === params.is_preowned);
      }
      return list;
    }
  },

  async getShelfLocation(bookId) {
    try {
      const res = await fetch(`${API_BASE}/books/${bookId}/shelf-location`);
      if (!res.ok) throw new Error('Failed to locate shelf coordinates');
      return await res.json();
    } catch (err) {
      const b = getLocalBooks().find(x => x.id === Number(bookId)) || DEFAULT_BOOKS[1];
      return {
        book_id: b.id,
        title: b.title,
        coordinates: {
          aisle_no: b.aisle_no,
          section: b.section,
          rack_id: b.rack_id,
          shelf_level: b.shelf_level
        },
        formatted_breadcrumb: `${b.aisle_no} ➔ ${b.section} ➔ ${b.rack_id} ➔ ${b.shelf_level}`
      };
    }
  },

  async createBook(payload) {
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail?.[0]?.msg || err.detail || 'Failed to add book');
      }
      return await res.json();
    } catch (err) {
      const books = getLocalBooks();
      const newBook = { ...payload, id: Date.now(), last_sold_at: new Date().toISOString() };
      books.unshift(newBook);
      saveLocalBooks(books);
      return newBook;
    }
  },

  async deleteBook(bookId) {
    try {
      const res = await fetch(`${API_BASE}/books/${bookId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete book');
      return await res.json();
    } catch (err) {
      const books = getLocalBooks().filter(b => b.id !== Number(bookId));
      saveLocalBooks(books);
      return { success: true };
    }
  },

  // Circular Buyback & Student Wallet
  async calculateBuyback(payload) {
    try {
      const res = await fetch(`${API_BASE}/buyback/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to calculate buyback credit');
      return await res.json();
    } catch (err) {
      const rates = { Mint: 0.50, Good: 0.40, Fair: 0.25, Poor: 0.10 };
      const rate = rates[payload.condition_grade] || 0.40;
      const payout = Math.round(payload.mrp * rate * 100) / 100;
      return {
        mrp: payload.mrp,
        condition_grade: payload.condition_grade,
        depreciation_rate: rate,
        buyback_amount_inr: payout,
        resale_price_inr: Math.round(payout * 1.25)
      };
    }
  },

  async executeBuyback(payload) {
    try {
      const res = await fetch(`${API_BASE}/buyback/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail?.[0]?.msg || err.detail || 'Failed to execute buyback');
      }
      return await res.json();
    } catch (err) {
      const rates = { Mint: 0.50, Good: 0.40, Fair: 0.25, Poor: 0.10 };
      const rate = rates[payload.condition_grade] || 0.40;
      const payout = Math.round(payload.original_mrp * rate * 100) / 100;

      // Update wallet
      const wallet = getLocalWallet(payload.student_prn);
      wallet.wallet_balance_inr = Math.round((wallet.wallet_balance_inr + payout) * 100) / 100;
      saveLocalWallet(wallet);

      // Restock pre-owned copy on Rack P
      const books = getLocalBooks();
      books.unshift({
        id: Date.now(),
        isbn: payload.isbn,
        title: `${payload.book_title} (Pre-Owned)`,
        author: "Verified Campus Return",
        publisher: "Academic Circular Network",
        edition: "Recycled Edition",
        category: "Computer Science",
        mrp: payload.original_mrp,
        selling_price: Math.round(payout * 1.25),
        stock_quantity: 1,
        is_preowned: true,
        condition_grade: payload.condition_grade,
        aisle_no: "Aisle 1",
        section: "Pre-Owned Buyback Section",
        rack_id: "Rack P",
        shelf_level: "Shelf 2 (Eye Level)",
        cover_image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
        last_sold_at: new Date().toISOString()
      });
      saveLocalBooks(books);

      return {
        success: true,
        transaction_id: Date.now(),
        student_prn: payload.student_prn,
        credited_amount_inr: payout,
        new_wallet_balance_inr: wallet.wallet_balance_inr,
        message: `Successfully credited ₹${payout} to wallet for PRN ${payload.student_prn}`
      };
    }
  },

  async getStudentWallet(prn) {
    try {
      const res = await fetch(`${API_BASE}/buyback/wallets/${encodeURIComponent(prn)}`);
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch (err) {
      return getLocalWallet(prn);
    }
  },

  async getBuybackHistory() {
    try {
      const res = await fetch(`${API_BASE}/buyback/history`);
      if (!res.ok) throw new Error('Failed to fetch buyback history');
      return await res.json();
    } catch (err) {
      return [
        {
          id: 1,
          student_prn: "202401100018",
          book_title: "Clean Code",
          condition_grade: "Mint",
          buyback_amount_inr: 499.0,
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }
  },

  // Academic Syllabus Bundles
  async getBundles() {
    try {
      const res = await fetch(`${API_BASE}/bundles`);
      if (!res.ok) throw new Error('Failed to fetch syllabus bundles');
      return await res.json();
    } catch (err) {
      return DEFAULT_BUNDLES;
    }
  },

  async createBundle(payload) {
    try {
      const res = await fetch(`${API_BASE}/bundles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create bundle');
      return await res.json();
    } catch (err) {
      return { success: true };
    }
  },

  // POS Billing & Digital Receipts
  async checkoutPOS(payload) {
    try {
      const res = await fetch(`${API_BASE}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail?.[0]?.msg || err.detail || 'POS checkout failed');
      }
      return await res.json();
    } catch (err) {
      // Calculate totals
      const subtotal = payload.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
      let walletRedeemed = 0;
      if (payload.redeem_wallet && payload.customer_prn) {
        const wallet = getLocalWallet(payload.customer_prn);
        walletRedeemed = Math.min(wallet.wallet_balance_inr, subtotal);
        wallet.wallet_balance_inr = Math.round((wallet.wallet_balance_inr - walletRedeemed) * 100) / 100;
        saveLocalWallet(wallet);
      }
      const totalPaid = Math.max(0, subtotal - walletRedeemed);

      // Decrement stock in local store
      const books = getLocalBooks();
      payload.items.forEach(item => {
        const b = books.find(x => x.id === item.book_id);
        if (b) b.stock_quantity = Math.max(0, b.stock_quantity - item.quantity);
      });
      saveLocalBooks(books);

      const invoiceNo = `INV-2026-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
      return {
        id: Date.now(),
        invoice_no: invoiceNo,
        customer_name: payload.customer_name || "Student Walk-in",
        customer_prn: payload.customer_prn,
        subtotal_inr: subtotal,
        discount_inr: 0.0,
        wallet_redeemed_inr: walletRedeemed,
        total_paid_inr: totalPaid,
        payment_method: payload.payment_method || "Digital Payment",
        created_at: new Date().toISOString(),
        items: payload.items.map(item => ({
          book_id: item.book_id,
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.unit_price * item.quantity
        }))
      };
    }
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/billing/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  // Dead Stock & Inventory Turnover
  async getDeadStockReport() {
    try {
      const res = await fetch(`${API_BASE}/analytics/dead-stock`);
      if (!res.ok) throw new Error('Failed to fetch dead stock analytics');
      return await res.json();
    } catch (err) {
      const books = getLocalBooks();
      const deadStock = books.filter(b => b.id === 8 || b.id === 9).map(b => ({
        ...b,
        days_inactive: b.id === 8 ? 109 : 97,
        locked_capital_inr: b.selling_price * b.stock_quantity,
        recommendation: "Critical Dead Stock (>90 Days) — Apply 30% Clearance Markdown"
      }));
      const totalLocked = deadStock.reduce((sum, b) => sum + b.locked_capital_inr, 0);
      return {
        dead_stock_count: deadStock.length,
        total_locked_capital_inr: totalLocked,
        items: deadStock
      };
    }
  },

  async applyClearanceDiscount(bookId) {
    try {
      const res = await fetch(`${API_BASE}/analytics/apply-clearance/${bookId}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to apply clearance discount');
      return await res.json();
    } catch (err) {
      const books = getLocalBooks();
      const b = books.find(x => x.id === Number(bookId));
      if (b) {
        b.selling_price = Math.round(b.selling_price * 0.70);
        saveLocalBooks(books);
      }
      return { success: true, new_price: b ? b.selling_price : 0 };
    }
  },

  async getStoreSummary() {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`);
      if (!res.ok) throw new Error('Failed to fetch store summary');
      return await res.json();
    } catch (err) {
      const books = getLocalBooks();
      const totalUnits = books.reduce((s, b) => s + b.stock_quantity, 0);
      const preowned = books.filter(b => b.is_preowned).length;
      return {
        total_titles: books.length,
        total_units_in_stock: totalUnits,
        preowned_rescued_count: preowned,
        total_revenue_inr: 2480.0
      };
    }
  }
};
