// ==================== MÉTÉO ET ACTIVITÉS ====================
let weatherData = null;

async function fetchWeather() {
    // Al Dhannah City, Abu Dhabi - coordonnées approximatives
    const lat = 24.1556;
    const lon = 52.6833;
    
    try {
        // Utiliser Open-Meteo API (gratuit, pas de clé API requise)
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m&timezone=Asia/Dubai`);
        
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        weatherData = data;
        renderWeather();
        
    } catch (err) {
        console.warn('Error fetching weather:', err);
        renderWeatherOffline();
    }
}

function renderWeather() {
    const container = document.getElementById('weatherContainer');
    if (!container || !weatherData) return;
    
    const temp = Math.round(weatherData.current.temperature_2m);
    const weatherCode = weatherData.current.weather_code;
    const windSpeed = Math.round(weatherData.current.wind_speed_10m);
    
    const weatherInfo = getWeatherInfo(weatherCode);
    
    container.innerHTML = `
        <div class="p-3 bg-gradient-to-br from-sky-500/10 to-transparent border border-sky-500/30 rounded-2xl">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-[9px] font-bold text-sky-400 uppercase tracking-wider">
                        <i class="fas fa-map-marker-alt mr-1"></i> Al Dhannah City
                    </p>
                    <p class="text-2xl font-bold text-stone-100 mt-1">${temp}°C</p>
                </div>
                <div class="text-right">
                    <span class="text-3xl">${weatherInfo.icon}</span>
                    <p class="text-[9px] text-stone-400">${weatherInfo.label}</p>
                </div>
            </div>
            <div class="flex justify-between mt-2 pt-2 border-t border-stone-800">
                <span class="text-[8px] text-stone-400"><i class="fas fa-wind mr-1"></i>${windSpeed} km/h</span>
                <span class="text-[8px] text-stone-400"><i class="fas fa-clock mr-1"></i>${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
            ${getActivitySuggestion(weatherCode, temp)}
        </div>
    `;
}

function renderWeatherOffline() {
    const container = document.getElementById('weatherContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl text-center">
            <p class="text-[10px] text-stone-400">Weather unavailable offline</p>
        </div>
    `;
}

function getWeatherInfo(code) {
    if (code === 0) return { icon: '☀️', label: 'Sunny' };
    if (code === 1 || code === 2) return { icon: '🌤️', label: 'Partly Cloudy' };
    if (code === 3) return { icon: '☁️', label: 'Cloudy' };
    if (code >= 51 && code <= 57) return { icon: '🌦️', label: 'Drizzle' };
    if (code >= 61 && code <= 67) return { icon: '🌧️', label: 'Rainy' };
    if (code >= 71 && code <= 77) return { icon: '🌨️', label: 'Snowy' };
    if (code >= 80 && code <= 82) return { icon: '🌧️', label: 'Showers' };
    if (code >= 95) return { icon: '⛈️', label: 'Stormy' };
    return { icon: '🌡️', label: 'Unknown' };
}

function getActivitySuggestion(code, temp) {
    let activity = '';
    
    if (code === 0 && temp >= 25 && temp <= 35) {
        activity = '🏊 Perfect weather for the pool!';
    } else if (code === 0 && temp > 35) {
        activity = '❄️ Stay cool indoors - try our spa!';
    } else if (code >= 1 && code <= 2 && temp >= 22 && temp <= 32) {
        activity = '🌅 Great time for a desert safari!';
    } else if (code >= 3) {
        activity = '🍽️ Perfect time for indoor dining!';
    } else if (temp < 22) {
        activity = '☕ Enjoy a warm drink at our lounge!';
    } else {
        activity = '🛎️ Ask our concierge for activities!';
    }
    
    return `<p class="text-[9px] text-amber-400 mt-2 font-bold">${activity}</p>`;
}

function initWeather() {
    fetchWeather();
    
    // Rafraîchir toutes les 30 minutes
    setInterval(() => {
        fetchWeather();
    }, 30 * 60 * 1000);
}
