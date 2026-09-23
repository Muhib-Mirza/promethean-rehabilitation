import { ReportsScreen } from "@/components/modules/reports/ReportsScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { SCREENS } from "@/lib/auth/screens";

export const metadata = {
  title: "Reports | Promethean Rehabilitation",
};

export default async function Page() {
  await requireScreenView(SCREENS.REPORTS);
  return <ReportsScreen />;
}
