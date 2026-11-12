import type { Metadata } from "next";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { PaymentMix } from "@/components/dashboard/payment-mix";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = {
  title: "Sales · Dignity",
  description: "Sales performance, payment mix and recent transactions.",
};

export default function SalesPage() {
  return (
    <SectionPage title="Sales">
      <KpiCards />

      <div className="mt-4 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <SalesChart />
        </div>
        <div className="xl:col-span-4">
          <PaymentMix />
        </div>
      </div>

      <div className="mt-4">
        <RecentSales />
      </div>
    </SectionPage>
  );
}
