<script setup lang="ts">
import { useGeolocationStore } from '@/stores/useGeolocationStore';
import { useWeatherForecastStore } from '@/stores/useWeatherForecastStore';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { useDate } from 'vuetify';
import CircularProgressBar from '../CircularProgressBar.vue';
import { getWeatherDescription, getWeatherIcon } from '@/utils/weatherUtils';
import { toKebabCase } from 'vuetify/lib/util/helpers.mjs';
import NoDataContentText from './NoDataContentText.vue';

const weatherStore = useWeatherForecastStore();
const geolocationStore = useGeolocationStore();
const date = useDate();

const getCurrentTime = () => date.format(new Date(), 'fullDateTime24h');

const weatherMetrics = computed(() => [
  {
    icon: 'wi:barometer',
    label: 'Pressure',
    value: `${weatherStore.currentWeather?.pressure} hPa`,
  },
  {
    icon: 'wi:humidity',
    label: 'Humidity',
    value: `${weatherStore.currentWeather?.humidity}%`,
  },
  {
    icon: 'wi:strong-wind',
    label: 'Wind Speed',
    value: `${weatherStore.currentWeather?.windSpeed} km/h`,
  },
  {
    icon: 'wi:sleet',
    label: 'Precipitation',
    value: `${weatherStore.currentWeather?.precipitation} mm`,
  },
]);
</script>

<template>
  <v-card class="fill-height d-flex flex-column">
    <CircularProgressBar v-if="weatherStore.loading" />

    <template v-else>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Current Weather</span>
        <div v-if="geolocationStore.location.name" class="d-flex align-center">
          <v-icon icon="mdi-map-marker" size="x-small" />
          <span class="ml-1 text-caption" data-testid="location-name">{{
            geolocationStore.location.name
          }}</span>
        </div>
      </v-card-title>
      <v-card-subtitle v-if="weatherStore.currentWeather" data-testid="current-time">{{
        getCurrentTime()
      }}</v-card-subtitle>

      <template v-if="!weatherStore.currentWeather">
        <NoDataContentText />
      </template>

      <template v-else>
        <v-card-text class="flex-grow-1 d-flex align-center">
          <v-row class="d-flex text-center">
            <v-col cols="12" class="d-flex justify-center align-center">
              <Icon
                :icon="getWeatherIcon(weatherStore.currentWeather.weatherCode)"
                class="text-h1"
                data-testid="current-weather-icon"
              />
              <div class="d-flex flex-column align-center">
                <p class="text-h4 font-weight-bold" data-testid="current-weather-temperature">
                  {{ weatherStore.currentWeather.temperature }} °C
                </p>
                <p class="mt-n1 pa-1 text-medium-emphasis" data-testid="current-weather-feels-like">
                  Feels like {{ weatherStore.currentWeather.apparentTemperature }} °C
                </p>
              </div>
            </v-col>

            <v-col cols="12">
              <p class="text-subtitle-1 text-capitalize" data-testid="current-weather-description">
                {{ getWeatherDescription(weatherStore.currentWeather.weatherCode) }}
              </p>
            </v-col>

            <v-col
              cols="3"
              v-for="(metric, idx) in weatherMetrics"
              :key="idx"
              class="d-flex flex-column align-center"
            >
              <Icon
                :icon="metric.icon"
                class="text-h4"
                :data-testid="toKebabCase(`weather-metric-icon-${metric.label}`)"
              />
              <p class="text-caption mt-1">{{ metric.label }}</p>
              <p :data-testid="toKebabCase(`weather-metric-value-${metric.label}`)">
                {{ metric.value }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
    </template>
  </v-card>
</template>
