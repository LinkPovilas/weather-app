import { defineStore } from 'pinia';
import { ref } from 'vue';

export const MESSAGE_COLOR_TYPE = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export type MessageColorType = (typeof MESSAGE_COLOR_TYPE)[keyof typeof MESSAGE_COLOR_TYPE];

export type Message = {
  text: string;
  color: MessageColorType;
};

export const useMessagesStore = defineStore('messages', () => {
  const queue = ref<Message[]>([]);

  const add = (message: Message) => {
    queue.value.push(message);
  };

  const addError = (text: string) => {
    add({ text, color: MESSAGE_COLOR_TYPE.ERROR });
  };

  const addSuccess = (text: string) => {
    add({ text, color: MESSAGE_COLOR_TYPE.SUCCESS });
  };

  const addWarning = (text: string) => {
    add({ text, color: MESSAGE_COLOR_TYPE.WARNING });
  };

  const addInfo = (text: string) => {
    add({ text, color: MESSAGE_COLOR_TYPE.INFO });
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
