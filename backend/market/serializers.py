from rest_framework import serializers
from .models import Shoe, ShoeImage, Wishlist
from django.db.models import Avg

# 1. Serializer for the Gallery Images
class ShoeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoeImage
        fields = ['id', 'image']

# 2. Main Shoe Serializer
class ShoeSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')
    
    # Calculated fields
    seller_rating = serializers.SerializerMethodField()
    views = serializers.ReadOnlyField() 
    is_liked = serializers.SerializerMethodField()

    # RENAME: Frontend expects 'images', but model might use 'gallery'. 
    # We map it here to ensure frontend compatibility.
    images = ShoeImageSerializer(source='gallery', many=True, read_only=True)

    class Meta:
        model = Shoe
        fields = [
            'id',
            'seller',
            'seller_username',
            'seller_rating',
            'title',
            'brand',
            'price',
            'currency',
            'size',
            'condition',
            'description',
            'image',        # Main cover image
            'images',       # Gallery images (was 'gallery')
            'contact_info',
            'is_sold',
            'created_at',
            'views',        # NEW
            'is_liked'      # NEW
        ]
        read_only_fields = ['seller', 'views', 'is_liked']

    def get_seller_rating(self, obj):
        avg = obj.seller.received_reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_is_liked(self, obj):
        # Checks if the logged-in user has this shoe in their wishlist
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, shoe=obj).exists()
        return False