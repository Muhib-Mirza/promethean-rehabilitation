import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DashboardLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <DashboardShell currentYear={currentYear}>{children}</DashboardShell>
  );
}
