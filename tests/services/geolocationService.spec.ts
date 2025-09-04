import axios from '../../src/services/axios';
import {
  MOCK_IP_INFO_GEOLOCATION_RESPONSE,
  MOCK_OPEN_METEO_GEOLOCATION_RESPONSE,
  MOCK_OPEN_STREET_MAP_GEOLOCATION_RESPONSE,
} from '../mocks/geolocationService.mock';
import {
  fetchGeolocationByCoordinates,
  fetchGeolocationByIpAddress,
  fetchGeolocationByQuery,
  IP_INFO_GEOLOCATION_API_URL,
  OPEN_METEO_GEOLOCATION_API_URL,
  OPEN_STREET_MAP_GEOLOCATION_API_URL,
} from '../../src/services/geolocationService';
import { MOCK_COORDINATES, MOCK_GEOLOCATION_DATA } from '../mocks/useGeolocationStore.mock';

vi.mock('../../src/services/axios');

describe('geolocationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchGeolocationByIpAddress', () => {
    it('should fetch geolocation by ip address', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: MOCK_IP_INFO_GEOLOCATION_RESPONSE,
        status: 200,
        statusText: 'OK',
      });

      const result = await fetchGeolocationByIpAddress();

      expect(axios.get).toHaveBeenCalledExactlyOnceWith(IP_INFO_GEOLOCATION_API_URL);
      expect(result).toEqual(MOCK_GEOLOCATION_DATA);
    });

    it('should throw an error if the response status is not 200', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: MOCK_IP_INFO_GEOLOCATION_RESPONSE,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(fetchGeolocationByIpAddress()).rejects.toThrow(
        'Failed to get city from ip address. Response status: 400',
      );
    });

    it('should throw an error if the response data is not valid', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: null,
        status: 200,
        statusText: 'OK',
      });

      await expect(fetchGeolocationByIpAddress()).rejects.toThrow('No data found for ip address');
    });
  });

  describe('fetchGeolocationByCoordinates', () => {
    const { latitude, longitude } = MOCK_COORDINATES;

    it('should fetch geolocation by coordinates', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: MOCK_OPEN_STREET_MAP_GEOLOCATION_RESPONSE,
        status: 200,
        statusText: 'OK',
      });

      const result = await fetchGeolocationByCoordinates(latitude, longitude);

      expect(axios.get).toHaveBeenCalledExactlyOnceWith(OPEN_STREET_MAP_GEOLOCATION_API_URL, {
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
        params: { lat: latitude, lon: longitude, format: 'json', addressdetails: 1, zoom: 13 },
      });
      expect(result).toEqual({ name: MOCK_GEOLOCATION_DATA.name });
    });

    it('should return location name as unknown', async () => {
      const { latitude, longitude } = { latitude: -1, longitude: -1 };
      vi.mocked(axios.get).mockResolvedValue({
        data: { address: {} },
        status: 200,
        statusText: 'OK',
      });

      const result = await fetchGeolocationByCoordinates(latitude, longitude);

      expect(axios.get).toHaveBeenCalledExactlyOnceWith(OPEN_STREET_MAP_GEOLOCATION_API_URL, {
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
        params: { lat: latitude, lon: longitude, format: 'json', addressdetails: 1, zoom: 13 },
      });
      expect(result).toEqual({ name: 'Unknown' });
    });

    it('should throw an error if the response status is not 200', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: MOCK_IP_INFO_GEOLOCATION_RESPONSE,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(fetchGeolocationByCoordinates(latitude, longitude)).rejects.toThrow(
        'Failed to get city from coordinates. Response status: 400',
      );
    });

    it('should throw an error if the response data is not valid', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: { error: 'Unable to geocode' },
        status: 200,
        statusText: 'OK',
      });

      await expect(fetchGeolocationByCoordinates(latitude, longitude)).rejects.toThrow(
        'No data found for these coordinates',
      );
    });
  });

  describe('fetchGeolocationByQuery', () => {
    it('should fetch geolocation by query', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: MOCK_OPEN_METEO_GEOLOCATION_RESPONSE,
        status: 200,
        statusText: 'OK',
      });

      const result = await fetchGeolocationByQuery('Amsterdam');

      expect(axios.get).toHaveBeenCalledExactlyOnceWith(OPEN_METEO_GEOLOCATION_API_URL, {
        params: { name: 'Amsterdam', count: 1, language: 'en', format: 'json' },
      });
      expect(result).toEqual(MOCK_GEOLOCATION_DATA);
    });

    it('should throw an error if the response status is not 200', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: { error: 'Unable to geocode' },
        status: 400,
        statusText: 'OK',
      });

      await expect(fetchGeolocationByQuery('Amsterdam')).rejects.toThrow(
        'Failed to get geo location by city. Response status: 400',
      );
    });

    it('should throw an error if the response data is not valid', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: { error: 'Unable to geocode' },
        status: 200,
        statusText: 'OK',
      });

      await expect(fetchGeolocationByQuery('Amsterdam')).rejects.toThrow(
        'No data returned with this query',
      );
    });
  });
});
