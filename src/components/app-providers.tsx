import { BusinessProvider } from "@/components/business-provider";
import { GlassProvider } from "@/components/layout/glass-provider";
import {
  LayoutProvider,
  type LayoutMode,
} from "@/components/layout/layout-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import type { BusinessId } from "@/lib/data";
import type { Theme } from "@/lib/theme";

/**
 * One composition point for the four persisted preferences, mounted in the
 * root layout so the Overview and Appearance routes read the same state.
 */
export function AppProviders({
  children,
  initialGlassLevel,
  initialBusinessId,
  initialLayout,
  initialTheme,
}: {
  children: React.ReactNode;
  initialGlassLevel: number;
  initialBusinessId: BusinessId;
  initialLayout: LayoutMode;
  initialTheme: Theme;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <GlassProvider initialGlassLevel={initialGlassLevel}>
        <BusinessProvider initialBusinessId={initialBusinessId}>
          <LayoutProvider initialLayout={initialLayout}>
            {children}
          </LayoutProvider>
        </BusinessProvider>
      </GlassProvider>
    </ThemeProvider>
  );
}
