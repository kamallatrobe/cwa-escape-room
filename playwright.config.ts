import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'lib/tests',
  testMatch: /.*\.spec\.ts/,
  timeout: 30 * 1000,
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html-report', open: 'always' }],
  ],
});
