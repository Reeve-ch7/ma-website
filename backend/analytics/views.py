import json
import threading
from datetime import date, timedelta
from urllib.parse import urlparse
from urllib.request import urlopen

from django.db import connection as _db_conn
from django.db.models import Count
from django.db.models.functions import ExtractHour, TruncDate, TruncMonth
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from api.views import is_authorized

from .models import Heartbeat, PageVisit

ACTIVE_WINDOW_SECONDS = 60
_LOCAL_PREFIXES = ("127.", "192.168.", "10.", "::1", "localhost")

LANG_NAMES = {
    "en": "English", "zh": "Chinese", "es": "Spanish", "hi": "Hindi",
    "ar": "Arabic", "fr": "French", "de": "German", "ja": "Japanese",
    "pt": "Portuguese", "ru": "Russian", "ko": "Korean", "it": "Italian",
    "nl": "Dutch", "pl": "Polish", "sv": "Swedish", "tr": "Turkish",
    "th": "Thai", "vi": "Vietnamese", "id": "Indonesian", "da": "Danish",
    "fi": "Finnish", "no": "Norwegian", "cs": "Czech", "ro": "Romanian",
    "hu": "Hungarian", "uk": "Ukrainian", "el": "Greek", "ml": "Malayalam",
    "ta": "Tamil", "am": "Amharic",
}


def ok(data):
    if isinstance(data, list):
        return JsonResponse(data, safe=False)
    return JsonResponse(data)


def err(msg, status=401):
    return JsonResponse({"error": msg}, status=status)


def _parse_language(lang):
    if not lang:
        return ""
    code = lang.split("-")[0].lower()
    return LANG_NAMES.get(code, code.upper())


def _parse_ua(ua):
    if not ua:
        return "", ""
    u = ua.lower()
    if "edg/" in u or "edga/" in u or "edgios/" in u:
        browser = "Edge"
    elif "opr/" in u or "opera" in u:
        browser = "Opera"
    elif "samsungbrowser" in u:
        browser = "Samsung"
    elif "crios/" in u:
        browser = "Chrome"
    elif "fxios/" in u or "firefox/" in u:
        browser = "Firefox"
    elif "chrome/" in u and "chromium" not in u:
        browser = "Chrome"
    elif "safari/" in u:
        browser = "Safari"
    else:
        browser = "Other"

    if "iphone" in u or "ipad" in u or "ipod" in u:
        os_name = "iOS"
    elif "android" in u:
        os_name = "Android"
    elif "cros" in u:
        os_name = "ChromeOS"
    elif "mac os x" in u or "macos" in u:
        os_name = "macOS"
    elif "windows" in u:
        os_name = "Windows"
    elif "linux" in u:
        os_name = "Linux"
    else:
        os_name = "Other"
    return os_name, browser


def _parse_referrer(referrer):
    if not referrer:
        return "Direct"
    try:
        host = urlparse(referrer).netloc.lower().lstrip("www.")
        if "linkedin" in host:
            return "LinkedIn"
        if "instagram" in host:
            return "Instagram"
        if "facebook" in host or "fb.com" in host:
            return "Facebook"
        if "youtube" in host or "youtu.be" in host:
            return "YouTube"
        if "google" in host:
            return "Google"
        if "twitter" in host or "t.co" in host or "x.com" in host:
            return "Twitter / X"
        if "reddit" in host:
            return "Reddit"
        if "bing" in host:
            return "Bing"
        return host or "Direct"
    except Exception:
        return "Other"


def _get_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


def _geolocate(ip, visit_id):
    """Call ip-api.com in a background thread; update the visit row on success."""
    if not ip or any(ip.startswith(p) for p in _LOCAL_PREFIXES):
        return

    def _fetch():
        try:
            url = f"http://ip-api.com/json/{ip}?fields=status,country,city"
            with urlopen(url, timeout=3) as resp:
                data = json.loads(resp.read())
            if data.get("status") == "success":
                PageVisit.objects.filter(pk=visit_id).update(
                    country=data.get("country", "")[:60],
                    city=data.get("city", "")[:80],
                )
        except Exception:
            pass  # never block analytics on geo failure
        finally:
            _db_conn.close()

    threading.Thread(target=_fetch, daemon=True).start()


# ── Tracking (public) ────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def track_visit(request):
    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        data = {}
    page = str(data.get("page", "/"))[:200]
    session_id = str(data.get("session_id", ""))[:64]
    referrer = str(data.get("referrer", ""))[:500]
    device_type = str(data.get("device_type", ""))[:10]
    tz = str(data.get("timezone", ""))[:60]
    language = _parse_language(str(data.get("language", "")))
    is_returning = bool(data.get("is_returning", False))
    ua = request.META.get("HTTP_USER_AGENT", "")
    os_name, browser = _parse_ua(ua)

    visit = PageVisit.objects.create(
        page=page, session_id=session_id, referrer=referrer,
        device_type=device_type, timezone=tz, language=language,
        os=os_name, browser=browser, is_returning=is_returning,
    )
    _geolocate(_get_ip(request), visit.id)
    return ok({"ok": True})


