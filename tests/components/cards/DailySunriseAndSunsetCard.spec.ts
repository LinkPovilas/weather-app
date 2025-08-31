import DailySunriseAndSunsetCard from '../../../src/components/cards/DailySunriseAndSunsetCard.vue';
import { MOCK_WEATHER_DATA } from '../../mocks/weatherForecastService.mock';
import { setupComponent } from '../../test-utils';
import { screen } from '@testing-library/vue';

describe('DailySunriseAndSunsetCard', () => {
  const { daily: dailyForecast } = MOCK_WEATHER_DATA;

  describe('loading', () => {
    it('shows circular progress bar while data is loading', () => {
      setupComponent(DailySunriseAndSunsetCard, {
        piniaOptions: { initialState: { weatherForecast: { loading: true } } },
      });

      expect(screen.getByTestId('circular-progress-bar')).toBeVisible();
      expect(screen.queryByText('Daily Sunrise & Sunset')).not.toBeInTheDocument();
    });
  });

  describe('render', () => {
    it('renders empty state when no data', () => {
      setupComponent(DailySunriseAndSunsetCard, {
        piniaOptions: { initialState: { weatherForecast: { dailyForecast: [] } } },
      });

      expect(screen.getByText('Daily Sunrise & Sunset')).toBeVisible();
      expect(screen.getByText('No data available')).toBeVisible();
      expect(screen.queryByTestId('daily-sunrise-sunset-item')).not.toBeInTheDocument();
    });

    it('renders sunrise/sunset items for each day', () => {
      setupComponent(DailySunriseAndSunsetCard, {
        piniaOptions: { initialState: { weatherForecast: { dailyForecast } } },
      });

      expect(screen.getByText('Daily Sunrise & Sunset')).toBeInTheDocument();
      const items = screen.getAllByTestId('daily-sunrise-sunset-item');
      expect(items).toHaveLength(7);
      items.forEach((item) => {
        expect(item).toBeVisible();
      });
    });

    it('renders daylight duration range for each day', () => {
      setupComponent(DailySunriseAndSunsetCard, {
        piniaOptions: { initialState: { weatherForecast: { dailyForecast } } },
      });

      const daylightDurationRangeItems = screen.getAllByTestId('daily-daylight-duration-range');

      expect(daylightDurationRangeItems).toHaveLength(7);
      daylightDurationRangeItems.forEach((item) => {
        expect(item).toBeVisible();
      });

      expect(daylightDurationRangeItems.at(0)).toHaveTextContent('1482065280');
      expect(daylightDurationRangeItems.at(-1)).toHaveTextContent('1542064440');
    });
  });

  describe('formatting', () => {
    it('formats weekdays as "Tue" for each day', () => {
      setupComponent(DailySunriseAndSunsetCard, {
        piniaOptions: { initialState: { weatherForecast: { dailyForecast } } },
      });

      const weekdays = screen.getAllByTestId('daily-sunrise-sunset-weekday');
      expect(weekdays).toHaveLength(7);
      weekdays.forEach((weekday) => {
        expect(weekday).toBeVisible();
      });

      expect(weekdays.at(0)).toHaveTextContent('Tue');
      expect(weekdays.at(3)).toHaveTextContent('Fri');
      expect(weekdays.at(-1)).toHaveTextContent('Mon');
    });

    it('formats sunrise times as "04:07" for each day', () => {
      setupComponent(DailySunriseAndSunsetCard, {
        piniaOptions: { initialState: { weatherForecast: { dailyForecast } } },
      });

      const sunriseTimes = screen.getAllByTestId('daily-sunrise-time');
      expect(sunriseTimes).toHaveLength(7);
      sunriseTimes.forEach((sunriseTime) => {
        expect(sunriseTime).toBeVisible();
      });

      expect(sunriseTimes.at(0)).toHaveTextContent('04:07');
      expect(sunriseTimes.at(3)).toHaveTextContent('04:12');
      expect(sunriseTimes.at(-1)).toHaveTextContent('04:17');
    });

    it('formats sunset times as "18:08" for each day', () => {
      setupComponent(DailySunriseAndSunsetCard, {
        piniaOptions: { initialState: { weatherForecast: { dailyForecast } } },
      });

      const sunsetTimes = screen.getAllByTestId('daily-sunset-time');
      expect(sunsetTimes).toHaveLength(7);
      sunsetTimes.forEach((sunsetTime) => {
        expect(sunsetTime).toBeVisible();
      });

      expect(sunsetTimes.at(0)).toHaveTextContent('18:08');
      expect(sunsetTimes.at(3)).toHaveTextContent('18:01');
      expect(sunsetTimes.at(-1)).toHaveTextContent('17:54');
    });
  });
});
