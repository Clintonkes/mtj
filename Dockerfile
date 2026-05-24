# ─────────────────────────────────────────────────
# Stage 1: Build the React frontend
# ─────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy package files from root
COPY package*.json ./
RUN npm ci

# Copy source files from root
COPY vite.config.js ./
COPY index.html ./
COPY src/ ./src/
RUN npm run build

# ─────────────────────────────────────────────────
# Stage 2: Python backend + static files
# ─────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source (flat structure at root)
COPY main.py ./backend/
COPY auth.py ./backend/
COPY database.py ./backend/
COPY models.py ./backend/
COPY schemas.py ./backend/
COPY routers/ ./backend/routers/

# Copy built frontend
COPY --from=frontend-build /app/dist ./frontend/dist

# Create uploads directory
RUN mkdir -p ./uploads

# Set environment defaults
ENV ENV=production
ENV UPLOAD_DIR=/app/uploads

# Railway (and most PaaS) inject $PORT — default to 8000 for local use
EXPOSE ${PORT:-8000}

# Run from /app/backend so flat imports (database, auth, routers) resolve correctly.
# main.py uses Path(__file__).parent.parent which still resolves to /app for frontend serving.
WORKDIR /app/backend
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
