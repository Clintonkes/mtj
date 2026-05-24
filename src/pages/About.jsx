import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      {/* ——— BANNER ——— */}
      <div className="page-banner">
        <div className="page-banner__inner">
          <h1>About M&TJ LLC</h1>
          <p>Locally owned, community-driven, and passionate about great lawns.</p>
        </div>
      </div>

      {/* ——— STORY ——— */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="section-title">Built on Hard Work & Community Pride</h2>
              <div className="divider" />
              <p style={{ marginBottom: "1.25rem" }}>
                M&TJ LLC was founded right here in Memphis, Tennessee with one simple belief:
                every property deserves to look its best. What started as a small neighborhood
                lawn service has grown into one of the area's most trusted names in professional
                lawncare and landscaping.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                We're a family-run operation that takes immense pride in every yard we service.
                When you hire M&TJ LLC, you're not just getting a lawn crew — you're getting
                neighbors who genuinely care about how your property looks and how you feel
                about it.
              </p>
              <p>
                From single-family homes in Germantown to commercial properties downtown, we
                bring the same level of commitment, precision, and professionalism to every
                single job.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{
                background: "linear-gradient(135deg, var(--forest), var(--grass))",
                borderRadius: "var(--r-lg)",
                padding: "3rem 2.5rem",
                color: "var(--white)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "3.5rem", fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1 }}>10+</div>
                <div style={{ color: "var(--sage-pale)", marginTop: ".5rem", fontWeight: 600 }}>Years Serving Memphis</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { num: "500+", label: "Properties Maintained" },
                  { num: "5★", label: "Average Google Rating" },
                  { num: "100%", label: "Satisfaction Guarantee" },
                  { num: "0", label: "Hidden Fees" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "var(--cream)",
                    borderRadius: "var(--r-md)",
                    padding: "1.5rem",
                    textAlign: "center",
                    border: "1.5px solid var(--gray-100)",
                  }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "var(--grass)", lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--gray-500)", marginTop: ".3rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— MISSION & VALUES ——— */}
      <section className="section section--cream">
        <div className="container text-center">
          <span className="section-label">Our Values</span>
          <h2 className="section-title">What We Stand For</h2>
          <div className="divider divider--center" />
          <p className="section-subtitle mb-4" style={{ marginBottom: "3rem" }}>
            Every decision we make is guided by these core principles.
          </p>
          <div className="grid grid-4">
            {[
              { icon: "🤝", title: "Integrity", desc: "We do what we say, when we say. Our word is our bond — no shortcuts, no excuses." },
              { icon: "⭐", title: "Excellence", desc: "Good enough is never good enough. We push for perfection on every property we touch." },
              { icon: "🌱", title: "Sustainability", desc: "We use eco-conscious methods and products that are safe for your family, pets, and the environment." },
              { icon: "💼", title: "Professionalism", desc: "From our uniforms to our equipment, everything we do reflects our commitment to professionalism." },
            ].map((v) => (
              <div key={v.title} style={{
                background: "var(--white)",
                borderRadius: "var(--r-md)",
                padding: "2rem",
                border: "1.5px solid var(--gray-100)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: ".85rem",
                textAlign: "center",
              }}>
                <div style={{
                  width: 60, height: 60,
                  background: "var(--sage-pale)",
                  borderRadius: "var(--r-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "1.05rem" }}>{v.title}</h3>
                <p style={{ fontSize: ".88rem" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SERVICE AREA ——— */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: "2.5rem" }}>
            <span className="section-label">Coverage</span>
            <h2 className="section-title">Areas We Serve</h2>
            <div className="divider divider--center" />
            <p className="section-subtitle">
              Based in Memphis, TN — proudly serving the greater Memphis metropolitan area and surrounding communities.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", justifyContent: "center" }}>
            {[
              "Memphis", "Germantown", "Collierville", "Bartlett", "Cordova",
              "Olive Branch", "Southaven", "Lakeland", "Arlington", "Millington",
            ].map((city) => (
              <span key={city} className="tag" style={{ fontSize: ".9rem", padding: ".4rem 1rem" }}>{city}</span>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--gray-500)", fontSize: ".9rem" }}>
            Don't see your area listed? Give us a call — we may still be able to help!
          </p>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="cta-section">
        <h2>Ready to Work With Us?</h2>
        <p>Experience the M&TJ difference. Get your free, no-obligation estimate today.</p>
        <div className="btn-group">
          <Link to="/estimate" className="btn btn--white btn--lg">Get Free Estimate</Link>
          <Link to="/contact" className="btn btn--outline-white btn--lg">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
