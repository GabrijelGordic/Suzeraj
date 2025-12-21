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
    
    # --- ADD THIS LINE ---
    # Fetches the phone number from the User's Profile
    seller_phone = serializers.ReadOnlyField(source='seller.profile.phone_number')
    # ---------------------

    # Calculated fields
    seller_rating = serializers.SerializerMethodField()
    views = serializers.ReadOnlyField() 
    is_liked = serializers.SerializerMethodField()

    images = ShoeImageSerializer(source='gallery', many=True, read_only=True)

    class Meta:
        model = Shoe
        fields = [
            'id',
            'seller',
            'seller_username',
            'seller_phone', # <--- ADD THIS to the list
            'seller_rating',
            'title',
            'brand',
            'price',
            'currency',
            'size',
            'condition',
            'description',
            'image',        
            'images',       
            'contact_info',
            'is_sold',
            'created_at',
            'views',
            'is_liked'
        ]
        read_only_fields = ['seller', 'views', 'is_liked']

    def get_seller_rating(self, obj):
        avg = obj.seller.received_reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, shoe=obj).exists()
        return False