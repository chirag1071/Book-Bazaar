import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE } from '../../utils/api';
import './AdminDashboard.css';

const EMPTY_FORM = { title: '', author: '', price: '', category: '', subcategory: '', description: '', image: null };

const NAV_ITEMS = [
  { id: 'dashboard', icon: '▣',  label: 'Dashboard'    },
  { id: 'books',     icon: '📚', label: 'Books'         },
  { id: 'users',     icon: '👥', label: 'Users'         },
  { id: 'orders',    icon: '📦', label: 'Orders'        },
];

export default function AdminDashboard({ user, onLogout }) {
  const navigate   = useNavigate();
  const [tab, setTab]         = useState('dashboard');
  const [books, setBooks]     = useState([]);
  const [users, setUsers]     = useState([]);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // modal
  const [modal, setModal]     = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]     = useState(null);

  // search / filter
  const [search, setSearch]   = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, uRes, oRes] = await Promise.all([
        api.get('/api/v1/admin/books'),
        api.get('/api/v1/admin/users'),
        api.get('/api/v1/admin/orders'),
      ]);
      setBooks(Array.isArray(bRes) ? bRes : (bRes.books || []));
      setUsers(Array.isArray(uRes) ? uRes : (uRes.users || []));
      setOrders(Array.isArray(oRes) ? oRes : (oRes.orders || []));
    } catch { showToast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchAll();
  }, [user]);

  /* ── guard ── */
  if (!user || user.role !== 'admin') {
    return (
      <div className="adm-guard">
        <div className="adm-guard-box">
          <div className="adm-guard-icon">🔒</div>
          <h2>Access Denied</h2>
          <p>This area is restricted to administrators only.</p>
          <button className="adm-btn-primary" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  /* ── modal helpers ── */
  const openAdd  = () => { setEditBook(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (book) => {
    setEditBook(book);
    setForm({ 
      title: book.title, 
      author: book.author, 
      price: book.price, 
      category: book.category, 
      subcategory: book.subcategory || '',
      description: book.description || '', 
      image: null 
    });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditBook(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.append('title',    form.title);
    fd.append('author',   form.author);
    fd.append('price',    form.price);
    fd.append('category', form.category);
    fd.append('subcategory', form.subcategory);
    if (form.description) fd.append('description', form.description);
    if (form.image) fd.append('image', form.image);
    try {
      if (editBook) {
        await api.put(`/api/v1/admin/updatebook/${editBook._id}`, fd, true);
        showToast('Book updated successfully!');
      } else {
        await api.post('/api/v1/admin/addbook', fd, true);
        showToast('Book added successfully!');
      }
      closeModal();
      await fetchAll();
    } catch { showToast('Operation failed.', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id, title) => {
    console.log('Delete clicked for:', title, id);
    const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;
    try {
      const res = await api.delete(`/api/v1/admin/deletebook/${id}`);
      console.log('Delete response:', res);
      if (res && res.message) {
        showToast(res.message);
      } else {
        showToast('Book deleted.');
      }
      await fetchAll();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete book.', 'error');
    }
  };

  /* ── derived ── */
  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const filteredBooks = books.filter(b => {
    const matchCat = catFilter === 'all' || b.category === catFilter;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                        b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const categories = ['all', ...new Set(books.map(b => b.category).filter(Boolean))];
  const recentBooks = [...books].slice(0, 5);

  return (
    <div className={`adm-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <span className="adm-logo-icon">📚</span>
          {sidebarOpen && <span className="adm-logo-text">Book<b>Bazaar</b></span>}
        </div>

        <nav className="adm-nav">
          <p className="adm-nav-label">{sidebarOpen && 'MAIN MENU'}</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`adm-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && tab === item.id && <span className="adm-nav-dot" />}
            </button>
          ))}

          <div className="adm-nav-divider" />
          
          <button className="adm-nav-item adm-logout" onClick={() => { onLogout(); navigate('/'); }}>
            <span className="adm-nav-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="adm-body">

        {/* Top Header */}
        <header className="adm-header">
          <div className="adm-header-left">
            <button className="adm-toggle-btn" onClick={() => setSidebarOpen(p => !p)}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div className="adm-breadcrumb">
              <span>Admin</span>
              <span className="adm-bc-sep">/</span>
              <span className="adm-bc-active">{NAV_ITEMS.find(n => n.id === tab)?.label}</span>
            </div>
          </div>
          <div className="adm-header-right">
            <button className="adm-store-btn" onClick={() => navigate('/')}>🏪 View Store</button>
            <div className="adm-user-chip">
              <div className="adm-user-avatar">{user.name[0].toUpperCase()}</div>
              <div className="adm-user-info">
                <span className="adm-user-name">{user.name}</span>
                <span className="adm-user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="adm-content">

          {/* Toast */}
          {toast && (
            <div className={`adm-toast adm-toast-${toast.type}`}>{toast.msg}</div>
          )}

          {loading && (
            <div className="adm-loader-wrap">
              <div className="adm-spinner" />
              <p>Loading data...</p>
            </div>
          )}

          {/* ══════════ DASHBOARD ══════════ */}
          {!loading && tab === 'dashboard' && (
            <div className="adm-fade-in">
              <div className="adm-page-header">
                <div>
                  <h1>Dashboard</h1>
                  <p>Welcome back, {user.name}! Here's what's happening.</p>
                </div>
                <button className="adm-btn-primary" onClick={openAdd}>+ Add Book</button>
              </div>

              {/* Stats */}
              <div className="adm-stats-grid">
                <div className="adm-stat-card adm-stat-blue" style={{cursor:'pointer'}} onClick={() => setTab('books')}>
                  <div className="adm-stat-icon">📚</div>
                  <div className="adm-stat-info">
                    <h3>{books.length}</h3>
                    <p>Total Books</p>
                  </div>
                  <div className="adm-stat-trend">+{books.length}</div>
                </div>
                <div className="adm-stat-card adm-stat-purple" style={{cursor:'pointer'}} onClick={() => setTab('users')}>
                  <div className="adm-stat-icon">👥</div>
                  <div className="adm-stat-info">
                    <h3>{users.length}</h3>
                    <p>Registered Users</p>
                  </div>
                  <div className="adm-stat-trend">+{users.length}</div>
                </div>
                <div className="adm-stat-card adm-stat-orange" style={{cursor:'pointer'}} onClick={() => setTab('orders')}>
                  <div className="adm-stat-icon">📦</div>
                  <div className="adm-stat-info">
                    <h3>{orders.length}</h3>
                    <p>Total Orders</p>
                  </div>
                  <div className="adm-stat-trend">+{orders.length}</div>
                </div>
                  <div className="adm-stat-card adm-stat-green" style={{cursor:'pointer'}} onClick={() => setTab('orders')}>
                    <div className="adm-stat-icon">💰</div>
                    <div className="adm-stat-info">
                      <h3>₹{totalRevenue.toFixed(0)}</h3>
                      <p>Total Revenue</p>
                    </div>
                    <div className="adm-stat-trend">↑</div>
                  </div>
              </div>

              {/* Recent Books */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <h2>Recent Books</h2>
                  <button className="adm-link-btn" onClick={() => setTab('books')}>View All →</button>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Cover</th><th>Title</th><th>Author</th><th>Cat / Sub</th><th>Price</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBooks.map(book => (
                        <tr key={book._id}>
                          <td>
                            {book.image
                              ? <img src={book.image.startsWith('http') ? book.image : `${API_BASE}/upload/${book.image}`} alt="" className="adm-thumb" />
                              : <div className="adm-thumb-ph">📖</div>}
                          </td>
                          <td className="adm-td-title">{book.title}</td>
                          <td className="adm-td-muted">{book.author}</td>
                          <td><span className="adm-chip">{book.category}</span></td>
                          <td className="adm-td-price">₹{Number(book.price).toFixed(2)}</td>
                          <td>
                            <div className="adm-row-actions">
                              <button className="adm-btn-icon adm-btn-edit" onClick={() => openEdit(book)}>✏️</button>
                              <button className="adm-btn-icon adm-btn-del"  onClick={() => handleDelete(book._id, book.title)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {recentBooks.length === 0 && (
                        <tr><td colSpan="6" className="adm-empty">No books yet. Add your first book!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick summary row */}
              <div className="adm-summary-row">
                <div className="adm-card adm-summary-card">
                  <h3>📊 Category Breakdown</h3>
                  <div className="adm-cat-list">
                    {categories.filter(c => c !== 'all').map(cat => {
                      const count = books.filter(b => b.category === cat).length;
                      const pct   = books.length ? Math.round((count / books.length) * 100) : 0;
                      return (
                        <div key={cat} className="adm-cat-row">
                          <span className="adm-cat-name">{cat}</span>
                          <div className="adm-cat-bar-wrap">
                            <div className="adm-cat-bar" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="adm-cat-count">{count}</span>
                        </div>
                      );
                    })}
                    {categories.filter(c => c !== 'all').length === 0 && (
                      <p className="adm-empty" style={{padding:'10px 0'}}>No categories yet.</p>
                    )}
                  </div>
                </div>

                <div className="adm-card adm-summary-card">
                  <h3>🕐 Recent Users</h3>
                  <div className="adm-user-list">
                    {users.slice(0, 5).map(u => (
                      <div key={u._id} className="adm-user-row">
                        <div className="adm-user-avatar-sm">{u.name[0].toUpperCase()}</div>
                        <div>
                          <p className="adm-user-row-name">{u.name}</p>
                          <p className="adm-user-row-email">{u.email}</p>
                        </div>
                        <span className={`adm-chip ${u.role === 'admin' ? 'adm-chip-admin' : ''}`}>{u.role}</span>
                      </div>
                    ))}
                    {users.length === 0 && <p className="adm-empty" style={{padding:'10px 0'}}>No users yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ BOOKS ══════════ */}
          {!loading && tab === 'books' && (
            <div className="adm-fade-in">
              <div className="adm-page-header">
                <div>
                  <h1>Manage Books</h1>
                  <p>{books.length} books in your catalog</p>
                </div>
                <button className="adm-btn-primary" onClick={openAdd}>+ Add New Book</button>
              </div>

              {/* Filters */}
              <div className="adm-filters">
                <div className="adm-search-wrap">
                  <span className="adm-search-icon">🔍</span>
                  <input
                    className="adm-search"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select className="adm-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  {categories.map(c => (
                    <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                  ))}
                </select>
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Cover</th><th>Title</th><th>Author</th><th>Cat / Sub</th><th>Price</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book, i) => (
                        <tr key={book._id}>
                          <td className="adm-td-muted">{i + 1}</td>
                          <td>
                            {book.image
                              ? <img src={book.image.startsWith('http') ? book.image : `${API_BASE}/upload/${book.image}`} alt="" className="adm-thumb" />
                              : <div className="adm-thumb-ph">📖</div>}
                          </td>
                          <td className="adm-td-title">{book.title}</td>
                          <td className="adm-td-muted">{book.author}</td>
                          <td><span className="adm-chip">{book.category}</span></td>
                          <td className="adm-td-price">₹{Number(book.price).toFixed(2)}</td>
                          <td>
                            <div className="adm-row-actions">
                              <button className="adm-btn-icon adm-btn-edit" onClick={() => openEdit(book)}>✏️ Edit</button>
                              <button className="adm-btn-icon adm-btn-del"  onClick={() => handleDelete(book._id, book.title)}>🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBooks.length === 0 && (
                        <tr><td colSpan="7" className="adm-empty">No books match your search.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ USERS ══════════ */}
          {!loading && tab === 'users' && (
            <div className="adm-fade-in">
              <div className="adm-page-header">
                <div>
                  <h1>Users</h1>
                  <p>{users.length} registered users</p>
                </div>
              </div>
              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>#</th><th>Avatar</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u._id}>
                          <td className="adm-td-muted">{i + 1}</td>
                          <td><div className="adm-user-avatar-sm">{u.name[0].toUpperCase()}</div></td>
                          <td className="adm-td-title">{u.name}</td>
                          <td className="adm-td-muted">{u.email}</td>
                          <td><span className={`adm-chip ${u.role === 'admin' ? 'adm-chip-admin' : ''}`}>{u.role}</span></td>
                          <td className="adm-td-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan="6" className="adm-empty">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ ORDERS ══════════ */}
          {!loading && tab === 'orders' && (
            <div className="adm-fade-in">
              <div className="adm-page-header">
                <div>
                  <h1>Orders</h1>
                  <p>{orders.length} total orders · ₹{totalRevenue.toFixed(2)} revenue</p>
                </div>
              </div>
              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td className="adm-td-mono">#{o._id?.slice(-6).toUpperCase()}</td>
                          <td className="adm-td-title">{o.user?.name || '—'}</td>
                          <td className="adm-td-muted">{o.orderItems?.length || 0} item(s)</td>
                          <td className="adm-td-price">₹{Number(o.totalPrice || 0).toFixed(2)}</td>
                          <td>
                            <span className={`adm-chip adm-status-${o.status || 'pending'}`}>
                              {o.status || 'pending'}
                            </span>
                          </td>
                          <td className="adm-td-muted">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan="6" className="adm-empty">No orders yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══════════ ADD / EDIT MODAL ══════════ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>{editBook ? '✏️ Edit Book' : '📚 Add New Book'}</h2>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="adm-modal-form">
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>Book Title *</label>
                  <input
                    className="adm-input"
                    placeholder="e.g. The Great Gatsby"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="adm-form-group">
                  <label>Author *</label>
                  <input
                    className="adm-input"
                    placeholder="e.g. F. Scott Fitzgerald"
                    value={form.author}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>Price (INR) *</label>
                  <div className="adm-input-prefix-wrap">
                    <span className="adm-input-prefix">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="adm-input adm-input-prefixed"
                      placeholder="0.00"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="adm-form-group">
                  <label>Category *</label>
                  <div className="adm-category-input-group">
                    <input
                      list="categories-list"
                      className="adm-input"
                      placeholder="Type or select category"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      required
                    />
                    <datalist id="categories-list">
                      <option value="Fiction" />
                      <option value="Mystery" />
                      <option value="Sci-Fi" />
                      <option value="Non-Fiction" />
                      <option value="Romance" />
                      <option value="Thriller" />
                      <option value="Biography" />
                      <option value="History" />
                      <option value="Motivation" />
                    </datalist>
                  </div>
                </div>
                <div className="adm-form-group">
                  <label>Sub Category</label>
                  <input
                    className="adm-input"
                    placeholder="e.g. Self Help, Thriller"
                    value={form.subcategory}
                    onChange={e => setForm({ ...form, subcategory: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label>Description</label>
                <textarea
                  className="adm-input adm-textarea"
                  placeholder="Brief description of the book..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="adm-form-group">
                <label>Cover Image {editBook ? '(leave empty to keep current)' : '*'}</label>
                <div className="adm-file-wrap">
                  <label className="adm-file-label">
                    <span>📁 Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setForm({ ...form, image: e.target.files[0] })}
                      {...(!editBook && { required: true })}
                    />
                  </label>
                  {form.image && <span className="adm-file-name">{form.image.name}</span>}
                  {editBook && !form.image && (
                    <div className="adm-current-img">
                      {editBook.image
                        ? <img src={editBook.image.startsWith('http') ? editBook.image : `${API_BASE}/upload/${editBook.image}`} alt="current" />
                        : <span>No image</span>}
                      <span>Current cover</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="adm-btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
