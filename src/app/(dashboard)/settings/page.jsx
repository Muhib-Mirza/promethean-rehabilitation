import { SettingsScreen } from "@/components/modules/settings/SettingsScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { SCREENS } from "@/lib/auth/screens";

export const metadata = {
  title: "Settings | Promethean Rehabilitation",
};

export default async function Page() {
  await requireScreenView(SCREENS.SETTINGS);
  return <SettingsScreen />;
}
