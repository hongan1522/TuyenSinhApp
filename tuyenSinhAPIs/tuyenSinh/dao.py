from tuyenSinh.models import Khoa

def get_khoa(**kwargs):
    khoa = Khoa.objects.filter(active=True)

    q = kwargs.get('q')
    if q:
        khoa = khoa.filter(name__icontains=q)

    return khoa


