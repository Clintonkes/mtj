import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path

from database import engine, Base
import models  # noqa: F401 — ensure models are registered before create_all
from routers import auth, bookings, messages, content
from auth import get_password_hash
from database import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Allowed origins ──────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables and seed default admin on startup."""
    Base.metadata.create_all(bind=engine)
    _seed_admin()
    yield


def _seed_admin():
    """Create or update the admin account from environment variables.

    - If no admin exists: always creates one (random password if ADMIN_PASSWORD unset).
    - If ADMIN_PASSWORD is explicitly set: upserts the target username so env vars
      always win, even after the first deploy created an account with a random password.
    """
    db = SessionLocal()
    try:
        admin_user = os.environ.get("ADMIN_USERNAME", "admin")
        admin_email = os.environ.get("ADMIN_EMAIL", "mtjllc@proton.me")
        admin_pass = os.environ.get("ADMIN_PASSWORD")

        existing = db.query(models.Admin).filter(
            models.Admin.username == admin_user
        ).first()

        if admin_pass:
            # Env var is set — always sync credentials so a redeploy is enough to
            # reset the password (covers the case where the first deploy used a
            # randomly generated password before env vars were configured).
            hashed = get_password_hash(admin_pass)
            if existing:
                existing.email = admin_email
                existing.hashed_password = hashed
                existing.is_active = True
                db.commit()
                logger.info(f"Admin '{admin_user}' credentials synced from env vars.")
            else:
                db.add(models.Admin(
                    username=admin_user,
                    email=admin_email,
                    hashed_password=hashed,
                ))
                db.commit()
                logger.info(f"Admin '{admin_user}' created from env vars.")
        elif db.query(models.Admin).count() == 0:
            # No env var and no existing admin — generate a one-time random password.
            import secrets as _s
            admin_pass = _s.token_urlsafe(16)
            logger.warning(
                f"No ADMIN_PASSWORD set. Generated temporary password: {admin_pass}"
                " — SET ADMIN_PASSWORD ENV VAR AND REDEPLOY IMMEDIATELY."
            )
            db.add(models.Admin(
                username=admin_user,
                email=admin_email,
                hashed_password=get_password_hash(admin_pass),
            ))
            db.commit()
            logger.info(f"Default admin '{admin_user}' created with temporary password.")
    finally:
        db.close()


app = FastAPI(
    title="M&TJ LLC API",
    description="Backend API for M&TJ LLC Lawncare",
    version="1.0.0",
    lifespan=lifespan,
    # Disable automatic docs exposure in production
    docs_url="/api/docs" if os.environ.get("ENV") != "production" else None,
    redoc_url=None,
)

# ── Security headers middleware ───────────────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: blob:; "
        "frame-ancestors 'none';"
    )
    return response


# ── CORS (strict allow-list, no wildcards) ────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# ── API Routers ───────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(messages.router)
app.include_router(content.router)

# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "M&TJ LLC API"}

# ── Serve React frontend (production) ────────────────────────────────────────
FRONTEND_DIR = Path(__file__).parent.parent / "frontend" / "dist"
if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/"):
            return JSONResponse({"detail": "Not found"}, status_code=404)
        index = FRONTEND_DIR / "index.html"
        if index.exists():
            return FileResponse(str(index))
        return JSONResponse({"detail": "Frontend not built"}, status_code=503)
