import json, random, unicodedata, re
random.seed(7)
clients = {
 'c_dixons':'DIXONS','c_ab':'AB','c_wattvolt':'WATT & VOLT','c_praktiker':'Praktiker','c_volton':'VOLTON',
 'c_zisimatos':'Zisimatos Management','c_fysiko':'ΦΥΣΙΚΟ ΑΕΡΙΟ','c_ete':'ΕΤΕ','c_alpha':'ALPHA BANK','c_nexi':'NEXI',
}
SUP=['ΔΡΑΚΟΥ ΔΗΜΗΤΡΑ','ΛΥΜΠΕΡΟΠΟΥΛΟΣ ΓΙΩΡΓΟΣ','ΛΑΒΔΑΣ / ΠΑΥΛΑΚΗΣ / ΠΕΤΡΟΠΟΥΛΟΥ','ΛΟΥΚΟΠΟΥΛΟΥ ΜΑΡΙΑ','ΠΑΠΑΔΟΓΚΩΝΑΣ ΗΛΙΑΣ','ΠΙΤΣΙΚΟΥΛΗΣ ΜΙΧΑΛΗΣ','ΣΤΙΒΑΧΤΗΣ ΓΙΩΡΓΟΣ']
LOC=['Αναξαγόρα 63 Ταύρος, 177 78','Λ. Κηφισίας 124, Μαρούσι, 151 25']
projects = [
 ('p_dx_bo','c_dixons','Back Office',SUP[0]),('p_dx_cs','c_dixons','Εξυπηρέτηση Πελατών',SUP[5]),('p_dx_ex','c_dixons','Εξοικονομώ',SUP[3]),
 ('p_dx_col','c_dixons','Collection',SUP[4]),('p_dx_ts','c_dixons','Total Support',SUP[6]),
 ('p_ab_cc','c_ab','ΑΒ CC',SUP[5]),('p_ab_cs','c_ab','Customer Support',SUP[1]),
 ('p_wv_cs','c_wattvolt','Εξυπηρέτηση Πελατών',SUP[1]),('p_pk_cc','c_praktiker','Contact Center',SUP[3]),
 ('p_vo_sales','c_volton','Πωλήσεις',SUP[2]),('p_zm_bo','c_zisimatos','Back Office',SUP[4]),('p_fa_cc','c_fysiko','Εξυπηρέτηση Πελατών',SUP[6]),
 ('p_ete_bo','c_ete','NBG BO',SUP[0]),('p_alpha_bo','c_alpha','ALPHA BANK BO',SUP[0]),('p_nexi_bo','c_nexi','NEXI BACK OFFICE',SUP[1]),
]
proj = {}
for pid,cid,name,sup in projects:
  proj[pid]=dict(clientId=cid,name=name,supervisor=sup,workdays='22',weekendDays='0',billing='Ανά ώρα',budgetPlan='1935/fte',
    budget=str(random.choice([2902.5,4850,6120,3400,9800])),rate=str(random.choice([37.5,32,35,40,28.5])),workplace=random.choice(['ΕΝΤΟΣ','ΕΝΤΟΣ','ΥΒΡΙΔΙΚΟ']),location=random.choice(LOC))
