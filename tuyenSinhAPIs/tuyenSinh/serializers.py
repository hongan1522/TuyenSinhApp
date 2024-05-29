from rest_framework import serializers
from  tuyenSinh.models import Khoa, Diem, Diem_Khoa, ThiSinh, TuVanVien

class KhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Khoa
        fields = ['id', 'name', 'website', 'video']

class DiemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diem
        fields = '__all__'

class DiemKhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diem_Khoa
        fields = '__all__'

class ThiSinhSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThiSinh
        fields = ['id', 'name', 'birthday', 'gender', 'email']

class TuVanVienSerializer(serializers.ModelSerializer):
    class Meta:
        model = TuVanVien
        fields = ['id', 'name', 'birthday', 'gender', 'email', 'khoa']