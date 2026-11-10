import { MONTHS, DOW_SHORT, DOW_LONG, MONTHS_GEN, tone, hoursText, shiftText, shiftProjText, projectView, resolveDay, fullName, shiftLabel, leaveOf, fmtNum } from './core.js';
const { useEffect, useRef, useId, useState } = React;
const A = window.Aambience;

export function Field({ label, required, children, wide, htmlFor }) {
  return (
    <div className={'fld' + (wide ? ' fld--wide' : '')}>
      <A.FieldLabel htmlFor={htmlFor} required={required}>{label}</A.FieldLabel>
      {children}
    </div>
  );
}
// Dates are typed and shown as ΗΗ/ΜΜ/ΕΕΕΕ whatever the browser language; the calendar button opens the native picker.
const isoToGr = (iso) => (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.slice(8) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4) : '');
function grToIso(txt) {
  const t = String(txt || '').trim(); if (!t) return '';
  let m = t.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/) || t.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (!m) return null;
  const d = +m[1], mo = +m[2], y = +m[3];
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}
export function DateInput({ id, value, onChange, error, disabled, ...rest }) {
  const [txt, setTxt] = useState(isoToGr(value));
  const [bad, setBad] = useState(false);
  const pick = useRef(null);
  useEffect(() => { if (grToIso(txt) !== (value || '')) { setTxt(isoToGr(value)); setBad(false); } }, [value]);
  const change = (v) => {
    setTxt(v); const iso = grToIso(v);
    if (iso !== null) { setBad(false); if (iso !== (value || '')) onChange(iso); }
  };
  return (
    <div className="datein">
      <A.TextInput id={id} type="text" inputMode="numeric" autoComplete="off" placeholder="ΗΗ/ΜΜ/ΕΕΕΕ" value={txt} disabled={disabled} {...rest}
        error={error || (bad ? 'Γράψτε την ημερομηνία ως ΗΗ/ΜΜ/ΕΕΕΕ' : undefined)}
        onChange={(e) => change(e && e.target ? e.target.value : e)}
        onBlur={() => { const iso = grToIso(txt); if (iso === null) setBad(true); else setTxt(isoToGr(iso)); }} />
      <button type="button" className="datein__btn" disabled={disabled} aria-label="Επιλογή από ημερολόγιο"
        onClick={() => { const el = pick.current; if (!el) return; try { el.showPicker(); } catch (x) { el.focus(); el.click(); } }}>
        <A.Icon name="calendar_today" size={18} />
      </button>
      <input ref={pick} type="date" className="datein__native" tabIndex={-1} aria-hidden="true" value={value || ''}
        onChange={(e) => { if (e.target.value) { onChange(e.target.value); setTxt(isoToGr(e.target.value)); setBad(false); } }} />
    </div>
  );
}

export function TextF({ label, required, value, onChange, type, placeholder, wide, error, multiline, min, step }) {
  const id = useId();
  if (type === 'date') return (
    <Field label={label} required={required} wide={wide} htmlFor={id}>
      <DateInput id={id} value={value} onChange={onChange} error={error} />
    </Field>
  );
  return (
    <Field label={label} required={required} wide={wide} htmlFor={id}>
      <A.TextInput id={id} type={type || 'text'} value={value == null ? '' : value} placeholder={placeholder || 'Προσθήκη κειμένου'}
        multiline={multiline} error={error} min={min} step={step}
        onChange={(e) => onChange(e && e.target ? e.target.value : e)} />
    </Field>
  );
}
export function SelectF({ label, required, value, onChange, options, placeholder, wide, error, disabled }) {
  const id = useId();
  return (
    <Field label={label} required={required} wide={wide} htmlFor={id}>
      <A.Dropdown id={id} value={value || ''} options={options} placeholder={placeholder || 'Επιλογή'} error={error} disabled={disabled}
        onChange={(v) => onChange(v)} />
    </Field>
  );
}
export function Info({ label, children }) {
  return (
    <div className="info">
      <A.FieldLabel>{label}</A.FieldLabel>
      <div className="info__v body-s">{children == null || children === '' ? '—' : children}</div>
    </div>
  );
}

