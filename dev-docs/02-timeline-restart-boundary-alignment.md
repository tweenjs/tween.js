# 02 — Timeline restart boundary alignment

**Date:** 2026-09-21
**Status:** ✅ Implemented

## Problem

When a running timeline finishes and the application restarts it via
`timeline.start(time)`, the `_startTime` was set to the current wall-clock
`time`. In a real browser (or hijacked rAF test environment), the frame time
almost never lands exactly on the correct duration boundary (e.g., 1200 ms).
This creates a sub-frame offset in the new cycle's clock.

### Concrete example (22_timeline_repeat)

```js
// yoyo timeline (1200 ms cycle)
tl.add(new Tween(target2.dataset).to({y: 200}, 600).easing(Easing.Quadratic.InOut), {yoyo: true})

// yoyo+repeat timeline (2400 ms cycle)
tl.add(new Tween(target3.dataset).to({y: 200}, 600).easing(Easing.Quadratic.InOut), {yoyo: true, repeat: 2})
```

The `yoyo` timeline finishes at frame time ~1200.024 ms (frame interval ~16.667
ms). Its `start` call sets `_startTime = 1200.024`. Children at offset 0
subsequently see `elapsedTime = t - 1200.024`, a 0.024 ms offset.

The `yoyo+repeat:2` timeline does NOT restart at 1200 ms. Instead, its forward
clone at offset 1200 starts with `child.start(1200)` — the **exact** offset, no
wall-clock overshoot. It subsequently sees `elapsedTime = t - 1200`.

At frame t ≈ 1216.691 ms, these two elapsed times are:

- yoyo: `16.667` (1216.691 − 1200.024 = 16.667)
- yoyo+repeat: `16.691` (1216.691 − 1200 = 16.691)

This 0.024 ms difference in elapsed propagates through the Quadratic.InOut
easing, reaching **~0.016 px** value difference mid-cycle (at the steepest part
of the curve). In a real browser with variable frame timing, the offset can be
larger and compound further.

### Snapshot data before fix

```
t=  1500: y2=100.004000, y3=100.019999 diff=0.015999 ***
t=  2100: y2= 99.988000, y3= 99.972002 diff=0.015998 ***
t=  2400: y2=  0.000000, y3=  0.000000 diff=0.000000 (resync)
```

After the fix, both targets produce identical values at every frame:

```
t=  1500: y2=100.019999, y3=100.019999 diff=0.000000
t=  2100: y2= 99.972002, y3= 99.972002 diff=0.000000
```

## Root cause

In `Timeline.start(time)`, the `_startTime` was unconditionally set to the
wall-clock `time` parameter. When the timeline restarts after finishing, `time`
overshoots the ideal cycle boundary by up to one frame interval, creating a
permanent sub-frame offset in the next cycle's clock.

The longer `yoyo+repeat:2` timeline avoids this because its extra clips start at
precise offsets (1200, 1800) within the single longer cycle — no restart, no
wall-clock overshoot.

## Fix (3 locations, `src/Timeline.ts`)

### 1. New field `_nextStartTime`

```ts
private _nextStartTime: number | undefined
```

Stored when the timeline finishes — the **ideal** next-cycle boundary.

### 2. Store the boundary in `update()`

```ts
if (this._duration === 0 || time >= this._startTime + this._duration) {
	if (this._onCompleteCallback) this._onCompleteCallback(this)
	// Store the ideal next-cycle boundary so start() snaps to it
	// instead of the overshooting wall-clock time.
	this._nextStartTime = this._startTime + this._duration
	this._isPlaying = false
	return false
}
```

Before returning `false`, the ideal boundary `_startTime + _duration` is stored.
For the first finish of the yoyo timeline (duration 1200 ms, `_startTime`
initially 0), this stores 1200 — exactly where the next cycle should begin.

### 3. Conditionally use the boundary in `start()`

```ts
// Snap to the ideal cycle boundary when restarting a finished
// timeline, so repeated timelines stay in sync with longer ones.
// Only when the caller's time is at or past the boundary;
// a time before the boundary means a deliberate scrub-back.
this._startTime = this._nextStartTime !== undefined && time >= this._nextStartTime ? this._nextStartTime : time
this._nextStartTime = undefined
```

- **`time >= _nextStartTime`** (forward restart): Uses the stored boundary.
  The yoyo timeline's restart at time 1200.024 sees `1200.024 >= 1200` → uses
  `1200`. Children see `elapsedTime = t - 1200`, perfectly aligned with the
  longer timeline's clone.
- **`time < _nextStartTime`** (scrub-back): Falls through to `time`. Preserves
  the existing scrub-to-start behavior tested in the unit suite.
- **`_nextStartTime` undefined** (fresh start): Falls through to `time`. No
  change for initial starts.

## Backward compatibility

All 1063 unit assertions pass. E2E visual regression snapshots updated. The
scrub-back test (`Timeline scrubbing back to start restores start values`)
correctly triggers the `time < _nextStartTime` branch and preserves the original
`start(time)` semantics.

## Affected code

| File                              | Change                                                                  |
| --------------------------------- | ----------------------------------------------------------------------- |
| `src/Timeline.ts`                 | +`_nextStartTime` field, store boundary in `update()`, use in `start()` |
| `e2e/timeline.spec.ts-snapshots/` | Updated snapshots for `22_timeline_repeat` test                         |
