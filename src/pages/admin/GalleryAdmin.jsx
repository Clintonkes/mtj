import { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useConfirm } from "../../hooks/useConfirm";

export default function AdminGallery() {
  const { token } = useAuth();
  const { confirm: confirmDelete, ConfirmDialog } = useConfirm();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const fileRef = useRef(null);

  useEffect(() => { load(); }, [token]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.adminGetGallery(token);
      setImages(data || []);
    } catch {
      showToast("Failed to load gallery", true);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    setUploading(true);
    try {
      const newImg = await api.adminUploadGallery(formData, token);
      setImages((prev) => [newImg, ...prev]);
      showToast("Image uploaded successfully");
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      showToast(err.message || "Upload failed", true);
    } finally {
      setUploading(false);
    }
  }

  async function toggleStatus(img) {
    const newStatus = img.status === "published" ? "unpublished" : "published";
    try {
      await api.adminUpdateGalleryStatus(img.id, newStatus, token);
      setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, status: newStatus } : i));
      showToast(`Image ${newStatus}`);
    } catch {
      showToast("Failed to update status", true);
    }
  }

  async function deleteImage(id) {
    if (!await confirmDelete("Delete this image permanently?")) return;
    try {
      await api.adminDeleteGallery(id, token);
      setImages((prev) => prev.filter((i) => i.id !== id));
      showToast("Image deleted");
    } catch {
      showToast("Failed to delete", true);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = filter === "all" ? images : images.filter((i) => i.status === filter);

  return (
    <AdminLayout title="Gallery">
      {ConfirmDialog}
      {/* Upload card */}
      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-card__header">
          <h2>Upload New Image</h2>
        </div>
        <div className="admin-card__body">
          <form onSubmit={handleUpload} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: "1 1 260px" }}>
              <label>Image File (JPG, PNG, WEBP — max 10MB) *</label>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="form-control"
                required
              />
            </div>
            <div className="form-group" style={{ flex: "1 1 260px" }}>
              <label>Image Title *</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lawn transformation in Germantown"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={uploading}
              style={{ flexShrink: 0 }}
            >
              {uploading ? <><div className="spinner spinner--sm" /> Uploading...</> : "📤 Upload Image"}
            </button>
          </form>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>{filtered.length} Image{filtered.length !== 1 ? "s" : ""}</h2>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <select
              className="form-control"
              style={{ width: "auto", padding: ".4rem .8rem", fontSize: ".85rem" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
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
            <div className="empty-state__icon">🖼️</div>
            <h3>No Images Yet</h3>
            <p>Upload your first image using the form above.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
            padding: "1.5rem",
          }}>
            {filtered.map((img) => (
              <div key={img.id} style={{
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                border: "1.5px solid var(--gray-100)",
                background: "var(--white)",
                boxShadow: "var(--shadow-xs)",
              }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <img
                    src={api.galleryImageUrl(img.image_filename)}
                    alt={img.description || "Gallery"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div style={{
                    position: "absolute", top: ".5rem", right: ".5rem",
                  }}>
                    <span className={`badge ${img.status === "published" ? "badge--green" : "badge--gray"}`}>
                      {img.status}
                    </span>
                  </div>
                </div>
                {img.description && (
                  <div style={{ padding: ".6rem .75rem", fontSize: ".8rem", color: "var(--gray-500)", borderTop: "1px solid var(--gray-100)" }}>
                    {img.description}
                  </div>
                )}
                <div style={{ padding: ".5rem .75rem", display: "flex", gap: ".5rem", borderTop: "1px solid var(--gray-100)" }}>
                  <button
                    className="btn btn--sm"
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      background: img.status === "published" ? "var(--gray-100)" : "var(--sage-pale)",
                      color: img.status === "published" ? "var(--gray-700)" : "var(--forest)",
                      border: "none",
                      padding: ".35rem",
                      fontSize: ".78rem",
                    }}
                    onClick={() => toggleStatus(img)}
                  >
                    {img.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    className="icon-btn icon-btn--danger"
                    onClick={() => deleteImage(img.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
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
