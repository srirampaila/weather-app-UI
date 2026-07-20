# 🌤️ Atmos – Premium Weather Application

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Status](https://img.shields.io/badge/Status-Active%20Development-green.svg)](https://github.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)

---

## 🌐 Live Preview

> [!NOTE]
> The live deployment of the application is hosted at the link below.

👉 **[Launch Atmos Weather Dashboard](https://your-deployment-url-here.vercel.app)** *(Placeholder)*

---

## 📸 Screenshots

### Desktop View
![Desktop Dashboard Mockup](https://raw.githubusercontent.com/username/repository/main/assets/desktop-preview.png) *(Placeholder)*

### Tablet & Mobile View
| Tablet Layout | Mobile Portrait |
| :---: | :---: |
| ![Tablet Mockup](https://raw.githubusercontent.com/username/repository/main/assets/tablet-preview.png) *(Placeholder)* | ![Mobile Mockup](https://raw.githubusercontent.com/username/repository/main/assets/mobile-preview.png) *(Placeholder)* |

---

## 📖 Overview

**Atmos** is a next-generation, responsive weather dashboard built using HTML5, CSS3, JavaScript (ES6), and AJAX (Fetch API). The application delivers real-time weather analytics and interactive meteorological charts using the **OpenWeatherMap API**. 

Inspired by elite UI systems such as *Apple Weather, Linear, Stripe, and Framer*, Atmos leverages a premium glassmorphic visual language, smooth micro-animations, and dynamic canvas-based weather backgrounds. The design focuses heavily on sub-millisecond perceived performance, accessibility compliance, strict responsiveness, and intuitive visual storytelling to elevate the weather-monitoring experience.

---

## ✨ Features

- **Current Weather:** Immediate access to current temperature, weather conditions, felt temperature, and local metrics.
- **Automatic Location Detection:** Geolocation lookup to instantly populate local weather data upon user consent.
- **Search Any City:** Advanced autocomplete search functionality with suggestion caching and fallback lookups.
- **AJAX Data Fetching:** Highly efficient asynchronous API calls leveraging the modern JavaScript Fetch API.
- **Real-Time Weather Updates:** Automatic and manual interface refreshes to ensure data accuracy.
- **Hourly Forecast:** Horizontal scroll container displaying granular temperature and condition changes for the next 24 hours.
- **7-Day Forecast:** Detailed 5-to-7 day preview showing weather trends, extremes, and iconographic summaries.
- **Air Quality:** Comprehensive Air Quality Index (AQI) widget showing PM2.5 concentrations and health advisories.
- **Wind Speed:** Dynamic graphical compass displaying wind velocity, heading, and cardinal directions.
- **Humidity:** Circular SVG progress-ring gauge visualizing ambient humidity percentages and dew points.
- **Pressure:** Slider-based atmospheric pressure index comparing current metrics with standard barometric baselines.
- **UV Index:** Curved arc gauge tracking solar UV indices from low to extreme hazard levels.
- **Visibility:** Real-time visibility readouts in kilometers to assess atmospheric clarity.
- **Sunrise & Sunset:** Clean SVG arc visualizing the sun's trajectory with exact dawn and dusk timings.
- **Interactive Weather Map:** Fully interactive map with toggleable precipitation, cloud, and wind speed radar layers.
- **Responsive Design:** Optimized layouts adapting to desktop monitor, tablet, and mobile device form-factors.
- **Dark & Light Theme:** Native theme toggle modifying structural CSS variables for comfortable daytime or nighttime viewing.
- **Animated Weather Backgrounds:** Custom HTML5 Canvas engine rendering active particle weather (rain, snow, clouds, thunder) dynamically.
- **Glassmorphism UI:** Sophisticated UI panels utilizing CSS backdrop-filters, semi-transparent layers, and fine borders.
- **Modern Animations:** Premium transitions, fade-up cards, and physics-aligned hover effects using native CSS.
- **Error Handling:** Robust error catchers for API failures, incorrect cities, and missing network access.
- **Loading Skeletons:** Premium CSS shimmer placeholders reducing layout shift during network operations.

---

## 🎨 UI Highlights

The user interface of Atmos has been crafted to deliver a premium SaaS aesthetic:

- **Glassmorphism:** Elements rely on `backdrop-filter: blur(20px)` and semi-transparent `rgba` borders to float above the canvas background.
- **Aurora Gradients:** Ambient blurred glowing shapes transition smoothly to simulate atmospheric depth.
- **Floating Cards:** Subtle box shadows and structural borders isolate components for high readability.
- **Animated Icons:** Custom inline SVG icons animate smoothly when interactive states change.
- **Responsive Layout:** CSS Grid and Flexbox establish fluid layouts that resize gracefully.
- **Micro Interactions:** Interactive elements respond instantly to input with spring-like animations.
- **Smooth Hover Effects:** Subtle scale adjustments, border changes, and opacity shifts provide feedback.
- **Beautiful Typography:** Clean hierarchies using the **Outfit** and **Poppins** sans-serif font families.
- **Dynamic Backgrounds:** High-performance Canvas rendering of active rain, snow, clouds, and sunny rays.

---

## 🛠️ Tech Stack

| Technology | Role | Details / Version |
| :--- | :--- | :--- |
| **HTML5** | Application structure & semantics | Standard markup, modern elements |
| **CSS3** | Visual design & layouts | Glassmorphism, CSS Custom Properties, Animations |
| **JavaScript (ES6)** | Logic, state coordination & Canvas rendering | Modular design, OOP Canvas engine |
| **AJAX (Fetch API)** | Asynchronous communication | Promise-based fetching with caching mechanisms |
| **OpenWeatherMap API** | Core meteorological data feed | Free tier usage (Current, Forecast, Air Quality) |
| **Leaflet.js** | Mapping engine library | High-performance interactive mobile-friendly maps |
| **OpenStreetMap** | Map tile provider | Open-source map layer rendering |
| **Geolocation API** | Automated location finder | HTML5 native coordinate detection |
| **Google Fonts** | Core typography system | 'Outfit' and 'Poppins' typography stylesheets |

---

## 📁 Folder Structure

Below is the directory structure of the Atmos Weather Application:

```text
atmos-weather-app/
├── index.html               # Main HTML entrypoint and skeleton template
├── css/
│   ├── animations.css       # Native keyframe rules, hover transforms, transitions
│   ├── responsive.css       # Responsive media queries (Desktop, Tablet, Mobile)
│   └── style.css            # Core design system tokens, layout grid, themes
├── js/
│   ├── animation.js         # Canvas-based weather background animation controller
│   ├── api.js               # OWM API Fetch client wrapper with LocalStorage logic
│   ├── app.js               # Application state bootstrap and DOM event binding
│   └── ui.js                # DOM rendering engines, icon generators, widget updates
├── components/              # Reserved for modular frontend components
├── icons/                   # Custom SVG and image-based weather assets
└── assets/                  # Public static assets, screenshots, and visual items
```

---

## 🚀 Installation

Follow these steps to run the Atmos weather application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/username/atmos-weather-app.git
cd atmos-weather-app
```

### 2. Configure the Directory
Ensure the directory structure matches the file tree. Open the workspace folder in your code editor.

### 3. Obtain an OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/).
2. Create a free account.
3. Generate an API Key under the **My API Keys** section in the account profile.

### 4. Run the Project
The application requires a local server environment to run the Geolocation API and execute Fetch requests correctly. Use one of the following methods:

#### Option A: VS Code Live Server Extension
1. Open the project in **Visual Studio Code**.
2. Click **Go Live** in the bottom-right corner of the editor status bar.

#### Option B: Python HTTP Server
Run the command below in the terminal from the project root:
```bash
# Python 3
python -m http.server 8000
```
Then, access `http://localhost:8000` in the browser.

#### Option C: Node.js http-server
Install and run:
```bash
npm install -g http-server
http-server -p 8080
```
Then, navigate to `http://localhost:8080`.

---

## ⚙️ Configuration

The Atmos application is designed to be developer-friendly. To establish a default API Key or modify configurations:

### Option A: Via User Interface (Recommended)
1. Open the application.
2. Click the **Gear icon** ⚙️ on the right side of the navbar to open the **Preferences** panel.
3. Paste the OpenWeatherMap API key into the input field.
4. The key is automatically stored in `localStorage` under `owm_api_key` for subsequent visits.

### Option B: Hardcoding in the Codebase
For direct integration without user settings, modify the key retrieval method in `js/api.js`:

```javascript
// Replace this block in js/api.js
getKey() {
  return localStorage.getItem('owm_api_key');
}

// With a hardcoded key
getKey() {
  const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE";
  return API_KEY;
}
```

---

## 🔌 API Used

Atmos calls several specific endpoints from the **OpenWeatherMap API suite**:

1. **Current Weather API:** Retrieves local temperatures, pressures, humidity metrics, winds, and cloud states based on query or coordinates.
   - Endpoint: `/data/2.5/weather`
2. **Forecast API:** Fetches 5-day weather forecast datasets in 3-hour increments to build the hourly scrollbar and daily forecast widget.
   - Endpoint: `/data/2.5/forecast`
3. **Air Pollution API:** Evaluates PM2.5, PM10, CO, NO, NO2, O3, SO2, and NH3 values to calculate the structural Air Quality Index.
   - Endpoint: `/data/2.5/air_pollution`
4. **Geocoding API:** Translates search autocomplete strings into geographic coordinates, and maps reverse-geocodes coordinate values back into readable city name headers.
   - Endpoints: `/geo/1.0/direct` and `/geo/1.0/reverse`

---

## 🔄 Application Workflow

The diagram below illustrates the sequential loading states, verification loops, and data render cycles:

```text
User Opens Application
      │
      ▼
Check LocalStorage (API Key Status)
      │
      ├──► [No Key Found] ──► Render Onboarding Modal / Ask for Key
      │
      └──► [Key Found]
               │
               ▼
   Request Geolocation Permission
               │
               ├──► [Granted] ───► Fetch Coordinates via Geolocation API
               │
               └──► [Denied] ────► Load Default Coordinates (London)
                        │
                        ▼
            Trigger API Requests (AJAX)
           (Weather, Forecast, AQI)
                        │
                        ▼
               Process JSON Payloads
                        │
                        ▼
            Render UI Components
    ┌───────────────────┼───────────────────┐
    ▼                   ▼                   ▼
Render Weather      Render Hourly &      Initialize &
Dashboard Cards     Daily Lists          Update Map Tiles
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                        ▼
          Determine Local Weather State
                        │
                        ▼
          Update Canvas Animations (Rain, Snow, Sun...)
```

---

## 📱 Responsive Design

Atmos employs a responsive viewport scaling policy. The application design changes structurally based on the media breakpoint:

- **Desktop (min-width: 1024px):** A modern, three-column layout. The primary weather conditions sidebar remains anchored on the left, widgets populate the main central section, and the interactive map details span full widths near the base.
- **Tablet (768px to 1023px):** Adapts elements to two columns. Grid elements shift to preserve space while maintaining touch responsiveness.
- **Mobile (max-width: 767px):** Condenses into a single vertical stream. Buttons, search entry bars, and scrolling boxes adapt sizes to allow navigation on touchscreen environments.

---

## ⚡ Performance Optimizations

Atmos maintains sub-millisecond updates and low battery drain through several programmatic strategies:

- **Optimized DOM Updates:** Minimizes heavy DOM alterations by caching container references and using targeted inner text modifications.
- **Lazy Loaded Assets:** CSS files, script files, and external map libraries load in an optimized sequence to decrease first-contentful-paint (FCP) delays.
- **Efficient API Calls:** Features search input debouncing (300ms) to reduce API calls during keyword entry.
- **Smooth Animations:** Offloads animations (like translation, scales, and opacity changes) directly to the GPU using CSS transformations and `requestAnimationFrame` on Canvas rendering loops.
- **Minimal Reflows:** Avoids read-write layout cycles by batching updates and styling layout elements using static absolute dimensioning where possible.

---

## ♿ Accessibility

Design layout structures meet global accessibility standards:

- **Semantic HTML:** Relies on modern landmark structures (`<header>`, `<main>`, `<aside>`, `<article>`, `<section>`) for screen reader compatibility.
- **Keyboard Navigation:** Forms, search inputs, action buttons, and configuration fields are navigable using keyboard focus paths.
- **ARIA Labels:** Interactive widgets, unit switchers, and drawer closures are configured with detailed ARIA descriptions.
- **Color Contrast:** Font styling matches WCAG AAA contrast standard against transparent glass cards and backgrounds.
- **Focus States:** High-visibility outline glows apply to active items to visually aid navigation paths.

---

## 🌐 Browser Compatibility

The application is compatible with modern web standard engines:

| Browser | Supported Version | Notes |
| :--- | :---: | :--- |
| **Google Chrome** | v80+ | Fully supported |
| **Microsoft Edge** | v80+ | Fully supported |
| **Mozilla Firefox** | v75+ | Fully supported |
| **Apple Safari** | v13.1+ | Fully supported (requires native backdrop-filter support) |
| **Opera** | v67+ | Fully supported |

---

## 🔮 Future Enhancements

<details>
<summary>Click to view planned updates and roadmap</summary>

- 🚨 **Weather Alerts:** Push notification warnings for severe regional storms, tornados, or temperature drops.
- ⭐ **Favorite Cities:** A dedicated database sync (using cloud storage) to save and track multiple locations across multiple devices.
- 📱 **PWA Support:** Service worker implementation to configure Atmos as a Progressive Web App, enabling direct home screen installation.
- 💾 **Offline Cache:** Service workers caching the last loaded metrics to serve weather insights without internet connectivity.
- 🎙️ **Voice Search:** Integrating the Web Speech API to search cities via voice command.
- 🔔 **Weather Notifications:** Periodic browser notifications tracking sunrise, sunset, or imminent rain.
- 🌀 **Radar Animation:** Live animated storm tracker map layers.
- 🗣️ **Multiple Languages:** Multi-locale localization support (English, Spanish, French, German, Japanese, etc.).
- 📅 **Weather History:** Data charts illustrating historical weather deviations for selected cities.
- 📊 **Charts:** Integrating Chart.js to graph hourly wind changes, pressure graphs, and weekly temperature spans.
- 🤖 **AI Weather Assistant:** A lightweight AI companion offering outfit recommendations and outdoor travel feasibility analysis based on real-time weather alerts.

</details>

---

## 🤝 Contributing

Contributions to the development of the Atmos weather dashboard are welcome. To contribute:

1. **Fork** the repository to a personal GitHub account.
2. **Create a Feature Branch** (`git checkout -b feature/amazing-enhancement`).
3. **Commit Changes** (`git commit -m 'Add some amazing enhancement'`).
4. **Push to the Branch** (`git push origin feature/amazing-enhancement`).
5. **Open a Pull Request** describing modifications, testing steps, and styling additions.

Ensure code is properly formatted and adheres to existing coding conventions before submission.

---

## 📄 License

This project is licensed under the terms of the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **[OpenWeatherMap](https://openweathermap.org)** for delivering precise APIs.
- **[Leaflet](https://leafletjs.com)** for providing the mobile-friendly interactive mapping interface.
- **[OpenStreetMap](https://www.openstreetmap.org)** for spatial imagery tiles.
- **[Google Fonts](https://fonts.google.com)** for Outfit and Poppins typefaces.

---

## 📈 Project Status

- **Status:** **Active Development**
- Continuous refinements are being introduced to enhance visualization speeds, animation quality, and location precision.