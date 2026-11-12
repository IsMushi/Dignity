export type IconKey =
  | "overview"
  | "sales"
  | "inventory"
  | "customers"
  | "expenses"
  | "apps"
  | "pos"
  | "purchasing"
  | "credit"
  | "reports"
  | "accounting"
  | "documents";

export type BusinessId = "kivu-market" | "kigali-coffee" | "lakeview-pharmacy";

export type Business = {
  id: BusinessId;
  name: string;
  kind: string;
  branch: string;
  initials: string;
};

export const businesses: Business[] = [
  {
    id: "kivu-market",
    name: "Kivu Market",
    kind: "Demo",
    branch: "Main branch",
    initials: "KM",
  },
  {
    id: "kigali-coffee",
    name: "Kigali Coffee Co.",
    kind: "Demo",
    branch: "Downtown branch",
    initials: "KC",
  },
  {
    id: "lakeview-pharmacy",
    name: "Lakeview Pharmacy",
    kind: "Demo",
    branch: "Main branch",
    initials: "LP",
  },
];

export const defaultBusinessId: BusinessId = businesses[0].id;

const businessIds = new Set<string>(
  businesses.map((business) => business.id),
);

export function isBusinessId(
  value: string | null | undefined,
): value is BusinessId {
  return !!value && businessIds.has(value);
}

export const workspace = {
  connected: true,
  user: { name: "Alex Morgan", initials: "AM", role: "Owner" },
  date: "Nov 9, 2026",
  period: "All time",
  periodRange: "Oct 7 – 15",
};

export type NavItem = { label: string; icon: IconKey; href: string };

export const navItems: NavItem[] = [
  { label: "Overview", icon: "overview", href: "/" },
  { label: "Sales", icon: "sales", href: "/sales" },
  { label: "Inventory", icon: "inventory", href: "/inventory" },
  { label: "Customers", icon: "customers", href: "/customers" },
  { label: "Expenses", icon: "expenses", href: "/expenses" },
];

export const totals = {
  netSales: 166100,
  grossSales: 166100,
  returns: 0,
  creditOutstanding: 9400,
  transactions: 27,
  lowStock: 2,
};

/**
 * Nine consecutive trading days. Oct 10 and Oct 14 had no recorded sales, so
 * they stay on the axis with a zero value instead of disappearing between
 * neighbouring days.
 */
export const chartData = [
  { date: "Oct 7", value: 14200 },
  { date: "Oct 8", value: 22400 },
  { date: "Oct 9", value: 18900 },
  { date: "Oct 10", value: 0 },
  { date: "Oct 11", value: 27600 },
  { date: "Oct 12", value: 31800 },
  { date: "Oct 13", value: 25700 },
  { date: "Oct 14", value: 0 },
  { date: "Oct 15", value: 25500 },
];

export const paymentMix = [
  { label: "Cash", share: 60, count: 16 },
  { label: "Customer credit", share: 6, count: 2 },
  { label: "Mobile money", share: 34, count: 9 },
];

export const recentSales = [
  {
    id: "#33F77C67",
    date: "Oct 15, 2026",
    member: "Alex Morgan",
    amount: 4500,
    status: "Recorded",
  },
  {
    id: "#CA7BBF86",
    date: "Oct 13, 2026",
    member: "Alex Morgan",
    amount: 5000,
    status: "Recorded",
  },
  {
    id: "#541ADE5A",
    date: "Oct 12, 2026",
    member: "Alex Morgan",
    amount: 2800,
    status: "Recorded",
  },
  {
    id: "#5C9742F1",
    date: "Oct 12, 2026",
    member: "Alex Morgan",
    amount: 4000,
    status: "Recorded",
  },
  {
    id: "#7FFB852D",
    date: "Oct 12, 2026",
    member: "Alex Morgan",
    amount: 6000,
    status: "Recorded",
  },
];

export const lowStock = [
  { name: "Olive oil", remaining: 3 },
  { name: "Oat cookies", remaining: 4 },
];

export const businessApps: { label: string; icon: IconKey }[] = [
  { label: "Point of sale", icon: "pos" },
  { label: "Inventory & purchasing", icon: "purchasing" },
  { label: "Customers & credit", icon: "credit" },
  { label: "Expenses", icon: "expenses" },
  { label: "Reports & insights", icon: "reports" },
  { label: "Accounting", icon: "accounting" },
  { label: "Business documents", icon: "documents" },
];

export const quickActions: { label: string; icon: IconKey }[] = [
  { label: "New sale", icon: "sales" },
  { label: "Inventory", icon: "inventory" },
  { label: "Expenses", icon: "expenses" },
  { label: "Reports", icon: "reports" },
];

export function formatRwf(value: number) {
  return value.toLocaleString("en-US");
}

export function formatCount(value: number) {
  return value.toLocaleString("en-US");
}
