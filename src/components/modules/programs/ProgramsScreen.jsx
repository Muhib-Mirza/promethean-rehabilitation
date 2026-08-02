import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActivityIcon } from "@/components/icons";

export function ProgramsScreen() {
  return (
    <div>
      <PageHeader
        title="Treatment Programs"
        description="Define and monitor rehabilitation plans and their progress."
      />
      <EmptyState
        icon={ActivityIcon}
        title="No treatment programs yet"
        description="Rehabilitation programs will appear here once the programs module is connected."
      />
    </div>
  );
}
