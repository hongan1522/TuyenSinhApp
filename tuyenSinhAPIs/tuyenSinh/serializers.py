from rest_framework import serializers
from tuyenSinh.models import Khoa, Diem, Diem_Khoa, ThiSinh, TuVanVien, User, TuyenSinh, TinTuc, Banner


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

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()

        return instance

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
    # user = UserSerializer()
    class Meta:
        model = TuVanVien
        fields = ['id', 'name', 'birthday', 'gender', 'email', 'khoa', 'user']


class TuyenSinhSerializer(serializers.ModelSerializer):
    class Meta:
        model = TuyenSinh
        fields = ['id', 'type', 'start_date', 'end_date', 'introduction', 'khoa', 'diem']


class TinTucSerializer(serializers.ModelSerializer):
    class Meta:
        model = TinTuc
        fields = ['id', 'name', 'content', 'tuyenSinh', 'created_date', 'updates_date', 'active']


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'image', 'created_date', 'updates_date', 'active']


# DetailSerializers
class KhoaDetailSerializer(KhoaSerializer):
    diem_khoa = DiemKhoaSerializer(many=True, read_only=True)
    class Meta:
        model = KhoaSerializer.Meta.model
        fields = KhoaSerializer.Meta.fields + ['introduction', 'program_description', 'diem_khoa']

class DiemKhoaDetailSerializer(DiemKhoaSerializer):
    diem = DiemSerializer()
    khoa = KhoaSerializer()
    class Meta:
        model = DiemKhoaSerializer.Meta.model
        fields = DiemKhoaSerializer.Meta.fields + ['diem', 'khoa']

class TuVanVienDetailSerializer(ThiSinhSerializer):
    khoa = KhoaSerializer()

    class Meta:
        model = TuVanVienSerializer.Meta.model
        fields = TuVanVienSerializer.Meta.fields + ['khoa']