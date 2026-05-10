# DownUnder System Architecture

```mermaid
flowchart LR
  womanUser[WomanUser] --> reactUi[ReactUI]
  reactUi --> expressApi[ExpressAPI]
  expressApi --> sqliteEngine[SQLiteEngine_sqljs]
  expressApi --> rxNavApi[RxNavAPI]
  expressApi --> openFdaApi[openFDAAPI]
  sqliteEngine --> expressApi
```

- `ReactUI` handles profile entry, birth control selection, medication management, and interaction searches.
- `ExpressAPI` centralizes profile/catalog CRUD and interaction-check orchestration.
- `SQLiteEngine_sqljs` stores local profile data, seeded birth control methods, meds catalog, and check history.
- `RxNavAPI` provides medication lookup and interaction graph data.
- `openFDAAPI` provides label-derived interaction text to improve risk classification.
