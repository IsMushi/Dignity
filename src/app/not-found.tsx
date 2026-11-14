import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { WorkspaceBar } from "@/components/dashboard/workspace-bar";
import { LayoutShell } from "@/components/layout/layout-shell";
import { navItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Page not found · Dignity",
  description: "The page you asked for is not part of this workspace.",
};

const sectionHints: Record<string, string> = {
  Overview: "Sales, stock and finances at a glance",
  Sales: "Performance and payment mix",
  Inventory: "Stock alerts and activity",
  Customers: "Credit and recent transactions",
  Expenses: "Expense activity for the workspace",
};

export default function NotFound() {
  return (
    <LayoutShell>
      <WorkspaceBar />

      <div className="mt-5 max-w-[980px]">
        <section className="liquid-card p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-10">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                404 / Page not found
              </p>

              <h1 className="mt-3 text-[27px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[31px]">
                This page isn&apos;t in the workspace.
              </h1>

              <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-muted">
                The link may be old, or the page may have moved. Everything
                else is where you left it.
              </p>

              <Link
                href="/"
                className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[13px] font-semibold text-[var(--color-on-brand)] shadow-[0_14px_28px_-16px_rgba(9,65,151,0.95)] transition hover:bg-[var(--color-brand-deep)]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to overview
              </Link>
            </div>

            <nav
              aria-labelledby="not-found-destinations"
              className="border-t edge-soft pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
            >
              <h2
                id="not-found-destinations"
                className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
              >
                Where things are
              </h2>

              <ul className="mt-2">
                {navItems.map((item) => (
                  <li key={item.href} className="border-t edge-soft first:border-t-0">
                    <Link
                      href={item.href}
                      className="focus-ring glass-hover group flex items-center gap-3 rounded-xl px-3 py-2.5 transition"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border edge-strong glass-control text-brand">
                        <AppIcon name={item.icon} className="h-4 w-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium text-ink">
                          {item.label}
                        </span>
                        <span className="block truncate text-[11.5px] text-muted">
                          {sectionHints[item.label]}
                        </span>
                      </span>

                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-muted/60 transition group-hover:text-brand"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between border-t edge-soft pt-4 text-[11px] text-muted">
          <span>Dignity</span>
          <span>Page not found</span>
        </footer>
      </div>
    </LayoutShell>
  );
}
