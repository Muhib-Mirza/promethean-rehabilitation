import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChartIcon } from "@/components/icons";

export function ReportsScreen() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Analyze patient outcomes, occupancy, and operational metrics."
      />
      <EmptyState
        icon={BarChartIcon}
        title="No reports yet"
        description="Analytics and reports will appear here once the reporting module is connected."
      />
    </div>
  );
}
