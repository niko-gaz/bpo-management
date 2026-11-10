import { upperGr, scheduleOn, periodText, todayIso, monthDays, resolveDay, assignmentsOf, inProject, allocatedOf, capacityOf, fullName, norm, byName, shiftLabel, shiftShort, leaveOf, fmtDate, fmtNum, DOW_SHORT, pad, MONTHS as MONTHS_L, MONTHS_GEN } from './core.js';
import { Info, Empty, Legend } from './ui.jsx';
const { useState, useMemo, useRef, useEffect } = React;
const A = window.Aambience;

export function EmployeesScreen({ store, openNew, goEmployee }) {
  const { employees, projects, clients } = store;
  const [q, setQ] = useState(''); const [fp, setFp] = useState(''); const [fs, setFs] = useState('');
  const [sortBy, setSortBy] = useState('last'); const [dir, setDir] = useState('asc');
  const pName = (id) => { const p = projects.find((x) => x.id === id); return p ? p.name : '—'; };
  const pList = (e) => { const as = assignmentsOf(e); return as.length ? as.map((a) => pName(a.projectId) + (as.length > 1 ? (a.mode === 'fixed' ? ' (' + fmtNum(a.hours) + 'ω)' : a.mode === 'rest' ? ' (κύριο)' : ' (ευέλ.)') : '')).join(', ') : '—'; };
  const supers = [...new Set(employees.map((e) => e.supervisor).filter(Boolean))].sort();
  const rows = useMemo(() => {
    const list = employees.filter((e) => (!fp || inProject(e, fp)) && (!fs || e.supervisor === fs)
      && (!q || norm([e.code, e.last, e.first, e.email, e.phone, pList(e)].join(' ')).includes(norm(q))));
    const val = (e) => sortBy === 'projs' ? pList(e) : String(e[sortBy] || '');
    list.sort((a, b) => val(a).localeCompare(val(b), 'el', { numeric: true }) * (dir === 'asc' ? 1 : -1));
    return list.map((e, i) => ({ ...e, aa: String(i + 1).padStart(3, '0'), projs: pList(e) }));
  }, [employees, projects, q, fp, fs, sortBy, dir]);
  const projOpts = projects.map((p) => { const c = clients.find((x) => x.id === p.clientId); return { value: p.id, label: (c ? c.name + ' | ' : '') + p.name }; }).sort((a, b) => a.label.localeCompare(b.label, 'el'));

  return (
    <section className="card" aria-label="Λίστα συνεργατών">
      <div className="toolbar">
        <div className="toolbar__f">
          <A.Dropdown aria-label="Έργο" value={fp} onChange={setFp} options={projOpts} placeholder="Έργο: όλα" />
          <A.Dropdown aria-label="Προϊστάμενος" value={fs} onChange={setFs} options={supers} placeholder="Προϊστάμενος: όλοι" />
        </div>
        <div className="toolbar__s"><A.SearchInput value={q} onChange={(v) => setQ(v)} placeholder="Αναζήτηση" /></div>
        <A.Button color="main" roundness="full" leadingIcon="add" onClick={openNew}>Δημιουργία συνεργάτη</A.Button>
      </div>
      <p className="body-xs muted count">{rows.length} από {employees.length} συνεργάτες</p>
      {employees.length ? (
        <div className="emptable">
          <A.Table rowKey="id" rows={rows} sortBy={sortBy} sortDirection={dir} onSort={(k, d) => { setSortBy(k); setDir(d); }}
            onRowClick={(r) => goEmployee(r)} emptyText="Δεν βρέθηκαν συνεργάτες με αυτά τα κριτήρια"
            columns={[
              { key: 'aa', title: 'ΑΑ', sortable: false, width: 56 },
              { key: 'code', title: 'Κωδικός συνεργάτη', render: (v) => <span className="link">{v}</span> },
              { key: 'last', title: 'Επώνυμο', render: (v) => upperGr(v) },
              { key: 'first', title: 'Όνομα', render: (v) => upperGr(v) },
              { key: 'projs', title: 'Έργα', muted: true },
              { key: 'supervisor', title: 'Προϊστάμενος', muted: true },
              { key: 'department', title: 'Τμήμα απασχόλησης', muted: true },
              { key: 'position', title: 'Τρέχουσα θέση εργασίας', muted: true },
              { key: 'email', title: 'eMail' },
              { key: 'phone', title: 'Τηλέφωνο' },
            ]} />
        </div>
      ) : (
        <Empty icon="people_outline" title="Δεν υπάρχουν ακόμη συνεργάτες" action={<A.Button color="main" roundness="full" leadingIcon="add" onClick={openNew}>Δημιουργία συνεργάτη</A.Button>}>
          Καταχωρίστε τους συνεργάτες για να εμφανίζονται στα έργα και στα ωράρια.
        </Empty>
      )}
    </section>
  );
}

