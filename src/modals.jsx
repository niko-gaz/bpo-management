import { SHIFTS, shiftLabel, LEAVE_TYPES, DIRECTIONS, DEPARTMENTS, BRANCHES, POSITIONS, SUPERVISORS, CONTRACT_TERMS, CONTRACT_HOURS, BILLING, WORKPLACES, LOCATIONS,
  resolveDay, fmtDate, isoRange, isHoliday, fullName, norm, uid, byName, DOW_SHORT, pad, shiftHours, fmtNum,
  assignmentsOf, inProject, primaryProject, availableOf, defaultAlloc, capacityOf, ASSIGN_MODES, ALL_DAYS, fixedOn, scheduleOn, activeOn, todayIso, addDays, upperGr } from './core.js';
import { Overlay, TextF, SelectF, Field, DateInput } from './ui.jsx';
const { useState, useMemo, useId } = React;
const A = window.Aambience;

const shiftOptions = [...SHIFTS.map((s) => ({ value: s, label: shiftLabel(s) })), { value: 'off', label: 'Χωρίς βάρδια (ρεπό)' }];
const otOptions = ['1', '2', '3', '4', '5', '6'].map((v) => ({ value: v, label: v + (v === '1' ? ' ώρα' : ' ώρες') }));

function dayOf(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dow = (new Date(y, m - 1, d).getDay() + 6) % 7;
  return { d, iso, dow, weekend: dow >= 5, holiday: isHoliday(iso) };
}

// ---------- Day editor (adjust hours popup) — single day or a range of days ----------
const DOW_FULL = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

