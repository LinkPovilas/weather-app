# Weather App

A modern, responsive weather application built with Vue 3, TypeScript and Vuetify. Get weather information and forecasts.

## ✨ Features

- **🌤️ Current Weather**: Weather conditions including temperature, humidity, pressure, wind speed, and precipitation
- **📅 Daily Forecast**: 7-day weather forecast with high/low temperatures and weather conditions
- **⏰ Hourly Forecast**: Temperature over time chart.
- **🗺️ Map**: Visual location display with Leaflet integration
- **🌅 Sunrise & Sunset**: Daily sunrise, sunset times and daylight duration
- **📍 Location Services**:
  - Automatic location detection via IP geolocation
  - Manual location search
  - Reverse geocoding for coordinates
- **🎨 Modern UI**: Clean, intuitive interface built with Vuetify Material Design
- **🧪 Well Tested**: Comprehensive unit test coverage with Vitest

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Framework**: Vuetify 3
- **State Management**: Pinia
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Maps**: Leaflet with Vue-Leaflet
- **Charts**: Unovis for data visualization
- **Weather Data**: Open-Meteo API
- **Geolocation**: IPinfo.io + OpenStreetMap Nominatim + Open-Meteo Geocoding

## 📋 Requirements

- **Node.js**: Version 24.1.0 or higher (see `.nvmrc`)
- **npm**: Version 10+ (comes with Node.js)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# The default configuration uses free APIs and should work out of the box
# No API keys required for Open-Meteo weather data
```

**Environment Variables:**

- `VITE_WEATHER_API_BASE_URL`: Open-Meteo API endpoint
- `VITE_IP_INFO_GEOLOCATION_API_BASE_URL`: IP geolocation service
- `VITE_OPEN_STREET_MAP_GEOLOCATION_API_BASE_URL`: Reverse geocoding service
- `VITE_OPEN_METEO_GEOLOCATION_API_BASE_URL`: Location search service

### 3. Development

```bash
# Start development server
npm run dev
```

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server with hot reload
npm run preview      # Preview production build locally
```

### Building

```bash
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking
```

### Testing

```bash
npm run test:unit              # Run unit tests
npm run test:unit:coverage     # Run tests with coverage report
```

### Code Quality

```bash
npm run lint         # Lint and fix code with ESLint
npm run format       # Format code with Prettier
```

## 🏗️ Project Structure

```
src/
├── components/         # Reusable Vue components
│   ├── cards/
│   ├── AppToast.vue
│   ├── CircularProgressBar.vue
│   └── SearchBar.vue
├── services/           # API services
│   ├── weatherForecastService.ts
│   ├── geolocationService.ts
│   └── axios.ts
├── stores/             # Pinia state management
│   ├── useWeatherForecastStore.ts
│   ├── useGeolocationStore.ts
│   └── useMessagesStore.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── weatherUtils.ts
│   └── timeUtils.ts
└── assets/             # Static assets and styles
```

## 🧪 Testing

The application includes comprehensive unit tests covering:

- **Components**: All Vue components with user interactions
- **Services**: API services and data fetching logic
- **Stores**: Pinia state management logic
- **Utils**: Utility functions and helpers

Run tests with coverage to see detailed reports:

```bash
npm run test:unit:coverage
# Open coverage/index.html to view detailed coverage report
```

## 🌐 API Services

### Weather Data

- **Weather Forecast**: [Open-Meteo Weather Forecast](https://open-meteo.com/en/docs) (free)

### Geolocation Services

- **IP Geolocation**: [IPinfo.io](https://ipinfo.io/) (free)
- **Reverse Geocoding**: [OpenStreetMap Nominatim](https://nominatim.org/) (free)
- **Location Search**: [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) (free)

## 🎨 UI/UX Features

- **Material Design 3**: Modern design system
- **Responsive Layout**: Adapts to all screen sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 Development Tools

- **Vue DevTools**: Browser extension for Vue debugging
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Vitest**: Fast unit testing framework
- **Vite**: Lightning-fast build tool