export function EmployeeDetail({ store, emp, y, m, setMonth, openDay, selection, openEdit }) {
  const { projects, clients, entries } = store;
  const as = assignmentsOf(emp);
  const pInfo = (id) => { const p = projects.find((x) => x.id === id); const c = p ? clients.find((x) => x.id === p.clientId) : null; return { p, label: p ? (c ? c.name + ' | ' : '') + p.name : 'Έργο που διαγράφηκε', short: p ? p.name : '—' }; };
  const multi = new Set(as.filter((a) => !a.to || a.to >= todayIso()).map((a) => a.projectId)).size > 1;
  const sc = scheduleOn(emp, todayIso());
  // shift history: the base rule plus every dated change
  const schedHist = (emp.schedules || []).length ? [{ from: '', schedule: emp.schedule || '09-17' }, ...[...emp.schedules].sort((x, y) => x.from.localeCompare(y.from))]
    .map((h) => ({ ...h, current: h.from === sc.from })) : [];
  const days = useMemo(() => monthDays(y, m), [y, m]);
  const ov = entries[emp.id] || {};
  const res = days.map((d) => ({ d, r: resolveDay(emp, d, ov[pad(d.d)]) }));
  const sum = res.reduce((a, { r }) => {
    if (r.inactive) return a;
    if (r.leave) a.leave++; else if (r.hours) { a.worked++; a.hours += r.hours; a.ot += r.ot; if (r.remote) a.remote++; }
    return a;
  }, { worked: 0, hours: 0, ot: 0, remote: 0, leave: 0 });

  const events = {};
  res.forEach(({ d, r }) => {
    if (r.inactive) { events[d.d] = [{ name: <span className="ev ev--muted">Εκτός σύμβασης</span> }]; return; }
    const list = [];
    if (r.leave) list.push({ name: <span className={'tag t-leave-' + leaveOf(r.leave).tone}>{leaveOf(r.leave).short}</span> });
    else if (r.shift || r.ot) {
      // shift, then the project(s) worked that day, then where, then overtime
      if (r.shift) list.push({ name: <span className="ev ev--strong">{shiftLabel(r.shift)}</span> });
      const work = Object.entries(r.alloc || {}).filter(([, h]) => +h > 0);
      const split = work.length > 1;
      work.forEach(([pid, h]) => list.push({ name: <span className="ev ev--proj" title={pInfo(pid).label + ', ' + fmtNum(h) + ' ώρες'}>{split ? fmtNum(h) + 'ω ' : ''}{pInfo(pid).short}</span> }));
      if (r.free) list.push({ name: <span className="ev--free" title="Ώρες της βάρδιας που δεν έχουν δοθεί σε έργο">{fmtNum(r.free)}ω χωρίς έργο</span> });
      if (r.shift) list.push({ name: r.remote ? <span className="tag t-remote">Τηλεργασία</span> : <span className="tag t-office">Γραφείο</span> });
      if (r.ot) list.push({ name: <span className="tag t-ot" title={r.otProject ? 'Έργο υπερωρίας: ' + pInfo(r.otProject).label : undefined}>+{r.ot}ω υπερωρία</span> });
    }
    if (list.length) events[d.d] = list;
  });

  return (
    <div className="empd">
      <section className={'card empd__cal' + (selection.on ? ' is-selecting' : '')} aria-label="Ατομικό ημερολόγιο">
        <PersonalMonth y={y} m={m} res={res} events={events} emp={emp} selection={selection}
          onOpen={(iso) => openDay([emp], iso)} onPrev={() => setMonth(-1)} onNext={() => setMonth(1)} />
        <div className="empd__selrow">
          <A.Button color={selection.on ? 'secondary' : 'outline'} roundness="full" leadingIcon={selection.on ? 'close' : 'done'} onClick={selection.toggle} aria-pressed={selection.on}>{selection.on ? 'Τέλος επιλογής' : 'Επιλογή ημερών'}</A.Button>
          {selection.on && <A.Button color="text" onClick={() => selection.set(res.filter(({ r }) => !r.inactive).map(({ d }) => ({ emp, iso: d.iso })), true)}>Όλος ο μήνας</A.Button>}
          {selection.on && <A.Button color="text" onClick={() => selection.set(res.filter(({ d, r }) => !r.inactive && !d.weekend && !d.holiday).map(({ d }) => ({ emp, iso: d.iso })), true)}>Εργάσιμες μήνα</A.Button>}
        </div>
        <div className="monthstats">
          <div><span className="display-bold-xs">{sum.worked}</span><span className="body-xs muted">ημέρες εργασίας</span></div>
          <div><span className="display-bold-xs">{fmtNum(sum.hours)}</span><span className="body-xs muted">ώρες</span></div>
          <div><span className="display-bold-xs">{fmtNum(sum.ot)}</span><span className="body-xs muted">ώρες υπερωρίας</span></div>
          <div><span className="display-bold-xs">{sum.remote}</span><span className="body-xs muted">τηλεργασία</span></div>
          <div><span className="display-bold-xs">{sum.leave}</span><span className="body-xs muted">ημέρες άδειας</span></div>
        </div>
        <p className="body-xs muted pad-s">Πατήστε μια ημέρα για να αλλάξετε βάρδια, τηλεργασία, υπερωρία ή άδεια. Για πολλές ημέρες: κρατήστε πατημένη μια ημέρα, σύρετε πάνω από ημέρες ή πατήστε «Επιλογή ημερών». Με Ctrl+κλικ προσθέτετε ημέρες.</p>
      </section>

      <section className="card empd__info" aria-labelledby="etitle">
        <div className="cardhead">
          <h1 id="etitle" className="heading-bold-xs">{fullName(emp)}</h1>
          <A.Button color="main" roundness="full" leadingIcon="edit" onClick={openEdit}>Επεξεργασία</A.Button>
        </div>
        <div className="infogrid infogrid--3">
          <Info label="Κωδικός συνεργάτη">{emp.code}</Info>
          <Info label="Επώνυμο">{upperGr(emp.last)}</Info>
          <Info label="Όνομα">{upperGr(emp.first)}</Info>
          <Info label="Διεύθυνση διαβάθμισης">{emp.direction}</Info>
          <Info label="Τμήμα απασχόλησης">{emp.department}</Info>
          <Info label="Υποκατάστημα">{emp.branch}</Info>
          <Info label="Τρέχουσα θέση εργασίας">{emp.position}</Info>
          <Info label={multi ? 'Έργα' : 'Έργο'}>{as.length ? as.map((a, k) => (
            <div key={k} className={a.to && a.to < todayIso() ? 'muted' : ''}>{pInfo(a.projectId).label}
              <span className="muted">{a.mode === 'fixed' ? ', ' + fmtNum(a.hours) + ' ώρες' : a.mode === 'rest' ? (multi ? ', κύριο έργο' : '') : ', χωρίς σταθερές ώρες'}
                {a.days.every(Boolean) ? '' : ' (' + DOW_SHORT.filter((_, i) => a.days[i]).join(' ') + ')'}{periodText(a)}{a.to && a.to < todayIso() ? ', έληξε' : ''}</span>
            </div>)) : '—'}</Info>
          <Info label="Προϊστάμενος">{emp.supervisor}</Info>
          <Info label="Τηλεργασία">
            <span className="dowview">
              {DOW_SHORT.slice(0, 6).map((d, i) => (
                <span key={i} className={'dow' + ((sc.remote || [])[i] ? ' is-on' : '')} title={(sc.remote || [])[i] ? 'Τηλεργασία' : 'Στο γραφείο'}>{d}</span>
              ))}
            </span>
          </Info>
          <Info label="Ωράριο">{shiftLabel(sc.schedule)}
            {schedHist.length > 0 && <div className="body-xs muted sched-hist">{schedHist.map((h, k) => <div key={k}>{h.from ? 'από ' + fmtDate(h.from) + ': ' : 'αρχικά: '}{shiftLabel(h.schedule)}{h.current ? ' (τώρα)' : ''}</div>)}</div>}</Info>
          <Info label="Ημ/νία πρόσληψης">{fmtDate(emp.hireDate)}</Info>
          <Info label="Ημ/νία αποχώρησης">{fmtDate(emp.leaveDate)}</Info>
          <Info label="Ορισμένου / αορίστου χρόνου">{emp.contractTerm}</Info>
          <Info label="Σύμβαση">{emp.contractHours ? emp.contractHours + ' ώρες' : '—'}</Info>
          <Info label="eMail">{emp.email ? <a className="link" href={'mailto:' + emp.email}>{emp.email}</a> : '—'}</Info>
          <Info label="Τηλέφωνο">{emp.phone}</Info>
          <Info label="Τοποθεσία">{emp.location}</Info>
        </div>
      </section>
    </div>
  );
}

