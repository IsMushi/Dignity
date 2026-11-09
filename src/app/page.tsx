import { cookies } from "next/headers";
import { BusinessProvider } from "@/components/business-provider";
import { GlassProvider } from "@/components/layout/glass-provider";
import {
  LayoutProvider,
  type LayoutMode,
} from "@/components/layout/layout-provider";
import { LayoutShell } from "@/components/layout/layout-shell";
import { BusinessApps } from "@/components/dashboard/business-apps";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { LowStock } from "@/components/dashboard/low-stock";
import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentMix } from "@/components/dashboard/payment-mix";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatRow } from "@/components/dashboard/stat-row";
import { WorkspaceBar } from "@/components/dashboard/workspace-bar";
import {
  DEFAULT_GLASS_LEVEL,
  GLASS_COOKIE,
  parseGlassLevel,
} from "@/lib/appearance";
import { defaultBusinessId, isBusinessId } from "@/lib/data";
import { BUSINESS_COOKIE, LAYOUT_COOKIE } from "@/lib/preferences";

export default async function Home() {
  const cookieStore = await cookies();
  const initialLayout: LayoutMode =
    cookieStore.get(LAYOUT_COOKIE)?.value === "sidebar" ? "sidebar" : "topbar";
  const businessCookie = cookieStore.get(BUSINESS_COOKIE)?.value;
  const initialBusinessId = isBusinessId(businessCookie)
    ? businessCookie
    : defaultBusinessId;
  const initialGlassLevel =
    parseGlassLevel(cookieStore.get(GLASS_COOKIE)?.value) ??
    DEFAULT_GLASS_LEVEL;

  return (
    <GlassProvider initialGlassLevel={initialGlassLevel}>
      <BusinessProvider initialBusinessId={initialBusinessId}>
        <LayoutProvider initialLayout={initialLayout}>
          <LayoutShell>
            <WorkspaceBar />
            <PageHeader />
            <KpiCards />
            <StatRow />

            <div className="mt-4 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <SalesChart />
              </div>
              <div className="xl:col-span-4">
                <PaymentMix />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <RecentSales />
              </div>
              <div className="xl:col-span-4">
                <LowStock />
              </div>
            </div>

            <BusinessApps />

            <footer className="mt-8 flex items-center justify-between border-t border-white/60 pt-4 text-[11px] text-muted">
              <span>Dignity</span>
              <span>RWF</span>
            </footer>
          </LayoutShell>
        </LayoutProvider>
      </BusinessProvider>
    </GlassProvider>
  );
}
