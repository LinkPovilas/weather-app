<script setup lang="ts">
import { useGeolocationStore } from '@/stores/useGeolocationStore';
import { computed, ref } from 'vue';

const searchText = ref('');

const geolocationStore = useGeolocationStore();
import { useDebounceFn } from '@vueuse/core';

const MAP_MARKER_CONFIGS = {
  UNSUPPORTED: {
    icon: 'mdi-map-marker-off',
    color: 'grey-darken-1',
    tooltip: 'Geolocation is not supported in your browser',
  },
  GRANTED: { icon: 'mdi-map-marker', color: 'primary', tooltip: 'Use my current location' },
  PROMPT: {
    icon: 'mdi-map-marker-question',
    color: 'amber-darken-2',
    tooltip: 'Allow location access',
  },
  DENIED: {
    icon: 'mdi-map-marker-remove',
    color: 'error',
    tooltip: 'Location denied. Allow in browser settings.',
  },
};

const mapMarkerConfig = computed(() => {
  if (!geolocationStore.isGeolocationSupported) {
    return MAP_MARKER_CONFIGS.UNSUPPORTED;
  }

  const permission = geolocationStore.geolocationPermission;
  return (
    MAP_MARKER_CONFIGS[permission?.toUpperCase() as keyof typeof MAP_MARKER_CONFIGS] ||
    MAP_MARKER_CONFIGS.DENIED
  );
});

const LETTERS_SPACES = /^[A-Za-z\s]*$/;

const rules = {
  lettersAndSpaces: (text: string) =>
    LETTERS_SPACES.test(text) || 'Only letters and spaces are allowed',
};

const allowOnlyLetters = (event: KeyboardEvent) => {
  if (!LETTERS_SPACES.test(event.key)) {
    event.preventDefault();
  }
};

const onClear = () => {
  searchText.value = '';
};

const fetchUserLocation = useDebounceFn(async () => {
  await geolocationStore.fetchUserLocation();
}, 500);

const onUseMyLocation = async () => {
  if (
    !geolocationStore.isGeolocationSupported ||
    geolocationStore.geolocationPermission === 'denied'
  ) {
    return;
  }

  await fetchUserLocation();
  onClear();
};

const searchForLocation = useDebounceFn(async () => {
  await geolocationStore.searchLocation(searchText.value);
}, 500);

const onSearch = async () => {
  if (!searchText.value.trim() || !LETTERS_SPACES.test(searchText.value)) {
    return;
  }
  await searchForLocation();
};
</script>

<template>
  <v-text-field
    :loading="geolocationStore.loading"
    :rules="[rules.lettersAndSpaces]"
    prepend-inner-icon="mdi-magnify"
    label="Search for a location"
    clear-icon="mdi-close-circle"
    v-model="searchText"
    @click:clear="onClear"
    @keydown.enter="onSearch"
    @keypress="allowOnlyLetters"
    variant="solo"
    density="compact"
    single-line
    clearable
  >
    <template #append-inner>
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            :aria-label="mapMarkerConfig.tooltip"
            :icon="mapMarkerConfig.icon"
            :color="mapMarkerConfig.color"
            @click="onUseMyLocation"
          />
        </template>
        {{ mapMarkerConfig.tooltip }}
      </v-tooltip>
    </template>
  </v-text-field>
</template>
