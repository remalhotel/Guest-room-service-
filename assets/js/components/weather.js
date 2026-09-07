// ==================== WEATHER ====================
async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=24.1556&longitude=52.6833&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia/Dubai');
        const data = await response.json();
        renderWeather(data);
    } catch (err) {
        document.getElementById('weatherContainer').innerHTML = '';
    }
}

function renderWeather(data) {
    const container = document.getElementById('weatherContainer');
    if (!container) return;
    const temp = Math.round(data.current.temperature_2m);
    const wind = Math.round(data.current.wind_speed_10m);
    const icons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 51: '🌦️', 61: '🌧️', 80: '🌧️', 95: '⛈️' };
    const icon = icons[data.current.weather_code] || '🌡️';
    container.innerHTML = `
        <div class="p-3 rounded-2xl border" style="background: rgba(14,165,233,0.1); border-color: rgba(14,165,233,0.3);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <p style="font-size:9px; font-weight:bold; color:#38bdf8;">Al Dhannah City</p>
                    <p style="font-size:24px; font-weight:bold; color:white; margin-top:4px;">${temp}°C</p>
                </div>
                <span style="font-size:30px;">${icon}</span>
            </div>
            <p style="font-size:8px; color:#a8a29e; margin-top:8px;">💨 ${wind} km/h</p>
        </div>
    `;
}

window.fetchWeather = fetchWeather;
