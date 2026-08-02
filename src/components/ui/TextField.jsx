export function TextField({
  label,
  error,
  required,
  className = "",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:bg-zinc-900 dark:text-zinc-50 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-zinc-300 focus:border-teal-500 dark:border-zinc-700"
        }`}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      )}
    </label>
  );
}
