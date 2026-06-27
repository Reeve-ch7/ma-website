import hashlib
import json
import os
import uuid
import datetime
from pathlib import Path
import threading
from django.core.mail import EmailMessage

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
    {"id": "g1", "url": "", "label": "National Theatre 2025",  "size": "large",  "hidden": False},
    {"id": "g2", "url": "", "label": "Recording Session",         "size": "small",  "hidden": False},
    {"id": "g3", "url": "", "label": "Tsion Album Cover",         "size": "small",  "hidden": False},
    {"id": "g4", "url": "", "label": "East Africa Tour",          "size": "medium", "hidden": False},
    {"id": "g5", "url": "", "label": "Award Ceremony 2026",       "size": "medium", "hidden": False},
    {"id": "g6", "url": "", "label": "Rehearsal, Addis",         "size": "small",  "hidden": False},
    {"id": "g7", "url": "", "label": "Live at Holy Trinity",      "size": "small",  "hidden": False},
]

DEFAULT_VIDEOS = [
    {"id": "v1", "url": "", "title": "Egziabher Yistilign: Official Video",    "views": "2.4M views", "duration": "4:32",    "hidden": False},
    {"id": "v2", "url": "", "title": "Live at National Theatre: Full Concert", "views": "890K views", "duration": "1:12:44", "hidden": False},
    {"id": "v3", "url": "", "title": "Tsion: Behind the Scenes",               "views": "340K views", "duration": "8:15",    "hidden": False},
]

