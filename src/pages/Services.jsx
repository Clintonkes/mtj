import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const FALLBACK = [
  { id: 1, icon: "✂️", title: "Lawn Mowing", description: "Regular mowing at the ideal height for your grass type, ensuring a healthy, uniform cut every time. We bag clippings or mulch as preferred." },
  { id: 2, icon: "📐", title: "Edging & Trimming", description: "Crisp, clean edges along sidewalks, driveways, flower beds, and curbs. Detailed string trimming around all obstacles." },
  { id: 3, icon: "🍂", title: "Seasonal Cleanup", description: "Spring and fall cleanups including leaf removal, bed clearing, debris hauling, and general yard tidying to keep your property pristine." },
  { id: 4, icon: "🌱", title: "Mulching", description: "Premium mulch application in flower beds and around trees to retain moisture, suppress weeds, and give your landscape a polished look." },
  { id: 5, icon: "💧", title: "Fertilization Programs", description: "Customized fertilization schedules using the right nutrients at the right time to promote deep-rooted, vibrant grass all year." },
  { id: 6, icon: "🌾", title: "Weed Control", description: "Pre- and post-emergent weed treatments to keep dandelions, crabgrass, and other invaders out of your lawn and beds." },
  { id: 7, icon: "🪴", title: "Shrub & Hedge Trimming", description: "Expert shaping, trimming, and maintenance of bushes, shrubs, and decorative hedges to enhance your curb appeal." },
  { id: 8, icon: "🏢", title: "Commercial Lawncare", description: "Reliable, professional maintenance programs for HOAs, commercial properties, office parks, and retail centers." },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then((d) => setServices(d?.length ? d : FALLBACK))
      .catch(() => setServices(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const list = services.length ? services : FALLBACK;

  return (
    <>
      <div className="page-banner">
        <div className="page-banner__inner">
          <h1>Our Services</h1>
          <p>Comprehensive lawncare and landscaping solutions for every property.</p>
        </div>
      </div>

      {/* ——— SERVICES GRID ——— */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-label">Full Service Menu</span>
            <h2 className="section-title">Everything Your Lawn Needs</h2>
            <div className="divider divider--center" />
            <p className="section-subtitle">
              We offer a complete range of lawn and landscape services — whether you need a
              one-time cleanup or a recurring maintenance program.
            </p>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : (
            <div className="grid grid-3 mt-4">
              {list.map((svc) => (
                <div key={svc.id} className="service-card">
                  <div className="service-card__icon">{svc.icon || "🌿"}</div>
                  <h3 className="service-card__title">{svc.title}</h3>
                  <p className="service-card__desc">{svc.description}</p>
                  <Link to="/estimate" className="service-card__link">Get a quote →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ——— WHY PROFESSIONAL ——— */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <span className="section-label">Why Professional Matters</span>
              <h2 className="section-title">More Than Just Mowing</h2>
              <div className="divider" />
              <p style={{ marginBottom: "1.25rem" }}>
                A healthy lawn requires expertise — the right mowing height, proper fertilization
                timing, correct watering practices, and targeted pest and weed management. DIY
                approaches often lead to scalped grass, patchy growth, and expensive recovery.
              </p>
              <p style={{ marginBottom: "2rem" }}>
                M&TJ LLC brings professional-grade equipment, horticultural knowledge, and years
                of Memphis-specific experience to ensure your lawn thrives in every season.
              </p>
              <Link to="/estimate" className="btn btn--primary">Schedule Service</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: "🔧", title: "Professional Equipment", desc: "Commercial-grade mowers and tools that deliver cleaner cuts and better results." },
                { icon: "📅", title: "Consistent Scheduling", desc: "Never worry about your lawn again — we maintain a reliable service schedule." },
                { icon: "🌡️", title: "Seasonal Expertise", desc: "We know what Memphis lawns need in every season — spring, summer, fall, and winter." },
                { icon: "💬", title: "Responsive Communication", desc: "Easy booking, transparent pricing, and quick responses to all your questions." },
              ].map((f) => (
                <div key={f.title} className="feature-item">
                  <div className="feature-item__icon">{f.icon}</div>
                  <div>
                    <div className="feature-item__title">{f.title}</div>
                    <div className="feature-item__desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— SERVICE PLANS ——— */}
      <section className="section">
        <div className="container text-center">
          <span className="section-label">Service Options</span>
          <h2 className="section-title">Flexible Plans to Fit Your Needs</h2>
          <div className="divider divider--center" />
          <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
            Whether you need a one-time visit or ongoing maintenance, we have a plan for you.
          </p>
          <div className="grid grid-3">
            {[
              {
                name: "One-Time Service",
                icon: "🗓️",
                desc: "Perfect for spring cleanups, pre-event prep, or trying us out for the first time.",
                features: ["Single visit", "Any service type", "No commitment", "Free estimate"],
              },
              {
                name: "Monthly Maintenance",
                icon: "📆",
                desc: "Scheduled monthly visits to keep your property looking great all year.",
                features: ["Monthly visits", "Priority scheduling", "Discounted rates", "Seasonal adjustments"],
                highlight: true,
              },
              {
                name: "Weekly Program",
                icon: "🔄",
                desc: "Our most comprehensive option for properties that demand the very best.",
                features: ["Weekly visits", "Full service menu", "Best pricing", "Dedicated crew"],
              },
            ].map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "var(--forest)" : "var(--white)",
                borderRadius: "var(--r-md)",
                padding: "2.5rem 2rem",
                border: plan.highlight ? "2px solid var(--grass)" : "1.5px solid var(--gray-100)",
                boxShadow: plan.highlight ? "var(--shadow-green)" : "var(--shadow-sm)",
                color: plan.highlight ? "var(--white)" : "inherit",
                position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: "var(--grass)", color: "var(--white)",
                    fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
                    padding: ".3rem 1rem", borderRadius: "var(--r-full)",
                  }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{plan.icon}</div>
                <h3 style={{ color: plan.highlight ? "var(--white)" : "var(--charcoal)", marginBottom: ".75rem" }}>{plan.name}</h3>
                <p style={{ color: plan.highlight ? "rgba(255,255,255,.72)" : "var(--gray-500)", fontSize: ".9rem", marginBottom: "1.5rem" }}>{plan.desc}</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "2rem" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".88rem", color: plan.highlight ? "rgba(255,255,255,.8)" : "var(--gray-700)" }}>
                      <span style={{ color: plan.highlight ? "var(--sage)" : "var(--grass)" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/estimate" className={`btn ${plan.highlight ? "btn--primary" : "btn--secondary"} btn--sm`} style={{ width: "100%", justifyContent: "center" }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="cta-section">
        <h2>Not Sure What You Need?</h2>
        <p>Let us help. We'll assess your property and recommend the right services for your lawn and budget.</p>
        <div className="btn-group">
          <Link to="/estimate" className="btn btn--white btn--lg">Request Free Assessment</Link>
          <a href="tel:+19017417276" className="btn btn--outline-white btn--lg">📞 Call Us</a>
        </div>
      </section>
    </>
  );
}