export function DayEditor({ emps: empsIn, iso: isoIn, isoEnd, cells, entriesFor, projects, clients, onClose, onSave, onUpdate, onJoin, onLeave, bulk: bulkIn }) {
  // cells: [{ emp, days: [iso] }] — an arbitrary selection of days across employees
  const emps = cells ? cells.map((c) => c.emp) : empsIn;
  const bulk = cells ? emps.length > 1 : bulkIn;
  const isoInit = cells ? cells.flatMap((c) => c.days).sort()[0] : isoIn;
  const first = emps[0];
  const openedAsRange = (!!isoEnd && isoEnd !== isoInit) || !!cells;
  // a range starts from the employee's normal schedule, not from whatever the first day holds
  const r = useMemo(() => {
    const x = resolveDay(first, dayOf(isoInit), openedAsRange ? null : entriesFor(first.id, isoInit));
    if (openedAsRange) { x.remote = false; if (!x.shift) { x.shift = first.schedule || '09-17'; x.alloc = defaultAlloc(first, shiftHours(x.shift), dayOf(isoInit).dow); } x.override = false; }
    return x;
  }, [first, isoInit]);
  const pName = (id) => { const p = projects.find((x) => x.id === id); if (!p) return 'Έργο που διαγράφηκε'; const c = (clients || []).find((x) => x.id === p.clientId); return (c ? c.name + ' | ' : '') + p.name; };
  const empProjects = useMemo(() => {
    const ids = bulk ? [...new Set(emps.flatMap((e) => assignmentsOf(e).map((a) => a.projectId)))] : [...new Set([...assignmentsOf(first).map((a) => a.projectId), ...Object.keys(r.alloc || {})])];
    return ids.filter(Boolean);
  }, [emps, r]);

  const [range, setRange] = useState(!cells && openedAsRange);
  const multi = range || !!cells;
  const [from, setFrom] = useState(isoEnd && isoEnd < isoInit ? isoEnd : isoInit);
  const [to, setTo] = useState(isoEnd && isoEnd > isoInit ? isoEnd : isoInit);
  const [dows, setDows] = useState([true, true, true, true, true, false, false]);
  const [skipHol, setSkipHol] = useState(true);
  const [policy, setPolicy] = useState('merge');   // merge: apply only what was changed here; replace: overwrite the whole day

  const [shift, setShift] = useState(openedAsRange ? 'keep' : (r.shift || 'off'));
  const [remote, setRemote] = useState(!!r.remote);
  const [remoteTouched, setRemoteTouched] = useState(false);
  // for a selection of one employee's days: show the split they share, or leave the fields blank ("διάφορα") when it differs
  const [mixed] = useState(() => {
    if (!cells) return null;
    const key = (a) => JSON.stringify(Object.keys(a || {}).sort().map((k) => [k, +a[k]]));
    const all = cells.flatMap((c) => (c.days || []).map((x) => ({ x, y: resolveDay(c.emp, dayOf(x), entriesFor(c.emp.id, x)) }))).filter(({ y }) => !y.inactive && !y.leave && y.shift);
    const first0 = all[0] ? key(all[0].y.alloc) : null;
    const odd = [...new Set(all.filter(({ y }) => key(y.alloc) !== first0).map(({ x }) => x))].sort();
    return odd.length ? { odd, same: all[0] ? all[0].y.alloc : {} } : null;
  });
  const [alloc, setAlloc] = useState(() => {
    // a shared split is shown as is; when the chosen days differ the fields start blank
    const shared = cells ? resolveDay(first, dayOf(isoInit), entriesFor(first.id, isoInit)).alloc : r.alloc;
    const o = {}; empProjects.forEach((p) => { o[p] = mixed ? '' : String((shared || {})[p] || 0); }); return o;
  });
  const [allPid, setAllPid] = useState(null);       // "Όλη η βάρδια" for one project: follows each day's shift length
  const [extra, setExtra] = useState([]);            // projects added just for these days (the employee isn't in their team yet)
  const rowsP = [...empProjects, ...extra];
  const asgOf = (pid) => assignmentsOf(first).find((a) => a.projectId === pid);
  const membersOf = (pid) => emps.filter((e) => assignmentsOf(e).some((a) => a.projectId === pid && activeOn(a, isoInit)));
  const modeText = (pid) => {
    if (bulk) { const n = membersOf(pid).length; return !n ? 'νέο: μπαίνουν στην ομάδα' : n === emps.length ? 'μέλη όλοι' : 'μέλη ' + n + ' από ' + emps.length + ', οι υπόλοιποι μπαίνουν'; }
    const a = asgOf(pid); if (!a) return 'νέο: μπαίνει στην ομάδα'; return a.mode === 'rest' ? 'κύριο έργο' : a.mode === 'none' ? 'χωρίς σταθερές ώρες' : 'σταθερές ' + fmtNum(a.hours) + 'ω'; };
  const [touched, setTouched] = useState(false);
  const [otOn, setOtOn] = useState(!!r.ot);
  const [ot, setOt] = useState(String(r.ot || 1));
  const [otProject, setOtProject] = useState(r.otProject || (bulk ? '' : primaryProject(first)));
  const [reason, setReason] = useState(r.otReason || '');
  const [otTouched, setOtTouched] = useState(false);
  const [removed, setRemoved] = useState([]);        // projects the employee leaves (team membership) — hours 0 on these days
  const [leaveOn, setLeaveOn] = useState(!!r.leave);
  const [ls, setLs] = useState(isoInit); const [le, setLe] = useState(isoInit);
  const [lt, setLt] = useState(r.leave || 'A');
  const [busy, setBusy] = useState(false);

  const keepShift = shift === 'keep';
  const rangeErr = range && (!from || !to || to < from) ? 'Η λήξη πρέπει να είναι ίδια ή μετά την έναρξη.' : '';
  const leaveErr = !multi && leaveOn && (!ls || !le || le < ls) ? 'Η λήξη πρέπει να είναι ίδια ή μετά την έναρξη.' : '';

  // the days each employee will receive
  const daysFor = (e) => {
    const ok = (x) => !resolveDay(e, dayOf(x), null).inactive;
    if (cells) return ((cells.find((c) => c.emp === e) || {}).days || []).filter(ok).sort();
    if (range) return rangeErr ? [] : isoRange(from, to).filter((x) => { const d = dayOf(x); return dows[d.dow] && !(skipHol && d.holiday) && ok(x); });
    if (leaveOn) { const l = leaveErr ? [] : isoRange(ls, le).filter((x) => { const d = dayOf(x); return !d.weekend && !d.holiday && ok(x); }); return l.length ? l : [from]; }
    return [from];
  };
  const plan = useMemo(() => emps.map((e) => ({ e, days: daysFor(e) })), [emps, range, from, to, dows, skipHol, leaveOn, ls, le]);
  // with "no change" each day keeps its own shift; hours per project are then checked against the shortest of them
  const keepCap = (() => {
    if (!keepShift || !plan.length) return 0;
    const hs = plan.flatMap((pl) => pl.days.map((x) => resolveDay(pl.e, dayOf(x), null).base)).filter((h) => h > 0);
    return hs.length ? Math.min(...hs) : 0;
  })();
  const cap = shift === 'off' ? 0 : keepShift ? keepCap : shiftHours(shift);
  const allocSum = Object.values(alloc).reduce((s, v) => s + (+v || 0), 0);
  const allocErr = !leaveOn && shift !== 'off' && (!keepShift || touched) && cap > 0 && !allPid && allocSum > cap ? 'Οι ώρες στα έργα (' + fmtNum(allocSum) + ') ξεπερνούν τη βάρδια (' + cap + ' ώρες).' : '';
  const countable = (e, x) => leaveOn || !keepShift || !multi || (() => { const y = resolveDay(e, dayOf(x), entriesFor(e.id, x)); return !!(y.shift || y.override); })();
  const total = plan.reduce((s, x) => s + x.days.filter((d) => countable(x.e, d)).length, 0);
  const emptyErr = multi && !rangeErr && !total ? 'Καμία ημέρα στο εύρος δεν ταιριάζει με τις επιλεγμένες ημέρες εβδομάδας.' : '';
  const err = rangeErr || leaveErr || allocErr || emptyErr;

  // existing entries inside the range (known for the month on screen)
  const conflicts = useMemo(() => {
    const c = { leave: 0, ot: 0, other: 0, days: 0, unknown: false };
    if (!multi) return c;
    plan.forEach(({ e, days }) => days.forEach((x) => {
      const ov = entriesFor(e.id, x);
      if (ov === undefined || (ov === null && x.slice(0, 7) !== isoInit.slice(0, 7))) { c.unknown = true; return; }
      if (!ov) return; c.days++;
      if (ov.leave) c.leave++; else if (ov.ot) c.ot++; else c.other++;
    }));
    return c;
  }, [plan, multi]);

  function changeShift(v) {
    setShift(v); setAllPid(null);
    if (!touched && !bulk && v !== 'keep') { const d = defaultAlloc(first, v === 'off' ? 0 : shiftHours(v), dayOf(from).dow); const o = {}; rowsP.forEach((p) => { o[p] = String(d[p] || 0); }); setAlloc(o); }
  }

  function changesFor(e, days) {
    const ch = {};
    days.forEach((x) => {
      if (leaveOn) { ch[x] = { leave: lt }; return; }
      const def = resolveDay(e, dayOf(x), null);
      const rem = multi && !remoteTouched ? !!def.remote || (!def.shift && !!(e.remote || [])[dayOf(x).dow]) : remote;
      const sh = keepShift ? (def.shift || 'off') : shift;
      const want = { shift: sh, remote: sh === 'off' ? false : rem, ot: otOn ? +ot : 0, otReason: otOn ? reason.trim() : '' };
      if (otOn) want.otProject = otProject && (inProject(e, otProject) || rowsP.includes(otProject)) ? otProject : primaryProject(e);
      if (sh !== 'off' && (!keepShift || touched) && (!bulk || touched)) {
        const dflt = defaultAlloc(e, shiftHours(sh), dayOf(x).dow); const mine = {};
        if (allPid) mine[allPid] = shiftHours(sh);
        else Object.entries(alloc).forEach(([k, v]) => { if (+v) mine[k] = +v; });
        const sameA = Object.keys({ ...dflt, ...mine }).every((k) => (+dflt[k] || 0) === (+mine[k] || 0));
        if (!sameA) want.alloc = mine;
      }
      const same = (def.shift || 'off') === want.shift && !!def.remote === want.remote && !want.ot && !want.alloc;
      ch[x] = same ? null : want;
    });
    return ch;
  }

  // "apply my changes": per day, start from what the day already holds and change only what was touched in this dialog
  function mergedDay(e, iso, ov) {
    const d = dayOf(iso); const cur = resolveDay(e, d, ov);
    if (cur.inactive) return undefined;
    if (leaveOn) return { leave: lt };
    if (cur.leave) return undefined;                                   // a day off stays off
    const def = resolveDay(e, d, null);
    const next = { shift: cur.shift || 'off', remote: !!cur.remote, ot: cur.ot || 0, otProject: cur.otProject || '', otReason: cur.otReason || '' };
    const shiftChanged = !keepShift;
    if (shiftChanged) next.shift = shift;
    if (remoteTouched) next.remote = remote;
    if (next.shift === 'off') next.remote = false;
    if (otTouched) {
      next.ot = otOn ? +ot : 0; next.otReason = otOn ? reason.trim() : '';
      next.otProject = otOn ? (otProject && (inProject(e, otProject) || rowsP.includes(otProject)) ? otProject : primaryProject(e)) : '';
    }
    const h = shiftHours(next.shift === 'off' ? null : next.shift);
    if (h && (touched || removed.length)) {
      let mine = {};
      if (allPid) mine[allPid] = h;
      else if (touched) Object.entries(alloc).forEach(([k, v]) => { if (+v) mine[k] = +v; });
      else mine = { ...(cur.alloc || {}) };
      removed.forEach((p) => { delete mine[p]; });
      next.alloc = mine;
    } else if (!shiftChanged && ov && ov.alloc && h) next.alloc = { ...ov.alloc };   // keep a custom split unless the shift changed
    // drop what equals the employee's normal day
    const dfl = defaultAlloc(e, h, d.dow);
    if (next.alloc && Object.keys({ ...dfl, ...next.alloc }).every((k) => (+dfl[k] || 0) === (+next.alloc[k] || 0))) delete next.alloc;
    if (!next.ot) { delete next.ot; delete next.otProject; delete next.otReason; }
    const same = (def.shift || 'off') === next.shift && !!def.remote === next.remote && !next.ot && !next.alloc;
    return same ? null : next;
  }

  async function run(build, keep) {
    setBusy(true);
    try {
      const undo = []; let n = 0, skipped = 0;
      // new projects that get hours (or the overtime) join the employee's team, so they count in that project's totals
      const given = rowsP.filter((p) => (allPid === p) || (+alloc[p] > 0 && !removed.includes(p)) || (otOn && otProject === p));
      for (const { e, days: ds } of plan) {
        if (!ds.length || build !== changesFor) continue;
        const firstDay = [...ds].sort()[0];
        const need = touched || otOn ? given.filter((p) => !assignmentsOf(e).some((a) => a.projectId === p && activeOn(a, firstDay))) : [];
        if (need.length && onJoin && !leaveOn) await onJoin(e.id, need, firstDay);
        if (removed.length && onLeave) await onLeave(e.id, removed, firstDay);   // leaves from the first chosen day on
      }
      const merge = multi && policy === 'merge' && build === changesFor && onUpdate;
      for (const { e, days } of plan) {
        const res = merge
          ? ((await onUpdate(e.id, days, (ov, iso) => mergedDay(e, iso, ov))) || {})
          : ((await onSave(e.id, build(e, days), { keep })) || {});
        const prev = res.prev || {}; const k = Object.keys(prev).length; n += k; skipped += res.skipped || 0;
        if (k) undo.push({ empId: e.id, prev });
      }
      onClose(true, { undo, n, skipped });
    } catch (e) { setBusy(false); }
  }
  const submit = () => { if (!err) run(changesFor, false); };
  const reset = () => run((e, days) => { const ch = {}; days.forEach((x) => { ch[x] = null; }); return ch; }, false);

  const otOptionsP = bulk ? [{ value: '', label: 'Κύριο έργο κάθε συνεργάτη' }, ...rowsP.map((p) => ({ value: p, label: pName(p) }))] : rowsP.map((p) => ({ value: p, label: pName(p) }));
  const title = (
    <span className="mtitle"><span>{cells ? (bulk ? 'Επιλογή: ' + plural(total, 'ημέρα', 'ημέρες') + ' σε ' + emps.length + ' συνεργάτες' : fullName(first) + ': ' + plural(total, 'ημέρα', 'ημέρες')) : bulk ? 'Μαζική επεξεργασία: ' + emps.length + ' συνεργάτες' : fullName(first)}</span>
      <span className="mtitle__d">{cells ? (() => { const all = plan.flatMap((x) => x.days).sort(); return all.length ? fmtDate(all[0]) + (all.length > 1 && all[all.length - 1] !== all[0] ? ' – ' + fmtDate(all[all.length - 1]) : '') : ''; })() : range ? fmtDate(from) + ' – ' + fmtDate(to) : fmtDate(from)}</span></span>
  );
  const showReset = multi ? conflicts.days > 0 || conflicts.unknown : (!bulk && r.override);
  const conflictParts = [conflicts.leave && plural(conflicts.leave, 'με άδεια', 'με άδεια'), conflicts.ot && plural(conflicts.ot, 'με υπερωρία', 'με υπερωρία'), conflicts.other && plural(conflicts.other, 'με άλλη αλλαγή', 'με άλλη αλλαγή')].filter(Boolean);

  return (
    <Overlay onClose={() => onClose(false)}>
      <A.Modal modal title={title} onClose={() => onClose(false)} width={780} footerAlign="stretch"
        footer={<div className="mfoot">
          {showReset && <A.Button color="text" onClick={reset} disabled={busy || !!rangeErr}>{multi ? 'Επαναφορά επιλεγμένων στην προεπιλογή' : 'Επαναφορά προεπιλογής'}</A.Button>}
          <span className="spacer" />
          <A.Button color="warning" onClick={() => onClose(false)} disabled={busy}>Ακύρωση</A.Button>
          <A.Button color="main" onClick={submit} disabled={busy || !!err}>{multi ? 'Αποθήκευση σε ' + plural(total, 'ημέρα', 'ημέρες') : 'Αποθήκευση'}</A.Button>
        </div>}>
        <div className="dayed">
          {!cells && <div className="dayed__row">
            <div className="dayed__sw"><A.Toggle checked={range} onChange={(v) => { setRange(v); if (v && to < from) setTo(from); }} label="Εύρος ημερών" /></div>
            {range ? (
              <div className="dayed__pair">
                <TextF label="Από" type="date" value={from} onChange={(v) => { if (v) { setFrom(v); if (to < v) setTo(v); } }} />
                <TextF label="Έως" type="date" value={to} onChange={(v) => v && setTo(v)} error={rangeErr || undefined} />
              </div>
            ) : (
              <TextF label="Ημερομηνία" type="date" value={from} onChange={(v) => { if (v) { setFrom(v); setTo(v); setLs(v); setLe(v); } }} />
            )}
          </div>}
          {range && (
            <div className="dayed__row">
              <div className="dayed__sw" />
              <Field label="Ημέρες εβδομάδας">
                <div className="dowpick">
                  {DOW_SHORT.map((d, i) => (
                    <A.Checkbox key={i} filled checked={dows[i]} label={d} aria-label={DOW_FULL[i]}
                      onChange={(v) => setDows((s) => s.map((x, j) => j === i ? v : x))} />
                  ))}
                </div>
                <A.Checkbox filled checked={skipHol} onChange={setSkipHol} label="Παράλειψη αργιών" />
              </Field>
            </div>
          )}
          {bulk && !cells && <p className="body-xs muted dayed__names">{emps.map(fullName).join(', ')}</p>}

          <div className="dayed__row">
            <div className="dayed__sw"><A.Toggle checked={remote && shift !== 'off' && !leaveOn} disabled={leaveOn || shift === 'off'} onChange={(v) => { setRemote(v); setRemoteTouched(true); }} label="Τηλεργασία" />
              {multi && !remoteTouched && !leaveOn && shift !== 'off' && <span className="body-xs muted dayed__hint">Όπως ορίζεται για κάθε ημέρα</span>}</div>
            <SelectF label="Επιλογή βάρδιας" value={shift} onChange={changeShift} options={multi ? [{ value: 'keep', label: 'Χωρίς αλλαγή (η βάρδια κάθε ημέρας)' }, ...shiftOptions] : shiftOptions.concat(shift === 'keep' ? [{ value: 'keep', label: 'Χωρίς αλλαγή' }] : [])} disabled={leaveOn} />
          </div>
          {!leaveOn && shift !== 'off' && (
            <div className="dayed__row">
              <div className="dayed__sw" />
              {keepShift && !keepCap ? (
                <p className="body-xs muted">Καμία από τις επιλεγμένες ημέρες δεν έχει βάρδια. Επιλέξτε βάρδια για να ορίσετε ώρες ανά έργο.</p>
) : (
                <Field label={multi ? 'Ώρες ανά έργο (σε κάθε ημέρα)' : 'Ώρες ανά έργο'}>
                  {mixed && !touched
                    ? <p className="body-xs alloc__keep alloc__mixed">Οι επιλεγμένες ημέρες δεν έχουν όλες την ίδια κατανομή (διαφέρουν: {mixed.odd.slice(0, 8).map((x) => x.slice(8) + '/' + x.slice(5, 7)).join(', ')}{mixed.odd.length > 8 ? '…' : ''}). Συμπληρώστε τις ώρες για να ισχύσουν σε όλες· αλλιώς μένουν όπως είναι.</p>
                    : keepShift && !touched && <p className="body-xs muted alloc__keep">Μένουν όπως είναι σε κάθε ημέρα. Αλλάξτε μια τιμή, προσθέστε έργο ή πατήστε «Όλη η βάρδια» για να ισχύσει σε όλες τις επιλεγμένες ημέρες.</p>}
                  <div className="alloc">
                    {rowsP.map((p) => (
                      <div key={p} className="alloc__row alloc__row--day">
                        <span className="alloc__name" title={pName(p)}>
                          <span className="body-s">{pName(p)}</span>
                          <span className={'caption alloc__mode' + ((bulk ? membersOf(p).length === emps.length : asgOf(p)) ? '' : ' is-new') + (removed.includes(p) ? ' is-out' : '')}>{removed.includes(p) ? 'αφαιρείται από την ομάδα του έργου από ' + fmtDate(plan[0] && plan[0].days.length ? [...plan[0].days].sort()[0] : from) : modeText(p)}</span>
                        </span>
                        <A.Button color="text" leadingIcon="delete" aria-label={(removed.includes(p) ? 'Αναίρεση αφαίρεσης από το ' : 'Αφαίρεση από το ') + pName(p)}
                          onClick={() => {
                            if (extra.includes(p)) { setExtra((x) => x.filter((q) => q !== p)); setAlloc((s) => { const o = { ...s }; delete o[p]; return o; }); return; }
                            setTouched(true); setAllPid(null);
                            if (removed.includes(p)) setRemoved((x) => x.filter((q) => q !== p));
                            else { setRemoved((x) => [...x, p]); setAlloc((s) => ({ ...s, [p]: '0' })); }
                          }}>{removed.includes(p) ? 'Επαναφορά' : ''}</A.Button>
                        <A.Button color="text" disabled={removed.includes(p)} onClick={() => { setTouched(true); setAllPid(p); setAlloc((s) => { const o = {}; Object.keys(s).forEach((k) => { o[k] = '0'; }); o[p] = String(cap); return o; }); }}
                          aria-label={'Όλη η βάρδια στο ' + pName(p)}>Όλη η βάρδια</A.Button>
                        <A.TextInput type="number" min="0" step="0.5" max={cap} aria-label={'Ώρες στο ' + pName(p)} value={alloc[p]} disabled={removed.includes(p)} placeholder={mixed && !touched ? 'διάφορα' : undefined}
                          onChange={(ev) => { setTouched(true); setAllPid(null); const v = ev.target.value; setAlloc((s) => ({ ...s, [p]: v })); }} />
                      </div>
                    ))}
                    {!rowsP.length && <p className="body-xs muted">Ο συνεργάτης δεν έχει ανατεθεί σε έργο. Προσθέστε έργο για αυτή την ημέρα.</p>}
                    {(() => {
                      const left = projects.filter((p) => !rowsP.includes(p.id)).map((p) => { const c = (clients || []).find((x) => x.id === p.clientId); return { value: p.id, label: (c ? c.name + ' | ' : '') + p.name }; })
                        .sort((a, b) => a.label.localeCompare(b.label, 'el'));
                      return left.length > 0 && (
                        <div className="alloc__add">
                          <A.Dropdown aria-label={multi ? 'Προσθήκη έργου για τις επιλεγμένες ημέρες' : 'Προσθήκη έργου για αυτή την ημέρα'} value="" placeholder={multi ? '+ Προσθήκη έργου για τις επιλεγμένες ημέρες' : '+ Προσθήκη έργου για αυτή την ημέρα'} options={left}
                            onChange={(pid) => { if (!pid) return; setTouched(true); setAllPid(null); setExtra((x) => [...x, pid]); setAlloc((s) => ({ ...s, [pid]: String(Math.max(0, cap - Object.values(s).reduce((t, v) => t + (+v || 0), 0))) })); }} />
                        </div>
                      );
                    })()}
                    <div className={'alloc__sum body-xs' + (allocErr ? ' is-err' : '')} role={allocErr ? 'alert' : undefined}>
                      <span>{allocErr || (allPid ? 'Όλη η βάρδια κάθε ημέρας στο ' + pName(allPid) : 'Κατανεμημένες ' + fmtNum(allocSum) + ' από ' + cap + ' ώρες' + (keepShift ? ' (η μικρότερη βάρδια των ημερών)' : ''))}</span>
                      {!allocErr && !allPid && allocSum < cap && <span className="muted">{fmtNum(cap - allocSum)} ώρες χωρίς έργο</span>}
                    </div>
                  </div>
                </Field>
              )}
            </div>
          )}
          <div className="dayed__row">
            <div className="dayed__sw"><A.Toggle checked={otOn && !leaveOn} disabled={leaveOn} onChange={(v) => { setOtOn(v); setOtTouched(true); }} label="Υπερωρία" /></div>
            <div className="dayed__pair">
              <SelectF label={multi ? 'Υπερωρία ανά ημέρα' : 'Προσθήκη υπερωρίας'} value={ot} onChange={(v) => { setOt(v); setOtTouched(true); }} options={otOptions} disabled={!otOn || leaveOn} />
              <SelectF label="Έργο υπερωρίας" value={otProject} onChange={(v) => { setOtProject(v); setOtTouched(true); }} options={otOptionsP} disabled={!otOn || leaveOn || !otOptionsP.length} placeholder="Επιλογή έργου" />
            </div>
          </div>
          {otOn && !leaveOn && (
            <div className="dayed__row">
              <div className="dayed__sw" />
              <TextF label="Αιτιολογία" multiline value={reason} onChange={(v) => { setReason(v); setOtTouched(true); }} placeholder="Π.χ. αυξημένος όγκος κλήσεων" />
            </div>
          )}
          <div className="dayed__row">
            <div className="dayed__sw"><A.Toggle checked={leaveOn} onChange={setLeaveOn} label="Άδεια" /></div>
            {multi ? (
              <p className="body-xs muted">{leaveOn ? 'Η άδεια καταχωρίζεται στις επιλεγμένες ημέρες και ισχύει για όλα τα έργα.' : 'Η άδεια θα καλύψει τις επιλεγμένες ημέρες.'}</p>
            ) : (
              <div className="dayed__pair">
                <TextF label="Έναρξη άδειας" type="date" value={ls} onChange={setLs} />
                <TextF label="Λήξη άδειας" type="date" value={le} onChange={setLe} error={leaveErr || undefined} />
              </div>
            )}
          </div>
          {leaveOn && (
            <div className="dayed__row">
              <div className="dayed__sw" />
              <SelectF label="Είδος άδειας" value={lt} onChange={setLt} options={LEAVE_TYPES.map((l) => ({ value: l.value, label: l.label }))} />
            </div>
          )}
          {leaveOn && !multi && <p className="body-xs muted dayed__note">Η άδεια ισχύει για όλα τα έργα και καταχωρίζεται στις εργάσιμες ημέρες του διαστήματος. Σαββατοκύριακα και αργίες παραλείπονται.</p>}

          {multi && !rangeErr && (
            <div className="preview" role="status">
              <p className="body-bold-s">
                {total ? 'Θα ενημερωθούν ' + plural(total, 'ημέρα', 'ημέρες') + (emps.length > 1 ? ' σε ' + emps.length + ' συνεργάτες' : '') + '.' : 'Δεν υπάρχουν ημέρες για ενημέρωση.'}
              </p>
              {plan.map((x) => ({ e: x.e, days: x.days.filter((d) => countable(x.e, d)) })).filter((x) => x.days.length).slice(0, 8).map(({ e, days }) => (
                <p key={e.id} className="body-xs muted preview__days">{bulk && <strong>{fullName(e)}: </strong>}{days.slice(0, 31).map((x) => { const d = dayOf(x); return DOW_SHORT[d.dow] + ' ' + x.slice(8) + '/' + x.slice(5, 7); }).join(', ')}{days.length > 31 ? ' …' : ''}</p>
              ))}
              {plan.filter((x) => x.days.length).length > 8 && <p className="body-xs muted">και ακόμη {plan.filter((x) => x.days.length).length - 8} συνεργάτες</p>}
              {(conflicts.days > 0 || conflicts.unknown) && (<>
                <p className="body-s">
                  {conflicts.days > 0 ? plural(conflicts.days, 'ημέρα έχει', 'ημέρες έχουν') + ' ήδη καταχώριση (' + conflictParts.join(', ') + ').' : ''}
                  {conflicts.unknown ? (conflicts.days ? ' ' : '') + 'Οι ημέρες άλλου μήνα ελέγχονται κατά την αποθήκευση.' : ''}
                </p>
                <A.RadioGroup name="policy" filled value={policy} onChange={setPolicy} aria-label="Τι γίνεται με τις υπάρχουσες καταχωρίσεις"
                  options={[{ value: 'merge', label: 'Εφαρμογή μόνο όσων άλλαξα (τα υπόλοιπα κάθε ημέρας μένουν)' }, { value: 'replace', label: 'Αντικατάσταση όλης της ημέρας' }]} />
                <p className="body-xs muted">{policy === 'merge' ? 'Π.χ. αν αλλάξατε μόνο τις ώρες ανά έργο, οι υπερωρίες και η τηλεργασία κάθε ημέρας δεν αγγίζονται. Οι ημέρες με άδεια μένουν ως έχουν, εκτός αν ορίσετε άδεια.' : 'Κάθε ημέρα παίρνει ακριβώς ό,τι ορίζει αυτό το παράθυρο· προηγούμενες υπερωρίες και αλλαγές χάνονται.'}</p>
              </>)}
            </div>
          )}
        </div>
      </A.Modal>
    </Overlay>
  );
}


