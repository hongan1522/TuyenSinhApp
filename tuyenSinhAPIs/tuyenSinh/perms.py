from rest_framework import permissions
from tuyenSinh.models import User

class BinhLuanOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, binhluan):
        return super().has_permission(request, view) and request.user == binhluan.user

class QuestionOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, question):
        return super().has_permission(request, view) and request.user == question.thisinh

class AnswerOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, answer):
        return super().has_permission(request, view) and request.user == answer.tuvanvien

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.ADMIN

class IsTuVanVien(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == User.TU_VAN_VIEN