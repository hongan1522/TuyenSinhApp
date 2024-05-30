from django.contrib import admin
from django.core.exceptions import ValidationError

from tuyenSinh.models import Khoa, Diem, ThiSinh, TuyenSinh, TinTuc, BinhLuan, Banner, Diem_Khoa, TuVanVien, User, Admin
from django.utils.html import mark_safe, format_html
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from tuyenSinh.models import Khoa

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
                return mark_safe(f'<video width="450" height=300" controls><source src="{video_url}" type="video/mp4"></video>')
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

admin.site.register(Khoa, KhoaAdmin)
admin.site.register(Diem, DiemAdmin)
admin.site.register(Diem_Khoa, Diem_KhoaAdmin)
admin.site.register(ThiSinh, ThiSinhAdmin)
admin.site.register(TuVanVien, TVVAdmin)
