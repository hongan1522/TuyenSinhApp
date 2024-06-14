from rest_framework import permissions
from tuyenSinh.models import User

class BinhLuanOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, binhluan):
        return super().has_permission(request, view) and request.user == binhluan.user

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.ADMIN