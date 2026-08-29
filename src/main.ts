import './styles.css';
import { addChange, clearAll, getChanges, getMedications, getProfile, removeMedication, replaceAll, saveMedication, saveProfile, useStorageNamespace } from './db';
import { decryptBackup, encryptBackup } from './crypto';
import { blankProfile, type BackupData, type ChangeEntry, type Medication, type Profile } from './types';
import { cachedUnlock, captureReturnedLicense, checkoutUrl, storeLicense, verifyLicense } from './license';

type DialogName = 'medicine' | 'stop' | 'confirm' | 'settings' | null;

interface AppState {
  profile: Profile;
  medications: Medication[];
  changes: ChangeEntry[];
  editingMedication?: Medication;
  stoppingMedication?: Medication;
  profileEditing: boolean;
  openDialog: DialogName;
  paid: boolean;
  notice: string;
  error: string;
  demo: boolean;
  returnFocus?: string;
}

const state: AppState = {
  profile: blankProfile(),
  medications: [],
  changes: [],
  profileEditing: false,
  openDialog: null,
  paid: cachedUnlock(),
  notice: '',
  error: '',
  demo: false
};

const app = document.querySelector<HTMLDivElement>('#app')!;
const escaped = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
const displayDate = (value: string, withTime = false) => value ? new Intl.DateTimeFormat(undefined, withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }).format(new Date(value)) : 'Not yet confirmed';
const isoNow = () => new Date().toISOString();
const uid = () => crypto.randomUUID();

function sampleBackup(): BackupData {
  const created = '2026-08-26T14:30:00.000Z';
  const confirmed = '2026-08-28T09:15:00.000Z';
  const profile: Profile = { id: 'profile', personName: 'Evelyn Parker', caregiverName: 'Jordan Parker', lastConfirmed: confirmed, confirmedBy: 'Jordan Parker', updatedAt: confirmed };
  const lisinopril: Medication = { id: 'sample-lisinopril', name: 'Lisinopril', dose: '10 mg', timing: 'Each morning', prescriber: 'Dr. Nina Shah', notes: 'Take as listed on the pharmacy label.', createdAt: created, updatedAt: created };
  const metformin: Medication = { id: 'sample-metformin', name: 'Metformin ER', dose: '500 mg', timing: 'With evening meal', prescriber: 'Dr. Nina Shah', notes: '', createdAt: created, updatedAt: created };
  const vitamin: Medication = { id: 'sample-vitamin-d', name: 'Vitamin D3', dose: '1,000 IU', timing: 'Each morning', prescriber: 'Not recorded', notes: 'Over-the-counter item.', createdAt: created, updatedAt: created };
  return {
    format: 'medication-handoff-card', version: 1, exportedAt: confirmed, profile, medications: [lisinopril, metformin, vitamin],
    changes: [
      { id: 'sample-confirmed', kind: 'confirmed', title: 'Current list confirmed', details: '3 medicines checked.', by: 'Jordan Parker', at: confirmed },
      { id: 'sample-added', kind: 'added', medicineId: vitamin.id, title: 'Vitamin D3 added', details: '1,000 IU · Each morning', by: 'Jordan Parker', at: created }
    ]
  };
}

