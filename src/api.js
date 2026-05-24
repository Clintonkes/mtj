// API base URL — reads from Vite env var or falls back to relative path (works in prod)
const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(method, path, body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const err = await res.json();
      msg = err.detail || JSON.stringify(err);
    } catch (_) {}
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Auth
  login: (username, password) => {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    return fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      body: form,
      credentials: "same-origin",
    }).then((r) => {
      if (!r.ok) throw new Error("Invalid credentials");
      return r.json();
    });
  },
  logout: (token) => request("POST", "/api/auth/logout", null, token),
  getMe: (token) => request("GET", "/api/auth/me", null, token),

  // Public
  submitBooking: (data) => request("POST", "/api/bookings/", data),
  submitMessage: (data) => request("POST", "/api/messages/", data),
  getTestimonials: () => request("GET", "/api/content/testimonials"),
  getServices: () => request("GET", "/api/content/services"),
  getGallery: () => request("GET", "/api/content/gallery"),
  submitTestimonial: (data) => request("POST", "/api/content/testimonials", data),
  getSettings: () => request("GET", "/api/content/settings"),

  // Admin — Bookings
  adminGetBookings: (token) => request("GET", "/api/bookings/", null, token),
  adminUpdateBookingStatus: (id, status, token) =>
    request("PATCH", `/api/bookings/${id}/status`, { status }, token),
  adminDeleteBooking: (id, token) => request("DELETE", `/api/bookings/${id}`, null, token),

  // Admin — Messages
  adminGetMessages: (token) => request("GET", "/api/messages/", null, token),
  adminGetMessage: (id, token) => request("GET", `/api/messages/${id}`, null, token),
  adminReplyMessage: (id, reply, token) =>
    request("PATCH", `/api/messages/${id}/reply`, { reply }, token),
  adminDeleteMessage: (id, token) => request("DELETE", `/api/messages/${id}`, null, token),

  // Admin — Testimonials
  adminGetTestimonials: (token) => request("GET", "/api/content/testimonials/all", null, token),
  adminUpdateTestimonialStatus: (id, status, token) =>
    request("PATCH", `/api/content/testimonials/${id}/status`, { status }, token),
  adminDeleteTestimonial: (id, token) =>
    request("DELETE", `/api/content/testimonials/${id}`, null, token),

  // Admin — Services
  adminGetServices: (token) => request("GET", "/api/content/services/all", null, token),
  adminCreateService: (data, token) => request("POST", "/api/content/services", data, token),
  adminUpdateService: (id, data, token) =>
    request("PUT", `/api/content/services/${id}`, data, token),
  adminDeleteService: (id, token) =>
    request("DELETE", `/api/content/services/${id}`, null, token),

  // Admin — Gallery
  adminGetGallery: (token) => request("GET", "/api/content/gallery/all", null, token),
  adminUpdateGalleryStatus: (id, status, token) =>
    request("PATCH", `/api/content/gallery/${id}/status`, { status }, token),
  adminDeleteGallery: (id, token) =>
    request("DELETE", `/api/content/gallery/${id}`, null, token),
  adminUploadGallery: (formData, token) =>
    fetch(`${BASE_URL}/api/content/gallery`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: "same-origin",
    }).then((r) => {
      if (!r.ok) throw new Error("Upload failed");
      return r.json();
    }),

  // Admin — Settings
  adminUpdateSetting: (key, value, token) =>
    request("PUT", `/api/content/settings/${key}`, { value }, token),

  galleryImageUrl: (filename) => `${BASE_URL}/api/content/gallery/image/${filename}`,
};
