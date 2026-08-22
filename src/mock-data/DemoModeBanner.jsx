// Shown on pages that fell back to mock data because the real database
// couldn't be reached. Purely visual — delete along with this folder once a
// real database is connected (see README.md).
export function DemoModeBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
      <span aria-hidden="true">⚠️</span>
      <p>
        <span className="font-medium">Demo data</span> — the database isn&apos;t connected, so
        you&apos;re viewing sample patients. Changes won&apos;t be saved.
      </p>
    </div>
  );
}
