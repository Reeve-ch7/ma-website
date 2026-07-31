from django.urls import path
from . import views

urlpatterns = [
    path("visit", views.track_visit),
    path("heartbeat", views.heartbeat),
    path("summary", views.summary),
    path("active-users", views.active_users),
]
