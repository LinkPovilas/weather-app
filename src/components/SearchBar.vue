<script setup lang="ts">
import { useGeolocationStore } from '@/stores/useGeolocationStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const searchText = ref('');

const geolocationStore = useGeolocationStore();
const { loading, isGeolocationSupported, geolocationPermission } = storeToRefs(geolocationStore);

const mapMarkerConfig = computed(() => {
  if (!isGeolocationSupported.value) {
    return {
      icon: 'mdi-map-marker-off',
      color: 'grey-darken-1',
      tooltip: 'Geolocation is not supported in your browser',
    };
  }

  const permission = geolocationPermission.value;

  if (permission === 'granted') {
    return { icon: 'mdi-map-marker', color: 'primary', tooltip: 'Use my current location' };
  }

  if (permission === 'prompt') {
    return {
      icon: 'mdi-map-marker-question',
      color: 'amber-darken-2',
      tooltip: 'Allow location access',
    };
  }

  return {
    icon: 'mdi-map-marker-remove',
    color: 'error',
    tooltip: 'Location denied. Allow in browser settings.',
  };
});

const LETTERS_SPACES = /^[A-Za-z\s]*$/;

const rules = {
  lettersAndSpaces: (v: string) => LETTERS_SPACES.test(v) || 'Only letters and spaces are allowed',
};

const allowOnlyLetters = (event: KeyboardEvent) => {
  if (!LETTERS_SPACES.test(event.key)) {
    event.preventDefault();
  }
};

const onClear = () => {
  searchText.value = '';
};

const onUseMyLocation = () => {
  if (!isGeolocationSupported.value || geolocationPermission.value === 'denied') {
    return;
  }

  geolocationStore.fetchUserLocation();
  onClear();
};

const onSearch = async () => {
  if (!searchText.value.trim() || !LETTERS_SPACES.test(searchText.value)) {
    return;
  }
  await geolocationStore.searchLocation(searchText.value);
};
</script>

<template>
  <v-text-field
    :loading="loading"
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
