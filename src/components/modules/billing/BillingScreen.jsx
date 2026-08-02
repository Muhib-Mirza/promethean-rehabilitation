import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CreditCardIcon } from "@/components/icons";

export function BillingScreen() {
  return (
    <div>
      <PageHeader
        title="Billing"
        description="Track invoices, payments, and insurance claims."
      />
      <EmptyState
        icon={CreditCardIcon}
        title="No billing records yet"
        description="Invoices and payments will appear here once the billing module is connected."
      />
    </div>
  );
}
