/**
 * AuraWeather - UI Interaction, Visual Widgets, and Render System
 */

const UI = {
  // Store Leaflet map instance
  mapInstance: null,
  mapTileLayer: null,
  mapWeatherLayer: null,

  /**
   * Safe DOM element selection helper
   */
  el(id) {
    return document.getElementById(id);
  },

  /**
   * Handcrafted Custom Animated SVG Icons based on weather codes
   * @param {string} iconCode 
   * @returns {string} SVG HTML string
   */
  getWeatherSVG(iconCode) {
    const isNight = iconCode.endsWith('n');
    const code = iconCode.substring(0, 2);

    switch (code) {
      case '01': // Clear Sky
        return isNight ? `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <defs>
              <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#E2E8F0" stop-opacity="1"/>
                <stop offset="100%" stop-color="#718096" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="16" fill="url(#moonGlow)" opacity="0.15" />
            <path d="M42 38.5C39 41.5 33 42 28.5 39.5C24 37 22.5 32 23 27C21.5 28 20 30 20.5 32.5C21.5 38.5 26.5 43.5 32.5 43.5C36 43.5 39.5 41.5 42 38.5Z" fill="#E2E8F0" filter="drop-shadow(0 0 6px rgba(226, 232, 240, 0.4))" />
            <circle cx="18" cy="18" r="1" fill="#fff" opacity="0.8" class="weather-icon-snow-flake-1" />
            <circle cx="48" cy="20" r="1.5" fill="#fff" opacity="0.6" class="weather-icon-snow-flake-2" />
          </svg>
        ` : `
          <svg viewBox="0 0 64 64" width="64" height="64" class="weather-icon-sun">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="18" fill="url(#sunGlow)" />
            <circle cx="32" cy="32" r="12" fill="#F59E0B" filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))" />
            <!-- Sun rays -->
            <g stroke="#F59E0B" stroke-width="3" stroke-linecap="round">
              <line x1="32" y1="10" x2="32" y2="4" />
              <line x1="32" y1="54" x2="32" y2="60" />
              <line x1="10" y1="32" x2="4" y2="32" />
              <line x1="54" y1="32" x2="60" y2="32" />
              <line x1="16.5" y1="16.5" x2="12.2" y2="12.2" />
              <line x1="47.5" y1="47.5" x2="51.8" y2="51.8" />
              <line x1="16.5" y1="47.5" x2="12.2" y2="52.8" />
              <line x1="47.5" y1="16.5" x2="51.8" y2="12.2" />
            </g>
          </svg>
        `;

      case '02': // Few Clouds
      case '03': // Scattered Clouds
        return isNight ? `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <path d="M38 33.5C36 35.5 32 36 29 34.5C26 33 25 29.5 25.5 26.5C24.5 27 23.5 28.5 23.8 30C24.5 34 27.8 37.5 32 37.5C34.5 37.5 36.8 36 38 33.5Z" fill="#E2E8F0" />
            <g class="weather-icon-cloud">
              <path d="M46 36C46 31.5 42.5 28 38 28C37 28 36 28.3 35.2 28.8C33.5 25.3 29.8 23 25.5 23C19.2 23 14 28.2 14 34.5C14 40.8 19.2 46 25.5 46H45C49.4 46 53 42.4 53 38C53 37.3 52.9 36.6 52.7 36C52.7 36 46 36 46 36Z" fill="#94A3B8" opacity="0.85" />
              <path d="M48 38C48 34 44.8 31 40.8 31C39.9 31 39 31.2 38.3 31.6C36.8 28.5 33.5 26.5 29.8 26.5C24.2 26.5 19.5 31.2 19.5 37C19.5 42.8 24.2 47.5 29.8 47.5H47C50.9 47.5 54 44.4 54 40.5C54 39.8 53.9 39.2 53.7 38.7C53.7 38.7 48 38 48 38Z" fill="#CBD5E1" />
            </g>
          </svg>
        ` : `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <g class="weather-icon-sun" style="transform-origin: 22px 22px;">
              <circle cx="22" cy="22" r="8" fill="#F59E0B" />
              <g stroke="#F59E0B" stroke-width="2" stroke-linecap="round">
                <line x1="22" y1="8" x2="22" y2="4" />
                <line x1="22" y1="36" x2="22" y2="40" />
                <line x1="8" y1="22" x2="4" y2="22" />
                <line x1="36" y1="22" x2="40" y2="22" />
              </g>
            </g>
            <g class="weather-icon-cloud" style="transform: translateY(2px);">
              <path d="M46 38C46 34 42.8 31 38.8 31C37.9 31 37 31.2 36.3 31.6C34.8 28.5 31.5 26.5 27.8 26.5C22.2 26.5 17.5 31.2 17.5 37C17.5 42.8 22.2 47.5 27.8 47.5H47C50.9 47.5 54 44.4 54 40.5C54 39.8 53.9 39.2 53.7 38.7Z" fill="#E2E8F0" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))" />
            </g>
          </svg>
        `;

      case '04': // Broken Clouds / Overcast
        return `
          <svg viewBox="0 0 64 64" width="64" height="64" class="weather-icon-cloud">
            <path d="M26 36C26 31.5 29.5 28 34 28C35 28 36 28.3 36.8 28.8C38.5 25.3 42.2 23 46.5 23C52.8 23 58 28.2 58 34.5C58 40.8 52.8 46 46.5 46H27C22.6 46 19 42.4 19 38C19 37.3 19.1 36.6 19.3 36" fill="#64748B" opacity="0.6" />
            <path d="M42 42C42 37.5 38.5 34 34 34C33 34 32 34.3 31.2 34.8C29.5 31.3 25.8 29 21.5 29C15.2 29 10 34.2 10 40.5C10 46.8 15.2 52 21.5 52H41C45.4 52 49 48.4 49 44C49 43.3 48.9 42.6 48.7 42" fill="#94A3B8" />
          </svg>
        `;

      case '09': // Shower Rain
      case '10': // Rain
        return `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <g class="weather-icon-cloud">
              <path d="M46 34C46 30 42.8 27 38.8 27C37.9 27 37 27.2 36.3 27.6C34.8 24.5 31.5 22.5 27.8 22.5C22.2 22.5 17.5 27.2 17.5 33C17.5 38.8 22.2 43.5 27.8 43.5H47C50.9 43.5 54 40.4 54 36.5C54 35.8 53.8 35.2 53.6 34.7" fill="#64748B" />
            </g>
            <g stroke="#5B8DEF" stroke-width="2.5" stroke-linecap="round">
              <line x1="26" y1="48" x2="24" y2="54" class="weather-icon-rain-drop-1" />
              <line x1="33" y1="48" x2="31" y2="54" class="weather-icon-rain-drop-2" />
              <line x1="40" y1="48" x2="38" y2="54" class="weather-icon-rain-drop-3" />
            </g>
          </svg>
        `;

      case '11': // Thunderstorm
        return `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <g class="weather-icon-cloud">
              <path d="M46 32C46 28 42.8 25 38.8 25C37.9 25 37 25.2 36.3 25.6C34.8 22.5 31.5 20.5 27.8 20.5C22.2 20.5 17.5 25.2 17.5 31C17.5 36.8 22.2 41.5 27.8 41.5H47C50.9 41.5 54 38.4 54 34.5C54 33.8 53.8 33.2 53.6 32.7" fill="#475569" />
            </g>
            <path d="M30 40 L24 48 L29 48 L25 56 L35 46 L30 46 Z" fill="#7C5CFC" filter="drop-shadow(0 0 6px #7C5CFC)" class="weather-icon-lightning" />
          </svg>
        `;

      case '13': // Snow
        return `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <g class="weather-icon-cloud">
              <path d="M46 34C46 30 42.8 27 38.8 27C37.9 27 37 27.2 36.3 27.6C34.8 24.5 31.5 22.5 27.8 22.5C22.2 22.5 17.5 27.2 17.5 33C17.5 38.8 22.2 43.5 27.8 43.5H47C50.9 43.5 54 40.4 54 36.5C54 35.8 53.8 35.2 53.6 34.7" fill="#E2E8F0" />
            </g>
            <g fill="#fff">
              <circle cx="26" cy="48" r="2.5" class="weather-icon-snow-flake-1" />
              <circle cx="33" cy="50" r="2" class="weather-icon-snow-flake-2" />
              <circle cx="40" cy="48" r="2.5" class="weather-icon-snow-flake-3" />
            </g>
          </svg>
        `;

      case '50': // Mist / Fog / Atmosphere
        return `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <g stroke="#94A3B8" stroke-width="3" stroke-linecap="round" class="weather-icon-wind-gust">
              <line x1="16" y1="24" x2="48" y2="24" />
              <line x1="20" y1="32" x2="44" y2="32" />
              <line x1="14" y1="40" x2="50" y2="40" />
              <line x1="24" y1="48" x2="40" y2="48" />
            </g>
          </svg>
        `;

      default: // Fallback Sunny/Cloudy
        return `
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="12" fill="#F59E0B" />
          </svg>
        `;
    }
  },

  /**
   * Renders skeleton loaders in key forecast & highlights elements
   */
  showSkeletons() {
    this.el('hero-temp').innerHTML = `<span class="skeleton-shimmer skeleton-text" style="width: 120px; height: 72px; display: inline-block;"></span>`;
    this.el('hero-desc').innerHTML = `<span class="skeleton-shimmer skeleton-text medium" style="display: inline-block;"></span>`;
    this.el('location-city').innerHTML = `<span class="skeleton-shimmer skeleton-text short" style="display: inline-block;"></span>`;
    this.el('hourly-forecast-container').innerHTML = Array(8).fill(0).map(() => `
      <div class="hourly-card">
        <div class="skeleton-shimmer skeleton-text short" style="height: 12px;"></div>
        <div class="skeleton-shimmer" style="width: 40px; height: 40px; border-radius: 50%;"></div>
        <div class="skeleton-shimmer skeleton-text short" style="height: 14px;"></div>
      </div>
    `).join('');
    this.el('daily-forecast-container').innerHTML = Array(5).fill(0).map(() => `
      <div class="forecast-day-row">
        <div class="skeleton-shimmer skeleton-text short" style="height: 14px; margin: 0;"></div>
        <div class="skeleton-shimmer" style="width: 28px; height: 28px; border-radius: 50%;"></div>
        <div class="skeleton-shimmer skeleton-text medium" style="height: 6px; margin: 0;"></div>
        <div class="skeleton-shimmer skeleton-text short" style="height: 14px; margin: 0;"></div>
      </div>
    `).join('');
  },

  /**
   * Updates current weather DOM components from fetched API data
   * @param {object} weatherData 
   * @param {string} unitSystem 'C' or 'F'
   */
  updateCurrentWeather(weatherData, unitSystem) {
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const desc = weatherData.weather[0].description;
    const city = weatherData.name;
    const country = weatherData.sys.country;
    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    // Main weather card
    this.animateNumber('hero-temp', temp);
    this.el('hero-unit').innerText = `°${unitSystem}`;
    this.el('hero-desc').innerText = desc;
    this.el('hero-weather-icon').innerHTML = this.getWeatherSVG(weatherData.weather[0].icon);
    this.el('location-city').innerText = `${city}, ${country}`;
    this.el('location-date').innerText = dateStr;

    // Sidebar quick stats
    this.el('feels-like-val').innerText = `${feelsLike}°${unitSystem}`;
    this.el('humidity-val').innerText = `${weatherData.main.humidity}%`;

    // Highlights Card Values
    this.el('card-humidity-text').innerText = `${weatherData.main.humidity}%`;
    this.el('card-visibility-text').innerText = (weatherData.visibility / 1000).toFixed(1);
    this.el('card-pressure-text').innerText = weatherData.main.pressure;
    this.el('card-cloudcover-text').innerText = weatherData.clouds.all;

    // Trigger individual component renders
    this.renderHumidityRing(weatherData.main.humidity);
    this.renderWindCompass(weatherData.wind.speed, weatherData.wind.deg, unitSystem);
    this.renderPressureGauge(weatherData.main.pressure);
    this.renderSunriseSunset(weatherData.sys.sunrise, weatherData.sys.sunset, weatherData.timezone);
    
    // Set dynamic bg
    const isNight = weatherData.weather[0].icon.endsWith('n');
    window.WeatherAnimationSystem.setTheme(weatherData.weather[0].main, isNight);

    // Weather Fact update
    this.updateWeatherFact(weatherData.weather[0].main);
  },

  /**
   * Updates Air Quality components
   * @param {object} aqData 
   */
  updateAirQuality(aqData) {
    const aqi = aqData.list[0].main.aqi;
    const pm25 = aqData.list[0].components.pm2_5.toFixed(1);
    
    const aqiLevels = {
      1: { label: 'Good', class: 'text-success', desc: 'Air is clean, excellent for outdoor activity.' },
      2: { label: 'Fair', class: 'text-success', desc: 'Acceptable air quality, very minor pollutants.' },
      3: { label: 'Moderate', class: 'text-warning', desc: 'Moderate pollution. Sensitive groups should monitor.' },
      4: { label: 'Poor', class: 'text-danger', desc: 'High pollution. Wear masks, limit long outdoor stays.' },
      5: { label: 'Very Poor', class: 'text-danger', style: 'color:#c084fc;', desc: 'Hazardous air conditions. Stay indoors.' }
    };

    const level = aqiLevels[aqi] || aqiLevels[1];
    
    this.el('card-aqi-value').innerText = level.label;
    this.el('card-aqi-value').className = `highlight-value ${level.class}`;
    this.el('card-aqi-footer').innerText = level.desc;
    this.el('card-pm25-val').innerText = `${pm25} µg/m³`;
  },

  /**
   * Updates forecast components (Hourly & 5-Day)
   * @param {object} forecastData 
   * @param {string} unitSystem 'C' or 'F'
   */
  updateForecasts(forecastData, unitSystem) {
    const hourlyContainer = this.el('hourly-forecast-container');
    const dailyContainer = this.el('daily-forecast-container');
    
    // 1. Render Hourly Forecast (Next 8 slots ≈ 24 hours)
    hourlyContainer.innerHTML = '';
    const hourlyList = forecastData.list.slice(0, 10);
    
    hourlyList.forEach((item, index) => {
      const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      });
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon;

      const hourlyCard = document.createElement('div');
      hourlyCard.className = `hourly-card hover-lift ${index === 0 ? 'active' : ''}`;
      hourlyCard.innerHTML = `
        <span class="hourly-time">${time}</span>
        <div class="hourly-icon">${this.getWeatherSVG(icon)}</div>
        <span class="hourly-temp">${temp}°</span>
      `;
      hourlyContainer.appendChild(hourlyCard);
    });

    // 2. Render 5-Day / 7-Day Forecast (Filtered unique days from list)
    dailyContainer.innerHTML = '';
    const dailyMap = new Map();
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' });
      const todayKey = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      if (dayKey === todayKey) return; // Skip today

      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, []);
      }
      dailyMap.get(dayKey).push(item);
    });

    // Find min and max of each day, select forecast icon matching midday
    let absoluteMin = 999;
    let absoluteMax = -999;
    const compiledDays = [];

    dailyMap.forEach((items, dayName) => {
      let minTemp = 999;
      let maxTemp = -999;
      let rainProb = 0;
      let icon = '01d';

      items.forEach(item => {
        if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
        if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
        if (item.pop > rainProb) rainProb = item.pop;
        // Grab midday icon if possible
        const hours = new Date(item.dt * 1000).getHours();
        if (hours >= 11 && hours <= 15) {
          icon = item.weather[0].icon;
        }
      });

      if (minTemp < absoluteMin) absoluteMin = minTemp;
      if (maxTemp > absoluteMax) absoluteMax = maxTemp;

      compiledDays.push({
        dayName: dayName.substring(0, 3), // e.g. Mon, Tue
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        rainProb: Math.round(rainProb * 100),
        icon
      });
    });

    // Render cards with range sliders matching standard Apple UI style
    const rangeSpan = absoluteMax - absoluteMin || 1;
    
    compiledDays.slice(0, 5).forEach(day => {
      // Calculate range bar widths
      const leftOffsetPercent = ((day.minTemp - absoluteMin) / rangeSpan) * 100;
      const widthPercent = ((day.maxTemp - day.minTemp) / rangeSpan) * 100;

      const row = document.createElement('div');
      row.className = 'forecast-day-row';
      row.innerHTML = `
        <div class="forecast-day-name">${day.dayName}</div>
        <div class="forecast-day-icon">${this.getWeatherSVG(day.icon)}</div>
        <div class="forecast-rain-prob">
          ${day.rainProb > 20 ? `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${day.rainProb}%
          ` : ''}
        </div>
        <div class="forecast-temp-slider">
          <span class="forecast-temp-low">${day.minTemp}°</span>
          <div class="forecast-bar-range">
            <div class="forecast-bar-fill" style="left: ${leftOffsetPercent}%; width: ${widthPercent}%;"></div>
          </div>
          <span class="forecast-temp-high">${day.maxTemp}°</span>
        </div>
      `;
      dailyContainer.appendChild(row);
    });
  },

  /**
   * Updates UV Index meter
   * UV Index comes from OpenWeatherMap (optional fetch) or approximated based on weather state/clouds
   */
  updateUVIndex(uvValue) {
    const val = parseFloat(uvValue) || 0;
    this.el('card-uv-value').innerText = val.toFixed(1);

    // Calculate arc offset (Total circumference = 157.0)
    // 0 to 12 range
    const percent = Math.min(val / 12, 1);
    const strokeOffset = 157 - (percent * 157);
    this.el('uv-arc-fill').style.strokeDashoffset = strokeOffset;

    // Angle path matching progress. Starts from left (0) to right (180deg)
    const angle = percent * Math.PI; // in radians
    const radius = 40;
    const x = 60 - Math.cos(angle) * radius;
    const y = 50 - Math.sin(angle) * radius;
    
    const dot = this.el('uv-indicator-dot');
    dot.style.left = `${(x / 120) * 100}%`;
    dot.style.top = `${(y / 60) * 100}%`;

    // Map description status
    let status = 'Low';
    let labelClass = 'text-success';
    if (val >= 3 && val < 6) { status = 'Moderate'; labelClass = 'text-warning'; }
    else if (val >= 6 && val < 8) { status = 'High'; labelClass = 'text-danger'; }
    else if (val >= 8) { status = 'Very High'; labelClass = 'text-danger'; }

    this.el('uv-status').innerText = status;
    this.el('uv-status').className = `uv-text-center ${labelClass}`;
  },

  /**
   * Draws dynamic SVG-like compass needle rotation
   */
  renderWindCompass(speed, deg, unitSystem) {
    const needle = this.el('wind-compass-needle');
    if (needle) {
      needle.style.transform = `rotate(${deg}deg)`;
    }

    // Direction text matching degree
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((deg % 360) / 22.5) % 16;
    const dir = directions[idx];
    const speedUnit = unitSystem === 'C' ? 'km/h' : 'mph';
    
    // OpenWeatherMap wind speed is m/s. Convert to km/h if metric
    const displaySpeed = unitSystem === 'C' ? Math.round(speed * 3.6) : Math.round(speed);
    
    this.el('card-wind-value').innerText = displaySpeed;
    this.el('card-wind-unit').innerText = ` ${speedUnit}`;
    this.el('card-wind-footer').innerText = `Direction: ${dir} (${deg}°)`;
  },

  /**
   * Radial progress circle offset calculation for humidity
   */
  renderHumidityRing(humidity) {
    const ring = this.el('humidity-progress-circle');
    if (ring) {
      // Circumference = 251.2
      const offset = 251.2 - (humidity / 100) * 251.2;
      ring.style.strokeDashoffset = offset;
    }
  },

  /**
   * Pressure Gauge Slider Update
   */
  renderPressureGauge(pressure) {
    // Standard pressure ranges 950hPa to 1050hPa
    const minP = 950;
    const maxP = 1050;
    const percent = Math.min(Math.max((pressure - minP) / (maxP - minP), 0), 1) * 100;
    
    this.el('pressure-bar-fill').style.width = `${percent}%`;
    this.el('pressure-marker').style.left = `${percent}%`;
  },

  /**
   * Draws a canvas-based sun path widget displaying Sunrise and Sunset
   */
  renderSunriseSunset(sunrise, sunset, timezone) {
    const canvas = this.el('sunrise-sunset-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Match resolution to styling container width
    const w = canvas.clientWidth;
    const h = 80;
    canvas.width = w;
    canvas.height = h;

    const sunriseTimeStr = new Date((sunrise + timezone - 19800) * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const sunsetTimeStr = new Date((sunset + timezone - 19800) * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Render labels inside UI elements
    this.el('sunrise-time-label').innerText = sunriseTimeStr;
    this.el('sunset-time-label').innerText = sunsetTimeStr;

    // Draw elements
    ctx.clearRect(0, 0, w, h);

    // Horizon line
    ctx.beginPath();
    ctx.moveTo(10, 70);
    ctx.lineTo(w - 10, 70);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dotted curve path
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(20, 70);
    ctx.quadraticCurveTo(w / 2, -15, w - 20, 70);
    ctx.strokeStyle = 'rgba(124, 92, 252, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Calculate current sun spot location along curve
    const now = Math.round(Date.now() / 1000);
    const dayLength = sunset - sunrise;
    
    if (now >= sunrise && now <= sunset && dayLength > 0) {
      const t = (now - sunrise) / dayLength; // 0 to 1
      
      // Bezier Quadratic Formula coordinate solver
      // P0 = (20, 70), P1 = (w/2, -15), P2 = (w-20, 70)
      const p0 = { x: 20, y: 70 };
      const p1 = { x: w / 2, y: -15 };
      const p2 = { x: w - 20, y: 70 };

      const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

      // Draw sun ray halo
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 16);
      glow.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
      glow.addColorStop(0.3, 'rgba(245, 158, 11, 0.3)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Draw sun core dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#F59E0B';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  },

  /**
   * Initializes or updates the interactive Leaflet Map
   * @param {number} lat 
   * @param {number} lon 
   * @param {string} layerName 'temp_new' | 'precipitation_new' | 'clouds_new' | 'wind_new'
   */
  updateWeatherMap(lat, lon, layerName = 'precipitation_new') {
    const key = window.AuraAPI.getKey();
    
    // Fallback if Leaflet isn't loaded yet
    if (typeof L === 'undefined') {
      console.warn('Leaflet map resources not loaded yet.');
      return;
    }

    if (!this.mapInstance) {
      // Instantiate map
      this.mapInstance = L.map('leaflet-map', {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lon], 9);

      // Dark mode CartoDB tile theme
      this.mapTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(this.mapInstance);
      
      // Custom zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(this.mapInstance);
    } else {
      // Fly to new searched location
      this.mapInstance.setView([lat, lon], 9);
    }

    // Clear previous overlay layers
    if (this.mapWeatherLayer) {
      this.mapInstance.removeLayer(this.mapWeatherLayer);
    }

    // Check if user has API Key configured. OpenWeatherMap tiles require an appid parameter.
    if (key && key.length > 5) {
      this.mapWeatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${key}`, {
        maxZoom: 19,
        opacity: 0.65
      }).addTo(this.mapInstance);
    } else {
      console.warn('Weather maps tile layer skipped: API key not available or configured.');
    }
  },

  /**
   * Update Weather Fun Fact widget dynamically based on weather conditions
   * @param {string} condition 
   */
  updateWeatherFact(condition) {
    const facts = {
      sunny: [
        "Light travels from the Sun to Earth in about 8.3 minutes.",
        "The highest temperature ever recorded on Earth was 56.7°C in Death Valley."
      ],
      cloudy: [
        "Clouds look light, but a typical cumulus cloud weighs about 500,000 kilograms (1.1 million pounds)!",
        "Clouds appear white because they scatter light from the sun equally in all directions."
      ],
      rain: [
        "Raindrops aren't tear-shaped. They actually look like hamburger buns due to air resistance.",
        "The smell after rain is called 'petrichor', caused by bacteria releasing oils into the soil."
      ],
      thunderstorm: [
        "A single lightning bolt can heat the surrounding air to 30,000°C (54,000°F)—five times hotter than the sun.",
        "Astraphobia is the clinical term for an extreme fear of thunder and lightning."
      ],
      snow: [
        "Every single snowflake has six sides, dictated by the molecular structure of ice crystals.",
        "The largest snowflake ever recorded was 15 inches wide and occurred in Montana in 1887."
      ],
      night: [
        "The light from the stars you see at night has traveled for years, decades, or even centuries.",
        "A moonbow is a rare rainbow produced by moonlight rather than direct sunlight."
      ]
    };

    const key = condition.toLowerCase();
    let factArr = facts.sunny;
    if (key.includes('cloud')) factArr = facts.cloudy;
    else if (key.includes('rain') || key.includes('drizzle') || key.includes('mist')) factArr = facts.rain;
    else if (key.includes('thunder')) factArr = facts.thunderstorm;
    else if (key.includes('snow')) factArr = facts.snow;
    else if (window.WeatherAnimationSystem.isNight) factArr = facts.night;

    const selectedFact = factArr[Math.floor(Math.random() * factArr.length)];
    this.el('weather-fact-text').innerText = selectedFact;
  },

  /**
   * Smooth number counter animation
   */
  animateNumber(elementId, targetVal) {
    const el = this.el(elementId);
    if (!el) return;

    let start = 0;
    // Extract numerical value if exists
    const currentText = el.innerText;
    if (currentText && !isNaN(parseInt(currentText))) {
      start = parseInt(currentText);
    }

    const duration = 800; // ms
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out quad formula
      const eased = progress * (2 - progress);
      const val = Math.round(start + eased * (targetVal - start));
      
      // Handle HTML injection if inside loaders
      if (el.querySelector('.skeleton-shimmer')) {
        el.innerHTML = val;
      } else {
        el.innerText = val;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }
};

window.AuraUI = UI;
