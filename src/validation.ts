import type { BackupData, ChangeEntry, Medication, Profile } from './types';

const CHANGE_KINDS = new Set(['added', 'updated', 'stopped', 'confirmed']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown, maximum: number, required = false): value is string {
  return typeof value === 'string' && value.length <= maximum && (!required || value.trim().length > 0);
}

function isDate(value: unknown, optional = false): value is string {
  return typeof value === 'string' && ((optional && value === '') || (!Number.isNaN(Date.parse(value)) && /^\d{4}-\d{2}-\d{2}T/.test(value)));
}

export function isProfile(value: unknown): value is Profile {
  if (!isRecord(value)) return false;
  return value.id === 'profile'
    && isString(value.personName, 80)
    && isString(value.caregiverName, 80)
    && isDate(value.lastConfirmed, true)
    && isString(value.confirmedBy, 80)
    && isDate(value.updatedAt);
}

export function isMedication(value: unknown): value is Medication {
  if (!isRecord(value)) return false;
  return isString(value.id, 200, true)
    && isString(value.name, 120, true)
    && isString(value.dose, 80, true)
    && isString(value.timing, 120, true)
    && isString(value.prescriber, 120)
    && isString(value.notes, 300)
    && isDate(value.createdAt)
    && isDate(value.updatedAt);
}

export function isChangeEntry(value: unknown): value is ChangeEntry {
  if (!isRecord(value)) return false;
  return isString(value.id, 200, true)
    && typeof value.kind === 'string' && CHANGE_KINDS.has(value.kind)
    && (value.medicineId === undefined || isString(value.medicineId, 200, true))
    && isString(value.title, 240, true)
    && isString(value.details, 500)
    && isString(value.by, 80)
    && isDate(value.at);
}

export function isBackupData(value: unknown): value is BackupData {
  if (!isRecord(value)
    || value.format !== 'medication-handoff-card'
    || value.version !== 1
    || !isDate(value.exportedAt)
    || !isProfile(value.profile)
    || !Array.isArray(value.medications)
    || !Array.isArray(value.changes)
    || value.medications.length > 1_000
    || value.changes.length > 10_000
    || !value.medications.every(isMedication)
    || !value.changes.every(isChangeEntry)) return false;

  const medicationIds = new Set(value.medications.map((item) => item.id));
  const changeIds = new Set(value.changes.map((item) => item.id));
  return medicationIds.size === value.medications.length && changeIds.size === value.changes.length;
}

export function requireBackupData(value: unknown): BackupData {
  if (!isBackupData(value)) {
    throw new Error('This backup is incomplete or has invalid fields. Choose a Medication Handoff Card .json or .mhc backup.');
  }
  return value;
}
