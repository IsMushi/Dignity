import type { Metadata } from "next";
import { StatRow } from "@/components/dashboard/stat-row";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = {
  title: "Expenses · Dignity",
  description: "Expense activity and quick actions for the workspace.",
};

export default function ExpensesPage() {
  return (
    <SectionPage title="Expenses">
      <StatRow />
    </SectionPage>
  );
}
