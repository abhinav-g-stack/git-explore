import { test, expect, gotoStable } from "./fixtures";

/**
 * Journey: a visitor browses the shop and opens a product detail page.
 *
 * Why this journey first:
 *  - Pure navigation, no auth, no mutations — establishes the e2e pattern
 *    without dragging in Firebase auth or cart-state setup.
 *  - Exercises real DOM interaction (click on a Link), Next.js client-side
 *    routing, and a server component fetch on the destination route.
 *  - Asserts on visible content (heading, price), not pixels — this is the
 *    behavioral contract a visual snapshot can't express.
 *
 * Pinned to prod_001 ("Wireless Mouse") from data/products.json so the test
 * is independent of card ordering on the shop page.
 */
test.describe("browse → product detail @e2e", () => {
  test("visitor can open a product from the shop listing", async ({ page }) => {
    await gotoStable(page, "/shop");

    // The product name is rendered twice on the card (image link + title link).
    // Pick the title link by role+name and click it.
    await page.getByRole("link", { name: "Wireless Mouse" }).first().click();

    // Client-side navigation should land us on the canonical detail URL.
    await expect(page).toHaveURL(/\/products\/prod_001$/);

    // Behavioral assertions — these are what a visual snapshot CAN'T catch:
    // wrong product loaded, missing price, broken data binding, etc.
    await expect(
      page.getByRole("heading", { level: 1, name: "Wireless Mouse" }),
    ).toBeVisible();
    await expect(page.getByText("$25.99")).toBeVisible();
    await expect(page.getByText(/in stock|Out of stock/)).toBeVisible();
  });
});
