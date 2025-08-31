import { createPinia, setActivePinia } from 'pinia';
import { useWeatherForecastStore } from '../../src/stores/useWeatherForecastStore';
import { fetchWeatherForecast } from '@/services/weatherForecastService';
import { MOCK_WEATHER_DATA } from '../mocks/weatherForecastService.mock';
import { useMessagesStore } from '../../src/stores/useMessagesStore';

vi.mock('@/services/weatherForecastService');

describe('useWeatherForecastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const weatherForecastStore = useWeatherForecastStore();

      expect(weatherForecastStore.loading).toBe(false);
      expect(weatherForecastStore.currentWeather).toBeNull();
      expect(weatherForecastStore.dailyForecast).toBeNull();
      expect(weatherForecastStore.hourlyForecast).toBeNull();
    });
  });

  describe('fetchWeather', () => {
    it('should update weather data', async () => {
      const weatherForecastStore = useWeatherForecastStore();
      vi.mocked(fetchWeatherForecast).mockResolvedValue(MOCK_WEATHER_DATA);

      const fetchPromise = weatherForecastStore.fetchWeather(52.52, 13.41);

      expect(weatherForecastStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchWeatherForecast).toHaveBeenCalledOnce();
      expect(weatherForecastStore.currentWeather).toEqual(MOCK_WEATHER_DATA.current);
      expect(weatherForecastStore.dailyForecast).toEqual(MOCK_WEATHER_DATA.daily);
      expect(weatherForecastStore.hourlyForecast).toEqual(MOCK_WEATHER_DATA.hourly);
      expect(weatherForecastStore.loading).toBe(false);
    });

    it('should handle fetch failure', async () => {
      const weatherForecastStore = useWeatherForecastStore();
      const addErrorSpy = vi.spyOn(useMessagesStore(), 'addError');
      vi.mocked(fetchWeatherForecast).mockRejectedValue(new Error('Failed to fetch weather data'));

      const fetchPromise = weatherForecastStore.fetchWeather(52.52, 13.41);

      expect(weatherForecastStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchWeatherForecast).toHaveBeenCalledOnce();
      expect(addErrorSpy).toHaveBeenCalledExactlyOnceWith('Failed to fetch weather data');
      expect(weatherForecastStore.currentWeather).toBeNull();
      expect(weatherForecastStore.dailyForecast).toBeNull();
      expect(weatherForecastStore.hourlyForecast).toBeNull();
      expect(weatherForecastStore.loading).toBe(false);
    });
  });
});
