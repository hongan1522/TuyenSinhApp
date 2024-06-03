from rest_framework import pagination

class ItemPaginator(pagination.PageNumberPagination):
    page_size = 4

class BinhLuanPaginator(pagination.PageNumberPagination):
    page_size = 5