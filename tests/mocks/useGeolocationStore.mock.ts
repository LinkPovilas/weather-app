import { type Mock, vi } from 'vitest';
import { ref } from 'vue';
import { computed } from 'vue';

import { useGeolocation, usePermission } from '@vueuse/core';

const mockUseGeolocation = vi.mocked(useGeolocation);
const mockUsePermission = vi.mocked(usePermission);

export const MOCK_COORDINATES = {
  accuracy: 10,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  latitude: 52.3068,
  longitude: 4.9453,
  speed: null,
  toJSON: vi.fn(),
};

export const MOCK_GEOLOCATION_DATA = {
  name: 'Amsterdam',
  latitude: 52.3068,
  longitude: 4.9453,
};

export const mockGeolocation = ({
  isSupported = true,
  coords = {
    latitude: Infinity,
    longitude: Infinity,
    altitude: null,
    accuracy: 0,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    toJSON: vi.fn(),
  },
}: {
  isSupported?: boolean;
  coords?: GeolocationCoordinates;
} = {}) => {
  mockUseGeolocation.mockReturnValue({
    isSupported: computed(() => isSupported),
    coords: ref(coords),
    locatedAt: ref(null),
    error: ref(null),
    resume: vi.fn(),
    pause: vi.fn(),
  });
};

export const mockPermission = ({ state = 'prompt' }: { state?: PermissionState } = {}) => {
  (mockUsePermission as Mock).mockReturnValue(ref(state));
};
