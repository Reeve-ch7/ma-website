import hashlib
import json
import os
import uuid
import datetime
from pathlib import Path

import jwt as pyjwt
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

DATA_DIR = settings.BASE_DIR / "data"
UPLOAD_DIR = settings.BASE_DIR / "uploads"
DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

PASSCODE_HASH = hashlib.sha256(b"JayadeepMathew").hexdigest()
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

DEFAULT_GALLERY = [
    {"id": "g1", "url": "", "label": "National Theatre — 2025",  "size": "large",  "hidden": False},
    {"id": "g2", "url": "", "label": "Recording Session",         "size": "small",  "hidden": False},
    {"id": "g3", "url": "", "label": "Tsion Album Cover",         "size": "small",  "hidden": False},
    {"id": "g4", "url": "", "label": "East Africa Tour",          "size": "medium", "hidden": False},
    {"id": "g5", "url": "", "label": "Award Ceremony 2026",       "size": "medium", "hidden": False},
    {"id": "g6", "url": "", "label": "Rehearsal — Addis",         "size": "small",  "hidden": False},
    {"id": "g7", "url": "", "label": "Live at Holy Trinity",      "size": "small",  "hidden": False},
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


# ── Helpers ───────────────────────────────────────────────────────────────────

def load_data(name, default=None):
    path = DATA_DIR / f"{name}.json"
    if not path.exists():
        return default
    return json.loads(path.read_text())


def save_data(name, data):
    (DATA_DIR / f"{name}.json").write_text(json.dumps(data, indent=2))


def is_authorized(request):
    raw = request.headers.get("Authorization", "")
    token = raw.replace("Bearer ", "").strip()
    if not token:
        return False
    try:
        pyjwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return True
    except Exception:
        return False


def ok(data):
    if isinstance(data, list):
        return JsonResponse(data, safe=False)
    return JsonResponse(data)


def err(msg, status=401):
    return JsonResponse({"error": msg}, status=status)


# ── Auth ──────────────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    body = json.loads(request.body or b"{}")
    entered = hashlib.sha256(body.get("passcode", "").encode()).hexdigest()
    if entered != PASSCODE_HASH:
        return err("Invalid passcode")
    token = pyjwt.encode(
        {"sub": "admin", "iat": datetime.datetime.now(datetime.timezone.utc)},
        settings.JWT_SECRET,
        algorithm="HS256",
    )
    return ok({"token": token})


@require_http_methods(["GET"])
def verify(request):
    return ok({"ok": is_authorized(request)})


# ── Gallery ───────────────────────────────────────────────────────────────────

@csrf_exempt
def gallery(request):
    if request.method == "GET":
        return ok(load_data("gallery", DEFAULT_GALLERY))
    if not is_authorized(request):
        return err("Unauthorized")
    save_data("gallery", json.loads(request.body))
    return ok({"ok": True})


# ── Videos ────────────────────────────────────────────────────────────────────

@csrf_exempt
def videos(request):
    if request.method == "GET":
        return ok(load_data("videos", DEFAULT_VIDEOS))
    if not is_authorized(request):
        return err("Unauthorized")
    save_data("videos", json.loads(request.body))
    return ok({"ok": True})


# ── News ──────────────────────────────────────────────────────────────────────

@csrf_exempt
def news(request):
    if request.method == "GET":
        return ok(load_data("news", DEFAULT_NEWS))
    if not is_authorized(request):
        return err("Unauthorized")
    save_data("news", json.loads(request.body))
    return ok({"ok": True})


# ── Music overrides ───────────────────────────────────────────────────────────

@csrf_exempt
def music_overrides(request):
    if request.method == "GET":
        return ok(load_data("music_overrides", []))
    if not is_authorized(request):
        return err("Unauthorized")
    save_data("music_overrides", json.loads(request.body))
    return ok({"ok": True})


# ── Group photo ───────────────────────────────────────────────────────────────

@csrf_exempt
def group_photo(request):
    if request.method == "GET":
        return ok(load_data("group_photo", {"url": ""}))
    if not is_authorized(request):
        return err("Unauthorized")
    save_data("group_photo", json.loads(request.body))
    return ok({"ok": True})


# ── File upload ───────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def upload(request):
    if not is_authorized(request):
        return err("Unauthorized")
    f = request.FILES.get("file")
    if not f:
        return err("No file provided", 400)
    ext = os.path.splitext(f.name or "")[1].lower()
    if ext not in ALLOWED_EXT:
        return err("File type not allowed", 400)
    name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / name
    with open(dest, "wb") as out:
        for chunk in f.chunks():
            out.write(chunk)
    return ok({"url": f"http://localhost:5001/uploads/{name}"})
