import { MenuIcon, BellIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Topbar({ onMenuClick }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="flex flex-1 flex-col justify-center leading-tight">
        <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Promethean Rehabilitation
        </span>
        <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
          Rehabilitation &amp; Recovery Center
        </span>
      </div>

      <ThemeToggle />

      <button
        type="button"
        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
      </button>

      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-medium text-white"
        aria-hidden="true"
      >
        A
      </div>
    </header>
  );
}
