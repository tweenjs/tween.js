# tween.js — Curve Tool

A zero-dependency, vanilla ESM keyframe easing editor for tween.js. Draw a
multi-point easing path on a time↔progress graph — the same interaction as
the After Effects / Premiere speed graph — and preview the result on racing
dots driven by a real `Tween`.

## Run it

The GUI vendors the built lib (`vendor/tween/tween.esm.js`, copied from
the repo `dist/` build), so **any static server root works** — the repo
root, the `curve-tool-gui/` folder itself (f.e. VS Code Live Server / Live
Preview on this folder), or any subpath host:

```sh
# from the repo root (also refreshes the vendored copy)
npm run build
cd curve-tool-gui && npm run vendor

# serve from anywhere that covers curve-tool-gui/
npx --yes serve .
# open http://localhost:3000/ (or http://localhost:3000/curve-tool-gui/
# when serving the repo root)
```

No `npm install` needed inside `curve-tool-gui/` — there are no dependencies.

Opening `index.html` directly does **not** work: browsers refuse to load
ES modules from `file://` URLs, so the page stays empty. If you see the
red boot banner instead of the graph, serve the folder over HTTP as above
(in VS Code, the Live Server extension&#39;s “Open with Live Server” does
the same).

## What it does

- **Graph editor (Custom)**: a canvas with P0=(0,0) and Pn=(1,1) pinned and
  draggable interior keyframes joined by cubic Bézier segments.
  Double-click empty space to add a keyframe on the curve, double-click a
  point (or Delete) to remove it, drag pink handles to reshape segments.
  Time is clamped to 0…1; values may overshoot into −1…2 for anticipation
  / follow-through. Arrow keys nudge the selection (Shift for bigger steps).
- **Presets**: Linear, Ease, Ease In Out, Overshoot, Bounce, Anticipation
  — including multi-keyframe shapes a single `cubic-bezier()` cannot draw.
- **Preview race**: your easing (coral dot) against linear time (grey
  ghost), both driven by a real `Tween`, with play/pause/stop, duration
  select, and ping-pong toggle.
- **Code**: the box holds a paste-ready tween.js snippet only — Custom
  stores the path as `Curve` values (a `CurvePath` of `CubicBezierCurve`s,
  ready to manage, reuse, or migrate) plus a small inverter; built-ins emit
  `.easing(Easing.*)`. No SVG strings are ever written into code. Apply
  accepts a snippet, a pasted SVG path, `cubic-bezier(…)`, or `Easing.*`.
  The curve persists to `localStorage` (`tweenjs-curve-tool-v3`).

## Layout

- `index.html` — page shell, import map (`@tweenjs/tween.js` →
  `./vendor/tween/tween.esm.js`).
- `src/model.js` — pure: multi-point path (add/move/delete), CSS-spec
  per-segment solver, SVG import/export, codegen, parser.
- `src/app.js` — DOM wiring: canvas graph (points, handles, locked
  built-in mode with a specific boot-error banner), keyframe inspector,
  presets, source selector, preview race, code box, persistence.
- `src/styles.css` — dark graph-editor theme.
- `test/smoke.mjs` — model tests; `test/curve-agreement.mjs` proves the
  drawn lib-sampled shape matches the solver.
- `tests/e2e/` — isolated, reusable browser tests + own Playwright config
  serving this folder on :3335: `npm run test:e2e` (uses the repo's
  Playwright install).
- `vendor/tween/tween.esm.js` — copy of the repo `dist/` build so the GUI
  runs from any static root. Refresh after rebuilding the lib with
  `npm run vendor`; the smoke test fails if the copy drifts from `dist/`.

## Scope notes

- The tool edits easing curves only (one cubic segment). Spatial motion
  paths stay in the core `Curve`/`CurvePath` API (see `examples/23_*`);
  drive a `curve.getPoint(t)` with a tween eased by a curve designed here.
- Non-monotonic curves (handles pushed past y=0/1) animate backwards or
  overshoot mid-flight — intentional, AE-style — but are not valid CSS
  `transition-timing-function`s; the inspector warns about them.
