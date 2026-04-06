import { defineConfig, devices } from "@playwright/test";

/**
 * Two suites coexist:
 *  - "visual"  → tests/visual/  → snapshot regression (single worker, strict)
 *  - "e2e"     → tests/e2e/     → user-journey behavior (real interactions + assertions)
 *
 * Both share one dev server and one Chromium install. Run individually with
 * `--project=visual` / `--project=e2e`, or together via `npm run test`.
 */
export default defineConfig({
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],

  expect: {
    // Tolerate sub-pixel rendering noise; tighten later if too lax.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      caret: "hide",
    },
  },

  use: {
    baseURL: "http://localhost:9002",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "UTC",
    ...devices["Desktop Chrome"],
  },

  projects: [
    {
      name: "visual",
      testDir: "./tests/visual",
    },
    {
      name: "e2e",
      testDir: "./tests/e2e",
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:9002",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
