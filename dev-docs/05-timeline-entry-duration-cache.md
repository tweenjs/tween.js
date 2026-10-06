# 05 — Timeline hot-path: cache child durations in entries

**Date:** 2026-10-05
**Status:** ✅ Implemented

`Timeline.update()` re-called `child.getTotalDuration()` per entry per frame
(finished-child re-entry gate), recomputing `delay + duration +
repeat * (…)` for N children every frame — pure overhead, because children are
already snapshot at add time (clone-based repeat/yoyo expansion).

Fix: `TimelineEntry.duration` is captured in `add()` and read by the update
loop, `_recalculateDuration()`, and `clone()` (which copies it). `Infinity`
for infinite-repeat children flows through unchanged.

Verified behavior-neutral: 1085 unit assertions pass and the full e2e visual
suite passes with unchanged snapshots (examples 03/20/21/22 — nesting,
scrubbing, repeat/yoyo). Fulfills the performance pass promised in the #713
discussion.

Affected: `src/Timeline.ts`, `dist/*` (rebuilt).
