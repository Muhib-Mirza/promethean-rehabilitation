// Multi-select group of pill buttons — same visual language as
// RadioGroupField, but toggles membership in a `values` array.
export function CheckboxGroupField({
  label,
  error,
  options,
  values = [],
  onChange,
  className = "",
}) {
  function toggle(option) {
    onChange(
      values.includes(option)
        ? values.filter((v) => v !== option)
        : [...values, option]
    );
  }

  return (
    <div className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option)}
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
