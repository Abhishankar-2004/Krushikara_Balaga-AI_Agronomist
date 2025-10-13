import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('process', () => ({
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_mock_key',
    CLERK_SECRET_KEY: 'sk_test_mock_key',
  },
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    reload: vi.fn(),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});