function icon(name: 'plus' | 'print' | 'settings' | 'edit' | 'stop' | 'check' | 'lock' | 'download' | 'moon'): string {
  const paths = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    print: '<path d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
    edit: '<path d="m4 16-.8 4.8L8 20 19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
    stop: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>',
    moon: '<path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5z"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  return `
    <header class="site-header legal-header">
      <a class="brand" href="/" aria-label="Medication Handoff Card home"><span class="brand-mark" aria-hidden="true">M</span><span>Medication Handoff Card</span></a>
      <nav class="site-nav" aria-label="Main navigation"><a href="/demo">Try demo</a><a href="/privacy">Privacy</a></nav>
      <button class="icon-button" id="theme-toggle" type="button">${icon('moon')}<span>Theme</span></button>
    </header>
    <main id="main-content" class="legal-page">
      <p class="eyebrow">Plain-language policy · Effective 28 August 2026</p>
      <h1>${privacy ? 'Privacy' : 'Terms of use'}</h1>
      ${privacy ? `
        <p class="lede">Your medication record stays in this browser unless you choose to export it.</p>
        <h2>What is stored</h2><p>Names, medication details, confirmation details, and change history are stored in IndexedDB on your device. Your theme choice and optional license token are stored in localStorage.</p>
        <h2>What leaves your device</h2><p>The record itself is never sent to us. When you verify a paid license, only the license token is sent to the Sociobot billing API. The hosted checkout is operated by Sociobot, with Dodo as merchant of record, under their payment privacy terms.</p>
        <h2>Exports and deletion</h2><p>Downloaded backups are controlled by you. Plain JSON backups are readable files. Encrypted backups use your passphrase, which we cannot recover. Clear this site's storage in your browser to delete the local record.</p>
        <h2>Analytics and health data</h2><p>This app includes no advertising, tracking SDK, analytics script, cloud account, or health-data upload. Your browser or hosting provider may keep standard short-lived request logs.</p>
      ` : `
        <p class="lede">This tool helps people communicate a medication list. It does not provide healthcare.</p>
        <h2>Not medical advice</h2><p>Medication Handoff Card does not check interactions, recommend doses, diagnose, dispense, or send alerts. Confirm all medication decisions with a qualified clinician or pharmacist. In an emergency, contact local emergency services.</p>
        <h2>Your responsibility</h2><p>You are responsible for entering, checking, sharing, and safeguarding the record. A printed or exported list can become outdated; always check its confirmation date.</p>
        <h2>One-time unlock</h2><p>The optional $12 one-time purchase unlocks encrypted backups and future convenience extras for this product. Core records, print, and plain export remain free. Sociobot/Dodo is the merchant of record and handles payment and refunds; a refund revokes the associated license.</p>
        <h2>Availability and warranty</h2><p>The software is provided “as is” under the MIT License, without warranty. Local browser data can be lost if site data is cleared, so keep a backup.</p>
      `}
      <p><a class="text-link" href="/">← Return to your card</a></p>
    </main>${footer()}`;
}

function footer(): string {
  return `<footer><p>Your health record stays in this browser during normal use.</p><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="https://github.com/B-Divyesh/sf-medication-handoff-card" rel="noreferrer">Source</a></nav><p class="generation-note">Scene generated for this product; no person or brand is depicted. Built by Param Factory · v1.0.1</p></footer>`;
}

function profileSection(): string {
  if (state.profileEditing || !state.profile.personName) {
    return `<section class="identity-panel" aria-labelledby="identity-heading">
      <div><p class="eyebrow">Card owner</p><h2 id="identity-heading">Whose medicines are these?</h2></div>
      <form id="profile-form" class="identity-form">
        <label><span>Person’s name <b aria-hidden="true">*</b></span><input name="personName" autocomplete="name" required maxlength="80" value="${escaped(state.profile.personName)}"></label>
        <label><span>Person keeping this card</span><input name="caregiverName" autocomplete="name" maxlength="80" value="${escaped(state.profile.caregiverName)}"><small>You, a relative, or the card owner</small></label>
        <div class="form-actions"><button class="button primary" type="submit">Save names</button>${state.profile.personName ? '<button class="button quiet" type="button" data-cancel-profile>Cancel</button>' : ''}</div>
      </form>
    </section>`;
  }
  const confirmedClass = !state.profile.lastConfirmed || Date.now() - new Date(state.profile.lastConfirmed).getTime() > 1000 * 60 * 60 * 24 * 30 ? 'needs-check' : '';
  return `<section class="identity-strip" aria-label="Card details">
    <div><p class="eyebrow">Medication list for</p><h2>${escaped(state.profile.personName)}</h2>${state.profile.caregiverName ? `<p>Card kept by ${escaped(state.profile.caregiverName)}</p>` : ''}</div>
    <div class="confirmation ${confirmedClass}"><span>Last confirmed</span><strong>${displayDate(state.profile.lastConfirmed)}</strong>${state.profile.confirmedBy ? `<small>by ${escaped(state.profile.confirmedBy)}</small>` : '<small>Confirm after checking every item</small>'}</div>
    <button class="button quiet" type="button" data-edit-profile>${icon('edit')} Edit names</button>
  </section>`;
}

function medicationList(): string {
  if (!state.medications.length) {
    return `<div class="empty-scene">
      <picture>
        <source srcset="/assets/hero-kitchen-table-640.webp 640w, /assets/hero-kitchen-table-1280.webp 1280w" sizes="(max-width: 840px) calc(100vw - 32px), 760px" type="image/webp">
        <img src="/assets/hero-kitchen-table.jpg" width="1280" height="853" alt="A blank card, glasses, pill organizer, and unbranded medicine bottles arranged on a quiet kitchen table" fetchpriority="high" decoding="async">
      </picture>
      <div class="empty-copy"><p class="eyebrow">A clear handoff starts here</p><h3>No medicines on this card yet</h3><p>Add exactly what is written on the label. This tool records what you enter; it does not check whether a medicine or dose is right.</p><button class="button primary" type="button" data-add-medication>${icon('plus')} Add first medicine</button></div>
    </div>`;
  }
  return `<ol class="medication-list">${state.medications.map((medication) => `<li class="medication-row" data-medication-id="${medication.id}">
    <div class="medicine-main"><h3>${escaped(medication.name)}</h3><p class="dose">${escaped(medication.dose)}</p></div>
    <div class="medicine-detail"><span>When</span><strong>${escaped(medication.timing)}</strong></div>
    <div class="medicine-detail"><span>Prescriber</span><strong>${escaped(medication.prescriber || 'Not recorded')}</strong></div>
    ${medication.notes ? `<p class="medicine-notes"><span>Note</span>${escaped(medication.notes)}</p>` : ''}
    <div class="row-actions"><button class="button quiet small" type="button" data-edit-medication="${medication.id}">${icon('edit')} Edit</button><button class="button quiet small danger-text" type="button" data-stop-medication="${medication.id}">${icon('stop')} Stop & remove</button></div>
  </li>`).join('')}</ol>`;
}

function changeLog(): string {
  if (!state.changes.length) return `<div class="history-empty"><p>Changes will appear here automatically when you add, edit, or stop a medicine.</p></div>`;
  return `<ol class="change-list">${state.changes.slice(0, 20).map((change) => `<li><span class="change-mark ${change.kind}" aria-hidden="true"></span><div><strong>${escaped(change.title)}</strong><p>${escaped(change.details)}</p><small>${displayDate(change.at, true)}${change.by ? ` · ${escaped(change.by)}` : ''}</small></div></li>`).join('')}</ol>${state.changes.length > 20 ? '<p class="muted">The 20 latest entries are shown. All history is included in backups.</p>' : ''}`;
}

function medicineDialog(): string {
  const med = state.editingMedication;
  return `<dialog id="medicine-dialog" aria-labelledby="medicine-dialog-title"><form id="medicine-form" class="dialog-form">
    <div class="dialog-heading"><p class="eyebrow">Current list</p><h2 id="medicine-dialog-title">${med ? 'Edit medicine' : 'Add medicine'}</h2><p>Copy the label. Ask a clinician or pharmacist if anything is unclear.</p></div>
    <label><span>Medicine name <b aria-hidden="true">*</b></span><input name="name" required maxlength="120" autocomplete="off" value="${escaped(med?.name ?? '')}"></label>
    <div class="field-pair"><label><span>Dose or strength <b aria-hidden="true">*</b></span><input name="dose" required maxlength="80" autocomplete="off" value="${escaped(med?.dose ?? '')}" placeholder="For example, 10 mg"></label><label><span>When taken <b aria-hidden="true">*</b></span><input name="timing" required maxlength="120" autocomplete="off" value="${escaped(med?.timing ?? '')}" placeholder="For example, each morning"></label></div>
    <label><span>Prescriber</span><input name="prescriber" maxlength="120" autocomplete="off" value="${escaped(med?.prescriber ?? '')}" placeholder="Name or clinic"></label>
    <label><span>Notes from the label or clinician</span><textarea name="notes" maxlength="300" rows="3">${escaped(med?.notes ?? '')}</textarea></label>
    <p class="form-note">Required fields are marked <b>*</b>. Do not enter instructions you have not confirmed.</p>
    <div class="form-actions"><button class="button primary" type="submit">${med ? 'Save change' : 'Add to card'}</button><button class="button quiet" type="button" data-close-dialog>Cancel</button></div>
  </form></dialog>`;
}

function stopDialog(): string {
  const med = state.stoppingMedication;
  return `<dialog id="stop-dialog" aria-labelledby="stop-dialog-title"><form id="stop-form" class="dialog-form">
    <div class="dialog-heading"><p class="eyebrow danger-text">Preserve the handoff</p><h2 id="stop-dialog-title">Stop and remove ${escaped(med?.name ?? 'medicine')}?</h2><p>It will leave the current list, but this change stays in history.</p></div>
    <label><span>What changed? <b aria-hidden="true">*</b></span><textarea name="reason" required maxlength="300" rows="3" placeholder="For example, stopped by Dr. Lee on 28 Aug"></textarea></label>
    <div class="form-actions"><button class="button danger" type="submit">Stop & remove</button><button class="button quiet" type="button" data-close-dialog>Keep medicine</button></div>
  </form></dialog>`;
}

function confirmDialog(): string {
  return `<dialog id="confirm-dialog" aria-labelledby="confirm-dialog-title"><form id="confirm-form" class="dialog-form">
    <div class="dialog-heading"><p class="eyebrow">Date the handoff</p><h2 id="confirm-dialog-title">Confirm the current list</h2><p>Only confirm after checking every medicine, dose, and timing against a reliable source.</p></div>
    <label><span>Confirmed by <b aria-hidden="true">*</b></span><input name="confirmedBy" required maxlength="80" autocomplete="name" value="${escaped(state.profile.caregiverName)}"></label>
    <label class="check-label"><input type="checkbox" name="checked" required><span>I checked all ${state.medications.length} current ${state.medications.length === 1 ? 'medicine' : 'medicines'}.</span></label>
    <div class="form-actions"><button class="button success" type="submit">${icon('check')} Confirm today</button><button class="button quiet" type="button" data-close-dialog>Cancel</button></div>
  </form></dialog>`;
}

function settingsDialog(): string {
  return `<dialog id="settings-dialog" class="wide-dialog" aria-labelledby="settings-title"><div class="dialog-form">
    <div class="dialog-heading"><p class="eyebrow">Your data, your copy</p><h2 id="settings-title">Backup & settings</h2><p>Backups include the card owner, current medicines, and full change history.</p></div>
    <section class="settings-section" aria-labelledby="plain-backup"><h3 id="plain-backup">Free backup</h3><p>Plain JSON is readable and portable. Store it somewhere private.</p><div class="inline-actions"><button class="button secondary" type="button" id="export-json">${icon('download')} Download JSON</button><label class="button quiet file-button">Restore a backup<input id="import-file" type="file" accept=".json,.mhc,application/json"></label></div></section>
    <section class="settings-section paid-section" aria-labelledby="secure-backup"><div class="paid-heading"><div><p class="eyebrow">One-time unlock · $12</p><h3 id="secure-backup">Encrypted backup</h3></div><span class="status-chip ${state.paid ? 'unlocked' : ''}">${state.paid ? 'Unlocked' : `${icon('lock')} Locked`}</span></div><p>Protect a backup with a passphrase. Core records, printing, and plain backup stay free.</p>
      ${state.paid ? `<label><span>Backup passphrase</span><input id="backup-passphrase" type="password" minlength="10" autocomplete="new-password" placeholder="At least 10 characters"><small>We cannot recover this passphrase.</small></label><button class="button primary" type="button" id="export-encrypted">${icon('lock')} Download encrypted backup</button>` : `<a class="button primary" href="${checkoutUrl}">Unlock encrypted backups — $12</a><form id="license-form" class="license-form"><label><span>Already purchased? Paste your license</span><input name="license" required autocomplete="off" spellcheck="false"></label><button class="button secondary" type="submit">Verify license</button></form>`}
      <p class="fine-print">One-time purchase. Sociobot/Dodo is the merchant of record and handles refunds. <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></p>
    </section>
    <section class="settings-section"><h3>Appearance</h3><button class="button quiet" type="button" id="theme-toggle-settings">${icon('moon')} Change light or dark theme</button></section>
    <div class="form-actions"><button class="button quiet" type="button" data-close-dialog>Close settings</button></div>
  </div></dialog>`;
}

function printSheet(): string {
  const latest = state.changes.filter((change) => change.kind !== 'confirmed').slice(0, 5);
  return `<section class="print-sheet" aria-hidden="true"><header><p>Medication handoff card</p><h2>${escaped(state.profile.personName || 'Name not entered')}</h2><div class="print-meta"><span><b>Last confirmed:</b> ${displayDate(state.profile.lastConfirmed)}${state.profile.confirmedBy ? ` by ${escaped(state.profile.confirmedBy)}` : ''}</span><span><b>Printed:</b> ${displayDate(isoNow())}</span></div></header>
    <h3>Current medicines</h3>${state.medications.length ? `<table><thead><tr><th>Medicine & dose</th><th>When</th><th>Prescriber / notes</th></tr></thead><tbody>${state.medications.map((m) => `<tr><td><b>${escaped(m.name)}</b><br>${escaped(m.dose)}</td><td>${escaped(m.timing)}</td><td>${escaped(m.prescriber || '—')}${m.notes ? `<br><small>${escaped(m.notes)}</small>` : ''}</td></tr>`).join('')}</tbody></table>` : '<p>No medicines recorded.</p>'}
    ${latest.length ? `<h3>Recent changes</h3><ul>${latest.map((change) => `<li><b>${displayDate(change.at)} — ${escaped(change.title)}:</b> ${escaped(change.details)}</li>`).join('')}</ul>` : ''}
    <footer><p><b>Check before use:</b> This is a communication record, not medical advice. It does not check interactions or whether a medicine or dose is right. Confirm changes with a qualified clinician or pharmacist.</p></footer></section>`;
}

function appPage(): string {
  return `<header class="site-header"><a class="brand" href="/" aria-label="Medication Handoff Card home"><span class="brand-mark" aria-hidden="true">M</span><span>Medication Handoff Card</span></a><nav class="site-nav" aria-label="Main navigation"><a href="/demo">Try demo</a><a href="/privacy">Privacy</a></nav><div class="header-actions"><button class="icon-button" type="button" id="print-button" ${!state.profile.personName ? 'disabled' : ''}>${icon('print')}<span>Print / PDF</span></button><button class="icon-button" type="button" data-open-settings>${icon('settings')}<span>Backup & settings</span></button></div></header>
    <div id="offline-banner" class="offline-banner" hidden><strong>Offline:</strong> your card still works and saves on this device.</div>
    ${state.demo ? `<aside class="demo-banner" aria-label="Demo mode"><span><strong>Demo — sample data, nothing is saved to your real card.</strong> Try editing Evelyn Parker’s example list.</span><span class="demo-actions"><button class="text-button" type="button" id="reset-demo">Reset demo</button><a class="text-button" href="/" id="start-real">Start for real</a></span></aside>` : ''}
    <main id="main-content">
      <section class="masthead"><div><p class="eyebrow">A dated list for the next handoff</p><h1>Make a clear medication handoff card.</h1><p class="lede">For adult children, caregivers, and older adults sharing a checked list with family or clinicians.</p>${state.demo ? '<p class="demo-intro">This sample is separate from your own card. Reset it any time.</p>' : '<p class="masthead-action"><a class="button primary" href="/demo">Try it with sample data</a><span>See a completed card for Evelyn Parker.</span></p>'}</div><div class="privacy-seal"><span aria-hidden="true">●</span><strong>Stays in this browser</strong><small>Works offline after the first visit.</small></div></section>
      <aside class="safety-note" aria-label="Important safety information"><strong>Communication tool, not medical advice.</strong><span>No interaction checks or dose recommendations. Confirm every change with a qualified clinician or pharmacist.</span></aside>
      ${profileSection()}
      ${state.error ? `<div class="error-banner" role="alert"><strong>Something went wrong.</strong> ${escaped(state.error)} <button class="text-button" type="button" id="reload-button">Reload</button></div>` : ''}
      <div class="workspace">
        <section class="current-list" aria-labelledby="current-heading"><div class="section-heading"><div><p class="eyebrow">Current list · ${state.medications.length}</p><h2 id="current-heading">Medicines being taken</h2></div>${state.medications.length ? `<button class="button primary" type="button" data-add-medication>${icon('plus')} Add medicine</button>` : ''}</div>${medicationList()}${state.medications.length ? `<div class="confirm-bar"><div><strong>Checked every line?</strong><span>Date the list before sharing it.</span></div><button class="button success" type="button" data-confirm-list>${icon('check')} Confirm current list</button></div>` : ''}</section>
        <aside class="history" aria-labelledby="history-heading"><div class="section-heading"><div><p class="eyebrow">Accountability</p><h2 id="history-heading">What changed</h2></div></div>${changeLog()}</aside>
      </div>
    </main>${footer()}${medicineDialog()}${stopDialog()}${confirmDialog()}${settingsDialog()}${printSheet()}
    <div id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true" ${state.notice ? '' : 'hidden'}>${escaped(state.notice)}</div>`;
}

