const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000/api' : '/api';

export const api = {
  // Books & Inventory
  async getBooks(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.is_preowned !== undefined) query.append('is_preowned', params.is_preowned);
    if (params.aisle) query.append('aisle', params.aisle);

    const res = await fetch(`${API_BASE}/books?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch books');
    return res.json();
  },

  async getShelfLocation(bookId) {
    const res = await fetch(`${API_BASE}/books/${bookId}/shelf-location`);
    if (!res.ok) throw new Error('Failed to locate shelf coordinates');
    return res.json();
  },

  async createBook(payload) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail?.[0]?.msg || err.detail || 'Failed to add book');
    }
    return res.json();
  },

  async deleteBook(bookId) {
    const res = await fetch(`${API_BASE}/books/${bookId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete book');
    return res.json();
  },

  // Circular Buyback & Student Wallet
  async calculateBuyback(payload) {
    const res = await fetch(`${API_BASE}/buyback/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to calculate buyback credit');
    return res.json();
  },

  async executeBuyback(payload) {
    const res = await fetch(`${API_BASE}/buyback/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail?.[0]?.msg || err.detail || 'Failed to execute buyback');
    }
    return res.json();
  },

  async getStudentWallet(prn) {
    const res = await fetch(`${API_BASE}/buyback/wallets/${encodeURIComponent(prn)}`);
    if (!res.ok) return null;
    return res.json();
  },

  async getBuybackHistory() {
    const res = await fetch(`${API_BASE}/buyback/history`);
    if (!res.ok) throw new Error('Failed to fetch buyback history');
    return res.json();
  },

  // Academic Syllabus Bundles
  async getBundles() {
    const res = await fetch(`${API_BASE}/bundles`);
    if (!res.ok) throw new Error('Failed to fetch syllabus bundles');
    return res.json();
  },

  async createBundle(payload) {
    const res = await fetch(`${API_BASE}/bundles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create bundle');
    return res.json();
  },

  // POS Billing & Digital Receipts
  async checkoutPOS(payload) {
    const res = await fetch(`${API_BASE}/billing/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail?.[0]?.msg || err.detail || 'POS checkout failed');
    }
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/billing/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  // Dead Stock & Inventory Turnover
  async getDeadStockReport() {
    const res = await fetch(`${API_BASE}/analytics/dead-stock`);
    if (!res.ok) throw new Error('Failed to fetch dead stock analytics');
    return res.json();
  },

  async applyClearanceDiscount(bookId) {
    const res = await fetch(`${API_BASE}/analytics/apply-clearance/${bookId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to apply clearance discount');
    return res.json();
  },

  async getStoreSummary() {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch store summary');
    return res.json();
  }
};
