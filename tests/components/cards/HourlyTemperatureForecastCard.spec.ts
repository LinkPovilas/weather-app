import { setupComponent } from '../../test-utils';
import { screen } from '@testing-library/vue';
import { MOCK_WEATHER_DATA } from '../../mocks/weatherForecastService.mock';
import { vi } from 'vitest';

import { h, defineComponent } from 'vue';
vi.mock('@unovis/vue', () => {
  const VisXYContainer = defineComponent({
    name: 'VisXYContainer',
    props: ['data', 'margin'],
    setup(props, { slots }) {
      return () =>
        h(
          'div',
          {
            'data-testid': 'vis-x-y-container',
            'data-count': Array.isArray(props.data) ? props.data.length : 0,
          },
          slots.default?.(),
        );
    },
  });

  const VisArea = defineComponent({
    name: 'VisArea',
    props: ['curveType', 'x', 'y', 'minHeight', 'color'],
    setup(props) {
      const hasX = typeof props.x === 'function';
      const hasY = typeof props.y === 'function';
      return () =>
        h('div', {
          'data-testid': 'vis-area',
          'data-has-x': String(hasX),
          'data-has-y': String(hasY),
          'data-curve': String(props.curveType ?? ''),
        });
    },
  });

  const VisScatter = defineComponent({
    name: 'VisScatter',
    props: ['x', 'y', 'size', 'label', 'color', 'labelColor', 'labelPosition', 'labelFontSize'],
    setup(props) {
      const sampleEven =
        typeof props.label === 'function' ? props.label({ temperature: 14 }, 2) : '';
      const sampleOdd =
        typeof props.label === 'function' ? props.label({ temperature: 15 }, 3) : '';

      return () =>
        h('div', {
          'data-testid': 'scatter',
          'data-sample-even': sampleEven ?? '',
          'data-sample-odd': sampleOdd ?? '',
          'data-label-pos': String(props.labelPosition ?? ''),
        });
    },
  });

  const VisAxis = defineComponent({
    name: 'VisAxis',
    props: ['type', 'tickLine', 'gridLine', 'tickFormat', 'tickValues', 'tickTextColor'],
    setup(props) {
      const count = Array.isArray(props.tickValues) ? props.tickValues.length : 0;
      const samples = (props.tickValues ?? [])
        .slice(0, 5)
        .map((v: number) =>
          typeof props.tickFormat === 'function' ? props.tickFormat(v) : String(v),
        );
      // Test out-of-bounds index
      const outOfBounds = typeof props.tickFormat === 'function' ? props.tickFormat(999) : 'N/A';
      return () =>
        h(
          'div',
          {
            'data-testid': 'axis',
            'data-ticks': String(count),
            'data-out-of-bounds': outOfBounds,
          },
          samples.join('|'),
        );
    },
  });

  return { VisXYContainer, VisArea, VisScatter, VisAxis };
});

import HourlyTemperatureForecastCard from '../../../src/components/cards/HourlyTemperatureForecastCard.vue';

describe('HourlyTemperatureForecastCard', () => {
  const { hourly: hourlyForecast, current: currentWeather } = MOCK_WEATHER_DATA;

  describe('loading', () => {
    it('shows circular progress bar while data is loading', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: { initialState: { weatherForecast: { loading: true } } },
      });

      expect(screen.getByTestId('circular-progress-bar')).toBeVisible();
      expect(screen.queryByTestId('hourly-temperature-forecast-chart')).not.toBeInTheDocument();
    });
  });

  describe('render', () => {
    it('renders empty state when no data', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: { initialState: { weatherForecast: { hourlyForecast: [] } } },
      });

      expect(screen.getByText('Hourly Temperature Forecast')).toBeVisible();
      expect(screen.getByText('No data available')).toBeVisible();
      expect(screen.queryByTestId('hourly-temperature-forecast-chart')).not.toBeInTheDocument();
    });

    it('renders chart', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: {
          initialState: {
            weatherForecast: {
              hourlyForecast,
              currentWeather,
            },
          },
        },
      });

      const visXyContainer = screen.getByTestId('vis-x-y-container');
      expect(visXyContainer).toBeInTheDocument();
      expect(visXyContainer).toBeVisible();
      expect(visXyContainer).toHaveAttribute('data-count', '6');

      expect(screen.getByTestId('vis-area')).toHaveAttribute('data-has-x', 'true');
      expect(screen.getByTestId('vis-area')).toHaveAttribute('data-has-y', 'true');
    });
  });

  describe('formatting', () => {
    it('formats graph ticks', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: {
          initialState: { weatherForecast: { hourlyForecast, currentWeather } },
        },
      });

      const axis = screen.getByTestId('axis');
      expect(axis.textContent).toContain('Now');
      expect(axis.textContent).toMatch(/\d{2}:\d{2}/);
      expect(axis).toHaveAttribute('data-ticks', '6');
    });

    it('formats scatter labels', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: { initialState: { weatherForecast: { hourlyForecast, currentWeather } } },
      });

      const scatter = screen.getByTestId('scatter');
      expect(scatter).toHaveAttribute('data-sample-even', '14°');
      expect(scatter).toHaveAttribute('data-sample-odd', '');
      expect(scatter).toHaveAttribute('data-label-pos', 'top');
    });
  });

  describe('edge cases', () => {
    it('does not show "Now" when current weather time is not within forecast range', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: {
          initialState: {
            weatherForecast: {
              hourlyForecast,
              currentWeather: { ...currentWeather, time: '2025-08-26T11:00' },
            },
          },
        },
      });

      const chartContainer = screen.getByTestId('hourly-temperature-forecast-chart');
      expect(chartContainer).toBeInTheDocument();

      expect(screen.queryByTestId('vis-x-y-container')).toBeInTheDocument();
      expect(screen.queryByTestId('axis')).toBeInTheDocument();
      expect(screen.queryByTestId('axis')).not.toHaveTextContent('Now');
    });

    it('uses current date when currentWeather time is not available', () => {
      const mockDate = new Date('2024-01-01T12:00:00');
      vi.setSystemTime(mockDate);

      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: {
          initialState: {
            weatherForecast: {
              hourlyForecast: [
                { temperature: 20, precipitationProbability: 10, time: '2024-01-01T12:00' },
                { temperature: 22, precipitationProbability: 5, time: '2024-01-01T13:00' },
                { temperature: 24, precipitationProbability: 0, time: '2024-01-01T14:00' },
              ],
              currentWeather: null,
            },
          },
        },
      });

      const axis = screen.getByTestId('axis');
      expect(axis).toBeInTheDocument();
      expect(axis.textContent).toContain('Now');

      vi.useRealTimers();
    });

    it('tickFormat handles out-of-bounds index gracefully', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: {
          initialState: {
            weatherForecast: {
              hourlyForecast,
              currentWeather,
            },
          },
        },
      });

      const axis = screen.getByTestId('axis');
      expect(axis).toHaveAttribute('data-out-of-bounds', '');
    });

    it('handles null hourlyForecast data', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: {
          initialState: {
            weatherForecast: {
              hourlyForecast: null,
              currentWeather,
            },
          },
        },
      });

      expect(screen.getByText('No data available')).toBeVisible();
    });

    it('handles undefined hourlyForecast data', () => {
      setupComponent(HourlyTemperatureForecastCard, {
        piniaOptions: {
          initialState: {
            weatherForecast: {
              hourlyForecast: undefined,
              currentWeather,
            },
          },
        },
      });

      expect(screen.getByText('No data available')).toBeVisible();
    });
  });
});
