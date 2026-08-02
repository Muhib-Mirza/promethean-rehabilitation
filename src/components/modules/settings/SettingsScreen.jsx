import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SettingsIcon } from "@/components/icons";

export function SettingsScreen() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure hospital details, staff roles, and system preferences."
      />
      <EmptyState
        icon={SettingsIcon}
        title="No settings configured"
        description="Hospital and system configuration will appear here once the settings module is connected."
      />
    </div>
  );
}
