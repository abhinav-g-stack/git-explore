import * as fs from "fs";
import * as path from "path";
import { test, expect, gotoStable } from "./fixtures";

/**
 * Journey: a logged-in user adds a product to their cart and sees it in /cart.
 *
 * Why this journey:
 *  - Highest-value flow in any e-commerce app — login + add-to-cart is the
 *    revenue path. If this breaks, money stops.
 *  - Forces a real auth pass through the UI (file-backed users.json, no Firebase).
 *  - Exercises a server action (`addToCart`) that mutates `data/carts.json`.
 *
 * Determinism strategy:
 *  - `data/carts.json` is snapshotted before the suite and restored after, so
 *    the test never pollutes seed data.
 *  - Carts file is reset to `[]` before EACH test, so we always start empty.
 *  - AuthProvider state is in-memory only, so after login this test must use
 *    real client-side navigation (header link clicks), NOT page.goto, or the
 *    user state is wiped on the next request.
 */

const cartsFilePath = path.join(process.cwd(), "data/carts.json");
let originalCartsContent: string;

test.beforeAll(() => {
  originalCartsContent = fs.readFileSync(cartsFilePath, "utf-8");
});

test.afterAll(() => {
  fs.writeFileSync(cartsFilePath, originalCartsContent, "utf-8");
});

test.beforeEach(() => {
  // carts.json is an object keyed by userId ({ "user-1": [...] }), NOT an array.
  // Reset to an empty object so each test starts from a clean slate.
  fs.writeFileSync(cartsFilePath, "{}", "utf-8");
});

test.describe("login → add to cart → view cart @e2e", () => {
  test("logged-in user can add a product and see it in their cart", async ({
    page,
  }) => {
    // 1. Log in. Form has john.doe@example.com / password pre-filled as defaults.
    await gotoStable(page, "/login");
    await page.getByRole("button", { name: "Login" }).click();

    // 2. Login redirects to "/". Wait for the redirect to complete by waiting
    //    for a homepage marker — the cart icon in the header is always there
    //    once the user state has propagated.
    await expect(page).toHaveURL("http://localhost:9002/");

    // 3. Navigate to the product detail page via a real client-side click.
    //    Using page.goto() here would reset the in-memory AuthProvider state.
    //    The header has a "Shop All" link (footer has one too — scope to nav).
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Shop All" })
      .click();
    await expect(page).toHaveURL(/\/shop$/);

    await page.getByRole("link", { name: "Wireless Mouse" }).first().click();
    await expect(page).toHaveURL(/\/products\/prod_001$/);

    // 4. Add the product to cart. AddToCartButton is on the detail page.
    await page.getByRole("button", { name: /add to cart/i }).click();

    // 5. The action shows a success toast. Wait for it as the signal the
    //    server action completed before navigating away.
    // Toast text is rendered twice (visible div + aria-live span) — pick one.
    await expect(page.getByText("Added to cart!").first()).toBeVisible();

    // 6. Click the header cart button to navigate to /cart (client-side, so
    //    AuthProvider state is preserved).
    await page.getByRole("link", { name: "Cart" }).click();
    await expect(page).toHaveURL(/\/cart$/);

    // 7. The cart page should now list the product we added — name + price.
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }),
    ).toBeVisible();
    await expect(page.getByText("$25.99").first()).toBeVisible();

    // 8. The empty-state copy from the unauth/empty branch must NOT appear.
    await expect(page.getByText("Your cart is empty.")).toHaveCount(0);
  });
});
