# 01 — Timeline.update() scrub-back detection

**Date:** 2026-09-20  
**Status:** ✅ Implemented

## Problem

When a `Timeline` auto-restarts after finishing (as in examples 20 and 22), late-offset
children with `entry.started === true` from the previous cycle were eagerly re-started
and clamped to their stale start values. This overwrote early-offset children at the
beginning of the restarted timeline.

### Concrete example (20_timeline, target1)

```
Entry 0: offset 0,   Tween y 0→200 (800 ms)
Entry 1: offset 800, Tween y 200→0 (800 ms)
```

On restart at `effectiveLocal ≈ 0`:

1. Entry 0's `else if` branch re-starts it → `update(0)` → y = 0 ✓
2. Entry 1's `else if` branch re-starts it → `update(800)` (clamped) →
   stale `_valuesStart[y] = 200` overwrites entry 0's y = 0 ✗

The box jumped to y = 200 on the very first frame of the restarted cycle.

## Root cause

The `else if` branch in `update()` had a single broad condition:

```js
} else if (!child.isPlaying() && effectiveLocal < entry.offset + child.getTotalDuration()) {
    child.start(entry.offset)
}
```

This re-started **all** finished children at any effectiveLocal — even children
whose offset is far ahead of the playhead. Combined with the clamping line
(`child.update(entry.offset)` when `effectiveLocal < entry.offset`), late
children output their stale start values, overwriting early children.

The old clamping was intended for scrub-back (when the user scrubs the playhead
to a point earlier than a child's start — the child should snap to its start
value to avoid stale forward-play values). But it also fired on fresh restarts,
where the target's state naturally reflects the end of the previous cycle and
late children should start lazily.

## Fix

### 1. `_lastUpdateTime` tracking

`Timeline` now tracks the `time` parameter of its last `update()` call:

```ts
private _lastUpdateTime = -Infinity
```

Each `update()` compares the current time against the previous one:

```ts
const scrubbingBack = time < this._lastUpdateTime
this._lastUpdateTime = time
```

`start()` resets `_lastUpdateTime = -Infinity` so the first `update()` after
a fresh start is always treated as forward play.

### 2. Conditional eager restart

The `else if` branch now gates on direction:

```ts
if (scrubbingBack || effectiveLocal >= entry.offset) {
	child.start(entry.offset)
}
```

- **Scrub-back** (`scrubbingBack === true`): Always re-start (preserves old
  eager-snap behavior so children output start values).
- **Forward play** (`scrubbingBack === false`): Only re-start when the
  playhead has actually reached the child's offset.

### 3. Conditional clamping

```ts
if (scrubbingBack && effectiveLocal < entry.offset) {
	child.update(entry.offset) // snap to start value
} else if (!scrubbingBack && effectiveLocal < entry.offset && !child.isPlaying()) {
	// Forward play: child hasn't been reached yet — skip entirely.
} else {
	child.update(effectiveLocal) // normal forward update
}
```

On forward play, late children are completely skipped (no update call at all)
until the playhead reaches their offset.

## Behavioral change

After `start()` + `update(0)`, only children at offset 0 output their start
values. Later children start lazily when the playhead reaches them. Values
set by the previous forward play persist until overwritten.

The "scrubbing back to start" unit test was updated to expect stale
end-of-cycle values for late children rather than eager-snapped start values.
Forward scrubbing is unaffected.

## Affected code

| File              | Change                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------- |
| `src/Timeline.ts` | +`_lastUpdateTime` field, `start()` resets it, `update()` direction-gated restart/clamp |
| `src/tests.ts`    | Updated "scrubbing back to start" expectations for lazy-start-on-restart                |
