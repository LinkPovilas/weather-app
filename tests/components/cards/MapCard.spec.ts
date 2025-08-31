import { setupComponent } from '../../test-utils';
import MapCard from '../../../src/components/cards/MapCard.vue';
import { screen } from '@testing-library/vue';
import { MOCK_GEOLOCATION_DATA } from '../../mocks/useGeolocationStore.mock';

describe('MapCard', () => {
  describe('loading', () => {
    it('shows circular progress bar while data is loading', () => {
      setupComponent(MapCard, {
        piniaOptions: { initialState: { geolocation: { loading: true } } },
      });

      expect(screen.getByTestId('circular-progress-bar')).toBeVisible();
      expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();
    });
  });

  describe('render', () => {
    it('renders empty state when no location data', () => {
      setupComponent(MapCard, {
        piniaOptions: { initialState: { geolocation: { location: null } } },
      });

      expect(screen.getByText('No data available')).toBeVisible();
      expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();
    });

    it('renders map', () => {
      setupComponent(MapCard, {
        piniaOptions: { initialState: { geolocation: { location: MOCK_GEOLOCATION_DATA } } },
      });

      expect(screen.queryByTestId('circular-progress-bar')).not.toBeInTheDocument();
      expect(screen.queryByText('No data available')).not.toBeInTheDocument();

      // The actual l-map component doesn't render in jsdom test environment
      expect(screen.getByText('OpenStreetMap')).toBeVisible();
    });

    it('renders attribution with copyright link', () => {
      setupComponent(MapCard, {
        piniaOptions: { initialState: { geolocation: { location: MOCK_GEOLOCATION_DATA } } },
      });

      const attributionChip = screen.getByTestId('map-attribution');
      expect(attributionChip).toBeVisible();
      expect(attributionChip).toHaveTextContent('© OpenStreetMap contributors');

      const osmLink = screen.getByRole('link', { name: 'OpenStreetMap' });
      expect(osmLink).toBeVisible();
      expect(osmLink).toHaveAttribute('href', 'https://www.openstreetmap.org/copyright');
      expect(osmLink).toHaveAttribute('target', '_blank');
      expect(osmLink).toHaveAttribute('rel', 'noopener');
    });
  });
});
