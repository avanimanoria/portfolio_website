"""Backend API tests for Avani Manoria Portfolio (iteration 2).

Covers:
- Root health check (/api/)
- Public content: /api/profile/settings, /api/projects, /api/education
- Auth: POST /api/auth/login, GET /api/auth/me
- Brute-force lockout (uses a scoped junk email so admin login is untouched)
- Protected mutations: PATCH /api/profile/settings, /api/projects, /api/education
- Contact + admin messages: POST /api/contact -> GET /api/admin/messages
- Auth guards (401 without token)
"""

import os
import time
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

# Load backend env so MONGO_URL / DB_NAME are available for direct DB cleanup
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL_TEST")
            or "https://tech-elite-showcase.preview.emergentagent.com").rstrip("/")

ADMIN_EMAIL = "avanimanoria@gmail.com"
ADMIN_PASSWORD = "Atelier@Avani2026"
BRUTE_EMAIL = "test_brute_lockout@example.com"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def mongo():
    """Direct DB access to clean up login_attempts for brute-force test isolation."""
    url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "test_database")
    c = MongoClient(url)
    yield c[db_name]
    c.close()


@pytest.fixture(scope="module")
def admin_token(api_client, mongo):
    # ensure admin isn't locked from a prior run
    try:
        mongo.login_attempts.delete_one({"identifier": f"login:{ADMIN_EMAIL}"})
    except Exception:
        pass
    r = api_client.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15,
    )
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture()
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Public content ----------
class TestPublicContent:
    def test_settings_singleton(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/profile/settings", timeout=15)
        assert r.status_code == 200
        s = r.json()
        for key in ("name", "tagline", "bio_paragraph_1", "bio_paragraph_2",
                    "contact_email", "socials", "hero_meta"):
            assert key in s, f"Missing key: {key}"
        assert s["contact_email"] == ADMIN_EMAIL
        assert s["hero_meta"].get("experience") == "Final Year · Engineering"
        assert s["hero_meta"].get("status") == "Open to opportunities"

    def test_projects_seeded_three(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/projects", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 3
        titles = " | ".join([p["title"] for p in items])
        assert "Activity Points Management System" in titles
        assert "Customer Churn Prediction" in titles
        assert "Vellum" in titles
        # ensure no _id leaks
        for p in items:
            assert "_id" not in p

    def test_education_seeded(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/education", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list) and len(items) >= 1
        for e in items:
            assert "_id" not in e
            assert "degree" in e and "institution" in e


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, api_client, mongo):
        mongo.login_attempts.delete_one({"identifier": f"login:{ADMIN_EMAIL}"})
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "access_token" in data and len(data["access_token"]) > 20
        assert data["user"]["email"] == ADMIN_EMAIL

    def test_login_wrong_password(self, api_client, mongo):
        mongo.login_attempts.delete_one({"identifier": f"login:{ADMIN_EMAIL}"})
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": "wrong-password"}, timeout=15,
        )
        assert r.status_code == 401
        # clean up so admin isn't accidentally locked
        mongo.login_attempts.delete_one({"identifier": f"login:{ADMIN_EMAIL}"})

    def test_me_with_token(self, api_client, admin_token):
        r = api_client.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}, timeout=15,
        )
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_without_token(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 401


# ---------- Brute force (uses a distinct email, not admin) ----------
class TestBruteForce:
    def test_lockout_after_5_wrong_attempts(self, api_client, mongo):
        mongo.login_attempts.delete_one({"identifier": f"login:{BRUTE_EMAIL}"})
        last_status = None
        for i in range(5):
            r = api_client.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": BRUTE_EMAIL, "password": f"bad-{i}"}, timeout=15,
            )
            last_status = r.status_code
            assert r.status_code in (401, 423), f"attempt {i}: {r.status_code} {r.text}"
        # next attempt should be locked
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": BRUTE_EMAIL, "password": "still-bad"}, timeout=15,
        )
        assert r.status_code == 423, f"Expected lockout, got {r.status_code} {r.text}"
        # cleanup
        mongo.login_attempts.delete_one({"identifier": f"login:{BRUTE_EMAIL}"})


