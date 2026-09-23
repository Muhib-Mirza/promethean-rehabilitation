import { AppointmentsScreen } from "@/components/modules/appointments/AppointmentsScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { SCREENS } from "@/lib/auth/screens";

export const metadata = {
  title: "Appointments | Promethean Rehabilitation",
};

export default async function Page() {
  await requireScreenView(SCREENS.APPOINTMENTS);
  return <AppointmentsScreen />;
}
