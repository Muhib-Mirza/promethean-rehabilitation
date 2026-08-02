import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarIcon } from "@/components/icons";

export function AppointmentsScreen() {
  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Schedule and track patient sessions across all therapists."
      />
      <EmptyState
        icon={CalendarIcon}
        title="No appointments scheduled"
        description="Upcoming sessions will appear here once the scheduling module is connected."
      />
    </div>
  );
}
