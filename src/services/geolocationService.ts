import { HttpStatusCode } from 'axios';
import axios from './axios';
import type {
  OpenStreetMapGeolocationResponse,
  IpInfoGeolocationResponse,
  OpenMeteoGeolocationResponse,
} from '@/types/geolocationService.types';

export const IP_INFO_GEOLOCATION_API_URL = `${import.meta.env.VITE_IP_INFO_GEOLOCATION_API_BASE_URL}/json`;
export const OPEN_STREET_MAP_GEOLOCATION_API_URL = `${import.meta.env.VITE_OPEN_STREET_MAP_GEOLOCATION_API_BASE_URL}/reverse`;
export const OPEN_METEO_GEOLOCATION_API_URL = `${import.meta.env.VITE_OPEN_METEO_GEOLOCATION_API_BASE_URL}/v1/search`;

export const fetchGeolocationByIpAddress = async () => {
  const response = await axios.get<IpInfoGeolocationResponse>(IP_INFO_GEOLOCATION_API_URL);
  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(`Failed to get city from ip address: ${response.status}`);
  }

  if (!response.data) {
    throw new Error('No data found for ip address');
  }

  const { loc, city } = response.data;
  const [latitude, longitude] = loc.split(',');

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
    name: city,
  };
};

export const fetchGeolocationByCoordinates = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    format: 'json',
    addressdetails: 1,
    zoom: 13,
  };

  const response = await axios.get<OpenStreetMapGeolocationResponse>(
    OPEN_STREET_MAP_GEOLOCATION_API_URL,
    {
      params,
      headers: {
        'User-Agent': 'WeatherApp/1.0',
      },
    },
  );

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(`Failed to get city from coordinates: ${response.status}`);
  }

  const data = response.data;

  if (!data || !data.address) {
    throw new Error('No data found for these coordinates');
  }

  const { address } = data;
  const name = address.city || address.town || address.village || address.municipality || 'Unknown';

  return { name };
};

export const fetchGeolocationByQuery = async (query: string) => {
  const params = {
    name: query,
    count: 1,
    language: 'en',
    format: 'json',
  };

  const response = await axios.get<OpenMeteoGeolocationResponse>(OPEN_METEO_GEOLOCATION_API_URL, {
    params,
  });
  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(`Failed to get geo location by city: ${response.status}`);
  }

  if (!response.data || !response.data.results) {
    throw new Error('No data returned with this query');
  }

  const { results } = response.data;
  const { latitude, longitude, name } = results[0];

  return {
    latitude,
    longitude,
    name,
  };
};
