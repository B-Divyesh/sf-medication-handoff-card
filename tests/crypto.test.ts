import { describe, expect, it } from 'vitest';
import { decryptBackup, encryptBackup } from '../src/crypto';
import { blankProfile, type BackupData } from '../src/types';

const backup: BackupData = {
  format: 'medication-handoff-card',
  version: 1,
  exportedAt: '2026-08-28T10:00:00.000Z',
  profile: { ...blankProfile(), personName: 'Ruth', caregiverName: 'Maya' },
  medications: [{ id: '1', name: 'Example medicine', dose: '10 mg', timing: 'Morning', prescriber: 'Dr. Lee', notes: '', createdAt: '2026-08-28T10:00:00.000Z', updatedAt: '2026-08-28T10:00:00.000Z' }],
  changes: []
};

describe('encrypted backups', () => {
  it('round trips a record with AES-GCM', async () => {
    const encrypted = await encryptBackup(backup, 'a strong family passphrase');
    expect(encrypted).not.toContain('Example medicine');
    await expect(decryptBackup(encrypted, 'a strong family passphrase')).resolves.toEqual(backup);
  });

  it('rejects short or incorrect passphrases', async () => {
    await expect(encryptBackup(backup, 'short')).rejects.toThrow('at least 10 characters');
    const encrypted = await encryptBackup(backup, 'correct passphrase');
    await expect(decryptBackup(encrypted, 'incorrect passphrase')).rejects.toThrow('did not open');
  });
});
