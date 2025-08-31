import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Message = {
  text: string;
  color: 'error' | 'success' | 'warning' | 'info' | string;
};

export const useMessagesStore = defineStore('messages', () => {
  const queue = ref<Message[]>([]);

  const add = (message: Message) => {
    queue.value.push(message);
  };

  const addError = (text: string) => {
    add({ text, color: 'error' });
  };

  const addSuccess = (text: string) => {
    add({ text, color: 'success' });
  };

  const addWarning = (text: string) => {
    add({ text, color: 'warning' });
  };

  const addInfo = (text: string) => {
    add({ text, color: 'info' });
  };

  return {
    queue,
    add,
    addError,
    addSuccess,
    addWarning,
    addInfo,
  };
});
