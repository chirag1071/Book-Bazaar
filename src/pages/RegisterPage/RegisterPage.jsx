import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../LoginPage/LoginPage.css';

const API_BASE = 'https://book-bazaar-api-f35u.onrender.com';

function RegisterPage({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.message && data.message.includes('Succesfully')) {
        // Auto-login after registration
        const loginRes = await fetch(`${API_BASE}/api/v1/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
          localStorage.setItem('bookbazaar_token', loginData.token);
          localStorage.setItem('bookbazaar_user', JSON.stringify(loginData.user));
          onLogin(loginData.user, loginData.token);
          navigate('/');
        } else {
          navigate('/login');
        }
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">📚 Book Bazaar</div>
            <h2>Join Our Community!</h2>
            <p>Create an account to start building your personal library and enjoy exclusive deals.</p>
            <div className="auth-visual-books">
              <span className="float-book fb-1">📕</span>
              <span className="float-book fb-2">📗</span>
              <span className="float-book fb-3">📘</span>
              <span className="float-book fb-4">📙</span>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <h1>Create Account</h1>
            <p className="auth-subtitle">Fill in your details to get started</p>

            {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Create Account →'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
