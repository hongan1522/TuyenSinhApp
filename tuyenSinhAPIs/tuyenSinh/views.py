from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, generics, status, parsers, permissions
from django.http import HttpResponse
from django.conf import settings
from tuyenSinh.models import Khoa, Diem, Diem_Khoa, ThiSinh, TuVanVien, User, TuyenSinh, TinTuc, Banner, BinhLuan, Admin, Like
from tuyenSinh import serializers, paginators, perms
from rest_framework.decorators import action
from rest_framework.response import Response
import datetime
import os

from tuyenSinh.serializers import TuyenSinhSerializer, TinTucSerializer, BannerSerializer, KhoaSerializer, \
    AuthenticatedTinTucSerializer, BinhLuanSerializer
from .paginators import ItemPaginator, BinhLuanPaginator, TintucPaginator
# ViewSets
class KhoaViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Khoa.objects.filter(active=True)
    serializer_class = serializers.KhoaSerializer
    pagination_class = paginators.KhoaPaginator

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(name__icontains=q)

        return queryset

    def retrieve(self, request, pk=None):
        try:
            khoa = Khoa.objects.get(pk=pk)
            serializer = serializers.KhoaDetailSerializer(khoa)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Khoa.DoesNotExist:
            return Response({"detail": "Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            khoa = Khoa.objects.get(pk=pk)
            khoa.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Khoa.DoesNotExist:
            return Response({"detail": "Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, pk=None):
        try:
            khoa = Khoa.objects.get(pk=pk)
        except Khoa.DoesNotExist:
            return Response({"detail": "Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.KhoaSerializer(khoa, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            khoa = Khoa.objects.get(pk=pk)
        except Khoa.DoesNotExist:
            return Response({"detail": "Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.KhoaSerializer(khoa, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='diem', detail=True)
    def get_scores(self, request, pk=None):
        try:
            diem_khoa = Diem_Khoa.objects.filter(khoa_id=pk).order_by('-year')

            paginator = paginators.ItemPaginator()
            page = paginator.paginate_queryset(diem_khoa, request)
            if page is not None:
                serializer = serializers.DiemKhoaSerializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)

            if diem_khoa.exists():
                serializer = serializers.DiemKhoaSerializer(diem_khoa, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except Khoa.DoesNotExist:
            return Response({"detail": "Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='', detail=True)
    def get_scores_5year(self, request, pk=None):
        try:
            current_year = datetime.date.today().year
            years_ago = current_year - 5

            diem_khoa = Diem_Khoa.objects.filter(khoa_id=pk, year__gte=years_ago).order_by('-year')

            if diem_khoa.exists():
                serializer = serializers.DiemKhoaSerializer(diem_khoa, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except Khoa.DoesNotExist:
            return Response({"detail": "Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='tuvanvien', detail=True)
    def get_tuvanvien(self, request, pk):
        tvv = TuVanVien.objects.filter(khoa_id=pk)

        q = request.query_params.get('q')
        if q:
            tvv = tvv.filter(name__icontains=q)

        paginator = paginators.ItemPaginator()
        page = paginator.paginate_queryset(tvv, request)
        if page is not None:
            serializer = serializers.TuVanVienSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.TuVanVienSerializer(tvv, many=True).data, status.HTTP_200_OK)

class DiemViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Diem.objects.all()
    serializer_class = serializers.DiemSerializer
    pagination_class = paginators.ItemPaginator

    def retrieve(self, request, pk=None):
        try:
            diem = Diem.objects.get(pk=pk)
            serializer = serializers.DiemSerializer(diem)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Diem.DoesNotExist:
            return Response({"detail": "Diem not found."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            diem = Diem.objects.get(pk=pk)
            diem.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Diem.DoesNotExist:
            return Response({"detail": "Diem not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            diem = Diem.objects.get(pk=pk)
        except Diem.DoesNotExist:
            return Response({"detail": "Diem not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.DiemSerializer(diem, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DiemKhoaViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Diem_Khoa.objects.all()
    serializer_class = serializers.DiemKhoaSerializer
    pagination_class = paginators.ItemPaginator

    def retrieve(self, request, pk=None):
        try:
            diem_khoa = Diem_Khoa.objects.get(pk=pk)
            serializer = serializers.DiemKhoaDetailSerializer(diem_khoa)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Diem_Khoa.DoesNotExist:
            return Response({"detail": "Diem_Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            diem_khoa = Diem_Khoa.objects.get(pk=pk)
            diem_khoa.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Diem_Khoa.DoesNotExist:
            return Response({"detail": "Diem_Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            dk = Diem_Khoa.objects.get(pk=pk)
        except Khoa.DoesNotExist:
            return Response({"detail": "Diem_Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.DiemKhoaSerializer(dk, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            dk = Diem_Khoa.objects.get(pk=pk)
        except Diem_Khoa.DoesNotExist:
            return Response({"detail": "Diem_Khoa not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.DiemKhoaSerializer(dk, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            u = User.objects.get(pk=pk)
            serializer = serializers.UserSerializer(u)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            u = User.objects.get(pk=pk)
            u.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            u = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.UserSerializer(u, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            u = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.UserSerializer(u, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if self.action in ['current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='', detail=False)
    def current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                if k == 'password':
                    user.set_password(v)
                else:
                    setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

class ThiSinhViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ThiSinh.objects.all()
    serializer_class = serializers.ThiSinhSerializer
    pagination_class = paginators.ItemPaginator
    parser_classes = [parsers.MultiPartParser, ]

    def get_queryset(self):
        queryset = self.queryset

        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)

        return queryset

    def retrieve(self, request, pk=None):
        try:
            ts = ThiSinh.objects.get(pk=pk)
            serializer = serializers.ThiSinhSerializer(ts)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ThiSinh.DoesNotExist:
            return Response({"detail": "Thi sinh not found."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            ts = ThiSinh.objects.get(pk=pk)
            ts.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ThiSinh.DoesNotExist:
            return Response({"detail": "Thi sinh not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            ts = ThiSinh.objects.get(pk=pk)
        except ThiSinh.DoesNotExist:
            return Response({"detail": "ThiSinh not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.ThiSinhSerializer(ts, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            ts = ThiSinh.objects.get(pk=pk)
        except ThiSinh.DoesNotExist:
            return Response({"detail": "ThiSinh not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.ThiSinhSerializer(ts, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='user', detail=True)
    def get_user(self, request, pk):
        u = User.objects.filter(ts_profile=pk)

        q = request.query_params.get('q')
        if q:
            u = u.filter(username__icontains=q)

        return Response(serializers.UserSerializer(u, many=True).data, status.HTTP_200_OK)

class AdminViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Admin.objects.all()
    serializer_class = serializers.AdminSerializer
    pagination_class = paginators.ItemPaginator

    def retrieve(self, request, pk=None):
        try:
            admin = Admin.objects.get(pk=pk)
            serializer = serializers.AdminDetailSerializer(admin)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Admin.DoesNotExist:
            return Response({"detail": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            admin = Admin.objects.get(pk=pk)
            admin.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Admin.DoesNotExist:
            return Response({"detail": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            admin = Admin.objects.get(pk=pk)
        except Admin.DoesNotExist:
            return Response({"detail": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.AdminSerializer(admin, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            admin = Admin.objects.get(pk=pk)
        except Admin.DoesNotExist:
            return Response({"detail": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.AdminSerializer(admin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='user', detail=True)
    def get_user(self, request, pk):
        u = User.objects.filter(admin_profile=pk)

        q = request.query_params.get('q')
        if q:
            u = u.filter(username__icontains=q)

        return Response(serializers.UserSerializer(u, many=True).data, status.HTTP_200_OK)

class TuVanVienViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = TuVanVien.objects.all()
    serializer_class = serializers.TuVanVienSerializer
    pagination_class = paginators.ItemPaginator

    def get_queryset(self):
        queryset = self.queryset

        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)

        khoa = self.request.query_params.get('khoa_id')
        if khoa:
            queryset = queryset.filter(khoa_id=khoa)

        return queryset

    def retrieve(self, request, pk=None):
        try:
            tvv = TuVanVien.objects.get(pk=pk)
            serializer = serializers.TuVanVienDetailSerializer(tvv)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TuVanVien.DoesNotExist:
            return Response({"detail": "Tu van vien not found."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            tvv = TuVanVien.objects.get(pk=pk)
            tvv.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TuVanVien.DoesNotExist:
            return Response({"detail": "Tu van vien not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            tvv = TuVanVien.objects.get(pk=pk)
        except TuVanVien.DoesNotExist:
            return Response({"detail": "TuVanVien not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.TuVanVienSerializer(tvv, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            tvv = TuVanVien.objects.get(pk=pk)
        except TuVanVien.DoesNotExist:
            return Response({"detail": "TuVanVien not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.TuVanVienSerializer(tvv, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='user', detail=True)
    def get_user(self, request, pk):
        u = User.objects.filter(tvv_profile=pk)

        q = request.query_params.get('q')
        if q:
            u = u.filter(username__icontains=q)

        return Response(serializers.UserSerializer(u, many=True).data, status.HTTP_200_OK)

    @action(methods=['get'], url_path='khoa', detail=True)
    def get_khoa(self, request, pk):
        k = Khoa.objects.filter(khoa=pk)

        q = request.query_params.get('q')
        if q:
            k = k.filter(name__icontains=q)

        return Response(serializers.KhoaSerializer(k, many=True).data, status.HTTP_200_OK)

class BinhLuanViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = BinhLuan.objects.all()
    serializer_class = serializers.BinhLuanSerializer
    pagination_class = paginators.ItemPaginator

    def get_queryset(self):
        queryset = self.queryset

        tintuc = self.request.query_params.get('tintuc_id')
        if tintuc:
            queryset = queryset.filter(tintuc_id=tintuc)

        return queryset

    def retrieve(self, request, pk=None):
        try:
            bl = BinhLuan.objects.get(pk=pk)
            serializer = serializers.BinhLuanDetailSerializer(bl)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BinhLuan.DoesNotExist:
            return Response({"detail": "BinhLuan not found."}, status=status.HTTP_404_NOT_FOUND)

    def get_permissions(self):
        if self.action in ['destroy', 'update']:
            return [perms.BinhLuanOwner()]

        return [permissions.AllowAny()]

    def destroy(self, request, pk=None):
        try:
            bl = BinhLuan.objects.get(pk=pk)
            self.check_object_permissions(request, bl)
            bl.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except BinhLuan.DoesNotExist:
            return Response({"detail": "BinhLuan not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            bl = BinhLuan.objects.get(pk=pk)
        except BinhLuan.DoesNotExist:
            return Response({"detail": "BinhLuan not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.BinhLuanSerializer(bl, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            bl = BinhLuan.objects.get(pk=pk)
        except BinhLuan.DoesNotExist:
            return Response({"detail": "BinhLuan not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.BinhLuanSerializer(bl, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='tintuc', detail=True)
    def get_tintuc(self, request, pk):
        tt = TinTuc.objects.filter(binhluan_id=pk)

        q = request.query_params.get('q')
        if q:
            tt = tt.filter(name__icontains=q)

        return Response(serializers.TinTucSerializer(tt, many=True).data, status.HTTP_200_OK)

    @action(methods=['get'], url_path='user', detail=True)
    def get_user(self, request, pk):
        u = User.objects.filter(pk=pk)

        q = request.query_params.get('q')
        if q:
            u = u.filter(username__icontains=q)

        return Response(serializers.UserSerializer(u, many=True).data, status.HTTP_200_OK)

class BannerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

    @swagger_auto_schema(responses={200: BannerSerializer(many=True)})
    def list(self, request):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(responses={200: BannerSerializer()})
    def retrieve(self, request, pk=None):
        try:
            banner = Banner.objects.get(pk=pk)
            serializer = self.serializer_class(banner)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Banner.DoesNotExist:
            return Response({"detail": "Banner not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(request_body=BannerSerializer, responses={201: BannerSerializer()})
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=BannerSerializer, responses={200: BannerSerializer()})
    def update(self, request, pk=None):
        try:
            banner = Banner.objects.get(pk=pk)
            serializer = self.serializer_class(banner, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Banner.DoesNotExist:
            return Response({"detail": "Banner not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(request_body=BannerSerializer, responses={200: BannerSerializer()})
    def partial_update(self, request, pk=None):
        try:
            banner = Banner.objects.get(pk=pk)
            serializer = self.serializer_class(banner, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Banner.DoesNotExist:
            return Response({"detail": "Banner not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(responses={204: 'No Content'})
    def destroy(self, request, pk=None):
        try:
            banner = Banner.objects.get(pk=pk)
            banner.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Banner.DoesNotExist:
            return Response({"detail": "Banner not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='related', detail=True)
    def get_related(self, request, pk=None):
        # Define the logic for getting related objects for Banner if any
        banner = self.get_object()
        # Example: Assuming there's a related field 'tintuc' in Banner model
        related_objects = banner.tintuc_set.all()
        serializer = TinTucSerializer(related_objects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TinTucViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = TinTuc.objects.all()
    serializer_class = TinTucSerializer
    pagination_class = TintucPaginator

    def get_permissions(self):
        if self.action in ['add_binhluan', 'like']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return AuthenticatedTinTucSerializer
        return self.serializer_class

    @swagger_auto_schema(responses={200: TinTucSerializer(many=True)})
    def list(self, request):
        queryset = self.queryset
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = self.get_serializer_class()(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.get_serializer_class()(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(responses={200: TinTucSerializer()})
    def retrieve(self, request, pk=None):
        try:
            tintuc = TinTuc.objects.get(pk=pk)
            serializer_class = self.get_serializer_class()
            serializer = serializer_class(tintuc, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TinTuc.DoesNotExist:
            return Response({"detail": "TinTuc not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(request_body=TinTucSerializer, responses={201: TinTucSerializer()})
    def create(self, request):
        serializer = self.get_serializer_class()(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=TinTucSerializer, responses={200: TinTucSerializer()})
    def update(self, request, pk=None):
        try:
            tintuc = TinTuc.objects.get(pk=pk)
            serializer = self.get_serializer_class()(tintuc, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TinTuc.DoesNotExist:
            return Response({"detail": "TinTuc not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(request_body=TinTucSerializer, responses={200: TinTucSerializer()})
    def partial_update(self, request, pk=None):
        try:
            tintuc = TinTuc.objects.get(pk=pk)
            serializer = self.get_serializer_class()(tintuc, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TinTuc.DoesNotExist:
            return Response({"detail": "TinTuc not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(responses={204: 'No Content'})
    def destroy(self, request, pk=None):
        try:
            tintuc = TinTuc.objects.get(pk=pk)
            tintuc.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TinTuc.DoesNotExist:
            return Response({"detail": "TinTuc not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='tuyen-sinh', detail=True)
    def get_tuyen_sinh(self, request, pk=None):
        tin_tuc = self.get_object()
        tuyen_sinh = TuyenSinh.objects.filter(tintuc=tin_tuc)
        q = request.query_params.get('q')
        if q:
            tuyen_sinh = tuyen_sinh.filter(introduction__icontains=q)
        return Response(TuyenSinhSerializer(tuyen_sinh, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='binhluan', detail=True)
    def get_binhluan(self, request, pk):
        bl = BinhLuan.objects.filter(tintuc_id=pk)
        paginator = BinhLuanPaginator()
        page = paginator.paginate_queryset(bl, request)
        if page is not None:
            serializer = BinhLuanSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response(BinhLuanSerializer(bl, many=True).data, status.HTTP_200_OK)

    @action(methods=['post'], url_path='binhluan', detail=True)
    def add_binhluan(self, request, pk):
        bl = self.get_object().binhluan_set.create(user=request.user, content=request.data.get('content'))
        return Response(BinhLuanSerializer(bl).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        l, created = Like.objects.get_or_create(tintuc=self.get_object(), user=request.user)
        if not created:
            l.active = not l.active
            l.save()
        serializer = AuthenticatedTinTucSerializer(self.get_object(), context={'request': request})
        return Response(serializer.data)


from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from .models import TuyenSinh
from .serializers import TuyenSinhSerializer
from . import paginators

class TuyenSinhViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = TuyenSinh.objects.all()
    serializer_class = TuyenSinhSerializer
    pagination_class = paginators.ItemPaginator

    @swagger_auto_schema(responses={200: TuyenSinhSerializer(many=True)})
    def list(self, request):
        queryset = self.queryset
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(responses={200: TuyenSinhSerializer()})
    def retrieve(self, request, pk=None):
        try:
            tuyensinh = TuyenSinh.objects.get(pk=pk)
            serializer = self.serializer_class(tuyensinh)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TuyenSinh.DoesNotExist:
            return Response({"detail": "TuyenSinh not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(request_body=TuyenSinhSerializer, responses={201: TuyenSinhSerializer()})
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=TuyenSinhSerializer, responses={200: TuyenSinhSerializer()})
    def update(self, request, pk=None):
        try:
            tuyensinh = TuyenSinh.objects.get(pk=pk)
            serializer = self.serializer_class(tuyensinh, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TuyenSinh.DoesNotExist:
            return Response({"detail": "TuyenSinh not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(request_body=TuyenSinhSerializer, responses={200: TuyenSinhSerializer()})
    def partial_update(self, request, pk=None):
        try:
            tuyensinh = TuyenSinh.objects.get(pk=pk)
            serializer = self.serializer_class(tuyensinh, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TuyenSinh.DoesNotExist:
            return Response({"detail": "TuyenSinh not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(responses={204: 'No Content'})
    def destroy(self, request, pk=None):
        try:
            tuyensinh = TuyenSinh.objects.get(pk=pk)
            tuyensinh.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TuyenSinh.DoesNotExist:
            return Response({"detail": "TuyenSinh not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='khoa', detail=True)
    def get_khoa(self, request, pk=None):
        tuyen_sinh = self.get_object()
        khoa = Khoa.objects.filter(tuyensinh=tuyen_sinh)

        paginator = paginators.ItemPaginator()
        page = paginator.paginate_queryset(khoa, request)
        if page is not None:
            serializer = serializers.KhoaSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        q = request.query_params.get('q')
        if q:
            khoa = khoa.filter(name__icontains=q)

        return Response(KhoaSerializer(khoa, many=True).data, status=status.HTTP_200_OK)
