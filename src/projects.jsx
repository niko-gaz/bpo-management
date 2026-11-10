import { fmtEur0, todayIso, dayOf, addDays, mondayOf, monthsBetween, isoRange, monthDays, weeksOf, resolveDay, projectView, inProject, inProjectDuring, hoursIn, capacityOf, assignmentsOf, assignNote, assignTitle, rowNote, fmtEur, fmtNum, fullName, norm, byName, shiftLabel, leaveOf, DOW_LONG, MONTHS_GEN, fmtDate, pad } from './core.js';
import { MonthBar, ScheduleGrid, Legend, Info, Empty, TextF } from './ui.jsx';
const { useState, useMemo, useEffect } = React;
const A = window.Aambience;

export function ProjectsScreen({ store, y, m, setMonth, projectId, setProjectId, openDay, selection, openProjectForm, openAdd, goEmployee, setPeriodMonths }) {
  const { clients, projects, employees, entries } = store;
  const [open, setOpen] = useState({});
  const [fBr, setFBr] = useState('');
  const [q, setQ] = useState('');
  const [pq, setPq] = useState('');   // search in the client / project list
  useEffect(() => { setQ(''); setFBr(''); }, [projectId]);
  const days = useMemo(() => monthDays(y, m), [y, m]);
  const project = projects.find((p) => p.id === projectId) || null;
  const client = project ? clients.find((c) => c.id === project.clientId) : null;
  const [selIso, setSelIso] = useState(null);

  useEffect(() => { if (project && client) setOpen((o) => ({ ...o, [client.id]: true })); }, [projectId, client && client.id]);
  useEffect(() => {
    const t = new Date(); const inMonth = t.getFullYear() === y && t.getMonth() + 1 === m;
    setSelIso(inMonth ? days[t.getDate() - 1].iso : days.find((d) => !d.weekend && !d.holiday).iso);
  }, [y, m]);

  const sortedClients = useMemo(() => [...clients].sort((a, b) => a.name.localeCompare(b.name, 'el')), [clients]);
  // a client matching the search shows all its projects; otherwise only the matching projects
  const treeRows = useMemo(() => sortedClients.map((c) => {
    const all = projects.filter((p) => p.clientId === c.id).sort((a, b) => a.name.localeCompare(b.name, 'el'));
    if (!pq) return { c, ps: all, all: all.length };
    const cm = norm(c.name).includes(norm(pq));
    return { c, ps: cm ? all : all.filter((p) => norm(p.name).includes(norm(pq))), all: all.length, hit: cm };
  }).filter((x) => !pq || x.hit || x.ps.length), [sortedClients, projects, pq]);
  const team = useMemo(() => employees.filter((e) => project && inProjectDuring(e, project.id, days[0].iso, days[days.length - 1].iso)).sort(byName), [employees, project, days]);
  const opts = (k) => [...new Set(team.map((e) => e[k]).filter(Boolean))].sort();
  const branches = opts('branch');
  const showBranch = branches.length > 1;   // only worth a filter when the team works in more than one place
  const visible = team.filter((e) => (!showBranch || !fBr || e.branch === fBr) && (!q || norm(fullName(e) + ' ' + e.code).includes(norm(q))));

  const rate = project ? +project.rate || 0 : 0;
  const dayStats = useMemo(() => days.map((d) => {
    let hours = 0, remote = 0, leave = 0, ot = 0, working = 0;
    visible.forEach((e) => {
      const r = projectView(resolveDay(e, d, (entries[e.id] || {})[pad(d.d)]), project.id);
      hours += r.hours; ot += r.leave ? 0 : r.ot; if (r.leave) leave++; else if (r.hours) { working++; if (r.remote) remote++; }
    });
    return { hours, remote, leave, ot, working, fte: hours / 8, revenue: hours * rate };
  }), [days, visible, entries, rate, projectId]);

  // ---- totals for a chosen period (may reach into other months) ----
  const MAX_DAYS = 92;
  const [preset, setPreset] = useState('month');           // week | 2weeks | month | custom
  const [custom, setCustom] = useState({ from: '', to: '' });
  const monthFrom = days[0].iso, monthTo = days[days.length - 1].iso;
  const anchor = selIso || monthFrom;
  const period = preset === 'week' ? { from: mondayOf(anchor), to: addDays(mondayOf(anchor), 6) }
    : preset === '2weeks' ? { from: mondayOf(anchor), to: addDays(mondayOf(anchor), 13) }
    : preset === 'custom' ? custom : { from: monthFrom, to: monthTo };
  const periodErr = !period.from || !period.to ? 'Συμπληρώστε και τις δύο ημερομηνίες.'
    : period.to < period.from ? 'Η λήξη πρέπει να είναι ίδια ή μετά την έναρξη.'
    : isoRange(period.from, period.to).length > MAX_DAYS ? 'Επιλέξτε έως ' + MAX_DAYS + ' ημέρες (περίπου 3 μήνες).' : '';
  const today = todayIso(); const soonTo = addDays(today, 13);   // "next 14 days" always looks ahead from today
  const periodMonths = [...new Set([...(periodErr ? [] : monthsBetween(period.from, period.to)), ...monthsBetween(today, soonTo)])].sort();
  useEffect(() => { setPeriodMonths && setPeriodMonths(periodMonths); }, [periodMonths.join(',')]);
  useEffect(() => () => { setPeriodMonths && setPeriodMonths([]); }, []);
  const byMonth = store.entriesByMonth || {};
  const loaded = store.mode !== 'db' || periodMonths.every((mm) => byMonth[mm] !== undefined);
  const tot = useMemo(() => {
    const t = { hours: 0, ot: 0, revenue: 0, wd: 0, days: 0 };
    if (periodErr) return t;
    isoRange(period.from, period.to).forEach((iso) => {
      const d = dayOf(iso); t.days++; if (!d.weekend && !d.holiday) t.wd++;
      const ent = byMonth[iso.slice(0, 7)] || {};
      visible.forEach((e) => { const r = projectView(resolveDay(e, d, (ent[e.id] || {})[iso.slice(8)]), project.id); t.hours += r.hours; t.ot += r.leave ? 0 : r.ot; });
    });
    t.revenue = t.hours * rate; return t;
  }, [period.from, period.to, periodErr, byMonth, visible, rate, project && project.id]);
  // overtime & absences for the same period, plus who is away in the next 14 days
  const insight = useMemo(() => {
    const o = { ot: 0, hours: 0, byEmp: {}, reasons: {}, planned: 0, leave: 0, sick: 0, otherLeave: 0, soon: [] };
    if (!project) return o;
    const entFor = (iso, e) => ((byMonth[iso.slice(0, 7)] || {})[e.id] || {})[iso.slice(8)];
    if (!periodErr) isoRange(period.from, period.to).forEach((iso) => {
      const d = dayOf(iso);
      visible.forEach((e) => {
        const full = resolveDay(e, d, entFor(iso, e)); if (full.inactive) return;
        const r = projectView(full, project.id); o.hours += r.hours;
        if (r.ot) {
          o.ot += r.ot; o.byEmp[e.id] = (o.byEmp[e.id] || 0) + r.ot;
          const k = (full.otReason || '').trim() || 'Χωρίς αιτιολογία'; o.reasons[k] = (o.reasons[k] || 0) + 1;
        }
        const plannedDay = !!resolveDay(e, d, null).shift;
        if (plannedDay) o.planned++;
        if (full.leave && plannedDay) { o.leave++; if (full.leave === 'AS') o.sick++; else if (full.leave !== 'A') o.otherLeave++; }
      });
    });
    // upcoming absences grouped into runs (weekends / holidays inside a run don't break it)
    const soonDays = isoRange(today, soonTo).map(dayOf);
    visible.forEach((e) => {
      let run = null;
      const close = () => { if (run) { o.soon.push(run); run = null; } };
      soonDays.forEach((d) => {
        const full = resolveDay(e, d, entFor(d.iso, e));
        if (full.inactive) { close(); return; }
        if (full.leave) {
          if (run && run.type === full.leave) { run.to = d.iso; run.days++; }
          else { close(); run = { emp: e, type: full.leave, from: d.iso, to: d.iso, days: 1 }; }
        } else if (!d.weekend && !d.holiday) close();
      });
      close();
    });
    o.soon.sort((a, b) => a.from.localeCompare(b.from) || fullName(a.emp).localeCompare(fullName(b.emp), 'el'));
    return o;
  }, [period.from, period.to, periodErr, byMonth, visible, project && project.id, today]);
  const topOt = Object.entries(insight.byEmp).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, h]) => ({ emp: visible.find((e) => e.id === id), h })).filter((x) => x.emp);
  const topReasons = Object.entries(insight.reasons).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const shortDate = (iso) => iso.slice(8) + '/' + iso.slice(5, 7);
  const span = (a, b) => a === b ? shortDate(a) : (a.slice(5, 7) === b.slice(5, 7) ? a.slice(8) + '–' + shortDate(b) : shortDate(a) + ' – ' + shortDate(b));
  const pct = (a, b) => b ? fmtNum(Math.round((a / b) * 1000) / 10) + '%' : '0%';

  const pickPreset = (p) => { if (p === 'custom' && preset !== 'custom') setCustom({ from: period.from, to: period.to }); setPreset(p); };

  const rows = [
    ...visible.map((e) => {
      const multi = assignmentsOf(e).length > 1;
      return { type: 'emp', emp: e, pid: project.id, ...rowNote(e, project.id, days, entries[e.id]) };
    }),
    { type: 'total', key: 'h', label: 'Σύνολο ωρών', values: dayStats.map((s) => s.hours ? fmtNum(s.hours) : '') },
    { type: 'total', key: 'c', label: 'Capacity παραγωγής', values: dayStats.map((s) => s.hours ? fmtNum(s.fte) : '') },
    { type: 'total', key: 'r', label: 'Έσοδα / ημέρα', accent: true, values: dayStats.map((s) => s.revenue ? fmtNum(Math.round(s.revenue)) + '€' : '') },
  ];


  return (
    <div className="proj">
      <aside className="card proj__side" aria-label="Πελάτες και έργα">
        <A.Button color="main" roundness="full" leadingIcon="add" onClick={() => openProjectForm(null)} className="w100">Νέο έργο</A.Button>
        {sortedClients.length > 0 && <A.SearchInput value={pq} onChange={(v) => setPq(v)} placeholder="Αναζήτηση πελάτη ή έργου" aria-label="Αναζήτηση πελάτη ή έργου" />}
        {!sortedClients.length && <p className="body-s muted pad-s">Δεν υπάρχουν ακόμη πελάτες. Δημιουργήστε το πρώτο έργο.</p>}
        {treeRows.length === 0 && sortedClients.length > 0 && <p className="body-s muted pad-s">Κανένας πελάτης ή έργο δεν ταιριάζει με «{pq}».</p>}
        <ul className="tree">
          {treeRows.map(({ c, ps, all }) => {
            const isOpen = pq ? true : !!open[c.id];
            return (
              <li key={c.id}>
                <button type="button" className="tree__c body-bold-s" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [c.id]: !o[c.id] }))}>
                  <span>{c.name}</span><span className="tree__n caption">{pq && ps.length !== all ? ps.length + '/' + all : all}</span><A.Icon name={isOpen ? 'expand_less' : 'expand_more'} />
                </button>
                {isOpen && (
                  <ul>
                    {ps.map((p) => (
                      <li key={p.id}>
                        <button type="button" className={'tree__p body-s' + (p.id === projectId ? ' is-on' : '')} aria-current={p.id === projectId ? 'true' : undefined}
                          onClick={() => setProjectId(p.id)}>{p.name}</button>
                      </li>
                    ))}
                    {!ps.length && <li className="body-xs muted tree__none">Χωρίς έργα</li>}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="proj__main">
        {!project ? (
          <div className="card"><Empty icon="business" title="Επιλέξτε έργο">Διαλέξτε ένα έργο από τη λίστα πελατών για να δείτε το πρόγραμμα, τα σύνολα και την ομάδα του.</Empty></div>
        ) : (<>
          <section className="card" aria-labelledby="ptitle">
            <div className="cardhead">
              <h1 id="ptitle" className="heading-bold-xs">{client ? client.name : ''} <span className="sep">|</span> {project.name}</h1>
              <A.Button color="outline" roundness="full" leadingIcon="edit" onClick={() => openProjectForm(project)}>Επεξεργασία</A.Button>
            </div>
            <div className="infogrid">
              <Info label="Εργάσιμες καθημερινές">{project.workdays}</Info>
              <Info label="Εργάσιμες Σαββατοκύριακα">{+project.weekendDays ? project.weekendDays : '—'}</Info>
              <Info label="Τρόπος τιμολόγησης">{project.billing}</Info>
              <Info label="Προγραμματισμός budget καθημερινές">{project.budgetPlan}</Info>
              <Info label="Budget">{project.budget ? fmtEur(+project.budget) : '—'}</Info>
              <Info label="Χρέωση ανά ώρα">{fmtEur(rate)}</Info>
              <Info label="Προϊστάμενος">{project.supervisor}</Info>
              <Info label="Τόπος εργασίας">{project.workplace}</Info>
              <Info label="Τοποθεσία">{project.location}</Info>
              <Info label="Συνεργάτες">{team.length}</Info>
            </div>
          </section>

          <section className="card" aria-label="Μηνιαίο πρόγραμμα έργου">
            <div className="toolbar">
              {showBranch && (
                <div className="toolbar__f">
                  <A.Dropdown aria-label="Υποκατάστημα" placeholder="Υποκατάστημα: όλα" value={fBr} onChange={setFBr} options={branches} />
                </div>
              )}
              <div className="toolbar__s"><A.SearchInput value={q} onChange={(v) => setQ(v)} placeholder="Αναζήτηση συνεργάτη" aria-label="Αναζήτηση συνεργάτη στο έργο" /></div>
              <div className="toolbar__a">
                <A.Button color={selection.on ? 'secondary' : 'outline'} roundness="full" leadingIcon={selection.on ? 'close' : 'done'} onClick={selection.toggle} aria-pressed={selection.on}>{selection.on ? 'Τέλος επιλογής' : 'Επιλογή'}</A.Button>
                <A.Button color="main" roundness="full" leadingIcon="add" onClick={openAdd}>Προσθήκη συνεργάτη</A.Button>
              </div>
            </div>
            <MonthBar y={y} m={m} onPrev={() => setMonth(-1)} onNext={() => setMonth(1)} />
            {visible.length ? (
              <ScheduleGrid y={y} m={m} days={days} rows={rows} entries={entries} mode="hours" selectedIso={selIso} onDay={setSelIso}
                onCell={(e, d) => { setSelIso(d.iso); openDay([e], d.iso); }} selection={selection} onName={goEmployee} />
            ) : (
              <Empty icon="people_outline" title={team.length ? 'Κανείς δεν ταιριάζει στα φίλτρα' : 'Το έργο δεν έχει ακόμη συνεργάτες'}
                action={!team.length && <A.Button color="main" roundness="full" leadingIcon="add" onClick={openAdd}>Προσθήκη συνεργάτη</A.Button>}>
                {team.length ? 'Αλλάξτε ή καθαρίστε τα φίλτρα για να δείτε την ομάδα.' : 'Προσθέστε συνεργάτες για να συμπληρωθεί το πρόγραμμα.'}
              </Empty>
            )}
            <Legend hint />
          </section>

          <div className="proj__totals">
            <section className="card" aria-labelledby="wtitle">
              <div className="cardhead">
                <h2 id="wtitle" className="body-bold-l">Σύνολα περιόδου</h2>
                {!periodErr && <span className="body-s muted">{fmtDate(period.from)} – {fmtDate(period.to)}</span>}
              </div>
              <div className="period">
                <div className="period__presets" role="group" aria-label="Περίοδος">
                  {[['week', 'Εβδομάδα'], ['2weeks', '2 εβδομάδες'], ['month', 'Μήνας'], ['custom', 'Προσαρμογή']].map(([k, l]) => (
                    <A.Chip key={k} color={preset === k ? 'brand' : 'neutral'} selected={preset === k} roundness="full" onClick={() => pickPreset(k)}>{l}</A.Chip>
                  ))}
                </div>
                {preset === 'custom' ? (
                  <div className="period__dates">
                    <TextF label="Από" type="date" value={custom.from} onChange={(v) => setCustom((c) => ({ ...c, from: v }))} />
                    <TextF label="Έως" type="date" value={custom.to} onChange={(v) => setCustom((c) => ({ ...c, to: v }))} error={periodErr || undefined} />
                  </div>
                ) : (
                  <p className="body-xs muted">{preset === 'month' ? 'Ο μήνας που εμφανίζεται στον πίνακα.' : 'Ξεκινά τη Δευτέρα της ημέρας που έχετε επιλέξει στην κεφαλίδα του πίνακα.'}</p>
                )}
              </div>
              {!periodErr && (
                <div className={'rings' + (loaded ? '' : ' is-loading')} aria-busy={!loaded}>
                  <div className="ring"><span className="ring__l body-bold-s">Σύνολο ωρών</span><span className="ring__c display-s">{fmtNum(tot.hours)}</span><span className="body-xs muted">εκ των οποίων {fmtNum(tot.ot)} υπερωρίες</span></div>
                  <div className="ring"><span className="ring__l body-bold-s">Capacity παραγωγής</span><span className="ring__c display-s">{fmtNum(tot.wd ? tot.hours / 8 / tot.wd : 0)}</span><span className="body-xs muted">μέσος όρος FTE / εργάσιμη</span></div>
                  <div className="ring ring--accent"><span className="ring__l body-bold-s">Έσοδα</span><span className="ring__c display-s">{fmtEur0(tot.revenue)}</span><span className="body-xs muted">{tot.wd} εργάσιμες σε {tot.days} ημέρες{project.budget ? ', budget ' + fmtEur0(+project.budget) : ''}</span></div>
                </div>
              )}
            </section>
            <section className="card" aria-labelledby="oatitle">
              <div className="cardhead">
                <h2 id="oatitle" className="body-bold-l">Υπερωρίες και απουσίες</h2>
                {!periodErr && <span className="body-s muted">{fmtDate(period.from)} – {fmtDate(period.to)}</span>}
              </div>
              {!periodErr && (<div className={loaded ? '' : 'is-loading'}>
                <h3 className="body-bold-s oa__h">Υπερωρίες</h3>
                <div className="kpis">
                  <div className="kpi"><span className="kpi__v display-bold-xs">{fmtNum(insight.ot)}</span><span className="kpi__l body-xs">ώρες</span></div>
                  <div className="kpi"><span className="kpi__v display-bold-xs">{fmtEur0(insight.ot * rate)}</span><span className="kpi__l body-xs">αξία (χρέωση/ώρα)</span></div>
                  <div className="kpi"><span className="kpi__v display-bold-xs">{pct(insight.ot, insight.hours)}</span><span className="kpi__l body-xs">των ωρών του έργου</span></div>
                </div>
                {insight.ot > 0 ? (
                  <div className="oa__cols">
                    <div>
                      <p className="body-xs muted oa__sub">Περισσότερες υπερωρίες</p>
                      <ul className="mlist">{topOt.map(({ emp: e, h }) => (
                        <li key={e.id}><button type="button" className="mlist__name link" onClick={() => goEmployee(e)}>{fullName(e)}</button><span className="mlist__v">{fmtNum(h)} ώρ.</span></li>
                      ))}</ul>
                    </div>
                    <div>
                      <p className="body-xs muted oa__sub">Συχνότερες αιτιολογίες</p>
                      <ul className="mlist">{topReasons.map(([k, n]) => (
                        <li key={k}><span className="mlist__name">{k}</span><span className="mlist__v">{n === 1 ? '1 φορά' : n + ' φορές'}</span></li>
                      ))}</ul>
                    </div>
                  </div>
                ) : <p className="body-s muted">Καμία υπερωρία στην περίοδο.</p>}

                <h3 className="body-bold-s oa__h">Απουσίες</h3>
                <div className="kpis">
                  <div className="kpi"><span className="kpi__v display-bold-xs">{pct(insight.leave, insight.planned)}</span><span className="kpi__l body-xs">ποσοστό απουσίας</span></div>
                  <div className="kpi"><span className="kpi__v display-bold-xs">{insight.leave - insight.sick - insight.otherLeave}</span><span className="kpi__l body-xs">ημέρες κανονικής άδειας</span></div>
                  <div className="kpi"><span className="kpi__v display-bold-xs">{insight.sick}</span><span className="kpi__l body-xs">ημέρες ασθένειας</span></div>
                  {insight.otherLeave > 0 && <div className="kpi"><span className="kpi__v display-bold-xs">{insight.otherLeave}</span><span className="kpi__l body-xs">λοιπές άδειες</span></div>}
                </div>
              </div>)}
              <h3 className="body-bold-s oa__h">Απουσίες τις επόμενες 14 ημέρες</h3>
              {insight.soon.length ? (
                <ul className="mlist">{insight.soon.map((x, i) => (
                  <li key={i}>
                    <button type="button" className="mlist__name link" onClick={() => goEmployee(x.emp)}>{fullName(x.emp)}</button>
                    <span className={'tag t-leave-' + leaveOf(x.type).tone}>{leaveOf(x.type).short}</span>
                    <span className="mlist__v">{span(x.from, x.to)}</span>
                  </li>
                ))}</ul>
              ) : <p className="body-s muted">Καμία προγραμματισμένη απουσία ως τις {fmtDate(soonTo)}.</p>}
            </section>
          </div>
        </>)}
      </div>
    </div>
  );
}
