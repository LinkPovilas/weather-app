import { getWeatherDescription, getWeatherIcon } from '../../src/utils/weatherUtils';

describe('weatherUtils', () => {
  describe('getWeatherIcon', () => {
    it.each([
      [0, 'wi:day-sunny'],
      [1, 'wi:day-sunny'],
      [2, 'wi:day-cloudy'],
      [3, 'wi:cloudy'],
      [45, 'wi:fog'],
      [48, 'wi:fog'],
      [51, 'wi:sprinkle'],
      [53, 'wi:rain'],
      [55, 'wi:rain'],
      [56, 'wi:sleet'],
      [57, 'wi:sleet'],
      [66, 'wi:sleet'],
      [67, 'wi:sleet'],
      [61, 'wi:rain'],
      [63, 'wi:rain'],
      [65, 'wi:rain'],
      [71, 'wi:snow'],
      [73, 'wi:snow'],
      [75, 'wi:snow'],
      [77, 'wi:snow'],
      [85, 'wi:snow'],
      [86, 'wi:snow'],
      [80, 'wi:showers'],
      [81, 'wi:showers'],
      [82, 'wi:showers'],
      [95, 'wi:thunderstorm'],
      [96, 'wi:thunderstorm'],
      [99, 'wi:thunderstorm'],
      [100, 'wi:na'],
    ])('should return correct icon for code %i', (code, expectedIcon) => {
      expect(getWeatherIcon(code)).toBe(expectedIcon);
    });

    it.each([100, -1, undefined, NaN, null as unknown as number])(
      'should handle edge cases',
      (code) => {
        expect(getWeatherIcon(code)).toBe('wi:na');
      },
    );
  });

  describe('getWeatherDescription', () => {
    it.each([
      [0, 'Clear sky'],
      [1, 'Mainly clear'],
      [2, 'Partly cloudy'],
      [3, 'Overcast'],
      [45, 'Fog'],
      [48, 'Depositing rime fog'],
      [51, 'Light drizzle'],
      [53, 'Moderate drizzle'],
      [55, 'Dense drizzle'],
      [56, 'Light freezing drizzle'],
      [57, 'Dense freezing drizzle'],
      [61, 'Slight rain'],
      [63, 'Moderate rain'],
      [65, 'Heavy rain'],
      [66, 'Light freezing rain'],
      [67, 'Heavy freezing rain'],
      [71, 'Slight snow fall'],
      [73, 'Moderate snow fall'],
      [75, 'Heavy snow fall'],
      [77, 'Snow grains'],
      [80, 'Slight rain showers'],
      [81, 'Moderate rain showers'],
      [82, 'Violent rain showers'],
      [85, 'Slight snow showers'],
      [86, 'Heavy snow showers'],
      [95, 'Thunderstorm'],
      [96, 'Thunderstorm with slight hail'],
      [99, 'Thunderstorm with heavy hail'],
    ])('should return correct description for code %i', (code, expectedDescription) => {
      expect(getWeatherDescription(code)).toBe(expectedDescription);
    });

    it.each([100, -1, undefined, NaN, null as unknown as number])(
      'should handle edge cases',
      (code) => {
        expect(getWeatherDescription(code)).toBe('Unknown');
      },
    );
  });
});