export function Overlay({ children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    const el = ref.current; const f = el && el.querySelector('input, select, textarea, button');
    if (f) f.focus();
    const key = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', key);
    document.body.classList.add('no-scroll');
    return () => { document.removeEventListener('keydown', key); document.body.classList.remove('no-scroll'); if (prev && prev.focus) prev.focus(); };
  }, []);
  return (
    <div className="overlay" ref={ref} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      {children}
    </div>
  );
}

export function MonthBar({ y, m, onPrev, onNext, children }) {
  return (
    <div className="monthbar">
      <h2 className="monthbar__t">{MONTHS[m - 1]} {y}</h2>
      {children}
      <div className="monthbar__nav">
        <button type="button" className="roundbtn" onClick={onPrev} aria-label="Προηγούμενος μήνας"><A.Icon name="chevron_left" size={20} /></button>
        <button type="button" className="roundbtn" onClick={onNext} aria-label="Επόμενος μήνας"><A.Icon name="chevron_right" size={20} /></button>
      </div>
    </div>
  );
}

export function Legend({ hint }) {
  const items = [
    ['work', '8', 'Ώρες βάρδιας'], ['remote', 'Τ', 'Τηλεργασία'], ['ot', '+2Υ', 'Υπερωρία'], ['remote-ot', 'Τ +Υ', 'Τηλεργασία με υπερωρία'],
    ['free', '8ω', 'Ώρες χωρίς έργο'], ['leave-orange', 'Α', 'Κανονική άδεια'], ['leave-error', 'ΑΣ', 'Ασθένεια'], ['leave-purple', 'ΑΜ', 'Μητρότητας / πατρότητας'], ['leave-gold', 'ΕΑ', 'Λοιπές άδειες'], ['inactive', '', 'Εκτός σύμβασης'],
  ];
  return (<>
    {hint && <p className="gridhint body-xs">Για αλλαγή σε πολλές ημέρες ή συνεργάτες: κρατήστε πατημένο ένα κελί, σύρετε πάνω από κελιά ή πατήστε «Επιλογή». Με Ctrl+κλικ προσθέτετε κελιά.</p>}
    <ul className="legend body-xs" aria-label="Υπόμνημα">
      {items.map(([t, c, l]) => <li key={t}><span className={'sw t-' + t}>{c}</span>{l}</li>)}
    </ul>
  </>);
}

