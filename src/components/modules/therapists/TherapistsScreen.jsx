import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserCheckIcon } from "@/components/icons";

export function TherapistsScreen() {
  return (
    <div>
      <PageHeader
        title="Therapists"
        description="View staff availability, specialties, and caseloads."
      />
      <EmptyState
        icon={UserCheckIcon}
        title="No therapists yet"
        description="Staff profiles will appear here once the therapist module is connected."
      />
    </div>
  );
}
