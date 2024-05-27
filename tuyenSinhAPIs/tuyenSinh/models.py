import datetime

from django.db import models
from django.core.validators import URLValidator, MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField

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
    # video = models.FileField(upload_to='khoa/video/%Y/%m/', null=True, blank=True)
    video = CloudinaryField(resource_type='video')

    def __str__(self):
        return self.name

    def get_latest_scores(self, years=5):
        current_year = datetime.date.today().year
        return Diem_Khoa.objects.filter(khoa=self, year__gte=current_year - years + 1).order_by('-year')

class Diem(models.Model):
    value = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(30)], unique=True)

    def __str__(self):
        return f"{self.value}"

class Diem_Khoa(BaseModel):
    khoa = models.ForeignKey(Khoa, on_delete=models.PROTECT)
    diem = models.ForeignKey(Diem, on_delete=models.PROTECT)
    year = models.IntegerField(validators=[MinValueValidator(2000), MaxValueValidator(datetime.date.today().year)], default=datetime.date.today().year)

    class Meta:
        unique_together = ('khoa', 'year')

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
    avatar = CloudinaryField()

    def __str__(self):
        return self.username

class Admin(models.Model):
    userID = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return self.user.username

class TuVanVien(models.Model):
    Nam = 0
    Nu = 1

    GENDER_CHOICES = [
        (Nam, 'Nam'),
        (Nu, 'Nữ'),
    ]

    name = models.CharField(max_length=50)
    userID = models.ForeignKey(User, on_delete=models.PROTECT)
    khoa = models.ForeignKey(Khoa, on_delete=models.PROTECT)
    birthday = models.DateField()
    gender = models.IntegerField(choices=GENDER_CHOICES, default=Nam)
    email = models.EmailField()

    def __str__(self):
        return self.name

class ThiSinh(models.Model):
    Nam = 0
    Nu = 1

    GENDER_CHOICES = [
        (Nam, 'Nam'),
        (Nu, 'Nữ'),
    ]

    name = models.CharField(max_length=50)
    userID = models.ForeignKey(User, on_delete=models.PROTECT)
    birthday = models.DateField()
    gender = models.IntegerField(choices=GENDER_CHOICES, default=Nam)
    email = models.EmailField()

    def __str__(self):
        return self.name

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

    def __str__(self):
        return f"{self.get_type_display()} - {self.khoa.name}"

class TinTuc(BaseModel):
    name = models.CharField(max_length=50)
    content = models.TextField()
    tuyenSinh = models.ForeignKey(TuyenSinh, on_delete=models.PROTECT)

    def __str__(self):
        return self.name

class BinhLuan(BaseModel):
    content = models.TextField();
    userID = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return self.content

























































































































































