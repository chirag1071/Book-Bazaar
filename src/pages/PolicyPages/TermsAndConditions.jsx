import React from 'react';
import './Policies.css';

function TermsAndConditions() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Terms and Conditions</h1>
          <p>Last Updated: March 17, 2026</p>
        </header>

        <section className="policy-content">
          <section>
            <h2>1. Introduction</h2>
            <p>Welcome to Book Bazaar. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully.</p>
          </section>

          <section>
            <h2>2. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and images, is the property of Book Bazaar or its content suppliers and is protected by international copyright laws.</p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>To access certain features of our website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and password.</p>
          </section>

          <section>
            <h2>4. Product Availability and Pricing</h2>
            <p>We strive to provide accurate product information and pricing. However, errors may occur. We reserve the right to correct any errors and to change or update information at any time without prior notice.</p>
          </section>

          <section>
            <h2>5. Limitation of Liability</h2>
            <p>Book Bazaar shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our website or services.</p>
          </section>

          <section>
            <h2>6. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
          </section>
        </section>

        <footer className="policy-footer">
          <p>&copy; 2026 Book Bazaar. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default TermsAndConditions;
