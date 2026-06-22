from django.urls import path
from . import views

urlpatterns = [
    path("login", views.login),
    path("verify", views.verify),
    path("gallery", views.gallery),
    path("videos", views.videos),
    path("news", views.news),
    path("music-overrides", views.music_overrides),
    path("group-photo", views.group_photo),
    path("upload", views.upload),
]
