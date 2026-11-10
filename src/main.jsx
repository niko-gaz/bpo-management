import { fullName, uid, pad, assignmentsOf, inProject, availableOf, fmtNum, ALL_DAYS, resolveDay, dayOf, shiftHours, primaryProject, activeOn, addDays, todayIso } from './core.js';
import { useStore } from './store.js';
import { ProjectsScreen } from './projects.jsx';
import { EmployeesScreen, EmployeeDetail } from './employees.jsx';
import { CalendarScreen } from './calendar.jsx';
import { DayEditor, ProjectForm, EmployeeForm, AddEmployees, MoveDialog } from './modals.jsx';
import { Empty } from './ui.jsx';
const { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } = React;
const A = window.Aambience;

function parseHash() {
  const h = (location.hash || '').replace(/^#/, '');
  if (h.startsWith('emp-')) return { view: 'employee', id: h.slice(4) };
  if (h.startsWith('proj-')) return { view: 'projects', id: h.slice(5) };
  if (h === 'employees' || h === 'calendar') return { view: h };
  return { view: 'projects' };
}

function App() {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() + 1 });
  const [periodMonths, setPeriodMonths] = useState([]);
  const store = useStore(ym.y + '-' + pad(ym.m), periodMonths);
  const [route, setRoute] = useState(parseHash);
  const [dlg, setDlg] = useState(null);
  const [toast, setToast] = useState(null);
  // cell selection (shared by every screen that shows a schedule)
  const [selOn, setSelOn] = useState(false);
  const [selMap, setSelMap] = useState({});
  const selection = useMemo(() => ({
    on: selOn,
    has: (id, iso) => !!selMap[id + '|' + iso],
    set: (items, v) => setSelMap((m) => { const n = { ...m }; items.forEach(({ emp, iso }) => { const k = emp.id + '|' + iso; if (v) n[k] = { empId: emp.id, iso }; else delete n[k]; }); return n; }),
    enter: () => setSelOn(true),
    toggle: () => { if (selOn) { setSelOn(false); setSelMap({}); } else setSelOn(true); },
  }), [selOn, selMap]);
  const exitSel = () => { setSelOn(false); setSelMap({}); };
  const tRef = useRef(null);

  useEffect(() => { const f = () => setRoute(parseHash()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  useEffect(() => { exitSel(); }, [route.view, route.id]);
  useEffect(() => {
    if (!selOn) return;
    const k = (e) => { if (e.key === 'Escape' && !document.querySelector('.overlay')) exitSel(); };
    document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k);
  }, [selOn]);
  const go = (token) => { if (('#' + token) !== location.hash) location.hash = token; else setRoute(parseHash()); window.scrollTo(0, 0); };
  const notify = useCallback((msg, undo) => { setToast({ msg, undo }); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(null), undo ? 10000 : 4000); }, []);
  const setMonth = (d) => setYm(({ y, m }) => { let mm = m + d, yy = y; if (mm < 1) { mm = 12; yy--; } if (mm > 12) { mm = 1; yy++; } return { y: yy, m: mm }; });
  const guard = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { notify(e && e.code === 'invalid_argument' ? 'Δεν έχετε δικαίωμα αλλαγών σε αυτά τα δεδομένα.' : 'Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.'); throw e; } };

  const { clients, projects, employees, api } = store;

  // default project
  // where the employee page was opened from, so the trail and "Επιστροφή" lead back there
  const [origin, setOrigin] = useState(null);           // { view: 'projects' | 'calendar' | 'employees', id? }
  const [lastProj, setLastProj] = useState(null);
  const [visited, setVisited] = useState({});
  const scrolls = useRef({});
  const prevView = useRef(route.view);
  useEffect(() => { if (route.view === 'projects' && route.id) setLastProj(route.id); }, [route.view, route.id]);
  useEffect(() => { if (route.view !== 'employee' && !visited[route.view]) setVisited((v) => ({ ...v, [route.view]: true })); }, [route.view]);
  useLayoutEffect(() => {
    // coming back from an employee page: restore the list exactly where it was
    if (prevView.current === 'employee' && scrolls.current[route.view] != null) { window.scrollTo(0, scrolls.current[route.view]); delete scrolls.current[route.view]; }
    prevView.current = route.view;
  }, [route.view, route.id]);
  const openEmployee = (from) => (e) => { scrolls.current[from.view] = window.scrollY; setOrigin(from); go('emp-' + e.id); };
  const goBack = () => {
    // go straight to the origin; history.back() could leave the artifact viewer itself
    go(origin ? (origin.view === 'projects' && origin.id ? 'proj-' + origin.id : origin.view) : 'employees');
  };
  const wantProj = route.view === 'projects' ? route.id : lastProj;
  const projectId = (wantProj && projects.some((p) => p.id === wantProj)) ? wantProj : (projects.slice().sort((a, b) => a.name.localeCompare(b.name, 'el'))[0] || {}).id;

  const entriesFor = (empId, iso) => {
    if (iso.slice(0, 7) !== ym.y + '-' + pad(ym.m)) return null;
    return (store.entries[empId] || {})[iso.slice(8)] || null;
  };
  const openDay = (emps, iso, bulk, after, isoEnd) => {
    if (store.readOnly) { notify('Έχετε πρόσβαση μόνο για ανάγνωση.'); return; }
    setDlg({ kind: 'day', emps, iso, isoEnd, bulk, after });
  };
  const selCells = () => {
    const by = {};
    Object.values(selMap).forEach(({ empId, iso }) => { (by[empId] = by[empId] || []).push(iso); });
    return Object.entries(by).map(([id, days]) => ({ emp: employees.find((e) => e.id === id), days: days.sort() })).filter((c) => c.emp);
  };
  // ---- dated team changes: earlier days are never rewritten ----
  // leave projects from a date: rows that started earlier end the day before; rows starting later are dropped
  const endFrom = (as, pids, fromIso) => as.flatMap((a) => {
    if (!pids.includes(a.projectId)) return [a];
    if (a.from && a.from >= fromIso) return [];
    if (!a.to || a.to >= fromIso) return [{ ...a, to: addDays(fromIso, -1) }];
    return [a];
  });
  // join projects from a date (no fixed hours). Already a member that day: nothing to do.
  // A later period of the same project starts earlier instead of adding a second, overlapping one.
  const joinFrom = (as, pids, fromIso) => {
    let out = [...as];
    pids.forEach((p) => {
      if (out.some((a) => a.projectId === p && activeOn(a, fromIso))) return;
      const later = out.filter((a) => a.projectId === p && a.from && a.from > fromIso).sort((x, y) => x.from.localeCompare(y.from))[0];
      if (later) { out = out.map((a) => (a === later ? { ...a, from: fromIso } : a)); return; }
      out.push({ projectId: p, mode: 'none', hours: 0, days: ALL_DAYS, from: fromIso, to: '' });
    });
    return out;
  };
  const putAssignments = async (e, assignments) => { const rest = { ...e }; delete rest.projectId; await api.put('employees', e.id, { ...rest, assignments }); };

  // "Μετακίνηση σε έργο": give the chosen days (all shift or N hours) to one project
  async function moveSelection(pid, hoursWanted) {
    const cells = selCells(); const target = projects.find((p) => p.id === pid);
    let moved = 0, skipped = 0, joined = 0; const undo = [];
    for (const { emp: e, days } of cells) {
      let emp = e;
      const firstDay = [...days].sort()[0];
      const joinedAs = joinFrom(assignmentsOf(e), [pid], firstDay);
      if (JSON.stringify(joinedAs) !== JSON.stringify(assignmentsOf(e))) {   // join the team (from the first moved day) so the hours count there
        await putAssignments(e, joinedAs); emp = { ...e, assignments: joinedAs }; joined++;
      }
      const res = await api.updateDays(e.id, days, (ov, iso) => {
        const full = resolveDay(emp, dayOf(iso), ov);
        if (full.inactive || full.leave || !full.shift) { skipped++; return undefined; }   // nothing to move
        const base = full.base; const alloc = { ...(full.alloc || {}) };
        if (hoursWanted === 'all') { Object.keys(alloc).forEach((k) => { delete alloc[k]; }); alloc[pid] = base; }
        else {
          // the project ends up with exactly N hours that day: taken first from unassigned time, then from the busiest other project
          const target = Math.min(+hoursWanted, base); const cur = alloc[pid] || 0;
          if (target >= cur) {
            let need = target - cur; alloc[pid] = cur;
            const free = base - Object.values(alloc).reduce((t, v) => t + (+v || 0), 0);
            const take = Math.min(Math.max(0, free), need); alloc[pid] += take; need -= take;
            Object.keys(alloc).filter((k) => k !== pid).sort((x, y) => alloc[y] - alloc[x]).forEach((k) => {
              if (need <= 0) return; const t = Math.min(alloc[k], need); alloc[k] -= t; alloc[pid] += t; need -= t; if (!alloc[k]) delete alloc[k];
            });
          } else {
            alloc[pid] = target; const back = cur - target; const home = primaryProject(emp);
            if (home && home !== pid) alloc[home] = (alloc[home] || 0) + back;   // give the rest back to the main project
          }
          if (!alloc[pid]) delete alloc[pid];
        }
        moved++;
        return { shift: full.shift, remote: full.remote, ot: full.ot || 0, otProject: full.otProject || '', otReason: full.otReason || '', alloc };
      });
      if (res && Object.keys(res.prev).length) undo.push({ empId: e.id, prev: res.prev });
    }
    exitSel();
    const msg = (moved === 1 ? '1 ημέρα μεταφέρθηκε' : moved + ' ημέρες μεταφέρθηκαν') + ' στο ' + (target ? target.name : 'έργο') + '.'
      + (skipped ? ' ' + skipped + (skipped === 1 ? ' ημέρα χωρίς βάρδια ή με άδεια παραλείφθηκε.' : ' ημέρες χωρίς βάρδια ή με άδεια παραλείφθηκαν.') : '')
      + (joined ? ' ' + (joined === 1 ? '1 συνεργάτης μπήκε' : joined + ' συνεργάτες μπήκαν') + ' στην ομάδα του έργου.' : '');
    notify(msg, undo.length ? async () => {
      setToast(null);
      try { for (const u of undo) await api.setDays(u.empId, u.prev); notify('Η μεταφορά αναιρέθηκε.'); } catch (e) { notify('Η αναίρεση απέτυχε. Δοκιμάστε ξανά.'); }
    } : null);
  }
  const editSelection = () => {
    if (store.readOnly) { notify('Έχετε πρόσβαση μόνο για ανάγνωση.'); return; }
    const cells = selCells(); if (!cells.length) return;
    setDlg({ kind: 'day', cells, emps: cells.map((c) => c.emp), iso: cells[0].days[0], bulk: cells.length > 1, after: exitSel });
  };

  async function saveProject(form, selIds, existing) {
    let client = clients.find((c) => c.name.trim().toLowerCase() === form.clientName.trim().toLowerCase());
    if (!client) { client = { id: uid('c'), name: form.clientName.trim() }; await api.put('clients', client.id, { name: client.name }); }
    const id = existing ? existing.id : uid('p');
    const body = { clientId: client.id, name: form.name.trim(), supervisor: form.supervisor, workdays: form.workdays, weekendDays: form.weekendDays, billing: form.billing,
      budgetPlan: form.budgetPlan, budget: form.budget, rate: form.rate, workplace: form.workplace, location: form.location };
    await api.put('projects', id, body);
    for (const e of employees) {
      const want = selIds.includes(e.id); const has = inProject(e, id); const as = assignmentsOf(e);
      if (want && !has) {
        // someone without a project gets this as their main one; others join without fixed hours
        const rest = { ...e }; delete rest.projectId;
        await api.put('employees', e.id, { ...rest, assignments: [...as, { projectId: id, mode: as.length ? 'none' : 'rest', hours: 0, days: ALL_DAYS }], supervisor: as.length ? e.supervisor : body.supervisor });
      } else if (!want && has) {
        await putAssignments(e, endFrom(as, [id], todayIso()));   // leaves from today; past months keep their rows
      }
    }
    if (existing && existing.clientId !== client.id && !projects.some((p) => p.clientId === existing.clientId && p.id !== id)) await api.remove('clients', existing.clientId);
    notify(existing ? 'Οι αλλαγές του έργου αποθηκεύτηκαν.' : 'Το έργο δημιουργήθηκε.');
    go('proj-' + id);
  }
  async function assign(project, ids, how) {
    const mode = (how && how.mode) || 'none';
    for (const e of employees.filter((x) => ids.includes(x.id))) {
      const from = (how && how.from) || ''; const to = (how && how.to) || '';
      let as = assignmentsOf(e).filter((a) => a.projectId !== project.id || (a.to && from && a.to < from));   // keep earlier, finished periods
      if (mode === 'rest') as = as.map((a) => (a.mode === 'rest' && (!a.to || !from || a.to >= from) ? { ...a, mode: 'none', hours: 0 } : a));   // only one main project
      const rest = { ...e }; delete rest.projectId;
      await api.put('employees', e.id, { ...rest, assignments: [...as, { projectId: project.id, mode, hours: mode === 'fixed' ? how.hours : 0, days: (how && how.days) || ALL_DAYS, from, to }],
        supervisor: as.length && mode !== 'rest' ? e.supervisor : (project.supervisor || e.supervisor) });
    }
    notify(ids.length === 1 ? 'Ο συνεργάτης προστέθηκε στο έργο.' : ids.length + ' συνεργάτες προστέθηκαν στο έργο.');
  }
  async function saveEmployee(form, existing) {
    const id = existing ? existing.id : uid('e');
    await api.put('employees', id, form);
    notify(existing ? 'Τα στοιχεία αποθηκεύτηκαν.' : 'Ο συνεργάτης δημιουργήθηκε.');
    if (!existing) { setOrigin({ view: 'employees', inApp: true }); go('emp-' + id); }
  }

  const emp = route.view === 'employee' ? employees.find((e) => e.id === route.id) : null;
  const project = projects.find((p) => p.id === projectId);
  const empName = emp ? fullName(emp) : 'Συνεργάτης';
  const originProj = origin && origin.view === 'projects' ? projects.find((p) => p.id === origin.id) : null;
  const crumbs = route.view === 'employees' ? [['Συνεργάτες']] : route.view === 'calendar' ? [['Ωράρια']]
    : route.view === 'employee' ? [['Συνεργάτες', 'employees'], [empName]]   // where the page belongs; "Επιστροφή" covers where you came from
    : [['Έργα'], ...(project ? [[project.name]] : [])];
  const nav = route.view === 'employee' ? 'employees' : route.view;
  const backLabel = !origin || origin.view === 'employees' ? 'Επιστροφή στους Συνεργάτες'
    : origin.view === 'calendar' ? 'Επιστροφή στα Ωράρια'
    : 'Επιστροφή στο ' + (originProj ? originProj.name : 'έργο');
  const show = (v) => route.view === v;

  let body;
  if (!store.ready) body = <div className="card"><Empty icon="sync" title="Φόρτωση δεδομένων…" /></div>;
  else body = (<>
    {(visited.projects || show('projects')) && (
      <div className="screen" hidden={!show('projects')}>
        <ProjectsScreen store={store} y={ym.y} m={ym.m} setMonth={setMonth} projectId={projectId} setProjectId={(id) => go('proj-' + id)}
          openDay={openDay} selection={selection} openProjectForm={(p) => setDlg({ kind: 'project', project: p })} openAdd={() => setDlg({ kind: 'add', project })}
          goEmployee={openEmployee({ view: 'projects', id: projectId, inApp: true })} setPeriodMonths={setPeriodMonths} />
      </div>
    )}
    {(visited.employees || show('employees')) && (
      <div className="screen" hidden={!show('employees')}>
        <EmployeesScreen store={store} openNew={() => setDlg({ kind: 'emp' })} goEmployee={openEmployee({ view: 'employees', inApp: true })} />
      </div>
    )}
    {(visited.calendar || show('calendar')) && (
      <div className="screen" hidden={!show('calendar')}>
        <CalendarScreen store={store} y={ym.y} m={ym.m} setMonth={setMonth} openDay={openDay} selection={selection} goEmployee={openEmployee({ view: 'calendar', inApp: true })} notify={notify} />
      </div>
    )}
    {show('employee') && (emp
      ? <EmployeeDetail store={store} emp={emp} y={ym.y} m={ym.m} setMonth={setMonth} openDay={openDay} selection={selection} openEdit={() => setDlg({ kind: 'emp', emp })} />
      : <div className="card"><Empty icon="person_outline" title="Ο συνεργάτης δεν βρέθηκε" action={<A.Button color="main" roundness="full" onClick={() => go('employees')}>Λίστα συνεργατών</A.Button>}>Ίσως διαγράφηκε ή ο σύνδεσμος είναι λάθος.</Empty></div>)}
  </>);

  return (
    <div className="shell">
      <div className="shell__nav">
        <A.SideNav size="sm" aria-label="Κύρια πλοήγηση" activeId={nav} onSelect={(id) => go(id)}
          items={[{ id: 'projects', label: 'Έργα', icon: 'business' }, { id: 'employees', label: 'Συνεργάτες', icon: 'people_outline' }, { id: 'calendar', label: 'Ωράρια', icon: 'calendar_view_month' }]} />
      </div>
      <main className="shell__main">
        <header className="crumbs card">
          {route.view === 'employee' && (
            <A.Button color="text" leadingIcon="arrow_back" onClick={goBack} className="crumbs__back">{backLabel}</A.Button>
          )}
          <nav aria-label="Διαδρομή" className="body-bold-s">
            {crumbs.map(([l, t], i) => (
              <span key={i}>{i > 0 && <span className="crumbs__sep" aria-hidden="true">|</span>}
                {t ? <a href={'#' + t} className="link">{l}</a> : <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>{l}</span>}</span>
            ))}
          </nav>
          <span className="crumbs__meta body-xs">
            {store.mode === 'local' && 'Προσωρινή λειτουργία: οι αλλαγές δεν αποθηκεύονται'}
            {store.mode === 'db' && store.readOnly && 'Μόνο ανάγνωση'}
          </span>
        </header>
        {body}
      </main>

      {dlg && dlg.kind === 'day' && (
        <DayEditor emps={dlg.emps} iso={dlg.iso} isoEnd={dlg.isoEnd} cells={dlg.cells} bulk={dlg.bulk} entriesFor={entriesFor} projects={projects} clients={clients} onSave={guard(api.setDays)}
          onUpdate={guard(api.updateDays)}
          onLeave={guard(async (empId, pids, fromIso) => { const e = employees.find((x) => x.id === empId); if (!e) return; await putAssignments(e, endFrom(assignmentsOf(e), pids, fromIso || todayIso())); })}
          onJoin={guard(async (empId, pids, fromIso) => { const e = employees.find((x) => x.id === empId); if (!e) return; const as = joinFrom(assignmentsOf(e), pids, fromIso || todayIso()); if (JSON.stringify(as) !== JSON.stringify(assignmentsOf(e))) await putAssignments(e, as); })}
          onClose={(saved, res) => {
            setDlg(null); if (!saved) return;
            const n = res ? res.n : 0; const undo = res && res.undo && res.undo.length ? res.undo : null;
            const sk = res ? res.skipped : 0;
            const msg = (!n ? 'Δεν χρειάστηκε καμία αλλαγή.' : (n === 1 ? 'Ενημερώθηκε 1 ημέρα' : 'Ενημερώθηκαν ' + n + ' ημέρες') + (dlg.emps.length > 1 ? ' σε ' + dlg.emps.length + ' συνεργάτες.' : '.'))
              + (sk ? (sk === 1 ? ' 1 ημέρα με υπάρχουσα καταχώριση έμεινε ως είχε.' : ' ' + sk + ' ημέρες με υπάρχουσα καταχώριση έμειναν ως είχαν.') : '');
            notify(msg, undo ? async () => {
              setToast(null);
              try { for (const u of undo) await api.setDays(u.empId, u.prev); notify('Η αλλαγή αναιρέθηκε.'); } catch (e) { notify('Η αναίρεση απέτυχε. Δοκιμάστε ξανά.'); }
            } : null);
            dlg.after && dlg.after();
          }} />
      )}
      {dlg && dlg.kind === 'move' && (
        <MoveDialog count={Object.keys(selMap).length} people={new Set(Object.values(selMap).map((x) => x.empId)).size} projects={projects} clients={clients}
          onClose={() => setDlg(null)} onMove={guard(async (pid, h) => { setDlg(null); await moveSelection(pid, h); })} />
      )}
      {dlg && dlg.kind === 'project' && (
        <ProjectForm project={dlg.project} clients={clients} employees={employees} projects={projects} onClose={() => setDlg(null)}
          onSave={guard((f, sel) => saveProject(f, sel, dlg.project))} />
      )}
      {dlg && dlg.kind === 'add' && dlg.project && (
        <AddEmployees project={dlg.project} employees={employees} projects={projects} onClose={() => setDlg(null)} onSave={guard((ids, how) => assign(dlg.project, ids, how))} />
      )}
      {dlg && dlg.kind === 'emp' && (
        <EmployeeForm employee={dlg.emp} projects={projects} clients={clients} employees={employees} onClose={() => setDlg(null)}
          onSave={guard((f) => saveEmployee(f, dlg.emp))} />
      )}
      {(toast || selOn) && (
        <div className="bottomstack">
          {toast && <div className="toast"><A.Snackbar message={toast.msg} actionLabel={toast.undo ? 'Αναίρεση' : undefined} onAction={toast.undo || undefined} layout="inline" onClose={() => setToast(null)} closeLabel="Κλείσιμο" /></div>}
          {selOn && !dlg && (() => {
            const keys = Object.values(selMap); const n = keys.length; const k = new Set(keys.map((x) => x.empId)).size;
            return (
              <div className="selbar" role="region" aria-label="Επιλογή ημερών">
                <span className="selbar__n body-s" aria-live="polite">{n ? (n === 1 ? '1 ημέρα' : n + ' ημέρες') + (k > 1 ? ' σε ' + k + ' συνεργάτες' : '') : 'Επιλέξτε κελιά'}</span>
                <div className="selbar__a">
                  <A.Button color="main" roundness="full" leadingIcon="edit" disabled={!n} onClick={editSelection}>Επεξεργασία</A.Button>
                  <A.Button color="secondary" roundness="full" leadingIcon="arrow_forward" disabled={!n} onClick={() => setDlg({ kind: 'move' })}>Μετακίνηση σε έργο</A.Button>
                  <A.Button color="outline" roundness="full" disabled={!n} onClick={() => setSelMap({})}>Καθαρισμός</A.Button>
                  <A.Button color="text" roundness="full" onClick={exitSel}>Τέλος</A.Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
