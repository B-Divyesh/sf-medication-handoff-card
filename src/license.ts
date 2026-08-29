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
  if (!localStorage.getItem(TOKEN_KEY)) return false;
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as CachedVerdict;
    // A token is not an entitlement. It can unlock the paid backup only after
    // this device has received and stored an explicit valid verdict.
    return verdict.valid === true && Number.isFinite(verdict.checkedAt);
  } catch {
    return false;
  }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; message?: string }> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { valid: false };
  try {
    const previous = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as CachedVerdict;
    if (!force && typeof previous.valid === 'boolean' && Number.isFinite(previous.checkedAt) && Date.now() - previous.checkedAt < DAY) return { valid: previous.valid };
  } catch { /* first verification */ }

  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid: boolean; reason?: string };
    const valid = result.valid === true;
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid, checkedAt: Date.now() }));
    return { valid, message: valid ? undefined : 'License no longer active.' };
  } catch {
    const valid = cachedUnlock();
    return {
      valid,
      message: valid
        ? 'Could not recheck the license while offline. Cached verified access is unchanged.'
        : 'Could not verify this license. Encrypted backups stay locked until it can be verified.'
    };
  }
}
