import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('@claim:record-workflow creates, confirms, edits, and preserves a medication handoff card', async ({ page }) => {
  await page.goto('/');
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  await page.getByLabel(/Person’s name/).fill('Ruth Bennett');
  await page.getByLabel(/Person keeping this card/).fill('Maya Bennett');
  await page.getByRole('button', { name: 'Save names' }).click();
  await expect(page.getByRole('heading', { name: 'Ruth Bennett' })).toBeVisible();

  await page.getByRole('button', { name: 'Add first medicine' }).click();
  await expect(page.getByRole('dialog', { name: 'Add medicine' })).toBeVisible();
  await page.getByLabel(/Medicine name/).fill('Lisinopril');
  await page.getByLabel(/Dose or strength/).fill('10 mg');
  await page.getByLabel(/When taken/).fill('Each morning');
  await page.getByLabel('Prescriber').fill('Dr. Lee');
  await page.getByRole('button', { name: 'Add to card' }).click();
  await expect(page.getByRole('heading', { name: 'Lisinopril' })).toBeVisible();
  await expect(page.getByText('Lisinopril added', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByLabel(/Dose or strength/).fill('20 mg');
  await page.getByRole('button', { name: 'Save change' }).click();
  await expect(page.getByText('20 mg', { exact: true })).toBeVisible();
  await expect(page.getByText('Changed dose.', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Confirm current list' }).click();
  await page.getByLabel(/I checked all 1 current medicine/).check();
  await page.getByRole('button', { name: 'Confirm today' }).click();
  await expect(page.getByText('Current list confirmed', { exact: true })).toBeVisible();
  await expect(page.getByText('by Maya Bennett', { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Lisinopril' })).toBeVisible();
  await expect(page.getByText('20 mg', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Print / PDF' })).toBeEnabled();
  expect(consoleErrors).toEqual([]);
});

test('keeps stopped medicines in the visible change history', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/Person’s name/).fill('Ruth Bennett');
  await page.getByRole('button', { name: 'Save names' }).click();
  await page.getByRole('button', { name: 'Add first medicine' }).click();
  await page.getByLabel(/Medicine name/).fill('Old medicine');
  await page.getByLabel(/Dose or strength/).fill('5 mg');
  await page.getByLabel(/When taken/).fill('At night');
  await page.getByRole('button', { name: 'Add to card' }).click();
  await page.getByLabel('Medicines being taken').getByRole('button', { name: 'Stop & remove' }).click();
  await page.getByRole('textbox', { name: /What changed/ }).fill('Stopped by Dr. Lee after the appointment.');
  await page.getByRole('dialog').getByRole('button', { name: 'Stop & remove' }).click();
  await expect(page.getByText('Old medicine stopped', { exact: true })).toBeVisible();
  await expect(page.getByText('Stopped by Dr. Lee after the appointment.', { exact: true })).toBeVisible();
  await expect(page.getByText('No medicines on this card yet')).toBeVisible();
});

test('passes serious accessibility checks on the main and legal pages', async ({ page }, testInfo) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).exclude('.generation-note').analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    `Accessibility violations in ${testInfo.project.name}`).toEqual([]);

  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  const privacyResults = await new AxeBuilder({ page }).analyze();
  expect(privacyResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);

  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeVisible();
  const termsResults = await new AxeBuilder({ page }).analyze();
  expect(termsResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('passes serious accessibility checks in the populated dark demo', async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    `Dark demo accessibility violations in ${testInfo.project.name}`).toEqual([]);
});

test('uses plain-language titles for the home and demo routes', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Medication Handoff Card — share a clear medicine list');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Medication Handoff Card');
});

test('loads the demo without console errors or horizontal overflow', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(consoleErrors).toEqual([]);
});

test('degrades without errors when service workers are blocked', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('http://127.0.0.1:4173/demo');
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  expect(pageErrors).toEqual([]);
  await context.close();
});

test('loads the saved app while fully offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(() => navigator.serviceWorker.controller || new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })));
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const cacheCheck = await page.evaluate(async () => {
    const keys = await caches.keys();
    const details: Array<{ url: string; size: number }> = [];
    for (const key of keys) {
      const cache = await caches.open(key);
      for (const request of await cache.keys()) {
        const response = await cache.match(request);
        details.push({ url: request.url, size: (await response?.clone().arrayBuffer())?.byteLength ?? -1 });
      }
    }
    return { details, script: (document.querySelector('script[type="module"]') as HTMLScriptElement).src };
  });
  expect(cacheCheck.details.some((item) => item.url === cacheCheck.script && item.size > 1_000)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: /Make a clear medication handoff card/ })).toBeVisible();
  await expect(page.getByText(/Offline:/)).toBeVisible();
  await context.setOffline(false);
});

test('@claim:encrypted-backup restores a one-time license and creates an encrypted backup in the demo', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/medication-handoff-card/verify**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.goto('/demo?license=test-license-token');
  await expect(page).toHaveURL('/demo');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:medication-handoff-card'))).toBe('test-license-token');
  await page.getByRole('button', { name: 'Backup & settings' }).click();
  await expect(page.getByText('Unlocked', { exact: true })).toBeVisible();
  await page.getByLabel('Backup passphrase').fill('family backup phrase');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted backup' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/medication-card-\d{4}-\d{2}-\d{2}\.mhc/);
  const downloadedPath = await download.path();
  if (!downloadedPath) throw new Error('Encrypted backup download was not written.');
  const encrypted = await readFile(downloadedPath, 'utf8');
  expect(encrypted).toContain('medication-handoff-card-encrypted');
  expect(encrypted).not.toContain('Lisinopril');
});

