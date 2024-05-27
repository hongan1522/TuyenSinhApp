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
from django.urls import path, include, re_path
from tuyenSinh import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('tuyenSinh.urls')),
    path('khoa/video/<str:year>/<str:month>/<str:filename>', views.get_khoa_video, name='videoKhoa'),
    path('khoa/<int:id>/', views.khoa_detail, name='chiTietKhoa'),
    path('khoa/<int:id>/diem/', views.get_5years_diem, name='diemTrungTuyenTungKhoa'),
    path('khoa/diem/', views.get_latest_scores, name='diemTrungTuyenTatCaKhoa'),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]
