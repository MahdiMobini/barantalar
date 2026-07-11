import random
from django.utils import timezone
from django.conf import settings
from .models import OTPCode
from kavenegar import *


def generate_otp():
    """یه کد ۶ رقمی تصادفی میسازه"""
    return str(random.randint(100000, 999999))


def send_otp(phone_number):
    """
    کد OTP میسازه، ذخیره میکنه، و SMS میکنه
    این تابع رو هر جا لازم بود صدا میزنیم
    """
    code = generate_otp()
    print(f"the OTP code: {code}")
    # کدهای قبلی این شماره رو پاک میکنیم
    # چون نمیخایم چندتا کد فعال باشه برای یه شماره
    OTPCode.objects.filter(phone_number=phone_number).delete()

    # کد جدید ذخیره میکنیم
    OTPCode.objects.create(
        phone_number=phone_number,
        code=code
    )
    # اینجا باید SMS بفرستی - فعلاً print میکنیم
    # بعداً جاش کد کاوه‌نگار میذاریم
    # c = phone_number
    # phone_number = "+98" + phone_number[1:]
    print(f" to {phone_number}")
    try:
        api = KavenegarAPI(settings.KAVENEGAR_API_KEY)
        params = {
            'token': code,   # شماره پیش‌فرض کاوه‌نگار
            'receptor': phone_number,
            'template': 'talar-verify'
        }
        api.verify_lookup(params)
        print(f"SMS sent to {phone_number}")  # برای debug توی terminal
        return True
        
    except APIException as e:
        print(f"Kavenegar API Error: {e}")
        return False
        
    except HTTPException as e:
        print(f"Kavenegar HTTP Error: {e}")
        return False



def verify_otp(phone_number, code):
    """
    کد وارد شده رو چک میکنه
    سه چیز چک میشه: وجود داشته باشه، منقضی نشده باشه، استفاده نشده باشه
    """
    try:
        otp = OTPCode.objects.get(
            phone_number=phone_number,
            code=code,
            is_used=False
        )
    except OTPCode.DoesNotExist:
        return False, "کد اشتباه است"

    # چک میکنیم منقضی نشده باشه
    expire_time = otp.created_at + timezone.timedelta(seconds=settings.OTP_EXPIRE_TIME)
    if timezone.now() > expire_time:
        otp.delete()
        return False, "کد منقضی شده است"

    # کد درسته! علامت میزنیم که استفاده شده
    otp.is_used = True
    otp.save()

    return True, "کد تأیید شد"