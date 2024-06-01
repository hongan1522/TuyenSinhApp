import datetime

from django.db import models
from django.core.validators import URLValidator, MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django.core.exceptions import ValidationError
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.utils.dateformat import DateFormat


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updates_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['-id']

class Khoa(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    introduction = RichTextField()
    program_description = RichTextField()
    website = models.URLField(validators=[URLValidator()])
    video = CloudinaryField(resource_type='video',  null=True, blank=True)

    class Meta:
        verbose_name = 'Khoa'
        verbose_name_plural = 'Khoa'

    def __str__(self):
        return self.name

    def get_latest_scores(self, years=5):
        current_year = datetime.date.today().year
        return Diem_Khoa.objects.filter(khoa=self, year__gte=current_year - years + 1).order_by('-year')

class Diem(models.Model):
    value = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(30)], unique=True)
    
    class Meta:
        verbose_name = 'Điểm'
        verbose_name_plural = 'Điểm'

    def __str__(self):
        return f"{self.value}"

class Diem_Khoa(BaseModel):
    khoa = models.ForeignKey(Khoa, on_delete=models.PROTECT, related_name='diem_khoa')
    diem = models.ForeignKey(Diem, on_delete=models.PROTECT, related_name='diem_diem')
    year = models.IntegerField(validators=[MinValueValidator(2000), MaxValueValidator(datetime.date.today().year)], default=datetime.date.today().year)

    class Meta:
        unique_together = ('khoa', 'year')
        verbose_name = 'Điểm_Khoa'
        verbose_name_plural = 'Điểm_Khoa'

    def __str__(self):
        return f"{self.khoa.name} - {self.diem.value} ({self.year})"

class User(AbstractUser):
    ADMIN = 0
    TU_VAN_VIEN = 1
    THI_SINH = 2

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (TU_VAN_VIEN, 'Tư vấn viên'),
        (THI_SINH, 'Thí sinh'),
    ]

    role = models.IntegerField(choices=ROLE_CHOICES, default=THI_SINH)
    avatar = CloudinaryField(blank=False, null=False)

    class Meta:
        verbose_name = 'Tài khoản'
        verbose_name_plural = 'Tài khoản'

    def __str__(self):
        return self.username

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='admin_profile', primary_key=True)

    def __str__(self):
        return self.user.username

def validate_birthday(value):
    min_date = datetime.date(1990, 1, 1)
    today = timezone.now().date()
    age_limit = today - relativedelta(years=18)

    if value < min_date:
        raise ValidationError(f'Date of birth must be after date {min_date}')
    if value > age_limit:
        raise ValidationError('Users must be at least 18 years old')

class TuVanVien(models.Model):
    Nam = 0
    Nu = 1

    GENDER_CHOICES = [
        (Nam, 'Nam'),
        (Nu, 'Nữ'),
    ]

    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='tvv_profile')
    khoa = models.ForeignKey(Khoa, on_delete=models.PROTECT, related_name='khoa')
    gender = models.IntegerField(choices=GENDER_CHOICES, default=Nam)
    name = models.CharField(max_length=50)
    birthday = models.DateField()
    email = models.EmailField()

    class Meta:
        verbose_name = 'Tư vấn viên'
        verbose_name_plural = 'Tư vấn viên'

    def formatted_birthday(self):
        return DateFormat(self.birthday).format('d/m/Y')
    formatted_birthday.short_description = 'Birthday'

    def __str__(self):
        return self.user.username

class ThiSinh(models.Model):
    Nam = 0
    Nu = 1

    GENDER_CHOICES = [
        (Nam, 'Nam'),
        (Nu, 'Nữ'),
    ]

    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='ts_profile')
    gender = models.IntegerField(choices=GENDER_CHOICES, default=Nam)
    name = models.CharField(max_length=50)
    birthday = models.DateField(validators=[validate_birthday])
    email = models.EmailField()

    class Meta:
        verbose_name = 'Thí sinh'
        verbose_name_plural = 'Thí sinh'

    def formatted_birthday(self):
        return DateFormat(self.birthday).format('d/m/Y')
    formatted_birthday.short_description = 'Birthday'

    def __str__(self):
        return self.user.username
class Banner(BaseModel):
    image = models.ImageField(upload_to='banner/%Y/%m/', null=False)

    def __str__(self):
        return self.image

class TuyenSinh(models.Model):
    ChinhQuy = 0
    LienThong = 1
    ThacSi = 2
    CaoHoc = 3
    DTTX = 4

    TYPE_CHOICES = [
        (ChinhQuy, 'Tuyển sinh hệ chính quy'),
        (LienThong, 'Tuyển sinh hệ liên thông'),
        (ThacSi, 'Tuyển sinh thạc sĩ'),
        (CaoHoc, 'Tuyển sinh cao học'),
        (DTTX, 'Tuyển sinh đào tạo từ xa'),
    ]

    type = models.IntegerField(default=ChinhQuy, choices=TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    introduction = models.TextField()
    khoa = models.ForeignKey(Khoa, on_delete=models.PROTECT)
    diem = models.ForeignKey(Diem, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'Tuyển sinh'
        verbose_name_plural = 'Tuyển sinh'

    def __str__(self):
        return f"{self.get_type_display()} - {self.khoa.name}"

class TinTuc(BaseModel):
    name = models.CharField(max_length=50)
    content = models.TextField()
    tuyenSinh = models.ForeignKey(TuyenSinh, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'Tin tức'
        verbose_name_plural = 'Tin tức'

    def __str__(self):
        return self.name

class Interation(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tintuc = models.ForeignKey(TinTuc, on_delete=models.CASCADE)

    class Meta:
        abstract = True

class BinhLuan(Interation):
    content = RichTextField()

    class Meta:
        verbose_name = 'Bình luận'
        verbose_name_plural = 'Bình luận'

    def __str__(self):
        return self.content

class Like(Interation):
    class Meta:
        unique_together = ('tintuc', 'user')


























































































































