@csrf_exempt
@require_http_methods(["POST"])
def heartbeat(request):
    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        data = {}
    session_id = str(data.get("session_id", ""))[:64]
    if not session_id:
        return err("Invalid session_id", 400)
    Heartbeat.objects.update_or_create(session_id=session_id)
    return ok({"ok": True})


# ── Dashboard (admin-only) ───────────────────────────────────────────────────

@require_http_methods(["GET"])
def active_users(request):
    if not is_authorized(request):
        return err("Unauthorized")
    cutoff = timezone.now() - timedelta(seconds=ACTIVE_WINDOW_SECONDS)
    count = Heartbeat.objects.filter(last_seen__gte=cutoff).count()
    return ok({"active_users": count})


def _date_range(range_key):
    today = timezone.now().date()
    if range_key == "this_month":
        return today.replace(day=1), today, "day"
    if range_key == "last_month":
        first_this = today.replace(day=1)
        end = first_this - timedelta(days=1)
        return end.replace(day=1), end, "day"
    if range_key == "this_year":
        return today.replace(month=1, day=1), today, "month"
    return None, today, "month"  # all_time


def _bucket_date(d, granularity):
    if hasattr(d, "date"):
        d = d.date()
    return d if granularity == "day" else d.replace(day=1)


def _iter_buckets(start, end, granularity):
    if granularity == "day":
        cur = start
        while cur <= end:
            yield cur
            cur += timedelta(days=1)
    else:
        cur = (start or end).replace(day=1)
        end_m = end.replace(day=1)
        while cur <= end_m:
            yield cur
            cur = date(cur.year + 1, 1, 1) if cur.month == 12 else date(cur.year, cur.month + 1, 1)


def _label(d, granularity):
    return d.strftime("%b %-d") if granularity == "day" else d.strftime("%b %Y")


def _compute_summary(range_key):
    start, end, granularity = _date_range(range_key)
    trunc = TruncDate if granularity == "day" else TruncMonth

    def ar(qs):
        if start:
            qs = qs.filter(visited_at__date__gte=start)
        return qs.filter(visited_at__date__lte=end)

    base = ar(PageVisit.objects.all())

    visit_rows = (base.annotate(bucket=trunc("visited_at"))
                  .values("bucket").annotate(count=Count("id")).order_by("bucket"))
    visit_lookup = {_bucket_date(r["bucket"], granularity): r["count"] for r in visit_rows}

    if start is not None:
        effective_start = start
    elif visit_lookup:
        effective_start = min(visit_lookup)
    else:
        effective_start = end.replace(day=1)

    page_visits = [
        {"label": _label(d, granularity), "count": visit_lookup.get(d, 0)}
        for d in _iter_buckets(effective_start, end, granularity)
    ]

    top_pages = list(base.values("page").annotate(count=Count("id")).order_by("-count")[:10])

    hour_lkp = {r["hour"]: r["count"] for r in (
        base.annotate(hour=ExtractHour("visited_at")).values("hour").annotate(count=Count("id"))
    )}
    hourly_visits = [{"hour": h, "label": f"{h:02d}:00", "count": hour_lkp.get(h, 0)} for h in range(24)]

    ref_rows = base.exclude(referrer="").values("referrer").annotate(count=Count("id"))
    src_counts = {}
    for r in ref_rows:
        src = _parse_referrer(r["referrer"])
        src_counts[src] = src_counts.get(src, 0) + r["count"]
    direct = base.filter(referrer="").count()
    if direct:
        src_counts["Direct"] = src_counts.get("Direct", 0) + direct
    traffic_sources = sorted(
        [{"source": k, "count": v} for k, v in src_counts.items()], key=lambda x: -x["count"]
    )[:8]

    device_split = {r["device_type"]: r["count"] for r in (
        base.exclude(device_type="").values("device_type").annotate(count=Count("id"))
    )}

    pages_qs = base.exclude(session_id="").values("session_id").annotate(pages=Count("id"))
    session_depth = {
        "bounced": pages_qs.filter(pages=1).count(),
        "engaged": pages_qs.filter(pages__gt=1).count(),
    }

    def top_field(field):
        rows = list(base.exclude(**{field: ""}).values(field).annotate(count=Count("id")).order_by("-count")[:10])
        return [{"label": r[field], "count": r["count"]} for r in rows]

    total = base.count()
    new_count = base.filter(is_returning=False).count()
    returning_count = base.filter(is_returning=True).count()

    return {
        "range": range_key,
        "granularity": granularity,
        "page_visits": page_visits,
        "top_pages": top_pages,
        "hourly_visits": hourly_visits,
        "traffic_sources": traffic_sources,
        "device_split": device_split,
        "session_depth": session_depth,
        "timezones": top_field("timezone"),
        "languages": top_field("language"),
        "operating_systems": top_field("os"),
        "browsers": top_field("browser"),
        "countries": top_field("country"),
        "cities": top_field("city"),
        "visitor_type": {"new": new_count, "returning": returning_count, "total": total},
    }


@require_http_methods(["GET"])
def summary(request):
    if not is_authorized(request):
        return err("Unauthorized")
    range_key = request.GET.get("range", "this_month")
    return ok(_compute_summary(range_key))
