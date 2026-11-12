import type { Metadata } from "next";
import { LowStock } from "@/components/dashboard/low-stock";
import { StatRow } from "@/components/dashboard/stat-row";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = {
  title: "Inventory · Dignity",
  description: "Stock alerts and inventory activity for the workspace.",
};

export default function InventoryPage() {
  return (
    <SectionPage title="Inventory">
      <StatRow />

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <LowStock />
        </div>
      </div>
    </SectionPage>
  );
}
