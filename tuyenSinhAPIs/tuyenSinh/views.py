from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from tuyenSinh.models import Khoa
import os

# Create your views here.

def index(request):
    return HttpResponse("Hello")

def khoa_video(request, year, month, filename):
    video_path = os.path.join('khoa', 'video', year, month, filename)
    full_video_path = os.path.join(settings.MEDIA_ROOT, video_path)

    if os.path.exists(full_video_path):
        with open(full_video_path, 'rb') as video_file:
            response = HttpResponse(video_file.read(), content_type='video/mp4')
        return response
    else:
        return HttpResponse('Video not found', status=404)

