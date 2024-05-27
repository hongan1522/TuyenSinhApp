from django.contrib import admin
from tuyenSinh.models import Khoa, Diem, ThiSinh, TuyenSinh, TinTuc, BinhLuan, Banner, Diem_Khoa
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

# class DiemKhoaAdmin(admin.ModelAdmin):
#     list_display = ['id', 'khoa', 'diem', 'year']
#     search_fields = ['khoa', 'year']
#     ordering = ['id']
#     list_filter = ['khoa', 'year']
#
#     class Media:
#         css = {
#             'all': ['/static/css/style.css']
#         }


admin.site.register(Khoa, KhoaAdmin)
admin.site.register(Diem, DiemAdmin)
admin.site.register(Diem_Khoa)
admin.site.register(ThiSinh)
