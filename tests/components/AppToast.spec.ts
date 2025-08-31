import { setupComponent } from '../test-utils';
import AppToast from '../../src/components/AppToast.vue';
import { useMessagesStore } from '../../src/stores/useMessagesStore';

describe('AppToast', () => {
  it('binds to message store queue', () => {
    setupComponent(AppToast, {
      piniaOptions: {
        initialState: {
          messages: { queue: [{ text: 'toast message', color: 'success' }] },
        },
      },
    });

    const messagesStore = useMessagesStore();

    expect(messagesStore.queue).toHaveLength(1);
    expect(messagesStore.queue[0]).toEqual({ text: 'toast message', color: 'success' });
  });
});
