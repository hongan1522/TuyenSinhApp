from rest_framework import serializers
from tuyenSinh.models import Khoa, Diem, Diem_Khoa, ThiSinh, TuVanVien, \
    User, TuyenSinh, TinTuc, Banner, BinhLuan, Admin, Question, Answer

class KhoaSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        video = instance.video
        image = instance.image
        if video:
            req['video'] = video.url
        if image:
            req['image'] = image.url

        return req

    class Meta:
        model = Khoa
        fields = ['id', 'name', 'website', 'video', 'image']

class DiemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diem
        fields = '__all__'

class DiemKhoaSerializer(serializers.ModelSerializer):
    khoa_name = serializers.CharField(source='khoa.name', read_only=True)
    diem_value = serializers.FloatField(source='diem.value', read_only=True)

    class Meta:
        model = Diem_Khoa
        fields = ['id', 'khoa', 'khoa_name', 'diem', 'diem_value', 'year']

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

    def to_representation(self, instance):
        req = super().to_representation(instance)
        avatar = instance.avatar
        if avatar:
            req['avatar'] = avatar.url
        return req

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'email', 'avatar', 'role']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'user']

class ThiSinhSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThiSinh
        fields = '__all__'

class TuVanVienSerializer(serializers.ModelSerializer):
    class Meta:
        model = TuVanVien
        fields = ['id', 'name', 'birthday', 'gender', 'email', 'khoa', 'user']

class BinhLuanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinhLuan
        fields = ['id', 'user', 'tintuc', 'content', 'created_date']

class TuyenSinhSerializer(serializers.ModelSerializer):
    class Meta:
        model = TuyenSinh
        fields = ['id', 'type', 'start_date', 'end_date', 'introduction', 'khoa']


class TinTucSerializer(serializers.ModelSerializer):
    class Meta:
        model = TinTuc
        fields = ['id', 'name', 'content', 'tuyenSinh', 'created_date', 'updates_date', 'active']

class AuthenticatedTinTucSerializer(TinTucSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, tintuc):
        request = self.context.get('request')
        if request:
            return tintuc.like_set.filter(user=request.user, active=True).exists()

    class Meta:
        model = TinTucSerializer.Meta.model
        fields = TinTucSerializer.Meta.fields + ['liked']

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'image', 'created_date', 'updates_date',]

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'thisinh', 'question_text', 'is_frequently_asked', 'created_date']

class UpdateQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'updates_date']

class SetFrequentlyQuestionSerializer(serializers.Serializer):
    is_frequently_asked = serializers.BooleanField()

class AssignTuvanvienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['question', 'tuvanvien']

class AddAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'created_date']

class UpdateAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'updates_date']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'tuvanvien', 'answer_text', 'created_date']

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

class BinhLuanDetailSerializer(BinhLuanSerializer):
    user = UserSerializer()
    tintuc = TinTucSerializer()
    class Meta:
        model = BinhLuanSerializer.Meta.model
        fields = BinhLuanSerializer.Meta.fields + ['user', 'tintuc']

class AdminDetailSerializer(AdminSerializer):
    user = UserSerializer()

    class Meta:
        model = AdminSerializer.Meta.model
        fields = AdminSerializer.Meta.fields + ['user']

class TuVanVienDetailSerializer(ThiSinhSerializer):
    khoa = KhoaSerializer()

    class Meta:
        model = TuVanVienSerializer.Meta.model
        fields = TuVanVienSerializer.Meta.fields + ['khoa']

from .models import Livestream

class LivestreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livestream
        fields = '__all__'