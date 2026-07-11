# menu/models.py

from django.db import models


class MainHall(models.Model):
    """اطلاعات کلی تالار"""
    address = models.TextField(blank=True)
    phone   = models.CharField(max_length=20, blank=True)
    mobile  = models.CharField(max_length=20, blank=True)
    latitude  = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self):
        return "تالار باران"

    class Meta:
        verbose_name = 'اطلاعات تالار'


class MainHallImage(models.Model):
    """عکس‌های تالار اصلی"""
    hall = models.ForeignKey(MainHall, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='mainhall/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'عکس تالار'
        verbose_name_plural = 'عکس‌های تالار'

    def __str__(self):
        return f"عکس {self.hall} - {self.order}"


class Hall(models.Model):
    """سالن‌ها — فعلاً دو تا داری"""
    TYPE_CHOICES = [
        ('man', 'اقایون'),
        ('women', 'خانوم ها'),
    ]
    name        = models.CharField(max_length=100 , choices=TYPE_CHOICES)   # مثلاً: سالن VIP / سالن اصلی
    capacity    = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'سالن'
        verbose_name_plural = 'سالن‌ها'


class HallImage(models.Model):
    """عکس‌های هر سالن"""
    hall    = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='images')
    image   = models.ImageField(upload_to='halls/')
    caption = models.CharField(max_length=200, blank=True)
    order   = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'عکس سالن'
        verbose_name_plural = 'عکس‌های سالن'


class MenuItem(models.Model):
    """
    یک غذای اصلی منو — مثل جوجه کباب، کوبیده، قورمه سبزی.
    این مدل دیگر قیمت مستقیم ندارد؛ قیمت‌ها در RiceOption تعریف می‌شوند
    چون هر غذا بسته به نوع برنج همراهش، قیمت متفاوت دارد.
    """
    name         = models.CharField(max_length=200)        # جوجه کباب / کوبیده / قورمه سبزی
    description  = models.CharField(max_length=300, blank=True)  # توضیح کوتاه زیر اسم غذا
    is_available = models.BooleanField(default=True)
    order        = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']
        verbose_name = 'آیتم منو'
        verbose_name_plural = 'منوی اصلی'


class RiceOption(models.Model):
    """
    یک گزینه‌ی قیمتی برای یک غذای خاص، بر اساس نوع برنج همراهش.
    مثال: جوجه کباب + بدون برنج = ۱۵۰,۰۰۰ / جوجه کباب + برنج ایرانی = ۲۵۰,۰۰۰
    """
    RICE_TYPE_CHOICES = [
        ('none', 'بدون برنج'),
        ('pakistani', 'با برنج پاکستانی'),
        ('iranian', 'با برنج ایرانی'),
    ]
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='rice_options')
    rice_type = models.CharField(max_length=15, choices=RICE_TYPE_CHOICES)
    price     = models.PositiveBigIntegerField()  # به تومان یا ریال — هرچی الان توی پروژه استفاده می‌کنی
    order     = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"{self.menu_item.name} — {self.get_rice_type_display()}"

    class Meta:
        ordering = ['order']
        unique_together = ['menu_item', 'rice_type']  # یک غذا نمی‌تواند دو ردیف "برنج ایرانی" داشته باشد
        verbose_name = 'گزینه‌ی برنج'
        verbose_name_plural = 'گزینه‌های برنج'


        
class SpecialMenu(models.Model):
    """منوی ویژه — پکیج آماده با قیمت کل"""
    name        = models.CharField(max_length=200)   # پکیج طلایی
    description = models.TextField(blank=True)       # شامل: برنج ایرانی + مرغ ۳۵۰گرم + ...
    price       = models.PositiveBigIntegerField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'منوی ویژه'
        verbose_name_plural = 'منوهای ویژه'


class SelfService(models.Model):
    """سلف سرویس میوه و دسر"""
    name        = models.CharField(max_length=200)   # میوه فصل / دسر
    price       = models.PositiveBigIntegerField()   # قیمت به ازای هر نفر
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'سلف سرویس'
        verbose_name_plural = 'سلف سرویس'