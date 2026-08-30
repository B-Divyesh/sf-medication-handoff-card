import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const origin = process.env.LIVE_URL ?? 'https://medication-handoff-card.sociobot.in';
const evidenceDir = process.env.EVIDENCE_DIR ?? '.factory/evidence/polish-4-live';
const results = {};
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch();
const pageErrors = [];
const attachErrors = (page, label) => {
  page.on('pageerror', (error) => pageErrors.push(`${label}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(`${label}: ${message.text()}`);
  });
};

try {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await mobile.newPage();
  attachErrors(page, 'mobile');
  const appRequests = [];
  page.on('request', (request) => appRequests.push(request.url()));

  const homeResponse = await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
  assert.equal(homeResponse?.status(), 200);
  assert.equal(await page.title(), 'Medication Handoff Card — share a clear medicine list');
  assert.equal(await page.locator('h1').count(), 1);
  await page.getByText('For adult children, caregivers, and older adults sharing a checked list with family or clinicians.').waitFor();
  const demoLink = page.getByRole('link', { name: 'Try it with sample data' });
  const demoLinkBox = await demoLink.boundingBox();
  assert(demoLinkBox && demoLinkBox.y + demoLinkBox.height <= 844);
  await page.screenshot({ path: `${evidenceDir}/home-mobile-cold.png`, fullPage: true });

  await demoLink.click();
  assert.equal(page.url(), `${origin}/?demo=1`);
  await page.getByText('Demo — sample data, nothing is saved to your real card.').waitFor();
  await page.getByRole('button', { name: 'Reset demo' }).waitFor();
  await page.getByRole('link', { name: 'Start for real' }).waitFor();
  await page.getByRole('heading', { level: 1, name: 'Evelyn Parker' }).waitFor();
  const sampleBox = await page.locator('.demo-medicine').boundingBox();
  assert(sampleBox && sampleBox.y + sampleBox.height <= 844);
  await page.screenshot({ path: `${evidenceDir}/demo-mobile-cold.png`, fullPage: true });

  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
  await page.getByLabel(/Notes from the label/).fill('Live round-four isolation check.');
  await page.getByRole('button', { name: 'Save change' }).click();
  await page.locator('[data-medication-id="sample-lisinopril"]', { hasText: 'Live round-four isolation check.' }).waitFor();
  assert.match(await page.locator('[data-medication-id="sample-lisinopril"]').innerText(), /Live round-four isolation check/);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.locator('[data-medication-id="sample-lisinopril"]', { hasText: 'Take as listed on the pharmacy label.' }).waitFor();
  assert.doesNotMatch(await page.locator('[data-medication-id="sample-lisinopril"]').innerText(), /Live round-four isolation check/);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByLabel(/Person’s name/).waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Evelyn Parker' }).count(), 0);
  await page.goto(`${origin}/demo`);
  await page.getByRole('button', { name: 'Edit Lisinopril', exact: true }).first().click();
  assert.equal(await page.getByLabel(/Notes from the label/).inputValue(), 'Take as listed on the pharmacy label.');
  await page.getByRole('button', { name: 'Cancel' }).click();
  assert(appRequests.every((url) => new URL(url).origin === origin));
  results['first-screen-and-demo'] = 'pass';
  results['demo-isolation'] = 'pass';
  await mobile.close();

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const routePage = await desktop.newPage();
  attachErrors(routePage, 'routes');
  await routePage.goto(`${origin}/`);
  await routePage.getByRole('link', { name: 'Privacy' }).first().click();
  assert.equal(routePage.url(), `${origin}/privacy`);
  assert.equal(await routePage.title(), 'Privacy — Medication Handoff Card');
  assert.equal(await routePage.locator('link[rel="canonical"]').getAttribute('href'), `${origin}/privacy`);
  assert.equal(await routePage.getByRole('heading', { level: 1, name: 'Privacy' }).evaluate((element) => element === document.activeElement), true);
  assert.equal(await routePage.locator('#route-announcer').textContent(), 'Privacy page');
  await routePage.getByText('When you verify a paid license, the app sends only the license token and product name to the Sociobot billing API.').waitFor();
  await routePage.getByText('Checkout starts at Sociobot and redirects to Dodo.').waitFor();
  assert.equal(await routePage.getByText(/merchant of record|handles payment and refunds|refund revokes/i).count(), 0);
  await routePage.screenshot({ path: `${evidenceDir}/privacy-desktop.png`, fullPage: true });
  await routePage.goBack();
  assert.equal(await routePage.getByRole('heading', { level: 1, name: 'Make a clear medication handoff card.' }).evaluate((element) => element === document.activeElement), true);
  assert.equal(await routePage.locator('#route-announcer').textContent(), 'Medication handoff card');

  await routePage.goto(`${origin}/terms`);
  assert.equal(await routePage.title(), 'Terms — Medication Handoff Card');
  assert.equal(await routePage.locator('link[rel="canonical"]').getAttribute('href'), `${origin}/terms`);
  await routePage.getByText('If license verification reports a revoked license, encrypted backups lock again.').waitFor();
  assert.equal(await routePage.getByText(/merchant of record|handles payment and refunds|refund revokes/i).count(), 0);
  await routePage.screenshot({ path: `${evidenceDir}/terms-desktop.png`, fullPage: true });

  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await routePage.goto(`${origin}${path}`);
    assert.equal(await routePage.locator('h1').count(), 1);
    assert.equal(await routePage.locator('main').count(), 1);
    const axe = await new AxeBuilder({ page: routePage }).analyze();
    const serious = axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
    if (serious.length) throw new Error(`Axe ${path}: ${JSON.stringify(serious)}`);
  }
  results['routes-metadata-focus'] = 'pass';
  results['axe-home-demo-legal'] = 'pass';
  await desktop.close();

  const privacyContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const privacyPage = await privacyContext.newPage();
  attachErrors(privacyPage, 'license-data');
  const verificationRequests = [];
  await privacyPage.route('https://api.sociobot.in/api/v1/products/medication-handoff-card/verify**', (route) => {
    const request = route.request();
    verificationRequests.push({ method: request.method(), url: request.url(), body: request.postData() });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await privacyPage.goto(`${origin}/demo`);
  await privacyPage.getByRole('button', { name: 'Open backup settings' }).click();
  await privacyPage.getByLabel('Already purchased? Paste your license').fill('live-recheck-token');
  await privacyPage.getByRole('button', { name: 'Verify license' }).click();
  await privacyPage.getByText('Unlocked', { exact: true }).waitFor();
  assert.equal(verificationRequests.length, 1);
  const verification = verificationRequests[0];
  const verificationUrl = new URL(verification.url);
  assert.equal(verification.method, 'GET');
  assert.equal(verificationUrl.pathname, '/api/v1/products/medication-handoff-card/verify');
  assert.deepEqual([...verificationUrl.searchParams.keys()], ['license']);
  assert.equal(verificationUrl.searchParams.get('license'), 'live-recheck-token');
  assert.equal(verification.body, null);
  assert.doesNotMatch(decodeURIComponent(verification.url), /Evelyn|Jordan|Lisinopril|Metformin|Vitamin D3/i);
  results['license-verification-data'] = 'pass';
  await privacyContext.close();

  const revokedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await revokedContext.addInitScript(() => {
    localStorage.setItem('sb_license:medication-handoff-card', 'previously-valid-token');
    localStorage.setItem('sb_license_verdict:medication-handoff-card', JSON.stringify({ valid: true, checkedAt: Date.now() - 172_800_000 }));
  });
  const revokedPage = await revokedContext.newPage();
  attachErrors(revokedPage, 'revoked-license');
  await revokedPage.route('https://api.sociobot.in/api/v1/products/medication-handoff-card/verify**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null }) }));
  await revokedPage.goto(`${origin}/demo`);
  await revokedPage.waitForFunction(() => JSON.parse(localStorage.getItem('sb_license_verdict:medication-handoff-card') ?? '{}').valid === false);
  await revokedPage.getByRole('button', { name: 'Open backup settings' }).click();
  await revokedPage.getByText('Locked', { exact: true }).waitFor();
  assert.equal(await revokedPage.getByRole('button', { name: 'Download encrypted backup' }).count(), 0);
  await revokedPage.getByRole('button', { name: 'Download JSON' }).waitFor();
  await revokedPage.screenshot({ path: `${evidenceDir}/revoked-license-mobile.png`, fullPage: true });
  results['revoked-license-lock'] = 'pass';
  await revokedContext.close();

  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const offlinePage = await offlineContext.newPage();
  attachErrors(offlinePage, 'offline');
  await offlinePage.goto(`${origin}/demo`);
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.evaluate(() => navigator.serviceWorker.controller || new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })));
  await offlinePage.reload();
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  await offlinePage.getByRole('heading', { name: 'Evelyn Parker' }).waitFor();
  await offlinePage.getByText(/Offline:/).waitFor();
  await offlinePage.screenshot({ path: `${evidenceDir}/demo-offline-mobile.png`, fullPage: true });
  results['offline-reload'] = 'pass';
  await offlineContext.setOffline(false);
  await offlineContext.close();

  const notFoundContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const notFoundPage = await notFoundContext.newPage();
  attachErrors(notFoundPage, '404');
  const notFoundResponse = await notFoundPage.goto(`${origin}/polish-4-not-found`);
  assert.equal(notFoundResponse?.status(), 404);
  assert.equal(await notFoundPage.title(), 'Page not found — Medication Handoff Card');
  assert.equal(await notFoundPage.locator('h1').count(), 1);
  await notFoundPage.getByRole('link', { name: 'Privacy' }).waitFor();
  await notFoundPage.getByRole('link', { name: 'Terms' }).waitFor();
  const notFoundAxe = await new AxeBuilder({ page: notFoundPage }).analyze();
  assert.deepEqual(notFoundAxe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => item.id), []);
  await notFoundPage.screenshot({ path: `${evidenceDir}/not-found-mobile.png`, fullPage: true });
  results['http-404'] = 'pass';
  await notFoundContext.close();

  const checkout = await fetch('https://api.sociobot.in/api/v1/products/medication-handoff-card/checkout', { redirect: 'manual' });
  assert.equal(checkout.status, 303);
  assert.match(checkout.headers.get('location') ?? '', /^https:\/\/checkout\.dodopayments\.com\/session\//);
  results['checkout-redirect'] = 'pass';

  const localHtml = await readFile('dist/index.html', 'utf8');
  const scriptPath = localHtml.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
  assert(scriptPath);
  const localScript = await readFile(`dist${scriptPath}`);
  const liveScriptResponse = await fetch(`${origin}${scriptPath}`);
  assert.equal(liveScriptResponse.status, 200);
  const liveScript = Buffer.from(await liveScriptResponse.arrayBuffer());
  const digest = (value) => createHash('sha256').update(value).digest('hex');
  assert.equal(digest(liveScript), digest(localScript));
  results['deployed-bundle-sha256'] = digest(liveScript);
  assert.deepEqual(pageErrors, []);
  results['console-and-page-errors'] = 'pass';
  await writeFile(`${evidenceDir}/live-recheck.json`, `${JSON.stringify({ origin, checkedAt: new Date().toISOString(), results }, null, 2)}\n`);
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
