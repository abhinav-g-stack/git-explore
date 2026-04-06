# Visual Regression Tests

Playwright-based pixel diffing for the Next.js frontend. Chromium only, single viewport (1280×800), single worker.

## Commands

```
npm run test:visual           # run diffs against committed baselines
npm run test:visual:update    # regenerate baselines (use deliberately)
npm run test:visual:report    # open last HTML report
```

The dev server (`npm run dev`, port 9002) is started automatically. If one is already running it will be reused.

## First-time setup

```
npm i -D @playwright/test
npx playwright install chromium
npm run test:visual:update    # creates the initial baseline images
```

Baselines live next to each spec under `__screenshots__/` and **must be committed**.

## Adding a new route

1. Confirm the route is **deterministic** — no live-data, no time-based content, no random IDs. If it isn't, either stub the network in the test or pick a different route.
2. Copy `login.spec.ts`, point it at the new path, give the snapshot a unique name.
3. Run `npm run test:visual:update` to capture the baseline.
4. Inspect the generated PNG by eye before committing. A bad baseline is worse than no baseline.

## When a diff appears in a PR — the maintenance contract

This is where visual testing usually dies. Follow the rule:

1. **Open the HTML report** (`npm run test:visual:report`) and look at the three-pane diff (expected / actual / diff).
2. Ask: _did I intend this change?_
   - **Yes** → run `npm run test:visual:update`, commit the new PNGs **in the same PR as the code change**, and call out the visual change in the PR description.
   - **No** → it's a regression. Fix the code, don't update the baseline.
3. **Never** blanket-update baselines to make CI green. That defeats the entire point.

## Deliberate non-goals (for now)

- No Firefox / WebKit — adding browsers triples baseline count and triples flake.
- No auth-gated routes — needs a session fixture, separate task.
- No mobile viewports — add only when a mobile-specific bug ships.
- No SaaS service (Chromatic / Percy) — local baselines are sufficient until we outgrow them.
- No component-level snapshots — page-level only; component snapshots become churn quickly.

Grow this suite **deliberately**, one route at a time, only for routes whose visual stability actually matters.

## Determinism tricks already wired in

- Animations + transitions zeroed out via `fixtures.ts`
- `caret: 'hide'`, `animations: 'disabled'` in the global expect config
- `gotoStable()` waits for `networkidle` and `document.fonts.ready`
- Fixed timezone (UTC) and locale (en-US) in `playwright.config.ts`

If a snapshot is still flaky after this, the **page** is non-deterministic — fix the page or `mask:` the offending region, don't loosen the threshold.