function applyTheme(): void {
  const preference = localStorage.getItem('mhc-theme');
  document.documentElement.dataset.theme = preference ?? 'system';
}

function toggleTheme(): void {
  const current = localStorage.getItem('mhc-theme') ?? 'system';
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const next = current === 'system' ? (prefersDark ? 'light' : 'dark') : current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mhc-theme', next);
  applyTheme();
  announce(`${next === 'dark' ? 'Dark' : 'Light'} theme on.`);
}

function render(): void {
  const route = location.pathname.replace(/\/$/, '') || '/';
  app.innerHTML = route === '/privacy' ? legalPage('privacy') : route === '/terms' ? legalPage('terms') : appPage();
  document.title = route === '/privacy' ? 'Privacy — Medication Handoff Card' : route === '/terms' ? 'Terms — Medication Handoff Card' : state.demo ? 'Demo — Medication Handoff Card' : 'Medication Handoff Card — share a clear medicine list';
  bindEvents();
  updateOnlineState();
  if (state.openDialog) {
    const dialog = document.querySelector<HTMLDialogElement>(`#${state.openDialog}-dialog`);
    if (dialog) {
      dialog.showModal();
      keepFocusInDialog(dialog);
      window.setTimeout(() => dialog.querySelector<HTMLElement>('input, textarea, button, [href]')?.focus(), 0);
    }
  }
}

