import { fetchWeatherForecast } from '@/services/weatherForecastService';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMessagesStore } from './useMessagesStore';
import type { CurrentWeather, DailyForecast, HourlyForecast } from '@/types/forecastService.types';

export const useWeatherForecastStore = defineStore('weatherForecast', () => {
  const loading = ref(false);
  const currentWeather = ref<CurrentWeather | null>(null);
  const dailyForecast = ref<DailyForecast[] | null>(null);
  const hourlyForecast = ref<HourlyForecast[] | null>(null);

  const fetchWeather = async (latitude: number, longitude: number) => {
    loading.value = true;

    const messagesStore = useMessagesStore();

    try {
      const { current, daily, hourly } = await fetchWeatherForecast(latitude, longitude);
      currentWeather.value = current;
      dailyForecast.value = daily;
      hourlyForecast.value = hourly;
    } catch {
      messagesStore.addError('Failed to fetch weather data');
    }

    loading.value = false;
  };

  return {
    loading,
    currentWeather,
    dailyForecast,
    hourlyForecast,
    fetchWeather,
  };
});
