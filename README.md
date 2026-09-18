# HandleScope

<div align="center">
  <img src="frontend/public/handlescope-preview.png" alt="HandleScope Logo" width="120" onerror="this.style.display='none'" />
  <h3>Search your public username footprint across the web.</h3>
  <p>Production-grade, privacy-aware public username enumeration and OSINT auditing engine.</p>
</div>

---

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC--BY--SA--4.0-blue.svg)](http://creativecommons.org/licenses/by-sa/4.0/)
[![Platforms Tracked](https://img.shields.io/badge/Platforms-700%2B-indigo.svg)](data/manifest.json)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](backend/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black.svg)](frontend/)

HandleScope is a browser-based username footprint auditing tool. A user enters a public username or handle, and the application queries 700+ public websites in real-time using community-maintained detection fingerprints, returning possible profile URLs with transparent confidence labels.

---

## 🌟 Key Features

* **⚡ Real-Time Streaming (SSE):** High-concurrency async scanner in Python (FastAPI + `httpx`) streams results directly to the browser via Server-Sent Events.
* **🛡️ Responsible OSINT Disclosures:** Results clearly state uncertainty: *"Possible public profile found. Ownership is not confirmed. Manual verification recommended."*
* **🔒 Privacy by Design:** Anonymous queries are processed ephemerally in server memory; no permanent search history is stored.
* **📊 Comprehensive Exports:** Download audit reports in **CSV**, **JSON**, or generate a clean **Printable HTML report**.
* **🌐 Complete SEO Architecture:** High-intent landing pages, JSON-LD schemas (`WebApplication`, `FAQPage`, `BreadcrumbList`, `Article`), and static platform directories.
* **🔄 Upstream Data Pipeline:** Separated data layers (`data/upstream/`, `data/overrides/`, `data/generated/`) with automated weekly synchronization via GitHub Actions.

---

## 🚀 Quick Start

### 1. Prerequisites
* Python 3.12+
* Node.js 20+ & npm

### 2. Install & Initialize
```bash
# Clone the repository
git clone https://github.com/your-org/handlescope.git
cd handlescope

# Install backend dependencies
pip install -r backend/requirements.txt

# Run data normalization and validation pipeline
npm run data:import
npm run data:merge
npm run data:validate

# Install frontend dependencies
npm --prefix frontend install
```

### 3. Run Development Servers
```bash
# Terminal 1: Start FastAPI backend (Port 8000)
npm run dev:backend

# Terminal 2: Start Next.js frontend (Port 3000)
npm run dev:frontend
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing

```bash
# Run backend unit and integration tests (16 tests)
pytest backend/tests -v

# Run site rules validation
npm run data:validate

# Run smoke test on platform rules
npm run data:test
```

---

## 📜 Open-Source Attribution

HandleScope uses and adapts platform detection fingerprints from the community-maintained **[WhatsMyName](https://github.com/WebBreacher/WhatsMyName)** dataset by Micah "WebBreacher" Hoffman and hundreds of global contributors.

* **Dataset License:** [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](http://creativecommons.org/licenses/by-sa/4.0/)
* **Attribution Page:** Visit `/open-source` within the application for complete licensing notices, adaptation details, and instructions for submitting platform corrections upstream.

---

## ⚖️ Terms of Use & Ethical Stance

HandleScope only checks publicly accessible profile pages. It does not access private accounts, bypass login systems, solve CAPTCHAs, or circumvent rate limits. 

**Prohibited Uses:** Stalking, harassment, doxxing, identity theft, or unauthorized profiling. See `/terms` for the full Acceptable Use Policy.
