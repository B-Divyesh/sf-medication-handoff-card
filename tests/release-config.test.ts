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

  it('configures immutable hashed assets, manifest MIME, and a real 404 page', async () => {
    const config = JSON.parse(await readFile(projectFile('public/staticwebapp.config.json'), 'utf8')) as {
      routes: Array<{ route: string; headers: Record<string, string> }>;
      mimeTypes: Record<string, string>;
      responseOverrides: Record<string, { rewrite: string }>;
    };
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers['Cache-Control']).toContain('immutable');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.responseOverrides['404']?.rewrite).toBe('/404.html');
    await expect(readFile(projectFile('public/404.html'), 'utf8')).resolves.toContain('That page is not here.');
  });
});
