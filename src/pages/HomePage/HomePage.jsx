import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../Components/BookCard/BookCard';
import api from '../../utils/api';
import './HomePage.css';

function HomePage({ onAddToCart, wishlist, toggleWishlist }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.get('/api/book/all');
        setBooks(data.books || []);
      } catch (err) {
        console.error("Failed to fetch featured books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const featuredBooks = books.slice(0, 4);

  const catMap = books.reduce((acc, b) => {
    if (b.category) {
      acc[b.category] = (acc[b.category] || 0) + 1;
    }
    return acc;
  }, {});

  const categoryPresets = {
    'fiction':     { icon: '📖', color: '#6366f1' },
    'motivation':  { icon: '✨', color: '#f59e0b' },
    'mystery':     { icon: '🔍', color: '#ec4899' },
    'sci-fi':      { icon: '🚀', color: '#06b6d4' },
    'non-fiction': { icon: '📚', color: '#10b981' },
    'romance':     { icon: '💖', color: '#ef4444' },
    'thriller':    { icon: '😱', color: '#1e293b' },
    'biography':   { icon: '👤', color: '#8b5cf6' },
    'history':     { icon: '📜', color: '#4b5563' },
  };

  const dynamicCategories = Object.keys(catMap).map(name => {
    const preset = categoryPresets[name.toLowerCase()] || { icon: '📚', color: '#6366f1' };
    return {
      name,
      count: catMap[name],
      ...preset
    };
  });

  const features = [
    { icon: '📦', title: 'Free Shipping', desc: 'On orders over ₹500', link: '/about#shipping' },
    { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout', link: '/about#payments' },
    { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy', link: '/about#returns' },
    { icon: '💬', title: '24/7 Support', desc: 'Always here to help', link: '/contact' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            {/* <span className="hero-badge">✨ Feed Your Imagination</span> */}
            <h1>Unlock A Universe Of <span className="gradient-text">Endless</span> Stories</h1>
            <p>Step into a world where every page holds a new adventure. Whether you're seeking profound knowledge or a thrilling escape from reality, your next unforgettable journey starts right here.</p>
            <div className="hero-actions">
              <Link to="/books" className="btn-primary">Browse Collection</Link>
              <Link to="/about" className="btn-secondary">Learn More</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>10K+</strong>
                <span>Books</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <strong>5K+</strong>
                <span>Authors</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <strong>50K+</strong>
                <span>Readers</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop" alt="Library with floating books" className="hero-main-image" />
              <div className="hero-image-backdrop"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            {features.map((f, i) => (
              <Link to={f.link} className="feature-item" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <h2>Featured Books</h2>
            <p>Hand-picked selections from our curators, updated weekly</p>
            <div className="accent-line"></div>
          </div>
          <div className="featured-grid">
            {featuredBooks.map(book => (
              <BookCard key={book._id || book.id} book={book} onAddToCart={onAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
            ))}
          </div>
          <div className="section-cta">
            <Link to="/books" className="btn-primary">View All Books →</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-heading">
            <h2>Browse by Category</h2>
            <p>Find your perfect read by exploring our diverse collection</p>
            <div className="accent-line"></div>
          </div>
          <div className="categories-grid">
            {dynamicCategories.map((cat, i) => (
              <Link to={`/books?category=${cat.name.toLowerCase()}`} className="category-card" key={cat.name} style={{'--cat-color': cat.color}}>
                <span className="cat-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.count} books</p>
                <div className="cat-glow"></div>
              </Link>
            ))}
            {dynamicCategories.length === 0 && (
              <p className="no-data">No categories available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-heading">
            <h2>What Readers Say</h2>
            <p>Join thousands of happy readers who found their favorite books here</p>
            <div className="accent-line"></div>
          </div>
          <div className="testimonials-grid">
            {[
              { name: 'Priya Sharma', text: 'Book Bazaar has completely transformed my reading habits. The collection is amazing!', avatar: '👩' },
              { name: 'Rahul Kumar', text: 'Fast delivery and excellent book recommendations. My go-to bookstore now!', avatar: '👨' },
              { name: 'Anita Patel', text: 'Love the UI and the variety. Found so many hidden gems I would have never discovered!', avatar: '👩‍🦱' },
            ].map((t, i) => (
              <div className="testimonial-card" key={t.name}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{t.avatar}</span>
                  <span className="testimonial-name">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Reading?</h2>
            <p>Join Book Bazaar today and get 20% off your first order!</p>
            <Link to="/books" className="btn-primary cta-btn">Shop Now →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
