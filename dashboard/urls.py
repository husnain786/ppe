from django.urls import path, re_path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('devices/', views.devices, name='devices'),
    path('devices/<int:pk>/', views.devices, name='edit_device'),
    path('devices/delete/<int:pk>/', views.delete_device, name='delete_device'),
    
    path('api/nvrs/', views.nvrs, name='get_nvrs'),
    path('nvrs/', views.nvrs, name='add_nvr'),
    path('nvrs/<int:pk>/', views.nvrs, name='edit_nvr'),
    path('nvrs/delete/<int:pk>/', views.delete_nvr, name='delete_nvr'),
    path('nvrs/<int:pk>/add_channel/', views.add_nvr_channel, name='add_nvr_channel'),

    path('api/rtsp-templates/', views.rtsp_templates, name='get_rtsp_templates'),
    path('rtsp-templates/', views.rtsp_templates, name='add_rtsp_template'),
    path('rtsp-templates/<int:pk>/', views.rtsp_templates, name='edit_rtsp_template'),
    path('rtsp-templates/delete/<int:pk>/', views.delete_rtsp_template, name='delete_rtsp_template'),

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
