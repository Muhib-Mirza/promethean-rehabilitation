import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  UsersIcon,
  CalendarIcon,
  UserCheckIcon,
  ActivityIcon,
} from "@/components/icons";

const stats = [
  { label: "Total Patients", value: "0", icon: UsersIcon },
  { label: "Today's Appointments", value: "0", icon: CalendarIcon },
  { label: "On-duty Therapists", value: "0", icon: UserCheckIcon },
  { label: "Active Programs", value: "0", icon: ActivityIcon },
];

export function DashboardOverview() {
  return (
    <div>
      <PageHeader
        title="Welcome back"
        description="Here's what's happening across Promethean Rehabilitation today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
