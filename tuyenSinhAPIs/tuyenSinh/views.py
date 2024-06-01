from operator import attrgetter

from django.utils import timezone
from rest_framework import viewsets, generics, status, parsers
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.conf import settings
from tuyenSinh.models import Khoa, Diem, Diem_Khoa, ThiSinh, TuVanVien, User, BinhLuan
from django.shortcuts import render
from tuyenSinh import serializers, paginators
from rest_framework.decorators import action
from rest_framework.response import Response
import datetime
import os

def get_khoa_video(request, year, month, filename):
    video_path = os.path.join('khoa', 'video', year, month, filename)
    full_video_path = os.path.join(settings.MEDIA_ROOT, video_path)

    if os.path.exists(full_video_path):
        with open(full_video_path, 'rb') as video_file:
            response = HttpResponse(video_file.read(), content_type='video/mp4')
        return response
    else:
        return HttpResponse('Video not found', status=404)

def khoa_detail(request, id):
    khoa = get_object_or_404(Khoa, id=id)
    all_scores = Diem_Khoa.objects.filter(khoa=khoa).order_by('-year')
    return render(request, 'khoa_detail.html', {'khoa': khoa, 'all_scores': all_scores})

def get_5years_diem(request, id):
    khoa = get_object_or_404(Khoa, id=id)
    latest_scores = khoa.get_latest_scores(years=5)
    return render(request, 'khoa_scores_5years.html', {'latest_scores': latest_scores, 'khoa': khoa})

def get_latest_scores(request):
    current_year = datetime.date.today().year
    previous_year = current_year - 1
    previous_year1 = previous_year -1
    previous_year2 = previous_year1 -1
    previous_year3 = previous_year2 - 1
    khoa_scores = []
    all_khoa = Khoa.objects.all()
    for khoa in all_khoa:
        latest_scores = Diem_Khoa.objects.filter(khoa=khoa).order_by('-year')[:5]
        latest_scores = sorted(latest_scores, key=attrgetter('year'), reverse=True)
        khoa_scores.append({'khoa': khoa, 'latest_scores': latest_scores})

    return render(request, 'all_khoa_scores_5years.html', {'khoa_scores': khoa_scores,
            'current_year': current_year, 'previous_year': previous_year, 'previous_year1': previous_year1, 'previous_year2': previous_year2, 'previous_year3': previous_year3})

# ViewSets
class KhoaViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Khoa.objects.filter(active=True)
    serializer_class = serializers.KhoaSerializer
    pagination_class = paginators.ItemPaginator

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

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            bl = BinhLuan.objects.get(pk=pk)
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
