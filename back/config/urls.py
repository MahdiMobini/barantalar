from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('talar-secret-manager-xyz99/', admin.site.urls),
    path('api/', include('reservations.urls')),
    path('api/', include('menu.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)