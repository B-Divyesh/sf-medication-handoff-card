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

  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).click();
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
  await page.getByLabel('Medicines being taken').getByRole('button', { name: 'Stop and remove Old medicine' }).click();
  await page.getByRole('textbox', { name: /What changed/ }).fill('Stopped by Dr. Lee after the appointment.');
  await page.getByRole('dialog').getByRole('button', { name: 'Stop & remove' }).click();
  await expect(page.getByText('Old medicine stopped', { exact: true })).toBeVisible();
  await expect(page.getByText('Stopped by Dr. Lee after the appointment.', { exact: true })).toBeVisible();
  await expect(page.getByText('No medicines on this card yet')).toBeVisible();
});

test('rejects whitespace-only required medicine, stop, and confirmation values before any local write', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/Person’s name/).fill('Ruth Bennett');
  await page.getByRole('button', { name: 'Save names' }).click();

  await page.getByRole('button', { name: 'Add first medicine' }).click();
  await page.getByLabel(/Medicine name/).fill('   ');
  await page.getByLabel(/Dose or strength/).fill('   ');
  await page.getByLabel(/When taken/).fill('   ');
  await page.getByRole('button', { name: 'Add to card' }).click();
  const medicineDialog = page.getByRole('dialog', { name: 'Add medicine' });
  await expect(medicineDialog).toBeVisible();
  await expect(page.getByText('Enter a medicine name, not only spaces.')).toBeVisible();
  await expect(page.getByLabel(/Medicine name/)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel(/Dose or strength/)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel(/When taken/)).toHaveAttribute('aria-invalid', 'true');
  expect(await page.evaluate(() => new Promise<unknown[]>((resolve) => {
    const request = indexedDB.open('medication-handoff-card');
    request.onsuccess = () => {
      const records = request.result.transaction('medications').objectStore('medications').getAll();
      records.onsuccess = () => resolve(records.result);
    };
  }))).toEqual([]);

  await page.getByLabel(/Medicine name/).fill('Lisinopril');
  await page.getByLabel(/Dose or strength/).fill('10 mg');
  await page.getByLabel(/When taken/).fill('Each morning');
  await page.getByRole('button', { name: 'Add to card' }).click();
  await expect(page.getByRole('heading', { name: 'Lisinopril' })).toBeVisible();

  await page.getByRole('button', { name: 'Confirm current list' }).click();
  await page.getByLabel('Confirmed by').fill('   ');
  await page.getByLabel(/I checked all 1 current medicine/).check();
  await page.getByRole('button', { name: 'Confirm today' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm the current list' })).toBeVisible();
  await expect(page.getByText('Enter who checked the list, not only spaces.')).toBeVisible();
  await page.getByLabel('Confirmed by').fill('Maya Bennett');
  await page.getByRole('button', { name: 'Confirm today' }).click();
  await expect(page.getByText('Current list confirmed', { exact: true })).toBeVisible();

  await page.getByLabel('Medicines being taken').getByRole('button', { name: 'Stop and remove Lisinopril' }).click();
  await page.getByRole('dialog').getByRole('textbox', { name: 'What changed?' }).fill('   ');
  await page.getByRole('dialog').getByRole('button', { name: 'Stop & remove' }).click();
  await expect(page.getByRole('dialog', { name: /Stop and remove Lisinopril/ })).toBeVisible();
  await expect(page.getByText('Describe what changed, not only spaces.')).toBeVisible();
  await page.getByRole('dialog').getByRole('textbox', { name: 'What changed?' }).fill('Stopped by Dr. Lee.');
  await page.getByRole('dialog').getByRole('button', { name: 'Stop & remove' }).click();
  await expect(page.getByText('Lisinopril stopped', { exact: true })).toBeVisible();
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

test('passes serious accessibility checks after changing to dark theme in open settings', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  await page.getByRole('button', { name: /Use (dark|light) theme/ }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    `Dark settings accessibility violations in ${testInfo.project.name}`).toEqual([]);
});

test('uses plain-language titles for the home and demo routes', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Medication Handoff Card — share a clear medicine list');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Medication Handoff Card');
});

