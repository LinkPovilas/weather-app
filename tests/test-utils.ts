import { render, type RenderOptions } from '@testing-library/vue';
import { createVuetify, type VuetifyOptions } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { createTestingPinia, type TestingOptions } from '@pinia/testing';
import { vi } from 'vitest';
import type { Component } from 'vue';
import { VuetifyDateAdapter } from 'vuetify/date/adapters/vuetify';
import userEvent from '@testing-library/user-event';

type CustomOptions = {
  piniaOptions?: TestingOptions;
  vuetifyOptions?: VuetifyOptions;
  global?: RenderOptions<Component>['global'];
  props?: Record<string, unknown>;
};

export const setupComponent = (component: Component, options: CustomOptions = {}) => {
  const { piniaOptions, vuetifyOptions, ...renderOptions } = options;

  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
    },
    date: {
      adapter: VuetifyDateAdapter,
    },
    ...vuetifyOptions,
  });

  const pinia = createTestingPinia({
    createSpy: vi.fn,
    stubActions: false,
    ...piniaOptions,
  });

  return {
    user: userEvent.setup(),
    ...render(component, {
      global: {
        plugins: [pinia, vuetify],
        ...renderOptions.global,
      },
      ...renderOptions,
    }),
  };
};
