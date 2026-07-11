from django.urls import path
from .views import (
    MainHallView,
    HallListView,
    MenuItemListView,
    SpecialMenuListView,
    SelfServiceListView,
)

urlpatterns = [
    # محتوای تالار و سالن‌ها
    path('content/main-hall/', MainHallView.as_view(), name='main-hall'),
    path('content/halls/', HallListView.as_view(), name='halls-list'),

    # منو
    path('menu/items/', MenuItemListView.as_view(), name='menu-items'),
    path('menu/special/', SpecialMenuListView.as_view(), name='menu-special'),
    path('menu/self-service/', SelfServiceListView.as_view(), name='menu-self-service'),
]
