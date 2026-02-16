from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

urlpatterns = [
    path("", lambda request: JsonResponse({"ok": True})),
    path("admin/", admin.site.urls),
    path("api/", include("API.urls")),
]
