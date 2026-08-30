import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectFile = (path: string) => resolve(process.cwd(), path);

describe('static deployment regressions', () => {
  it('enforces a restrictive CSP for the local-first app', async () => {
    const config = JSON.parse(await readFile(projectFile('public/staticwebapp.config.json'), 'utf8')) as { globalHeaders: Record<string, string> };
    const csp = config.globalHeaders['Content-Security-Policy'];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("connect-src 'self' https://api.sociobot.in");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it('configures immutable assets, known SPA routes, manifest MIME, and a real 404 page', async () => {
    const config = JSON.parse(await readFile(projectFile('public/staticwebapp.config.json'), 'utf8')) as {
      routes: Array<{ route: string; headers?: Record<string, string>; rewrite?: string }>;
      mimeTypes: Record<string, string>;
      responseOverrides: Record<string, { rewrite: string }>;
      navigationFallback?: unknown;
    };
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers?.['Cache-Control']).toContain('immutable');
    for (const route of ['/demo', '/privacy', '/terms']) {
      expect(config.routes.find((entry) => entry.route === route)?.rewrite).toBe('/index.html');
    }
    expect(config.navigationFallback).toBeUndefined();
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.responseOverrides['404']?.rewrite).toBe('/404.html');
    const notFound = await readFile(projectFile('public/404.html'), 'utf8');
    expect(notFound).toContain('That page is not here.');
    expect(notFound).toContain('rel="canonical" href="https://medication-handoff-card.sociobot.in/404"');
    expect(notFound).toContain('property="og:title" content="Page not found — Medication Handoff Card"');
    expect(notFound).toContain('href="/favicon.svg"');
    expect(notFound).toContain('<header class="site-header">');
    expect(notFound).toContain('href="/privacy"');
    expect(notFound).toContain('href="/terms"');
  });

  it('ships dedicated social and app identity assets with exact dimensions', async () => {
    const html = await readFile(projectFile('index.html'), 'utf8');
    expect(html).toContain('/assets/social-card-1200x630.webp');
    expect(html).toContain('og:image:width" content="1200');
    expect(html).toContain('/assets/apple-touch-icon.png');
    expect(html).toContain('/favicon.svg');
    await expect(readFile(projectFile('public/favicon.svg'), 'utf8')).resolves.toContain('<svg');
    expect((await readFile(projectFile('public/assets/apple-touch-icon.png'))).byteLength).toBeGreaterThan(1_000);
  });

  it('versions the app shell for this repair so installed cards receive the update', async () => {
    await expect(readFile(projectFile('public/sw.js'), 'utf8')).resolves.toContain("const VERSION = 'mhc-v11'");
    await expect(readFile(projectFile('public/manifest.webmanifest'), 'utf8')).resolves.toContain('"start_url": "/?v=10"');
  });

  it('maps every declared claim to exactly one tagged browser test', async () => {
    const claims = JSON.parse(await readFile(projectFile('.factory/claims.json'), 'utf8')) as Array<{ id: string; test: string }>;
    const browserTests = await readFile(projectFile('tests/e2e/app.spec.ts'), 'utf8');
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(browserTests.split(tag)).toHaveLength(2);
      expect(claim.test).toContain(`--grep ${tag}`);
    }
    const taggedIds = [...browserTests.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(taggedIds.sort()).toEqual(claims.map(({ id }) => id).sort());
  });
});
