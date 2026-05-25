"""
Resend email service for M&TJ LLC.
Set RESEND_API_KEY and BUSINESS_EMAIL env vars in Railway.
"""
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
BUSINESS_EMAIL = os.environ.get("BUSINESS_EMAIL", "mtjllc@proton.me")
FROM_ADDRESS = os.environ.get("EMAIL_FROM", "M&TJ LLC <noreply@mtjlawncare.com>")

# Status labels and colors for booking emails
STATUS_META = {
    "pending":   {"label": "Pending Review",    "color": "#f59e0b", "icon": "⏳"},
    "approved":  {"label": "Approved",           "color": "#2e7d32", "icon": "✅"},
    "completed": {"label": "Completed",          "color": "#1565c0", "icon": "🏁"},
    "cancelled": {"label": "Cancelled",          "color": "#e53e3e", "icon": "❌"},
}


def _send(to: str, subject: str, html: str) -> bool:
    """Send an email via Resend. Returns True on success, False on failure."""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — skipping email to %s: %s", to, subject)
        return False
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        resend.Emails.send({
            "from": FROM_ADDRESS,
            "to": [to],
            "subject": subject,
            "html": html,
        })
        logger.info("Email sent to %s: %s", to, subject)
        return True
    except Exception as exc:
        logger.error("Failed to send email to %s: %s — %s", to, subject, exc)
        return False


