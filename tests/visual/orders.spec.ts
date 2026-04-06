import { test, expect, gotoStable } from "./fixtures";

test.describe("orders page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/orders");
    await expect(page).toHaveScreenshot("orders-desktop.png", {
      fullPage: true,
    });
  });
});
