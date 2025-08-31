export type WeatherForecastParameters = {
  latitude: number;
  longitude: number;
  daily: string[];
  hourly: string[];
  current: string[];
  timezone: string;
};

export type CurrentWeather = {
  time: string;
  weatherCode: number;
  temperature: number;
  apparentTemperature: number;
  pressure: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
};

export type DailyForecast = {
  weatherCode: number;
  lowTemperature: number;
  highTemperature: number;
  time: string;
  sunrise: string;
  sunset: string;
  daylightDuration: number;
};

export type HourlyForecast = {
  temperature: number;
  precipitationProbability: number;
  time: string;
};

export type WeatherForecastData = {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
};

export type OpenMeteoWeatherForecastResponse = {
  current: {
    time: string;
    weather_code: number;
    temperature_2m: number;
    apparent_temperature: number;
    surface_pressure: number;
    precipitation: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    sunrise: string[];
    sunset: string[];
    daylight_duration: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
};
