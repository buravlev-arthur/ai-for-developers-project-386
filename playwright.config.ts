import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
  },
  webServer: [
    {
      command: 'npm run server:start',
      port: 3001,
      timeout: 10_000,
      reuseExistingServer: true,
    },
    {
      command: 'set VITE_E2E=true && npm run client:dev',
      port: 5173,
      timeout: 30_000,
      reuseExistingServer: true,
    },
  ],
});
