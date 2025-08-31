import {
  fetchWeatherForecast,
  WEATHER_FORECAST_API_URL,
} from '../../src/services/weatherForecastService';
import axios from '../../src/services/axios';
import {
  MOCK_WEATHER_DATA,
  MOCK_WEATHER_DATA_RESPONSE,
  PARAMETERS,
} from '../mocks/weatherForecastService.mock';

vi.mock('../../src/services/axios');

describe('weatherForecastService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchWeatherForecast', () => {
    const latitude = 52.52;
    const longitude = 13.41;

    it('should fetch weather data', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: MOCK_WEATHER_DATA_RESPONSE,
        status: 200,
        statusText: 'OK',
      });

      const result = await fetchWeatherForecast(latitude, longitude);

      expect(axios.get).toHaveBeenCalledExactlyOnceWith(WEATHER_FORECAST_API_URL, {
        params: PARAMETERS,
      });
      expect(result).toEqual(MOCK_WEATHER_DATA);
    });

    it('should throw an error if the response status is not 200', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: MOCK_WEATHER_DATA_RESPONSE,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(fetchWeatherForecast(latitude, longitude)).rejects.toThrow(
        'Weather API error: 400',
      );
    });
  });
});
