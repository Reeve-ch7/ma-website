from django.db import models


class PageVisit(models.Model):
    page = models.CharField(max_length=200)
    session_id = models.CharField(max_length=64, blank=True, default="", db_index=True)
    referrer = models.CharField(max_length=500, blank=True, default="")
    device_type = models.CharField(max_length=10, blank=True, default="")
    timezone = models.CharField(max_length=60, blank=True, default="")
    language = models.CharField(max_length=30, blank=True, default="")
    os = models.CharField(max_length=20, blank=True, default="")
    browser = models.CharField(max_length=20, blank=True, default="")
    country = models.CharField(max_length=60, blank=True, default="")
    city = models.CharField(max_length=80, blank=True, default="")
    is_returning = models.BooleanField(default=False)
    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["visited_at"])]


class Heartbeat(models.Model):
    """One row per browser session; last_seen is updated on each ping."""
    session_id = models.CharField(max_length=64, primary_key=True)
    last_seen = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["last_seen"])]