// rows: [{type:'group', key, label, level}] | [{type:'emp', emp, pid?, showCode?, note?}] | [{type:'total', key, label, values:[], accent?}]
// selection: { on, has(empId, iso), set([{emp, iso}], value), enter() }
const LONG_PRESS = 450;
// hover text for a cell: the details the cell itself has no room for
function cellTitle(full, r, pid) {
  if (full.inactive) return 'Εκτός σύμβασης';
  if (full.leave) return leaveOf(full.leave).label;
  const lines = [];
  if (full.shift) {
    lines.push('Βάρδια ' + shiftLabel(full.shift));
    if (pid && r.base !== full.base) lines.push(fmtNum(r.base) + ' από ' + fmtNum(full.base) + ' ώρες σε αυτό το έργο');
    lines.push(full.remote ? 'Τηλεργασία' : 'Γραφείο');
    if (pid && !r.base && !r.ot) lines.push('Σήμερα χωρίς ώρες σε αυτό το έργο');
    if (full.free) lines.push(fmtNum(full.free) + ' ώρες χωρίς έργο');
  }
  if (full.ot) lines.push('Υπερωρία +' + fmtNum(full.ot) + (full.ot === 1 ? ' ώρα' : ' ώρες') + (pid && full.otProject && full.otProject !== pid ? ' (σε άλλο έργο)' : '') + (full.otReason ? ': ' + full.otReason : ''));
  return lines.length ? lines.join('\n') : 'Χωρίς βάρδια';
}
export function ScheduleGrid({ y, m, days, rows, entries, mode, onCell, selectedIso, onDay, nameHeader, nameWidth, onName, selection }) {
  const fmt = mode === 'shift' ? shiftText : hoursText;
  const sel = selection || { on: false, has: () => false, set: () => {}, enter: () => {} };
  const empRows = rows.filter((r) => r.type === 'emp');
  const resolved = (e, d) => resolveDay(e, d, (entries[e.id] || {})[String(d.d).padStart(2, '0')]);
  const activeDays = (e) => days.filter((d) => !resolved(e, d).inactive);

  const [rect, setRect] = useState(null);       // drag box { r0, d0, r1, d1, add }
  const [pressing, setPressing] = useState(null); // cell key while a long press is charging
  const rectRef = useRef(null); rectRef.current = rect;
  const press = useRef(null);
  const selRef = useRef(sel); selRef.current = sel;
  const ptr = useRef('mouse');

  const cellsIn = (b) => {
    const out = []; const [ra, rb] = [Math.min(b.r0, b.r1), Math.max(b.r0, b.r1)]; const [da, db] = [Math.min(b.d0, b.d1), Math.max(b.d0, b.d1)];
    const seen = new Set();
    for (let i = ra; i <= rb; i++) {
      const e = empRows[i].emp;
      for (let j = da; j <= db; j++) { const d = days[j]; const k = e.id + '|' + d.iso; if (seen.has(k) || resolved(e, d).inactive) continue; seen.add(k); out.push({ emp: e, iso: d.iso }); }
    }
    return out;
  };
  const inRect = (ri, di) => rect && ri >= Math.min(rect.r0, rect.r1) && ri <= Math.max(rect.r0, rect.r1) && di >= Math.min(rect.d0, rect.d1) && di <= Math.max(rect.d0, rect.d1);

  useEffect(() => {
    const up = () => {
      const p = press.current; press.current = null; setPressing(null);
      if (p && p.timer) clearTimeout(p.timer);
      const b = rectRef.current;
      if (b) { setRect(null); selRef.current.set(cellsIn(b), b.add); return; }
      if (!p || p.fired) return;
      if (selRef.current.on) selRef.current.set([{ emp: p.emp, iso: p.d.iso }], !selRef.current.has(p.emp.id, p.d.iso));
      else onCell(p.emp, p.d, p.pid);
    };
    const cancel = () => { const p = press.current; if (p && p.timer) clearTimeout(p.timer); press.current = null; setPressing(null); setRect(null); };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', cancel);
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
  });

  const down = (ev, ri, di, e, d, pid) => {
    ptr.current = ev.pointerType;
    if (ev.button !== 0) return;
    const mouse = ev.pointerType === 'mouse';
    if (mouse) ev.preventDefault();
    if (mouse && (ev.ctrlKey || ev.metaKey)) {               // Ctrl/Cmd+click: start or extend a selection
      if (!sel.on) sel.enter();
      sel.set([{ emp: e, iso: d.iso }], !sel.has(e.id, d.iso)); press.current = { fired: true }; return;
    }
    if (sel.on && mouse) {                                   // in selection: drag paints a box
      press.current = { emp: e, d, pid, fired: false };
      setRect({ r0: ri, d0: di, r1: ri, d1: di, add: !sel.has(e.id, d.iso) }); return;
    }
    const p = { emp: e, d, pid, ri, di, fired: false };
    if (!sel.on) {
      p.timer = setTimeout(() => {                           // long press: enter selection with this cell
        p.fired = true; setPressing(null);
        selRef.current.enter(); selRef.current.set([{ emp: e, iso: d.iso }], true);
        if (navigator.vibrate) try { navigator.vibrate(15); } catch (x) {}
      }, LONG_PRESS);
      setPressing(e.id + '|' + d.iso);
    }
    press.current = p;
  };
  const enter = (ri, di) => {
    if (rect) { if (rect.r1 !== ri || rect.d1 !== di) setRect({ ...rect, r1: ri, d1: di }); return; }
    const p = press.current;
    if (p && !p.fired && ptr.current === 'mouse' && !sel.on && (p.ri !== ri || p.di !== di)) {   // drag outside selection: start one
      clearTimeout(p.timer); p.fired = true; setPressing(null);
      sel.enter(); setRect({ r0: p.ri, d0: p.di, r1: ri, d1: di, add: true });
    }
  };
  const toggleColumn = (d) => {
    const items = empRows.map((r) => r.emp).filter((e, i, a) => a.indexOf(e) === i && !resolved(e, d).inactive).map((e) => ({ emp: e, iso: d.iso }));
    const all = items.length && items.every((x) => sel.has(x.emp.id, x.iso));
    sel.set(items, !all);
  };
  const rowState = (e) => { const ds = activeDays(e); const n = ds.filter((d) => sel.has(e.id, d.iso)).length; return { all: ds.length > 0 && n === ds.length, some: n > 0, ds }; };
  const allEmps = empRows.map((r) => r.emp).filter((e, i, a) => a.indexOf(e) === i);
  const headState = (() => { let all = allEmps.length > 0, some = false; allEmps.forEach((e) => { const s = rowState(e); if (!s.all) all = false; if (s.some) some = true; }); return { all, some }; })();

  return (
    <div className={'gridwrap' + (sel.on ? ' is-selecting' : '')} role="region" aria-label={'Πρόγραμμα ' + MONTHS[m - 1] + ' ' + y} tabIndex={0}>
      <table className={'sched' + (mode === 'shift' ? ' sched--shift' : '') + (rect ? ' is-dragging' : '')} style={{ '--name-w': (nameWidth || 220) + 'px' }}>
        <thead>
          <tr>
            <th className="sched__name" scope="col">
              <div className="namecell">
                {sel.on && <A.Checkbox filled checked={headState.all} indeterminate={headState.some && !headState.all} aria-label="Επιλογή όλου του μήνα για όλους"
                  onChange={(v) => sel.set(allEmps.flatMap((e) => activeDays(e).map((d) => ({ emp: e, iso: d.iso }))), v)} />}
                <span>{nameHeader || 'Ονοματεπώνυμο'}</span>
              </div>
            </th>
            {days.map((d) => (
              <th key={d.iso} scope="col" className={(d.weekend || d.holiday ? 'is-off ' : '') + (d.iso === selectedIso && !sel.on ? 'is-sel' : '')}>
                <button type="button" className="dayhead" onClick={() => (sel.on ? toggleColumn(d) : onDay && onDay(d.iso))} aria-pressed={sel.on ? undefined : d.iso === selectedIso}
                  aria-label={(sel.on ? 'Επιλογή στήλης: ' : '') + DOW_LONG[d.dow] + ' ' + d.d + ' ' + MONTHS_GEN[m - 1] + (d.holiday ? ', αργία' : '')}
                  title={sel.on ? 'Επιλογή όλης της στήλης' : d.holiday ? 'Αργία' : undefined}>
                  <span className="dayhead__w">{DOW_SHORT[d.dow]}</span>
                  <span className="dayhead__d">{String(d.d).padStart(2, '0')}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            if (row.type === 'group') {
              return (
                <tr key={row.key} className={'grp grp--' + row.level}>
                  <th className="sched__name" scope="rowgroup">{row.label}</th>
                  <td colSpan={days.length}>{row.extra}</td>
                </tr>
              );
            }
            if (row.type === 'total') {
              return (
                <tr key={row.key} className={'tot' + (row.accent ? ' tot--accent' : '')}>
                  <th className="sched__name" scope="row">{row.label}</th>
                  {row.values.map((v, i) => <td key={i} className={(days[i].weekend || days[i].holiday ? 'is-off ' : '') + (days[i].iso === selectedIso && !sel.on ? 'is-sel' : '')}>{v}</td>)}
                </tr>
              );
            }
            const e = row.emp; const ri = empRows.indexOf(row);
            const rs = sel.on ? rowState(e) : null;
            return (
              <tr key={(row.pid || '') + e.id} className="emp">
                <th className="sched__name" scope="row">
                  <div className="namecell">
                    {sel.on && <A.Checkbox filled checked={rs.all} indeterminate={rs.some && !rs.all} aria-label={'Όλος ο μήνας για ' + fullName(e)}
                      onChange={(v) => sel.set(rs.ds.map((d) => ({ emp: e, iso: d.iso })), v)} />}
                    <button type="button" className={'namebtn' + (row.showCode ? ' namebtn--stack' : '')} onClick={() => onName && onName(e)} title={fullName(e)}>
                      {row.showCode && <span className="code">{e.code}</span>}
                      <span className="nm">{fullName(e)}</span>
                    </button>
                    {row.note && <span className="share caption" title={row.noteTitle}>{row.note}</span>}
                  </div>
                </th>
                {days.map((d, di) => {
                  const full = resolved(e, d);
                  const r = row.free ? full : row.pid ? projectView(full, row.pid) : full;
                  const t = row.free ? (full.free ? 'free' : full.inactive ? 'inactive' : 'empty') : tone(r);
                  const tx = row.free ? { main: full.free ? fmtNum(full.free) + 'ω' : '', sub: full.free ? 'ελεύθ.' : '' } : row.pid && mode === 'shift' ? shiftProjText(r) : fmt(r);
                  const on = sel.on && sel.has(e.id, d.iso);
                  const boxed = inRect(ri, di) && !full.inactive;
                  const k = e.id + '|' + d.iso;
                  return (
                    <td key={d.iso} className={(d.weekend || d.holiday ? 'is-off ' : '') + (d.iso === selectedIso && !sel.on ? 'is-sel ' : '') + (boxed ? (rect.add ? 'in-rect ' : 'in-rect is-removing ') : '')}
                      onPointerEnter={() => enter(ri, di)}>
                      <button type="button" className={'cell t-' + t + (on ? ' is-picked' : '') + (pressing === k ? ' is-pressing' : '')} disabled={full.inactive}
                        aria-pressed={sel.on ? on : undefined} title={row.free ? (full.free ? fmtNum(full.free) + ' ώρες της βάρδιας ' + (full.shift ? shiftLabel(full.shift) + ' ' : '') + 'δεν έχουν δοθεί σε έργο' : cellTitle(full, r, null)) : cellTitle(full, r, row.pid)}
                        onPointerDown={(ev) => down(ev, ri, di, e, d, row.pid)}
                        onContextMenu={(ev) => ev.preventDefault()}
                        onClick={(ev) => {
                          if (ev.detail !== 0) return;  // keyboard; pointer input is handled on pointerup
                          if (sel.on) sel.set([{ emp: e, iso: d.iso }], !on); else onCell(e, d, row.pid);
                        }}
                        aria-label={fullName(e) + ', ' + d.d + ' ' + MONTHS_GEN[m - 1] + ': ' + (tx.main || 'κενό') + (tx.sub ? ' ' + tx.sub : '') + (on ? ', επιλεγμένο' : '')}>
                        <span className="cell__m">{tx.main}</span>{tx.main && <span className="cell__s">{tx.sub}</span>}
                      </button>
                      {sel.on && !full.inactive && <span className={'cell__chk' + (on ? ' is-on' : '')} aria-hidden="true">{on && <A.Icon name="done" size={10} />}</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Empty({ icon, title, children, action }) {
  return (
    <div className="empty">
      <A.Icon name={icon || 'info'} size={32} />
      <p className="body-bold-m">{title}</p>
      {children && <p className="body-s muted">{children}</p>}
      {action}
    </div>
  );
}