# ---------- Protected mutations ----------
class TestProtectedRoutes:
    def test_patch_settings_requires_auth(self, api_client):
        r = api_client.patch(f"{BASE_URL}/api/profile/settings", json={"tagline": "x"}, timeout=15)
        assert r.status_code == 401

    def test_create_project_requires_auth(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/projects", json={
            "kind": "x", "year": "2026", "title": "TEST_", "blurb": "y"
        }, timeout=15)
        assert r.status_code == 401

    def test_create_education_requires_auth(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/education", json={
            "period": "p", "degree": "d", "institution": "i",
        }, timeout=15)
        assert r.status_code == 401

    def test_admin_messages_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/messages", timeout=15)
        assert r.status_code == 401


class TestSettingsUpdate:
    def test_patch_and_revert_tagline(self, api_client, auth_headers):
        # get current
        cur = api_client.get(f"{BASE_URL}/api/profile/settings", timeout=15).json()
        original = cur.get("tagline")
        new_val = "TEST_ automated tagline update"
        # patch
        r = api_client.patch(f"{BASE_URL}/api/profile/settings",
                             headers=auth_headers, json={"tagline": new_val}, timeout=15)
        assert r.status_code == 200, r.text
        assert r.json()["tagline"] == new_val
        # verify persisted via GET
        got = api_client.get(f"{BASE_URL}/api/profile/settings", timeout=15).json()
        assert got["tagline"] == new_val
        # revert
        r2 = api_client.patch(f"{BASE_URL}/api/profile/settings",
                              headers=auth_headers, json={"tagline": original}, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["tagline"] == original


class TestProjectsCRUD:
    def test_create_update_delete(self, api_client, auth_headers):
        payload = {
            "kind": "TEST_", "year": "2099", "title": "TEST_ project",
            "blurb": "tmp", "stack": ["x"], "order": 99,
        }
        r = api_client.post(f"{BASE_URL}/api/projects",
                            headers=auth_headers, json=payload, timeout=15)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]
        # update
        payload["title"] = "TEST_ project updated"
        r2 = api_client.patch(f"{BASE_URL}/api/projects/{pid}",
                              headers=auth_headers, json=payload, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["title"] == "TEST_ project updated"
        # verify list contains
        lst = api_client.get(f"{BASE_URL}/api/projects", timeout=15).json()
        assert any(p["id"] == pid for p in lst)
        # delete
        r3 = api_client.delete(f"{BASE_URL}/api/projects/{pid}",
                               headers=auth_headers, timeout=15)
        assert r3.status_code == 200
        assert r3.json().get("deleted") == 1


class TestEducationCRUD:
    def test_create_update_delete(self, api_client, auth_headers):
        payload = {"period": "TEST_", "degree": "TEST_deg",
                   "institution": "TEST_inst", "notes": ["a"], "order": 42}
        r = api_client.post(f"{BASE_URL}/api/education",
                            headers=auth_headers, json=payload, timeout=15)
        assert r.status_code == 200, r.text
        eid = r.json()["id"]
        payload["degree"] = "TEST_deg_updated"
        r2 = api_client.patch(f"{BASE_URL}/api/education/{eid}",
                              headers=auth_headers, json=payload, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["degree"] == "TEST_deg_updated"
        r3 = api_client.delete(f"{BASE_URL}/api/education/{eid}",
                               headers=auth_headers, timeout=15)
        assert r3.status_code == 200
        assert r3.json().get("deleted") == 1


class TestContactToAdmin:
    def test_contact_creates_and_appears_in_admin_messages(self, api_client, auth_headers):
        unique_msg = f"TEST_ msg {int(time.time())}"
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_ contactor", "email": "test_contact@example.com",
            "subject": "TEST_ subject", "message": unique_msg,
        }, timeout=15)
        assert r.status_code == 200, r.text
        mid = r.json()["id"]
        # admin lists
        r2 = api_client.get(f"{BASE_URL}/api/admin/messages",
                            headers=auth_headers, timeout=15)
        assert r2.status_code == 200
        msgs = r2.json()
        assert any(m["id"] == mid for m in msgs), "Created message missing from admin list"
        # cleanup
        api_client.delete(f"{BASE_URL}/api/admin/messages/{mid}",
                          headers=auth_headers, timeout=15)
