# tween.js — Development Notes

Architectural decisions, deferred work, and implementation notes for the tween.js
library. User-facing docs live in `examples/` and `README.md`.

## Conventions

- `dev-docs/` contains ordered, numbered documents (01, 02, …) covering specific
  changes, bug investigations, and design decisions.
- Each document ends with its current status (✅ Implemented, 🚧 In progress, etc.).
- This file links into `dev-docs/` and records standing rules.
- Judge local lint only after `npm clean-install`: a looser locally installed
  `prettier` (f.e. 3.9.x vs the lockfile's 3.2.2) formats CSS differently than
  CI, and untracked tool caches (f.e. `.rumdl_cache/`) fail
  `prettier . --check` locally but never exist in CI.
- Install tooling project-wide, never system-wide (f.e. browsers via
  `PLAYWRIGHT_BROWSERS_PATH=.browsers/`, which is gitignored).
- `Tween.update(time?)`, `Timeline.update(time?)`, and `Group.update(time?)`
  only advance time; playback starts exclusively via `start()` /
  `startFromCurrentValues()`, and groups never auto-remove finished or stopped
  children (remove explicitly via `group.remove(child)`, `tween.remove()`, or
  `group.removeAll()`).

## Implementation notes

- **01 — Timeline.update() scrub-back detection** [`dev-docs/01-timeline-update-scrub-detection.md`](dev-docs/01-timeline-update-scrub-detection.md)
  Fixes an auto-restart bug where late-offset children overwrote early children
  at the start of a restarted cycle. Introduces `_lastUpdateTime` tracking and
  direction-aware eager-restart/clamp gating in `update()`. ✅
- **02 — Timeline restart boundary alignment** [`dev-docs/02-timeline-restart-boundary-alignment.md`](dev-docs/02-timeline-restart-boundary-alignment.md)
  Fixes a sub-frame timing drift between repeated short timelines and longer
  equivalent timelines. Stores the ideal `_startTime + _duration` boundary
  on finish and snaps `start()` to it. ✅
- **03 — PR #713 review-condition fixes** [`dev-docs/03-pr713-review-conditions-and-diff-minimization.md`](dev-docs/03-pr713-review-conditions-and-diff-minimization.md)
  Missing `Tween.chain` deprecation, stale guide references, diff cleanups,
  and the review-requested nesting/scrub/pause edge-case tests. ✅
- **05 — Timeline entry duration cache** [`dev-docs/05-timeline-entry-duration-cache.md`](dev-docs/05-timeline-entry-duration-cache.md)
  Hot-path fix: durations captured per entry at add time instead of recomputed
  every frame; verified snapshot-neutral. ✅
- **06 — Timeline API review follow-ups** [`dev-docs/06-timeline-api-review-followups.md`](dev-docs/06-timeline-api-review-followups.md)
  Renames array-add staggering to `stagger`, removes Timeline interpolation,
  renames `easing()` to `easingAll(recurse?)`, and moves guide deprecation
  callouts directly under each legacy Tween API heading. ✅
- **07 — Curve/Path primitives (#721)** [`dev-docs/07-curve-path.md`](dev-docs/07-curve-path.md)
  Dependency-free `Curve` base plus Line/Bezier/CatmullRom/`CurvePath`
  (`Path` alias) over plain `{x, y[, z]}` points; Tween drives a 0 → 1
  progress sampled via `getPoint(t, target)`. Standing rules: outputs never
  gain a `z` key (2D stays 2D), and nodeunit assertion messages are lazy —
  snapshot animated values before asserting. ✅
- **08 — TimeScaler decoupled clock (#722)** [`dev-docs/08-timescaler.md`](dev-docs/08-timescaler.md)
  Scales a monotonic source clock into tween times (`scale`, `start`, `update`)
  so `Tween`/`Group`/`Timeline` stay scale-free per #655. Constant
  scale 1 is the identity; 0 freezes, negatives run backwards. ✅
- **09 — Timeline GUI** [`dev-docs/09-timeline-gui.md`](dev-docs/09-timeline-gui.md)
  Vanilla ESM track editor in `timeline-gui/` (tracks, ruler/labels,
  explicit-clock scrub, inspector, live stage). Code is the interchange
  format: editable box with `parseCode`, strict no-`eval` literal parser,
  vendored speed-highlight overlay, `Tween`/`Timeline`/`Easing`
  autocomplete. No core library changes. How to run/test/check: see
  `dev-docs/09-timeline-gui.md` §How to run / test / check. ✅
- **10 — Remove legacy CommonJS and AMD distributions (#655)** [`dev-docs/10-remove-commonjs-build.md`](dev-docs/10-remove-commonjs-build.md)
  Drops the `dist/tween.cjs` and `dist/tween.amd.js` Rollup targets, removes
  CJS paths from `package.json` (`main` and `exports["."].require`), and removes
  deprecated CJS docs and the `nodejs-commonjs` example project. ✅
- **11 — Remove `autoStart` and `Group.update` `preserve` (#655)** [`dev-docs/11-remove-update-autostart.md`](dev-docs/11-remove-update-autostart.md)
  Removes `autoStart` and `autoStartOnUpdate` from `Tween` and `Timeline`, and
  removes `preserve` and auto-removal from `Group.update(time?)`, so `update()`
  only advances time and never implicitly starts or removes animations. ✅
