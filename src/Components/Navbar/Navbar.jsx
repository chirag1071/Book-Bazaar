import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ cartCount, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/books?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Book Bazaar</span>
        </Link>

        {/* Global Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSearchSubmit}>
            <div className="nav-search-wrapper">
              <span className="nav-search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search books..." 
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="profile-wrapper" ref={profileRef}>
              <button className="profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                👤 {user.name.split(' ')[0]} ▼
              </button>
              <div className={`profile-dropdown ${isProfileOpen ? 'active' : ''}`}>
                <Link to="/profile?tab=info" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>👤 My Profile</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>🛠️ Admin Panel</Link>
                )}
                <Link to="/profile?tab=orders" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>📦 My Orders</Link>
                <Link to="/profile?tab=wishlist" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>❤️ Wishlist</Link>
                <Link to="/profile?tab=library" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>📚 My Library</Link>
                <Link to="/profile?tab=settings" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>⚙️ Settings</Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>🚪 Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-nav-btn profile-btn">Sign In</Link>
          )}

          <Link to="/cart" className="cart-btn" style={{position: 'relative'}}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