test('@claim:demo-isolation loads sample data separately and can return to an empty real card', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Medication Handoff Card');
  await expect(page.getByText('Demo — sample data, nothing is saved to your real card.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lisinopril' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
  await page.getByLabel(/Notes from the label/).fill('Changed only inside the demo.');
  await page.getByRole('button', { name: 'Save change' }).click();
  await expect(page.locator('[data-medication-id="sample-lisinopril"]')).toContainText('Changed only inside the demo.');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await expect(page.locator('[data-medication-id="sample-lisinopril"]')).not.toContainText('Changed only inside the demo.');
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
  await page.getByLabel(/Notes from the label/).fill('This must be discarded on exit.');
  await page.getByRole('button', { name: 'Save change' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByLabel(/Person’s name/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).not.toBeVisible();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
  await expect(page.getByLabel(/Notes from the label/)).toHaveValue('Take as listed on the pharmacy label.');
});

test('@claim:local-record keeps demo health data off the network', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
  await page.getByLabel(/Notes from the label/).fill('Reviewed against the pharmacy label.');
  await page.getByRole('button', { name: 'Save change' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:offline-reload reloads the demo after the first visit without a network', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(() => navigator.serviceWorker.controller || new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })));
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await expect(page.getByText(/Offline:/)).toBeVisible();
  await context.setOffline(false);
});

test('@claim:json-backup downloads and restores a plain JSON backup from the demo', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Backup & settings' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/medication-card-\d{4}-\d{2}-\d{2}\.json/);
  page.on('dialog', (dialog) => dialog.accept());
  await page.locator('#import-file').setInputFiles({
    name: 'restored-card.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      format: 'medication-handoff-card', version: 1, exportedAt: '2026-08-28T09:15:00.000Z',
      profile: { id: 'profile', personName: 'Restored Sample', caregiverName: '', lastConfirmed: '', confirmedBy: '', updatedAt: '2026-08-28T09:15:00.000Z' },
      medications: [], changes: []
    }))
  });
  await expect(page.getByText('Backup restored on this device.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Restored Sample' })).toBeVisible();
});

test('@claim:print-card creates a one-page PDF with the current demo list', async ({ page }) => {
  await page.goto('/demo');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.print-sheet')).toBeVisible();
  await expect(page.locator('.print-sheet')).toContainText('Lisinopril');
  await expect(page.locator('.print-sheet')).toContainText('This is a communication record, not medical advice');
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  const pageObjects = pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? [];
  expect(pageObjects).toHaveLength(1);
});

test('@claim:dialog-keyboard keeps Tab focus inside an open medicine dialog', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Edit medicine' });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab');
    await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
});

test('rejects malformed and invalid JSON backups without changing saved data', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Backup & settings' }).click();
  await page.locator('#import-file').setInputFiles({
    name: 'malformed.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      format: 'medication-handoff-card', version: 1, exportedAt: '2026-08-29T12:00:00.000Z',
      profile: { id: 'profile' }, medications: [], changes: []
    }))
  });
  await expect(page.getByRole('status')).toContainText('incomplete or has invalid fields');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();

  await page.getByRole('button', { name: 'Backup & settings' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('not valid json') });
  await expect(page.getByRole('status')).toContainText('not readable JSON');
  await expect(page.getByRole('status')).toContainText('Choose a Medication Handoff Card');
});

test('shows keyboard focus on restore and gives navigation links 44px touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Backup & settings' }).click();
  await page.locator('#import-file').focus();
  const restoreStyle = await page.locator('.file-button').evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, width: box.width, height: box.height };
  });
  expect(restoreStyle.outlineStyle).toBe('solid');
  expect(parseFloat(restoreStyle.outlineWidth)).toBeGreaterThanOrEqual(3);
  expect(restoreStyle.width).toBeGreaterThanOrEqual(44);
  expect(restoreStyle.height).toBeGreaterThanOrEqual(44);
  await page.getByRole('button', { name: 'Close settings' }).click();
  const sizes = await page.locator('.site-nav a, footer nav a').evaluateAll((links) => links.map((link) => {
    const box = link.getBoundingClientRect();
    return { text: link.textContent, width: box.width, height: box.height };
  }));
  expect(sizes.every(({ height }) => height >= 44)).toBe(true);
});

test('wraps maximum-length card values on a 390px screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
  await page.getByLabel(/Medicine name/).fill('M'.repeat(120));
  await page.getByLabel(/Dose or strength/).fill('D'.repeat(80));
  await page.getByLabel(/When taken/).fill('T'.repeat(120));
  await page.getByLabel('Prescriber').fill('P'.repeat(120));
  await page.getByLabel(/Notes from the label/).fill('N'.repeat(300));
  await page.getByRole('button', { name: 'Save change' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('@claim:adaptive-interface supports dark, reduced-motion, and 390px layouts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Backup & settings' }).click();
  await page.getByRole('button', { name: 'Change light or dark theme' }).click();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toMatch(/light|dark/);
  await page.getByRole('button', { name: 'Close settings' }).click();
  const duration = await page.getByRole('button', { name: 'Edit', exact: true }).first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration.split(',').every((value) => parseFloat(value) <= 0.00001)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('@claim:checkout-available opens the live $12 Sociobot checkout', async ({ page, request }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Buy encrypted backups — $12' });
  await expect(link).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/medication-handoff-card/checkout');
  const response = await request.get(await link.getAttribute('href') as string, { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test('shows required landing sections and product identity metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
  await expect(page.locator('.how-it-works li')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Protect backups with a passphrase' })).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card-1200x630\.webp$/);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180');
});
