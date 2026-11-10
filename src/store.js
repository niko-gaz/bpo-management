const { useState, useEffect, useRef, useMemo } = React;

// Shared, persistent store. Uses the artifact db when the viewer grants it;
// otherwise keeps changes in memory for this visit only.
export function useStore(ym, extraMonths) {
  const monthsKey = [...new Set([ym, ...(extraMonths || [])])].sort().join(',');
  const [base, setBase] = useState({ ready: false, mode: null, clients: [], projects: [], employees: [] });
  const [entries, setEntries] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  const dbRef = useRef(null);
  const memEntries = useRef({});
  const [memTick, setMemTick] = useState(0);

  useEffect(() => {
    let alive = true; const unsubs = [];
    (async () => {
      let db = null;
      try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
      if (!alive) return;
      if (!db) { setBase((s) => ({ ...s, ready: true, mode: 'local' })); return; }
      dbRef.current = db;
      try {
        const user = await window.claude.use('user');
        const can = user && user.can ? await user.can('data.write') : null;
        if (alive && can === false) setReadOnly(true);
      } catch (e) {}
      const seen = new Set();
      ['clients', 'projects', 'employees'].forEach((name) => {
        unsubs.push(db.collection(name).onSnapshot((snap) => {
          seen.add(name);
          const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setBase((s) => ({ ...s, [name]: rows, mode: 'db', ready: seen.size >= 3 }));
        }, () => { seen.add(name); setBase((s) => ({ ...s, mode: 'db', ready: seen.size >= 3 })); }));
      });
      setBase((s) => ({ ...s, mode: 'db' }));
    })();
    return () => { alive = false; unsubs.forEach((u) => { try { u(); } catch (e) {} }); };
  }, []);

  // entries for the month on screen plus any months a chosen period reaches into
  useEffect(() => {
    if (base.mode !== 'db' || !dbRef.current) return;
    const months = monthsKey.split(',');
    let un = null;
    try {
      const q = months.length === 1 ? dbRef.current.collection('entries').where('month', '==', months[0]) : dbRef.current.collection('entries').where('month', 'in', months);
      un = q.onSnapshot((snap) => {
        const by = {}; months.forEach((mm) => { by[mm] = {}; });  // a month present here has loaded, even if empty
        snap.docs.forEach((d) => { const v = d.data(); (by[v.month] = by[v.month] || {})[v.empId] = v.days || {}; });
        setEntries(by);
      }, () => {});
    } catch (e) {}
    return () => { if (un) un(); };
  }, [monthsKey, base.mode]);

  const entriesByMonth = useMemo(() => {
    if (base.mode === 'db') return entries;
    const by = {}; Object.values(memEntries.current).forEach((v) => { (by[v.month] = by[v.month] || {})[v.empId] = v.days; });
    return by;
  }, [base.mode, entries, memTick]);
  const monthEntries = entriesByMonth[ym] || {};

  const api = useMemo(() => {
    const db = () => dbRef.current;
    const failed = (e) => { if (e && e.code === 'invalid_argument') setReadOnly(true); throw e; };
    async function put(coll, id, data) {
      const body = { ...data }; delete body.id;
      if (db()) { try { await db().collection(coll).doc(id).set(body); } catch (e) { failed(e); } return; }
      setBase((s) => { const list = s[coll].filter((x) => x.id !== id); return { ...s, [coll]: [...list, { id, ...body }] }; });
    }
    async function remove(coll, id) {
      if (db()) { try { await db().collection(coll).doc(id).delete(); } catch (e) { failed(e); } return; }
      setBase((s) => ({ ...s, [coll]: s[coll].filter((x) => x.id !== id) }));
    }
    // changes: { 'YYYY-MM-DD': override | null }  (null removes the override)
    // opts.keep: leave days that already have an entry untouched.
    // Returns the previous value of every day actually changed, for undo.
    async function setDays(empId, changes, opts) {
      const keep = !!(opts && opts.keep); const prev = {}; let skipped = 0;
      const byMonth = {};
      Object.entries(changes).forEach(([iso, v]) => { const m = iso.slice(0, 7); (byMonth[m] = byMonth[m] || {})[iso.slice(8)] = v; });
      for (const [month, ch] of Object.entries(byMonth)) {
        const docId = empId + '_' + month;
        let days = {};
        const ref = db() ? db().collection('entries').doc(docId) : null;
        if (ref) { try { const snap = await ref.get(); if (snap.exists) days = { ...(snap.data().days || {}) }; } catch (e) {} }
        else { const cur = memEntries.current[docId]; days = { ...((cur && cur.days) || {}) }; }
        let changed = false;
        Object.entries(ch).forEach(([d, v]) => {
          if (keep && days[d]) { skipped++; return; }
          if (!v && !days[d]) return;
          prev[month + '-' + d] = days[d] || null; changed = true;
          if (v) days[d] = v; else delete days[d];
        });
        if (!changed) continue;
        if (ref) { try { await ref.set({ empId, month, days }); } catch (e) { failed(e); } }
        else memEntries.current[docId] = { empId, month, days };
      }
      if (!db()) setMemTick((t) => t + 1);
      return { prev, skipped };
    }
    // read-modify-write of single days: fn(currentOverride, iso) returns the new override, null to clear, undefined to leave as is
    async function updateDays(empId, isos, fn) {
      const prev = {}; const byMonth = {};
      isos.forEach((iso) => { (byMonth[iso.slice(0, 7)] = byMonth[iso.slice(0, 7)] || []).push(iso); });
      for (const [month, list] of Object.entries(byMonth)) {
        const docId = empId + '_' + month; let days = {};
        const ref = db() ? db().collection('entries').doc(docId) : null;
        if (ref) { try { const snap = await ref.get(); if (snap.exists) days = { ...(snap.data().days || {}) }; } catch (e) {} }
        else { const cur = memEntries.current[docId]; days = { ...((cur && cur.days) || {}) }; }
        let changed = false;
        list.forEach((iso) => {
          const d = iso.slice(8); const next = fn(days[d] || null, iso);
          if (next === undefined || (next === null && !days[d])) return;   // nothing to write
          prev[iso] = days[d] || null; changed = true;
          if (next) days[d] = next; else delete days[d];
        });
        if (!changed) continue;
        if (ref) { try { await ref.set({ empId, month, days }); } catch (e) { failed(e); } }
        else memEntries.current[docId] = { empId, month, days };
      }
      if (!db()) setMemTick((t) => t + 1);
      return { prev };
    }
    return { put, remove, setDays, updateDays };
  }, []);

  return { ...base, entries: monthEntries, entriesByMonth, readOnly, api };
}
