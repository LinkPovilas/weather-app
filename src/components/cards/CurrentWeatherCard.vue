<script setup lang="ts">
import { useGeolocationStore } from '@/stores/useGeolocationStore';
import { useWeatherForecastStore } from '@/stores/useWeatherForecastStore';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useDate } from 'vuetify';
import CircularProgressBar from '../CircularProgressBar.vue';
import { getWeatherDescription, getWeatherIcon } from '@/utils/weatherUtils';
import { toKebabCase } from 'vuetify/lib/util/helpers.mjs';
import NoDataContentText from './NoDataContentText.vue';

const weatherStore = useWeatherForecastStore();
const { loading, currentWeather } = storeToRefs(weatherStore);
const geolocationStore = useGeolocationStore();
const { location } = storeToRefs(geolocationStore);

const date = useDate();

const getCurrentTime = () => date.format(new Date(), 'fullDateTime24h');

const weatherMetrics = computed(() => [
  {
    icon: 'wi:barometer',
    label: 'Pressure',
    value: `${currentWeather.value?.pressure} hPa`,
  },
  {
    icon: 'wi:humidity',
    label: 'Humidity',
    value: `${currentWeather.value?.humidity}%`,
  },
  {
    icon: 'wi:strong-wind',
    label: 'Wind Speed',
    value: `${currentWeather.value?.windSpeed} km/h`,
  },
  {
    icon: 'wi:sleet',
    label: 'Precipitation',
    value: `${currentWeather.value?.precipitation} mm`,
  },
]);
</script>

<template>
  <v-card class="fill-height d-flex flex-column">
    <CircularProgressBar v-if="loading" />

    <template v-else>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Current Weather</span>
        <div v-if="location?.name" class="d-flex align-center">
          <v-icon icon="mdi-map-marker" size="x-small" />
          <span class="ml-1 text-caption" data-testid="location-name">{{ location.name }}</span>
        </div>
      </v-card-title>
      <v-card-subtitle v-if="currentWeather" data-testid="current-time">{{
        getCurrentTime()
      }}</v-card-subtitle>

      <template v-if="!currentWeather">
        <NoDataContentText />
      </template>

      <template v-else>
        <v-card-text class="flex-grow-1 d-flex align-center">
          <v-row class="d-flex text-center">
            <v-col cols="12" class="d-flex justify-center align-center">
              <Icon
                :icon="getWeatherIcon(currentWeather?.weatherCode)"
                class="text-h1"
                data-testid="current-weather-icon"
              />
              <div class="d-flex flex-column align-center">
                <p class="text-h4 font-weight-bold" data-testid="current-weather-temperature">
                  {{ currentWeather?.temperature }} °C
                </p>
                <p class="mt-n1 pa-1 text-medium-emphasis" data-testid="current-weather-feels-like">
                  Feels like {{ currentWeather?.apparentTemperature }} °C
                </p>
              </div>
            </v-col>

            <v-col cols="12">
              <p class="text-subtitle-1 text-capitalize" data-testid="current-weather-description">
                {{ getWeatherDescription(currentWeather?.weatherCode) }}
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
