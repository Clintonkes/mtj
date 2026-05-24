import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";

const BADGE = {
  pending:     "badge--amber",
  published:   "badge--green",
  unpublished: "badge--gray",
};

export default function AdminTestimonials() {
  const { token } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, [token]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.adminGetTestimonials(token);
      setTestimonials(data || []);
    } catch {
      showToast("Failed to load testimonials", true);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.adminUpdateTestimonialStatus(id, status, token);
      setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
      showToast(`Review ${status}`);
    } catch {
      showToast("Failed to update status", true);
    }
  }

  async function deleteTestimonial(id) {
    if (!confirm("Delete this review permanently?")) return;
    try {
      await api.adminDeleteTestimonial(id, token);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast("Review deleted");
    } catch {
      showToast("Failed to delete", true);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = filter === "all" ? testimonials : testimonials.filter((t) => t.status === filter);

  return (
    <AdminLayout title="Testimonials">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>{filtered.length} Review{filtered.length !== 1 ? "s" : ""}</h2>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <select
              className="form-control"
              style={{ width: "auto", padding: ".4rem .8rem", fontSize: ".85rem" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
            <button className="btn btn--secondary btn--sm" onClick={load}>↻ Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">⭐</div>
            <h3>No Reviews</h3>
            <p>No reviews match the current filter.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((t) => (
              <div key={t.id} style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--gray-100)",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}>
                {/* Stars */}
                <div style={{ flexShrink: 0, color: "var(--amber)", fontSize: "1rem", letterSpacing: "2px", minWidth: "80px" }}>
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: ".25rem" }}>
                    {t.author_name}
                    {t.location && <span style={{ fontWeight: 400, color: "var(--gray-500)", marginLeft: ".5rem", fontSize: ".82rem" }}>{t.location}</span>}
                  </div>
                  <p style={{ fontSize: ".88rem", color: "var(--gray-700)", fontStyle: "italic", lineHeight: 1.7 }}>"{t.body}"</p>
                  <div style={{ fontSize: ".75rem", color: "var(--gray-500)", marginTop: ".4rem" }}>
                    {new Date(t.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Status + Actions */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: ".5rem", alignItems: "flex-end" }}>
                  <span className={`badge ${BADGE[t.status] || "badge--gray"}`}>{t.status}</span>
                  <div className="table-actions">
                    {t.status !== "published" && (
                      <button
                        className="btn btn--primary btn--sm"
                        style={{ fontSize: ".75rem", padding: ".3rem .7rem" }}
                        onClick={() => updateStatus(t.id, "published")}
                      >
                        Publish
                      </button>
                    )}
                    {t.status === "published" && (
                      <button
                        className="btn btn--secondary btn--sm"
                        style={{ fontSize: ".75rem", padding: ".3rem .7rem" }}
                        onClick={() => updateStatus(t.id, "unpublished")}
                      >
                        Unpublish
                      </button>
                    )}
                    <button className="icon-btn icon-btn--danger" onClick={() => deleteTestimonial(t.id)} title="Delete">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast${toast.isError ? " toast--error" : ""}`}>{toast.msg}</div>
      )}
    </AdminLayout>
  );
}
