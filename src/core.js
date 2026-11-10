// ---------- constants ----------
export const MONTHS = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
export const MONTHS_GEN = ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'];
export const DOW_SHORT = ['Δ','Τ','Τ','Π','Π','Σ','Κ'];
export const DOW_LONG = ['Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο','Κυριακή'];
export const DOW_MID = ['Δευ','Τρί','Τετ','Πέμ','Παρ','Σάβ','Κυρ'];

export const SHIFTS = ['08-16','09-17','10-18','11-19','13-21','14-22','09-13','09-15'];
export const shiftLabel = (s) => { if (!s) return ''; const [a, b] = s.split('-'); return a + ':00–' + b + ':00'; };
export const shiftShort = (s) => shiftLabel(s);  // full form everywhere, e.g. 08:00–16:00
export const shiftHours = (s) => { if (!s) return 0; const [a, b] = s.split('-').map(Number); return Math.max(0, b - a); };

export const LEAVE_TYPES = [
  { value: 'A', label: 'Κανονική άδεια', short: 'Άδεια', code: 'Α', tone: 'orange' },
  { value: 'AS', label: 'Άδεια ασθενείας', short: 'Ασθένεια', code: 'ΑΣ', tone: 'error' },
  { value: 'AM', label: 'Άδεια μητρότητας / πατρότητας', short: 'Μητρότητας', code: 'ΑΜ', tone: 'purple' },
  { value: 'EA', label: 'Εκπαιδευτική άδεια', short: 'Εκπαιδευτική', code: 'ΕΑ', tone: 'gold' },
  { value: 'AD', label: 'Άδεια αιμοδοσίας', short: 'Αιμοδοσία', code: 'ΑΔ', tone: 'gold' },
  { value: 'AA', label: 'Άδεια άνευ αποδοχών', short: 'Άνευ αποδ.', code: 'ΑΑ', tone: 'gold' },
];
export const leaveOf = (v) => LEAVE_TYPES.find((l) => l.value === v) || LEAVE_TYPES[0];

export const DIRECTIONS = ['Διεύθυνση Υπηρεσιών', 'Διεύθυνση Πωλήσεων', 'Διεύθυνση Back Office'];
export const DEPARTMENTS = ['Τμήμα Εξυπηρέτησης Πελατών', 'Τμήμα Υποστηρικτικών Εργασιών', 'Τμήμα Πωλήσεων', 'Τμήμα Είσπραξης Οφειλών'];
export const BRANCHES = ['Ταύρος', 'Μαρούσι', 'Πειραιάς', 'Θεσσαλονίκη'];
export const POSITIONS = ['Εκπρόσωπος Εξυπηρέτησης Πελατών', 'Προϊστάμενος Εξυπηρέτησης Πελατών', 'Υπάλληλος Υποστηρικτικών Εργασιών', 'Team Leader', 'Εκπρόσωπος Πωλήσεων'];
export const SUPERVISORS = ['ΔΡΑΚΟΥ ΔΗΜΗΤΡΑ', 'ΛΥΜΠΕΡΟΠΟΥΛΟΣ ΓΙΩΡΓΟΣ', 'ΛΑΒΔΑΣ / ΠΑΥΛΑΚΗΣ / ΠΕΤΡΟΠΟΥΛΟΥ', 'ΛΟΥΚΟΠΟΥΛΟΥ ΜΑΡΙΑ', 'ΠΑΠΑΔΟΓΚΩΝΑΣ ΗΛΙΑΣ', 'ΠΙΤΣΙΚΟΥΛΗΣ ΜΙΧΑΛΗΣ', 'ΣΤΙΒΑΧΤΗΣ ΓΙΩΡΓΟΣ'];
export const CONTRACT_TERMS = ['Αορίστου χρόνου', 'Ορισμένου χρόνου'];
export const CONTRACT_HOURS = ['8', '6', '4'];
export const BILLING = ['Ανά ώρα', 'Ανά FTE', 'Κατ’ αποκοπή'];
export const WORKPLACES = ['ΕΝΤΟΣ', 'ΕΚΤΟΣ', 'ΥΒΡΙΔΙΚΟ'];
export const LOCATIONS = ['Αναξαγόρα 63 Ταύρος, 177 78', 'Λ. Κηφισίας 124, Μαρούσι, 151 25', 'Ακτή Μιαούλη 47, Πειραιάς, 185 36', 'Τσιμισκή 33, Θεσσαλονίκη, 546 23'];

