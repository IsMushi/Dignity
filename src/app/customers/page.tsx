import type { Metadata } from "next";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = {
  title: "Customers · Dignity",
  description: "Customer credit and recent customer transactions.",
};

export default function CustomersPage() {
  return (
    <SectionPage title="Customers">
      <KpiCards />

      <div className="mt-4">
        <RecentSales />
      </div>
    </SectionPage>
  );
}
