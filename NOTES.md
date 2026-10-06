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
