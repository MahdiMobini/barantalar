from django.contrib import admin
from .models import Reservation, OTPCode


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'phone_number', 'date', 'shift', 'status']
    
    # فیلترهای سمت راست صفحه
    list_filter = [ 'shift', 'status']
    
    # قابلیت سرچ
    search_fields = ['customer_name', 'phone_number']


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'code', 'is_used', 'created_at']