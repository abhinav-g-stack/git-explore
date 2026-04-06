import { test as base, expect } from "@playwright/test";

/**
 * Shared test fixture: kills animations + transitions and waits for fonts
 * before any snapshot is taken. Use `test` from this file, not from @playwright/test.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          caret-color: transparent !important;
        }
      `;
      // Inject as soon as <head> exists.
      const inject = () => document.head?.appendChild(style);
      if (document.head) inject();
      else document.addEventListener("DOMContentLoaded", inject);
    });
    await use(page);
  },
});

export { expect };

/**
 * Navigate and wait until the page is visually settled:
 * networkidle + fonts ready. Call before `toHaveScreenshot`.
 */
export async function gotoStable(
  page: import("@playwright/test").Page,
  path: string,
) {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
}
