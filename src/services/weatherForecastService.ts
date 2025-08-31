import { HttpStatusCode } from 'axios';
import axios from './axios';
import type {
  OpenMeteoWeatherForecastResponse,
  WeatherForecastData,
  WeatherForecastParameters,
} from '@/types/forecastService.types';

export const WEATHER_FORECAST_API_URL = `${import.meta.env.VITE_WEATHER_API_BASE_URL}/v1/forecast`;

export const fetchWeatherForecast = async (
  latitude: number,
  longitude: number,
): Promise<WeatherForecastData> => {
  const params: WeatherForecastParameters = {
    latitude,
    longitude,
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
      'daylight_duration',
    ],
    hourly: ['temperature_2m', 'precipitation_probability', 'weather_code', 'wind_speed_10m'],
    current: [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'surface_pressure',
      'precipitation',
      'wind_speed_10m',
      'relative_humidity_2m',
    ],
    timezone: 'auto',
  };

  const response = await axios.get<OpenMeteoWeatherForecastResponse>(WEATHER_FORECAST_API_URL, {
    params,
  });
  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const { current, daily, hourly } = response.data;

  const currentWeather = {
    time: current.time,
    weatherCode: current.weather_code,
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    pressure: current.surface_pressure,
    precipitation: current.precipitation,
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
  };

  const dailyForecast = daily.time.map((time, index) => ({
    weatherCode: daily.weather_code[index],
    lowTemperature: daily.temperature_2m_min[index],
    highTemperature: daily.temperature_2m_max[index],
    time,
    sunrise: daily.sunrise[index],
    sunset: daily.sunset[index],
    daylightDuration: daily.daylight_duration[index],
  }));

  const hourlyForecast = hourly.time.map((time, index) => ({
    temperature: hourly.temperature_2m[index],
    precipitationProbability: hourly.precipitation_probability[index],
    time,
  }));

  return {
    current: currentWeather,
    daily: dailyForecast,
    hourly: hourlyForecast,
  };
};
