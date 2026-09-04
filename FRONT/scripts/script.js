const BACKEND_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const defaultCity = localStorage.getItem("userCity") || "Cairo";

  // جلب طقس المدينة الافتراضية فور فتح الصفحة
  fetchWeather(defaultCity);

  // زر البحث
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const cityInput = document.getElementById("searchCity");
      if (cityInput && cityInput.value.trim()) {
        fetchWeather(cityInput.value.trim());
      }
    });
  }

  // Enter Key للبحث
  const searchCityInput = document.getElementById("searchCity");
  if (searchCityInput) {
    searchCityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && searchCityInput.value.trim()) {
        fetchWeather(searchCityInput.value.trim());
      }
    });
  }

  // تسجيل الخروج
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});

async function fetchWeather(city) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BACKEND_URL}/api/weather?city=${encodeURIComponent(city)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      }
    });

    const data = await res.json();

    if (res.ok) {
      updateUI(data);
    } else {
      alert(data.message || data.error || "City not found!");
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    alert("Error connecting to weather backend server!");
  }
}

function updateUI(data) {
  const locElem = document.getElementById("locationName");
  if (locElem && data.name && data.sys) {
    locElem.textContent = `${data.name}, ${data.sys.country}`;
  }

  const tempElem = document.getElementById("temperatureValue");
  if (tempElem && data.main) {
    tempElem.innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
  }

  const typeElem = document.getElementById("weatherType");
  if (typeElem && data.weather && data.weather[0]) {
    typeElem.textContent = data.weather[0].description;
  }

  const humElem = document.getElementById("humidityValue");
  if (humElem && data.main) {
    humElem.textContent = data.main.humidity;
  }

  const windElem = document.getElementById("windSpeedValue");
  if (windElem && data.wind) {
    windElem.textContent = data.wind.speed;
  }

  const pressElem = document.getElementById("pressureValue");
  if (pressElem && data.main) {
    pressElem.textContent = data.main.pressure;
  }

  const feelsElem = document.getElementById("feelsLikeValue");
  if (feelsElem && data.main) {
    feelsElem.innerHTML = Math.round(data.main.feels_like);
  }

  const iconImg = document.getElementById("weatherIcon");
  if (iconImg && data.weather && data.weather[0]) {
    const iconCode = data.weather[0].icon;
    iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconImg.style.display = "inline-block";

    iconImg.onerror = () => {
      iconImg.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    };
  }
}