function announce(message: string): void {
  state.notice = message;
  const toast = document.querySelector<HTMLDivElement>('#toast');
  if (toast) { toast.textContent = message; toast.hidden = false; }
  window.setTimeout(() => { if (state.notice === message) { state.notice = ''; if (toast) toast.hidden = true; } }, 4500);
}

function openDialog(name: Exclude<DialogName, null>, returnFocus: string): void {
  state.returnFocus = returnFocus;
  state.openDialog = name;
  render();
}

function keepFocusInDialog(dialog: HTMLDialogElement): void {
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeDialog(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hasAttribute('hidden'));
    if (!focusable.length) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}

function closeDialog(): void {
  const returnFocus = state.returnFocus;
  state.openDialog = null;
  state.editingMedication = undefined;
  state.stoppingMedication = undefined;
  state.returnFocus = undefined;
  render();
  if (returnFocus) document.querySelector<HTMLElement>(returnFocus)?.focus();
}

async function refreshData(): Promise<void> {
  [state.profile, state.medications, state.changes] = await Promise.all([getProfile(), getMedications(), getChanges()]);
}

function makeBackup(): BackupData {
  return { format: 'medication-handoff-card', version: 1, exportedAt: isoNow(), profile: state.profile, medications: state.medications, changes: state.changes };
}

