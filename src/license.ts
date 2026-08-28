const SLUG = 'medication-handoff-card';
const TOKEN_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const API_BASE = 'https://api.sociobot.in/api/v1';
const DAY = 86_400_000;

interface CachedVerdict { valid: boolean; checkedAt: number }

export const checkoutUrl = `${API_BASE}/products/${SLUG}/checkout`;

export function captureReturnedLicense(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function storeLicense(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function cachedUnlock(): boolean {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as CachedVerdict;
    return verdict.valid;
  } catch {
    return true;
  }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; message?: string }> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { valid: false };
  try {
    const previous = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as CachedVerdict;
    if (!force && Date.now() - previous.checkedAt < DAY) return { valid: previous.valid };
  } catch { /* first verification */ }

  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid: boolean; reason?: string };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { valid: result.valid, message: result.valid ? undefined : 'License no longer active.' };
  } catch {
    return { valid: cachedUnlock(), message: 'Could not recheck the license while offline. Cached access is unchanged.' };
  }
}
