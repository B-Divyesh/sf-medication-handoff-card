import type { BackupData } from './types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array): string {
  let result = '';
  for (const byte of bytes) result += String.fromCharCode(byte);
  return btoa(result);
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const source = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 250_000 },
    source,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptBackup(data: BackupData, passphrase: string): Promise<string> {
  if (passphrase.length < 10) throw new Error('Use a passphrase of at least 10 characters.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(data)));
  return JSON.stringify({
    format: 'medication-handoff-card-encrypted',
    version: 1,
    algorithm: 'AES-GCM',
    kdf: 'PBKDF2-SHA-256-250000',
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(encrypted))
  });
}

export async function decryptBackup(contents: string, passphrase: string): Promise<BackupData> {
  const envelope = JSON.parse(contents) as Record<string, unknown>;
  if (envelope.format !== 'medication-handoff-card-encrypted' || typeof envelope.salt !== 'string' || typeof envelope.iv !== 'string' || typeof envelope.data !== 'string') {
    throw new Error('This is not a Medication Handoff Card encrypted backup.');
  }
  try {
    const salt = base64ToBytes(envelope.salt);
    const iv = base64ToBytes(envelope.iv);
    const key = await deriveKey(passphrase, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(envelope.data));
    return JSON.parse(decoder.decode(decrypted)) as BackupData;
  } catch {
    throw new Error('That passphrase did not open this backup.');
  }
}
