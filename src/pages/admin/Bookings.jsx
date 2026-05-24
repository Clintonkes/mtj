import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";

const STATUS_OPTS = ["pending", "approved", "completed", "cancelled"];
const BADGE = {
  pending:   "badge--amber",
  approved:  "badge--green",
  completed: "badge--blue",
  cancelled: "badge--red",
};

export default function AdminBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    load();
  }, [token]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.adminGetBookings(token);
      setBookings(data || []);
    } catch {
      showToast("Failed to load bookings", true);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.adminUpdateBookingStatus(id, status, token);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      showToast(`Booking marked as ${status}`);
      if (selected?.id === id) setSelected((s) => ({ ...s, status }));
    } catch {
      showToast("Failed to update status", true);
    }
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await api.adminDeleteBooking(id, token);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) setSelected(null);
      showToast("Booking deleted");
    } catch {
      showToast("Failed to delete booking", true);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <AdminLayout title="Bookings">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>{filtered.length} Booking{filtered.length !== 1 ? "s" : ""}</h2>
          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            <select
              className="form-control"
              style={{ width: "auto", padding: ".4rem .8rem", fontSize: ".85rem" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button className="btn btn--secondary btn--sm" onClick={load}>↻ Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h3>No Bookings Found</h3>
            <p>No bookings match the selected filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Phone</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <button
                        style={{ fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "var(--grass)", padding: 0 }}
                        onClick={() => setSelected(b)}
                      >
                        {b.full_name}
                      </button>
                    </td>
                    <td>{b.service_type}</td>
                    <td>{b.phone}</td>
                    <td style={{ fontSize: ".82rem", color: "var(--gray-500)" }}>
                      {new Date(b.created_at).toLocaleDateString()}
                    </td>
                    <td><span className={`badge ${BADGE[b.status] || "badge--gray"}`}>{b.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <select
                          className="form-control"
                          style={{ width: "auto", padding: ".3rem .6rem", fontSize: ".8rem" }}
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                        >
                          {STATUS_OPTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button className="icon-btn" onClick={() => setSelected(b)} title="View details">👁️</button>
                        <button className="icon-btn icon-btn--danger" onClick={() => deleteBooking(b.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Booking Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {[
                ["Name", selected.full_name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Service", selected.service_type],
                ["Address", selected.address],
                ["City", selected.city],
                ["Preferred Date", selected.preferred_date || "—"],
                ["Preferred Time", selected.preferred_time || "—"],
                ["Submitted", new Date(selected.created_at).toLocaleString()],
                ["Status", <span className={`badge ${BADGE[selected.status]}`}>{selected.status}</span>],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--gray-500)", marginBottom: ".2rem" }}>{k}</div>
                  <div style={{ fontSize: ".9rem" }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.notes && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--gray-500)", marginBottom: ".35rem" }}>Additional Notes</div>
                <p style={{ fontSize: ".9rem", background: "var(--gray-100)", padding: ".75rem 1rem", borderRadius: "var(--r-sm)" }}>{selected.notes}</p>
              </div>
            )}
            <div className="modal-footer">
              <button className="btn btn--danger btn--sm" onClick={() => deleteBooking(selected.id)}>Delete</button>
              <select
                className="form-control"
                style={{ width: "auto", padding: ".45rem .8rem", fontSize: ".875rem" }}
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
              >
                {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn--secondary btn--sm" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast${toast.isError ? " toast--error" : ""}`}>{toast.msg}</div>
      )}
    </AdminLayout>
  );
}
