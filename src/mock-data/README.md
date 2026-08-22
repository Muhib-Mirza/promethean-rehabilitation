# Demo-data fallback

This folder exists **only** because the app is deployed (e.g. to Vercel) without a
live database yet. When any Prisma call fails to reach the database, the app
falls back to the two sample patients defined here instead of crashing, and
shows a "Demo data" banner so it's clear it isn't live data. Writes
(add/edit/delete/save) are not persisted in this mode — the API returns a
friendly "demo mode" error instead of pretending to save.

## Once your real database is live

Delete this whole `src/mock-data/` folder, then remove the fallback code at
each of these call sites (each one is marked with a `DEMO-DATA FALLBACK`
comment, so they're easy to find with a project-wide search for that string):

- `src/app/(dashboard)/patients/page.jsx` — remove the `try/catch` around the
  `prisma.patient.findMany()` call and the `MOCK_PATIENTS` import; go back to
  a plain `await`.
- `src/app/(dashboard)/patients/[id]/page.jsx` — same, for
  `prisma.patient.findUnique()`.
- `src/components/modules/patients/PatientsScreen.jsx` — remove the
  `isMockData` prop and the `<DemoModeBanner />` render.
- `src/components/modules/patients/PrescriptionScreen.jsx` — same.
- `src/app/api/patients/route.js` — remove the `isDbConnectionError` branches
  in `GET` and `POST`.
- `src/app/api/patients/[id]/route.js` — remove the `isDbConnectionError`
  branch in `PUT`, `PATCH`, and `DELETE`.
- `src/app/api/patients/[id]/prescription/route.js` — remove the
  `isDbConnectionError` branch in `PUT`.

Search for `DEMO-DATA FALLBACK` across the repo to find every one of these
spots at once.

## Not part of the fallback (safe to keep)

While wiring this up, `PatientFormModal.jsx` and `BodyChartModal.jsx` were
fixed to actually display the server's error message (`result.errors.form`)
instead of a hardcoded generic string — that's what makes the "demo mode"
message visible to the user, but it's a genuine bug fix independent of demo
mode, not tied to `src/mock-data/`. No need to revert those.

## Sample patients

Two patients (`Ayesha Siddiqui`, id `900001`, and `Bilal Ahmed`, id `900002`)
with full patient info, a complaint, an examination, and body chart markings
— see `patients.js`.
