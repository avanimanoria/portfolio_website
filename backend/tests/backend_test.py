"""Backend API tests for Avani Manoria Portfolio.

Covers:
- Root health check (/api/)
- Contact message creation (POST /api/contact)
- Contact message listing (GET /api/contact/messages)
- Validation errors (422) for invalid email / missing fields
"""

import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL_TEST") or "https://tech-elite-showcase.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture(scope="module")
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


# ---------- Health ----------
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "message" in data
        assert isinstance(data["message"], str)


# ---------- Contact CRUD ----------
class TestContact:
    payload = {
        "name": "TEST_Avani Reviewer",
        "email": "test_reviewer@example.com",
        "subject": "TEST_ Automated regression",
        "message": "TEST_ This is a message from the automated backend test suite.",
    }

    def test_create_contact_message(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json=self.payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == self.payload["name"]
        assert data["email"] == self.payload["email"]
        assert data["subject"] == self.payload["subject"]
        assert data["message"] == self.payload["message"]
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        assert "created_at" in data
        # store id via class attr for next test
        TestContact.created_id = data["id"]

    def test_list_contains_created_message(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/contact/messages", timeout=15)
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        ids = [m.get("id") for m in items]
        assert getattr(TestContact, "created_id", None) in ids, (
            f"Created id not present in list. Got ids sample={ids[:5]}"
        )

    def test_create_contact_without_subject(self, api_client):
        payload = {
            "name": "TEST_NoSubject",
            "email": "test_nosubject@example.com",
            "message": "TEST_ Message without subject",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["subject"] in (None, "")
        assert data["name"] == "TEST_NoSubject"

    def test_invalid_email_returns_422(self, api_client):
        payload = {
            "name": "TEST_Bad",
            "email": "not-an-email",
            "message": "hi",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"

    def test_missing_name_returns_422(self, api_client):
        payload = {
            "email": "test_missingname@example.com",
            "message": "hi",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_empty_message_returns_422(self, api_client):
        payload = {
            "name": "TEST_EmptyMsg",
            "email": "test_emptymsg@example.com",
            "message": "",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422, r.text
