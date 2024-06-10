"""
URL configuration for tuyenSinhAPIs project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from tuyenSinh import views
from rest_framework import routers
from tuyenSinh import views

r = routers.DefaultRouter()
r.register('khoa', views.KhoaViewSet, 'Khoa')
r.register('diem', views.DiemViewSet, 'Điểm')
r.register('diemkhoa', views.DiemKhoaViewSet, 'Điểm_Khoa')
r.register('thisinh', views.ThiSinhViewSet, 'Thí sinh')
r.register('tuvanvien', views.TuVanVienViewSet, 'Tư vấn viên')
r.register('tuyensinh', views.TuyenSinhViewSet)
r.register('tintuc', views.TinTucViewSet)
r.register('banner', views.BannerViewSet)
r.register('user', views.UserViewSet, 'User')
r.register('binhluan', views.BinhLuanViewSet, 'Bình luận')
r.register('Admin', views.AdminViewSet, 'Admin')

urlpatterns = [
    path('', include(r.urls)),
]

