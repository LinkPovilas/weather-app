import { setupComponent } from '../../test-utils';
import NoDataContentText from '../../../src/components/cards/NoDataContentText.vue';
import { screen } from '@testing-library/vue';

describe('NoDataContentText', () => {
  describe('render', () => {
    it('renders default message', () => {
      setupComponent(NoDataContentText);

      const messageElement = screen.getByTestId('no-data-content-text');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toBeVisible();
      expect(messageElement).toHaveTextContent('No data available');
    });

    it('renders custom message', () => {
      const customMessage = 'Custom no data message';

      setupComponent(NoDataContentText, {
        props: { message: customMessage },
      });

      const messageElement = screen.getByTestId('no-data-content-text');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toBeVisible();
      expect(messageElement).toHaveTextContent(customMessage);
    });

    it('renders information icon', () => {
      setupComponent(NoDataContentText);

      const icon = screen.getByTestId('no-data-content-text-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toBeVisible();
    });
  });
});
