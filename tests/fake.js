// In-memory stand-in for the artifact database, used by dist/test.html (python3 build.py --seed).
(function(){
  const S=window.__SEED; const store={};
  ['clients','projects','employees','entries'].forEach(c=>{store[c]={}; Object.entries(S[c]||{}).forEach(([k,v])=>store[c][k]=JSON.parse(JSON.stringify(v)));});
  const subs=[];
  const snap=(c,id)=>({id,exists:!!store[c][id],data:()=>store[c][id],metadata:{}});
  const q=(c,filt)=>({where:(f,op,v)=>q(c,{f,op,v}),onSnapshot:(n)=>{const s={c,filt,n};subs.push(s);setTimeout(()=>fire(s),50);return()=>{}},get:async()=>qs(c,filt)});
  const qs=(c,filt)=>{const docs=Object.keys(store[c]).filter(id=>!filt||(filt.op==='in'?filt.v.includes(store[c][id][filt.f]):store[c][id][filt.f]===filt.v)).map(id=>snap(c,id));return {docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{}}};
  const fire=(s)=>s.n(qs(s.c,s.filt));
  const db={collection:(c)=>Object.assign(q(c,null),{doc:(id)=>({get:async()=>snap(c,id),set:async(d)=>{store[c][id]=JSON.parse(JSON.stringify(d));subs.filter(s=>s.c===c).forEach(fire)},delete:async()=>{delete store[c][id];subs.filter(s=>s.c===c).forEach(fire)}})})};
  window.claude={use:async(n)=>n==='db'?db:n==='user'?{can:async()=>true}:null};
})();
