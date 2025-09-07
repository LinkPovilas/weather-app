<script setup lang="ts">
import { useWeatherForecastStore } from '@/stores/useWeatherForecastStore';
import { useDate } from 'vuetify';
import CircularProgressBar from '@/components/CircularProgressBar.vue';
import NoDataContentText from '@/components/cards/NoDataContentText.vue';
import dayjs from 'dayjs';

const TIME_RANGE = { MIDNIGHT: 0, NEXT_DAY: 86400 };

const weatherStore = useWeatherForecastStore();
const date = useDate();

const convertToSecondsFromMidnight = (dateTime: string) => {
  const time = dayjs(dateTime);
  const startOfDay = time.startOf('day');
  return time.diff(startOfDay, 'second');
};

const formatDaylightDuration = (durationInSeconds: number) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};
</script>

<template>
  <v-card class="fill-height d-flex flex-column">
    <circular-progress-bar v-if="weatherStore.loading" />

    <template v-else>
      <v-card-title>Daily Sunrise & Sunset</v-card-title>

      <template v-if="weatherStore.dailyForecast?.length === 0">
        <no-data-content-text />
      </template>

      <v-list v-else class="flex-grow-1 d-flex flex-column justify-space-around">
        <v-list-item
          v-for="daily in weatherStore.dailyForecast"
          :key="daily.time"
          class="justify-space-around align-center"
          data-testid="daily-sunrise-sunset-item"
        >
          <v-row align="center" no-gutters class="w-100">
            <v-col cols="2" class="text-left">
              <p class="text-body-2 font-weight-medium" data-testid="daily-sunrise-sunset-weekday">
                {{ date.format(daily.time, 'weekdayShort') }}
              </p>
            </v-col>

            <v-col cols="2" class="text-center">
              <p class="text-body-2 text-medium-emphasis" data-testid="daily-sunrise-time">
                {{ date.format(daily.sunrise, 'fullTime24h') }}
              </p>
            </v-col>

            <v-col cols="6" class="px-3">
              <v-tooltip
                :text="`Daylight duration: ${formatDaylightDuration(daily.daylightDuration)}`"
                location="top"
              >
                <template v-slot:activator="{ props }">
                  <div v-bind="props">
                    <v-range-slider
                      :model-value="[
                        convertToSecondsFromMidnight(daily.sunrise),
                        convertToSecondsFromMidnight(daily.sunset),
                      ]"
                      :min="TIME_RANGE.MIDNIGHT"
                      :max="TIME_RANGE.NEXT_DAY"
                      :step="60"
                      :track-color="'grey-darken-3'"
                      data-testid="daily-daylight-duration-range"
                      thumb-size="0"
                      track-size="8"
                      hide-details
                      readonly
                    ></v-range-slider>
                  </div>
                </template>
              </v-tooltip>
            </v-col>

            <v-col cols="2" class="text-center">
              <p class="text-body-2 text-medium-emphasis" data-testid="daily-sunset-time">
                {{ date.format(daily.sunset, 'fullTime24h') }}
              </p>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </template>
  </v-card>
</template>
