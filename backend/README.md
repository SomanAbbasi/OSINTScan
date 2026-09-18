# OSINTScan Backend Service

Production-grade asynchronous OSINT scanning engine powered by **FastAPI**, **HTTPX**, and community-maintained platform detection fingerprints.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
* Python 3.10+ (Python 3.12 or 3.13 recommended)

### 2. Setup Virtual Environment & Dependencies
```bash
# From project root:
python -m venv .venv

# Activate virtual environment:
# Linux/macOS:
source .venv/bin/activate
# Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Install required dependencies:
pip install -r backend/requirements.txt
```

### 3. Environment Configuration
Copy the template configuration:
```bash
cp backend/.env.example backend/.env
```

### 4. Run Development Server
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
* **API Home:** http://localhost:8000
* **Interactive Swagger Docs:** http://localhost:8000/docs
* **Health Check:** http://localhost:8000/api/v1/health

---

## 🧪 Testing

Run all unit and integration tests:
```bash
pytest backend/tests -v
```

---

## 🌐 Production Deployment (VPS / Linux)

### Option A: Systemd + Gunicorn (Bare Linux VPS)
```bash
gunicorn backend.app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Option B: Docker (1-Command Deploy)
```bash
# From project root:
docker build -t osintscan-api .
docker run -d -p 8000:8000 --name osintscan-backend osintscan-api
```
