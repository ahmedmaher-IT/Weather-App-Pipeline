const BACKEND_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const defaultCity = localStorage.getItem("userCity") || "Cairo";

  // لو مفيش توكن يرجعه لصفحة اللوجن
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // جلب طقس المدينة الافتراضية فور فتح الصفحة
  fetchWeather(defaultCity);

  // زر البحث
  document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("searchCity").value.trim();
    if (city) fetchWeather(city);
  });

  // Enter Key للبحث
  document.getElementById("searchCity").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = document.getElementById("searchCity").value.trim();
      if (city) fetchWeather(city);
    }
  });

  // تسجيل الخروج
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userCity");
    window.location.href = "login.html";
  });
});

async function fetchWeather(city) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BACKEND_URL}/api/weather?city=${encodeURIComponent(city)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired, please login again.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();

    if (res.ok) {
      updateUI(data);
    } else {
      alert(data.message || "City not found!");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to weather backend!");
  }
}

function updateUI(data) {
  document.getElementById("locationName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("temperatureValue").innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
  document.getElementById("weatherType").textContent = data.weather[0].description;
  document.getElementById("humidityValue").textContent = data.main.humidity;
  document.getElementById("windSpeedValue").textContent = data.wind.speed;
  document.getElementById("pressureValue").textContent = data.main.pressure;
  document.getElementById("feelsLikeValue").innerHTML = Math.round(data.main.feels_like);

  // تحديث رابط الأيقونة بشكل آمن مع إجبار العرض
  const iconImg = document.getElementById("weatherIcon");
  if (iconImg) {
    const iconCode = data.weather[0].icon;
    
    // استخدام رابط OpenWeather عبر HTTPS
    iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconImg.style.display = "inline-block"; // إظهار الصورة فور التحميل

    // في حالة عدم توفر الإنترنت أو فشل الرابط، يتم استخدام أيقونة افتراضية
    iconImg.onerror = () => {
      iconImg.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // رابط أيقونة شمس احتياطي مباشر
    };
  }
}