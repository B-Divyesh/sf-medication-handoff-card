import { describe, expect, it } from 'vitest';
import { blankProfile, type BackupData } from '../src/types';
import { isBackupData, requireBackupData } from '../src/validation';

const valid: BackupData = {
  format: 'medication-handoff-card',
  version: 1,
  exportedAt: '2026-08-29T12:00:00.000Z',
  profile: { ...blankProfile(), personName: 'Ruth' },
  medications: [{
    id: 'medicine-1', name: 'Lisinopril', dose: '10 mg', timing: 'Morning',
    prescriber: '', notes: '', createdAt: '2026-08-29T12:00:00.000Z', updatedAt: '2026-08-29T12:00:00.000Z'
  }],
  changes: [{ id: 'change-1', kind: 'added', medicineId: 'medicine-1', title: 'Lisinopril added', details: '10 mg', by: '', at: '2026-08-29T12:00:00.000Z' }]
};

describe('backup validation', () => {
  it('accepts a complete version 1 backup', () => {
    expect(isBackupData(valid)).toBe(true);
  });

  it('rejects the profile-only object that corrupted the released candidate', () => {
    const malformed = { ...valid, profile: { id: 'profile' } };
    expect(isBackupData(malformed)).toBe(false);
    expect(() => requireBackupData(malformed)).toThrow('incomplete or has invalid fields');
  });

  it('rejects malformed nested medicines, history, dates, and duplicate ids', () => {
    expect(isBackupData({ ...valid, medications: [{ ...valid.medications[0], notes: 12 }] })).toBe(false);
    expect(isBackupData({ ...valid, changes: [{ ...valid.changes[0], kind: 'deleted' }] })).toBe(false);
    expect(isBackupData({ ...valid, exportedAt: 'yesterday' })).toBe(false);
    expect(isBackupData({ ...valid, medications: [valid.medications[0], valid.medications[0]] })).toBe(false);
  });
});