// Greek public holidays (fixed + Orthodox Easter based)
const HOLIDAYS = new Set([
  '2026-01-01','2026-01-06','2026-02-23','2026-03-25','2026-04-10','2026-04-13','2026-05-01','2026-06-01','2026-08-15','2026-10-28','2026-12-25','2026-12-26',
  '2027-01-01','2027-01-06','2027-03-15','2027-03-25','2027-04-30','2027-05-01','2027-05-03','2027-06-21','2027-08-15','2027-10-28','2027-12-25','2027-12-26',
]);

// ---------- dates ----------
export const pad = (n) => String(n).padStart(2, '0');
export const ymOf = (y, m) => y + '-' + pad(m);
export const isoOf = (y, m, d) => y + '-' + pad(m) + '-' + pad(d);
export const daysIn = (y, m) => new Date(y, m, 0).getDate();
export const dowOf = (y, m, d) => (new Date(y, m - 1, d).getDay() + 6) % 7; // 0 = Monday
export const isHoliday = (iso) => HOLIDAYS.has(iso);
export const fmtDate = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return d + '/' + m + '/' + y; };
export const todayIso = () => { const t = new Date(); return isoOf(t.getFullYear(), t.getMonth() + 1, t.getDate()); };
export function monthDays(y, m) {
  const out = [];
  for (let d = 1; d <= daysIn(y, m); d++) {
    const dow = dowOf(y, m, d); const iso = isoOf(y, m, d);
    out.push({ d, iso, dow, weekend: dow >= 5, holiday: isHoliday(iso) });
  }
  return out;
}
export function dayOf(iso) {
  const [y, m, d] = iso.split('-').map(Number); const dow = dowOf(y, m, d);
  return { d, iso, dow, weekend: dow >= 5, holiday: isHoliday(iso) };
}
export function isoRange(a, b) {
  const out = []; if (!a || !b || b < a) return out;
  let t = new Date(a + 'T12:00:00'); const end = new Date(b + 'T12:00:00');
  while (t <= end) { out.push(isoOf(t.getFullYear(), t.getMonth() + 1, t.getDate())); t.setDate(t.getDate() + 1); }
  return out;
}
export function weeksOf(days) {
  const weeks = []; let cur = [];
  days.forEach((x) => { cur.push(x); if (x.dow === 6) { weeks.push(cur); cur = []; } });
  if (cur.length) weeks.push(cur);
  return weeks;
}

// ---------- schedule resolution ----------
export function resolveDay(empIn, day, ov) {
  const emp = empIn && (empIn.schedules && empIn.schedules.length || assignmentsOf(empIn).some((a) => a.from || a.to)) ? planFor(empIn, day.iso) : empIn;
  const none = { inactive: true, hours: 0, base: 0, ot: 0, free: 0, alloc: {}, shift: null, remote: false, leave: null };
  if (!emp) return none;
  if ((emp.hireDate && day.iso < emp.hireDate) || (emp.leaveDate && day.iso > emp.leaveDate)) return none;
  const off = day.weekend || day.holiday;
  const r = { shift: off ? null : (emp.schedule || '09-17'), remote: !off && !!(emp.remote || [])[day.dow], ot: 0, otReason: '', leave: null, override: false };
  if (ov) {
    r.override = true;
    if ('shift' in ov) r.shift = ov.shift === 'off' ? null : ov.shift;
    if ('remote' in ov) r.remote = !!ov.remote;
    r.ot = +ov.ot || 0; r.otReason = ov.otReason || '';
    if (ov.leave) { r.leave = ov.leave; r.remote = false; }
  }
  r.base = r.leave ? 0 : shiftHours(r.shift);
  r.hours = r.base + (r.leave ? 0 : r.ot);
  if (r.leave || !r.shift) r.alloc = {};
  else if (ov && ov.alloc) { r.alloc = {}; Object.entries(ov.alloc).forEach(([k, v]) => { if (+v) r.alloc[k] = +v; }); }
  else r.alloc = defaultAlloc(emp, r.base, day.dow);
  r.free = r.leave || !r.shift ? 0 : Math.max(0, r.base - Object.values(r.alloc).reduce((t, v) => t + (+v || 0), 0));  // shift hours given to no project
  r.otProject = r.ot && !r.leave ? ((ov && ov.otProject) || primaryProject(emp)) : '';
  return r;
}
export function tone(r) {
  if (r.inactive) return 'inactive';
  if (r.leave) return 'leave-' + leaveOf(r.leave).tone;
  if (r.remote && r.ot) return 'remote-ot';
  if (r.ot) return 'ot';
  if (r.remote) return 'remote';
  return r.shift ? 'work' : 'empty';
}
export function hoursText(r) {
  if (r.inactive) return { main: '', sub: '' };
  if (r.leave) return { main: leaveOf(r.leave).code, sub: '' };
  if (!r.shift && !r.ot) return { main: '', sub: '' };
  return { main: fmtNum(r.base), sub: (r.remote ? 'Τ' : '') + (r.ot ? (r.remote ? ' ' : '') + '+' + r.ot + 'Υ' : '') };
}
export function shiftText(r) {
  if (r.inactive) return { main: '', sub: '' };
  if (r.leave) return { main: leaveOf(r.leave).code, sub: '' };
  if (!r.shift && !r.ot) return { main: '', sub: '' };
  return { main: r.shift ? shiftShort(r.shift) : '—', sub: (r.remote ? 'Τ' : '') + (r.ot ? (r.remote ? ' ' : '') + '+' + r.ot + 'Υ' : '') };
}

