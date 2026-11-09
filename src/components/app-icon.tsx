import {
  BookOpen,
  ChartNoAxesCombined,
  FilePenLine,
  LayoutDashboard,
  LayoutGrid,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import type { IconKey } from "@/lib/data";

export function AppIcon({
  name,
  className,
}: {
  name: IconKey;
  className?: string;
}) {
  const props = { className, "aria-hidden": true, strokeWidth: 1.7 } as const;

  switch (name) {
    case "overview":
      return <LayoutDashboard {...props} />;
    case "sales":
      return <ShoppingCart {...props} />;
    case "inventory":
      return <Package {...props} />;
    case "customers":
      return <Users {...props} />;
    case "expenses":
      return <Wallet {...props} />;
    case "apps":
      return <LayoutGrid {...props} />;
    case "pos":
      return <ShoppingBag {...props} />;
    case "purchasing":
      return <Package {...props} />;
    case "credit":
      return <Users {...props} />;
    case "reports":
      return <ChartNoAxesCombined {...props} />;
    case "accounting":
      return <BookOpen {...props} />;
    case "documents":
      return <FilePenLine {...props} />;
    default:
      return null;
  }
}
