import { useState, useEffect } from 'react';
import api, { API_BASE } from '../../utils/api';
import './AdminPage.css';

const TABS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'books',     icon: '📚', label: 'Books' },
  { id: 'users',     icon: '👥', label: 'Users' },
  { id: 'orders',    icon: '📦', label: 'Orders' },
];

const EMPTY_FORM = { title: '', author: '', price: '', category: '', image: null };

function AdminPage({ user }) {
  const [tab, setTab]         = useState('dashboard');
  const [books, setBooks]     = useState([]);
  const [users, setUsers]     = useState([]);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState('');

  // Add / Edit book form
  const [showForm, setShowForm]   = useState(false);
  const [editBook, setEditBook]   = useState(null);   // null = add mode
  const [form, setForm]           = useState(EMPTY_FORM);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  /* ── fetch helpers ── */
  const fetchBooks  = async () => { const d = await api.get('/api/v1/admin/books');  setBooks(d);  };
  const fetchUsers  = async () => { const d = await api.get('/api/v1/admin/users');  setUsers(d);  };
  const fetchOrders = async () => { const d = await api.get('/api/v1/admin/orders'); setOrders(d); };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    Promise.all([fetchBooks(), fetchUsers(), fetchOrders()]).finally(() => setLoading(false));
  }, [user]);

  /* ── not admin guard ── */
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="admin-guard">
          <span>🔒</span>
          <h2>Admin Access Only</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  /* ── open add form ── */
  const openAdd = () => { setEditBook(null); setForm(EMPTY_FORM); setShowForm(true); };

  /* ── open edit form ── */
  const openEdit = (book) => {
    setEditBook(book);
    setForm({ title: book.title, author: book.author, price: book.price, category: book.category, image: null });
    setShowForm(true);
  };

  /* ── submit add / edit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title',    form.title);
    fd.append('author',   form.author);
    fd.append('price',    form.price);
    fd.append('category', form.category);
    if (form.image) fd.append('image', form.image);

    try {
      if (editBook) {
        await api.put(`/api/v1/admin/updatebook/${editBook._id}`, fd, true);
        flash('Book updated successfully!');
      } else {
        await api.post('/api/v1/admin/addbook', fd, true);
        flash('Book added successfully!');
      }
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      flash('Operation failed. Please try again.');
    }
  };

  /* ── delete book ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    await api.delete(`/api/v1/admin/deletebook/${id}`);
    flash('Book deleted.');
    fetchBooks();
  };

  /* ── stats ── */
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="admin-page">
      {/* Hero */}
      <div className="admin-hero">
        <div className="container">
          <h1>🛠️ Admin Panel</h1>
          <p>Welcome back, {user.name}</p>
        </div>
      </div>

      <div className="container">
        <div className="admin-layout">

          {/* Sidebar */}
          <aside className="admin-sidebar">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="admin-main">
            {msg && <div className="admin-flash">{msg}</div>}
            {loading && <div className="admin-loading">Loading...</div>}

            {/* ── DASHBOARD ── */}
            {tab === 'dashboard' && (
              <>
                <h2 className="admin-section-title">Dashboard Overview</h2>
                <div className="admin-stats">
                  <div className="stat-box">
                    <span className="stat-icon">📚</span>
                    <div>
                      <h3>{books.length}</h3>
                      <p>Total Books</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <span className="stat-icon">👥</span>
                    <div>
                      <h3>{users.length}</h3>
                      <p>Total Users</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <span className="stat-icon">📦</span>
                    <div>
                      <h3>{orders.length}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <span className="stat-icon">💰</span>
                    <div>
                      <h3>₹{totalRevenue.toFixed(2)}</h3>
                      <p>Revenue</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── BOOKS ── */}
            {tab === 'books' && (
              <>
                <div className="admin-section-header">
                  <h2 className="admin-section-title">Manage Books</h2>
                  <button className="btn-primary" onClick={openAdd}>+ Add Book</button>
                </div>

                {/* Add / Edit Form */}
                {showForm && (
                  <div className="admin-form-card">
                    <h3>{editBook ? 'Edit Book' : 'Add New Book'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Title</label>
                          <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>Author</label>
                          <input className="form-input" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Price (₹)</label>
                          <input type="number" step="0.01" className="form-input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>Category</label>
                          <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                            <option value="">Select category</option>
                            <option value="fiction">Fiction</option>
                            <option value="mystery">Mystery</option>
                            <option value="sci-fi">Sci-Fi</option>
                            <option value="non-fiction">Non-Fiction</option>
                            <option value="romance">Romance</option>
                            <option value="thriller">Thriller</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Cover Image {editBook && '(leave empty to keep current)'}</label>
                        <input type="file" accept="image/*" className="form-input" onChange={e => setForm({...form, image: e.target.files[0]})} {...(!editBook && { required: true })} />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">{editBook ? 'Save Changes' : 'Add Book'}</button>
                        <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Books Table */}
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map(book => (
                        <tr key={book._id}>
                          <td>
                            {book.image
                              ? <img src={book.image.startsWith('http') ? book.image : `${API_BASE}/upload/${book.image}`} alt={book.title} className="admin-book-thumb" />
                              : <span className="admin-book-thumb-placeholder">📖</span>
                            }
                          </td>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td><span className="admin-badge">{book.category}</span></td>
                          <td>₹{Number(book.price).toFixed(2)}</td>
                          <td className="admin-actions">
                            <button className="btn-edit" onClick={() => openEdit(book)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(book._id)}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                      {books.length === 0 && !loading && (
                        <tr><td colSpan="6" className="admin-empty">No books found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── USERS ── */}
            {tab === 'users' && (
              <>
                <h2 className="admin-section-title">All Users</h2>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td><span className={`admin-badge ${u.role === 'admin' ? 'badge-admin' : ''}`}>{u.role}</span></td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {users.length === 0 && !loading && (
                        <tr><td colSpan="4" className="admin-empty">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── ORDERS ── */}
            {tab === 'orders' && (
              <>
                <h2 className="admin-section-title">All Orders</h2>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td className="admin-id">{o._id?.substring(0, 8).toUpperCase()}</td>
                          <td>{o.user?.name || 'N/A'}</td>
                          <td>₹{Number(o.totalPrice || 0).toFixed(2)}</td>
                          <td><span className={`admin-badge status-${o.status}`}>{o.status || 'pending'}</span></td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && !loading && (
                        <tr><td colSpan="5" className="admin-empty">No orders found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