test('opens the completed sample card above the fold after one click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/?demo=1');
  await expect(page.getByRole('heading', { level: 1, name: 'Evelyn Parker' })).toBeVisible();
  await expect(page.locator('.demo-medicine-name')).toHaveText('Lisinopril');
  await expect(page.getByText('10 mg · Each morning', { exact: true })).toBeVisible();
  await expect(page.locator('.demo-sample-top').getByRole('button', { name: 'Edit Lisinopril', exact: true })).toBeVisible();
  const box = await page.locator('.demo-medicine').boundingBox();
  expect(box).not.toBeNull();
  expect((box?.y ?? Infinity) + (box?.height ?? Infinity)).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
});

test('updates route focus, announcements, and metadata for navigation and Back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveURL('/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Privacy page');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://medication-handoff-card.sociobot.in/privacy');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Read how Medication Handoff Card keeps your medication record in this browser.');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Medication Handoff Card');
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', 'Read how Medication Handoff Card keeps your medication record in this browser.');

  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Make a clear medication handoff card.' })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Medication handoff card');

  const expected = [
    ['/demo', 'Demo — Medication Handoff Card', 'https://medication-handoff-card.sociobot.in/demo', 'Try a completed sample medication handoff card; sample changes never reach your real card.'],
    ['/terms', 'Terms — Medication Handoff Card', 'https://medication-handoff-card.sociobot.in/terms', 'Read the plain-language terms for Medication Handoff Card.']
  ] as const;
  for (const [path, title, canonical, description] of expected) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
  }
});

test('uses result-naming controls for backup settings and legal-page themes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open backup settings' })).toBeVisible();

  await page.goto('/privacy');
  const themeButton = page.getByRole('button', { name: 'Use dark theme' });
  await expect(themeButton).toBeVisible();
  await themeButton.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Use light theme' })).toBeVisible();

  await page.goto('/terms');
  await expect(page.getByRole('button', { name: 'Use light theme' })).toBeVisible();
});

test('names every sample medicine action with its target medicine', async ({ page }) => {
  await page.goto('/demo');
  const list = page.getByLabel('Medicines being taken');
  for (const medicine of ['Lisinopril', 'Metformin ER', 'Vitamin D3']) {
    await expect(list.getByRole('button', { name: `Edit ${medicine}`, exact: true })).toHaveCount(1);
    await expect(list.getByRole('button', { name: `Stop and remove ${medicine}`, exact: true })).toHaveCount(1);
  }
  await expect(list.getByRole('button', { name: 'Edit', exact: true })).toHaveCount(0);
  await expect(list.getByRole('button', { name: 'Stop & remove', exact: true })).toHaveCount(0);
});

test('loads the demo without console errors or horizontal overflow', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(consoleErrors).toEqual([]);
});

test('ships a complete product shell and metadata on the designed 404', async ({ page }, testInfo) => {
  const response = await page.goto('/404.html');
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Page not found — Medication Handoff Card');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://medication-handoff-card.sociobot.in/404');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /does not exist/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Medication Handoff Card');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Page not found — Medication Handoff Card');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.getByRole('banner').getByRole('link', { name: 'Medication Handoff Card home' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('heading', { level: 1, name: 'That page is not here.' })).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' })).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Terms' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    `404 accessibility violations in ${testInfo.project.name}`).toEqual([]);
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
  await page.getByRole('button', { name: 'Open backup settings' }).click();
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

