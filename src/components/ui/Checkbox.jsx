export function Checkbox({ label, className = "", ...props }) {
  return (
    <label className={`flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-900"
        {...props}
      />
      {label}
    </label>
  );
}
