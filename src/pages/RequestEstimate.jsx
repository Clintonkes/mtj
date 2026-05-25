import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const FALLBACK_SERVICES = [
  "Lawn Mowing & Edging",
  "Seasonal Cleanup",
  "Mulching",
  "Fertilization Program",
  "Weed Control",
  "Shrub & Hedge Trimming",
  "Commercial Lawncare",
  "Other / Custom",
];

const INIT = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  service_type: "",
  preferred_date: "",
  preferred_time: "",
  notes: "",
};

export default function RequestEstimate() {
  const [form, setForm] = useState(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    api.getServices()
      .then((data) => {
        if (data?.length) setServices(data.map((s) => s.title));
      })
      .catch(() => {/* use fallback */});
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.city ? `${form.address}, ${form.city}` : form.address,
        service_type: form.service_type,
        preferred_date: form.preferred_date || "",
        preferred_time: form.preferred_time || "",
        notes: form.notes,
      };
      await api.submitBooking(payload);
      setMsg({ type: "success" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (msg?.type === "success") {
    return (
      <>
        <div className="page-banner">
          <div className="page-banner__inner">
            <h1>Request Submitted!</h1>
          </div>
        </div>
        <section className="section">
          <div className="container" style={{ textAlign: "center", maxWidth: "560px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>✅</div>
            <h2 style={{ marginBottom: "1rem" }}>We Got Your Request!</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              Thank you for reaching out to M&TJ LLC! We've received your estimate request
              and will contact you within <strong>24 hours</strong> to discuss your needs
              and schedule your free on-site assessment.
            </p>
            <p style={{ marginBottom: "2.5rem", color: "var(--gray-500)", fontSize: ".9rem" }}>
              In the meantime, feel free to browse our services or learn more about our team.
            </p>
            <div className="btn-group" style={{ justifyContent: "center" }}>
              <Link to="/" className="btn btn--primary">Back to Home</Link>
              <Link to="/services" className="btn btn--secondary">Our Services</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="page-banner">
        <div className="page-banner__inner">
          <h1>Get a Free Estimate</h1>
          <p>Fill out the form below and we'll contact you within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>
            {/* Sidebar info */}
            <div style={{ position: "sticky", top: "calc(var(--nav-h) + 2rem)" }}>
              <h3 style={{ marginBottom: "1.25rem" }}>Why Choose M&TJ?</h3>
              {[
                { icon: "🆓", title: "Always Free", desc: "Our estimates are completely free with no obligation." },
                { icon: "⏱️", title: "Fast Response", desc: "We respond within 24 hours, often same day." },
                { icon: "💯", title: "Detailed Quote", desc: "You'll receive a clear, itemized quote — no surprises." },
                { icon: "🤝", title: "No Pressure", desc: "Take your time deciding. We'll never pressure you." },
              ].map((f) => (
                <div key={f.title} className="feature-item" style={{ marginBottom: "1.25rem" }}>
                  <div className="feature-item__icon">{f.icon}</div>
                  <div>
                    <div className="feature-item__title">{f.title}</div>
                    <div className="feature-item__desc">{f.desc}</div>
                  </div>
                </div>
              ))}

              <div style={{
                background: "var(--cream)",
                borderRadius: "var(--r-md)",
                padding: "1.25rem",
                border: "1.5px solid var(--gray-100)",
                marginTop: "1.5rem",
              }}>
                <div style={{ fontWeight: 600, marginBottom: ".5rem", fontSize: ".9rem" }}>Prefer to call?</div>
                <a href="tel:+19017417276" className="btn btn--primary btn--sm" style={{ width: "100%", justifyContent: "center" }}>
                  📞 (901) 741-7276
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="estimate-form-card">
              <h2 style={{ marginBottom: ".5rem" }}>Request Your Free Estimate</h2>
              <p style={{ fontSize: ".9rem", marginBottom: "1.75rem" }}>
                Tell us about your property and what you need — the more detail, the better we can help.
              </p>

              {msg?.type === "error" && (
                <div className="form-alert form-alert--error" style={{ marginBottom: "1.25rem" }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="estimate-form">
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
                    <label>Phone Number *</label>
                    <input
                      className="form-control"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9015550000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Service Type *</label>
                    <select
                      className="form-control"
                      name="service_type"
                      value={form.service_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Property Address *</label>
                  <input
                    className="form-control"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      className="form-control"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Memphis"
                      required
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                    <div className="form-group">
                      <label>Preferred Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="preferred_date"
                        value={form.preferred_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label>Preferred Time</label>
                      <select
                        className="form-control"
                        name="preferred_time"
                        value={form.preferred_time}
                        onChange={handleChange}
                      >
                        <option value="">Any time</option>
                        <option value="morning">Morning (7am–12pm)</option>
                        <option value="afternoon">Afternoon (12pm–5pm)</option>
                        <option value="evening">Evening (5pm–7pm)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Details</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Tell us about your lawn size, current condition, specific concerns, or anything else that would help us give you the most accurate estimate..."
                    rows={4}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <button
                    type="submit"
                    className="btn btn--primary btn--lg"
                    disabled={submitting}
                  >
                    {submitting ? <><div className="spinner spinner--sm" /> Submitting...</> : "Submit Estimate Request →"}
                  </button>
                  <span style={{ fontSize: ".82rem", color: "var(--gray-500)" }}>
                    🔒 Your info is safe with us
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
