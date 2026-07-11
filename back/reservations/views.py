from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken , AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .utils import send_otp, verify_otp
from .models import Reservation


class SendOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'error': 'شماره موبایل الزامی است'}, status=400)
        if len(phone_number) != 11 or not phone_number.startswith('09'):
            return Response({'error': 'شماره موبایل معتبر نیست'}, status=400)
        message = "پیامک ارسال شد" if send_otp(phone_number) else "مشکلی در ارسال پیامک پیش امده"
        print(f"the message is {message}")
        return Response({'message': message})


class VerifyOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        code = request.data.get('code')
        if not phone_number or not code:
            return Response({'error': 'شماره و کد الزامی است'}, status=400)
        is_valid, message = verify_otp(phone_number, code)
        if not is_valid:
            return Response({'error': message}, status=400)
        token = RefreshToken()
        token['phone_number'] = phone_number
        access = token.access_token
        # access['phone_number'] = phone_number
        return Response({
            'message': message,
            'access': str(access),
            'refresh': str(token),
        })


class CheckAvailabilityView(APIView):
    """
    GET /api/reservations/check/?date=2024-08-20&shift=noon
    hall حذف شد چون تالار یکیه
    """
    def get(self, request):
        date = request.query_params.get('date')
        shift = request.query_params.get('shift')

        if not all([date, shift]):
            return Response({'error': 'date و shift الزامی هستند'}, status=400)

        exists = Reservation.objects.filter(
            date=date,
            shift=shift,
        ).exclude(status='cancelled').exists()

        return Response({'available': not exists})


class ReservationCreateView(APIView):
    """
    POST /api/reservations/
    """
    def post(self, request):
        # چک توکن
        auth_header = request.headers.get('Authorization', '')
        print("AUTH HEADER:", auth_header[:50])  # اول ۵۰ کاراکتر

        if not auth_header.startswith('Bearer '):
            return Response({'error': 'احراز هویت الزامی است'}, status=401)

        token_str = auth_header.split(' ')[1]
        try:
            token = AccessToken(token_str)
            phone_number_from_token = token.get('phone_number')  # این رو بگیر
            print("Phone number in token:", phone_number_from_token)  # دیباگ
            token.get('phone_number')  # فقط چک میکنیم توکن معتبره
        except (TokenError, InvalidToken):
            return Response({'error': 'توکن نامعتبر است'}, status=401)

        date = request.data.get('date')
        shift = request.data.get('shift')
        customer_name = request.data.get('customer_name')
        phone_number = request.data.get('phone_number')
        guests = request.data.get('guests', 100)
        notes = request.data.get('notes', '')

        if not all([date, shift, customer_name, phone_number]):
            return Response({'error': 'تمام فیلدهای الزامی را پر کنید'}, status=400)

        if shift not in ['noon', 'night']:
            return Response({'error': 'شیفت نامعتبر است'}, status=400)

        # یه بار دیگه خالی بودن چک میشه (جلوگیری از race condition)
        exists = Reservation.objects.filter(
            date=date, shift=shift
        ).exclude(status='cancelled').exists()

        if exists:
            return Response({'error': 'این تاریخ و شیفت قبلاً رزرو شده است'}, status=400)

        reservation = Reservation.objects.create(
            date=date,
            shift=shift,
            customer_name=customer_name,
            phone_number=phone_number,
            guests=guests,
            notes=notes,
        )

        return Response({
            'id': reservation.id,
            'message': 'رزرو با موفقیت ثبت شد',
        }, status=201)