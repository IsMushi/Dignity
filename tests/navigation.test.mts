import assert from "node:assert/strict";
import { test } from "node:test";
import { navItems } from "../src/lib/data.ts";
import { isNavItemActive } from "../src/lib/navigation.ts";

test("every nav item points at a real top-level route", () => {
  const hrefs = navItems.map((item) => item.href);

  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.deepEqual(hrefs, ["/", "/sales", "/inventory", "/customers", "/expenses"]);
  assert.ok(hrefs.every((href) => href.startsWith("/")));
});

test("Overview only matches the root route", () => {
  assert.equal(isNavItemActive("/", "/"), true);
  assert.equal(isNavItemActive("/sales", "/"), false);
  assert.equal(isNavItemActive("/appearance", "/"), false);
});

test("section routes match themselves and their children", () => {
  assert.equal(isNavItemActive("/sales", "/sales"), true);
  assert.equal(isNavItemActive("/sales/", "/sales"), true);
  assert.equal(isNavItemActive("/sales/33F77C67", "/sales"), true);
  assert.equal(isNavItemActive("/salesperson", "/sales"), false);
  assert.equal(isNavItemActive("/inventory", "/sales"), false);
});
