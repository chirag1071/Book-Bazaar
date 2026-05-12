import React from 'react';
import './Policies.css';

function ShippingPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Shipping Policy</h1>
          <p>Last Updated: March 17, 2026</p>
        </header>

        <section className="policy-content">
          <section>
            <h2>1. Shipping Destinations</h2>
            <p>We currently ship to all major cities and towns across India. We are working on expanding our reach to international destinations in the future.</p>
          </section>

          <section>
            <h2>2. Processing Time</h2>
            <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or public holidays.</p>
          </section>

          <section>
            <h2>3. Shipping Rates and Delivery Estimates</h2>
            <p>Shipping charges for your order will be calculated and displayed at checkout:</p>
            <ul>
              <li><strong>Standard Shipping:</strong> ₹50 (FREE for orders over ₹500). Delivery within 5-7 business days.</li>
              <li><strong>Express Shipping:</strong> ₹100. Delivery within 2-3 business days.</li>
            </ul>
          </section>

          <section>
            <h2>4. Order Tracking</h2>
            <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>
          </section>

          <section>
            <h2>5. Customer Support</h2>
            <p>If you have any questions or concerns regarding the shipping of your order, please reach out to us at shipping@bookbazaar.com.</p>
          </section>
        </section>

        <footer className="policy-footer">
          <p>&copy; 2026 Book Bazaar. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default ShippingPolicy;
