import { setupComponent } from '../test-utils';
import CircularProgressBar from '../../src/components/CircularProgressBar.vue';
import { screen } from '@testing-library/vue';

describe('CircularProgressBar', () => {
  describe('render', () => {
    it('renders with default props', () => {
      setupComponent(CircularProgressBar);

      const progressContainer = screen.getByTestId('circular-progress-bar');
      expect(progressContainer).toBeInTheDocument();
      expect(progressContainer).toBeVisible();

      const messageElement = screen.getByText('Loading...');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toBeVisible();
    });

    it('renders custom message when provided', () => {
      const customMessage = 'Please wait...';

      setupComponent(CircularProgressBar, {
        props: { message: customMessage },
      });

      const progressContainer = screen.getByTestId('circular-progress-bar');
      expect(progressContainer).toBeInTheDocument();
      expect(progressContainer).toBeVisible();

      const messageElement = screen.getByText(customMessage);
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toBeVisible();
      expect(messageElement).toHaveTextContent(customMessage);
    });
  });
});
