import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const values = [
    { icon: '📖', title: 'Curated Selection', desc: 'Every book in our catalog is hand-picked by our expert team of bibliophiles.' },
    { icon: '🌍', title: 'Global Authors', desc: 'We feature diverse voices from every corner of the world.' },
    { icon: '💰', title: 'Best Prices', desc: 'Competitive pricing and regular deals to make reading accessible to all.' },
    { icon: '🚀', title: 'Fast Delivery', desc: 'Quick and reliable shipping to get your books to you in no time.' },
  ];

  const team = [
    { name: 'Arjun Mehta', role: 'Founder & CEO', avatar: '👨‍💼', link: 'https://linkedin.com/' },
    { name: 'Sneha Kapoor', role: 'Head of Curation', avatar: '👩‍🎨', link: 'https://twitter.com/' },
    { name: 'Vikram Singh', role: 'Tech Lead', avatar: '👨‍💻', link: 'https://github.com/' },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>About Book Bazaar</h1>
          <p>Connecting readers with stories that inspire, educate, and entertain since 2020</p>
        </div>
      </div>

      <section className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>At Book Bazaar, we believe that every great story deserves to be read. Our mission is to make the joy of reading accessible to everyone by providing a vast collection of books, exceptional customer service, and an unmatched browsing experience.</p>
              <p>Founded in 2020, we've grown from a small online bookshop to one of India's most trusted book retailers, serving over 50,000 happy readers nationwide.</p>
            </div>
            <div className="mission-stats">
              {[
                { number: '10,000+', label: 'Books Available' },
                { number: '50,000+', label: 'Happy Readers' },
                { number: '5,000+', label: 'Authors Featured' },
                { number: '99%', label: 'Satisfaction Rate' },
              ].map((s, i) => (
                <div className="mission-stat" key={i}>
                  <h3>{s.number}</h3>
                  <p>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="section-heading">
            <h2>Why Choose Us</h2>
            <p>What makes Book Bazaar special</p>
            <div className="accent-line"></div>
          </div>
          <div className="values-grid">
            {values.map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-policies" id="policies">
        <div className="container">
          <div className="section-heading">
            <h2>Store Policies</h2>
            <p>Transparency and quality service are our top priorities</p>
            <div className="accent-line"></div>
          </div>
          <div className="policies-grid">
            <div className="policy-item" id="shipping">
              <span className="policy-icon">🚚</span>
              <h3>Free Shipping</h3>
              <p>Enjoy free standard shipping on all orders over ₹500 across India. We partner with reliable courier services to ensure your books reach you safely and on time.</p>
            </div>
            <div className="policy-item" id="payments">
              <span className="policy-icon">💳</span>
              <h3>Secure Payments</h3>
              <p>Your security is our priority. We use industry-standard encryption and secure payment gateways to process your transactions. We support all major UPI, cards, and net banking options.</p>
            </div>
            <div className="policy-item" id="returns">
              <span className="policy-icon">↩️</span>
              <h3>Easy Returns</h3>
              <p>Not satisfied with your purchase? No worries! Our 30-day "no questions asked" return policy ensures you can shop with confidence. Just contact our support team for a hassle-free return.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <div className="section-heading">
            <h2>Meet Our Team</h2>
            <p>The passionate people behind Book Bazaar</p>
            <div className="accent-line"></div>
          </div>
          <div className="team-grid">
            {team.map((t, i) => (
              <a href={t.link} target="_blank" rel="noopener noreferrer" className="team-card" key={i} style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="team-avatar">{t.avatar}</div>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
                <span style={{color: 'var(--accent-primary)', fontSize: '0.85rem', marginTop: '10px', display: 'inline-block'}}>View Profile ↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
