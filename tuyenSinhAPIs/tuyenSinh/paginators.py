from rest_framework import pagination

class ItemPaginator(pagination.PageNumberPagination):
    page_size = 10

class KhoaPaginator(pagination.PageNumberPagination):
    page_size = 5

class BinhLuanPaginator(pagination.PageNumberPagination):
    page_size = 5