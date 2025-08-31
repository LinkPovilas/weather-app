import { setActivePinia, createPinia } from 'pinia';
import {
  mockGeolocation,
  mockPermission,
  MOCK_COORDINATES,
  MOCK_GEOLOCATION_DATA,
} from '../mocks/useGeolocationStore.mock';

vi.mock('@/services/geolocationService');

vi.mock('@vueuse/core', () => ({
  useGeolocation: vi.fn(),
  usePermission: vi.fn(),
}));

import { useGeolocationStore } from '../../src/stores/useGeolocationStore';
import {
  fetchGeolocationByCoordinates,
  fetchGeolocationByIpAddress,
  fetchGeolocationByQuery,
} from '@/services/geolocationService';
import { useMessagesStore } from '../../src/stores/useMessagesStore';

describe('useGeolocationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      mockGeolocation();
      mockPermission();
      const geolocationStore = useGeolocationStore();

      expect(geolocationStore.loading).toBe(false);
      expect(geolocationStore.location).toEqual({
        latitude: null,
        longitude: null,
        name: null,
      });
      expect(geolocationStore.isGeolocationSupported).toBe(true);
      expect(geolocationStore.geolocationPermission).toBe('prompt');
    });
  });

  describe('fetchGeneralLocation', () => {
    it('should update location', async () => {
      mockGeolocation();
      vi.mocked(fetchGeolocationByIpAddress).mockResolvedValue(MOCK_GEOLOCATION_DATA);
      const geolocationStore = useGeolocationStore();

      const fetchPromise = geolocationStore.fetchGeneralLocation();

      expect(geolocationStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchGeolocationByIpAddress).toHaveBeenCalledOnce();
      expect(geolocationStore.location).toEqual(MOCK_GEOLOCATION_DATA);
      expect(geolocationStore.loading).toBe(false);
    });

    it('should handle fetch failure', async () => {
      mockGeolocation();
      vi.mocked(fetchGeolocationByIpAddress).mockRejectedValue(
        new Error('Failed to fetch location'),
      );
      const geolocationStore = useGeolocationStore();
      const addErrorSpy = vi.spyOn(useMessagesStore(), 'addError');

      const fetchPromise = geolocationStore.fetchGeneralLocation();

      expect(geolocationStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchGeolocationByIpAddress).toHaveBeenCalledOnce();
      expect(addErrorSpy).toHaveBeenCalledExactlyOnceWith('Failed to get your location');
      expect(geolocationStore.location).toEqual({
        latitude: null,
        longitude: null,
        name: null,
      });
      expect(geolocationStore.loading).toBe(false);
    });
  });

  describe('fetchUserLocation', () => {
    it('should update location', async () => {
      mockGeolocation({ coords: MOCK_COORDINATES });
      mockPermission({ state: 'granted' });
      vi.mocked(fetchGeolocationByCoordinates).mockResolvedValue({
        name: MOCK_GEOLOCATION_DATA.name,
      });
      const geolocationStore = useGeolocationStore();

      const fetchPromise = geolocationStore.fetchUserLocation();

      expect(geolocationStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchGeolocationByCoordinates).toHaveBeenCalledExactlyOnceWith(
        MOCK_COORDINATES.latitude,
        MOCK_COORDINATES.longitude,
      );
      expect(geolocationStore.location).toEqual(MOCK_GEOLOCATION_DATA);
      expect(geolocationStore.loading).toBe(false);
    });

    it('should handle permission denied', async () => {
      mockPermission({ state: 'denied' });
      const geolocationStore = useGeolocationStore();

      geolocationStore.fetchUserLocation();

      expect(fetchGeolocationByCoordinates).not.toHaveBeenCalled();
      expect(geolocationStore.location).toEqual({
        latitude: null,
        longitude: null,
        name: null,
      });
      expect(geolocationStore.loading).toBe(false);
    });

    it('should handle fetch failure', async () => {
      mockGeolocation({ coords: MOCK_COORDINATES });
      mockPermission({ state: 'granted' });
      vi.mocked(fetchGeolocationByCoordinates).mockRejectedValue(
        new Error('Failed to fetch location'),
      );
      const geolocationStore = useGeolocationStore();
      const addErrorSpy = vi.spyOn(useMessagesStore(), 'addError');

      const fetchPromise = geolocationStore.fetchUserLocation();

      expect(geolocationStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchGeolocationByCoordinates).toHaveBeenCalledOnce();
      expect(addErrorSpy).toHaveBeenCalledExactlyOnceWith('Failed to get your location');
      expect(geolocationStore.location).toEqual({
        latitude: null,
        longitude: null,
        name: null,
      });
      expect(geolocationStore.loading).toBe(false);
    });
  });

  describe('searchLocation', () => {
    it('should update location', async () => {
      vi.mocked(fetchGeolocationByQuery).mockResolvedValue(MOCK_GEOLOCATION_DATA);
      const geolocationStore = useGeolocationStore();

      const fetchPromise = geolocationStore.searchLocation('Amsterdam');

      expect(geolocationStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchGeolocationByQuery).toHaveBeenCalledExactlyOnceWith('Amsterdam');
      expect(geolocationStore.location).toEqual(MOCK_GEOLOCATION_DATA);
      expect(geolocationStore.loading).toBe(false);
    });

    it('should handle fetch failure', async () => {
      vi.mocked(fetchGeolocationByQuery).mockRejectedValue(new Error('Failed to fetch location'));
      const geolocationStore = useGeolocationStore();

      const fetchPromise = geolocationStore.searchLocation('');
      const addErrorSpy = vi.spyOn(useMessagesStore(), 'addError');

      expect(geolocationStore.loading).toBe(true);
      await fetchPromise;
      expect(fetchGeolocationByQuery).toHaveBeenCalledOnce();
      expect(addErrorSpy).toHaveBeenCalledExactlyOnceWith('Failed to get your location');
      expect(geolocationStore.location).toEqual({
        latitude: null,
        longitude: null,
        name: null,
      });
      expect(geolocationStore.loading).toBe(false);
    });
  });
});
