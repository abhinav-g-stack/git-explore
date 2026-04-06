import { test, expect, gotoStable } from "./fixtures";

test.describe("checkout page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/checkout");
    await expect(page).toHaveScreenshot("checkout-desktop.png", {
      fullPage: true,
    });
  });
});
