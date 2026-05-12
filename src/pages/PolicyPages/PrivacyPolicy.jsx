import React from 'react';
import './Policies.css';

function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Privacy Policy</h1>
          <p>Last Updated: March 17, 2026</p>
        </header>

        <section className="policy-content">
          <section>
            <h2>1. Information We Collect</h2>
            <p>At Book Bazaar, we collect information to provide better services to all our users. This includes:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you register or place an order.</li>
              <li><strong>Payment Information:</strong> We do not store credit card details; all payments are processed through secure third-party payment gateways.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, including your IP address, browser type, and pages visited.</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the collected data for various purposes:</p>
            <ul>
              <li>To process and deliver your orders.</li>
              <li>To notify you about changes to our service.</li>
              <li>To provide customer support.</li>
              <li>To monitor the usage of our website and improve user experience.</li>
              <li>To send you promotional materials (only if you've opted in).</li>
            </ul>
          </section>

          <section>
            <h2>3. Data Security</h2>
            <p>The security of your data is important to us. We use industry-standard encryption and security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>We may employ third-party companies (e.g., shipping partners, payment processors) to facilitate our service. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
          </section>

          <section>
            <h2>5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@bookbazaar.com.</p>
          </section>
        </section>

        <footer className="policy-footer">
          <p>&copy; 2026 Book Bazaar. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
