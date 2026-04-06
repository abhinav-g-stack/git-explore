import { test, expect, gotoStable } from "./fixtures";

test.describe("admin dashboard pages @visual", () => {
  test("dashboard home", async ({ page }) => {
    await gotoStable(page, "/admin/dashboard");
    await expect(page).toHaveScreenshot("admin-dashboard-desktop.png", {
      fullPage: true,
    });
  });

  test("dashboard orders", async ({ page }) => {
    await gotoStable(page, "/admin/dashboard/orders");
    await expect(page).toHaveScreenshot("admin-dashboard-orders-desktop.png", {
      fullPage: true,
    });
  });

  test("dashboard products", async ({ page }) => {
    await gotoStable(page, "/admin/dashboard/products");
    await expect(page).toHaveScreenshot(
      "admin-dashboard-products-desktop.png",
      { fullPage: true },
    );
  });

  test("dashboard users", async ({ page }) => {
    await gotoStable(page, "/admin/dashboard/users");
    await expect(page).toHaveScreenshot("admin-dashboard-users-desktop.png", {
      fullPage: true,
    });
  });
});
