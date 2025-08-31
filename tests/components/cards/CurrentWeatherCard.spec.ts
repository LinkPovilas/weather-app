import CurrentWeatherCard from '../../../src/components/cards/CurrentWeatherCard.vue';
import { screen, waitFor } from '@testing-library/vue';
import { MOCK_WEATHER_DATA } from '../../mocks/weatherForecastService.mock';
import { setupComponent } from '../../test-utils';
import { MOCK_GEOLOCATION_DATA } from '../../mocks/useGeolocationStore.mock';
import { vi } from 'vitest';

vi.mock('vuetify', async () => {
  const actual = await vi.importActual('vuetify');
  return {
    ...actual,
    useDate: () => ({
      format: () => 'Aug 27, 2025, 22:24',
    }),
  };
});

describe('CurrentWeatherCard', () => {
  const { current: currentWeather } = MOCK_WEATHER_DATA;

  describe('loading', () => {
    it('shows circular progress bar while data is loading', () => {
      setupComponent(CurrentWeatherCard, {
        piniaOptions: {
          initialState: { weatherForecast: { loading: true } },
        },
      });

      expect(screen.getByTestId('circular-progress-bar')).toBeInTheDocument();
      expect(screen.queryByText('Current Weather')).not.toBeInTheDocument();
    });
  });

  describe('render', () => {
    it('renders empty state when no weather data', () => {
      setupComponent(CurrentWeatherCard, {
        piniaOptions: {
          initialState: { weatherForecast: { currentWeather: null } },
        },
      });

      expect(screen.getByText('Current Weather')).toBeVisible();
      expect(screen.getByText('No data available')).toBeVisible();
      expect(screen.queryByTestId('current-time')).not.toBeInTheDocument();
    });

    it('renders current weather icon and description text', () => {
      setupComponent(CurrentWeatherCard, {
        piniaOptions: {
          initialState: { weatherForecast: { currentWeather } },
        },
      });

      expect(screen.getByTestId('current-weather-icon')).toBeVisible();
      expect(screen.getByTestId('current-weather-temperature')).toHaveTextContent('21.6 °C');
      expect(screen.getByTestId('current-weather-temperature')).toBeVisible();
      expect(screen.getByTestId('current-weather-feels-like')).toHaveTextContent(
        'Feels like 20.8 °C',
      );
      expect(screen.getByTestId('current-weather-feels-like')).toBeVisible();
      expect(screen.getByTestId('current-weather-description')).toHaveTextContent('Partly cloudy');
      expect(screen.getByTestId('current-weather-description')).toBeVisible();
    });

    it('renders weather metrics', () => {
      setupComponent(CurrentWeatherCard, {
        piniaOptions: {
          initialState: { weatherForecast: { currentWeather } },
        },
      });

      expect(screen.getByTestId('weather-metric-icon-pressure')).toBeVisible();
      expect(screen.getByTestId('weather-metric-value-pressure')).toHaveTextContent('1007.9 hPa');
      expect(screen.getByTestId('weather-metric-icon-humidity')).toBeVisible();
      expect(screen.getByTestId('weather-metric-value-humidity')).toHaveTextContent('41%');
      expect(screen.getByTestId('weather-metric-icon-wind-speed')).toBeVisible();
      expect(screen.getByTestId('weather-metric-value-wind-speed')).toHaveTextContent('1.8 km/h');
      expect(screen.getByTestId('weather-metric-icon-precipitation')).toBeVisible();
      expect(screen.getByTestId('weather-metric-value-precipitation')).toHaveTextContent('0 mm');
    });

    it('renders location name when set', () => {
      setupComponent(CurrentWeatherCard, {
        piniaOptions: {
          initialState: {
            weatherForecast: { currentWeather },
            geolocation: { location: MOCK_GEOLOCATION_DATA },
          },
        },
      });
      expect(screen.getByTestId('location-name')).toHaveTextContent('Amsterdam');
    });

    it('does not render location name when unset', () => {
      setupComponent(CurrentWeatherCard);

      expect(screen.queryByTestId('location-name')).not.toBeInTheDocument();
    });
  });

  describe('formatting', () => {
    it('formats current time as "Aug 27, 2025, 22:24"', async () => {
      setupComponent(CurrentWeatherCard, {
        piniaOptions: {
          initialState: { weatherForecast: { currentWeather } },
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('current-time')).toHaveTextContent('Aug 27, 2025, 22:24');
      });
    });
  });
});
