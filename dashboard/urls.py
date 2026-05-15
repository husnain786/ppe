from django.urls import path, re_path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('devices/', views.devices, name='devices'),
    path('devices/<int:pk>/', views.devices, name='edit_device'),
    path('devices/delete/<int:pk>/', views.delete_device, name='delete_device'),
    path('employee/edit/<int:pk>/', views.edit_employee, name='edit_employee'),
    path('employee/delete/<int:pk>/', views.delete_employee, name='delete_employee'),
    path('video_feed/', views.video_feed, name='video_feed'),
    path('camera_snapshot/', views.camera_snapshot, name='camera_snapshot'),
    path('api/logs/', views.get_logs, name='get_logs'),
    path('api/logs/clear/', views.clear_logs, name='clear_logs'),
    path('api/employees/', views.get_employees, name='get_employees'),
    path('api/cameras/', views.get_cameras, name='get_cameras'),
    path('api/mode/set/', views.set_system_mode, name='set_system_mode'),
    path('api/mode/get/', views.get_system_mode, name='get_system_mode'),
    re_path(r'^.*$', views.index, name='index'),
]
