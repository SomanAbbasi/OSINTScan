import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["service"] == "HandleScope API"


def test_health_endpoint():
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_data_version_endpoint():
    resp = client.get("/api/v1/data-version")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_sites" in data
    assert data["total_sites"] >= 700


def test_list_platforms():
    resp = client.get("/api/v1/platforms?search=git")
    assert resp.status_code == 200
    data = resp.json()
    assert "platforms" in data
    assert data["total"] > 0


def test_create_scan_invalid_username():
    resp = client.post("/api/v1/scans", json={"username": "user<script>"})
    assert resp.status_code == 422

    resp_empty = client.post("/api/v1/scans", json={"username": ""})
    assert resp_empty.status_code == 422


def test_create_and_get_scan():
    resp = client.post("/api/v1/scans", json={"username": "testhandle123"})
    assert resp.status_code == 201
    data = resp.json()
    assert "scanId" in data
    assert data["username"] == "testhandle123"

    scan_id = data["scanId"]
    summary_resp = client.get(f"/api/v1/scans/{scan_id}")
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["scanId"] == scan_id
    assert summary["username"] == "testhandle123"
