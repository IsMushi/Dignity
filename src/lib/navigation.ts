/**
 * The app's primary routes. Kept separate from the hook so the match rules
 * (exact for Overview, prefix for a section and its children) are testable
 * without a browser.
 */
export function isNavItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
