import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Integration tests share one database, so run files sequentially.
    fileParallelism: false,
    // Neon can be slow on a cold start; give requests room to breathe.
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
