import {
  LayoutGridIcon,
  UsersIcon,
  CalendarIcon,
  UserCheckIcon,
  ActivityIcon,
  CreditCardIcon,
  BarChartIcon,
  SettingsIcon,
  ShieldIcon,
} from "@/components/icons";
import { SCREENS } from "@/lib/auth/screens";

// `screenCode` items are gated by the Role/RolePermission rights matrix
// (src/lib/auth/permissions.js) — see the "view" action per screen.
// `superadminOnly` items are a fixed capability, not delegable through
// roles (see src/lib/auth/roles.js).
export const navigation = [
  { label: "Overview", href: "/", icon: LayoutGridIcon },
  { label: "Patients", href: "/patients", icon: UsersIcon, screenCode: SCREENS.PATIENTS },
  { label: "Appointments", href: "/appointments", icon: CalendarIcon, screenCode: SCREENS.APPOINTMENTS },
  { label: "Therapists", href: "/therapists", icon: UserCheckIcon, screenCode: SCREENS.THERAPISTS },
  { label: "Treatment Programs", href: "/programs", icon: ActivityIcon, screenCode: SCREENS.PROGRAMS },
  { label: "Billing", href: "/billing", icon: CreditCardIcon, screenCode: SCREENS.BILLING },
  { label: "Reports", href: "/reports", icon: BarChartIcon, screenCode: SCREENS.REPORTS },
  { label: "Settings", href: "/settings", icon: SettingsIcon, screenCode: SCREENS.SETTINGS },
  // Only the super admin manages accounts and roles — see src/lib/auth.
  { label: "User Management", href: "/users", icon: ShieldIcon, superadminOnly: true },
  { label: "Roles", href: "/roles", icon: ShieldIcon, superadminOnly: true },
];
