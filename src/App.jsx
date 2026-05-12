import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import BooksPage from './pages/BooksPage/BooksPage';
import CartPage from './pages/CartPage/CartPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import BookDetailPage from './pages/BookDetailPage/BookDetailPage';
import AdminDashboard from './pages/AdminPage/AdminDashboard';
import PrivacyPolicy from './pages/PolicyPages/PrivacyPolicy';
import TermsAndConditions from './pages/PolicyPages/TermsAndConditions';
import RefundPolicy from './pages/PolicyPages/RefundPolicy';
import ShippingPolicy from './pages/PolicyPages/ShippingPolicy';
import api from './utils/api';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookbazaar_cart')) || [];
    } catch { return []; }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookbazaar_user')) || null;
    } catch { return null; }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookbazaar_wishlist')) || [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('bookbazaar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bookbazaar_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('bookbazaar_token');
      if (token && !user) {
        try {
          const data = await api.get('/api/v1/user/profile');
          if (data && !data.message) {
            setUser(data);
            localStorage.setItem('bookbazaar_user', JSON.stringify(data));
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error("Auth verification failed", err);
          handleLogout();
        }
      }
    };
    verifyUser();
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('bookbazaar_token', token);
    localStorage.setItem('bookbazaar_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bookbazaar_token');
    localStorage.removeItem('bookbazaar_user');
  };

  const addToCart = (book) => {
    if (!user) {
      alert("Please login or register to add items to your cart.");
      navigate('/login');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id || item._id === book._id);
      if (existing) {
        return prev.map(item =>
          (item.id === book.id || item._id === book._id) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const updateQuantity = (index, change) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: Math.max(1, updated[index].quantity + change) };
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const toggleWishlist = (book) => {
    if (!user) {
      alert("Please login or register to add items to your wishlist.");
      navigate('/login');
      return;
    }
    if (!book) return;
    const bookId = book._id || book.id;
    if (!bookId) return;

    setWishlist(prev => {
      const exists = prev.find(item => (item._id || item.id) === bookId);
      if (exists) {
        return prev.filter(item => (item._id || item.id) !== bookId);
      }
      return [...prev, book];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="app">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar 
        cartCount={cartCount} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage onAddToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
          <Route path="/books" element={<BooksPage onAddToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
          <Route path="/book/:id" element={<BookDetailPage onAddToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} user={user} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
