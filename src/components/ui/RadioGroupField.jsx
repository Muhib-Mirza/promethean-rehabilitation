// Single-select group of pill buttons, styled to match TextField/SelectField.
// Clicking the already-selected option clears it (paper forms leave these
// blank until a value is circled, so an empty state must stay reachable).
export function RadioGroupField({
  label,
  error,
  required,
  options,
  value,
  onChange,
  className = "",
  inline = true,
}) {
  return (
    <div className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <div className={inline ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : option)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                selected
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  );
}
