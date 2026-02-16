from django.urls import path
from . import views

urlpatterns = [
    path("analyze/", views.analyze),
    path("youcam/skin-analysis/start/", views.skin_analysis_start),
    path("youcam/skin-analysis/status/<str:task_id>/", views.skin_analysis_status),
]
