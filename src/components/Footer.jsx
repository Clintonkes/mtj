import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">🌿 M&TJ LLC</span>
          <p className="footer__tagline">Professional Lawncare &amp; Landscaping</p>
          <p className="footer__desc">
            Serving the Memphis, TN area with pride. Quality you can see, reliability you can trust.
          </p>
        </div>

        <div className="footer__links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer__services">
          <h4>Our Services</h4>
          <span>Lawn Mowing</span>
          <span>Edging &amp; Trimming</span>
          <span>Seasonal Cleanup</span>
          <span>Mulching</span>
          <span>Weed Control</span>
          <span>Fertilization</span>
          <span>Shrub Maintenance</span>
          <span>Commercial Lawncare</span>
        </div>

        <div className="footer__contact">
          <h4>Contact Us</h4>
          <a href="tel:+19017417276" className="footer__contact-item">
            <span className="footer__contact-icon">📞</span>
            +1 (901) 741-7276
          </a>
          <a href="mailto:mtjllc@proton.me" className="footer__contact-item">
            <span className="footer__contact-icon">✉️</span>
            mtjllc@proton.me
          </a>
          <Link to="/estimate" className="btn btn--primary btn--sm footer__cta">
            Get Free Estimate
          </Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {year} M&TJ LLC. All rights reserved.</p>
        <p>Locally owned &amp; operated in Memphis, TN</p>
      </div>
    </footer>
  );
}
