import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const FALLBACK_SERVICES = [
  { id: 1, icon: "✂️", title: "Lawn Mowing & Edging", description: "Precision cuts and clean edges that give your lawn a professional, manicured look every time." },
  { id: 2, icon: "🌱", title: "Seasonal Cleanup", description: "Spring and fall cleanups to prep your yard for the season — leaf removal, bed clearing, and more." },
  { id: 3, icon: "🌿", title: "Mulching & Fertilization", description: "Nutrient-rich mulch applications and fertilization programs to keep your lawn lush and healthy." },
  { id: 4, icon: "🪴", title: "Shrub & Hedge Trimming", description: "Expert shaping and trimming of shrubs, hedges, and ornamental plants for curb appeal." },
  { id: 5, icon: "🌾", title: "Weed Control", description: "Targeted weed treatments that eliminate unwanted growth without harming your grass or plants." },
  { id: 6, icon: "🏢", title: "Commercial Lawncare", description: "Reliable, scheduled maintenance for businesses, HOAs, and commercial properties of all sizes." },
];

const FALLBACK_TESTIMONIALS = [
  { id: 1, author: "Marcus T.", location: "Memphis, TN", rating: 5, body: "M&TJ transformed my backyard completely. They're punctual, professional, and the results speak for themselves. Best lawncare service in Memphis!" },
  { id: 2, author: "Sandra R.", location: "Germantown, TN", rating: 5, body: "I've tried several lawn services over the years. M&TJ LLC is by far the most reliable. My lawn looks amazing every single week." },
  { id: 3, author: "James H.", location: "Collierville, TN", rating: 5, body: "Used them for our commercial property and they've been outstanding. Always on time and the quality is consistently excellent." },
];

