/**
 * AuraWeather - Application Bootstrapper & State Coordinator
 */

(function () {
  // Application State
  const state = {
    unit: 'C', // 'C' or 'F'
    currentLat: 51.5074, // Default London
    currentLon: -0.1278,
    currentCityName: 'London',
    isDemoMode: false,
    favorites: [],
    searchDebounceTimer: null,
    highlightedSuggestionIndex: -1
  };

  // Cache DOM selector pointers
  const dom = {
    navbar: document.getElementById('navbar'),
    searchInput: document.getElementById('search-input'),
    suggestionsDropdown: document.getElementById('suggestions-dropdown'),
    searchLoader: document.getElementById('search-loader'),
    unitToggleBtn: document.getElementById('unit-toggle-btn'),
    unitToggleLabel: document.getElementById('unit-toggle-label'),
    settingsTrigger: document.getElementById('settings-trigger-btn'),
    settingsDrawer: document.getElementById('settings-drawer'),
    settingsClose: document.getElementById('settings-close-btn'),
    settingsApiKey: document.getElementById('settings-api-key'),
    settingsSave: document.getElementById('settings-save-btn'),
    unitCelsius: document.getElementById('unit-celsius-btn'),
    unitFahrenheit: document.getElementById('unit-fahrenheit-btn'),
    favoriteToggle: document.getElementById('favorite-toggle'),
    pinnedContainer: document.getElementById('pinned-cities-container'),
    onboardingModal: document.getElementById('onboarding-modal'),
    modalApiKey: document.getElementById('modal-api-key'),
    modalSubmitKey: document.getElementById('modal-submit-key-btn'),
    modalDemoBtn: document.getElementById('modal-demo-btn'),
    backToTop: document.getElementById('back-to-top'),
    clockTime: document.getElementById('nav-clock-time'),
    
    // Map overlay layers buttons
    mapLayerPrecip: document.getElementById('btn-layer-precip'),
    mapLayerClouds: document.getElementById('btn-layer-clouds'),
    mapLayerWind: document.getElementById('btn-layer-wind')
  };

  /**
   * Application Booting Routine
   */
  function init() {
    // 1. Initialize Clock
    updateClock();
    setInterval(updateClock, 1000);

    // 2. Initialize Weather Canvas Engine
    const canvas = document.getElementById('weather-canvas');
    if (canvas) {
      window.WeatherAnimationSystem.init(canvas);
    }

    // 3. Load user configurations from LocalStorage
    loadSettings();
    loadFavorites();

    // 4. Bind event listeners
    bindEvents();

    // 5. Onboarding Verification
    checkOnboarding();
  }

  /**
   * Load configurations from browser localStorage
   */
  function loadSettings() {
    // Unit system preference
    const savedUnit = localStorage.getItem('aura_units');
    if (savedUnit === 'F' || savedUnit === 'C') {
      state.unit = savedUnit;
      updateUnitButtonsUI();
    }

    // API Key autofill
    const savedKey = window.AuraAPI.getKey();
    if (savedKey) {
      dom.settingsApiKey.value = savedKey;
      dom.modalApiKey.value = savedKey;
    }

    // Check if demo mode was previously active
    state.isDemoMode = localStorage.getItem('aura_demo_mode') === 'true';
  }

  /**
   * Bind DOM interactivity listeners
   */
  function bindEvents() {
    // Scroll events for Sticky Navbar and Back to Top
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 20) {
        dom.navbar.classList.add('scrolled');
      } else {
        dom.navbar.classList.remove('scrolled');
      }

      if (scrollY > 300) {
        dom.backToTop.classList.add('visible');
      } else {
        dom.backToTop.classList.remove('visible');
      }
    });

    // Back to top click behavior
    dom.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Drawer Toggles
    dom.settingsTrigger.addEventListener('click', () => {
      dom.settingsDrawer.classList.add('open');
      // Sync Key Input just in case
      dom.settingsApiKey.value = window.AuraAPI.getKey() || '';
    });

    dom.settingsClose.addEventListener('click', () => {
      dom.settingsDrawer.classList.remove('open');
    });

    // Save Settings inside drawer
    dom.settingsSave.addEventListener('click', () => {
      const key = dom.settingsApiKey.value.trim();
      window.AuraAPI.setKey(key);
      state.isDemoMode = false;
      localStorage.setItem('aura_demo_mode', 'false');
      
      dom.settingsDrawer.classList.remove('open');
      
      // Re-trigger load for current location
      loadWeatherData(state.currentLat, state.currentLon, state.currentCityName);
    });

    // Onboarding Key Submit
    dom.modalSubmitKey.addEventListener('click', () => {
      const key = dom.modalApiKey.value.trim();
      if (key.length < 5) {
        alert('Please enter a valid OpenWeatherMap API Key.');
        return;
      }
      window.AuraAPI.setKey(key);
      state.isDemoMode = false;
      localStorage.setItem('aura_demo_mode', 'false');
      
      dom.onboardingModal.classList.remove('active');
      
      // Request geo-position and start dashboard load
      triggerGeolocationBoot();
    });

    // Onboarding Demo Trigger
    dom.modalDemoBtn.addEventListener('click', () => {
      state.isDemoMode = true;
      localStorage.setItem('aura_demo_mode', 'true');
      
      dom.onboardingModal.classList.remove('active');
      triggerGeolocationBoot();
    });

    // Unit toggle button click (Navbar Shortcut)
    dom.unitToggleBtn.addEventListener('click', () => {
      state.unit = state.unit === 'C' ? 'F' : 'C';
      localStorage.setItem('aura_units', state.unit);
      updateUnitButtonsUI();
      
      // Reload weather data to reflect correct measurements
      loadWeatherData(state.currentLat, state.currentLon, state.currentCityName);
    });

    // Settings Drawer unit system clicks
    dom.unitCelsius.addEventListener('click', () => {
      state.unit = 'C';
      localStorage.setItem('aura_units', state.unit);
      updateUnitButtonsUI();
      loadWeatherData(state.currentLat, state.currentLon, state.currentCityName);
    });

    dom.unitFahrenheit.addEventListener('click', () => {
      state.unit = 'F';
      localStorage.setItem('aura_units', state.unit);
      updateUnitButtonsUI();
      loadWeatherData(state.currentLat, state.currentLon, state.currentCityName);
    });

    // Pin location to favorites button toggle
    dom.favoriteToggle.addEventListener('click', () => {
      toggleFavorite(state.currentCityName, state.currentLat, state.currentLon);
    });

    // Map overlay layers clicks
    const mapButtons = [dom.mapLayerPrecip, dom.mapLayerClouds, dom.mapLayerWind];
    mapButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Toggle active styling states
        mapButtons.forEach(b => b.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        
        const layer = target.getAttribute('data-layer');
        window.AuraUI.updateWeatherMap(state.currentLat, state.currentLon, layer);
      });
    });

    // Autocomplete input listener
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(state.searchDebounceTimer);
      const query = e.target.value.trim();

      if (query.length < 2) {
        closeSuggestions();
        return;
      }

      dom.searchLoader.style.display = 'block';
      state.searchDebounceTimer = setTimeout(() => {
        handleSearchAutocomplete(query);
      }, 400);
    });

    // Suggestions keyboard control accessibility features
    dom.searchInput.addEventListener('keydown', (e) => {
      const dropdown = dom.suggestionsDropdown;
      const items = dropdown.querySelectorAll('.suggestion-item');
      
      if (!dropdown.classList.contains('active') || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.highlightedSuggestionIndex = (state.highlightedSuggestionIndex + 1) % items.length;
        updateSuggestionHighlights(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.highlightedSuggestionIndex = (state.highlightedSuggestionIndex - 1 + items.length) % items.length;
        updateSuggestionHighlights(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.highlightedSuggestionIndex >= 0) {
          items[state.highlightedSuggestionIndex].click();
        }
      } else if (e.key === 'Escape') {
        closeSuggestions();
      }
    });

    // Hide suggestions on outside click
    document.addEventListener('click', (e) => {
      if (!dom.searchInput.contains(e.target) && !dom.suggestionsDropdown.contains(e.target)) {
        closeSuggestions();
      }
    });
  }

  /**
   * Checks if user has key saved, else loads onboarding modal
   */
  function checkOnboarding() {
    if (!window.AuraAPI.hasKey() && !state.isDemoMode) {
      dom.onboardingModal.classList.add('active');
    } else {
      triggerGeolocationBoot();
    }
  }

  /**
   * Attempts Geolocation retrieval or falls back to London
   */
  function triggerGeolocationBoot() {
    window.AuraUI.showSkeletons();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Look up coordinates city name via reverse lookup
          reverseLookupAndLoad(lat, lon);
        },
        (error) => {
          console.warn('Geolocation access denied/failed, falling back to London.', error);
          loadWeatherData(51.5074, -0.1278, 'London');
        },
        { timeout: 8000 }
      );
    } else {
      loadWeatherData(51.5074, -0.1278, 'London');
    }
  }

  /**
   * Reverse lookup coordinate to retrieve city name, then load weather data
   */
  async function reverseLookupAndLoad(lat, lon) {
    if (state.isDemoMode) {
      loadWeatherData(lat, lon, 'Your Location');
      return;
    }

    try {
      const results = await window.AuraAPI.reverseGeocode(lat, lon);
      if (results && results.length > 0) {
        const city = results[0].name;
        loadWeatherData(lat, lon, city);
      } else {
        loadWeatherData(lat, lon, 'Current Location');
      }
    } catch (err) {
      // API Key might be invalid or network offline
      handleRequestError(err);
      loadWeatherData(lat, lon, 'Location Coordinates');
    }
  }

  /**
   * Core orchestrator that fetches or generates all weather points and updates visual widgets
   */
  async function loadWeatherData(lat, lon, cityName) {
    state.currentLat = lat;
    state.currentLon = lon;
    state.currentCityName = cityName;

    // Check if this city is currently pinned
    updateFavoriteBtnState();

    if (state.isDemoMode) {
      const mockData = generateMockWeatherData(lat, lon, cityName);
      
      // Update UI components
      window.AuraUI.updateCurrentWeather(mockData.current, state.unit);
      window.AuraUI.updateForecasts(mockData.forecast, state.unit);
      window.AuraUI.updateAirQuality(mockData.airQuality);
      window.AuraUI.updateUVIndex(mockData.uvIndex);
      window.AuraUI.updateWeatherMap(lat, lon, getActiveMapLayer());
      return;
    }

    // Live API integration
    try {
      const unitParam = state.unit === 'C' ? 'metric' : 'imperial';
      
      const current = await window.AuraAPI.fetchWeatherByCoords(lat, lon, unitParam);
      const forecast = await window.AuraAPI.fetchForecast(lat, lon, unitParam);
      const airQuality = await window.AuraAPI.fetchAirQuality(lat, lon);

      // Current OWM current API doesn't return UV index on free weather, we approximate or fetch if key has onecall
      // For general keys we calculate based on weather ID (Clear/Sunny: high UV, Cloudy/Rainy: low UV)
      const weatherId = current.weather[0].id;
      let approxUv = 1.2; // default low
      if (weatherId === 800) approxUv = 7.5; // Clear sunny
      else if (weatherId > 800 && weatherId < 803) approxUv = 4.2; // Scattered clouds
      else if (weatherId >= 300 && weatherId < 600) approxUv = 0.8; // Rain

      // Update UI
      window.AuraUI.updateCurrentWeather(current, state.unit);
      window.AuraUI.updateForecasts(forecast, state.unit);
      window.AuraUI.updateAirQuality(airQuality);
      window.AuraUI.updateUVIndex(approxUv);
      
      // Update interactive map
      window.AuraUI.updateWeatherMap(lat, lon, getActiveMapLayer());

    } catch (err) {
      handleRequestError(err);
    }
  }

  /**
   * Helper to retrieve currently highlighted map overlay layer parameter
   */
  function getActiveMapLayer() {
    const activeBtn = document.querySelector('.map-layer-btn.active');
    return activeBtn ? activeBtn.getAttribute('data-layer') : 'precipitation_new';
  }

  /**
   * Triggers error modals or alerts on fetch issues
   */
  function handleRequestError(err) {
    console.error('AuraWeather encountered an loading error:', err);
    if (err.message === 'API_KEY_REQUIRED' || err.message === 'INVALID_API_KEY') {
      // Re-trigger onboarding modal
      dom.onboardingModal.classList.add('active');
    } else {
      // Simple toast fallback or display error
      alert(`Unable to retrieve satellite data. ${err.message || 'Check connection.'}`);
    }
  }

  /**
   * Syncs unit buttons design toggles
   */
  function updateUnitButtonsUI() {
    dom.unitToggleLabel.innerText = `°${state.unit}`;
    
    if (state.unit === 'C') {
      dom.unitCelsius.classList.add('active');
      dom.unitFahrenheit.classList.remove('active');
    } else {
      dom.unitCelsius.classList.remove('active');
      dom.unitFahrenheit.classList.add('active');
    }
  }

  /**
   * Dynamic Clock update routine
   */
  function updateClock() {
    const now = new Date();
    dom.clockTime.innerText = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  /**
   * Autocomplete search querying and list renderer
   */
  async function handleSearchAutocomplete(query) {
    if (state.isDemoMode) {
      // Generate simulated matching cities
      const mockCities = [
        { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
        { name: 'New Delhi', country: 'IN', lat: 28.6139, lon: 77.2090 },
        { name: 'Newcastle', country: 'GB', lat: 54.9783, lon: -1.6178 },
        { name: 'New Orleans', country: 'US', lat: 29.9511, lon: -90.0715 }
      ];
      
      const filtered = mockCities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
      renderSuggestions(filtered);
      return;
    }

    try {
      const suggestions = await window.AuraAPI.fetchCitySuggestions(query);
      renderSuggestions(suggestions);
    } catch (err) {
      console.error('Autocomplete suggestions query failed:', err);
      closeSuggestions();
    }
  }

  /**
   * Renders the suggestions list panel
   */
  function renderSuggestions(list) {
    dom.searchLoader.style.display = 'none';
    dom.suggestionsDropdown.innerHTML = '';
    state.highlightedSuggestionIndex = -1;

    if (!list || list.length === 0) {
      dom.suggestionsDropdown.classList.remove('active');
      return;
    }

    list.forEach(city => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <div class="suggestion-details">
          <span class="suggestion-name">${city.name}</span>
          <span class="suggestion-country">${city.state ? city.state + ', ' : ''}${city.country}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        // Clear input, close search menu
        dom.searchInput.value = '';
        closeSuggestions();

        // Load new weather points
        loadWeatherData(city.lat, city.lon, city.name);
      });

      dom.suggestionsDropdown.appendChild(item);
    });

    dom.suggestionsDropdown.classList.add('active');
  }

  function closeSuggestions() {
    dom.searchLoader.style.display = 'none';
    dom.suggestionsDropdown.classList.remove('active');
    dom.suggestionsDropdown.innerHTML = '';
  }

  function updateSuggestionHighlights(items) {
    items.forEach((item, index) => {
      if (index === state.highlightedSuggestionIndex) {
        item.classList.add('highlighted');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('highlighted');
      }
    });
  }

  /* ==========================================================================
     PINNED LOCATIONS (FAVORITES) MODULE
     ========================================================================== */
  function loadFavorites() {
    const data = localStorage.getItem('aura_favorites');
    if (data) {
      try {
        state.favorites = JSON.parse(data);
        renderFavoritesList();
      } catch (e) {
        state.favorites = [];
      }
    }
  }

  function saveFavorites() {
    localStorage.setItem('aura_favorites', JSON.stringify(state.favorites));
    renderFavoritesList();
  }

  function toggleFavorite(cityName, lat, lon) {
    const existsIdx = state.favorites.findIndex(f => f.name.toLowerCase() === cityName.toLowerCase());

    if (existsIdx >= 0) {
      // Remove
      state.favorites.splice(existsIdx, 1);
    } else {
      // Add
      state.favorites.push({ name: cityName, lat, lon });
    }

    saveFavorites();
    updateFavoriteBtnState();
  }

  function updateFavoriteBtnState() {
    const pinned = state.favorites.some(f => f.name.toLowerCase() === state.currentCityName.toLowerCase());
    if (pinned) {
      dom.favoriteToggle.classList.add('active');
    } else {
      dom.favoriteToggle.classList.remove('active');
    }
  }

  function renderFavoritesList() {
    dom.pinnedContainer.innerHTML = '';

    if (state.favorites.length === 0) {
      dom.pinnedContainer.innerHTML = `
        <div style="text-align: center; font-size: 13px; color: var(--text-muted); padding: 16px;">
          No locations pinned yet.<br>Pin cities to monitor them easily.
        </div>
      `;
      return;
    }

    state.favorites.forEach(fav => {
      const item = document.createElement('div');
      item.className = 'fav-city-item';
      item.innerHTML = `
        <div class="fav-city-info">
          <span class="fav-city-name">${fav.name}</span>
          <span class="fav-city-desc" id="fav-desc-${fav.name.replace(/\s+/g, '')}">View Weather</span>
        </div>
        <div class="fav-city-temp" id="fav-temp-${fav.name.replace(/\s+/g, '')}">--°</div>
      `;

      item.addEventListener('click', () => {
        loadWeatherData(fav.lat, fav.lon, fav.name);
      });

      dom.pinnedContainer.appendChild(item);

      // Async fetch quick mini weather updates for favorites list
      fetchFavoriteStatsMini(fav);
    });
  }

  /**
   * Fetches/Generates tiny temperature updates for the favorites list
   */
  async function fetchFavoriteStatsMini(fav) {
    const tempEl = document.getElementById(`fav-temp-${fav.name.replace(/\s+/g, '')}`);
    const descEl = document.getElementById(`fav-desc-${fav.name.replace(/\s+/g, '')}`);
    if (!tempEl || !descEl) return;

    if (state.isDemoMode) {
      const mock = generateMockWeatherData(fav.lat, fav.lon, fav.name);
      const temp = Math.round(mock.current.main.temp);
      tempEl.innerText = `${temp}°`;
      descEl.innerText = mock.current.weather[0].description;
      return;
    }

    try {
      const unitParam = state.unit === 'C' ? 'metric' : 'imperial';
      const current = await window.AuraAPI.fetchWeatherByCoords(fav.lat, fav.lon, unitParam);
      tempEl.innerText = `${Math.round(current.main.temp)}°`;
      descEl.innerText = current.weather[0].description;
    } catch (e) {
      tempEl.innerText = '--°';
    }
  }


  /* ==========================================================================
     MOCK DATA GENERATOR MODULE FOR KEYLESS/DEMO MODE
     ========================================================================== */
  function generateMockWeatherData(lat, lon, cityName) {
    // Generate seeded random values using latitude to keep city weather consistent
    const seed = Math.sin(lat) * Math.cos(lon);
    
    // Choose weather condition based on coordinate decimals
    const conditionsList = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'];
    const idx = Math.abs(Math.round(seed * 10)) % conditionsList.length;
    const weatherMain = conditionsList[idx];

    let icon = '01d';
    let description = 'clear sky';
    let tempRange = [18, 28]; // metric Celcius

    if (weatherMain === 'Clear') {
      icon = '01d';
      description = 'clear sky';
      tempRange = [22, 31];
    } else if (weatherMain === 'Clouds') {
      icon = '03d';
      description = 'scattered clouds';
      tempRange = [14, 22];
    } else if (weatherMain === 'Rain') {
      icon = '10d';
      description = 'moderate rain';
      tempRange = [10, 18];
    } else if (weatherMain === 'Snow') {
      icon = '13d';
      description = 'light snow';
      tempRange = [-4, 3];
    } else if (weatherMain === 'Thunderstorm') {
      icon = '11d';
      description = 'thunderstorm with rain';
      tempRange = [16, 24];
    }

    // Convert seed temperature limits if unit system is imperial
    if (state.unit === 'F') {
      tempRange = [tempRange[0] * 1.8 + 32, tempRange[1] * 1.8 + 32];
    }

    const currentTemp = tempRange[0] + Math.abs(seed) * (tempRange[1] - tempRange[0]);
    const currentHumidity = Math.round(50 + Math.abs(Math.cos(lat)) * 40);
    const pressure = Math.round(1005 + Math.abs(seed) * 20);
    const speed = 3 + Math.abs(seed) * 15;
    const deg = Math.round(Math.abs(seed * 360)) % 360;

    const current = {
      name: cityName,
      main: {
        temp: currentTemp,
        feels_like: currentTemp - (weatherMain === 'Rain' ? 2 : 0) + (weatherMain === 'Clear' ? 1 : 0),
        humidity: currentHumidity,
        pressure: pressure
      },
      weather: [{
        id: weatherMain === 'Clear' ? 800 : (weatherMain === 'Clouds' ? 802 : 500),
        main: weatherMain,
        description: description,
        icon: icon
      }],
      wind: {
        speed: speed,
        deg: deg
      },
      clouds: {
        all: weatherMain === 'Clouds' ? 40 : (weatherMain === 'Clear' ? 0 : 90)
      },
      sys: {
        country: Math.abs(lat) > 40 ? 'US' : 'EU',
        sunrise: Math.round(Date.now() / 1000) - 20000,
        sunset: Math.round(Date.now() / 1000) + 20000
      },
      timezone: 3600,
      visibility: 10000
    };

    // Generate Hourly Forecast items (24 Hours in 3-Hour increments = 8 items)
    const hourlyItems = [];
    for (let i = 0; i < 10; i++) {
      const dt = Math.round(Date.now() / 1000) + i * 10800;
      const hourOffset = (i * 3) % 24;
      const hourlyTemp = currentTemp + Math.sin(hourOffset / 4) * 4;
      
      hourlyItems.push({
        dt: dt,
        main: {
          temp: hourlyTemp
        },
        weather: [{
          main: weatherMain,
          icon: hourOffset > 18 || hourOffset < 6 ? icon.replace('d', 'n') : icon
        }]
      });
    }

    // Generate 5-Day items
    const forecastList = [];
    for (let d = 0; d < 6; d++) {
      const dt = Math.round(Date.now() / 1000) + d * 86400;
      // Add multiple times per day to mimic OWM forecast payload
      for (let hourIndex = 0; hourIndex < 8; hourIndex++) {
        const timeDt = dt + hourIndex * 10800;
        const dayTemp = currentTemp + Math.sin(d) * 3 + (4 - hourIndex) * 1.2;
        forecastList.push({
          dt: timeDt,
          main: {
            temp: dayTemp,
            temp_min: dayTemp - 3,
            temp_max: dayTemp + 3
          },
          weather: [{
            main: weatherMain,
            icon: icon
          }],
          pop: weatherMain === 'Rain' ? 0.75 : 0.1
        });
      }
    }

    const forecast = {
      list: forecastList
    };

    const airQuality = {
      list: [{
        main: {
          aqi: weatherMain === 'Clear' ? 1 : 2
        },
        components: {
          pm2_5: weatherMain === 'Clear' ? 4.2 : 12.8
        }
      }]
    };

    const uvIndex = weatherMain === 'Clear' ? 6.5 : (weatherMain === 'Clouds' ? 3.0 : 0.5);

    return { current, forecast, airQuality, uvIndex };
  }

  // Fire initialization
  document.addEventListener('DOMContentLoaded', init);
})();
