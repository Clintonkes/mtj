import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";

const STATUS_BADGE = {
  pending:   "badge--amber",
  approved:  "badge--green",
  completed: "badge--blue",
  cancelled: "badge--red",
  unread:    "badge--amber",
  read:      "badge--gray",
  replied:   "badge--green",
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.adminGetBookings(token).catch(() => []),
      api.adminGetMessages(token).catch(() => []),
      api.adminGetTestimonials(token).catch(() => []),
    ]).then(([b, m, t]) => {
      setBookings(b || []);
      setMessages(m || []);
      setTestimonials(t || []);
    }).finally(() => setLoading(false));
  }, [token]);

  const pendingBookings  = bookings.filter((b) => b.status === "pending");
  const unreadMessages   = messages.filter((m) => m.status === "unread");
  const pendingReviews   = testimonials.filter((t) => t.status === "pending");

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="loading-state"><div className="spinner" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--green">📋</div>
          <div>
            <div className="admin-stat__num">{bookings.length}</div>
            <div className="admin-stat__label">Total Bookings</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--amber">✉️</div>
          <div>
            <div className="admin-stat__num">{unreadMessages.length}</div>
            <div className="admin-stat__label">Unread Messages</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--blue">⭐</div>
          <div>
            <div className="admin-stat__num">{pendingReviews.length}</div>
            <div className="admin-stat__label">Pending Reviews</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--purple">📋</div>
          <div>
            <div className="admin-stat__num">{pendingBookings.length}</div>
            <div className="admin-stat__label">Pending Bookings</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent Bookings */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2>Recent Bookings</h2>
            <Link to="/admin/bookings" className="btn btn--ghost btn--sm">View all →</Link>
          </div>
          {pendingBookings.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--gray-500)", fontSize: ".9rem" }}>
              No pending bookings.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.full_name}</td>
                    <td style={{ fontSize: ".85rem" }}>{b.service_type}</td>
                    <td><span className={`badge ${STATUS_BADGE[b.status] || "badge--gray"}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2>Recent Messages</h2>
            <Link to="/admin/messages" className="btn btn--ghost btn--sm">View all →</Link>
          </div>
          {messages.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--gray-500)", fontSize: ".9rem" }}>
              No messages yet.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.slice(0, 5).map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.full_name}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-500)" }}>{m.subject || "—"}</td>
                    <td><span className={`badge ${STATUS_BADGE[m.status] || "badge--gray"}`}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link to="/admin/bookings" className="btn btn--secondary btn--sm">📋 Manage Bookings</Link>
          <Link to="/admin/messages" className="btn btn--secondary btn--sm">✉️ View Messages</Link>
          <Link to="/admin/testimonials" className="btn btn--secondary btn--sm">⭐ Moderate Reviews</Link>
          <Link to="/admin/services" className="btn btn--secondary btn--sm">🌿 Edit Services</Link>
          <Link to="/admin/gallery" className="btn btn--secondary btn--sm">🖼️ Manage Gallery</Link>
        </div>
      </div>
    </AdminLayout>
  );
}