// Month view of one employee, drawn with the kit's MonthCalendar classes, with the same
// selection behaviour as the schedule tables: long press, drag, Ctrl/Cmd+click, corner checkboxes.
const LONG_PRESS_MS = 450;
const WEEKDAYS = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
function PersonalMonth({ y, m, res, events, emp, selection, onOpen, onPrev, onNext }) {
  const sel = selection;
  const lead = res.length ? res[0].d.dow : 0;
  const prevDays = new Date(y, m - 1, 0).getDate();
  const slots = [];
  for (let i = 0; i < lead; i++) slots.push({ outside: true, label: prevDays - lead + 1 + i });
  res.forEach((x, i) => slots.push({ i, ...x }));
  let n = 1; while (slots.length % 7) slots.push({ outside: true, label: n++ });
  const weeks = []; for (let i = 0; i < slots.length; i += 7) weeks.push(slots.slice(i, i + 7));

  const [drag, setDrag] = useState(null);       // { a, b, add } indexes into res
  const [pressing, setPressing] = useState(null);
  const dragRef = useRef(null); dragRef.current = drag;
  const press = useRef(null); const ptr = useRef('mouse');
  const selRef = useRef(sel); selRef.current = sel;
  const items = (a, b) => { const out = []; for (let i = Math.min(a, b); i <= Math.max(a, b); i++) if (!res[i].r.inactive) out.push({ emp, iso: res[i].d.iso }); return out; };

  useEffect(() => {
    const up = () => {
      const p = press.current; press.current = null; setPressing(null);
      if (p && p.timer) clearTimeout(p.timer);
      const g = dragRef.current;
      if (g) { setDrag(null); selRef.current.set(items(g.a, g.b), g.add); return; }
      if (!p || p.fired) return;
      const iso = res[p.i].d.iso;
      if (selRef.current.on) selRef.current.set([{ emp, iso }], !selRef.current.has(emp.id, iso)); else onOpen(iso);
    };
    const cancel = () => { const p = press.current; if (p && p.timer) clearTimeout(p.timer); press.current = null; setPressing(null); setDrag(null); };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', cancel);
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
  });
  const down = (ev, i) => {
    ptr.current = ev.pointerType;
    if (ev.button !== 0) return;
    const mouse = ev.pointerType === 'mouse'; const iso = res[i].d.iso;
    if (mouse) ev.preventDefault();
    if (mouse && (ev.ctrlKey || ev.metaKey)) { if (!sel.on) sel.enter(); sel.set([{ emp, iso }], !sel.has(emp.id, iso)); press.current = { fired: true }; return; }
    if (sel.on && mouse) { press.current = { i, fired: false }; setDrag({ a: i, b: i, add: !sel.has(emp.id, iso) }); return; }
    const p = { i, fired: false };
    if (!sel.on) {
      p.timer = setTimeout(() => {
        p.fired = true; setPressing(null); selRef.current.enter(); selRef.current.set([{ emp, iso }], true);
        if (navigator.vibrate) try { navigator.vibrate(15); } catch (x) {}
      }, LONG_PRESS_MS);
      setPressing(i);
    }
    press.current = p;
  };
  const enter = (i) => {
    if (drag) { if (drag.b !== i) setDrag({ ...drag, b: i }); return; }
    const p = press.current;
    if (p && !p.fired && ptr.current === 'mouse' && !sel.on && p.i !== i) { clearTimeout(p.timer); p.fired = true; setPressing(null); sel.enter(); setDrag({ a: p.i, b: i, add: true }); }
  };
  const inDrag = (i) => drag && i >= Math.min(drag.a, drag.b) && i <= Math.max(drag.a, drag.b);

  return (
    <div className={'aa-cal aa-cal--full pmonth' + (sel.on ? ' is-selecting' : '') + (drag ? ' is-dragging' : '')}>
      <div className="aa-cal__header">
        <button type="button" className="aa-cal__nav" aria-label="Προηγούμενος μήνας" onClick={onPrev}><A.Icon name="chevron_left" /></button>
        <h2 className="aa-cal__title">{MONTHS_L[m - 1]} {y}</h2>
        <button type="button" className="aa-cal__nav" aria-label="Επόμενος μήνας" onClick={onNext}><A.Icon name="chevron_right" /></button>
      </div>
      <div role="grid" aria-label={MONTHS_L[m - 1] + ' ' + y} className="aa-cal__grid">
        <div role="row" className="aa-cal__row aa-cal__row--head">
          {WEEKDAYS.map((w) => <div key={w} role="columnheader" className="aa-cal__weekday" aria-label={w}>{w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()}</div>)}
        </div>
        {weeks.map((wk, wi) => (
          <div key={wi} role="row" className="aa-cal__row">
            {wk.map((s, si) => {
              if (s.outside) return <div key={si} role="gridcell" className="aa-cal__slot"><div className={'aa-cal__cell is-outside' + (si >= 5 ? ' is-weekend' : '')}><span className="aa-cal__date">{String(s.label).padStart(2, '0')}</span></div></div>;
              const { d, r, i } = s; const on = sel.on && sel.has(emp.id, d.iso); const list = events[d.d] || [];
              return (
                <div key={si} role="gridcell" className={'aa-cal__slot pmonth__slot' + (inDrag(i) && !r.inactive ? (drag.add ? ' in-rect' : ' in-rect is-removing') : '')} onPointerEnter={() => enter(i)}>
                  <button type="button" className={'aa-cal__cell aa-cal__cell--btn' + (d.weekend || d.holiday ? ' is-weekend' : '') + (on ? ' is-selected is-picked' : '') + (pressing === i ? ' is-pressing' : '')}
                    disabled={r.inactive} aria-pressed={sel.on ? on : undefined}
                    aria-label={d.d + ' ' + MONTHS_GEN[m - 1] + (on ? ', επιλεγμένη' : '')}
                    onPointerDown={(ev) => down(ev, i)} onContextMenu={(ev) => ev.preventDefault()}
                    onClick={(ev) => { if (ev.detail !== 0) return; if (sel.on) sel.set([{ emp, iso: d.iso }], !on); else onOpen(d.iso); }}>
                    <span className="aa-cal__date">{String(d.d).padStart(2, '0')}</span>
                    {list.length > 0 && <span className="aa-cal__events">{list.map((x, k) => <span key={k} className="aa-cal__event">{x.name}</span>)}</span>}
                  </button>
                  {sel.on && !r.inactive && <span className={'cell__chk' + (on ? ' is-on' : '')} aria-hidden="true">{on && <A.Icon name="done" size={10} />}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
