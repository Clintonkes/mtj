import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin",              icon: "📊", label: "Dashboard" },
  { to: "/admin/bookings",     icon: "📋", label: "Bookings" },
  { to: "/admin/messages",     icon: "✉️",  label: "Messages" },
  { to: "/admin/testimonials", icon: "⭐", label: "Testimonials" },
  { to: "/admin/services",     icon: "🌿", label: "Services" },
  { to: "/admin/gallery",      icon: "🖼️",  label: "Gallery" },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <span>🌿</span> M&TJ LLC
          </div>
          <div className="admin-sidebar__sub">Admin Dashboard</div>
        </div>

        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">Navigation</div>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-sidebar__link${
                pathname === item.to ? " admin-sidebar__link--active" : ""
              }`}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__link" style={{ marginBottom: ".4rem" }}>
            <span className="admin-sidebar__icon">🏠</span>
            View Site
          </Link>
          <button className="admin-sidebar__link" onClick={handleLogout}>
            <span className="admin-sidebar__icon">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar__title">{title}</h1>
          <div className="admin-topbar__actions">
            <Link to="/" className="btn btn--secondary btn--sm">← View Site</Link>
            <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
