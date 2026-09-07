// ==================== WEATHER ====================
async function fetchWeather() {
    const lat = 24.1556;
    const lon = 52.6833;
    
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia/Dubai`);
        const data = await response.json();
        renderWeather(data);
    } catch (err) {
        renderWeatherOffline();
    }
}

function renderWeather(data) {
    const container = document.getElementById('weatherContainer');
    if (!container) return;
    
    const temp = Math.round(data.current.temperature_2m);
    const wind = Math.round(data.current.wind_speed_10m);
    const code = data.current.weather_code;
    
    const icons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 51: '🌦️', 61: '🌧️', 80: '🌧️', 95: '⛈️' };
    const icon = icons[code] || '🌡️';
    
    container.innerHTML = `
        <div class="p-3 bg-gradient-to-br from-sky-500/10 to-transparent border border-sky-500/30 rounded-2xl">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-[9px] font-bold text-sky-400 uppercase">Al Dhannah City</p>
                    <p class="text-2xl font-bold text-stone-100 mt-1">${temp}°C</p>
                </div>
                <span class="text-3xl">${icon}</span>
            </div>
            <p class="text-[8px] text-stone-400 mt-2"><i class="fas fa-wind mr-1"></i>${wind} km/h</p>
        </div>
    `;
}

function renderWeatherOffline() {
    const container = document.getElementById('weatherContainer');
    if (container) container.innerHTML = '';
}

window.fetchWeather = fetchWeather;
