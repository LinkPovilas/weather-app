<script setup lang="ts">
import SearchBar from './components/SearchBar.vue';
import CurrentWeatherWidget from './components/cards/CurrentWeatherCard.vue';
import DailyForecastCard from './components/cards/DailyForecastCard.vue';
import HourlyTemperatureForecast from './components/cards/HourlyTemperatureForecastCard.vue';
import MapCard from './components/cards/MapCard.vue';
import DailySunriseAndSunsetCard from './components/cards/DailySunriseAndSunsetCard.vue';
import AppToast from './components/AppToast.vue';
import { onMounted, toRef, watch } from 'vue';
import { useGeolocationStore } from '@/stores/useGeolocationStore';
import { useWeatherForecastStore } from './stores/useWeatherForecastStore';

const geolocationStore = useGeolocationStore();
const weatherStore = useWeatherForecastStore();

watch(
  toRef(geolocationStore, 'location'),
  (newLocation) => {
    if (newLocation.latitude && newLocation.longitude) {
      weatherStore.fetchWeather(newLocation.latitude, newLocation.longitude);
    }
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  geolocationStore.fetchGeneralLocation();
});
</script>

<template>
  <v-app>
    <v-main class="pa-4">
      <AppToast></AppToast>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="4" xl="4">
            <SearchBar />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-row>
              <v-col cols="12" lg="4" md="6"><CurrentWeatherWidget /></v-col>
              <v-col cols="12" lg="5" md="6"><MapCard /></v-col>
              <v-col cols="12" lg="3" md="6"><DailySunriseAndSunsetCard /></v-col>
              <v-col cols="12" lg="4" md="6"><DailyForecastCard /></v-col>
              <v-col cols="12" lg="8" md="12"><HourlyTemperatureForecast /></v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