function download(contents: string, filename: string, type = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = Object.assign(document.createElement('a'), { href: url, download: filename });
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function validBackup(value: unknown): value is BackupData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<BackupData>;
  return data.format === 'medication-handoff-card' && data.version === 1 && !!data.profile && Array.isArray(data.medications) && Array.isArray(data.changes);
}

async function importBackup(file: File): Promise<void> {
  const contents = await file.text();
  let data: BackupData;
  try {
    const parsed = JSON.parse(contents) as { format?: string };
    if (parsed.format === 'medication-handoff-card-encrypted') {
      const passphrase = prompt('Enter the passphrase for this encrypted backup:');
      if (!passphrase) return;
      data = await decryptBackup(contents, passphrase);
    } else data = parsed as BackupData;
  } catch (error) {
    throw error instanceof Error ? error : new Error('This backup could not be read.');
  }
  if (!validBackup(data)) throw new Error('This file is not a valid Medication Handoff Card backup.');
  if (!confirm(`Replace this device’s record with the backup for ${data.profile.personName || 'an unnamed person'}? This cannot be undone.`)) return;
  await replaceAll(data);
  await refreshData();
  closeDialog();
  announce('Backup restored on this device.');
}

function bindEvents(): void {
  document.querySelectorAll<HTMLButtonElement>('#theme-toggle, #theme-toggle-settings').forEach((button) => button.addEventListener('click', toggleTheme));
  document.querySelector<HTMLButtonElement>('#reload-button')?.addEventListener('click', () => location.reload());
  document.querySelector<HTMLButtonElement>('#print-button')?.addEventListener('click', () => window.print());
  document.querySelectorAll<HTMLElement>('[data-open-settings]').forEach((button) => button.addEventListener('click', () => openDialog('settings', '[data-open-settings]')));
  document.querySelectorAll<HTMLElement>('[data-add-medication]').forEach((button) => button.addEventListener('click', () => { state.editingMedication = undefined; openDialog('medicine', '[data-add-medication]'); }));
  document.querySelectorAll<HTMLElement>('[data-edit-medication]').forEach((button) => button.addEventListener('click', () => { state.editingMedication = state.medications.find((item) => item.id === button.dataset.editMedication); openDialog('medicine', `[data-edit-medication="${button.dataset.editMedication}"]`); }));
  document.querySelectorAll<HTMLElement>('[data-stop-medication]').forEach((button) => button.addEventListener('click', () => { state.stoppingMedication = state.medications.find((item) => item.id === button.dataset.stopMedication); openDialog('stop', `[data-stop-medication="${button.dataset.stopMedication}"]`); }));
  document.querySelector<HTMLElement>('[data-confirm-list]')?.addEventListener('click', () => openDialog('confirm', '[data-confirm-list]'));
  document.querySelector<HTMLElement>('[data-edit-profile]')?.addEventListener('click', () => { state.profileEditing = true; render(); document.querySelector<HTMLInputElement>('[name="personName"]')?.focus(); });
  document.querySelector<HTMLElement>('[data-cancel-profile]')?.addEventListener('click', () => { state.profileEditing = false; render(); });
  document.querySelectorAll<HTMLElement>('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => closeDialog()));
  document.querySelector<HTMLButtonElement>('#reset-demo')?.addEventListener('click', async () => {
    await clearAll();
    await replaceAll(sampleBackup());
    await refreshData();
    render();
    announce('Demo reset to the sample card.');
  });

  document.querySelector<HTMLFormElement>('#profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    state.profile = { ...state.profile, personName: String(data.get('personName')).trim(), caregiverName: String(data.get('caregiverName')).trim(), updatedAt: isoNow() };
    try { await saveProfile(state.profile); state.profileEditing = false; render(); announce('Card names saved.'); } catch (error) { state.error = error instanceof Error ? error.message : 'Could not save the names.'; render(); }
  });

  document.querySelector<HTMLFormElement>('#medicine-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const now = isoNow();
    const previous = state.editingMedication;
    const medication: Medication = {
      id: previous?.id ?? uid(), name: String(data.get('name')).trim(), dose: String(data.get('dose')).trim(), timing: String(data.get('timing')).trim(),
      prescriber: String(data.get('prescriber')).trim(), notes: String(data.get('notes')).trim(), createdAt: previous?.createdAt ?? now, updatedAt: now
    };
    const changedFields = previous ? (['name', 'dose', 'timing', 'prescriber', 'notes'] as const).filter((key) => previous[key] !== medication[key]).map((key) => ({ name: 'medicine name', dose: 'dose', timing: 'timing', prescriber: 'prescriber', notes: 'notes' })[key]) : [];
    const change: ChangeEntry = { id: uid(), kind: previous ? 'updated' : 'added', medicineId: medication.id, title: previous ? `${medication.name} updated` : `${medication.name} added`, details: previous ? `Changed ${changedFields.join(', ') || 'record'}.` : `${medication.dose} · ${medication.timing}`, by: state.profile.caregiverName, at: now };
    try { await saveMedication(medication); await addChange(change); await refreshData(); closeDialog(); announce(previous ? `${medication.name} updated.` : `${medication.name} added.`); } catch (error) { state.error = error instanceof Error ? error.message : 'Could not save the medicine.'; closeDialog(); }
  });

  document.querySelector<HTMLFormElement>('#stop-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.stoppingMedication) return;
    const medicine = state.stoppingMedication;
    const reason = String(new FormData(event.currentTarget as HTMLFormElement).get('reason')).trim();
    try {
      await addChange({ id: uid(), kind: 'stopped', medicineId: medicine.id, title: `${medicine.name} stopped`, details: reason, by: state.profile.caregiverName, at: isoNow() });
      await removeMedication(medicine.id); await refreshData(); closeDialog(); announce(`${medicine.name} removed; the change is preserved.`);
    } catch (error) { state.error = error instanceof Error ? error.message : 'Could not remove the medicine.'; closeDialog(); }
  });

  document.querySelector<HTMLFormElement>('#confirm-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const confirmedBy = String(new FormData(event.currentTarget as HTMLFormElement).get('confirmedBy')).trim();
    const now = isoNow();
    state.profile = { ...state.profile, lastConfirmed: now, confirmedBy, updatedAt: now };
    try { await saveProfile(state.profile); await addChange({ id: uid(), kind: 'confirmed', title: 'Current list confirmed', details: `${state.medications.length} ${state.medications.length === 1 ? 'medicine' : 'medicines'} checked.`, by: confirmedBy, at: now }); await refreshData(); closeDialog(); announce('Current list confirmed and dated.'); } catch (error) { state.error = error instanceof Error ? error.message : 'Could not confirm the list.'; closeDialog(); }
  });

  document.querySelector<HTMLButtonElement>('#export-json')?.addEventListener('click', () => { download(JSON.stringify(makeBackup(), null, 2), `medication-card-${new Date().toISOString().slice(0, 10)}.json`); announce('Plain backup downloaded.'); });
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', async (event) => { const file = (event.currentTarget as HTMLInputElement).files?.[0]; if (file) try { await importBackup(file); } catch (error) { announce(error instanceof Error ? error.message : 'Backup could not be restored.'); } });
  document.querySelector<HTMLButtonElement>('#export-encrypted')?.addEventListener('click', async () => {
    const field = document.querySelector<HTMLInputElement>('#backup-passphrase');
    try { const contents = await encryptBackup(makeBackup(), field?.value ?? ''); download(contents, `medication-card-${new Date().toISOString().slice(0, 10)}.mhc`); if (field) field.value = ''; announce('Encrypted backup downloaded.'); } catch (error) { announce(error instanceof Error ? error.message : 'Encrypted backup could not be created.'); field?.focus(); }
  });
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const token = String(new FormData(event.currentTarget as HTMLFormElement).get('license')).trim(); storeLicense(token); announce('Checking license…'); const result = await verifyLicense(true); state.paid = result.valid; render(); announce(result.valid ? 'Encrypted backups unlocked.' : (result.message ?? 'That license was not valid.'));
  });
}

