import { useState, useEffect } from "react";
import { api } from "../api";

function Stars({ n }) {
  return <span className="stars">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

const INITIAL_FORM = {
  customer_name: "",
  location: "",
  rating: 5,
  body: "",
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  useEffect(() => {
    api.getTestimonials()
      .then((d) => setTestimonials(d || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer_name || !form.body) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      await api.submitTestimonial({ ...form, rating: Number(form.rating) });
      setSubmitMsg({ type: "success", text: "Thank you for your review! It will appear after approval." });
      setForm(INITIAL_FORM);
    } catch (err) {
      setSubmitMsg({ type: "error", text: err.message || "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-banner">
        <div className="page-banner__inner">
          <h1>Customer Reviews</h1>
          <p>Real experiences from real customers across Memphis and surrounding areas.</p>
        </div>
      </div>

      {/* ——— OVERALL RATING ——— */}
      <section className="section--sm section--cream" style={{ padding: "2rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "3rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { num: "5.0", label: "Average Rating", sub: "★★★★★" },
              { num: "500+", label: "Happy Customers", sub: "Across Greater Memphis" },
              { num: "100%", label: "Satisfaction Rate", sub: "Guaranteed" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 700, color: "var(--forest)", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: ".9rem", marginTop: ".25rem" }}>{s.label}</div>
                <div style={{ color: "var(--amber)", fontSize: ".85rem", marginTop: ".15rem" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— TESTIMONIALS GRID ——— */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : testimonials.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">💬</div>
              <h3>No Reviews Yet</h3>
              <p>Be the first to leave a review below!</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {testimonials.map((t) => (
                <div key={t.id} className="testimonial-card">
                  <Stars n={t.rating} />
                  <p className="testimonial-card__text">"{t.body}"</p>
                  <div>
                    <div className="testimonial-card__author">{t.customer_name}</div>
                    {t.location && <div className="testimonial-card__location">{t.location}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ——— SUBMIT FORM ——— */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ maxWidth: "620px", margin: "0 auto" }}>
            <div className="text-center mb-4">
              <span className="section-label">Share Your Experience</span>
              <h2 className="section-title">Leave a Review</h2>
              <div className="divider divider--center" />
              <p className="section-subtitle">
                Had a great experience with M&TJ LLC? We'd love to hear from you!
                Reviews are approved before publishing.
              </p>
            </div>

            {submitMsg && (
              <div className={`form-alert ${submitMsg.type === "error" ? "form-alert--error" : ""} mb-3`}
                style={{ marginBottom: "1.25rem" }}>
                {submitMsg.text}
              </div>
            )}

            {submitMsg?.type !== "success" && (
              <div style={{ background: "var(--white)", borderRadius: "var(--r-lg)", padding: "2rem", boxShadow: "var(--shadow-md)" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        className="form-control"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>City / Neighborhood</label>
                      <input
                        className="form-control"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Memphis, TN"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Rating *</label>
                    <select className="form-control" name="rating" value={form.rating} onChange={handleChange}>
                      <option value={5}>⭐⭐⭐⭐⭐ — 5 Stars (Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ — 4 Stars (Great)</option>
                      <option value={3}>⭐⭐⭐ — 3 Stars (Good)</option>
                      <option value={2}>⭐⭐ — 2 Stars (Fair)</option>
                      <option value={1}>⭐ — 1 Star (Poor)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Your Review *</label>
                    <textarea
                      className="form-control"
                      name="body"
                      value={form.body}
                      onChange={handleChange}
                      placeholder="Tell us about your experience with M&TJ LLC..."
                      rows={5}
                      required
                      minLength={20}
                    />
                    <span className="form-hint">Minimum 20 characters</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={submitting}
                    style={{ alignSelf: "flex-start" }}
                  >
                    {submitting ? <><div className="spinner spinner--sm" /> Submitting...</> : "Submit Review"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