proj['p_dx_cs'].update(budget='2902.5',rate='37.5',workplace='ΕΝΤΟΣ',location=LOC[0],supervisor='ΠΙΤΣΙΚΟΥΛΗΣ ΜΙΧΑΛΗΣ')
names = """POW00482 ROSENBERG CHRISTINA|POW00663 ΑΛΑΤΕΡΟΥ ΖΑΦΕΙΡΙΑ|411 ΑΛΕΒΙΖΟΣ ΓΕΩΡΓΙΟΣ|219 ΑΛΤΟΓΛΟΥ ΓΕΩΡΓΙΟΣ|POW00617 ΑΝΔΡΙΟΠΟΥΛΟΥ ΑΓΓΕΛΙΚΗ|POW00612 ΑΝΤΩΝΑΚΟΠΟΥΛΟΥ ΓΕΩΡΓΙΑ|POW00495 ΑΝΤΩΝΙΟΥ ΑΝΔΡΙΑΝΝΑ|442 ΑΡΓΥΡΙΑΔΗ ΗΛΙΑΝΑ|POW00545 ΑΥΓΟΥΣΤΗΣ ΙΩΑΝΝΗΣ|POW00597 ΑΧΜΕΤΗ ΑΓΓΕΛΑ|POW00511 ΧΕΙΛΑΚΗ ΕΜΜΑΝΟΥΕΛΑ|POW00514 ΤΑΜΒΑΚΙΔΟΥ ΜΑΡΙΑ|POW00512 ΣΙΚΟΛΑ ΒΑΣΙΛΙΚΗ|POW00510 ΠΕΤΡΟΥΤΣΟΣ ΑΝΤΩΝΙΟΣ|POW00513 ΚΕΡΑΝΟΠΟΥΛΟΥ ΣΤΥΛΙΑΝΗ|POW00530 ΤΡΕΒΟΓΚΑ ΑΝΑΣΤΑΣΙΑ|POW00542 ΤΑΚΑΝΙΚΟΥ ΕΥΔΟΞΙΑ|POW00692 ΙΑΤΡΟΥ ΕΥΑΓΓΕΛΙΑ|POW00519 ΚΥΡΙΑΚΟΥΛΑΚΟΥ ΜΑΡΚΕΛΛΑ|311 ΠΑΝΑΓΙΩΤΑΚΗΣ ΜΙΧΑΛΗΣ|399 ΣΙΤΑΡΙΔΗ ΓΑΛΑΤΕΙΑ|313 ΠΑΠΑΙΩΑΝΝΟΥ ΙΩΑΝΝΗΣ|438 ΣΤΙΒΑΧΤΗΣ ΓΕΩΡΓΙΟΣ|469 ΠΑΝΑΓΙΩΤΑΡΑΣ ΧΑΡΑΛΑΜΠΟΣ|474 ΠΟΡΦΥΡΗ ΕΥΑΓΓΕΛΙΑ|POW00524 ΔΙΩΤΗ ΒΑΣΙΛΙΚΗ|POW00610 ΣΤΑΜΑΤΟΥΚΟΣ ΒΑΣΙΛΕΙΟΣ|POW00615 ΨΥΛΛΙΝΑΚΗΣ ΕΜΜΑΝΟΥΗΛ|POW00660 ΜΑΡΙΝΟΣ ΕΥΣΤΡΑΤΙΟΣ|POW00639 ΝΙΚΛΑΝ ΒΑΣΙΛΕΙΟΣ|POW00669 ΠΑΠΠΑ ΚΩΝΣΤΑΝΤΙΝΑ|POW00671 ΜΟΥΖΑΚΗΣ ΔΗΜΗΤΡΙΟΣ|POW00680 ΣΤΑΜΙΡΗΣ ΓΕΩΡΓΙΟΣ|POW00506 ΚΟΝΤΑΞΗ ΔΑΝΑΗ|POW00665 ΓΚΙΝΗ ΜΑΓΔΑΛΗΝΗ|POW00683 ΦΑΣΟΥΛΑΣ ΣΩΤΗΡΙΟΣ|POW00685 ΧΡΟΝΟΠΟΥΛΟΣ ΑΛΕΞΑΝΔΡΟΣ|POW00687 ΚΑΛΤΣΑ ΣΠΥΡΙΔΟΥΛΑ|POW00688 ΚΙΤΖΟΓΛΟΥ ΕΥΦΡΟΣΥΝΗ|POW00689 ΒΑΡΕΛΤΖΗΣ ΔΗΜΗΤΡΙΟΣ|POW00686 ΜΥΛΩΝΑΚΗΣ ΙΩΑΝΝΗΣ|POW00690 ΜΠΑΚΑΣ ΔΗΜΗΤΡΙΟΣ|POW00618 ΜΑΝΟΥΣΚΟΣ ΙΩΑΝΝΗΣ|345 ΣΤΑΥΡΟΠΟΥΛΟΥ ΔΗΜΗΤΡΑ|POW00651 ΜΟΝΙΟΥ ΝΙΚΟΛΕΤΑ|POW00456 ΓΚΙΝΗΣ ΠΑΝΑΓΙΩΤΗΣ|POW00576 ΤΣΑΛΤΑΣ ΝΙΚΟΛΑΟΣ|POW00536 ΔΗΜΗΤΡΟΠΟΥΛΟΥ ΔΙΟΝΥΣΙΑ|POW00538 ΜΑΡΑΓΚΟΥΔΑΚΗΣ ΓΕΩΡΓΙΟΣ|POW00550 ΣΟΥΤΑ ΕΦΡΑΙΜΙΑ|POW00581 ΓΟΥΛΗ ΣΟΦΙΑ|POW00582 ΒΟΓΙΑΤΖΗ ΒΑΛΙΑ|POW00633 ΓΡΙΝΤΖΟΥ ΔΑΝΑΗ|POW00644 ΛΟΥΚΑΣ ΗΛΙΑΣ|POW00643 ΦΩΤΙΑΔΟΥ ΜΑΡΙΑ|POW00662 ΚΟΤΣΩΝΑ ΓΕΩΡΓΙΑ|POW00418 ΠΡΟΚΟΠΙΟΥ ΘΩΜΑΣ|POW00625 ΜΠΑΜΠΟΥ ΠΑΝΑΓΙΩΤΑ|POW00666 ΒΕΝΤΟΥΡΗΣ ΘΕΟΦΑΝΗΣ|POW00572 ΤΣΙΛΟΠΟΥΛΟΥ ΝΙΚΟΛΕΤΤΑ""".split('|')
def latin(s):
  m={'Α':'a','Β':'v','Γ':'g','Δ':'d','Ε':'e','Ζ':'z','Η':'i','Θ':'th','Ι':'i','Κ':'k','Λ':'l','Μ':'m','Ν':'n','Ξ':'x','Ο':'o','Π':'p','Ρ':'r','Σ':'s','Τ':'t','Υ':'y','Φ':'f','Χ':'ch','Ψ':'ps','Ω':'o'}
  return ''.join(m.get(c,c.lower()) for c in s)
