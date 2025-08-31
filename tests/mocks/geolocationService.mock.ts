import type {
  IpInfoGeolocationResponse,
  OpenMeteoGeolocationResponse,
  OpenStreetMapGeolocationResponse,
} from '../../src/types/geolocationService.types';
import { MOCK_GEOLOCATION_DATA } from './useGeolocationStore.mock';

export const MOCK_IP_INFO_GEOLOCATION_RESPONSE: IpInfoGeolocationResponse = {
  city: MOCK_GEOLOCATION_DATA.name,
  loc: `${MOCK_GEOLOCATION_DATA.latitude},${MOCK_GEOLOCATION_DATA.longitude}`,
};

export const MOCK_OPEN_STREET_MAP_GEOLOCATION_RESPONSE: OpenStreetMapGeolocationResponse = {
  address: {
    city: MOCK_GEOLOCATION_DATA.name,
  },
};

export const MOCK_OPEN_METEO_GEOLOCATION_RESPONSE: OpenMeteoGeolocationResponse = {
  results: [
    {
      name: MOCK_GEOLOCATION_DATA.name,
      latitude: MOCK_GEOLOCATION_DATA.latitude,
      longitude: MOCK_GEOLOCATION_DATA.longitude,
    },
  ],
};
