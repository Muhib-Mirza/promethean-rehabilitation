import { TherapistsScreen } from "@/components/modules/therapists/TherapistsScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { SCREENS } from "@/lib/auth/screens";

export const metadata = {
  title: "Therapists | Promethean Rehabilitation",
};

export default async function Page() {
  await requireScreenView(SCREENS.THERAPISTS);
  return <TherapistsScreen />;
}
