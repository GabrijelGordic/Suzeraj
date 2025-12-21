from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
# 1. Added 'action' import
from rest_framework.decorators import api_view, action
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from django.http import HttpResponse
from django.utils.text import slugify
# 2. Added 'Wishlist' import
from .models import Shoe, ShoeImage, Wishlist
from .serializers import ShoeSerializer
from .permissions import IsSellerOrReadOnly

# --- Custom Filter Class ---
class ShoeFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    brand = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Shoe
        fields = ['brand', 'size', 'condition', 'seller__username', 'min_price', 'max_price']


class ShoeViewSet(viewsets.ModelViewSet):
    queryset = Shoe.objects.all().order_by('-created_at')
    serializer_class = ShoeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

    # Filters & Search
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ShoeFilter
    search_fields = ['title', 'description', 'brand']

    # 3. Added 'views' to ordering options
    ordering_fields = ['price', 'created_at', 'views']

    # --- VIEW COUNT LOGIC ---
    # --- VIEW COUNT LOGIC (FIXED) ---
    def retrieve(self, request, *args, **kwargs):
        """
        Increments view count ONLY if the viewer is not the seller.
        """
        instance = self.get_object()
        
        # FIX: Check if the current user is NOT the seller
        if instance.seller != request.user:
            instance.views += 1
            instance.save()
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # --- WISHLIST: TOGGLE LIKE (FIXED) ---
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_wishlist(self, request, pk=None):
        shoe = self.get_object()
        user = request.user

        # 1. PREVENT SELLER FROM LIKING THEIR OWN SHOE
        if shoe.seller == user:
            return Response(
                {'error': 'You cannot add your own item to the wishlist.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Normal Logic
        wishlist_item, created = Wishlist.objects.get_or_create(user=user, shoe=shoe)

        if not created:
            wishlist_item.delete() # Unliked
            return Response({'status': 'removed', 'is_liked': False}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'added', 'is_liked': True}, status=status.HTTP_201_CREATED)

    # --- WISHLIST: GET FAVORITES ---
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def favorites(self, request):
        """
        GET /api/shoes/favorites/
        Returns shoes liked by the current user.
        """
        user = request.user
        favorites = Shoe.objects.filter(wishlisted_by__user=user).order_by('-created_at')
        
        page = self.paginate_queryset(favorites)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)

    # --- CREATE LOGIC ---
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shoe = serializer.save(seller=self.request.user)

        # FIXED: Changed 'gallery_images' to 'uploaded_images' to match React 'Sell.js'
        images = request.FILES.getlist('uploaded_images')
        for img in images:
            ShoeImage.objects.create(shoe=shoe, image=img)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


# --- SEO Sitemap ---
@api_view(['GET'])
def sitemap_view(request):
    """Generate XML sitemap for all shoe listings"""
    shoes = Shoe.objects.all().order_by('-created_at')
    base_url = f"{request.scheme}://{request.get_host()}"

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        f'  <url><loc>{base_url}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>',
    ]

    for shoe in shoes:
        xml_lines.append(
            f'  <url>'
            f'<loc>{base_url}/shoes/{shoe.id}</loc>'
            f'<lastmod>{shoe.created_at.strftime("%Y-%m-%d")}</lastmod>'
            f'<priority>0.8</priority>'
            f'<changefreq>weekly</changefreq>'
            f'</url>'
        )

    xml_lines.append('</urlset>')
    return HttpResponse('\n'.join(xml_lines), content_type='application/xml')