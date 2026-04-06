import { test, expect, gotoStable } from "./fixtures";

test.describe("login page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/login");
    await expect(page).toHaveScreenshot("login-desktop.png", {
      fullPage: true,
    });
  });
});
