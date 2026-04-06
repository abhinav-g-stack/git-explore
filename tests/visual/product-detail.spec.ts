import { test, expect, gotoStable } from "./fixtures";

// Uses prod_001 from data/products.json. If that fixture id ever changes,
// update this test or the suite will green-fail on a missing product page.
test.describe("product detail page @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/products/prod_001");
    await expect(page).toHaveScreenshot("product-detail-desktop.png", {
      fullPage: true,
    });
  });
});
