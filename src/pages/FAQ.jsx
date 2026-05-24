import { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
  {
    q: "What areas do you serve?",
    a: "We serve Memphis and the greater Memphis metropolitan area, including Germantown, Collierville, Bartlett, Cordova, Olive Branch, Southaven, Lakeland, Arlington, and Millington. Not sure if we cover your area? Give us a call — we're happy to check.",
  },
  {
    q: "How do I get a price quote?",
    a: "The easiest way is to fill out our online estimate request form. We'll review your information and typically respond within 24 hours with a detailed, no-obligation quote. For urgent requests, you can also call us directly at (901) 741-7276.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Absolutely. M&TJ LLC is fully licensed to operate in Tennessee and carries comprehensive liability insurance. We're happy to provide proof of insurance upon request before any work begins.",
  },
  {
    q: "How often do you recommend lawn mowing?",
    a: "During the growing season (typically April through October in Memphis), we recommend weekly or bi-weekly mowing. In the cooler months, mowing frequency can be reduced. We'll assess your specific lawn and make the best recommendation.",
  },
  {
    q: "Do I need to be home when you come?",
    a: "No, you don't need to be home. As long as we have access to the areas that need servicing (gates unlocked, pets secured, etc.), our crew can complete the work while you're away. We'll send a notification when the job is complete.",
  },
  {
    q: "What do I do if I'm not satisfied with the service?",
    a: "Your satisfaction is guaranteed. If you're not completely happy with our work, contact us within 24 hours and we'll return to address any issues at no additional charge. We want every visit to exceed your expectations.",
  },
  {
    q: "Do you offer service contracts or one-time visits?",
    a: "We offer both! Whether you need a single cleanup, seasonal service, or an ongoing weekly or monthly maintenance plan, we can accommodate your needs. Many customers start with a one-time visit and then sign up for regular service.",
  },
  {
    q: "What happens if it rains on my scheduled service day?",
    a: "Light rain typically doesn't prevent us from working. However, if conditions are unsafe or would result in poor quality work (e.g., saturated ground, heavy downpour), we'll reschedule you for the next available slot and notify you in advance.",
  },
  {
    q: "Do you provide your own equipment and supplies?",
    a: "Yes — we bring everything needed to complete the job, including commercial-grade mowers, trimmers, edgers, blowers, and any necessary supplies. You don't need to provide anything.",
  },
  {
    q: "How do I pay for services?",
    a: "We accept cash, check, and major credit/debit cards. Payment is due upon completion of service for one-time jobs. For recurring maintenance plans, we can set up a convenient monthly billing arrangement.",
  },
  {
    q: "Can you handle large commercial properties?",
    a: "Yes! We have the equipment and crew capacity to handle commercial properties of varying sizes, including office parks, retail centers, apartment complexes, and HOA common areas. Contact us for a custom commercial quote.",
  },
  {
    q: "Do you offer landscaping design services?",
    a: "While our primary focus is lawn maintenance and care, we do offer landscaping enhancements such as mulching, bed preparation, plant trimming, and seasonal plantings. For full landscaping design projects, we can discuss your vision and provide recommendations.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  function toggle(i) {
    setOpen(open === i ? null : i);
  }

  return (
    <>
      <div className="page-banner">
        <div className="page-banner__inner">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to the most common questions about our services and process.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-label">Got Questions?</span>
            <h2 className="section-title">We Have Answers</h2>
            <div className="divider divider--center" />
          </div>

          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item${open === i ? " faq-item--open" : ""}`}>
                <button className="faq-item__q" onClick={() => toggle(i)}>
                  {faq.q}
                  <span className="faq-item__chevron">▼</span>
                </button>
                <div className="faq-item__body">
                  <div className="faq-item__body-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div style={{
            marginTop: "3rem",
            background: "var(--cream)",
            borderRadius: "var(--r-lg)",
            padding: "2.5rem",
            textAlign: "center",
            border: "1.5px solid var(--gray-100)",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
            <h3>Still Have Questions?</h3>
            <p style={{ maxWidth: "440px", margin: ".75rem auto 1.5rem" }}>
              Can't find the answer you're looking for? Reach out to us directly —
              we're happy to help with any questions about our services.
            </p>
            <div className="btn-group" style={{ justifyContent: "center" }}>
              <Link to="/contact" className="btn btn--primary">Contact Us</Link>
              <a href="tel:+19017417276" className="btn btn--secondary">📞 Call Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Skip the research — just request your free estimate and let us handle the rest.</p>
        <div className="btn-group">
          <Link to="/estimate" className="btn btn--white btn--lg">Get Free Estimate</Link>
        </div>
      </section>
    </>
  );
}
