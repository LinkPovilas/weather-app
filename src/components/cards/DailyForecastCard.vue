<script setup lang="ts">
import { useWeatherForecastStore } from '@/stores/useWeatherForecastStore';
import { Icon } from '@iconify/vue';
import { useDate } from 'vuetify';
import CircularProgressBar from '@/components/CircularProgressBar.vue';
import { getWeatherDescription, getWeatherIcon } from '@/utils/weatherUtils';
import NoDataContentText from '@/components/cards/NoDataContentText.vue';

const weatherStore = useWeatherForecastStore();
const date = useDate();
</script>

<template>
  <v-card class="fill-height">
    <circular-progress-bar v-if="weatherStore.loading" />

    <template v-else>
      <v-card-title>Daily Forecast</v-card-title>

      <template v-if="weatherStore.dailyForecast?.length === 0">
        <no-data-content-text />
      </template>

      <v-list v-else bg-color="transparent" data-testid="daily-forecast-list">
        <template v-for="(daily, index) in weatherStore.dailyForecast" :key="index">
          <v-divider v-if="index > 0" data-testid="forecast-divider" />

          <v-list-item>
            <v-row align="center">
              <v-col cols="4" class="d-flex justify-start">
                <p class="text-body-2 font-weight-medium" data-testid="daily-forecast-date">
                  {{ date.format(daily.time, 'normalDateWithWeekday') }}
                </p>
              </v-col>

              <v-col cols="2" class="d-flex align-center justify-center">
                <v-tooltip
                  :text="getWeatherDescription(daily.weatherCode)"
                  location="top"
                  data-testid="daily-forecast-tooltip"
                >
                  <template v-slot:activator="{ props }">
                    <div v-bind="props" class="d-inline-block">
                      <icon
                        :icon="getWeatherIcon(daily.weatherCode)"
                        class="text-h3"
                        data-testid="daily-forecast-icon"
                      />
                    </div>
                  </template>
                </v-tooltip>
              </v-col>

              <v-col cols="3" class="d-flex align-center">
                <v-icon
                  icon="mdi-arrow-down"
                  size="small"
                  class="mr-1"
                  color="medium-emphasis"
                  data-testid="temperature-down-arrow"
                ></v-icon>
                <p
                  class="text-body-2 text-medium-emphasis"
                  data-testid="temperature-lowest-temperature"
                >
                  {{ daily.lowTemperature }}°
                </p>
              </v-col>

              <v-col cols="3" class="d-flex align-center">
                <v-icon
                  icon="mdi-arrow-up"
                  size="small"
                  class="mr-1"
                  color="high-emphasis"
                  data-testid="temperature-up-arrow"
                ></v-icon>
                <p class="text-body-2" data-testid="temperature-highest-temperature">
                  {{ daily.highTemperature }}°
                </p>
              </v-col>
            </v-row>
          </v-list-item>
        </template>
      </v-list>
    </template>
  </v-card>
</template>
