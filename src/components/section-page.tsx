import { PageHeader } from "@/components/dashboard/page-header";
import { WorkspaceBar } from "@/components/dashboard/workspace-bar";
import { LayoutShell } from "@/components/layout/layout-shell";

/**
 * Shared shell for the section routes (Sales, Inventory, Customers, Expenses).
 * Overview keeps its own welcome header; these pages use the section name so
 * the URL, the nav highlight and the breadcrumb all agree.
 */
export function SectionPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <LayoutShell>
      <WorkspaceBar />
      <PageHeader title={title} section={title} showNewSale={false} />

      {children}

      <footer className="mt-8 flex items-center justify-between border-t edge-soft pt-4 text-[11px] text-muted">
        <span>Dignity</span>
        <span>{title}</span>
      </footer>
    </LayoutShell>
  );
}
