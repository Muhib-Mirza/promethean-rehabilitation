"use client";

export function Tabs({ tabs, activeKey, onChange, className = "" }) {
  return (
    <div
      role="tablist"
      className={`flex gap-1 border-b border-zinc-200 dark:border-zinc-800 ${className}`}
    >
      {tabs.map((tab) => {
        const selected = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              selected
                ? "border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
