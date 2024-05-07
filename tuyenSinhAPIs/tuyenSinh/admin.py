from django.contrib import admin
from tuyenSinh.models import Khoa, Diem, ThiSinh, TuyenSinh, TinTuc, BinhLuan, Banner, Diem_Khoa
from django.utils.html import mark_safe
class KhoaAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'website']
    search_fields = ['name']
    list_filter = ['id', 'name', 'created_date']
    readonly_fields = ['display_video']

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

class DiemAdmin(admin.ModelAdmin):
    list_display = ['id', 'value']
    search_fields = ['value']


admin.site.register(Khoa, KhoaAdmin)
admin.site.register(Diem, DiemAdmin)
admin.site.register(Diem_Khoa)
admin.site.register(ThiSinh)
