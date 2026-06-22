from django.urls import path, include
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path("api/", include("api.urls")),
    path("uploads/<path:path>", serve, {"document_root": settings.MEDIA_ROOT}),
]