test('@claim:license-verification-data sends only the license token and product name, never card details', async ({ page }) => {
  const verificationRequests: Array<{ method: string; url: string; body: string | null }> = [];
  await page.route('https://api.sociobot.in/api/v1/products/medication-handoff-card/verify**', (route) => {
    const request = route.request();
    verificationRequests.push({ method: request.method(), url: request.url(), body: request.postData() });
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
    });
  });

  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  await page.getByLabel('Already purchased? Paste your license').fill('test-license-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Unlocked', { exact: true })).toBeVisible();
  await expect.poll(() => verificationRequests.length).toBe(1);

  const request = verificationRequests[0]!;
  const url = new URL(request.url);
  expect(request.method).toBe('GET');
  expect(url.origin).toBe('https://api.sociobot.in');
  expect(url.pathname).toBe('/api/v1/products/medication-handoff-card/verify');
  expect([...url.searchParams.keys()]).toEqual(['license']);
  expect(url.searchParams.get('license')).toBe('test-license-token');
  expect(request.body).toBeNull();
  expect(decodeURIComponent(`${url.pathname}${url.search}`)).not.toMatch(/Evelyn|Jordan|Lisinopril|Metformin|Vitamin D3/i);
  await page.goto('/privacy');
  await expect(page.getByText('When you verify a paid license, the app sends only the license token and product name to the Sociobot billing API.')).toBeVisible();
  await expect(page.getByText('It sends no card details.')).toBeVisible();
});

test('@claim:revoked-license-lock locks encrypted backups when verification reports a revoked license', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:medication-handoff-card', 'previously-valid-token');
    localStorage.setItem('sb_license_verdict:medication-handoff-card', JSON.stringify({ valid: true, checkedAt: Date.now() - 172_800_000 }));
  });
  await page.route('https://api.sociobot.in/api/v1/products/medication-handoff-card/verify**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null })
  }));

  await page.goto('/demo');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:medication-handoff-card') ?? '{}').valid)).toBe(false);
  await expect(page.getByRole('status')).toContainText('License no longer active.');
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  await expect(page.getByText('Locked', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download JSON' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download encrypted backup' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Unlock encrypted backups — $12' })).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByText('If license verification reports a revoked license, encrypted backups lock again.')).toBeVisible();
});

test('keeps encrypted backup locked when a first-time license verification is rate limited', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/medication-handoff-card/verify**', (route) => route.fulfill({
    status: 429,
    headers: { 'retry-after': '4' },
    contentType: 'application/json',
    body: JSON.stringify({ error: 'rate_limited' })
  }));
  await page.goto('/demo?license=qa-new-license-with-no-verdict');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:medication-handoff-card'))).toBe('qa-new-license-with-no-verdict');
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  await expect(page.getByText('Locked', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download encrypted backup' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Unlock encrypted backups — $12' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license_verdict:medication-handoff-card'))).toBeNull();
});

