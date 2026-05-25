import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin",          icon: "📊", label: "Dashboard" },
  { to: "/admin/bookings", icon: "📋", label: "Bookings" },
  { to: "/admin/messages", icon: "✉️",  label: "Messages" },
  { to: "/admin/services", icon: "🌿", label: "Services" },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  function confirmLogout() { setShowLogout(true); }
  function cancelLogout()  { setShowLogout(false); }
  function doLogout()      { logout(); }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo"><span>🌿</span> M&TJ LLC</div>
          <div className="admin-sidebar__sub">Admin Dashboard</div>
        </div>

        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">Navigation</div>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-sidebar__link${pathname === item.to ? " admin-sidebar__link--active" : ""}`}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar__link" style={{ marginBottom: ".4rem" }}>
            <span className="admin-sidebar__icon">🏠</span>
            View Site
          </a>
          <button className="admin-sidebar__link" onClick={confirmLogout}>
            <span className="admin-sidebar__icon">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar__title">{title}</h1>
          <div className="admin-topbar__actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">↗ View Site</a>
            <button className="btn btn--ghost btn--sm" onClick={confirmLogout}>Sign Out</button>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>

      {/* Logout confirmation modal */}
      {showLogout && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal" style={{ maxWidth: "380px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>🚪</div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>Sign Out?</h2>
            <p style={{ color: "var(--gray-500)", fontSize: ".9rem", marginBottom: 0 }}>
              You'll be returned to the login page. Any unsaved changes will be lost.
            </p>
            <div className="modal-footer" style={{ justifyContent: "center" }}>
              <button className="btn btn--ghost btn--sm" onClick={cancelLogout}>Stay</button>
              <button className="btn btn--danger btn--sm" onClick={doLogout}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
