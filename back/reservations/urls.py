from django.urls import path
from . import views

urlpatterns = [
    path('auth/send-otp/', views.SendOTPView.as_view(), name='send-otp'),
    path('auth/verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('reservations/check/', views.CheckAvailabilityView.as_view(), name='check-availability'),
    path('reservations/', views.ReservationCreateView.as_view(), name='create-reservation'),
]