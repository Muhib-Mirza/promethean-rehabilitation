import { ProgramsScreen } from "@/components/modules/programs/ProgramsScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { SCREENS } from "@/lib/auth/screens";

export const metadata = {
  title: "Treatment Programs | Promethean Rehabilitation",
};

export default async function Page() {
  await requireScreenView(SCREENS.PROGRAMS);
  return <ProgramsScreen />;
}
