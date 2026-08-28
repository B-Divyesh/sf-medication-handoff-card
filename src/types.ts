export type ChangeKind = 'added' | 'updated' | 'stopped' | 'confirmed';

export interface Medication {
  id: string;
  name: string;
  dose: string;
  timing: string;
  prescriber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeEntry {
  id: string;
  kind: ChangeKind;
  medicineId?: string;
  title: string;
  details: string;
  by: string;
  at: string;
}

export interface Profile {
  id: 'profile';
  personName: string;
  caregiverName: string;
  lastConfirmed: string;
  confirmedBy: string;
  updatedAt: string;
}

export interface BackupData {
  format: 'medication-handoff-card';
  version: 1;
  exportedAt: string;
  profile: Profile;
  medications: Medication[];
  changes: ChangeEntry[];
}

export const blankProfile = (): Profile => ({
  id: 'profile',
  personName: '',
  caregiverName: '',
  lastConfirmed: '',
  confirmedBy: '',
  updatedAt: new Date().toISOString()
});
