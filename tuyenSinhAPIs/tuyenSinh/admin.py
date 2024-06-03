from django.contrib import admin
from django.contrib.admin import AdminSite
from django.core.exceptions import ValidationError
from django.template.response import TemplateResponse
from django.urls import path

from tuyenSinh.models import Khoa, Diem, ThiSinh, TuyenSinh, TinTuc, BinhLuan, Banner, Diem_Khoa, TuVanVien, User, Admin
from django.utils.html import mark_safe, format_html
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from tuyenSinh.models import Khoa


# Custom AdminSite
class TuyenSinhAdminSite(admin.AdminSite):
    site_header = "TuyenSinh Administration"
    site_title = "TuyenSinh Admin Portal"
    index_title = "Welcome to TuyenSinh Administration"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('statistics/', self.admin_view(self.statistics_view), name='statistics'),
        ]
        return custom_urls + urls

    def statistics_view(self, request):
        # Example logic to gather statistics
        total_khoa = Khoa.objects.count()
        total_diem = Diem.objects.count()
        total_thisinh = ThiSinh.objects.count()
        total_tuvanvien = TuVanVien.objects.count()
        total_banner = Banner.objects.count()
        total_tintuc = TinTuc.objects.count()
        total_tuyensinh = TuyenSinh.objects.count()

        context = dict(
            self.each_context(request),
            title="Statistics",
            total_khoa=total_khoa,
            total_diem=total_diem,
            total_thisinh=total_thisinh,
            total_tuvanvien=total_tuvanvien,
            total_banner=total_banner,
            total_tintuc=total_tintuc,
            total_tuyensinh=total_tuyensinh,
        )
        return TemplateResponse(request, 'admin/statistics.html', context)

admin_site = TuyenSinhAdminSite(name='tuyensinh_admin')

class KhoaForm(forms.ModelForm):
    program_description = forms.CharField(widget=CKEditorUploadingWidget)
    introduction = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Khoa
        fields = '__all__'


class KhoaAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'display_website']
    search_fields = ['name']
    list_filter = ['id', 'name', 'created_date']
    readonly_fields = ['display_video', 'display_website']
    ordering = ['id']
    form = KhoaForm

    def display_video(self, obj):
        if obj.video:
            try:
                video_url = obj.video.url
                return mark_safe(f'<video width="450" height="300" controls><source src="{video_url}" type="video/mp4"></video>')
            except Exception as e:
                return f'Error: {e}'
        else:
            return 'Video not available'

    display_video.allow_tags = True
    display_video.short_description = 'Video'

    def display_website(self, obj):
        if obj.website:
            website_url = obj.website
            return format_html(
                '<a href="{}" target="_blank">{}</a>', website_url, website_url)
        else:
            return 'Website not available'

    display_website.short_description = 'Website'

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


class DiemAdmin(admin.ModelAdmin):
    list_display = ['id', 'value']
    search_fields = ['value']
    ordering = ['id']

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


class Diem_KhoaAdmin(admin.ModelAdmin):
    list_display = ['id', 'khoa', 'diem', 'year']
    search_fields = ['khoa']
    ordering = ['id']

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


class ThiSinhForm(forms.ModelForm):
    class Meta:
        model = ThiSinh
        fields = '__all__'

    def clean_user(self):
        user = self.cleaned_data.get('user')
        if user:
            if user.role != User.THI_SINH:
                raise ValidationError("User is not assigned the ThiSinh role.")
            if Admin.objects.filter(user=user).exists() or TuVanVien.objects.filter(user=user).exists():
                raise ValidationError("User is already assigned to another role.")
        return user

class AdminAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'username', 'email']
    ordering = ['user']
    search_fields = ['id']

    def username(self, obj):
        return obj.user.username

    def email(self, obj):
        return obj.user.email

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }

class ThiSinhAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'formatted_birthday', 'email']
    search_fields = ['name']
    ordering = ['id']
    form = ThiSinhForm

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }

class TuVanVienForm(forms.ModelForm):
    class Meta:
        model = TuVanVien
        fields = '__all__'

    def clean_user(self):
        user = self.cleaned_data.get('user')
        if user:
            if user.role != User.TU_VAN_VIEN:
                raise ValidationError("User is not assigned the TuVanVien role.")
            if Admin.objects.filter(user=user).exists() or ThiSinh.objects.filter(user=user).exists():
                raise ValidationError("User is already assigned to another role.")
        return user


class TVVAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'khoa', 'formatted_birthday', 'email']
    search_fields = ['name', 'khoa']
    ordering = ['id']
    form = TuVanVienForm

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }

class BinhLuanForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Khoa
        fields = '__all__'

class BinhLuanAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'tintuc']
    search_fields = ['tintuc']
    ordering = ['id']
    form = BinhLuanForm

class BannerAdmin(admin.ModelAdmin):
    list_display = ['id', 'image_preview']
    ordering = ['id']
    exclude = ['active']

    def image_preview(self, banner):
        if banner.image:
            return mark_safe(
                '<img src="{url}" width="120" />' \
                    .format(url=banner.image.url)
            )
        return 'No Image'

    image_preview.short_description = 'Image Preview'

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }

class TinTucForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = TinTuc
        fields = '__all__'

class TinTucAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_date', 'active', 'tuyenSinh')
    search_fields = ('name', 'content')
    list_filter = ('created_date', 'active')
    ordering = ('-created_date',)
    form = TinTucForm

    def tuyenSinh(self, obj):
        return obj.tuyenSinh
    tuyenSinh.short_description = 'TuyenSinh'

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }

class TuyenSinhForm(forms.ModelForm):
    introduction = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = TuyenSinh
        fields = '__all__'

class TuyenSinhAdmin(admin.ModelAdmin):
    list_display = ('type', 'khoa', 'formatted_start_date', 'formatted_end_date')  # Include the formatted date methods
    search_fields = ('khoa__name', 'introduction')
    list_filter = ('type', 'start_date', 'end_date')
    ordering = ('-start_date',)
    form = TuyenSinhForm

    def type(self, obj):
        return obj.get_type_display()
    type.short_description = 'Type'

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }

    def formatted_start_date(self, obj):
        return obj.start_date.strftime('%d/%m/%Y')

    formatted_start_date.short_description = 'Start Date'

    def formatted_end_date(self, obj):
        return obj.end_date.strftime('%d/%m/%Y')

    formatted_end_date.short_description = 'End Date'


admin_site.register(Khoa, KhoaAdmin)
admin_site.register(Diem, DiemAdmin)
admin_site.register(Diem_Khoa, Diem_KhoaAdmin)
admin_site.register(ThiSinh, ThiSinhAdmin)
admin_site.register(TuVanVien, TVVAdmin)
admin_site.register(TinTuc, TinTucAdmin)
admin_site.register(TuyenSinh, TuyenSinhAdmin)
admin_site.register(Banner, BannerAdmin)
admin_site.register(BinhLuan, BinhLuanAdmin)
admin_site.register(Admin, AdminAdmin)