// ---------- Employee selection table ----------
export function PickEmployees({ employees, projects, selected, setSelected, pid }) {
  const [q, setQ] = useState('');
  const pName = (id) => { const p = projects.find((x) => x.id === id); return p ? p.name : '—'; };
  const list = useMemo(() => employees
    .filter((e) => !q || norm(fullName(e) + ' ' + e.code + ' ' + e.email).includes(norm(q))).sort(byName)
    .map((e) => {
      const avail = availableOf(e, pid);
      const lbl = (a) => pName(a.projectId) + (a.mode === 'fixed' ? ' (' + fmtNum(a.hours) + 'ω)' : a.mode === 'rest' ? ' (κύριο)' : ' (ευέλ.)');
      return { ...e, avail, projs: assignmentsOf(e).map(lbl).join(', ') || '—' };
    }), [employees, q, pid, projects]);
  return (
    <div className="pick">
      <div className="pick__bar">
        <div className="pick__search"><A.SearchInput value={q} onChange={(v) => setQ(v)} placeholder="Αναζήτηση συνεργάτη" /></div>
        <span className="body-s muted">{selected.length} επιλεγμένοι</span>
      </div>
      <div className="pick__table">
        <A.Table selectable selectedKeys={selected} onSelectionChange={setSelected} rowKey="id" emptyText="Δεν βρέθηκαν συνεργάτες"
          selectAllLabel="Επιλογή όλων" selectRowLabel="Επιλογή γραμμής"
          columns={[
            { key: 'code', title: 'Κωδικός', width: 110 },
            { key: 'last', title: 'Επώνυμο', render: (v) => upperGr(v) },
            { key: 'first', title: 'Όνομα', render: (v) => upperGr(v) },
            { key: 'projs', title: 'Έργα σήμερα', muted: true },
            { key: 'avail', title: 'Διαθέσιμες ώρες', align: 'right', render: (v) => fmtNum(v) },
          ]}
          rows={list} />
      </div>
    </div>
  );
}

