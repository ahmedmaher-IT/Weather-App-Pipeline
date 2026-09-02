import requests
import os
import time

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

def check_rain_for_city(city):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        weather_main = data['weather'][0]['main'].lower()
        if 'rain' in weather_main or 'drizzle' in weather_main:
            return True, data['weather'][0]['description']
    return False, None

def send_notification(user_email, city, description):
    print(f"[NOTIFICATION ALERT] Rain detected in {city} ({description})! Notification sent to {user_email}")

def main():
    # قائمة كترشيحات (تُسحب مستقبلاً من API المستخدمين)
    tracked_users = [
        {"email": "ahmed@example.com", "city": "Cairo"},
        {"email": "alex_user@example.com", "city": "Alexandria"}
    ]
    
    for user in tracked_users:
        is_raining, desc = check_rain_for_city(user["city"])
        if is_raining:
            send_notification(user["email"], user["city"], desc)

if __name__ == "__main__":
    main()