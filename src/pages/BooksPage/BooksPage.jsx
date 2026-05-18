import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../../Components/BookCard/BookCard';
import api from '../../utils/api';
import './BooksPage.css';

function BooksPage({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || 'all';
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setSearchTerm(querySearch);
    setSelectedCategory(queryCategory);
  }, [querySearch, queryCategory]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.get('/api/book/all');
        setBooks(data.books || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const categories = ['all', ...new Set(books.map(b => b.category).filter(Boolean))];

  let filteredBooks = books;

  if (selectedCategory !== 'all') {
    filteredBooks = filteredBooks.filter(b => b.category?.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    filteredBooks = filteredBooks.filter(b => {
      const title = b.title.toLowerCase();
      const author = b.author.toLowerCase();
      return title.includes(s)     || 
             author.includes(s)    || 
             s.includes(title)     || 
             s.includes(author);
    });
  }

  if (sortBy === 'price-low') filteredBooks = [...filteredBooks].sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
  if (sortBy === 'price-high') filteredBooks = [...filteredBooks].sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
  if (sortBy === 'rating') filteredBooks = [...filteredBooks].sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
  if (sortBy === 'title') filteredBooks = [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title));

  if (loading) return (
    <div className="books-page" style={{display: 'flex', justifyContent: 'center', padding: '100px'}}>
      <div className="loader">Loading books...</div>
    </div>
  );

  if (error) return (
    <div className="books-page" style={{textAlign: 'center', padding: '100px'}}>
      <p style={{color: 'var(--error)'}}>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="books-page">
      <div className="books-hero">
        <div className="container">
          <h1>Our Book Collection</h1>
          <p>Discover your next favorite read from our curated selection</p>
        </div>
      </div>

      <div className="container">
        <div className="filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select 
              value={selectedCategory} 
              onChange={(e) => {
                const cat = e.target.value;
                setSelectedCategory(cat);
                setSearchParams(prev => {
                  if (cat === 'all') prev.delete('category');
                  else prev.set('category', cat);
                  return prev;
                });
              }} 
              className="filter-select"
            >
              {categories.map(c => (
                <option key={c} value={c.toLowerCase()}>{c.toLowerCase() === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="default">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        <p className="results-count">{filteredBooks.length} books found</p>

        <div className="books-grid">
          {filteredBooks.map(book => (
            <BookCard key={book._id || book.id} book={book} onAddToCart={onAddToCart} />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">📭</span>
            <h3>No books found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksPage;
