import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useConfirm } from "../../hooks/useConfirm";

const BADGE = {
  unread:  "badge--amber",
  read:    "badge--gray",
  replied: "badge--green",
};

export default function AdminMessages() {
  const { token } = useAuth();
  const { confirm: confirmDelete, ConfirmDialog } = useConfirm();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, [token]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.adminGetMessages(token);
      setMessages(data || []);
    } catch {
      showToast("Failed to load messages", true);
    } finally {
      setLoading(false);
    }
  }

  async function openMessage(msg) {
    setSelected(msg);
    setReply("");
    // Mark as read if unread
    if (msg.status === "unread") {
      try {
        await api.adminGetMessage(msg.id, token);
        setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: "read" } : m));
        setSelected((s) => s ? { ...s, status: "read" } : s);
      } catch {}
    }
  }

  async function sendReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.adminReplyMessage(selected.id, reply, token);
      setMessages((prev) => prev.map((m) => m.id === selected.id ? { ...m, status: "replied", reply } : m));
      setSelected((s) => s ? { ...s, status: "replied", reply } : s);
      showToast("Reply saved");
      setReply("");
    } catch {
      showToast("Failed to save reply", true);
    } finally {
      setSending(false);
    }
  }

  async function deleteMessage(id) {
    if (!await confirmDelete("Delete this message? This cannot be undone.")) return;
    try {
      await api.adminDeleteMessage(id, token);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      showToast("Message deleted");
    } catch {
      showToast("Failed to delete", true);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);

  return (
    <AdminLayout title="Messages">
      {ConfirmDialog}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>{filtered.length} Message{filtered.length !== 1 ? "s" : ""}</h2>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <select
              className="form-control"
              style={{ width: "auto", padding: ".4rem .8rem", fontSize: ".85rem" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
            <button className="btn btn--secondary btn--sm" onClick={load}>↻ Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">✉️</div>
            <h3>No Messages</h3>
            <p>No messages match the current filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} style={{ fontWeight: m.status === "unread" ? 700 : 400 }}>
                    <td>{m.full_name}</td>
                    <td style={{ fontSize: ".85rem" }}>{m.email}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-500)" }}>{m.subject || "—"}</td>
                    <td style={{ fontSize: ".82rem", color: "var(--gray-500)" }}>
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td><span className={`badge ${BADGE[m.status] || "badge--gray"}`}>{m.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => openMessage(m)} title="View & Reply">👁️</button>
                        <button className="icon-btn icon-btn--danger" onClick={() => deleteMessage(m.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
            <h2>Message from {selected.full_name}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1.25rem" }}>
              {[
                ["From", selected.full_name],
                ["Email", <a href={`mailto:${selected.email}`} style={{ color: "var(--grass)" }}>{selected.email}</a>],
                ["Phone", selected.phone || "—"],
                ["Received", new Date(selected.created_at).toLocaleString()],
                ["Subject", selected.subject || "—", "1/-1"],
              ].map(([k, v, span]) => (
                <div key={k} style={span ? { gridColumn: span } : {}}>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--gray-500)", marginBottom: ".2rem" }}>{k}</div>
                  <div style={{ fontSize: ".9rem" }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--gray-500)", marginBottom: ".35rem" }}>Message</div>
              <div style={{ background: "var(--gray-100)", padding: "1rem", borderRadius: "var(--r-sm)", fontSize: ".9rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {selected.body}
              </div>
            </div>

            {selected.reply && (
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--grass)", marginBottom: ".35rem" }}>Your Reply (Saved)</div>
                <div style={{ background: "var(--sage-pale)", padding: "1rem", borderRadius: "var(--r-sm)", fontSize: ".9rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {selected.reply}
                </div>
              </div>
            )}

            {selected.status !== "replied" && (
              <form onSubmit={sendReply}>
                <div className="form-group" style={{ marginBottom: ".75rem" }}>
                  <label>Reply Notes (internal)</label>
                  <textarea
                    className="form-control"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Add a reply note..."
                    rows={3}
                    required
                  />
                </div>
                <button type="submit" className="btn btn--primary btn--sm" disabled={sending}>
                  {sending ? <><div className="spinner spinner--sm" /> Saving...</> : "Save Reply"}
                </button>
              </form>
            )}

            <div className="modal-footer">
              <button className="btn btn--danger btn--sm" onClick={() => deleteMessage(selected.id)}>Delete</button>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your Message"}`}
                className="btn btn--secondary btn--sm">
                ✉️ Email Client
              </a>
              <button className="btn btn--ghost btn--sm" onClick={() => setSelected(null)}>Close</button>
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
