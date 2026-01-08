import { beforeAll, afterAll, afterEach, vi } from 'vitest';

// Mock environment variables for tests
beforeAll(() => {
  process.env.ANTHROPIC_API_KEY = 'test-anthropic-api-key';
  process.env.PORT = '3002';  // Different for tests
});

// Clean up after all tests
afterAll(() => {
  vi.restoreAllMocks();
});

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
