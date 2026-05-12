const books = [
    { id: 1, title: "The Great Adventure", author: "John Smith", category: "fiction", price: 19.99, icon: "📖", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: 2, title: "Mystery of the Night", author: "Jane Doe", category: "mystery", price: 24.99, icon: "🔍", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: 3, title: "Space Odyssey", author: "Mike Johnson", category: "sci-fi", price: 29.99, icon: "🚀", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { id: 4, title: "History Unveiled", author: "Sarah Williams", category: "non-fiction", price: 22.99, icon: "📚", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    { id: 5, title: "The Lost Kingdom", author: "David Brown", category: "fiction", price: 21.99, icon: "🏰", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { id: 6, title: "Detective Stories", author: "Emily Davis", category: "mystery", price: 18.99, icon: "🕵️", gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
    { id: 7, title: "Future World", author: "Chris Wilson", category: "sci-fi", price: 26.99, icon: "🌌", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
    { id: 8, title: "Life Lessons", author: "Anna Taylor", category: "non-fiction", price: 20.99, icon: "💡", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.querySelector('.profile-dropdown');
const dropdownMenu = document.getElementById('dropdownMenu');

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('active');
    }
});

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const text = item.textContent.trim();
        if (text === 'Logout') {
            alert('Logged out successfully!');
        } else {
            alert(`Navigating to: ${text}`);
        }
        profileDropdown.classList.remove('active');
    });
});

function renderBooks(booksToRender) {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';
    
    booksToRender.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover" style="background: ${book.gradient}">${book.icon}</div>
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <span class="category">${book.category}</span>
            <p class="price">$${book.price}</p>
            <button onclick="addToCart(${book.id})">Add to Cart</button>
        `;
        booksGrid.appendChild(bookCard);
    });
}

function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`"${book.title}" added to cart!`);
}

function updateCartCount() {
    document.querySelector('.cart-count').textContent = cart.length;
}

function filterBooks() {
    const category = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = books;
    
    if (category !== 'all') {
        filtered = filtered.filter(book => book.category === category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    renderBooks(filtered);
}

document.getElementById('categoryFilter').addEventListener('change', filterBooks);
document.getElementById('searchInput').addEventListener('input', filterBooks);

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

document.querySelector('.cart').addEventListener('click', function(e) {
    e.stopPropagation();
    window.location.href = 'cart.html';
});

renderBooks(books);
