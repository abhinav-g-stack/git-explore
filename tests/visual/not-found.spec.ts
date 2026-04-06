import { test, expect, gotoStable } from "./fixtures";

// Next.js default 404 page. Fully static, no data, no auth.
// If a custom not-found.tsx is added later, this test still covers it.
test.describe("404 page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/this-route-does-not-exist-xyz");
    await expect(page).toHaveScreenshot("not-found-desktop.png", {
      fullPage: true,
    });
  });
});
