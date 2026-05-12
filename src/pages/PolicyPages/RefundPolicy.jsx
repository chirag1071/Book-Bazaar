import React from 'react';
import './Policies.css';

function RefundPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Refund Policy</h1>
          <p>Last Updated: March 17, 2026</p>
        </header>

        <section className="policy-content">
          <section>
            <h2>1. Returns</h2>
            <p>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
          </section>

          <section>
            <h2>2. Refunds</h2>
            <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
            <p>If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
          </section>

          <section>
            <h2>3. Damaged or Wrong Items</h2>
            <p>If you receive a damaged book or the wrong item, please contact us immediately at support@bookbazaar.com with photos of the item. We will arrange for a replacement or a full refund at no additional cost to you.</p>
          </section>

          <section>
            <h2>4. Non-Refundable Items</h2>
            <p>Certain items are non-refundable, including digital products (e-books) once they have been downloaded or accessed.</p>
          </section>

          <section>
            <h2>5. Shipping Costs</h2>
            <p>You will be responsible for paying for your own shipping costs for returning your item (unless the item was damaged or incorrect). Shipping costs are non-refundable.</p>
          </section>
        </section>

        <footer className="policy-footer">
          <p>&copy; 2026 Book Bazaar. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default RefundPolicy;
