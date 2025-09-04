import { setupComponent } from '../test-utils';
import SearchBar from '../../src/components/SearchBar.vue';
import { useGeolocationStore } from '../../src/stores/useGeolocationStore';
import { vi } from 'vitest';
import { screen } from '@testing-library/vue';
import { mockGeolocation, mockPermission } from '../mocks/useGeolocationStore.mock';

vi.mock('@vueuse/core', () => ({
  useGeolocation: vi.fn(),
  usePermission: vi.fn(),
  useDebounceFn: vi.fn((fn) => fn),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    mockGeolocation({ isSupported: true });
    mockPermission({ state: 'granted' });
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders search input field with all elements visible', () => {
      setupComponent(SearchBar);

      const searchInput = screen.getByLabelText('Search for a location');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toBeVisible();
      expect(searchInput).toHaveValue('');
    });
  });

  describe('interactions', () => {
    describe('search field', () => {
      it('searches for a location by text input', async () => {
        const city = 'New York';
        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const searchLocationSpy = vi.spyOn(geolocationStore, 'searchLocation');

        const searchInput = screen.getByLabelText('Search for a location');
        await user.type(searchInput, city);
        await user.keyboard('{Enter}');

        expect(searchLocationSpy).toHaveBeenCalledExactlyOnceWith(city);
      });

      it('clears text input when clear button is clicked', async () => {
        const { user } = setupComponent(SearchBar, {
          piniaOptions: {
            initialState: {
              geolocation: {
                isGeolocationSupported: true,
                geolocationPermission: 'granted',
              },
            },
          },
        });

        const searchInput = screen.getByLabelText('Search for a location');
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toBeVisible();
        expect(searchInput).toHaveValue('');

        await user.type(searchInput, 'London');
        expect(searchInput).toHaveValue('London');

        const clearButton = screen.getByRole('button', { name: 'Clear Search for a location' });
        expect(clearButton).toBeInTheDocument();
        expect(clearButton).toBeVisible();

        await user.click(clearButton);

        expect(searchInput).toHaveValue('');
      });

      it('does not search for a location when input is empty', async () => {
        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const searchLocationSpy = vi.spyOn(geolocationStore, 'searchLocation');

        const searchInput = screen.getByLabelText('Search for a location');
        user.click(searchInput);
        await user.keyboard('{Enter}');

        expect(searchLocationSpy).not.toHaveBeenCalled();
      });

      it('does not search for a location when input is empty quotes', async () => {
        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const searchLocationSpy = vi.spyOn(geolocationStore, 'searchLocation');

        const searchInput = screen.getByLabelText('Search for a location');
        await user.type(searchInput, ' ');
        await user.keyboard('{Enter}');

        expect(searchLocationSpy).not.toHaveBeenCalled();
      });

      it('does not search for a location when enter is pressed with invalid characters', async () => {
        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const searchLocationSpy = vi.spyOn(geolocationStore, 'searchLocation');

        const searchInput = screen.getByLabelText('Search for a location');
        await user.type(searchInput, 'London@123');
        await user.keyboard('{Enter}');

        expect(searchLocationSpy).not.toHaveBeenCalledExactlyOnceWith('London@123');
      });

      it('filters out invalid characters when typing', async () => {
        const { user } = setupComponent(SearchBar);

        const searchInput = screen.getByLabelText('Search for a location');
        await user.type(searchInput, 'London@123$');

        expect(searchInput).toHaveValue('London');
      });

      it('filters out special characters when typing', async () => {
        const { user } = setupComponent(SearchBar);

        const searchInput = screen.getByLabelText('Search for a location');
        await user.type(searchInput, 'London@123');
        expect(searchInput).toHaveValue('London');
      });

      it('shows error when pasting invalid characters', async () => {
        const { user } = setupComponent(SearchBar);

        const searchInput = screen.getByLabelText('Search for a location');
        await user.click(searchInput);
        await user.paste('London@123');
        expect(searchInput).toHaveValue('London@123');
        expect(screen.getByText('Only letters and spaces are allowed')).toBeInTheDocument();
      });
    });

    describe('geolocation button', () => {
      it('fetches user location if granted permission', async () => {
        mockGeolocation({ isSupported: true });
        mockPermission({ state: 'granted' });

        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const fetchUserLocationSpy = vi.spyOn(geolocationStore, 'fetchUserLocation');

        const locationButton = screen.getByLabelText('Use my current location');
        expect(locationButton).toBeInTheDocument();
        expect(locationButton).toBeVisible();

        await user.click(locationButton);
        expect(fetchUserLocationSpy).toHaveBeenCalledTimes(1);
      });

      it('requests geolocation permission after clicking button', async () => {
        mockGeolocation({ isSupported: true });
        mockPermission({ state: 'prompt' });

        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const fetchUserLocationSpy = vi.spyOn(geolocationStore, 'fetchUserLocation');

        const locationButton = screen.getByLabelText('Allow location access');
        expect(locationButton).toBeInTheDocument();
        expect(locationButton).toBeVisible();

        await user.click(locationButton);
        expect(fetchUserLocationSpy).toHaveBeenCalledTimes(1);
      });

      it('does not fetch location if denied permission', async () => {
        mockGeolocation({ isSupported: true });
        mockPermission({ state: 'denied' });

        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const fetchUserLocationSpy = vi.spyOn(geolocationStore, 'fetchUserLocation');

        const locationButton = screen.getByLabelText('Location denied. Allow in browser settings.');
        expect(locationButton).toBeInTheDocument();
        expect(locationButton).toBeVisible();

        await user.click(locationButton);
        expect(fetchUserLocationSpy).toHaveBeenCalledTimes(0);
      });

      it('does not fetch location if browser does not support geolocation', async () => {
        mockGeolocation({ isSupported: false });
        mockPermission({ state: 'prompt' });

        const { user } = setupComponent(SearchBar);
        const geolocationStore = useGeolocationStore();
        const fetchUserLocationSpy = vi.spyOn(geolocationStore, 'fetchUserLocation');

        const locationButton = screen.getByLabelText(
          'Geolocation is not supported in your browser',
        );
        expect(locationButton).toBeInTheDocument();
        expect(locationButton).toBeVisible();

        await user.click(locationButton);
        expect(fetchUserLocationSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('tooltip', () => {
    it('shows tooltip when hovering over granted permission button', async () => {
      mockGeolocation({ isSupported: true });
      mockPermission({ state: 'granted' });

      const { user } = setupComponent(SearchBar);

      const locationButton = screen.getByLabelText('Use my current location');
      expect(locationButton).toBeInTheDocument();
      expect(locationButton).toBeVisible();

      await user.hover(locationButton);
      const tooltip = screen.getByText('Use my current location');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toBeVisible();

      await user.unhover(locationButton);
      expect(tooltip).not.toBeVisible();
    });

    it('shows tooltip when hovering over prompt permission button', async () => {
      mockGeolocation({ isSupported: true });
      mockPermission({ state: 'prompt' });

      const { user } = setupComponent(SearchBar);

      const locationButton = screen.getByLabelText('Allow location access');
      expect(locationButton).toBeInTheDocument();
      expect(locationButton).toBeVisible();

      await user.hover(locationButton);
      const tooltip = screen.getByText('Allow location access');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toBeVisible();

      await user.unhover(locationButton);
      expect(tooltip).not.toBeVisible();
    });

    it('shows tooltip when hovering over denied permission button', async () => {
      mockGeolocation({ isSupported: true });
      mockPermission({ state: 'denied' });

      const { user } = setupComponent(SearchBar);

      const locationButton = screen.getByLabelText('Location denied. Allow in browser settings.');
      expect(locationButton).toBeInTheDocument();
      expect(locationButton).toBeVisible();

      await user.hover(locationButton);
      const tooltip = screen.getByText('Location denied. Allow in browser settings.');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toBeVisible();

      await user.unhover(locationButton);
      expect(tooltip).not.toBeVisible();
    });

    it('shows tooltip when hovering over unsupported geolocation button', async () => {
      mockGeolocation({ isSupported: false });
      mockPermission({ state: 'prompt' });

      const { user } = setupComponent(SearchBar);

      const locationButton = screen.getByLabelText('Geolocation is not supported in your browser');
      expect(locationButton).toBeInTheDocument();
      expect(locationButton).toBeVisible();

      await user.hover(locationButton);
      const tooltip = screen.getByText('Geolocation is not supported in your browser');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toBeVisible();

      await user.unhover(locationButton);
      expect(tooltip).not.toBeVisible();
    });
  });
});