function Stars({ n }) {
  return <span className="stars">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

export default function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.getServices()
      .then((data) => setServices(data?.length ? data.slice(0, 6) : FALLBACK_SERVICES))
      .catch(() => setServices(FALLBACK_SERVICES));

    api.getTestimonials()
      .then((data) => setTestimonials(data?.length ? data.slice(0, 3) : FALLBACK_TESTIMONIALS))
      .catch(() => setTestimonials(FALLBACK_TESTIMONIALS));
  }, []);

  const displayServices = services.length ? services : FALLBACK_SERVICES;
  const displayTestimonials = testimonials.length ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <>
      {/* ——— HERO ——— */}
      <section className="hero">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__content">
          <div className="hero__badge fade-up">
            <span>🌿</span> Memphis, TN's Trusted Lawn Pros
          </div>
          <h1 className="hero__title fade-up delay-100">
            A Lawn You'll Be<br />
            <em>Proud to Show Off</em>
          </h1>
          <p className="hero__subtitle fade-up delay-200">
            M&TJ LLC delivers professional lawncare and landscaping services throughout
            the Memphis area. Quality you can see, reliability you can trust — every visit.
          </p>
          <div className="hero__actions fade-up delay-300">
            <Link to="/estimate" className="btn btn--primary btn--lg">Get Free Estimate</Link>
            <Link to="/services" className="btn btn--outline-white btn--lg">Our Services</Link>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-arrow" />
        </div>
      </section>

      {/* ——— STATS BAR ——— */}
      <div className="stats-bar">
        <div className="stats-bar__grid">
          <div>
            <div className="stat-item__number">10+</div>
            <div className="stat-item__label">Years Experience</div>
          </div>
          <div>
            <div className="stat-item__number">500+</div>
            <div className="stat-item__label">Happy Clients</div>
          </div>
          <div>
            <div className="stat-item__number">100%</div>
            <div className="stat-item__label">Satisfaction Rate</div>
          </div>
          <div>
            <div className="stat-item__number">5★</div>
            <div className="stat-item__label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* ——— SERVICES ——— */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-label">What We Do</span>
            <h2 className="section-title">Professional Services for Every Lawn</h2>
            <div className="divider divider--center" />
            <p className="section-subtitle">
              From routine maintenance to seasonal transformations, we handle it all with
              care, expertise, and attention to detail.
            </p>
          </div>

          <div className="grid grid-3 mt-4">
            {displayServices.map((svc) => (
              <div key={svc.id} className="service-card">
                <div className="service-card__icon">{svc.icon || "🌿"}</div>
                <h3 className="service-card__title">{svc.title}</h3>
                <p className="service-card__desc">{svc.description}</p>
                <Link to="/services" className="service-card__link">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/services" className="btn btn--secondary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* ——— WHY CHOOSE US ——— */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <span className="section-label">Why M&TJ LLC</span>
              <h2 className="section-title">Memphis's Most Trusted Lawncare Team</h2>
              <div className="divider" />
              <p style={{ marginBottom: "2rem" }}>
                We're more than just a lawn service — we're your neighbors. Every property
                we care for gets the same attention and dedication we'd give our own.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {[
                  { icon: "✅", title: "Licensed & Insured", desc: "Fully licensed and insured for your complete peace of mind on every job." },
                  { icon: "🕐", title: "Always On Time", desc: "We respect your schedule. Expect us when we say — no waiting, no surprises." },
                  { icon: "💰", title: "Transparent Pricing", desc: "No hidden fees. Get a detailed estimate upfront and pay only what's agreed." },
                  { icon: "🌟", title: "Satisfaction Guaranteed", desc: "If you're not 100% satisfied, we'll come back and make it right — no charge." },
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { bg: "var(--forest)", text: "10+ Years\nServing Memphis" },
                { bg: "var(--grass)", text: "Locally Owned\n& Operated" },
                { bg: "var(--grass-mid)", text: "Eco-Friendly\nPractices" },
                { bg: "var(--forest-dark)", text: "Free\nEstimates" },
              ].map((box, i) => (
                <div key={i} style={{
                  background: box.bg,
                  borderRadius: "var(--r-md)",
                  padding: "2rem 1.5rem",
                  color: "var(--white)",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  minHeight: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {box.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— PROCESS ——— */}
      <section className="section section--dark">
        <div className="container text-center">
          <span className="section-label">How It Works</span>
          <h2 className="section-title text-white">Getting Started Is Simple</h2>
          <div className="divider divider--center" style={{ background: "var(--sage)" }} />
          <p className="section-subtitle mb-4" style={{ color: "rgba(255,255,255,.65)", marginBottom: "3rem" }}>
            From first contact to a beautifully maintained lawn — here's our simple 4-step process.
          </p>
          <div className="grid grid-4">
            {[
              { n: "1", title: "Request Estimate", desc: "Fill out our quick online form or give us a call to schedule your free estimate." },
              { n: "2", title: "On-Site Evaluation", desc: "We visit your property, assess your needs, and provide a detailed, no-obligation quote." },
              { n: "3", title: "We Get to Work", desc: "Our crew arrives on time, equipped with professional tools, and gets the job done right." },
              { n: "4", title: "You Enjoy the Results", desc: "Sit back and enjoy your beautiful lawn. We'll keep it looking great all season." },
            ].map((step) => (
              <div key={step.n} className="process-step">
                <div className="process-step__num">{step.n}</div>
                <div className="process-step__title" style={{ color: "var(--white)" }}>{step.title}</div>
                <div className="process-step__desc" style={{ color: "rgba(255,255,255,.6)" }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— TESTIMONIALS ——— */}
      <section className="section section--cream">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-label">Client Reviews</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="divider divider--center" />
          </div>

          <div className="grid grid-3">
            {displayTestimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <Stars n={t.rating} />
                <p className="testimonial-card__text">"{t.body}"</p>
                <div>
                  <div className="testimonial-card__author">{t.author || t.customer_name}</div>
                  {t.location && <div className="testimonial-card__location">{t.location}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/testimonials" className="btn btn--secondary">Read More Reviews</Link>
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="cta-section">
        <h2>Ready for a Beautiful Lawn?</h2>
        <p>
          Join hundreds of satisfied customers across Memphis and the surrounding area.
          Get your free, no-obligation estimate today.
        </p>
        <div className="btn-group">
          <Link to="/estimate" className="btn btn--white btn--lg">Get Free Estimate</Link>
          <a href="tel:+19017417276" className="btn btn--outline-white btn--lg">📞 (901) 741-7276</a>
        </div>
      </section>
    </>
  );
}
