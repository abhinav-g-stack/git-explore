import { test, expect, gotoStable } from "./fixtures";

/**
 * Journey: a visitor uses the shop's search filter to narrow down products.
 *
 * Why this journey:
 *  - Pure client-side interaction, zero mutations, zero auth.
 *  - Exercises ShopFilters useState/useMemo logic — a snapshot would only
 *    catch the *initial* render, never the post-filter state.
 *  - Catches regressions in the filter predicate (case sensitivity, partial
 *    match, empty-state fallback) that visual tests structurally cannot.
 *
 * Pinned to "Wireless Mouse" (prod_001) and "Mechanical Keyboard" (prod_002)
 * from data/products.json.
 */
test.describe("shop search filter @e2e", () => {
  test("typing a search term narrows the visible products", async ({
    page,
  }) => {
    await gotoStable(page, "/shop");

    // Sanity check: both products are visible before filtering.
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Mechanical Keyboard" }).first(),
    ).toBeVisible();

    // Filter to just "Wireless".
    await page.getByLabel("Search").fill("Wireless");

    // Mouse stays, Keyboard disappears. The keyboard locator should resolve
    // to zero matches once the filter applies.
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Mechanical Keyboard" }),
    ).toHaveCount(0);
  });

  test("a no-match search shows the empty state", async ({ page }) => {
    await gotoStable(page, "/shop");
    await page.getByLabel("Search").fill("xyz-nonexistent-product-name");

    await expect(
      page.getByRole("heading", { name: "No Products Found" }),
    ).toBeVisible();
  });
});
