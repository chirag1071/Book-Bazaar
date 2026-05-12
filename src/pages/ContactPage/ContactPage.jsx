import { useState } from 'react';
import api from '../../utils/api';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      const res = await api.post('/api/contact', formData);
      if (res && res.success) {
        setStatus({ type: 'success', message: res.message || 'Message sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: res?.message || 'Failed to send message.' });
      }

      // Automatically hide the message after 3 seconds
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
      
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: '📍', title: 'Address', text: '123 Book Street, Reading City, India' },
    { icon: '📧', title: 'Email', text: 'support@bookbazaar.com' },
    { icon: '📞', title: 'Phone', text: '+91 98765 43210' },
    { icon: '⏰', title: 'Hours', text: 'Mon-Sat: 9AM - 8PM' },
  ];

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message!</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <p className="contact-intro">Have a question or need help? Reach out to us through any of these channels.</p>
            <div className="contact-cards">
              {contactInfo.map((info, i) => (
                <div className="contact-info-card" key={i}>
                  <span className="contact-info-icon">{info.icon}</span>
                  <div>
                    <h4>{info.title}</h4>
                    <p>{info.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              {status.message && (
                <div style={{
                  marginBottom: '20px', 
                  padding: '10px', 
                  borderRadius: 'var(--radius-sm)', 
                  textAlign: 'center',
                  backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: status.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                  {status.message}
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label>Your Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message here..." rows="6" required></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
