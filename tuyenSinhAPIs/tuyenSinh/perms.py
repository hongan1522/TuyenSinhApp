from rest_framework import permissions

class BinhLuanOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, binhluan):
        return super().has_permission(request, view) and request.user == binhluan.user