from rest_framework import serializers
from .models import Profile
from django.db.models import Avg
from reviews.models import Review
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer

class SimpleReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.ReadOnlyField(source='reviewer.username')

    class Meta:
        model = Review
        fields = ['reviewer_username', 'rating', 'comment', 'created_at']

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')
    
    # Calculated fields
    seller_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    reviews_list = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'user_id', 'username', 'email', 'avatar', 'location', 
            'phone_number', 'is_verified', 'seller_rating',
            'review_count', 'reviews_list'
        ]

    def get_seller_rating(self, obj):
        if not hasattr(obj.user, 'received_reviews'):
            return 0
        avg = obj.user.received_reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self, obj):
        if not hasattr(obj.user, 'received_reviews'):
            return 0
        return obj.user.received_reviews.count()

    def get_reviews_list(self, obj):
        if not hasattr(obj.user, 'received_reviews'):
            return []
        try:
            reviews = obj.user.received_reviews.all().order_by('-created_at')[:10]
            return SimpleReviewSerializer(reviews, many=True).data
        except:
            return []

# --- CUSTOM USER SERIALIZERS ---

class UserCreateSerializer(BaseUserCreateSerializer):
    # write_only=True ensures these fields don't cause issues in the response
    location = serializers.CharField(required=False, allow_blank=True, write_only=True)
    phone_number = serializers.CharField(required=True, write_only=True)

    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name', 'location', 'phone_number']

    def validate(self, attrs):
        # 1. REMOVE extra fields from 'attrs' BEFORE calling super()
        # If we leave them in, Djoser tries to put them into the User model and crashes.
        location = attrs.pop('location', '')
        phone_number = attrs.pop('phone_number', '')

        # 2. CHECK UNIQUE PHONE NUMBER MANUALLY
        if phone_number:
            if Profile.objects.filter(phone_number=phone_number).exists():
                raise serializers.ValidationError({"phone_number": "This phone number is already in use."})

        # 3. NOW it is safe to call Djoser's validation (attrs only contains User fields now)
        attrs = super().validate(attrs)

        # 4. Add them back so the create() method can find them later
        if location:
            attrs['location'] = location
        if phone_number:
            attrs['phone_number'] = phone_number
            
        return attrs

    def create(self, validated_data):
        # Extract Profile fields
        location = validated_data.pop('location', '')
        phone_number = validated_data.pop('phone_number', '')

        # Create User
        user = super().create(validated_data)

        # Save to Profile
        profile, created = Profile.objects.get_or_create(user=user)
        
        if location:
            profile.location = location
        if phone_number:
            profile.phone_number = phone_number
            
        profile.save()

        return user

class UserSerializer(BaseUserSerializer):
    # Map these fields from the Profile model
    location = serializers.CharField(source='profile.location', required=False, allow_blank=True)
    bio = serializers.CharField(source='profile.bio', required=False, allow_blank=True)
    phone_number = serializers.CharField(source='profile.phone_number', required=False, allow_blank=True)
    avatar = serializers.ImageField(source='profile.avatar', required=False)

    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'location', 'bio', 'phone_number', 'avatar']
        read_only_fields = ['email', 'username'] 

    def update(self, instance, validated_data):
        # 1. Extract Profile data (DRF groups source='profile.x' into a 'profile' dictionary)
        profile_data = validated_data.pop('profile', {})

        # 2. Update Standard User Fields (First Name, Last Name)
        instance = super().update(instance, validated_data)

        # 3. Update Profile Fields Manually
        profile = instance.profile
        
        if 'location' in profile_data:
            profile.location = profile_data['location']
        if 'bio' in profile_data:
            profile.bio = profile_data['bio']
        if 'phone_number' in profile_data:
            profile.phone_number = profile_data['phone_number']
        if 'avatar' in profile_data:
            profile.avatar = profile_data['avatar']
            
        profile.save()
        return instance