# distribution: dixons cs gets 10
plist=[p[0] for p in projects]
assign = ['p_dx_cs']*10 + ['p_dx_bo']*5 + ['p_dx_ts']*5 + ['p_ab_cc']*5 + ['p_ab_cs']*4 + ['p_alpha_bo']*4 + ['p_ete_bo']*4 + ['p_nexi_bo']*3 + ['p_wv_cs']*4 + ['p_pk_cc']*3 + ['p_vo_sales']*3 + ['p_dx_col']*3 + ['p_fa_cc']*3 + ['p_zm_bo']*2 + ['p_dx_ex']*2 + ['p_dx_cs']*4
DEP=['Τμήμα Εξυπηρέτησης Πελατών','Τμήμα Υποστηρικτικών Εργασιών','Τμήμα Πωλήσεων','Τμήμα Είσπραξης Οφειλών']
emps={}
for i,line in enumerate(names):
  code,last,first=line.split(' ',2)
  pid=assign[i]; p=proj[pid]
  bo = 'BO' in p['name'] or 'Back' in p['name'] or 'BACK' in p['name']
  dep = DEP[1] if bo else DEP[3] if 'Collection' in p['name'] else DEP[2] if 'Πωλήσεις' in p['name'] else DEP[0]
  pos = 'Υπάλληλος Υποστηρικτικών Εργασιών' if bo else 'Εκπρόσωπος Πωλήσεων' if dep==DEP[2] else 'Εκπρόσωπος Εξυπηρέτησης Πελατών'
  if i in (3,): pos='Προϊστάμενος Εξυπηρέτησης Πελατών'
  rd=[False]*6; rd[random.choice([0,1,2,3,4])]=True
  if random.random()<0.3: rd[random.choice([0,1,2,3,4])]=True
  emps['e_%03d'%(i+1)]=dict(code=code,last=last,first=first,direction='Διεύθυνση Υπηρεσιών',department=dep,branch=random.choice(['Ταύρος','Ταύρος','Μαρούσι']),
    position=pos,projectId=pid,supervisor=p['supervisor'],schedule=random.choice(['09-17','09-17','08-16','10-18','13-21']),remote=rd,
    hireDate=random.choice(['2021-03-01','2022-08-31','2023-01-16','2024-05-06','2019-10-01']),leaveDate='',contractTerm=random.choice(['Αορίστου χρόνου','Ορισμένου χρόνου']),
    contractHours='8',email=latin(first.split()[0])+'.'+latin(last)+'@ambience.gr',phone='69'+str(random.randint(10000000,99999999)),location=random.choice(['Ταύρος, 177 78','Καλλιθέα, 176 71','Νέα Σμύρνη, 171 21','Μαρούσι, 151 25']))