export function AddEmployees({ project, employees, projects, onClose, onSave }) {
  const [sel, setSel] = useState([]);
  const [mode, setMode] = useState('none');      // how they join: flexible by default, so nobody's main project is touched
  const [hours, setHours] = useState('4');
  const [days, setDays] = useState([true, true, true, true, true, true, true]);
  const [pFrom, setPFrom] = useState(''); const [pTo, setPTo] = useState('');   // optional period, e.g. a two-week reinforcement
  const [busy, setBusy] = useState(false);
  const h = +hours || 0;
  const short = mode === 'fixed' ? employees.filter((e) => sel.includes(e.id) && [0, 1, 2, 3, 4, 5, 6].some((d) => days[d] && fixedOn(e, d, project.id) + h > capacityOf(e))) : [];
  const err = mode === 'fixed' && !h ? 'Ορίστε ώρες μεγαλύτερες από 0.'
    : !days.some(Boolean) ? 'Επιλέξτε τουλάχιστον μία ημέρα.'
    : pFrom && pTo && pTo < pFrom ? 'Το «Έως» είναι πριν από το «Από».'
    : short.length ? 'Δεν χωράνε ' + fmtNum(h) + ' σταθερές ώρες στη βάρδια των: ' + short.map((e) => fullName(e) + ' (διαθέσιμες ' + fmtNum(availableOf(e, project.id)) + ')').join(', ') + '. Επιλέξτε λιγότερες ώρες ή «Χωρίς σταθερές ώρες».' : '';
  const modeOpts = [
    { value: 'none', label: 'Χωρίς σταθερές ώρες (ορίζονται ανά ημέρα)' },
    { value: 'fixed', label: 'Σταθερές ώρες' },
    { value: 'rest', label: 'Κύριο έργο (υπόλοιπο βάρδιας)' },
  ];
  return (
    <Overlay onClose={onClose}>
      <A.Modal modal size="lg" width={1040} title={'Προσθήκη συνεργάτη στο ' + project.name} onClose={onClose}
        footer={<div className="mfoot"><span className="spacer" /><A.Button color="outline" onClick={onClose}>Ακύρωση</A.Button>
          <A.Button color="main" disabled={!sel.length || busy || !!err} onClick={async () => { setBusy(true); try { await onSave(sel, { mode, hours: mode === 'fixed' ? h : 0, days, from: pFrom, to: pTo }); onClose(); } catch (e) { setBusy(false); } }}>
            {sel.length ? 'Προσθήκη ' + sel.length + (sel.length === 1 ? ' συνεργάτη' : ' συνεργατών') : 'Προσθήκη'}</A.Button></div>}>
        <div className="addrow">
          <SelectF label="Συμμετοχή στο έργο" value={mode} onChange={setMode} options={modeOpts} />
          {mode === 'fixed' && <TextF label="Ώρες ημερησίως" type="number" min="0.5" step="0.5" value={hours} onChange={setHours} />}
          <Field label="Ημέρες">
            <div className="asg__days">
              {DOW_SHORT.map((d, k) => (
                <button key={k} type="button" className={'daychip' + (days[k] ? ' is-on' : '')} aria-pressed={days[k]}
                  aria-label={['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'][k]}
                  onClick={() => setDays((s) => s.map((x, j) => (j === k ? !x : x)))}>{d}</button>
              ))}
            </div>
          </Field>
        </div>
        <div className="addrow">
          <TextF label="Από (προαιρετικό)" type="date" value={pFrom} onChange={setPFrom} />
          <TextF label="Έως (προαιρετικό)" type="date" value={pTo} onChange={setPTo} />
          <p className="body-s muted">{pTo ? 'Η συμμετοχή λήγει μόνη της μετά τις ' + fmtDate(pTo) + '.' : 'Χωρίς «Έως» η συμμετοχή δεν λήγει.'}</p>
        </div>
        <p className="body-s muted addnote">{mode === 'none' ? 'Μπαίνουν στην ομάδα χωρίς να αλλάξει το πρόγραμμά τους. Τους δίνετε ώρες όποια μέρα χρειάζεται, από το κελί ή με «Μετακίνηση σε έργο».'
          : mode === 'fixed' ? 'Οι ώρες αφαιρούνται κάθε επιλεγμένη ημέρα από το κύριο έργο τους.'
          : 'Το έργο γίνεται το κύριο τους: παίρνει ό,τι μένει από τη βάρδια. Αν είχαν άλλο κύριο έργο, εκείνο γίνεται «χωρίς σταθερές ώρες».'}</p>
        {sel.length > 0 && err && <p className="body-s errbox" role="alert">{err}</p>}
        <PickEmployees employees={employees.filter((e) => !inProject(e, project.id))} projects={projects} selected={sel} setSelected={setSel} pid={project.id} />
      </A.Modal>
    </Overlay>
  );
}


