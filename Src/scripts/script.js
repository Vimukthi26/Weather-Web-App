const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

// Theme Toggle
let isDarkMode = false;

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherContent = document.getElementById('weather-content');
const loader = document.getElementById('loader');
const errMsg = document.getElementById('error-message');

const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');
const footer = document.querySelector('.site-footer');


// Replace with backend URL when deployed, otherwise relative path
const BASE_URL = '/api';

// Weather Icon Mapping via WMO Codes from Open-Meteo
function getWeatherIconAndDesc(code) {
    if (code === 0) return { icon: '<i class="fa-solid fa-sun icon-pulse" style="color: #fcd34d;"></i>', desc: 'Clear sky' };
    if (code === 1 || code === 2 || code === 3) return { icon: '<i class="fa-solid fa-cloud-sun icon-pulse" style="color: #9ca3af;"></i>', desc: 'Mainly clear, partly cloudy, and overcast' };
    if (code === 45 || code === 48) return { icon: '<i class="fa-solid fa-smog icon-pulse" style="color: #94a3b8;"></i>', desc: 'Fog' };
    if (code >= 51 && code <= 55) return { icon: '<i class="fa-solid fa-cloud-rain icon-pulse" style="color: #60a5fa;"></i>', desc: 'Drizzle' };
    if (code >= 61 && code <= 65) return { icon: '<i class="fa-solid fa-cloud-showers-heavy icon-pulse" style="color: #3b82f6;"></i>', desc: 'Rain' };
    if (code >= 71 && code <= 77) return { icon: '<i class="fa-solid fa-snowflake icon-pulse" style="color: #93c5fd;"></i>', desc: 'Snow' };
    if (code >= 80 && code <= 82) return { icon: '<i class="fa-solid fa-cloud-showers-water icon-pulse" style="color: #2563eb;"></i>', desc: 'Rain showers' };
    if (code >= 95 && code <= 99) return { icon: '<i class="fa-bolt icon-pulse" style="color: #fbbf24;"></i>', desc: 'Thunderstorm' };
    return { icon: '<i class="fa-solid fa-cloud icon-pulse" style="color: #cbd5e1;"></i>', desc: 'Unknown' };
}

// Fetch Weather Data
async function fetchWeather(city) {
    try {
        weatherContent.classList.add('hidden');
        errMsg.classList.add('hidden');
        loader.classList.remove('hidden');

        // 1. Get Coordinates from City Name
        const geoRes = await fetch(`${BASE_URL}/geocode?city=${city}`);
        if (!geoRes.ok) {
            throw new Error('City not found');
        }

        const geoData = await geoRes.json();
        const { latitude, longitude, name, country } = geoData;

        // 2. Get Weather Data from Coordinates
        const weatherRes = await fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}`);
        if (!weatherRes.ok) {
            throw new Error('Error fetching weather data');
        }

        const weatherData = await weatherRes.json();
        const current = weatherData.current; // OpenMeteo 'current' object

        // Add artificial delay for smooth transition and loader visibility
        setTimeout(() => {
            updateUI(name, country, current);
            loader.classList.add('hidden');
            weatherContent.classList.remove('hidden');
        }, 500);

    } catch (error) {
        console.error(error);
        loader.classList.add('hidden');
        errMsg.classList.remove('hidden');
        errMsg.textContent = error.message;
    }
}

function updateUI(name, country, current) {
    cityName.textContent = `${name}, ${country}`;
    temperature.textContent = `${Math.round(current.temperature_2m || current.temperature)}°`;
    windSpeed.textContent = `${current.wind_speed_10m || current.windspeed} km/h`;
    humidity.textContent = `${current.relative_humidity_2m || 0}%`;

    const weatherInfo = getWeatherIconAndDesc(current.weather_code !== undefined ? current.weather_code : current.weathercode);
    description.textContent = weatherInfo.desc;
    weatherIcon.innerHTML = weatherInfo.icon;
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city !== '') {
            fetchWeather(city);
        }
    }
});

// Load default city (Colombo)
window.addEventListener('DOMContentLoaded', () => {
    fetchWeather('Colombo');
    handleFooterVisibility();
});

// Footer Visibility Logic
function handleFooterVisibility() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Show footer if user is near the bottom (last 50px) or if there's no scrollbar
    if (scrollHeight - clientHeight - scrollTop <= 50 || scrollHeight <= clientHeight) {
        footer.classList.add('footer-visible');
    } else {
        footer.classList.remove('footer-visible');
    }
}

window.addEventListener('scroll', handleFooterVisibility);
window.addEventListener('resize', handleFooterVisibility);
