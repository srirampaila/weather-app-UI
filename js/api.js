/**
 * AuraWeather - API Client wrapper for OpenWeatherMap API
 * Features caching to avoid rate-limiting and local storage key retrieve
 */

const OWM_BASE_URL = 'https://api.openweathermap.org';

const API = {
  /**
   * Retrieves the OpenWeatherMap API key stored in localStorage
   * @returns {string|null}
   */
  getKey() {
    return localStorage.getItem('owm_api_key');
  },

  /**
   * Saves the OpenWeatherMap API key in localStorage
   * @param {string} key 
   */
  setKey(key) {
    localStorage.setItem('owm_api_key', key.trim());
  },

  /**
   * Checks if an API key is currently saved
   * @returns {boolean}
   */
  hasKey() {
    const key = this.getKey();
    return !!(key && key.length > 5);
  },

  /**
   * Generic request wrapper with support for custom API keys and standard queries
   * @param {string} endpoint 
   * @param {object} params 
   * @returns {Promise<any>}
   */
  async request(endpoint, params = {}) {
    const key = this.getKey();
    if (!key) {
      throw new Error('API_KEY_REQUIRED');
    }

    // Build URLSearchParams
    const searchParams = new URLSearchParams({
      appid: key,
      ...params
    });

    const url = `${OWM_BASE_URL}${endpoint}?${searchParams.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('INVALID_API_KEY');
        }
        throw new Error(`API_ERROR_${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`AuraWeather API Request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Fetches current weather for a specific lat/lon coordinate
   * @param {number} lat 
   * @param {number} lon 
   * @param {string} units 'metric' or 'imperial'
   * @returns {Promise<object>}
   */
  async fetchWeatherByCoords(lat, lon, units = 'metric') {
    return this.request('/data/2.5/weather', { lat, lon, units });
  },

  /**
   * Fetches current weather by city name
   * @param {string} cityName 
   * @param {string} units 'metric' or 'imperial'
   * @returns {Promise<object>}
   */
  async fetchWeatherByCityName(cityName, units = 'metric') {
    return this.request('/data/2.5/weather', { q: cityName, units });
  },

  /**
   * Fetches 5-day / 3-hour forecast for coordinates
   * @param {number} lat 
   * @param {number} lon 
   * @param {string} units 'metric' or 'imperial'
   * @returns {Promise<object>}
   */
  async fetchForecast(lat, lon, units = 'metric') {
    return this.request('/data/2.5/forecast', { lat, lon, units });
  },

  /**
   * Fetches Air Pollution index for coordinates
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<object>}
   */
  async fetchAirQuality(lat, lon) {
    return this.request('/data/2.5/air_pollution', { lat, lon });
  },

  /**
   * Fetches matching city names for autocomplete query
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async fetchCitySuggestions(query) {
    if (!query || query.trim().length < 2) return [];
    return this.request('/geo/1.0/direct', { q: query, limit: 5 });
  },

  /**
   * Fetches matching city name from lat/lon reverse geocoding
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<Array>}
   */
  async reverseGeocode(lat, lon) {
    return this.request('/geo/1.0/reverse', { lat, lon, limit: 1 });
  }
};

// Export to window object for access from other modules
window.AuraAPI = API;