function updateOnlineState(): void {
  const banner = document.querySelector<HTMLElement>('#offline-banner');
  if (banner) banner.hidden = navigator.onLine;
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  const registration = await navigator.serviceWorker.register('/sw.js');
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !refreshing) { refreshing = true; announce('A fresh version is ready. Reload when convenient.'); }
  });
  if (registration.waiting) announce('An update is ready. Reload when convenient.');
}

async function start(): Promise<void> {
  applyTheme();
  const route = location.pathname.replace(/\/$/, '') || '/';
  if (route === '/privacy' || route === '/terms') { render(); return; }
  state.demo = route === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  useStorageNamespace(state.demo ? 'demo' : 'real');
  const returned = captureReturnedLicense();
  try {
    await refreshData();
    if (state.demo && !state.profile.personName && !state.medications.length && !state.changes.length) {
      await replaceAll(sampleBackup());
      await refreshData();
    }
    render();
    if (returned) announce('License received. Verifying…');
    void verifyLicense(returned).then((result) => {
      const changed = state.paid !== result.valid;
      state.paid = result.valid;
      if (changed) render();
      if (result.message) announce(result.message);
      if (returned && result.valid) announce('Encrypted backups unlocked.');
    });
    void registerServiceWorker();
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'The local record could not be opened.';
    render();
  }
}

window.addEventListener('online', updateOnlineState);
window.addEventListener('offline', updateOnlineState);
void start();