def _base_template(title: str, body_html: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f4;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a3a2a,#2e7d32);padding:28px 32px;text-align:center;">
            <div style="font-size:28px;margin-bottom:6px;">🌿</div>
            <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.02em;">M&amp;TJ LLC</div>
            <div style="color:rgba(255,255,255,.7);font-size:13px;margin-top:2px;">Professional Lawncare &amp; Landscaping</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            {body_html}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4f6f4;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 4px;font-size:12px;color:#718096;">M&amp;TJ LLC · Memphis, TN &amp; surrounding areas</p>
            <p style="margin:0;font-size:12px;color:#718096;">
              <a href="tel:+19017417276" style="color:#2e7d32;text-decoration:none;">+1 (901) 741-7276</a>
              &nbsp;·&nbsp;
              <a href="mailto:{BUSINESS_EMAIL}" style="color:#2e7d32;text-decoration:none;">{BUSINESS_EMAIL}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


# ── Booking emails ─────────────────────────────────────────────────────────────

def send_booking_confirmation(booking) -> None:
    """Confirm a new estimate request to the customer."""
    body = f"""
    <h1 style="margin:0 0 8px;color:#1a3a2a;font-size:22px;">We Got Your Request! ✅</h1>
    <p style="color:#4a5568;margin:0 0 20px;">Hi <strong>{booking.full_name}</strong>, thank you for reaching out to M&amp;TJ LLC.
    We've received your estimate request and will be in touch within <strong>24 hours</strong>.</p>

    <div style="background:#f0fdf4;border-left:4px solid #2e7d32;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#2e7d32;">Request Summary</p>
      <table width="100%" cellpadding="4" cellspacing="0" style="font-size:14px;color:#1a202c;">
        <tr><td style="color:#718096;width:40%;">Service</td><td><strong>{booking.service_type}</strong></td></tr>
        <tr><td style="color:#718096;">Address</td><td>{booking.address}</td></tr>
        <tr><td style="color:#718096;">Preferred Date</td><td>{booking.preferred_date or 'Flexible'}</td></tr>
        <tr><td style="color:#718096;">Preferred Time</td><td>{booking.preferred_time or 'Any time'}</td></tr>
      </table>
    </div>

    <p style="color:#4a5568;font-size:14px;">Our team will review your request and contact you at
    <strong>{booking.email}</strong> or <strong>{booking.phone}</strong> to schedule your free on-site assessment.</p>
    <p style="color:#4a5568;font-size:14px;">If you have any urgent questions, give us a call at
    <a href="tel:+19017417276" style="color:#2e7d32;">+1 (901) 741-7276</a>.</p>
    """
    _send(booking.email, "We Received Your Estimate Request — M&TJ LLC",
          _base_template("Estimate Request Received", body))


def send_booking_admin_notification(booking) -> None:
    """Notify the business of a new booking."""
    body = f"""
    <h1 style="margin:0 0 8px;color:#1a3a2a;font-size:22px;">New Estimate Request 📋</h1>
    <p style="color:#4a5568;margin:0 0 20px;">A new estimate request has been submitted through the website.</p>

    <div style="background:#f0fdf4;border-left:4px solid #2e7d32;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
      <table width="100%" cellpadding="5" cellspacing="0" style="font-size:14px;color:#1a202c;">
        <tr><td style="color:#718096;width:35%;">Name</td><td><strong>{booking.full_name}</strong></td></tr>
        <tr><td style="color:#718096;">Email</td><td><a href="mailto:{booking.email}" style="color:#2e7d32;">{booking.email}</a></td></tr>
        <tr><td style="color:#718096;">Phone</td><td><a href="tel:{booking.phone}" style="color:#2e7d32;">{booking.phone}</a></td></tr>
        <tr><td style="color:#718096;">Service</td><td><strong>{booking.service_type}</strong></td></tr>
        <tr><td style="color:#718096;">Address</td><td>{booking.address}</td></tr>
        <tr><td style="color:#718096;">Preferred Date</td><td>{booking.preferred_date or 'Flexible'}</td></tr>
        <tr><td style="color:#718096;">Preferred Time</td><td>{booking.preferred_time or 'Any time'}</td></tr>
        {"<tr><td style='color:#718096;'>Notes</td><td>" + booking.notes + "</td></tr>" if booking.notes else ""}
      </table>
    </div>

    <a href="https://mtj-production.up.railway.app/admin/bookings"
       style="display:inline-block;background:#2e7d32;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
      View in Admin Panel →
    </a>
    """
    _send(BUSINESS_EMAIL, f"New Estimate Request from {booking.full_name} — M&TJ LLC",
          _base_template("New Estimate Request", body))


def send_booking_status_update(booking) -> None:
    """Notify the customer when their booking status changes."""
    meta = STATUS_META.get(booking.status, {"label": booking.status.title(), "color": "#718096", "icon": "📋"})
    body = f"""
    <h1 style="margin:0 0 8px;color:#1a3a2a;font-size:22px;">Booking Update {meta['icon']}</h1>
    <p style="color:#4a5568;margin:0 0 20px;">Hi <strong>{booking.full_name}</strong>, your estimate request status has been updated.</p>

    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:{meta['color']};color:#fff;padding:10px 28px;border-radius:30px;font-weight:700;font-size:16px;letter-spacing:.03em;">
        {meta['icon']} {meta['label']}
      </span>
    </div>

    <div style="background:#f7fafc;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
      <table width="100%" cellpadding="4" cellspacing="0" style="font-size:14px;color:#1a202c;">
        <tr><td style="color:#718096;width:40%;">Service</td><td><strong>{booking.service_type}</strong></td></tr>
        <tr><td style="color:#718096;">Address</td><td>{booking.address}</td></tr>
      </table>
    </div>

    {"<p style='color:#4a5568;font-size:14px;'>We look forward to serving you! Our team will be in contact shortly to confirm details.</p>" if booking.status == "approved" else ""}
    {"<p style='color:#4a5568;font-size:14px;'>Thank you for choosing M&TJ LLC! We hope you're satisfied with our work.</p>" if booking.status == "completed" else ""}
    {"<p style='color:#4a5568;font-size:14px;'>If you'd like to reschedule or have questions, please call us at <a href='tel:+19017417276' style='color:#2e7d32;'>+1 (901) 741-7276</a>.</p>" if booking.status == "cancelled" else ""}

    <p style="color:#718096;font-size:13px;margin-top:20px;">
      Questions? Contact us at <a href="tel:+19017417276" style="color:#2e7d32;">+1 (901) 741-7276</a>
      or <a href="mailto:{BUSINESS_EMAIL}" style="color:#2e7d32;">{BUSINESS_EMAIL}</a>.
    </p>
    """
    _send(booking.email, f"Your M&TJ LLC Booking is {meta['label']}",
          _base_template("Booking Status Update", body))


# ── Contact / message emails ───────────────────────────────────────────────────

def send_message_confirmation(message) -> None:
    """Confirm contact form receipt to the sender."""
    body = f"""
    <h1 style="margin:0 0 8px;color:#1a3a2a;font-size:22px;">Message Received ✉️</h1>
    <p style="color:#4a5568;margin:0 0 20px;">Hi <strong>{message.full_name}</strong>, thank you for contacting M&amp;TJ LLC.
    We've received your message and will respond within <strong>24 hours</strong>.</p>

    <div style="background:#f0fdf4;border-left:4px solid #2e7d32;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#2e7d32;">Your Message</p>
      <p style="margin:0 0 6px;font-size:13px;color:#718096;">Subject: <strong style="color:#1a202c;">{message.subject}</strong></p>
      <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.65;white-space:pre-wrap;">{message.body}</p>
    </div>

    <p style="color:#4a5568;font-size:14px;">We'll reply to <strong>{message.email}</strong>. If it's urgent, call us at
    <a href="tel:+19017417276" style="color:#2e7d32;">+1 (901) 741-7276</a>.</p>
    """
    _send(message.email, "We Received Your Message — M&TJ LLC",
          _base_template("Message Received", body))


def send_message_admin_notification(message) -> None:
    """Notify the business of a new contact form submission."""
    phone_row = f"<tr><td style='color:#718096;'>Phone</td><td>{message.phone}</td></tr>" if message.phone else ""
    body = f"""
    <h1 style="margin:0 0 8px;color:#1a3a2a;font-size:22px;">New Contact Message ✉️</h1>
    <p style="color:#4a5568;margin:0 0 20px;">A new message was submitted through the website contact form.</p>

    <div style="background:#f0fdf4;border-left:4px solid #2e7d32;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
      <table width="100%" cellpadding="5" cellspacing="0" style="font-size:14px;color:#1a202c;">
        <tr><td style="color:#718096;width:30%;">Name</td><td><strong>{message.full_name}</strong></td></tr>
        <tr><td style="color:#718096;">Email</td><td><a href="mailto:{message.email}" style="color:#2e7d32;">{message.email}</a></td></tr>
        {phone_row}
        <tr><td style="color:#718096;">Subject</td><td><strong>{message.subject}</strong></td></tr>
      </table>
    </div>

    <div style="background:#f7fafc;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#718096;text-transform:uppercase;letter-spacing:.05em;">Message</p>
      <p style="margin:0;font-size:14px;color:#1a202c;line-height:1.7;white-space:pre-wrap;">{message.body}</p>
    </div>

    <a href="https://mtj-production.up.railway.app/admin/messages"
       style="display:inline-block;background:#2e7d32;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
      View in Admin Panel →
    </a>
    """
    _send(BUSINESS_EMAIL, f"New Message from {message.full_name}: {message.subject} — M&TJ LLC",
          _base_template("New Contact Message", body))
