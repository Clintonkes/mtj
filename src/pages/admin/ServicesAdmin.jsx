import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";

const EMPTY_FORM = { title: "", description: "", icon: "", is_active: true };
const ICONS = ["✂️", "🌱", "🌿", "🍂", "💧", "🌾", "🪴", "🏢", "🔧", "🌳", "🏡", "⭐"];

export default function AdminServices() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | {editing service}
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { load(); }, [token]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.adminGetServices(token);
      setServices(data || []);
    } catch {
      showToast("Failed to load services", true);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setModal("create");
  }

  function openEdit(svc) {
    setForm({ title: svc.title, description: svc.description, icon: svc.icon || "", is_active: svc.is_active });
    setModal(svc);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "create") {
        const created = await api.adminCreateService(form, token);
        setServices((prev) => [created, ...prev]);
        showToast("Service created");
      } else {
        const updated = await api.adminUpdateService(modal.id, form, token);
        setServices((prev) => prev.map((s) => s.id === modal.id ? updated : s));
        showToast("Service updated");
      }
      setModal(null);
    } catch (err) {
      showToast(err.message || "Failed to save", true);
    } finally {
      setSaving(false);
    }
  }

  async function deleteService(id) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    try {
      await api.adminDeleteService(id, token);
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast("Service deleted");
    } catch {
      showToast("Failed to delete", true);
    }
  }

  async function toggleActive(svc) {
    try {
      const updated = await api.adminUpdateService(svc.id, { ...svc, is_active: !svc.is_active }, token);
      setServices((prev) => prev.map((s) => s.id === svc.id ? updated : s));
    } catch {
      showToast("Failed to update", true);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <AdminLayout title="Services">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>{services.length} Service{services.length !== 1 ? "s" : ""}</h2>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <button className="btn btn--secondary btn--sm" onClick={load}>↻ Refresh</button>
            <button className="btn btn--primary btn--sm" onClick={openCreate}>+ Add Service</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🌿</div>
            <h3>No Services Yet</h3>
            <p>Add your first service to get started.</p>
            <button className="btn btn--primary" style={{ marginTop: "1rem" }} onClick={openCreate}>Add Service</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc.id}>
                    <td style={{ fontSize: "1.5rem" }}>{svc.icon || "🌿"}</td>
                    <td style={{ fontWeight: 600 }}>{svc.title}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-500)", maxWidth: "320px" }}>
                      <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {svc.description}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${svc.is_active ? "badge--green" : "badge--gray"}`}>
                        {svc.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => openEdit(svc)} title="Edit">✏️</button>
                        <button className="icon-btn" onClick={() => toggleActive(svc)} title={svc.is_active ? "Deactivate" : "Activate"}>
                          {svc.is_active ? "👁️" : "🙈"}
                        </button>
                        <button className="icon-btn icon-btn--danger" onClick={() => deleteService(svc.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal === "create" ? "Add New Service" : "Edit Service"}</h2>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div className="form-group">
                <label>Service Name *</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Lawn Mowing & Edging"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe this service..."
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Icon (emoji)</label>
                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: ".5rem" }}>
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      style={{
                        fontSize: "1.4rem",
                        padding: ".2rem .4rem",
                        border: `2px solid ${form.icon === ic ? "var(--grass)" : "var(--gray-300)"}`,
                        borderRadius: "var(--r-sm)",
                        background: form.icon === ic ? "var(--sage-pale)" : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
                <input
                  className="form-control"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="Or type any emoji"
                  maxLength={4}
                />
              </div>
              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: ".75rem" }}>
                <input
                  type="checkbox"
                  id="active-check"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  style={{ width: "18px", height: "18px" }}
                />
                <label htmlFor="active-check" style={{ margin: 0 }}>Active (visible to public)</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                  {saving ? <><div className="spinner spinner--sm" /> Saving...</> : modal === "create" ? "Create Service" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast${toast.isError ? " toast--error" : ""}`}>{toast.msg}</div>
      )}
    </AdminLayout>
  );
}
