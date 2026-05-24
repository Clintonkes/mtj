import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.getGallery()
      .then((d) => setImages(d || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="page-banner">
        <div className="page-banner__inner">
          <h1>Our Work</h1>
          <p>See the results we deliver — beautiful lawns and landscapes across Memphis.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-label">Portfolio</span>
            <h2 className="section-title">Before & After, Start to Finish</h2>
            <div className="divider divider--center" />
            <p className="section-subtitle">
              Every photo tells a story of a property transformed. Browse our portfolio
              and imagine what we can do for your lawn.
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading gallery...</span>
            </div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📷</div>
              <h3>Gallery Coming Soon</h3>
              <p>We're uploading photos of our work. Check back soon!</p>
              <Link to="/estimate" className="btn btn--primary" style={{ marginTop: "1.5rem" }}>
                Request an Estimate
              </Link>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="gallery-item"
                  onClick={() => setLightbox(img)}
                >
                  <img
                    src={api.galleryImageUrl(img.image_filename)}
                    alt={img.description || "Lawn care work"}
                    loading="lazy"
                  />
                  <div className="gallery-item__overlay">🔍</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ——— LIGHTBOX ——— */}
      {lightbox && (
        <div
          className="modal-overlay"
          onClick={() => setLightbox(null)}
        >
          <div
            style={{ maxWidth: "90vw", maxHeight: "90vh", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={api.galleryImageUrl(lightbox.filename)}
              alt={lightbox.caption || "Gallery image"}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "var(--r-md)",
                display: "block",
              }}
            />
            {lightbox.caption && (
              <div style={{
                background: "rgba(0,0,0,.7)",
                color: "var(--white)",
                padding: ".75rem 1rem",
                borderRadius: "0 0 var(--r-md) var(--r-md)",
                fontSize: ".9rem",
              }}>
                {lightbox.caption}
              </div>
            )}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute", top: "-14px", right: "-14px",
                background: "var(--white)", border: "none", cursor: "pointer",
                width: "36px", height: "36px", borderRadius: "50%",
                fontSize: "1rem", boxShadow: "var(--shadow-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ——— CTA ——— */}
      <section className="cta-section">
        <h2>Like What You See?</h2>
        <p>Let us bring the same results to your property. Get your free estimate today.</p>
        <div className="btn-group">
          <Link to="/estimate" className="btn btn--white btn--lg">Get Free Estimate</Link>
          <Link to="/contact" className="btn btn--outline-white btn--lg">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
