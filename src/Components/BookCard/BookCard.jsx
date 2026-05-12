import { Link } from 'react-router-dom';
import { API_BASE } from '../../utils/api';
import './BookCard.css';

function BookCard({ book, onAddToCart, wishlist = [], toggleWishlist }) {
  const isWishlisted = Boolean(
    book && 
    (book._id || book.id) && 
    wishlist.some(item => (item._id && item._id === book._id) || (item.id && item.id === book.id))
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push('★');
    if (hasHalf) stars.push('★');
    while (stars.length < 5) stars.push('☆');
    return stars.join('');
  };

  return (
    <div className="book-card">
      <Link to={`/book/${book._id || book.id}`} className="book-card-link">
        <div className="book-card-image-wrapper">
          {book.image ? (
            <img 
              src={book.image.startsWith('http') ? book.image : `${API_BASE}/upload/${book.image}`} 
              alt={book.title} 
              className="book-card-image" 
              loading="lazy" 
              onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${book._id || 'fallback'}/500/750`; }}
            />
          ) : (
            <div className="book-card-placeholder" style={{ background: book.gradient }}>
              <span className="placeholder-icon">{book.icon}</span>
            </div>
          )}
          
          {toggleWishlist && (
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(book);
              }}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          )}

          <div className="book-card-overlay">
            <span className="quick-view-btn">View Details</span>
          </div>
        </div>

        <div className="book-card-body">
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">by {book.author}</p>
          <div className="star-rating">
            <span>{renderStars(book.rating)}</span>
            <span className="count">({book.reviews})</span>
          </div>
          <p className="book-card-desc">{book.description}</p>
        </div>
      </Link>

      <div className="book-card-footer-section">
        <span className="book-card-price">₹{parseFloat(book.price || 0).toFixed(2)}</span>
        <button className="add-to-cart-btn" onClick={(e) => { e.preventDefault(); onAddToCart(book); }}>
          <span>🛒</span> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default BookCard;