test('@claim:demo-isolation loads sample data separately and can return to an empty real card', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL('/?demo=1');
  await expect(page).toHaveTitle('Demo — Medication Handoff Card');
  await expect(page.getByText('Demo — sample data, nothing is saved to your real card.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lisinopril' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
  await page.getByLabel(/Notes from the label/).fill('Changed only inside the demo.');
  await page.getByRole('button', { name: 'Save change' }).click();
  await expect(page.locator('[data-medication-id="sample-lisinopril"]')).toContainText('Changed only inside the demo.');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await expect(page.locator('[data-medication-id="sample-lisinopril"]')).not.toContainText('Changed only inside the demo.');
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
  await page.getByLabel(/Notes from the label/).fill('This must be discarded on exit.');
  await page.getByRole('button', { name: 'Save change' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByLabel(/Person’s name/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).not.toBeVisible();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
  await expect(page.getByLabel(/Notes from the label/)).toHaveValue('Take as listed on the pharmacy label.');
});

test('@claim:local-record keeps demo health data off the network', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Evelyn Parker' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
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
  await page.getByRole('button', { name: 'Open backup settings' }).click();
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

test('@claim:full-history-backup includes history beyond the 20 visible entries in a downloaded backup', async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  await page.goto('/demo');
  for (let index = 1; index <= 21; index += 1) {
    await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
    await page.getByLabel(/Notes from the label/).fill(`Checked update ${index}.`);
    await page.getByRole('button', { name: 'Save change' }).click();
    await expect(page.getByRole('dialog', { name: 'Edit medicine' })).toBeHidden();
  }
  await expect(page.getByText('The 20 latest entries are shown. All history is included in backups.')).toBeVisible();
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  const download = await downloadPromise;
  const downloadedPath = await download.path();
  if (!downloadedPath) throw new Error('Full-history backup download was not written.');
  const backup = JSON.parse(await readFile(downloadedPath, 'utf8')) as { changes: Array<{ kind: string; details: string }> };
  expect(backup.changes).toHaveLength(23);
  expect(backup.changes.filter((change) => change.kind === 'updated')).toHaveLength(21);
  expect(backup.changes.map((change) => change.details)).toContain('Changed notes.');
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
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
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
  await page.getByRole('button', { name: 'Open backup settings' }).click();
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

  await page.getByRole('button', { name: 'Open backup settings' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('not valid json') });
  await expect(page.getByRole('status')).toContainText('not readable JSON');
  await expect(page.getByRole('status')).toContainText('Choose a Medication Handoff Card');
});

test('shows keyboard focus on restore and gives every reported 390px link a 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open backup settings' }).click();
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
  const settingsLinkSizes = await page.locator('.fine-print a').evaluateAll((links) => links.map((link) => {
    const box = link.getBoundingClientRect();
    return { text: link.textContent, width: box.width, height: box.height };
  }));
  expect(settingsLinkSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
  await page.getByRole('button', { name: 'Close settings' }).click();
  const sizes = await page.locator('.brand, .site-nav a, footer nav a').evaluateAll((links) => links.map((link) => {
    const box = link.getBoundingClientRect();
    return { text: link.textContent, width: box.width, height: box.height };
  }));
  expect(sizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
});

test('wraps maximum-length card values on a 390px screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
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
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  await page.getByRole('button', { name: /Use (dark|light) theme/ }).click();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toMatch(/light|dark/);
  await page.getByRole('button', { name: 'Close settings' }).click();
  const duration = await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().evaluate((element) => getComputedStyle(element).transitionDuration);
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
  await page.goto('/privacy');
  await expect(page.getByText('Checkout starts at Sociobot and redirects to Dodo.')).toBeVisible();
});

test('@claim:core-features-free keeps the card, print view, and JSON backup available without a license', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: 'Print / PDF' })).toBeEnabled();
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  await downloadPromise;
  await expect(page.getByText('Locked', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Unlock encrypted backups — $12' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/medication-handoff-card/checkout');
});

test('@claim:non-clinical-scope presents a record-only medication workflow', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('No interaction checks or dose recommendations.')).toBeVisible();
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
  await expect(page.getByLabel('Medicine name')).toBeVisible();
  await expect(page.getByLabel('Dose or strength')).toBeVisible();
  await expect(page.getByLabel('When taken')).toBeVisible();
  await expect(page.getByLabel('Prescriber')).toBeVisible();
  await expect(page.getByRole('button', { name: /interaction|recommend/i })).toHaveCount(0);
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.print-sheet')).toContainText('does not check interactions or whether a medicine or dose is right');
});

test('@claim:no-account-or-cloud-copy keeps a demo edit local and offers no account or sync action', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
  await page.getByLabel(/Notes from the label/).fill('Reviewed on this device.');
  await page.getByRole('button', { name: 'Save change' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  await expect(page.getByRole('link', { name: /sign in|account|sync/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /sign in|account|sync/i })).toHaveCount(0);
});

test('@claim:plain-json-readable downloads backup text with the sample owner and medicine', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open backup settings' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  const download = await downloadPromise;
  const downloadedPath = await download.path();
  if (!downloadedPath) throw new Error('Plain JSON backup download was not written.');
  const backup = JSON.parse(await readFile(downloadedPath, 'utf8')) as { profile: { personName: string }; medications: Array<{ name: string }> };
  expect(backup.profile.personName).toBe('Evelyn Parker');
  expect(backup.medications.map((medicine) => medicine.name)).toContain('Lisinopril');
});

test('shows required landing sections and product identity metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open backup settings' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
  await expect(page.locator('.how-it-works li')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Protect backups with a passphrase' })).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card-1200x630\.webp$/);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180');
});
