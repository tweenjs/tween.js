# 11 — Curve Tool GUI

AE / Premiere style multi-point easing editor in `curve-tool-gui/`
(zero-dependency vanilla ESM, mirroring `timeline-gui/`).

## Requirements

- Custom easing/interpolation authoring like After Effects and Premiere:
  a time↔progress graph with draggable keyframes and Bézier handles,
  presets, and live preview — instead of hand-picking a named `Easing.*`
  variant or hand-writing SVG path data.
- Same distribution model as `timeline-gui/` (dev-docs/09 on the
  `feat/timeline-gui` branch): no install step, vendored `dist/` build via
  import map, any static root works, `file://` shows a boot banner.
- Dogfood the library: the preview dots are driven by a real `Tween`
  with the edited easing, and the graph draws through real
  `CubicBezierCurve` segments, so the tool shows what tween.js does.

## Decisions

- **Easing source, not overlay.** The selector offers `Custom` (graph
  editable) or any built-in `Easing.*` (graph locked: dimmed canvas, lock
  banner, disabled presets/inspector, gestures ignored). The preview and
  code box follow the source; Apply accepts a path, a snippet,
  `cubic-bezier(…)`, or `Easing.*` (which switches to that locked source).
- **Multi-point path.** An ordered keyframe list from (0, 0) to (1, 1),
  joined by cubic Bézier segments with per-segment handles. Double-click
  adds a keyframe snapped onto the curve (de Casteljau split, with a
  thirds fallback on x-looping segments); double-click/Delete removes
  interior points; dragging a point translates adjacent handles so shapes
  survive the move. Endpoints stay pinned.
- **A Curve is not an easing.** `Curve` maps parameter `t → point` while
  an easing needs the inverse `x → y`, so the tool keeps a small
  Newton-Raphson (+ bisection fallback) inverter per segment, CSS-spec
  style. `CatmullRomCurve` is not used: its `t` is not x-proportional.
  `test/curve-agreement.mjs` proves the drawn lib-sampled shape matches
  the solver for monotonic presets.
- **SVG as interchange.** Export is an SVG path in a `0 0 100 100` y-down
  box (paste-compatible with Figma/Illustrator); import keeps authored
  Bézier handles and accepts M/L/C/H/V (absolute or relative), rejecting
  non-functional (x-looping) paths and Q/S/T/A/Z with clear errors.
- **AE-style overshoot allowed.** Time clamps to [0, 1]; values roam
  [−1, 2] for anticipation / follow-through. The inspector warns when the
  curve goes non-monotonic (valid for tween.js, not for CSS transitions).
- **Code box is snippet-first, Curve values only.** Apply accepts a
  generated snippet (exact `CubicBezierCurve` round-trip), a pasted SVG
  path (Figma/Illustrator import), a classic `cubic-bezier(…)` (upgraded
  to one segment), or `Easing.*`. Generated code never contains SVG
  strings — Custom stores a `CurvePath` of `CubicBezierCurve`s plus the
  same small inverter, so curves stay manageable, reusable, and easy to
  migrate.
- **Explicit-clock preview.** The preview owns `previewT` and steps its
  own `Tween` with `update(previewT * duration)`; ping-pong flips direction
  at the ends; the coral eased dot races a grey linear ghost. Editing the
  curve rebuilds the tween but keeps the clock, so the dot never jumps.
- **Persistence.** `{sourceName, curve, duration, yoyo}` under
  `tweenjs-curve-tool-v3` (v1 was single-Bézier, v2 was overlay-based).

## Layout

- `index.html` — shell, import map, transport + source selects.
- `src/model.js` — pure: path CRUD, solver, SVG import/export, presets,
  source codegen/parser (`Custom` vs built-in).
- `src/app.js` — canvas graph (HiDPI, pointer drag, dblclick add/remove,
  arrow-key nudge, locked built-in rendering), keyframe inspector,
  presets, source selector, preview race, code box, persistence.
- `src/styles.css` — pastel glass theme (indigo/coral/gold on lavender-
  peach gradient), lock banner, disabled states.
- `test/smoke.mjs` — 16 model tests: endpoints/identity/continuity,
  overshoot sampling, add/delete/move/handle semantics, SVG fidelity,
  Curve-constructor round-trips (and a no-SVG-in-code guard), built-in
  sources, error messages, vendor-vs-dist.
- `test/curve-agreement.mjs` — 3 tests proving lib-sampled segments match
  the solver on monotonic presets.
- `tests/e2e/` — isolated browser tests (render + autoplay, preset
  rewrite, handle drag, dblclick add, builtin lock/unlock, apply
  path/built-in/invalid) with own Playwright config serving the folder on
  :3335. The boot banner names the specific failure (file:// protocol,
  missing vendor copy, or the startup error) instead of one generic message.
- `vendor/tween/tween.esm.js` — copy of the repo `dist/` build
  (`npm run vendor` refreshes it; smoke-tested for drift).

## How to run / test / check

```sh
npm run build            # repo root: rebuilds dist/
cd curve-tool-gui
npm run vendor            # refresh vendor/tween/tween.esm.js from dist
npx --yes serve .         # then open the shown URL
```

Test (all green required):

```sh
cd curve-tool-gui
npm test         # node --check sources, 16 smoke + 3 agreement tests, then e2e
npm run test:e2e  # browser tests only (8 functional specs)
```

Check (format):

```sh
npx prettier --check curve-tool-gui/   # from the repo root
```

## Verification

- 16 smoke + 3 agreement tests pass, including solver identity, preset
  overshoot sampling, on-curve keyframe insertion, SVG import fidelity
  (authored handles preserved), exact snippet round-trips, and the
  vendor-vs-dist check.
- Headless-Chromium verification via `tests/e2e/` (8 functional specs
  with shared page helpers, own config serving the folder on :3335):
  graph + code render, preview auto-plays, preset click rewrites the
  path, handle drag reshapes it, double-click adds a segment, built-in
  selection locks the graph (drag ignored, banner + chip shown) and
  Custom restores it, Apply accepts paths and `Easing.*`, invalid input
  shows an error.
- `prettier --check curve-tool-gui/` passes; all DOM ids referenced from
  `app.js` exist in `index.html`; no `eval`/`new Function` in
  `curve-tool-gui/src`.

## Future work

- Multi-keyframe value graphs (per-property AE curves) instead of a single
  easing; snapping guides for handles.
- Fit an arbitrary easing function into keyframes + handles automatically.

✅ Implemented
