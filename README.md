# 🎉 تالار باران | Wedding Hall Management System

یک پروژه‌ی کامل و مدرن برای مدیریت تالار عروسی با قابلیت نمایش اطلاعات تالار، منو، سلف سرویس، رزرو آنلاین و احراز هویت با OTP است. این پروژه هم برای بک‌اند و هم برای اتصال به یک فرانت‌اند مدرن طراحی شده تا تجربه‌ای حرفه‌ای برای مشتریان و مدیران فراهم کند.

![Django](https://img.shields.io/badge/Django-6.0.3-green)
![Python](https://img.shields.io/badge/Python-3.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)
![DRF](https://img.shields.io/badge/DRF-3.17.1-red)

---

## ✨ overview

این پروژه یک پلتفرم رزرو تالار عروسی است که شامل بخش‌های زیر می‌شود:

- نمایش اطلاعات تالار، آدرس، شماره تماس و تصاویر
- نمایش سالن‌ها و امکانات آن‌ها
- منوی غذایی و پکیج‌های ویژه
- رزرو آنلاین با بررسی در دسترس بودن تاریخ و شیفت
- احراز هویت با کد OTP از طریق پیامک
- پنل ادمین برای مدیریت محتوا و رزروها

این پروژه به‌صورت API-first طراحی شده و برای اتصال به یک فرانت‌اند مثل React، Next.js یا Vite مناسب است.

---

## 🧩 امکانات اصلی

### بک‌اند
- API RESTful با Django REST Framework
- مدیریت رزروها و وضعیت آن‌ها
- بررسی availability برای تاریخ و شیفت
- احراز هویت با JWT
- اتصال به سرویس پیامک Kavenegar
- پشتیبانی از فایل‌های تصویری برای تالار و منو
- مستندسازی API با drf-spectacular

### فرانت‌اند
- طراحی مناسب برای نمایش اطلاعات تالار
- فرم رزرو و اعتبارسنجی ورودی
- دریافت OTP و تایید شماره موبایل
- نمایش منو و پکیج‌های ویژه
- تعامل با APIهای این پروژه

---

## 🛠️ تکنولوژی‌های استفاده‌شده

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- Simple JWT
- drf-spectacular
- django-cors-headers
- Pillow
- psycopg2-binary

### Frontend (پیشنهادی برای اتصال)
- React / Next.js / Vite
- Axios
- Tailwind CSS

> در این مخزن، بک‌اند اصلی موجود است و فرانت‌اند می‌تواند به‌عنوان یک کلاینت جداگانه به این API متصل شود.

---

## 📁 ساختار پروژه

```text
back/
├── config/                 # تنظیمات اصلی پروژه Django
├── menu/                   # مدل‌ها و API‌های مرتبط با تالار، سالن‌ها و منو
├── reservations/           # مدل‌ها و API‌های رزرو، OTP و چک‌بودن ظرفیت
├── media/                  # تصاویر آپلود‌شده
├── manage.py               # فایل اجرایی Django
└── README.md               # مستندات پروژه
```

---

## 🚀 راه‌اندازی پروژه

### 1) ایجاد محیط مجازی

در ویندوز:

```bash
python -m venv myenv
myenv\Scripts\activate
```

### 2) نصب وابستگی‌ها

```bash
pip install django djangorestframework djangorestframework-simplejwt drf-spectacular django-cors-headers psycopg2-binary pillow
```

### 3) تنظیم پایگاه داده

پروژه برای PostgreSQL پیکربندی شده است. برای اجرا، باید یک دیتابیس با نام زیر ایجاد کنید:

```sql
CREATE DATABASE wedding_hall_db;
```

اطلاعات اتصال در فایل تنظیمات پروژه موجود است و در صورت نیاز می‌توانید آن را به متغیرهای محیطی تبدیل کنید.

### 4) اعمال مایگریشن‌ها

```bash
python manage.py migrate
```

### 5) ایجاد مدیر

```bash
python manage.py createsuperuser
```

### 6) اجرای سرور

```bash
python manage.py runserver
```

سرور معمولاً در آدرس زیر در دسترس خواهد بود:

```text
http://127.0.0.1:8000
```

---

## 🌐 API Endpoints

### احراز هویت
- POST `/api/auth/send-otp/`
- POST `/api/auth/verify-otp/`

### رزرو
- GET `/api/reservations/check/?date=YYYY-MM-DD&shift=noon`
- POST `/api/reservations/`

### اطلاعات تالار و منو
- GET `/api/content/main-hall/`
- GET `/api/content/halls/`
- GET `/api/menu/items/`
- GET `/api/menu/special/`
- GET `/api/menu/self-service/`

---

## 🧪 نمونه استفاده از API

### ارسال OTP

```bash
curl -X POST http://127.0.0.1:8000/api/auth/send-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"09123456789"}'
```

### تایید OTP

```bash
curl -X POST http://127.0.0.1:8000/api/auth/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"09123456789","code":"123456"}'
```

### بررسی موجود بودن رزرو

```bash
curl "http://127.0.0.1:8000/api/reservations/check/?date=2026-08-20&shift=noon"
```

---


## 📬 تماس

اگر این پروژه را توسعه می‌دهید یا نیاز به راهنمایی بیشتر دارید، می‌توانید از طریق مخزن GitHub با ما در ارتباط باشید.
# barantalar
