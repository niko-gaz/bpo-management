# Ambience BPO: Έργα, Συνεργάτες, Ωράρια

Εφαρμογή για τη Διεύθυνση Υπηρεσιών: διαχείριση έργων ανά πελάτη, συνεργατών, ωραρίων, τηλεργασίας, υπερωριών και αδειών. Αντικαθιστά τα αρχεία Excel. 
## Περιεχόμενα

| Φάκελος / αρχείο | Τι είναι |
|---|---|
| `src/` | Ο πηγαίος κώδικας (React, JSX) |
| `src/core.js` | Λογική: ωράρια, αναθέσεις με περιόδους, ιστορικό ωραρίου, αργίες, μορφοποίηση |
| `src/store.js` | Ανάγνωση / αποθήκευση δεδομένων (artifact database, ή μνήμη αν δεν υπάρχει) |
| `src/main.jsx` | Πλοήγηση, breadcrumbs, επιλογή κελιών, «Μετακίνηση σε έργο» |
| `src/projects.jsx` | Οθόνη Έργα (πίνακας έργου, σύνολα περιόδου, υπερωρίες και απουσίες) |
| `src/employees.jsx` | Λίστα συνεργατών και καρτέλα συνεργάτη με ατομικό ημερολόγιο |
| `src/calendar.jsx` | Οθόνη Ωράρια (μαζικό ημερολόγιο, «Προς κατανομή», εξαγωγή CSV) |
| `src/modals.jsx` | Παράθυρα: ημέρα / εύρος / επιλογή, έργο, συνεργάτης, προσθήκη, μετακίνηση |
| `src/ui.jsx` | Κοινά στοιχεία: πίνακας προγράμματος, πεδίο ημερομηνίας ΗΗ/ΜΜ/ΕΕΕΕ, υπόμνημα |
| `src/app.css` | Εμφάνιση (μόνο tokens του Design Kit) |
| `vendor/aambience-design-kit/` | Τα αρχεία του Design Kit που χρησιμοποιεί η εφαρμογή (tokens, components) |
| `build.py`, `package.json` | Build: ενώνει κώδικα και Design Kit σε ένα αρχείο HTML |
| `dist/bpo.html` | Η έτοιμη εφαρμογή, ίδια με τη δημοσιευμένη |
| `data/database-snapshot.xlsx` | Αντίγραφο όλων των δεδομένων της βάσης σε Excel |
| `data/database-snapshot.json` | Το ίδιο αντίγραφο σε JSON (όλες οι συλλογές σε ένα αρχείο) |
| `data/db/` | Το ίδιο αντίγραφο, ένα αρχείο ανά εγγραφή (clients, projects, employees, entries) |
| `seed/` | Τα δεδομένα επίδειξης και το script που τα δημιούργησε |
| `tests/fake.js` | Βάση στη μνήμη για τοπική δοκιμή |

## Build

Χρειάζονται Node.js και Python 3.

```bash
npm install            # esbuild, react, react-dom
python3 build.py       # -> dist/bpo.html
python3 build.py --seed  # -> επιπλέον dist/test.html, με τα δεδομένα επίδειξης
```

`dist/bpo.html` είναι ένα αυτόνομο αρχείο. Φορτώνει μόνο το React (cdnjs) και τη γραμματοσειρά IBM Plex Sans (Google Fonts).

`dist/test.html` ανοίγει τοπικά στον browser με τα δεδομένα επίδειξης, χωρίς σύνδεση στη βάση. Οι αλλαγές δεν αποθηκεύονται.

## Δεδομένα

Η δημοσιευμένη εφαρμογή αποθηκεύει τα δεδομένα στην ενσωματωμένη βάση του artifact στο claude.ai, σε τέσσερις συλλογές:

- `clients`: `{ name }`
- `projects`: `{ clientId, name, supervisor, workdays, weekendDays, billing, budgetPlan, budget, rate, workplace, location }`
- `employees`: `{ code, last, first, ..., schedule, remote[7], schedules[{from, schedule, remote}], assignments[{projectId, mode, hours, days[7], from, to}] }`
  - `mode`: `fixed` (σταθερές ώρες), `rest` (υπόλοιπο βάρδιας, κύριο έργο), `none` (χωρίς σταθερές ώρες)
- `entries`: ένα έγγραφο ανά συνεργάτη ανά μήνα, `{ empId, month: 'YYYY-MM', days: { 'DD': override } }`
  - `override`: `{ shift, remote, ot, otProject, otReason, alloc: {projectId: hours}, leave }`. Αποθηκεύονται μόνο οι ημέρες που διαφέρουν από τον κανόνα.

Για μεταφορά σε βάση της εταιρείας (π.χ. SQL Server, SharePoint) αρκεί να αλλάξει το `src/store.js`. Οι υπόλοιπες οθόνες μιλούν μόνο με αυτό.

Τα δεδομένα περιέχουν προσωπικά στοιχεία εργαζομένων. Χειριστείτε τα αρχεία του φακέλου `data/` σύμφωνα με την πολιτική GDPR της εταιρείας.