emps['e_009']['leaveDate']='2026-10-16'   # left mid-month (grey cells)
emps['e_010']['hireDate']='2026-10-05'
# entries Oct 2026 + Nov 2026 overrides
import datetime
def wd(y,m):
  d=datetime.date(y,m,1); out=[]
  while d.month==m:
    if d.weekday()<5 and d.isoformat() not in ('2026-10-28',): out.append(d)
    d+=datetime.timedelta(days=1)
  return out
entries={}
def setd(eid,date,ov):
  k=eid+'_'+date.strftime('%Y-%m'); e=entries.setdefault(k,dict(empId=eid,month=date.strftime('%Y-%m'),days={}))
  e['days'][date.strftime('%d')]=ov
for y,m in ((2026,10),(2026,11)):
  days=wd(y,m)
  for eid,e in emps.items():
    if random.random()<0.35:
      for d in random.sample(days,random.randint(1,3)):
        setd(eid,d,dict(shift=e['schedule'],remote=random.random()<0.4,ot=random.choice([1,2,2,3]),otReason=random.choice(['Αυξημένος όγκος κλήσεων','Κάλυψη απουσίας','Εκκαθάριση εκκρεμοτήτων'])))
    if random.random()<0.18:
      s=random.randint(0,len(days)-5); t=random.choice(['A','A','A','AS','EA'])
      for d in days[s:s+random.randint(1,4)]: setd(eid,d,dict(leave=t))
# figma-like: ΑΧΜΕΤΗ leave Tue-Fri of a week
for d in wd(2026,10)[11:15]: setd('e_010',d,dict(leave='A'))
json.dump(dict(clients={k:{'name':v} for k,v in clients.items()},projects=proj,employees=emps,entries=entries),open('seed/seed.json','w'),ensure_ascii=False,indent=1)
print(len(emps),len(proj),len(entries))

# ---- multi-project assignments ----
random.seed(11)
d=json.load(open('seed/seed.json'))
E_,P_=d['employees'],d['projects']
def cap(e): a,b=map(int,e['schedule'].split('-')); return b-a
splits={'e_003':('p_ab_cc',2),'e_005':('p_dx_ts',4),'e_012':('p_dx_cs',3),'e_020':('p_dx_cs',4),'e_024':('p_alpha_bo',2),
        'e_031':('p_nexi_bo',4),'e_036':('p_wv_cs',2),'e_041':('p_dx_col',3),'e_047':('p_fa_cc',4),'e_052':('p_dx_cs',2)}
for eid,e in E_.items():
  pid=e.pop('projectId'); c=cap(e)
  if eid in splits and splits[eid][0]!=pid:
    op,h=splits[eid]; e['assignments']=[{'projectId':pid,'hours':c-h},{'projectId':op,'hours':h}]
  else: e['assignments']=[{'projectId':pid,'hours':c}]
for k,v in d['entries'].items():
  e=E_[v['empId']]
  for dd,ov in v['days'].items():
    if ov.get('ot'): ov['otProject']=random.choice(e['assignments'])['projectId']
# a couple of day-specific reallocations for split staff
for eid,day in (('e_012','2026-10-22'),('e_020','2026-10-23'),('e_005','2026-10-26')):
  e=E_[eid]; a=e['assignments']; c=cap(e)
  key=eid+'_'+day[:7]; ent=d['entries'].setdefault(key,{'empId':eid,'month':day[:7],'days':{}})
  ent['days'][day[8:]]={'shift':e['schedule'],'remote':False,'ot':0,'otReason':'','alloc':{a[0]['projectId']:c-6,a[1]['projectId']:6}}
json.dump(d,open('seed/seed.json','w'),ensure_ascii=False,indent=1)
print('splits',sum(len(e['assignments'])>1 for e in E_.values()),len(d['entries']))
