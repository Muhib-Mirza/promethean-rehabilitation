import { BillingScreen } from "@/components/modules/billing/BillingScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { SCREENS } from "@/lib/auth/screens";

export const metadata = {
  title: "Billing | Promethean Rehabilitation",
};

export default async function Page() {
  await requireScreenView(SCREENS.BILLING);
  return <BillingScreen />;
}
