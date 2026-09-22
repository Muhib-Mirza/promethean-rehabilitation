"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuIcon, BellIcon, LogOutIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { isSuperAdmin } from "@/lib/auth/roles";

export function Topbar({ onMenuClick, user }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "?";

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

      <div className="flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-800">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-medium text-white"
          title={user?.username}
        >
          {initial}
        </div>
        <div className="hidden leading-tight sm:flex sm:flex-col">
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {user?.username ?? "Signed out"}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {isSuperAdmin(user) ? "Super Admin" : "Staff"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Log out"
          title="Log out"
          className="text-zinc-500 hover:text-zinc-900 disabled:opacity-50 dark:hover:text-zinc-50"
        >
          <LogOutIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
