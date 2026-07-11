# menu/admin.py

from django.contrib import admin
from .models import (
    MainHall,
    Hall, HallImage,
    MenuItem,
    RiceOption,
    SpecialMenu,
    SelfService,
    MainHallImage
)


class MainHallImageInline(admin.TabularInline):
    model = MainHallImage
    extra = 3  # تعداد فیلدهای خالی برای آپلود همزمان

@admin.register(MainHall)
class MainHallAdmin(admin.ModelAdmin):
    inlines = [MainHallImageInline]
    list_display = ['address', 'phone', 'mobile']

class HallImageInline(admin.TabularInline):
    model = HallImage
    extra = 2


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    inlines = [HallImageInline]
    list_display = ['name', 'capacity']

class RiceOptionInline(admin.TabularInline):
    model = RiceOption
    extra = 3  # سه ردیف خالی پیش‌فرض: بدون برنج / پاکستانی / ایرانی


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    inlines = [RiceOptionInline]
    list_display = ['name', 'is_available', 'order']
    list_filter  = ['is_available']
    search_fields = ['name']

@admin.register(SpecialMenu)
class SpecialMenuAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'is_available']
    list_filter  = ['is_available']
    search_fields = ['name']


@admin.register(SelfService)
class SelfServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'is_available']
    list_filter  = ['is_available']