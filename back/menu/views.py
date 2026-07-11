from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    MainHall,
    Hall,
    MenuItem, SpecialMenu, SelfService,
)
from .serializers import (
    MainHallSerializer,
    HallSerializer,
    MenuItemSerializer, SpecialMenuSerializer, SelfServiceSerializer,
)


# ─────────────────────────────────────────────
# Hall / Salon content
# ─────────────────────────────────────────────

class MainHallView(APIView):
    """
    GET /api/content/main-hall/
    فقط یک رکورد MainHall داریم — همیشه اولین رکورد رو برمیگردونیم.
    اگه هنوز توی ادمین ساخته نشده، یه آبجکت خالی برمیگردونیم
    تا فرانت با خطا مواجه نشه (به‌جای 404).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        instance = MainHall.objects.prefetch_related('images').first()
        if instance is None:
            return Response({
                'address': '',
                'phone': '',
                'mobile': '',
                'images': [],
            })
        serializer = MainHallSerializer(instance, context={'request': request})
        return Response(serializer.data)


class HallListView(ListAPIView):
    """
    GET /api/content/halls/
    لیست همه‌ی سالن‌ها (آقایون / خانم‌ها / هر تعدادی که توی ادمین ساخته بشه)
    """
    serializer_class = HallSerializer
    permission_classes = [AllowAny]
    queryset = Hall.objects.prefetch_related('images').all().order_by('id')


# ─────────────────────────────────────────────
# Menu content
# ─────────────────────────────────────────────
class MenuItemListView(ListAPIView):
    """
    GET /api/menu/items/
    منوی اصلی — هر غذا با گزینه‌های قیمت بر اساس نوع برنج
    """
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]
    queryset = MenuItem.objects.prefetch_related('rice_options').filter(is_available=True).order_by('order')


class SpecialMenuListView(ListAPIView):
    """
    GET /api/menu/special/
    منوهای ویژه (پکیج‌ها)
    """
    serializer_class = SpecialMenuSerializer
    permission_classes = [AllowAny]
    queryset = SpecialMenu.objects.all().order_by('name')


class SelfServiceListView(ListAPIView):
    """
    GET /api/menu/self-service/
    سلف سرویس (میوه و دسر)
    """
    serializer_class = SelfServiceSerializer
    permission_classes = [AllowAny]
    queryset = SelfService.objects.all().order_by('name')