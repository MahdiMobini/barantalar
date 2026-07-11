from rest_framework import serializers
from .models import (
    MainHall, MainHallImage,
    Hall, HallImage,
    MenuItem, RiceOption, SpecialMenu, SelfService,
)


# ─────────────────────────────────────────────
# Hall / Salon content
# ─────────────────────────────────────────────

class MainHallImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = MainHallImage
        fields = ['id', 'image', 'caption', 'order']


class MainHallSerializer(serializers.ModelSerializer):
    images = MainHallImageSerializer(many=True, read_only=True)

    class Meta:
        model = MainHall
        fields = ['address', 'phone', 'mobile', 'latitude', 'longitude', 'images']


class HallImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = HallImage
        fields = ['id', 'image', 'caption', 'order']


class HallSerializer(serializers.ModelSerializer):
    images = HallImageSerializer(many=True, read_only=True)

    class Meta:
        model = Hall
        fields = ['id', 'name', 'capacity', 'description', 'images']


# ─────────────────────────────────────────────
# Menu content
# ─────────────────────────────────────────────

class RiceOptionSerializer(serializers.ModelSerializer):
    rice_type_display = serializers.CharField(source='get_rice_type_display', read_only=True)

    class Meta:
        model = RiceOption
        fields = ['id', 'rice_type', 'rice_type_display', 'price', 'order']


class MenuItemSerializer(serializers.ModelSerializer):
    rice_options = RiceOptionSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'is_available', 'rice_options']

        
class SpecialMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialMenu
        fields = ['id', 'name', 'description', 'price', 'is_available']


class SelfServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelfService
        fields = ['id', 'name', 'price', 'is_available']