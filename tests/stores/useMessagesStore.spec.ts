import { setActivePinia, createPinia } from 'pinia';
import { MESSAGE_COLOR_TYPE, useMessagesStore } from '../../src/stores/useMessagesStore';

describe('useMessagesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should start with empty queue', () => {
    const messagesStore = useMessagesStore();

    expect(messagesStore.queue).toEqual([]);
  });

  it('should add custom message to queue', () => {
    const messagesStore = useMessagesStore();
    const spy = vi.spyOn(messagesStore, 'add');
    const message = { text: 'test', color: MESSAGE_COLOR_TYPE.INFO };

    messagesStore.add(message);

    expect(spy).toHaveBeenCalledExactlyOnceWith(message);
    expect(messagesStore.queue).toContainEqual(message);
  });

  it('should add error message to queue', () => {
    const messagesStore = useMessagesStore();
    const spy = vi.spyOn(messagesStore, 'addError');

    messagesStore.addError('test');

    expect(spy).toHaveBeenCalledExactlyOnceWith('test');
    expect(messagesStore.queue).toContainEqual({ text: 'test', color: 'error' });
  });

  it('should add success message to queue', () => {
    const messagesStore = useMessagesStore();
    const spy = vi.spyOn(messagesStore, 'addSuccess');

    messagesStore.addSuccess('test');

    expect(spy).toHaveBeenCalledExactlyOnceWith('test');
    expect(messagesStore.queue).toContainEqual({ text: 'test', color: 'success' });
  });

  it('should add warning message to queue', () => {
    const messagesStore = useMessagesStore();
    const spy = vi.spyOn(messagesStore, 'addWarning');

    messagesStore.addWarning('test');

    expect(spy).toHaveBeenCalledExactlyOnceWith('test');
    expect(messagesStore.queue).toContainEqual({ text: 'test', color: 'warning' });
  });

  it('should add info message to queue', () => {
    const messagesStore = useMessagesStore();
    const spy = vi.spyOn(messagesStore, 'addInfo');

    messagesStore.addInfo('test');

    expect(spy).toHaveBeenCalledExactlyOnceWith('test');
    expect(messagesStore.queue).toContainEqual({ text: 'test', color: 'info' });
  });

  it('should add multiple messages to queue', () => {
    const messagesStore = useMessagesStore();

    messagesStore.addInfo('one');
    messagesStore.addWarning('two');
    messagesStore.addSuccess('three');
    messagesStore.addError('four');

    expect(messagesStore.queue).toHaveLength(4);
    expect(messagesStore.queue).toEqual([
      { text: 'one', color: 'info' },
      { text: 'two', color: 'warning' },
      { text: 'three', color: 'success' },
      { text: 'four', color: 'error' },
    ]);
  });
});
