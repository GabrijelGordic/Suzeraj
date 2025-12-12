from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from django.db.models import Avg


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')

    # Calculated Field
    seller_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user_id', 'username', 'email', 'avatar', 'location',
                  'phone_number', 'is_verified', 'seller_rating', 'review_count']

    def get_seller_rating(self, obj):
        # Go to the User -> Find 'received_reviews' -> Calculate Average
        avg = obj.user.received_reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self, obj):
        return obj.user.received_reviews.count()
