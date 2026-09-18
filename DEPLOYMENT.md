# HandleScope — Production Deployment & Architecture Guide

This document provides complete instructions for deploying and maintaining **HandleScope** — a production-grade, cybersecurity-aware public username footprint auditing platform.

---

## 1. Architecture Overview

HandleScope is structured as a decoupled monorepo:

```
├── backend/          # Python 3.12+ FastAPI async scanner service
├── frontend/         # Next.js 15 App Router frontend (TypeScript, Tailwind)
├── data/
│   ├── upstream/     # Pinned WhatsMyName snapshot
│   ├── overrides/    # Local rule overrides & confidence adjustments
│   ├── generated/    # Normalized production dataset (700+ platforms)
│   ├── manifest.json # Dataset provenance, SHA256, and metadata
│   └── platform-display.json # Curated SEO & display registry
├── scripts/          # Data pipeline, validation, and sync scripts
└── .github/          # Automated weekly upstream update workflow
```

---

## 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Key Variables:

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | Backend API URL reachable by the frontend |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical site URL for metadata & sitemaps |
| `SCAN_MAX_CONCURRENCY` | `20` | Max concurrent HTTP checks per scan job |
| `SCAN_SITE_TIMEOUT_SECONDS` | `8.0` | Timeout per individual platform check |
| `SCAN_TOTAL_TIMEOUT_SECONDS` | `60.0` | Total execution timeout for a scan session |
| `SCAN_MAX_PER_IP` | `30` | Max scans per IP per 5-minute window |
| `USER_AGENT` | `HandleScope/1.0 (+https://handlescope.org/bot)` | Honest scanner identity |
| `ADMIN_API_KEY` | *(Set secret)* | Key for `/api/v1/admin/health-metrics` |

---

## 3. Local Development

### Step 1: Initialize the Data Layer
```bash
npm run data:import
npm run data:merge
npm run data:validate
npm run data:test
```

### Step 2: Run the Backend (Port 8000)
```bash
# In terminal 1:
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Test backend health: `curl http://localhost:8000/api/v1/health`

### Step 3: Run the Frontend (Port 3000)
```bash
# In terminal 2:
npm run dev:frontend
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Production Deployment

### Backend Deployment (Systemd / Gunicorn + Uvicorn)

Run FastAPI behind Gunicorn with Uvicorn workers:

```bash
pip install gunicorn uvicorn[standard]
gunicorn backend.app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
```

### Nginx Reverse Proxy Configuration (with SSE Support)

```nginx
server {
    server_name api.handlescope.org;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Critical for Server-Sent Events (SSE) streaming:
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 120s;
        add_header X-Accel-Buffering "no";
    }
}
```

### Frontend Deployment (Vercel or Node.js)

1. **Vercel:** Connect the repository, set Root Directory to `frontend`, and configure `NEXT_PUBLIC_API_BASE_URL=https://api.handlescope.org`.
2. **Self-Hosted Node.js:**
   ```bash
   cd frontend
   npm run build
   npm run start
   ```

---

## 5. Automated Data Maintenance

A weekly GitHub Actions workflow (`.github/workflows/data-update.yml`) runs every Monday at 04:00 UTC to:
1. Check for updates in the upstream WhatsMyName dataset.
2. Run schema and SSRF validation.
3. Automatically open a Pull Request with a human-readable diff if changes are detected.
4. **Never directly overwrites production without human review.**
