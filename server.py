from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from datetime import datetime, timezone
import json
import os
import re
import sys


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
LEADS_FILE = DATA_DIR / "consumer-leads.json"
MANAGERS_FILE = DATA_DIR / "manager-signups.json"
ADMIN_TOKEN = os.environ.get("KHS_ADMIN_TOKEN", "khs-admin-2026")


def now_iso():
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def read_records(path):
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def write_records(path, records):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")


def clean_text(value, limit=80):
    return str(value or "").strip()[:limit]


def clean_phone(value):
    return re.sub(r"\D", "", str(value or ""))[:11]


def append_record(path, payload, source):
    records = read_records(path)
    record = {
        "id": f"{source}-{datetime.now().strftime('%Y%m%d%H%M%S')}-{len(records) + 1}",
        "source": source,
        "createdAt": now_iso(),
        **payload,
    }
    records.insert(0, record)
    write_records(path, records)
    return record


def handle_consumer_lead(data):
    return append_record(LEADS_FILE, {
        "productName": clean_text(data.get("productName"), 120),
        "name": clean_text(data.get("name"), 40),
        "phone": clean_phone(data.get("phone")) or clean_text(data.get("phone"), 40),
        "company": clean_text(data.get("company"), 60),
        "level": clean_text(data.get("level"), 40),
        "campus": clean_text(data.get("campus"), 80),
        "note": clean_text(data.get("note"), 200),
    }, "consumer")


def handle_manager_signup(data):
    return append_record(MANAGERS_FILE, {
        "managerName": clean_text(data.get("managerName"), 40),
        "phone": clean_phone(data.get("phone")) or clean_text(data.get("phone"), 40),
        "bank": clean_text(data.get("bank"), 80),
        "branch": clean_text(data.get("branch"), 100),
        "city": clean_text(data.get("city"), 40),
        "products": clean_text(data.get("products"), 160),
        "activityPlan": clean_text(data.get("activityPlan"), 260),
        "serviceArea": clean_text(data.get("serviceArea"), 160),
    }, "manager")


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = urlparse(path).path.lstrip("/")
        return str(ROOT / path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/healthz":
            self.send_json({"ok": True})
            return

        if parsed.path in ("/api/kahuasuan/admin", "/api/kahuasuan/admin/"):
            token = parse_qs(parsed.query).get("token", [""])[0]
            if token != ADMIN_TOKEN:
                self.send_json({"error": "unauthorized"}, 401)
                return
            leads = read_records(LEADS_FILE)
            managers = read_records(MANAGERS_FILE)
            self.send_json({
                "consumerLeads": leads,
                "managerSignups": managers,
                "stats": {
                    "consumerCount": len(leads),
                    "managerCount": len(managers),
                    "totalCount": len(leads) + len(managers),
                },
            })
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path in ("/api/kahuasuan/leads", "/api/kahuasuan/leads/"):
            self.send_json({"ok": True, "record": handle_consumer_lead(self.read_json())}, 201)
            return

        if parsed.path in ("/api/kahuasuan/managers", "/api/kahuasuan/managers/"):
            self.send_json({"ok": True, "record": handle_manager_signup(self.read_json())}, 201)
            return

        self.send_json({"error": "not found"}, 404)

    def do_HEAD(self):
        parsed = urlparse(self.path)
        if parsed.path == "/healthz":
            body = b""
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            return
        super().do_HEAD()


if __name__ == "__main__":
    port = int(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PORT", "8787"))
    host = os.environ.get("HOST", "0.0.0.0")
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Serving http://{host}:{port}/")
    server.serve_forever()
