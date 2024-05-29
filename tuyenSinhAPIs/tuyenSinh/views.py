from operator import attrgetter
from rest_framework import viewsets, generics
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.conf import settings
from tuyenSinh.models import Khoa, Diem, Diem_Khoa, ThiSinh, TuVanVien
from django.shortcuts import render
from tuyenSinh import serializers, paginators
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
    queryset = Khoa.objects.all()
    serializer_class = serializers.KhoaSerializer
    pagination_class = paginators.ItemPaginator

class DiemViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Diem.objects.all()
    serializer_class = serializers.DiemSerializer

class DiemKhoaViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Diem_Khoa.objects.all()
    serializer_class = serializers.DiemKhoaSerializer

class ThiSinhViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ThiSinh.objects.all()
    serializer_class = serializers.ThiSinhSerializer

class TuVanVienViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = TuVanVien.objects.all()
    serializer_class = serializers.TuVanVienSerializer
