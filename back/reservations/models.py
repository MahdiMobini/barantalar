from django.db import models


class Reservation(models.Model):

    # --- انتخاب‌های ثابت (Choices) ---
    # وقتی مقادیر یه فیلد محدود و مشخصه، از choices استفاده میکنیم
    # فرمت: (مقدار توی دیتابیس, نمایش برای انسان)

    guests = models.PositiveIntegerField(
        default=100,
        verbose_name='تعداد مهمانان'
    )
    SHIFT_CHOICES = [
        ('noon', 'ظهر'),
        ('night', 'شب'),
    ]

    STATUS_CHOICES = [
        ('pending', 'در انتظار تأیید'),
        ('confirmed', 'تأیید شده'),
        ('cancelled', 'لغو شده'),
    ]

    # --- فیلدهای سالن و زمان ---

    date = models.DateField(
        verbose_name='تاریخ مراسم'
    )
    shift = models.CharField(
        max_length=10,
        choices=SHIFT_CHOICES,
        verbose_name='شیفت'
    )

    # --- مشخصات مشتری ---
    customer_name = models.CharField(
        max_length=100,
        verbose_name='نام مشتری'
    )
    phone_number = models.CharField(
        max_length=11,
        verbose_name='شماره موبایل'
    )

    # --- وضعیت و زمان ثبت ---
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='وضعیت'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,  # فقط موقع ساخت ثبت میشه، دیگه تغییر نمیکنه
        verbose_name='زمان ثبت'
    )

    notes = models.TextField(
        blank=True,
        default='',
        verbose_name='توضیحات'
    )

    class Meta:
        # این constraint مهمه! میگه هر ترکیب (سالن + تاریخ + شیفت) فقط یه بار میتونه باشه
        # یعنی دیتابیس خودش جلوی رزرو دوتایی رو میگیره
        unique_together = [ 'date', 'shift']
        verbose_name = 'رزرو'
        verbose_name_plural = 'رزروها'

    def __str__(self):
        return f"{self.date} - {self.get_shift_display()}"


class OTPCode(models.Model):
    """
    این مدل کدهای یکبار مصرف رو نگه میداره.
    وقتی کسی میخاد رزرو کنه، کد SMS میشه و اینجا ذخیره میشه.
    """
    phone_number = models.CharField(max_length=11)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    # وقتی کد منقضی بشه یا استفاده بشه، این True میشه
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.phone_number} - {self.code}"