DEFAULT_NEWS = [
    {
        "id": "n1",
        "date": "2026",
        "tag": "New Release",
        "title": "Daivam Pirakunnu: Now Streaming",
        "excerpt": "Men Aloho's latest release \"Daivam Pirakunnu\" is now available on YouTube. A powerful Gospel rendition that has deeply moved audiences across Chennai and beyond.",
        "link": "https://www.youtube.com/watch?v=gfeKQae5Wq0",
        "linkLabel": "Watch on YouTube",
        "hidden": False,
    },
    {
        "id": "n2",
        "date": "2026",
        "tag": "Milestone",
        "title": "O Mariyame: Nearing 1 Million Views",
        "excerpt": "Their beloved Easter Liturgy rendition is fast approaching 1 million views, a testament to the power of their voices and the depth of their devotion.",
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


# ── Contact form ─────────────────────────────────────────────────────────────

REQUIRED_FIELDS = {"firstName", "lastName", "email", "subject", "message"}

_logo_path = Path(__file__).resolve().parent.parent.parent / "frontend" / "public" / "men-aloho-logo.jpg"
LOGO_BYTES = _logo_path.read_bytes() if _logo_path.exists() else None

SHARED_HEAD = """
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  </head>
"""

SHARED_STYLES = """
  font-family:'Inter',Arial,sans-serif;
  background:#f8f6f2;
  margin:0;padding:0;
"""

def _row(label, value, bg="#ffffff"):
    return f"""
      <tr style="background:{bg};">
        <td style="padding:10px 16px 10px 0;border-bottom:1px solid #f0ece5;font-family:'Inter',Arial,sans-serif;white-space:nowrap;width:1%;">
          <span style="font-size:11px;color:#b0a898;">{label}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ece5;text-align:right;font-family:'Inter',Arial,sans-serif;word-break:break-all;">
          <span style="font-size:13px;color:#1a1a1a;font-weight:500;">{value}</span>
        </td>
      </tr>"""

def _header(eyebrow):
    logo_img = (
        '<img src="cid:logo" width="36" height="36" alt="Men Aloho" '
        'style="border-radius:50%;object-fit:cover;display:block;">'
        if LOGO_BYTES else ""
    )
    return f"""
    <tr>
      <td style="padding:28px 44px 24px;border-bottom:1px solid #ede8df;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;padding-right:12px;">{logo_img}</td>
            <td style="vertical-align:middle;">
              <p style="margin:0;font-size:15px;font-weight:700;color:#1a1a1a;font-family:'Montserrat',Arial,sans-serif;letter-spacing:-0.2px;">Men Aloho</p>
            </td>
          </tr>
        </table>
        <p style="margin:10px 0 0;font-size:10px;color:#b0a898;font-family:'Inter',Arial,sans-serif;">{eyebrow}</p>
      </td>
    </tr>"""

def _footer(left, right_href, right_label):
    return f"""
    <tr>
      <td style="padding:16px 44px;border-top:1px solid #ede8df;background:#f8f6f2;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;color:#c0b8ae;font-family:'Inter',Arial,sans-serif;">{left}</td>
            <td style="text-align:right;">
              <a href="{right_href}" style="font-size:11px;color:#c0b8ae;text-decoration:none;font-family:'Inter',Arial,sans-serif;">{right_label}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>"""


def _build_internal_email(name, reply_to, phone, subject, event_date_display, message, first_name):
    rows = (
        _row("Name", name) +
        _row("Email", f'<a href="mailto:{reply_to}" style="color:#1a1a1a;text-decoration:underline;text-underline-offset:3px;">{reply_to}</a>') +
        _row("Phone", phone or "Not provided") +
        _row("Event type", subject.title()) +
        _row("Event date", event_date_display)
    )
    return f"""<!DOCTYPE html><html>{SHARED_HEAD}
<body style="{SHARED_STYLES}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f2;padding:48px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border:1px solid #e8e3da;">

        {_header("New booking enquiry")}

        <tr><td style="padding:32px 44px 36px;">
          <p style="margin:0 0 24px;font-size:13px;color:#5c5c5c;line-height:1.85;font-family:'Inter',Arial,sans-serif;">
            A booking request has been submitted through the website. Review the details below and reply directly to the enquirer.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0ece5;margin-bottom:28px;">
            {rows}
          </table>
          <p style="margin:0 0 10px;font-size:10px;color:#b0a898;font-family:'Inter',Arial,sans-serif;">Message</p>
          <div style="background:#f8f6f2;border-left:2px solid #d0ccc4;padding:16px 20px;margin-bottom:32px;">
            <p style="margin:0;font-size:13px;color:#3a3a3a;line-height:1.85;font-family:'Inter',Arial,sans-serif;">{message}</p>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
            <a href="mailto:{reply_to}" style="display:inline-block;background:#1a1a1a;color:#ffffff;font-family:'Montserrat',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:13px 28px;">
              Reply to {first_name}
            </a>
          </td></tr></table>
        </td></tr>

        {_footer("menaloho@gmail.com", "https://menaloho.com", "menaloho.com")}

      </table>
    </td></tr>
  </table>
</body></html>"""


def _build_confirmation_email(name, reply_to, first_name, subject, event_date_display):
    rows = (
        _row("Event type", subject.title()) +
        _row("Event date", event_date_display) +
        _row("Contact", reply_to)
    )
    return f"""<!DOCTYPE html><html>{SHARED_HEAD}
<body style="{SHARED_STYLES}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f2;padding:48px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border:1px solid #e8e3da;">

        {_header("Booking enquiry received")}

        <tr><td style="padding:32px 44px 36px;">
          <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#1a1a1a;font-family:'Montserrat',Arial,sans-serif;letter-spacing:-0.2px;">Thank you, {first_name}.</p>
          <p style="margin:0 0 16px;font-size:13px;color:#5c5c5c;line-height:1.85;font-family:'Inter',Arial,sans-serif;">
            We've received your enquiry and are truly glad you reached out. It would be a privilege to be part of your occasion.
          </p>
          <p style="margin:0 0 24px;font-size:13px;color:#5c5c5c;line-height:1.85;font-family:'Inter',Arial,sans-serif;">
            One of us will be in touch with you shortly. In the meantime, here's a summary of what we received.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0ece5;margin-bottom:24px;">
            {rows}
          </table>
          <p style="margin:0 0 24px;font-size:13px;color:#5c5c5c;line-height:1.85;font-family:'Inter',Arial,sans-serif;">
            If you have any additional details to share, feel free to reply to this email.
          </p>

          <p style="margin:0 0 4px;font-size:13px;color:#5c5c5c;font-family:'Inter',Arial,sans-serif;">Warm regards,</p>
          <p style="margin:0 0 40px;font-size:13px;font-weight:700;color:#1a1a1a;font-family:'Montserrat',Arial,sans-serif;">Men Aloho</p>

          <p style="margin:0 0 10px;font-size:10px;color:#b0a898;font-family:'Inter',Arial,sans-serif;">Listen while you wait</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0ece5;">
            <tr>
              <td style="padding:11px 0;border-bottom:1px solid #f0ece5;">
                <a href="https://www.youtube.com/@MenAloho" style="text-decoration:none;display:flex;align-items:center;gap:10px;">
                  <span style="font-size:13px;color:#2a2a2a;font-weight:500;font-family:'Inter',Arial,sans-serif;">YouTube</span>
                </a>
              </td>
              <td style="padding:11px 0;border-bottom:1px solid #f0ece5;text-align:right;">
                <a href="https://www.youtube.com/@MenAloho" style="font-size:11px;color:#c8c4bc;text-decoration:none;">&#8599;</a>
              </td>
            </tr>
            <tr>
              <td style="padding:11px 0;border-bottom:1px solid #f0ece5;">
                <span style="font-size:13px;color:#2a2a2a;font-weight:500;font-family:'Inter',Arial,sans-serif;">Spotify</span>
              </td>
              <td style="padding:11px 0;border-bottom:1px solid #f0ece5;text-align:right;">
                <a href="https://open.spotify.com/artist/3elVp9RS2s3wh9ao7x3Xsg" style="font-size:11px;color:#c8c4bc;text-decoration:none;">&#8599;</a>
              </td>
            </tr>
            <tr>
              <td style="padding:11px 0;">
                <span style="font-size:13px;color:#2a2a2a;font-weight:500;font-family:'Inter',Arial,sans-serif;">Apple Music</span>
              </td>
              <td style="padding:11px 0;text-align:right;">
                <a href="https://music.apple.com/in/artist/men-aloho/1820565917" style="font-size:11px;color:#c8c4bc;text-decoration:none;">&#8599;</a>
              </td>
            </tr>
          </table>
        </td></tr>

        {_footer("menaloho.com", "https://www.instagram.com/menaloho", "@menaloho")}

      </table>
    </td></tr>
  </table>
</body></html>"""


@csrf_exempt
@require_http_methods(["POST"])
def contact(request):
    try:
        body = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return err("Invalid JSON", 400)

    missing = REQUIRED_FIELDS - {k for k, v in body.items() if str(v).strip()}
    if missing:
        return err(f"Missing fields: {', '.join(sorted(missing))}", 400)

    first_name = body["firstName"].strip()
    name = f"{first_name} {body['lastName'].strip()}"
    reply_to = body["email"].strip()

    if reply_to.lower() == settings.CONTACT_RECIPIENT.lower():
        return err("Please use a personal email address to get in touch.", 400)
    phone = body.get("phone", "").strip()
    subject = body["subject"].strip()
    event_date_display = body.get("eventDate", "").strip() or "Not specified"
    message = body["message"].strip()

    internal = EmailMessage(
        subject=f"[Men Aloho] Booking enquiry — {subject.title()} · {name}",
        body=_build_internal_email(name, reply_to, phone, subject, event_date_display, message, first_name),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_RECIPIENT],
        reply_to=[reply_to],
    )
    internal.content_subtype = "html"

    confirmation = EmailMessage(
        subject="We've received your enquiry — Men Aloho",
        body=_build_confirmation_email(name, reply_to, first_name, subject, event_date_display),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[reply_to],
    )
    confirmation.content_subtype = "html"

    if LOGO_BYTES:
        from email.mime.image import MIMEImage
        for msg in (internal, confirmation):
            img = MIMEImage(LOGO_BYTES, "jpeg")
            img.add_header("Content-ID", "<logo>")
            img.add_header("Content-Disposition", "inline", filename="logo.jpg")
            msg.attach(img)

    def send_both():
        internal.send(fail_silently=True)
        confirmation.send(fail_silently=True)

    threading.Thread(target=send_both, daemon=True).start()

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

