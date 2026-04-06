import { test, expect, gotoStable } from "./fixtures";

// Why this route and not /shop:
// /shop is a server component that fetches products from Firebase at request
// time. page.route() only intercepts browser-side requests, so stubbing is a
// dead end without an emulator. /admin/login is fully static — picked it to
// keep the suite deterministic until we actually need data-driven snapshots.
test.describe("admin login page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/admin/login");
    await expect(page).toHaveScreenshot("admin-login-desktop.png", {
      fullPage: true,
    });
  });
});
