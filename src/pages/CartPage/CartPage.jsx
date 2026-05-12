import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './CartPage.css';

const PAYMENT_METHODS = [
  { id: 'upi',      icon: '🔗', label: 'UPI',       desc: 'Pay via any UPI app' },
  { id: 'gpay',     icon: '💳', label: 'Google Pay', desc: 'Fast & secure' },
  { id: 'phonepe',  icon: '📱', label: 'PhonePe',    desc: 'Quick payments' },
  { id: 'funpay',   icon: '🎮', label: 'FunPay',     desc: 'Fun & easy payments' },
  { id: 'cod',      icon: '💵', label: 'Cash on Delivery', desc: 'Pay when you receive' },
];

function CartPage({ cart, updateQuantity, removeFromCart, user }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [savedTotal, setSavedTotal] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 && subtotal < 1000 ? 50 : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleProceedToPayment = () => {
    if (!user) {
      alert('Please login first to checkout.');
      return;
    }
    setShowPayment(true);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }
    if ((paymentMethod === 'upi' || paymentMethod === 'gpay' || paymentMethod === 'phonepe' || paymentMethod === 'funpay') && !upiId.trim()) {
      setError('Please enter your UPI ID.');
      return;
    }
    setError('');
    setPlacing(true);

    try {
      const orderItems = cart.map(item => ({
        book: item._id || item.id,
        quantity: item.quantity,
      }));

      const methodLabel = PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || paymentMethod;

      const res = await api.post('/api/order/create', {
        orderItems,
        shippingAddress: {
          address: 'Default Address',
          city: 'Default City',
          pincode: '000000',
          country: 'India',
        },
        totalprice: total,
        paymentMethod: methodLabel,
      });

      if (res && res.order) {
        setOrderData(res.order);
        setSavedTotal(total);
        setOrderPlaced(true);
        // Clear cart items
        cart.forEach((_, i) => removeFromCart(0));
      } else {
        setError(res?.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    const method = PAYMENT_METHODS.find(m => m.id === paymentMethod);
    return (
      <div className="cart-page">
        <div className="cart-hero">
          <div className="container">
            <h1>Order Confirmed! 🎉</h1>
          </div>
        </div>
        <div className="container">
          <div className="order-success">
            <span className="success-icon">✅</span>
            <h2>Thank you for your order!</h2>
            <p>Your order of <strong>₹{savedTotal.toFixed(2)}</strong> has been placed successfully.</p>
            <div className="order-success-detail">
              <span>{method?.icon} {method?.label}</span>
              {paymentMethod === 'cod' ? (
                <span>Pay ₹{savedTotal.toFixed(2)} on delivery</span>
              ) : (
                <span>UPI ID: {upiId}</span>
              )}
            </div>
            {orderData && (
              <p className="order-id">Order ID: #{orderData._id?.slice(-8).toUpperCase()}</p>
            )}
            <Link to="/books" className="btn-primary" style={{display:'inline-block', marginTop:'1.5rem'}}>Continue Shopping →</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-hero">
          <div className="container">
            <h1>Shopping Cart</h1>
          </div>
        </div>
        <div className="container">
          <div className="empty-cart">
            <span className="empty-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any books yet. Start exploring our collection!</p>
            <Link to="/books" className="btn-primary">Browse Books →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-hero">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container">
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div className="cart-item" key={item.id || item._id}>
                <div className="cart-item-image">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('http') ? item.image : `http://localhost:5000/upload/${item.image}`} 
                      alt={item.title} 
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${item.id || item._id || 'cart'}/500/750`; }}
                    />
                  ) : (
                    <div className="cart-item-placeholder" style={{ background: item.gradient }}>{item.icon}</div>
                  )}
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <h3>{item.title}</h3>
                      <p className="cart-item-author">by {item.author}</p>
                      <span className={`category-badge ${item.category}`}>{item.category}</span>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(index)} title="Remove">✕</button>
                  </div>
                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(index, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)}>+</button>
                    </div>
                    <span className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Payment Method Section */}
            {showPayment && (
              <div className="payment-section">
                <h3>💳 Select Payment Method</h3>
                <div className="payment-options">
                  {PAYMENT_METHODS.map(method => (
                    <label 
                      key={method.id} 
                      className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => { setPaymentMethod(method.id); setError(''); }}
                      />
                      <span className="payment-icon">{method.icon}</span>
                      <div className="payment-label">
                        <strong>{method.label}</strong>
                        <small>{method.desc}</small>
                      </div>
                      <span className="payment-radio-dot" />
                    </label>
                  ))}
                </div>

                {/* UPI ID input for UPI-based methods */}
                {(paymentMethod === 'upi' || paymentMethod === 'gpay' || paymentMethod === 'phonepe' || paymentMethod === 'funpay') && (
                  <div className="upi-input-section">
                    <label>Enter your UPI ID</label>
                    <input 
                      type="text" 
                      className="upi-input" 
                      placeholder="yourname@upi" 
                      value={upiId} 
                      onChange={e => { setUpiId(e.target.value); setError(''); }}
                    />
                  </div>
                )}

                {error && <p className="payment-error">{error}</p>}
              </div>
            )}
          </div>

          <aside className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-line">
              <span>GST (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-line total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Show selected payment method in summary */}
            {paymentMethod && (
              <div className="summary-payment-badge">
                {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon}{' '}
                {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
              </div>
            )}

            {!showPayment ? (
              <button className="btn-checkout" onClick={handleProceedToPayment}>
                Proceed to Checkout
              </button>
            ) : (
              <button 
                className="btn-checkout btn-place-order" 
                onClick={handlePlaceOrder}
                disabled={!paymentMethod || placing}
              >
                {placing ? 'Placing Order...' : paymentMethod ? `Place Order — ₹${total.toFixed(2)}` : 'Select a Payment Method'}
              </button>
            )}
            <Link to="/books" className="continue-link">← Continue Shopping</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
