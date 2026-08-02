export function SelectField({
  label,
  error,
  required,
  options,
  placeholder = "Select...",
  className = "",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <select
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none dark:bg-zinc-900 dark:text-zinc-50 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-zinc-300 focus:border-teal-500 dark:border-zinc-700"
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      )}
    </label>
  );
}
