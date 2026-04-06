// E2E fixtures re-export the visual fixtures: animations-off + gotoStable.
// Killing animations is just as useful here — it removes a major source of
// "click happened before the menu opened" flake.
export { test, expect, gotoStable } from "../visual/fixtures";
