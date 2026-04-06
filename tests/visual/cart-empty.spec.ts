import { test, expect, gotoStable } from "./fixtures";

// Unauthenticated cart: useAuth() returns no user, the client component
// short-circuits to its empty state. No network, no user-specific data —
// safe to baseline. The moment we add an auth fixture, this becomes the
// "logged-in empty cart" test and we add a separate "with items" variant.
test.describe("cart page (empty / unauthenticated) @visual", () => {
  test("renders consistently at desktop width", async ({ page }) => {
    await gotoStable(page, "/cart");
    await expect(page).toHaveScreenshot("cart-empty-desktop.png", {
      fullPage: true,
    });
  });
});
