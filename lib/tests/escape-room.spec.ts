import { test, expect } from '@playwright/test';

// ✅ Test 1: Escape Room heading renders correctly
test('escape room page renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Match full heading (with emoji)
  await expect(page.locator('h1')).toContainText('Escape Room');

  // Check the Start button is visible
  await expect(page.getByRole('button', { name: /start/i })).toBeVisible();
});

// ✅ Test 2: Clicking the Start button shows the first task
test('start button begins the game', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');
  await page.getByRole('button', { name: /start/i }).click();

  // Wait for the first challenge title (Fix the bug)
  await expect(page.locator('h2')).toContainText('Fix the bug');
});

// ✅ Test 3: Timer appears and counts down
test('timer is visible and counts down', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');
  await page.getByRole('button', { name: /start/i }).click();

  // Find the timer that includes the clock emoji ⏱
  const timer = page.locator('text=/⏱/');

  await expect(timer).toBeVisible();

  // Wait 2 seconds and ensure the timer text changes
  const initialTime = await timer.textContent();
  await page.waitForTimeout(2000);
  const newTime = await timer.textContent();
  expect(initialTime).not.toBe(newTime);
});
test('hint button displays hint message', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');
  await page.locator('button:has-text("Start")').click();

  // Listen for alert (the "Hint" button triggers alert)
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('semicolon'); // check for keyword
    await dialog.dismiss(); // close the popup
  });

  await page.locator('button:has-text("Hint")').click();
});
