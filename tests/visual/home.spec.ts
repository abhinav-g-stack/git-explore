import { test, expect, gotoStable } from "./fixtures";

test.describe("home page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/");
    await expect(page).toHaveScreenshot("home-desktop.png", { fullPage: true });
  });
});
