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

export const navigation = [
  { label: "Overview", href: "/", icon: LayoutGridIcon },
  { label: "Patients", href: "/patients", icon: UsersIcon },
  { label: "Appointments", href: "/appointments", icon: CalendarIcon },
  { label: "Therapists", href: "/therapists", icon: UserCheckIcon },
  { label: "Treatment Programs", href: "/programs", icon: ActivityIcon },
  { label: "Billing", href: "/billing", icon: CreditCardIcon },
  { label: "Reports", href: "/reports", icon: BarChartIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
  // Only the super admin manages accounts — see src/lib/auth.
  { label: "User Management", href: "/users", icon: ShieldIcon, superadminOnly: true },
];
