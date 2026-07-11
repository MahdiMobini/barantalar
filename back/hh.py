import requests
import json

API_KEY = '6275354D6362564F77385563462B51496A7070476232765A6C704A666F53474C6B5265386C4F5A366574383D'

# روش 1: با شماره عمومی
url = f'https://api.kavenegar.com/v1/{API_KEY}/sms/send.json'
params = {
    'sender': '0018018949161',
    'receptor': '09153132554',
    'message': 'تست ارسال پیام'
}

response = requests.post(url, data=params)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 200:
    print("✅ موفق!")
else:
    print("❌ ناموفق!")