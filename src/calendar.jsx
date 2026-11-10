import { monthDays, resolveDay, projectView, inProject, inProjectDuring, assignmentsOf, hoursIn, capacityOf, assignNote, assignTitle, rowNote, fmtNum, fullName, norm, byName, shiftLabel, leaveOf, pad, MONTHS, todayIso } from './core.js';
import { MonthBar, ScheduleGrid, Legend, Empty } from './ui.jsx';
const { useState, useMemo } = React;
const A = window.Aambience;

export function CalendarScreen({ store, y, m, setMonth, openDay, selection, goEmployee, notify }) {
  const { clients, projects, employees, entries } = store;
  const [fc, setFc] = useState(''); const [fp, setFp] = useState(''); const [q, setQ] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const days = useMemo(() => monthDays(y, m), [y, m]);

  const match = (e) => !q || norm(fullName(e) + ' ' + e.code).includes(norm(q));
  const groups = useMemo(() => {
    const out = [];
    [...clients].sort((a, b) => a.name.localeCompare(b.name, 'el')).forEach((c) => {
      if (fc && c.id !== fc) return;
      const ps = projects.filter((p) => p.clientId === c.id && (!fp || p.id === fp)).sort((a, b) => a.name.localeCompare(b.name, 'el'))
        .map((p) => ({ p, emps: employees.filter((e) => inProjectDuring(e, p.id, days[0].iso, days[days.length - 1].iso) && match(e)).sort(byName) })).filter((g) => g.emps.length);
      if (ps.length) out.push({ c, ps });
    });
    return out;
  }, [clients, projects, employees, fc, fp, q, days]);
  // people with shift hours this month that no project covers (flexible / rotating staff, or not yet assigned)
  const freeEmps = useMemo(() => (fp ? [] : employees.filter((e) => match(e) && days.some((d) => {
    const r = resolveDay(e, d, (entries[e.id] || {})[pad(d.d)]); return r.free > 0;
  })).sort(byName)), [employees, entries, days, fp, q]);
  const freeHours = useMemo(() => freeEmps.reduce((t, e) => t + days.reduce((s, d) => s + resolveDay(e, d, (entries[e.id] || {})[pad(d.d)]).free, 0), 0), [freeEmps, entries, days]);

  const visibleIds = [...new Set([...freeEmps.map((e) => e.id), ...groups.flatMap((g) => g.ps.flatMap((x) => x.emps.map((e) => e.id)))])];
  const rows = [];
  if (freeEmps.length) {
    const isC = !!collapsed._free;
    rows.push({ type: 'group', level: 'free', key: 'free', label: (
      <button type="button" className="grp__btn" aria-expanded={!isC} onClick={() => setCollapsed((s) => ({ ...s, _free: !s._free }))}>
        <A.Icon name={isC ? 'chevron_right' : 'expand_more'} size={18} />
        <span className="grp__pn">Προς κατανομή <span className="caption grp__n">{freeEmps.length}</span></span>
      </button>
    ), extra: <span className="grp__extra body-s">{fmtNum(freeHours)} ώρες βάρδιας χωρίς έργο αυτόν τον μήνα. Επιλέξτε κελιά και «Μετακίνηση σε έργο» για να τις μοιράσετε.</span> });
    if (!isC) freeEmps.forEach((e) => rows.push({ type: 'emp', emp: e, showCode: true, free: true, pid: '_free' }));
  }
  groups.forEach(({ c, ps }) => {
    const n = ps.reduce((a, x) => a + x.emps.length, 0);
    rows.push({ type: 'group', level: 1, key: 'c' + c.id, label: <span className="grp__l">{c.name}<span className="caption grp__n">{n}</span></span> });
    ps.forEach(({ p, emps }) => {
      const isC = !!collapsed[p.id];
      rows.push({ type: 'group', level: 2, key: 'p' + p.id, label: (
        <button type="button" className="grp__btn" aria-expanded={!isC} onClick={() => setCollapsed((s) => ({ ...s, [p.id]: !s[p.id] }))}>
          <A.Icon name={isC ? 'chevron_right' : 'expand_more'} size={18} />
          <span className="grp__txt">
            <span className="grp__pn">{p.name}</span>
            {p.supervisor && <span className="grp__sup">{p.supervisor}</span>}
          </span>
        </button>
      ) });
      if (!isC) emps.forEach((e) => {
        const multi = assignmentsOf(e).length > 1;
        rows.push({ type: 'emp', emp: e, showCode: true, pid: p.id, ...rowNote(e, p.id, days, entries[e.id]) });
      });
    });
  });


  async function exportCsv() {
    let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) {}
    const head = ['Πελάτης', 'Έργο', 'Κωδικός', 'Ονοματεπώνυμο', ...days.map((d) => pad(d.d) + '/' + pad(m)), 'Ώρες στο έργο', 'Υπερωρίες στο έργο', 'Ημέρες τηλεργασίας', 'Ημέρες άδειας'];
    const lines = [head];
    groups.forEach(({ c, ps }) => ps.forEach(({ p, emps }) => emps.forEach((e) => {
      const ov = entries[e.id] || {}; let h = 0, ot = 0, rd = 0, lv = 0;
      const cells = days.map((d) => {
        const full = resolveDay(e, d, ov[pad(d.d)]); const r = p.id !== '_none' ? projectView(full, p.id) : full;
        if (r.inactive) return '';
        if (r.leave) { lv++; return leaveOf(r.leave).code; }
        h += r.hours; ot += r.ot; if (r.remote && r.shift) rd++;
        if (!r.shift && !r.ot) return ''; return (r.shift ? shiftLabel(r.shift) : '') + (r.base !== full.base ? ' (' + r.base + 'ω)' : '') + (r.remote && r.shift ? ' Τ' : '') + (r.ot ? ' +' + r.ot + 'Υ' : '');
      });
      lines.push([c.name, p.name, e.code, fullName(e), ...cells, h, ot, rd, lv]);
    })));
    const csv = '\ufeff' + lines.map((l) => l.map((v) => { const s = String(v); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(';')).join('\r\n');
    if (!dl) { notify('Η εξαγωγή δεν είναι διαθέσιμη σε αυτή την προβολή.'); return; }
    try { await dl.save({ filename: 'orario-' + y + '-' + pad(m) + '.csv', data: csv }); notify('Το αρχείο ωραρίων εξήχθη.'); }
    catch (e) { if (e && e.code !== 'declined') notify('Η εξαγωγή δεν ολοκληρώθηκε. Δοκιμάστε ξανά.'); }
  }

  const clientOpts = [...clients].sort((a, b) => a.name.localeCompare(b.name, 'el')).map((c) => ({ value: c.id, label: c.name }));
  const projOpts = projects.filter((p) => !fc || p.clientId === fc).sort((a, b) => a.name.localeCompare(b.name, 'el')).map((p) => ({ value: p.id, label: p.name }));

  return (
    <section className="card" aria-label="Μαζικό ημερολόγιο ωραρίων">
      <MonthBar y={y} m={m} onPrev={() => setMonth(-1)} onNext={() => setMonth(1)} />
      <div className="toolbar">
        <div className="toolbar__f">
          <A.Dropdown aria-label="Πελάτης" value={fc} onChange={(v) => { setFc(v); setFp(''); }} options={clientOpts} placeholder="Πελάτης: όλοι" />
          {/* project names repeat across clients, so the project filter opens only once a client is chosen */}
          <A.Dropdown aria-label={fc ? 'Έργο' : 'Έργο (επιλέξτε πρώτα πελάτη)'} value={fc ? fp : ''} onChange={setFp} disabled={!fc}
            options={fc ? projOpts : []} placeholder={fc ? 'Έργο: όλα' : 'Έργο: πρώτα πελάτη'} />
        </div>
        <div className="toolbar__s"><A.SearchInput value={q} onChange={(v) => setQ(v)} placeholder="Αναζήτηση" /></div>
        <div className="toolbar__a">
          <A.Button color={selection.on ? 'secondary' : 'outline'} roundness="full" leadingIcon={selection.on ? 'close' : 'done'} onClick={selection.toggle} aria-pressed={selection.on}>{selection.on ? 'Τέλος επιλογής' : 'Επιλογή'}</A.Button>
          <A.Button color="tertiary" roundness="full" leadingIcon="file_download" onClick={exportCsv} disabled={!visibleIds.length}>Εξαγωγή</A.Button>
        </div>
      </div>
      {rows.length ? (
        <ScheduleGrid y={y} m={m} days={days} rows={rows} entries={entries} mode="shift" nameWidth={300}
          onCell={(e, d) => openDay([e], d.iso)} selection={selection} onName={goEmployee} />
      ) : (
        <Empty icon="calendar_today" title={employees.length ? 'Κανένα αποτέλεσμα' : 'Δεν υπάρχουν ακόμη συνεργάτες'}>
          {employees.length ? 'Αλλάξτε τα φίλτρα ή την αναζήτηση.' : 'Προσθέστε συνεργάτες και έργα για να γεμίσει το ημερολόγιο.'}
        </Empty>
      )}
      <Legend hint />
    </section>
  );
}