// ---------- Project form ----------
export function ProjectForm({ project, clients, employees, projects, onClose, onSave }) {
  const isNew = !project;
  const client = project ? clients.find((c) => c.id === project.clientId) : null;
  const [f, setF] = useState(() => ({
    clientName: client ? client.name : '', name: '', supervisor: '', workdays: '22', weekendDays: '0', billing: 'Ανά ώρα',
    budgetPlan: '', budget: '', rate: '37.5', workplace: 'ΕΝΤΟΣ', location: LOCATIONS[0], ...(project || {}),
  }));
  const [sel, setSel] = useState(() => project ? employees.filter((e) => inProject(e, project.id)).map((e) => e.id) : []);
  const [tried, setTried] = useState(false); const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const listId = useId();
  const errs = { clientName: !String(f.clientName).trim(), name: !String(f.name).trim(), supervisor: !f.supervisor };
  const bad = Object.values(errs).some(Boolean);
  async function submit() {
    setTried(true); if (bad) return; setBusy(true);
    try { await onSave(f, sel); onClose(); } catch (e) { setBusy(false); }
  }
  return (
    <Overlay onClose={onClose}>
      <A.Modal modal size="lg" width={1120} title={isNew ? 'Νέο έργο' : 'Επεξεργασία έργου: ' + project.name} onClose={onClose}
        footer={<div className="mfoot"><span className="spacer" /><A.Button color="outline" onClick={onClose}>Ακύρωση</A.Button>
          <A.Button color="main" onClick={submit} disabled={busy}>{isNew ? 'Δημιουργία έργου' : 'Αποθήκευση αλλαγών'}</A.Button></div>}>
        <div className="form3">
          <Field label="Πελάτης" required htmlFor={listId + 'c'}>
            <A.TextInput id={listId + 'c'} list={listId} value={f.clientName} placeholder="Υπάρχων ή νέος πελάτης" error={tried && errs.clientName ? 'Συμπληρώστε τον πελάτη' : undefined}
              onChange={(e) => set('clientName')(e.target.value)} />
            <datalist id={listId}>{clients.map((c) => <option key={c.id} value={c.name} />)}</datalist>
          </Field>
          <TextF label="Τίτλος έργου" required value={f.name} onChange={set('name')} error={tried && errs.name ? 'Συμπληρώστε τον τίτλο' : undefined} />
          <SelectF label="Προϊστάμενος" required value={f.supervisor} onChange={set('supervisor')} options={SUPERVISORS} error={tried && errs.supervisor ? 'Επιλέξτε προϊστάμενο' : undefined} />
          <TextF label="Εργάσιμες καθημερινές" type="number" min="0" value={f.workdays} onChange={set('workdays')} />
          <TextF label="Εργάσιμες Σαββατοκύριακα" type="number" min="0" value={f.weekendDays} onChange={set('weekendDays')} />
          <SelectF label="Τρόπος τιμολόγησης" value={f.billing} onChange={set('billing')} options={BILLING} />
          <TextF label="Προγραμματισμός budget καθημερινές" value={f.budgetPlan} onChange={set('budgetPlan')} placeholder="Π.χ. 1935/fte" />
          <TextF label="Budget (€)" type="number" min="0" step="0.01" value={f.budget} onChange={set('budget')} />
          <TextF label="Χρέωση ανά ώρα (€)" type="number" min="0" step="0.5" value={f.rate} onChange={set('rate')} />
          <SelectF label="Τόπος εργασίας" value={f.workplace} onChange={set('workplace')} options={WORKPLACES} />
          <SelectF label="Τοποθεσία" value={f.location} onChange={set('location')} options={LOCATIONS} wide />
        </div>
        <h3 className="body-bold-m sect">Συνεργάτες του έργου</h3>
        <p className="body-xs muted">Οι νέοι συνεργάτες μπαίνουν με όλες τις διαθέσιμες ώρες τους. Η κατανομή αλλάζει από την καρτέλα κάθε συνεργάτη.</p>
        <PickEmployees employees={employees} projects={projects} selected={sel} setSelected={setSel} pid={project ? project.id : '__new'} />
      </A.Modal>
    </Overlay>
  );
}

