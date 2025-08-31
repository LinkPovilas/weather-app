import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';

global.ResizeObserver = ResizeObserverPolyfill;

Object.defineProperty(window, 'visualViewport', {
  value: {
    width: window.innerWidth,
    height: window.innerHeight,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  },
  writable: false,
});
