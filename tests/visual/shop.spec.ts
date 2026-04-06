import { test, expect, gotoStable } from "./fixtures";

test.describe("shop page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/shop");
    await expect(page).toHaveScreenshot("shop-desktop.png", { fullPage: true });
  });
});