// ---------- Employee form ----------
export function EmployeeForm({ employee, projects, clients, employees, onClose, onSave }) {
  const isNew = !employee;
  const [f, setF] = useState(() => ({
    code: '', last: '', first: '', direction: DIRECTIONS[0], department: DEPARTMENTS[0], branch: BRANCHES[0], position: POSITIONS[0],
    supervisor: '', schedule: '09-17', remote: [false, false, false, false, false, false], hireDate: '', leaveDate: '',
    contractTerm: CONTRACT_TERMS[0], contractHours: '8', email: '', phone: '', location: '', ...(employee || {}),
    ...(employee ? { schedule: scheduleOn(employee, todayIso()).schedule, remote: [...scheduleOn(employee, todayIso()).remote] } : {}),   // edit today's rule
  }));
  const today = todayIso();
  const curSc = employee ? scheduleOn(employee, today) : null;
  const scChanged = !!employee && (f.schedule !== curSc.schedule || JSON.stringify((f.remote || []).slice(0, 6).map(Boolean)) !== JSON.stringify((curSc.remote || []).slice(0, 6).map(Boolean)));
  const [scWhen, setScWhen] = useState('date');          // 'date': from a day on (history kept) | 'all': correction for the whole period
  const [scFrom, setScFrom] = useState(today);
  const [asg, setAsg] = useState(() => assignmentsOf(employee).map((a) => { const r = { projectId: a.projectId, mode: a.mode, hours: String(a.hours || ''), days: [...a.days], from: a.from || '', to: a.to || '' }; return { ...r, orig: { projectId: r.projectId, mode: r.mode, hours: r.hours, days: r.days } }; }));
  const ruleOf = (a) => JSON.stringify([a.projectId, a.mode, a.mode === 'fixed' ? +a.hours : 0, a.days]);
  // a row that started before today and whose rule was edited would rewrite past days
  const rewritesPast = (a) => a.orig && ruleOf(a) !== ruleOf(a.orig) && (!a.from || a.from < today) && (!a.to || a.to >= today);
  const splitToday = (i) => setAsg((list) => { const r = list[i]; const out = list.map((x, j) => (j === i ? { ...x, ...(x.orig || {}), to: addDays(today, -1) } : x)); out.splice(i + 1, 0, { ...r, orig: undefined, from: today }); return out; });
  const [tried, setTried] = useState(false); const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const cap = shiftHours(f.schedule);
  // fixed hours per weekday must fit in the shift; at most one main ("rest") project
  // rows run in periods (from / to); the checks run on every date where the set of active rows changes
  const act = (iso) => asg.filter((a) => (!a.from || iso >= a.from) && (!a.to || iso <= a.to));
  const checkDates = [...new Set([today, ...asg.map((a) => a.from).filter(Boolean), ...asg.map((a) => a.to && addDays(a.to, 1)).filter(Boolean)])].sort();
  const sumOn = (rows, d) => rows.filter((a) => a.mode === 'fixed' && a.days[d]).reduce((s, a) => s + (+a.hours || 0), 0);
  const nowRows = act(today);
  const perDay = [0, 1, 2, 3, 4, 5, 6].map((d) => sumOn(nowRows, d));
  const restDays = [0, 1, 2, 3, 4, 5, 6].map((d) => nowRows.some((a) => a.mode === 'rest' && a.days[d]));
  const overAt = checkDates.find((iso) => [0, 1, 2, 3, 4].some((d) => sumOn(act(iso), d) > cap));
  const twoRestAt = checkDates.find((iso) => act(iso).filter((a) => a.mode === 'rest').length > 1);
  const badPeriod = asg.some((a) => a.from && a.to && a.to < a.from);
  // weekends have no default shift (weekend work is set day by day), so only weekdays are checked
  const overDays = perDay.map((h, d) => (d < 5 && h > cap ? d : -1)).filter((d) => d >= 0);
  const asgSum = Math.max(0, ...perDay);
  const asgErr = overDays.length ? 'Οι σταθερές ώρες ξεπερνούν τη βάρδια (' + cap + ' ώρες) τις ημέρες: ' + overDays.map((d) => DOW_SHORT[d]).join(', ') + '.'
    : overAt ? 'Από ' + fmtDate(overAt) + ' οι σταθερές ώρες ξεπερνούν τη βάρδια (' + cap + ' ώρες).'
    : badPeriod ? 'Σε μια ανάθεση το «Έως» είναι πριν από το «Από».'
    : twoRestAt ? 'Από ' + fmtDate(twoRestAt) + ' δύο έργα παίρνουν το υπόλοιπο της βάρδιας· κρατήστε ένα.'
    : asg.some((a) => !a.projectId) ? 'Επιλέξτε έργο σε κάθε γραμμή.'
    : asg.some((a) => a.mode === 'fixed' && !(+a.hours > 0)) ? 'Ορίστε ώρες στα έργα με σταθερές ώρες.'
    : asg.some((a) => !a.days.some(Boolean)) ? 'Επιλέξτε τουλάχιστον μία ημέρα σε κάθε έργο.' : '';
  const dup = employees.some((e) => e.id !== (employee && employee.id) && String(e.code).trim() === String(f.code).trim() && f.code);
  const errs = {
    code: !String(f.code).trim() ? 'Συμπληρώστε τον κωδικό' : dup ? 'Ο κωδικός υπάρχει ήδη' : '',
    last: !String(f.last).trim() ? 'Συμπληρώστε το επώνυμο' : '',
    first: !String(f.first).trim() ? 'Συμπληρώστε το όνομα' : '',
    leaveDate: f.leaveDate && f.hireDate && f.leaveDate < f.hireDate ? 'Πριν από την πρόσληψη' : '',
    scFrom: scChanged && scWhen === 'date' && !scFrom ? 'Ορίστε από πότε ισχύει' : '',
    asg: asgErr,
  };
  const bad = Object.values(errs).some(Boolean);
  const projOptions = projects.map((p) => { const c = clients.find((x) => x.id === p.clientId); return { value: p.id, label: (c ? c.name + ' | ' : '') + p.name }; })
    .sort((a, b) => a.label.localeCompare(b.label, 'el'));
  function setAsgRow(i, patch) {
    setAsg((list) => list.map((a, j) => j === i ? { ...a, ...patch } : a));
    if (patch.projectId && i === 0) { const p = projects.find((x) => x.id === patch.projectId); if (p && p.supervisor) setF((s) => ({ ...s, supervisor: p.supervisor })); }
  }
  function addAsg() {
    setAsg((list) => {
      const free = cap - Math.max(0, ...[0, 1, 2, 3, 4].map((d) => list.filter((a) => a.mode === 'fixed' && a.days[d]).reduce((s, a) => s + (+a.hours || 0), 0)));
      const hasRest = list.some((a) => a.mode === 'rest');
      const mode = !list.length ? 'rest' : free > 0 && !hasRest ? 'fixed' : 'none';
      return [...list, { projectId: '', mode, hours: mode === 'fixed' ? String(free) : '', days: [true, true, true, true, true, true, true] }];
    });
  }
  async function submit() {
    setTried(true); if (bad) return; setBusy(true);
    try {
      const body = { ...f }; delete body.projectId;
      // shift / remote days: either a new rule from a date (history kept) or a correction of the whole period
      if (employee && scChanged) {
        if (scWhen === 'all') { body.schedules = []; }
        else {
          const hist = (employee.schedules || []).filter((h) => h.from !== scFrom);
          body.schedules = [...hist, { from: scFrom, schedule: f.schedule, remote: f.remote }].sort((x, y) => x.from.localeCompare(y.from));
          body.schedule = employee.schedule || '09-17'; body.remote = employee.remote || [];
        }
      } else if (employee) { body.schedule = employee.schedule || body.schedule; body.remote = employee.remote || body.remote; body.schedules = employee.schedules || []; }
      await onSave({ ...body, assignments: asg.map((a) => ({ projectId: a.projectId, mode: a.mode, hours: a.mode === 'fixed' ? +a.hours : 0, days: a.days, from: a.from || '', to: a.to || '' })),   // orig is UI-only
        code: String(f.code).trim(), last: upperGr(f.last.trim()), first: upperGr(f.first.trim()) });
      onClose();
    } catch (e) { setBusy(false); }
  }
  const e = (k) => (tried && errs[k]) || undefined;
  return (
    <Overlay onClose={onClose}>
      <A.Modal modal size="lg" width={1120} title={isNew ? 'Νέος συνεργάτης' : 'Επεξεργασία: ' + fullName(employee)} onClose={onClose}
        footer={<div className="mfoot"><span className="spacer" /><A.Button color="outline" onClick={onClose}>Ακύρωση</A.Button>
          <A.Button color="main" onClick={submit} disabled={busy}>{isNew ? 'Δημιουργία συνεργάτη' : 'Αποθήκευση αλλαγών'}</A.Button></div>}>
        <div className="form3">
          <TextF label="Κωδικός συνεργάτη" required value={f.code} onChange={set('code')} placeholder="Π.χ. POW00700" error={e('code')} />
          <TextF label="Επώνυμο" required value={f.last} onChange={set('last')} error={e('last')} />
          <TextF label="Όνομα" required value={f.first} onChange={set('first')} error={e('first')} />
          <SelectF label="Διεύθυνση διαβάθμισης" value={f.direction} onChange={set('direction')} options={DIRECTIONS} />
          <SelectF label="Τμήμα απασχόλησης" value={f.department} onChange={set('department')} options={DEPARTMENTS} />
          <SelectF label="Υποκατάστημα" value={f.branch} onChange={set('branch')} options={BRANCHES} />
          <SelectF label="Τρέχουσα θέση εργασίας" value={f.position} onChange={set('position')} options={POSITIONS} />
          <SelectF label="Προϊστάμενος" value={f.supervisor} onChange={set('supervisor')} options={SUPERVISORS} />
          <SelectF label="Ωράριο" value={f.schedule} onChange={set('schedule')} options={SHIFTS.map((s) => ({ value: s, label: shiftLabel(s) }))} />
          <TextF label="Ημ/νία πρόσληψης" type="date" value={f.hireDate} onChange={set('hireDate')} />
          <TextF label="Ημ/νία αποχώρησης" type="date" value={f.leaveDate} onChange={set('leaveDate')} error={e('leaveDate')} />
          <SelectF label="Ορισμένου / αορίστου χρόνου" value={f.contractTerm} onChange={set('contractTerm')} options={CONTRACT_TERMS} />
          <SelectF label="Σύμβαση (ώρες)" value={String(f.contractHours)} onChange={set('contractHours')} options={CONTRACT_HOURS} />
          <TextF label="eMail" type="email" value={f.email} onChange={set('email')} />
          <TextF label="Τηλέφωνο" type="tel" value={f.phone} onChange={set('phone')} />
          <TextF label="Τοποθεσία" value={f.location} onChange={set('location')} placeholder="Π.χ. Ταύρος, 177 78" />
          <Field label="Έργα" wide>
            <div className="asg">
              {asg.map((a, i) => (
                <div key={i} className={'asg__item' + (a.to && a.to < today ? ' is-ended' : '')}>
                <div className="asg__row">
                  <A.Dropdown aria-label={'Έργο ' + (i + 1)} value={a.projectId} placeholder="Επιλογή έργου" onChange={(v) => setAsgRow(i, { projectId: v })}
                    options={projOptions.map((o) => ({ ...o, disabled: o.value !== a.projectId && asg.some((x) => x.projectId === o.value) }))} />
                  <A.Dropdown aria-label={'Τρόπος για το έργο ' + (i + 1)} value={a.mode} onChange={(v) => setAsgRow(i, { mode: v, hours: v === 'fixed' ? (a.hours || '4') : '' })}
                    options={ASSIGN_MODES} />
                  {a.mode === 'fixed'
                    ? <A.TextInput type="number" min="0.5" step="0.5" aria-label={'Ώρες έργου ' + (i + 1)} value={a.hours} onChange={(ev) => setAsgRow(i, { hours: ev.target.value })} />
                    : <span className="asg__hint body-xs muted">{a.mode === 'rest' ? 'ό,τι μένει' : 'ανά ημέρα'}</span>}
                  <div className="asg__days" role="group" aria-label={'Ημέρες για το έργο ' + (i + 1)}>
                    {DOW_SHORT.map((d, k) => (
                      <button key={k} type="button" className={'daychip' + (a.days[k] ? ' is-on' : '')} aria-pressed={a.days[k]}
                        aria-label={['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'][k]}
                        onClick={() => setAsgRow(i, { days: a.days.map((x, j) => (j === k ? !x : x)) })}>{d}</button>
                    ))}
                  </div>
                  <A.Button color="text" leadingIcon="delete" aria-label="Αφαίρεση έργου" onClick={() => setAsg((list) => list.filter((_, j) => j !== i))}>Αφαίρεση</A.Button>
                </div>
                <div className="asg__period">
                  <span className="caption muted">Περίοδος</span>
                  <DateInput aria-label={'Από, έργο ' + (i + 1)} value={a.from} onChange={(v) => setAsgRow(i, { from: v })} />
                  <span className="caption muted">έως</span>
                  <DateInput aria-label={'Έως, έργο ' + (i + 1)} value={a.to} onChange={(v) => setAsgRow(i, { to: v })} />
                  <span className="caption asg__state">{a.to && a.to < today ? 'έληξε' : a.from && a.from > today ? 'ξεκινά ' + fmtDate(a.from) : !a.from && !a.to ? 'χωρίς λήξη' : 'σε ισχύ'}</span>
                  {(!a.to || a.to >= today) && (!a.from || a.from < today) && (
                    <A.Button color="text" onClick={() => splitToday(i)}>Αλλαγή από σήμερα</A.Button>
                  )}
                </div>
                {rewritesPast(a) && (
                  <p className="body-xs asg__warn">Η αλλαγή θα ισχύσει και για τις προηγούμενες ημέρες{a.from ? ' από ' + fmtDate(a.from) : ''}.{' '}
                    <button type="button" className="linkbtn" onClick={() => splitToday(i)}>Να ισχύσει μόνο από σήμερα</button></p>
                )}
                </div>
              ))}
              <div><A.Button color="outline" roundness="full" leadingIcon="add" onClick={addAsg}>Προσθήκη έργου</A.Button></div>
              {asg.length > 0 && (
                <div className="asg__week" aria-label="Σταθερές ώρες ανά ημέρα">
                  {DOW_SHORT.map((d, k) => (
                    <div key={k} className={'asg__wd' + (k < 5 && perDay[k] > cap ? ' is-err' : '') + (k >= 5 ? ' is-weekend' : '')}>
                      <span className="caption">{d}</span>
                      <span className="body-xs">{k >= 5 && !perDay[k] && !restDays[k] ? '—' : restDays[k] && perDay[k] < cap ? 'πλήρης' : fmtNum(Math.min(perDay[k], k >= 5 ? cap : perDay[k])) + '/' + cap}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className={'body-xs' + ((tried || overDays.length) && asgErr ? ' asg__err' : ' muted')} role={overDays.length ? 'alert' : undefined}>
                {(tried || overDays.length) && asgErr ? asgErr
                  : 'Σταθερές ώρες ανά ημέρα εβδομάδας. «Πλήρης»: το κύριο έργο καλύπτει ό,τι μένει. Σάββατο και Κυριακή μετράνε μόνο όταν οριστεί βάρδια εκείνη την ημέρα. Όσες ώρες δεν πάνε σε έργο εμφανίζονται στα Ωράρια ως «Προς κατανομή».'}
              </p>
            </div>
          </Field>
          <Field label="Ημέρες τηλεργασίας" wide>
            <div className="dowchecks">
              {DOW_SHORT.slice(0, 6).map((d, i) => (
                <A.Checkbox key={i} filled checked={!!f.remote[i]} label={d} aria-label={['Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'][i]}
                  onChange={(v) => setF((s) => { const r = [...s.remote]; r[i] = v; return { ...s, remote: r }; })} />
              ))}
            </div>
          </Field>
          {scChanged && (
            <Field label="Η αλλαγή ωραρίου / τηλεργασίας ισχύει" wide>
              <div className="scwhen">
                <A.Dropdown aria-label="Πότε ισχύει η αλλαγή" value={scWhen} onChange={setScWhen}
                  options={[{ value: 'date', label: 'Από ημερομηνία (οι προηγούμενες ημέρες μένουν ως είχαν)' }, { value: 'all', label: 'Διόρθωση για όλο το διάστημα' }]} />
                {scWhen === 'date' && <DateInput aria-label="Ισχύει από" value={scFrom} onChange={setScFrom} error={(tried && errs.scFrom) || undefined} />}
              </div>
              <p className="body-xs muted">{scWhen === 'date'
                ? 'Μέχρι τις ' + (scFrom ? fmtDate(addDays(scFrom, -1)) : '…') + ' ισχύει ' + shiftLabel(curSc.schedule) + '. Από ' + (scFrom ? fmtDate(scFrom) : '…') + ' ισχύει ' + shiftLabel(f.schedule) + '.'
                : 'Το νέο ωράριο θα ισχύει και για τους προηγούμενους μήνες. Χρησιμοποιήστε το μόνο για διόρθωση λάθους.'}</p>
            </Field>
          )}
        </div>
      </A.Modal>
    </Overlay>
  );
}

// ---------- Move selected days to a project ----------
export function MoveDialog({ count, people, projects, clients, onClose, onMove }) {
  const [pid, setPid] = useState('');
  const [hrs, setHrs] = useState('all');
  const [busy, setBusy] = useState(false);
  const opts = projects.map((p) => { const c = clients.find((x) => x.id === p.clientId); return { value: p.id, label: (c ? c.name + ' | ' : '') + p.name }; })
    .sort((a, b) => a.label.localeCompare(b.label, 'el'));
  const hourOpts = [{ value: 'all', label: 'Όλη η βάρδια' }, ...['1', '2', '3', '4', '5', '6', '7'].map((v) => ({ value: v, label: v + (v === '1' ? ' ώρα' : ' ώρες') }))];
  return (
    <Overlay onClose={onClose}>
      <A.Modal modal width={640} title={'Μετακίνηση σε έργο: ' + count + (count === 1 ? ' ημέρα' : ' ημέρες') + (people > 1 ? ' σε ' + people + ' συνεργάτες' : '')} onClose={onClose}
        footer={<div className="mfoot"><span className="spacer" /><A.Button color="outline" onClick={onClose} disabled={busy}>Ακύρωση</A.Button>
          <A.Button color="main" disabled={!pid || busy} onClick={async () => { setBusy(true); try { await onMove(pid, hrs); } catch (e) { setBusy(false); } }}>Μετακίνηση</A.Button></div>}>
        <div className="form2">
          <SelectF label="Έργο" required value={pid} onChange={setPid} options={opts} placeholder="Επιλογή έργου" />
          <SelectF label="Ώρες στο έργο" value={hrs} onChange={setHrs} options={hourOpts} />
        </div>
        <p className="body-s muted movenote">{hrs === 'all'
          ? 'Όλη η βάρδια των επιλεγμένων ημερών πηγαίνει σε αυτό το έργο. Βάρδια, τηλεργασία και υπερωρίες μένουν ως έχουν.'
          : 'Το έργο θα έχει ' + hrs + (hrs === '1' ? ' ώρα' : ' ώρες') + ' εκείνες τις ημέρες. Παίρνονται πρώτα από ώρες χωρίς έργο και μετά από το έργο με τις περισσότερες ώρες.'}
          {' '}Ημέρες με άδεια ή χωρίς βάρδια παραλείπονται. Όποιος δεν ανήκει στο έργο μπαίνει στην ομάδα του χωρίς σταθερές ώρες.</p>
      </A.Modal>
    </Overlay>
  );
}
