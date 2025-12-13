from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Djoser Auth URLs
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('api/', include('market.urls')),  # Include market app URLs
    path('api-auth/', include('rest_framework.urls')),  # DRF login/logout
    path('api/', include('reviews.urls')),  # Include reviews app URLs
    path('api/', include('users.urls')),  # Include users app URLs
]

# This allows us to see images during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
