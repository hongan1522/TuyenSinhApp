from rest_framework import pagination

class QuestionPaginator(pagination.PageNumberPagination):
    page_size = 25

class ItemPaginator(pagination.PageNumberPagination):
    page_size = 4

class KhoaPaginator(pagination.PageNumberPagination):
    page_size = 5

class BinhLuanPaginator(pagination.PageNumberPagination):
    page_size = 5

class TintucPaginator(pagination.PageNumberPagination):
    page_size = 10