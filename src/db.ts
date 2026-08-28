import type { BackupData, ChangeEntry, Medication, Profile } from './types';
import { blankProfile } from './types';

const DB_NAME = 'medication-handoff-card';
const DB_VERSION = 1;
const STORES = ['profile', 'medications', 'changes'] as const;
type StoreName = (typeof STORES)[number];

let database: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (database) return database;
  database = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('medications')) db.createObjectStore('medications', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('changes')) {
        const store = db.createObjectStore('changes', { keyPath: 'id' });
        store.createIndex('at', 'at');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('This browser could not open private local storage.'));
    request.onblocked = () => reject(new Error('Close other open copies of the app, then reload.'));
  });
  return database;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local storage operation failed.'));
  });
}

async function store(name: StoreName, mode: IDBTransactionMode = 'readonly') {
  return (await openDatabase()).transaction(name, mode).objectStore(name);
}

export async function getProfile(): Promise<Profile> {
  return (await requestResult((await store('profile')).get('profile'))) as Profile | undefined ?? blankProfile();
}

export async function saveProfile(profile: Profile): Promise<void> {
  await requestResult((await store('profile', 'readwrite')).put(profile));
}

export async function getMedications(): Promise<Medication[]> {
  const values = await requestResult((await store('medications')).getAll()) as Medication[];
  return values.sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveMedication(medication: Medication): Promise<void> {
  await requestResult((await store('medications', 'readwrite')).put(medication));
}

export async function removeMedication(id: string): Promise<void> {
  await requestResult((await store('medications', 'readwrite')).delete(id));
}

export async function getChanges(): Promise<ChangeEntry[]> {
  const values = await requestResult((await store('changes')).getAll()) as ChangeEntry[];
  return values.sort((a, b) => b.at.localeCompare(a.at));
}

export async function addChange(change: ChangeEntry): Promise<void> {
  await requestResult((await store('changes', 'readwrite')).put(change));
}

export async function replaceAll(data: BackupData): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction([...STORES], 'readwrite');
  for (const name of STORES) transaction.objectStore(name).clear();
  transaction.objectStore('profile').put(data.profile);
  data.medications.forEach((item) => transaction.objectStore('medications').put(item));
  data.changes.forEach((item) => transaction.objectStore('changes').put(item));
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not restore this backup.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Restore was cancelled.'));
  });
}
