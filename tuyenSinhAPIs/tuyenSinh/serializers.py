from rest_framework import serializers
from  tuyenSinh.models import Khoa, Diem, Diem_Khoa, ThiSinh, TuVanVien, User

class KhoaSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        video = instance.video
        if video:
            req['video'] = video.url
        return req
    class Meta:
        model = Khoa
        fields = ['id', 'name', 'website', 'video']

class DiemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diem
        fields = '__all__'

class DiemKhoaSerializer(serializers.ModelSerializer):
    diem = DiemSerializer()
    khoa = KhoaSerializer()
    class Meta:
        model = Diem_Khoa
        fields = ['id', 'khoa', 'diem', 'year']

class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(user.password)
        user.save()

        return user
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'email', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

class ThiSinhSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThiSinh
        fields = '__all__'

class TuVanVienSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = TuVanVien
        fields = ['id', 'name', 'birthday', 'gender', 'email', 'khoa', 'user']

# DetailSerializers
class KhoaDetailSerializer(KhoaSerializer):
    diem_khoa_set = DiemKhoaSerializer(many=True, read_only=True)
    class Meta:
        model = KhoaSerializer.Meta.model
        fields = KhoaSerializer.Meta.fields + ['introduction', 'program_description', 'diem_khoa_set']

class TuVanVienDetailSerializer(ThiSinhSerializer):
    khoa = KhoaSerializer()

    class Meta:
        model = TuVanVienSerializer.Meta.model
        fields = TuVanVienSerializer.Meta.fields + ['khoa']