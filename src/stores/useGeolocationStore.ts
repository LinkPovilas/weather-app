import {
  fetchGeolocationByCoordinates,
  fetchGeolocationByIpAddress,
  fetchGeolocationByQuery,
} from '@/services/geolocationService';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMessagesStore } from './useMessagesStore';
import { useGeolocation, usePermission } from '@vueuse/core';

type Location = {
  latitude: number | null;
  longitude: number | null;
  name: string | null;
};

export const useGeolocationStore = defineStore('geolocation', () => {
  const loading = ref(false);
  const location = ref<Location>({ latitude: null, longitude: null, name: null });

  const messagesStore = useMessagesStore();

  const geolocationPermission = usePermission('geolocation');

  const {
    isSupported: isGeolocationSupported,
    resume: resumeGeolocationTracking,
    coords,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000,
    immediate: true,
  });

  const updateLocation = (latitude: number, longitude: number, name: string) => {
    location.value.latitude = latitude;
    location.value.longitude = longitude;
    location.value.name = name;
  };

  const fetchGeneralLocation = async () => {
    loading.value = true;

    try {
      const { latitude, longitude, name } = await fetchGeolocationByIpAddress();
      updateLocation(latitude, longitude, name);
    } catch {
      messagesStore.addError('Failed to get your location');
    }

    loading.value = false;
  };

  const fetchUserLocation = async () => {
    loading.value = true;

    if (isGeolocationSupported.value && geolocationPermission.value !== 'denied') {
      resumeGeolocationTracking();
    }

    const { latitude, longitude } = coords.value;

    if (geolocationPermission.value === 'granted' && latitude !== Infinity) {
      try {
        const { name } = await fetchGeolocationByCoordinates(latitude, longitude);
        updateLocation(latitude, longitude, name);
      } catch {
        messagesStore.addError('Failed to get your location');
      }
    }

    loading.value = false;
  };

  const searchLocation = async (query: string) => {
    loading.value = true;

    try {
      const { latitude, longitude, name } = await fetchGeolocationByQuery(query);
      updateLocation(latitude, longitude, name);
    } catch {
      messagesStore.addError('Failed to get your location');
    }

    loading.value = false;
  };

  return {
    loading,
    location,
    isGeolocationSupported,
    geolocationPermission,
    fetchGeneralLocation,
    fetchUserLocation,
    searchLocation,
  };
});
