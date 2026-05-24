import { useState } from "react";
import { api } from "../api";

const INIT = { full_name: "", email: "", phone: "", subject: "", body: "" };

export default function Contact() {
  const [form, setForm] = useState(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const payload = {
        ...form,
        subject: form.subject || "General Inquiry",
      };
      await api.submitMessage(payload);
      setMsg({ type: "success", text: "Message sent! We'll be in touch within 24 hours." });
      setForm(INIT);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to send message. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-banner">
        <div className="page-banner__inner">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out and we'll respond within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Contact info cards */}
          <div className="grid grid-3 mb-4" style={{ marginBottom: "3rem" }}>
            <a href="tel:+19017417276" className="contact-info-card" style={{ display: "block" }}>
              <div className="contact-info-card__icon">📞</div>
              <h3>Call Us</h3>
              <p>+1 (901) 741-7276</p>
              <div style={{ fontSize: ".8rem", color: "var(--gray-500)", marginTop: ".4rem" }}>Mon–Sat, 7am–7pm</div>
            </a>
            <a href="mailto:mtjllc@proton.me" className="contact-info-card" style={{ display: "block" }}>
              <div className="contact-info-card__icon">✉️</div>
              <h3>Email Us</h3>
              <p>mtjllc@proton.me</p>
              <div style={{ fontSize: ".8rem", color: "var(--gray-500)", marginTop: ".4rem" }}>Response within 24 hours</div>
            </a>
            <div className="contact-info-card">
              <div className="contact-info-card__icon">📍</div>
              <h3>Service Area</h3>
              <p>Memphis Metro Area</p>
              <div style={{ fontSize: ".8rem", color: "var(--gray-500)", marginTop: ".4rem" }}>Memphis, TN & surrounding cities</div>
            </div>
          </div>

          {/* Contact form */}
          <div className="contact-form-card" style={{ maxWidth: "720px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: ".5rem" }}>Send Us a Message</h2>
            <p style={{ marginBottom: "1.75rem", fontSize: ".9rem" }}>
              Have a question, need a quote, or want to schedule service? Fill out the form below.
            </p>

            {msg && (
              <div className={`form-alert ${msg.type === "error" ? "form-alert--error" : ""} mb-3`}
                style={{ marginBottom: "1.25rem", background: msg.type === "success" ? "var(--sage-pale)" : undefined, color: msg.type === "success" ? "var(--forest)" : undefined }}>
                {msg.text}
              </div>
            )}

            {msg?.type !== "success" && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      className="form-control"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      className="form-control"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(901) 555-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      className="form-control"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Service inquiry, question, etc."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    className="form-control"
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    placeholder="How can we help you? Tell us about your property and what services you're interested in..."
                    rows={5}
                    required
                    minLength={10}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={submitting}
                  style={{ alignSelf: "flex-start" }}
                >
                  {submitting ? <><div className="spinner spinner--sm" /> Sending...</> : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ——— BUSINESS HOURS ——— */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
            <span className="section-label">Hours</span>
            <h2 className="section-title">Business Hours</h2>
            <div className="divider divider--center" />
            <div style={{
              background: "var(--white)",
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              border: "1.5px solid var(--gray-100)",
              boxShadow: "var(--shadow-sm)",
              marginTop: "1.5rem",
            }}>
              {[
                { day: "Monday – Friday", hours: "7:00 AM – 7:00 PM" },
                { day: "Saturday", hours: "8:00 AM – 5:00 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem 1.5rem",
                  borderBottom: i < 2 ? "1px solid var(--gray-100)" : "none",
                  fontSize: ".95rem",
                }}>
                  <span style={{ fontWeight: 600, color: "var(--charcoal)" }}>{row.day}</span>
                  <span style={{ color: row.hours === "Closed" ? "var(--red)" : "var(--grass)", fontWeight: 500 }}>{row.hours}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "1rem", fontSize: ".85rem", color: "var(--gray-500)" }}>
              Emergency services available — call us anytime.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
