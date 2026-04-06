import * as fs from "fs";
import * as path from "path";
import { test, expect, gotoStable } from "./fixtures";

/**
 * Journey: a logged-in user manages their wishlist — add products, view them,
 * remove items, and move items to cart.
 *
 * Why this journey:
 *  - Validates the complete wishlist lifecycle: add → view → move-to-cart → remove.
 *  - Exercises wishlist server actions (addToWishlist, removeFromWishlist) and
 *    the cross-action move-to-cart flow.
 *  - Tests the wishlist entry point on the product detail page and header nav
 *    visibility gated on auth state.
 *
 * Determinism strategy:
 *  - `data/wishlists.json` is snapshotted before the suite and restored after,
 *    so the test never pollutes seed data.
 *  - Both wishlists and carts files are reset to `{}` before EACH test so we
 *    always start from a clean slate.
 *  - AuthProvider state is in-memory only — after login all navigation must use
 *    real client-side clicks, NOT page.goto, or the user state is wiped.
 */

const wishlistsFilePath = path.join(process.cwd(), "data/wishlists.json");
const cartsFilePath = path.join(process.cwd(), "data/carts.json");

let originalWishlistsContent: string;
let originalCartsContent: string;

test.beforeAll(() => {
  originalWishlistsContent = fs.readFileSync(wishlistsFilePath, "utf-8");
  originalCartsContent = fs.readFileSync(cartsFilePath, "utf-8");
});

test.afterAll(() => {
  fs.writeFileSync(wishlistsFilePath, originalWishlistsContent, "utf-8");
  fs.writeFileSync(cartsFilePath, originalCartsContent, "utf-8");
});

test.beforeEach(() => {
  fs.writeFileSync(wishlistsFilePath, "{}", "utf-8");
  fs.writeFileSync(cartsFilePath, "{}", "utf-8");
});

test.describe("wishlist @e2e", () => {
  test("unauthenticated user clicking wishlist button is redirected to login", async ({
    page,
  }) => {
    await gotoStable(page, "/shop");

    // WishlistButton redirects to /login when no user is present, matching
    // the same pattern as the AddToCartButton on the product card.
    await page
      .getByRole("button", { name: /add to wishlist/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("logged-in user can add a product to wishlist from the product detail page", async ({
    page,
  }) => {
    await gotoStable(page, "/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("http://localhost:9002/");

    // Navigate client-side to preserve in-memory AuthProvider state.
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Shop All" })
      .click();
    await expect(page).toHaveURL(/\/shop$/);

    await page.getByRole("link", { name: "Wireless Mouse" }).first().click();
    await expect(page).toHaveURL(/\/products\/prod_001$/);

    await page.getByRole("button", { name: /add to wishlist/i }).click();

    // Success toast confirms the server action completed.
    await expect(page.getByText("Added to wishlist!").first()).toBeVisible();
  });

  test("wishlist page shows items added by the user", async ({ page }) => {
    await gotoStable(page, "/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("http://localhost:9002/");

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Shop All" })
      .click();
    await page.getByRole("link", { name: "Wireless Mouse" }).first().click();
    await expect(page).toHaveURL(/\/products\/prod_001$/);

    await page.getByRole("button", { name: /add to wishlist/i }).click();
    await expect(page.getByText("Added to wishlist!").first()).toBeVisible();

    // Navigate to wishlist via header link (client-side, preserves auth state).
    await page.getByRole("link", { name: /wishlist/i }).click();
    await expect(page).toHaveURL(/\/wishlist$/);

    // Item details must be visible.
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }),
    ).toBeVisible();
    await expect(page.getByText("$25.99").first()).toBeVisible();

    // Empty-state copy must NOT appear.
    await expect(page.getByText("Your wishlist is empty.")).toHaveCount(0);
  });

  test("user can remove an item from their wishlist", async ({ page }) => {
    await gotoStable(page, "/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("http://localhost:9002/");

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Shop All" })
      .click();
    await page.getByRole("link", { name: "Wireless Mouse" }).first().click();
    await page.getByRole("button", { name: /add to wishlist/i }).click();
    await expect(page.getByText("Added to wishlist!").first()).toBeVisible();

    await page.getByRole("link", { name: /wishlist/i }).click();
    await expect(page).toHaveURL(/\/wishlist$/);
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }),
    ).toBeVisible();

    // Remove the item via the Remove button on the wishlist card.
    await page.getByRole("button", { name: /remove/i }).first().click();

    // Item must disappear and empty state must appear.
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }),
    ).toHaveCount(0);
    await expect(page.getByText("Your wishlist is empty.")).toBeVisible();
  });

  test("user can move a wishlist item to their cart", async ({ page }) => {
    await gotoStable(page, "/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("http://localhost:9002/");

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Shop All" })
      .click();
    await page.getByRole("link", { name: "Wireless Mouse" }).first().click();
    await page.getByRole("button", { name: /add to wishlist/i }).click();
    await expect(page.getByText("Added to wishlist!").first()).toBeVisible();

    await page.getByRole("link", { name: /wishlist/i }).click();
    await expect(page).toHaveURL(/\/wishlist$/);

    // Move to Cart removes the item from wishlist and adds it to cart.
    await page.getByRole("button", { name: /move to cart/i }).first().click();

    // Item must no longer appear in the wishlist.
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }),
    ).toHaveCount(0);

    // Navigate to cart and confirm the item arrived there.
    await page.getByRole("link", { name: "Cart" }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(
      page.getByRole("link", { name: "Wireless Mouse" }),
    ).toBeVisible();
    await expect(page.getByText("$25.99").first()).toBeVisible();
  });

  test("empty wishlist shows empty state and browse-products call-to-action", async ({
    page,
  }) => {
    await gotoStable(page, "/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("http://localhost:9002/");

    // Navigate to wishlist without adding anything — should hit empty state.
    await page.getByRole("link", { name: /wishlist/i }).click();
    await expect(page).toHaveURL(/\/wishlist$/);

    await expect(page.getByText("Your wishlist is empty.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /browse products/i }),
    ).toBeVisible();
  });

  test("header wishlist link is only visible to logged-in users", async ({
    page,
  }) => {
    // Unauthenticated: no wishlist link in the header.
    await gotoStable(page, "/shop");
    await expect(
      page.getByRole("navigation").getByRole("link", { name: /wishlist/i }),
    ).toHaveCount(0);

    // After logging in, the wishlist link must appear in the header.
    await gotoStable(page, "/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("http://localhost:9002/");
    await expect(
      page.getByRole("link", { name: /wishlist/i }),
    ).toBeVisible();
  });
});
