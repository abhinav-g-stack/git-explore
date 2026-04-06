import { test, expect, gotoStable } from "./fixtures";

// Uses the unauthenticated state of /wishlist, which shows a stable login
// prompt. Auth-gated content (populated wishlist) is not snapshot-tested here
// per the visual suite's deliberate non-goals (see README).
test.describe("wishlist page @visual", () => {
  test("renders unauthenticated state consistently at desktop width", async ({
    page,
  }) => {
    await gotoStable(page, "/wishlist");
    await expect(page).toHaveScreenshot("wishlist-unauthenticated-desktop.png", {
      fullPage: true,
    });
  });
});
