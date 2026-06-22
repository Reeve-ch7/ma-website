import os
import json
import hashlib
import uuid
import datetime

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import jwt as pyjwt

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

SECRET = "men-aloho-admin-secret-key-2026-xk9z"
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# SHA-256 of the passcode — compared against hash of submitted input
PASSCODE_HASH = hashlib.sha256(b"JayadeepMathew").hexdigest()

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


# ── Helpers ───────────────────────────────────────────────────────────────────

def load_data(name, default=None):
    path = os.path.join(DATA_DIR, f"{name}.json")
    if not os.path.exists(path):
        return default
    with open(path) as f:
        return json.load(f)


def save_data(name, data):
    path = os.path.join(DATA_DIR, f"{name}.json")
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def authorized():
    raw = request.headers.get("Authorization", "")
    token = raw.replace("Bearer ", "").strip()
    if not token:
        return False
    try:
        pyjwt.decode(token, SECRET, algorithms=["HS256"])
        return True
    except Exception:
        return False


# ── Defaults ──────────────────────────────────────────────────────────────────

DEFAULT_GALLERY = [
    {"id": "g1", "url": "", "label": "National Theatre — 2025", "size": "large",  "hidden": False},
    {"id": "g2", "url": "", "label": "Recording Session",        "size": "small",  "hidden": False},
    {"id": "g3", "url": "", "label": "Tsion Album Cover",        "size": "small",  "hidden": False},
    {"id": "g4", "url": "", "label": "East Africa Tour",         "size": "medium", "hidden": False},
    {"id": "g5", "url": "", "label": "Award Ceremony 2026",      "size": "medium", "hidden": False},
    {"id": "g6", "url": "", "label": "Rehearsal — Addis",        "size": "small",  "hidden": False},
    {"id": "g7", "url": "", "label": "Live at Holy Trinity",     "size": "small",  "hidden": False},
]

DEFAULT_VIDEOS = [
    {"id": "v1", "url": "", "title": "Egziabher Yistilign — Official Video",    "views": "2.4M views", "duration": "4:32",    "hidden": False},
    {"id": "v2", "url": "", "title": "Live at National Theatre — Full Concert", "views": "890K views", "duration": "1:12:44", "hidden": False},
    {"id": "v3", "url": "", "title": "Tsion — Behind the Scenes",               "views": "340K views", "duration": "8:15",    "hidden": False},
]

DEFAULT_NEWS = [
    {
        "id": "n1",
        "date": "2026",
        "tag": "New Release",
        "title": "Daivam Pirakunnu — Now Streaming",
        "excerpt": "Men Aloho's latest release \"Daivam Pirakunnu\" is now available on YouTube. A powerful Gospel rendition that has deeply moved audiences across Chennai and beyond.",
        "link": "https://www.youtube.com/watch?v=gfeKQae5Wq0",
        "linkLabel": "Watch on YouTube",
        "hidden": False,
    },
    {
        "id": "n2",
        "date": "2026",
        "tag": "Milestone",
        "title": "O Mariyame — Nearing 1 Million Views",
        "excerpt": "Their beloved Easter Liturgy rendition is fast approaching 1 million views — a testament to the power of their voices and the depth of their devotion.",
        "link": "https://www.youtube.com/watch?v=lMjbkypa8N8",
        "linkLabel": "Watch on YouTube",
        "hidden": False,
    },
]


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    entered = hashlib.sha256(data.get("passcode", "").encode()).hexdigest()
    if entered != PASSCODE_HASH:
        return jsonify({"error": "Invalid passcode"}), 401
    token = pyjwt.encode(
        {"sub": "admin", "iat": datetime.datetime.now(datetime.timezone.utc)},
        SECRET,
        algorithm="HS256",
    )
    return jsonify({"token": token})


@app.route("/api/verify", methods=["GET"])
def verify():
    return jsonify({"ok": authorized()})


# ── Gallery ───────────────────────────────────────────────────────────────────

@app.route("/api/gallery", methods=["GET"])
def get_gallery():
    return jsonify(load_data("gallery", DEFAULT_GALLERY))


@app.route("/api/gallery", methods=["POST"])
def set_gallery():
    if not authorized():
        return jsonify({"error": "Unauthorized"}), 401
    save_data("gallery", request.json)
    return jsonify({"ok": True})


# ── Videos ────────────────────────────────────────────────────────────────────

@app.route("/api/videos", methods=["GET"])
def get_videos():
    return jsonify(load_data("videos", DEFAULT_VIDEOS))


@app.route("/api/videos", methods=["POST"])
def set_videos():
    if not authorized():
        return jsonify({"error": "Unauthorized"}), 401
    save_data("videos", request.json)
    return jsonify({"ok": True})


# ── News ──────────────────────────────────────────────────────────────────────

@app.route("/api/news", methods=["GET"])
def get_news():
    return jsonify(load_data("news", DEFAULT_NEWS))


@app.route("/api/news", methods=["POST"])
def set_news():
    if not authorized():
        return jsonify({"error": "Unauthorized"}), 401
    save_data("news", request.json)
    return jsonify({"ok": True})


# ── Music overrides ───────────────────────────────────────────────────────────

@app.route("/api/music-overrides", methods=["GET"])
def get_music_overrides():
    return jsonify(load_data("music_overrides", []))


@app.route("/api/music-overrides", methods=["POST"])
def set_music_overrides():
    if not authorized():
        return jsonify({"error": "Unauthorized"}), 401
    save_data("music_overrides", request.json)
    return jsonify({"ok": True})


# ── Group photo ───────────────────────────────────────────────────────────────

@app.route("/api/group-photo", methods=["GET"])
def get_group_photo():
    return jsonify(load_data("group_photo", {"url": ""}))


@app.route("/api/group-photo", methods=["POST"])
def set_group_photo():
    if not authorized():
        return jsonify({"error": "Unauthorized"}), 401
    save_data("group_photo", request.json)
    return jsonify({"ok": True})


# ── File upload ───────────────────────────────────────────────────────────────

@app.route("/api/upload", methods=["POST"])
def upload_file():
    if not authorized():
        return jsonify({"error": "Unauthorized"}), 401
    f = request.files.get("file")
    if not f:
        return jsonify({"error": "No file provided"}), 400
    ext = os.path.splitext(f.filename or "")[1].lower()
    if ext not in ALLOWED_EXT:
        return jsonify({"error": "File type not allowed"}), 400
    name = f"{uuid.uuid4().hex}{ext}"
    f.save(os.path.join(UPLOAD_DIR, name))
    return jsonify({"url": f"http://localhost:5001/uploads/{name}"})


@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)


if __name__ == "__main__":
    app.run(port=5001, debug=True)