// ---------- formatting ----------
const eur = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' });
const num = new Intl.NumberFormat('el-GR', { maximumFractionDigits: 2 });
export const fmtEur = (n) => eur.format(n || 0);
const eur0 = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export const fmtEur0 = (n) => eur0.format(Math.round(n || 0));
export const fmtNum = (n) => num.format(n || 0);
export const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
// Greek capitals carry no accents: Μαρία → ΜΑΡΙΑ, Μάιος → ΜΑΪΟΣ (the ι keeps its sound with a dialytika)
export function upperGr(s) {
  let d = String(s || '').toUpperCase().normalize('NFD');
  d = d.replace(/([ΑΕΗΟΥΩ])\u0301([ΙΥ])(?!\u0308)/g, '$1$2\u0308');
  return d.replace(/\u0301/g, '').normalize('NFC');
}
export const fullName = (e) => e ? upperGr(((e.last || '') + ' ' + (e.first || '')).trim()) : '';
export const uid = (p) => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const byName = (a, b) => fullName(a).localeCompare(fullName(b), 'el');

// ---------- multi-project assignments ----------
// An assignment: { projectId, mode, hours, days }
//   mode 'fixed' — the same hours every chosen day
//   mode 'rest'  — whatever the shift leaves after the fixed ones (the employee's main project; at most one)
//   mode 'none'  — member of the team, no default hours (hours are given day by day)
//   days         — 7 booleans, Monday first; the assignment applies on those weekdays
export const ALL_DAYS = [true, true, true, true, true, true, true];
export const ASSIGN_MODES = [
  { value: 'fixed', label: 'Σταθερές ώρες' },
  { value: 'rest', label: 'Υπόλοιπο βάρδιας (κύριο έργο)' },
  { value: 'none', label: 'Χωρίς σταθερές ώρες' },
];
export const capacityOf = (e) => shiftHours(e ? scheduleOn(e, todayIso()).schedule : '09-17');
export function assignmentsOf(e) {
  if (!e) return [];
  const raw = Array.isArray(e.assignments) ? e.assignments : (e.projectId ? [{ projectId: e.projectId, hours: capacityOf(e) }] : []);
  return raw.filter((a) => a && a.projectId).map((a) => ({
    projectId: a.projectId,
    mode: a.mode || 'fixed',                                      // older records had hours only
    hours: a.mode === 'rest' || a.mode === 'none' ? 0 : (+a.hours || 0),
    days: Array.isArray(a.days) && a.days.length === 7 ? a.days.map(Boolean) : ALL_DAYS,
    from: a.from || '', to: a.to || '',
  }));
}
// ---------- dated plans ----------
// schedules: [{ from, schedule, remote }] — later shift / remote-day rules; before the first one the base fields apply
// assignments may carry from / to: a row counts only inside its period
export const activeOn = (a, iso) => (!a.from || iso >= a.from) && (!a.to || iso <= a.to);
export const overlaps = (a, from, to) => (!a.from || a.from <= to) && (!a.to || a.to >= from);
export function scheduleOn(e, iso) {
  let cur = { schedule: (e && e.schedule) || '09-17', remote: (e && e.remote) || [], from: '' };
  ((e && e.schedules) || []).slice().sort((x, y) => x.from.localeCompare(y.from)).forEach((h) => { if (h.from <= iso) cur = { schedule: h.schedule || cur.schedule, remote: h.remote || cur.remote, from: h.from }; });
  return cur;
}
// the employee as they were on a given day: that day's shift rule, remote days and active assignments
export function planFor(e, iso) {
  if (!e) return e;
  const sc = scheduleOn(e, iso);
  return { ...e, schedule: sc.schedule, remote: sc.remote, assignments: assignmentsOf(e).filter((a) => activeOn(a, iso)), schedules: [] };
}
export const inProjectDuring = (e, pid, from, to) => assignmentsOf(e).some((a) => a.projectId === pid && overlaps(a, from, to));
export const inProject = (e, pid) => assignmentsOf(e).some((a) => a.projectId === pid && (!a.to || a.to >= todayIso()));   // member now or later
export const assignmentOf = (e, pid, iso) => { const as = assignmentsOf(e).filter((a) => a.projectId === pid); return (iso && as.find((a) => activeOn(a, iso))) || as.find((a) => activeOn(a, todayIso())) || as[as.length - 1] || null; };
export function primaryProject(e, iso) {
  const as = assignmentsOf(e).filter((a) => activeOn(a, iso || todayIso()));
  return ((as.find((a) => a.mode === 'rest') || as.find((a) => a.mode === 'fixed') || as[0]) || {}).projectId || '';
}
// fixed hours promised on a weekday (all weekdays when dow is undefined: the busiest one)
export function fixedOn(e, dow, exceptPid) {
  const as = assignmentsOf(e).filter((a) => a.mode === 'fixed' && a.projectId !== exceptPid && activeOn(a, todayIso()));
  if (dow != null) return as.filter((a) => a.days[dow]).reduce((s, a) => s + a.hours, 0);
  return Math.max(0, ...[0, 1, 2, 3, 4, 5, 6].map((d) => as.filter((a) => a.days[d]).reduce((s, a) => s + a.hours, 0)));
}
export const allocatedOf = (e, exceptPid) => fixedOn(e, undefined, exceptPid);
export const availableOf = (e, exceptPid) => Math.max(0, capacityOf(e) - fixedOn(e, undefined, exceptPid));
export const hoursIn = (e, pid) => { const a = assignmentOf(e, pid); return a && a.mode === 'fixed' ? a.hours : 0; };
// short label for a project row, e.g. "6/8ω", "υπόλ.", "ευέλ."
export function assignNote(e, pid, iso) {
  const a = assignmentOf(e, pid, iso); if (!a) return '';
  const part = a.days.every(Boolean) ? '' : ' ' + ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ'].filter((_, i) => a.days[i]).join('');
  if (a.mode === 'rest') return 'υπόλ.' + part;
  if (a.mode === 'none') return 'ευέλ.';
  return fmtNum(a.hours) + '/' + capacityOf(e) + 'ω' + part;
}
export const periodText = (a) => a.from && a.to ? ' (' + fmtDate(a.from) + ' – ' + fmtDate(a.to) + ')' : a.from ? ' (από ' + fmtDate(a.from) + ')' : a.to ? ' (έως ' + fmtDate(a.to) + ')' : '';
export function assignTitle(e, pid, iso) {
  const a = assignmentOf(e, pid, iso); if (!a) return '';
  const days = a.days.every(Boolean) ? 'όλες τις ημέρες' : DOW_LONG.filter((_, i) => a.days[i]).join(', ');
  const per = periodText(a);
  if (a.mode === 'rest') return 'κύριο έργο, παίρνει ό,τι μένει από τη βάρδια, ' + days + per;
  if (a.mode === 'none') return 'χωρίς σταθερές ώρες, οι ώρες ορίζονται ανά ημέρα' + per;
  return fmtNum(a.hours) + ' ώρες εδώ, ' + days + per;
}
// days of a month where the hours in a project differ from the standing assignment (leave days aside)
export function allocExceptions(e, pid, days, ovMap) {
  const out = [];
  days.forEach((d) => {
    const full = resolveDay(e, d, (ovMap || {})[String(d.d).padStart(2, '0')]);
    if (full.inactive || full.leave || !full.override) return;
    const def = resolveDay(e, d, null);
    if (((full.alloc || {})[pid] || 0) !== ((def.alloc || {})[pid] || 0)) out.push(d.iso);
  });
  return out;
}
// label + hover text for a project row of an employee who works in more than one project
export function rowNote(e, pid, days, ovMap) {
  const from = days[0].iso, to = days[days.length - 1].iso;
  const mine = assignmentsOf(e).filter((a) => a.projectId === pid && overlaps(a, from, to)).sort((x, y) => (x.from || '').localeCompare(y.from || ''));
  const n = new Set(assignmentsOf(e).filter((a) => overlaps(a, from, to)).map((a) => a.projectId)).size;
  const dated = mine.some((a) => (a.from && a.from > from) || (a.to && a.to < to));
  if (n < 2 && !dated) return { note: null, noteTitle: undefined };
  const iso = mine.length ? (mine.find((a) => activeOn(a, todayIso() >= from && todayIso() <= to ? todayIso() : from)) || mine[mine.length - 1]).from || from : from;
  const ex = allocExceptions(e, pid, days, ovMap);
  const lines = ['Βασική ανάθεση: ' + mine.map((a) => assignTitle({ ...e, assignments: [a] }, pid)).join('; ') + '.'];
  if (n > 1) lines.push('Μοιράζεται σε ' + n + ' έργα.');
  if (ex.length) lines.push('Αυτόν τον μήνα διαφέρουν ' + (ex.length === 1 ? '1 ημέρα: ' : ex.length + ' ημέρες: ') + ex.map((x) => x.slice(8) + '/' + x.slice(5, 7)).join(', ') + '.');
  const sd = (x) => (+x.slice(8)) + '/' + (+x.slice(5, 7));
  // the label tells when membership in this project starts / ends inside the month (earliest start, latest end)
  const startIn = mine.length && mine[0].from && mine[0].from > from ? mine[0].from : '';
  const ends = mine.map((a) => a.to).filter(Boolean); const endIn = mine.length && mine.every((a) => a.to) && Math.max(...ends.map((x) => +x.replace(/-/g, ''))) < +to.replace(/-/g, '') ? ends.sort().pop() : '';
  const per = startIn ? ' από ' + sd(startIn) : endIn ? ' έως ' + sd(endIn) : '';
  const base = n > 1 ? assignNote(e, pid, iso) : '';
  return { note: (base + per).trim() + (ex.length ? '*' : ''), noteTitle: lines.join('\n') };
}
// default split of a day's shift between projects
export function defaultAlloc(e, base, dow) {
  const out = {}; if (!base) return out;
  const act = assignmentsOf(e).filter((a) => dow == null || a.days[dow]);
  const fixed = act.filter((a) => a.mode === 'fixed'); const sum = fixed.reduce((s, a) => s + a.hours, 0);
  const k = sum > base && sum > 0 ? base / sum : 1;
  fixed.forEach((a) => { const h = Math.round(a.hours * k * 2) / 2; if (h > 0) out[a.projectId] = h; });
  let tot = Object.values(out).reduce((s, v) => s + v, 0);
  const keys = Object.keys(out);
  if (tot > base && keys.length) { out[keys[keys.length - 1]] = Math.max(0, out[keys[keys.length - 1]] - (tot - base)); tot = base; }
  const rest = act.find((a) => a.mode === 'rest');
  if (rest && base - tot > 0) out[rest.projectId] = (out[rest.projectId] || 0) + (base - tot);
  return out;
}
export const sumAlloc = (a) => Object.values(a || {}).reduce((s, v) => s + (+v || 0), 0);
export function projectView(r, pid) {
  if (r.inactive || !pid) return r;
  const base = r.leave ? 0 : +((r.alloc || {})[pid]) || 0;
  const ot = r.otProject === pid ? r.ot : 0;
  return { ...r, base, ot, hours: base + ot, shift: base || ot ? r.shift : null, dayBase: r.base };
}
export function shiftProjText(pv) {
  if (pv.inactive) return { main: '', sub: '' };
  if (pv.leave) return { main: leaveOf(pv.leave).code, sub: '' };
  if (!pv.shift && !pv.ot) return { main: '', sub: '' };
  const split = pv.dayBase != null && pv.base !== pv.dayBase;
  const parts = [];
  if (split) parts.push(fmtNum(pv.base) + 'ω');
  if (pv.remote) parts.push('Τ');
  if (pv.ot) parts.push('+' + pv.ot + 'Υ');
  return { main: pv.shift ? shiftShort(pv.shift) : '—', sub: parts.join(' ') };
}

// ---------- periods ----------
export const addDays = (iso, n) => { const t = new Date(iso + 'T12:00:00'); t.setDate(t.getDate() + n); return isoOf(t.getFullYear(), t.getMonth() + 1, t.getDate()); };
export const mondayOf = (iso) => addDays(iso, -dayOf(iso).dow);
export const monthsBetween = (a, b) => { const out = []; let m = a.slice(0, 7); while (m <= b.slice(0, 7)) { out.push(m); const [y, mm] = m.split('-').map(Number); m = mm === 12 ? (y + 1) + '-01' : y + '-' + pad(mm + 1); } return out; };
