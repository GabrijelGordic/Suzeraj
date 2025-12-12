from rest_framework import viewsets, permissions
from .models import Shoe
from .serializers import ShoeSerializer
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend


class ShoeViewSet(viewsets.ModelViewSet):
    queryset = Shoe.objects.all().order_by('-created_at')
    serializer_class = ShoeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Enable Searching and Filtering
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    # Exact match filtering (e.g. ?brand=Nike&size=10)
    filterset_fields = ['brand', 'size', 'condition', 'seller__username']

    # Text search (e.g. ?search=Jordan)
    search_fields = ['title', 'description', 'brand']

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
