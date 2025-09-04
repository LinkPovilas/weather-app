<script setup lang="ts">
import { VisXYContainer, VisArea, VisScatter, VisAxis } from '@unovis/vue';
import { useWeatherForecastStore } from '@/stores/useWeatherForecastStore';
import { computed } from 'vue';
import { isSameHour } from '@/utils/timeUtils';
import { useDate } from 'vuetify';
import CircularProgressBar from '../CircularProgressBar.vue';
import NoDataContentText from './NoDataContentText.vue';

const weatherStore = useWeatherForecastStore();

const date = useDate();

type ChartData = {
  index: number;
  temperature: number;
  precipitationProbability: number;
  time: string;
};

const nowPoint = computed(() => {
  const currentTime = weatherStore.currentWeather?.time || new Date().toISOString();
  return weatherStore.hourlyForecast?.find((item) => item && isSameHour(item.time, currentTime));
});

const hourlyForecast = computed(() => weatherStore.hourlyForecast || []);

const chartData = computed<ChartData[]>(() => {
  const currentNowPoint = nowPoint.value;

  const nowPointIndex =
    currentNowPoint && hourlyForecast.value.length > 0
      ? hourlyForecast.value.findIndex((item) => isSameHour(item.time, currentNowPoint.time))
      : 0;

  const startIndex = Math.max(0, nowPointIndex - 1);
  const endIndex = Math.min(hourlyForecast.value.length, startIndex + 9);
  const result = hourlyForecast.value.slice(startIndex, endIndex);

  return result.map((item, index) => ({
    index,
    temperature: item.temperature,
    precipitationProbability: item.precipitationProbability,
    time: item.time,
  }));
});

const tickValues = computed(() => {
  return chartData.value.map((_, index) => index);
});

const tickFormat = (value: number): string => {
  const dataPoint = chartData.value?.[value];

  if (!dataPoint?.time) {
    return '';
  }

  const currentNowPoint = nowPoint.value;
  if (currentNowPoint && isSameHour(dataPoint.time, currentNowPoint.time)) {
    return 'Now';
  }
  return date.format(dataPoint.time, 'fullTime24h');
};

const x = (d: ChartData) => d.index;
const y = (d: ChartData) => d.temperature;

const temperatureEveryTwoHours = (d: ChartData, i: number): string => {
  return i % 2 === 0 ? `${d.temperature}°` : '';
};

const isHourlyForecastEmpty = computed(
  () => !weatherStore.hourlyForecast || weatherStore.hourlyForecast.length === 0,
);
</script>

<template>
  <v-card class="fill-height">
    <CircularProgressBar v-if="weatherStore.loading" />

    <template v-else>
      <v-card-title>Hourly Temperature Forecast</v-card-title>

      <svg width="0" height="0" style="position: absolute">
        <defs>
          <linearGradient id="temperatureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.4); stop-opacity: 1" />
            <stop offset="50%" style="stop-color: rgba(255, 255, 255, 0.2); stop-opacity: 1" />
            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0.05); stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>

      <template v-if="isHourlyForecastEmpty">
        <NoDataContentText />
      </template>

      <template v-else>
        <v-card-text
          class="d-flex justify-center align-center fill-height"
          data-testid="hourly-temperature-forecast-chart"
        >
          <VisXYContainer v-if="chartData.length" :data="chartData" :margin="{ bottom: 20 }">
            <VisArea
              curveType="basis"
              :x="x"
              :y="y"
              :minHeight="1"
              color="url(#temperatureGradient)"
            />
            <VisScatter
              :x="x"
              :y="y"
              :size="8"
              :label="temperatureEveryTwoHours"
              color="none"
              labelColor="white"
              labelPosition="top"
              :labelFontSize="12"
            />
            <VisAxis
              type="x"
              :tickLine="undefined"
              :gridLine="false"
              :tickFormat="tickFormat"
              :tickValues="tickValues"
              :tickTextColor="'white'"
            />
          </VisXYContainer>
        </v-card-text>
      </template>
    </template>
  </v-card>
</template>
