"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation";
import { HospitalIcon, XIcon } from "@/components/icons";
import { isSuperAdmin } from "@/lib/auth/roles";
import { ACTIONS } from "@/lib/auth/screens";
import { canAccess } from "@/lib/auth/permissionSet";

export function Sidebar({ open, onClose, currentYear, user, permissions }) {
  const pathname = usePathname();
  const visibleNavigation = navigation.filter((item) => {
    if (item.superadminOnly) return isSuperAdmin(user);
    if (item.screenCode) return canAccess(permissions, item.screenCode, ACTIONS.VIEW);
    return true;
  });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 px-6 dark:border-zinc-800">
          <HospitalIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <span className="truncate text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-50">
            Promethean Rehabilitation
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 lg:hidden"
            aria-label="Close menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleNavigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-zinc-200 px-6 py-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          © {currentYear} Promethean Rehabilitation
        </div>
      </aside>
    </>
  );
}
