## TimeScaler (`#722`)

`TimeScaler` owns time scaling so `Tween` stays a simple progress animator
(see `#655`). It maps a monotonic source clock (for example
`requestAnimationFrame` timestamps, assumed to progress uniformly) plus a
dynamic scale value into scaled times that can feed `Tween.update()`,
`Group.update()`, or `Timeline.update()` with no changes inside those
classes — unlike the old in-`Tween` `timeScale` experiment on the
`timescale` branch, which divided duration by a per-tween factor.

```js
const scaler = new TimeScaler(1)
tween.start(scaler.update(performance.now()))

function animate(time) {
	requestAnimationFrame(animate)
	tween.update(scaler.update(time))
}

scaler.setScale(0.5) // slow motion
scaler.setScale(0) // freeze
scaler.setScale(2) // fast-forward
```

- Semantics: scale `1` is the identity (`update(t) === t`), so wrapping an
  existing loop is drop-in. Later calls advance by
  `(raw - lastRaw) * scale`: `0` freezes, `0..1` slows, `>1` speeds up,
  negative runs the scaled clock backwards. The first `update(raw)`
  anchors both clocks and returns its input, so `start(scaler.update(t0))`
  aligns with the source clock.
- Minimal API, same chaining style as `Tween`/`Timeline`: `new
TimeScaler(scale?)`, `setScale()`/`getScale()`, `update(rawTime?)`
  (defaults to `now()`), `getTime()` (last scaled time), `reset()`
  (forget the anchor so the next `update()` re-anchors for replay).
  `setScale` applies from the next delta on; raw time kept flowing while
  frozen, so resume never jumps.
- Demo: `examples/24_timescaler.html` drives one box with a tween that loops
  forever via the `update() === false → start()` pattern from example 22
  (restarting inside `onComplete` cannot work: `start()` is a no-op while
  the tween is still flagged playing, and `update()` clears the flag right
  after the callback). No deprecated `repeat`/`yoyo` in new sample code; a
  slider sets the scale live from `0` to `2`.
- Tests: eight `TimeScaler` cases in `src/tests.ts` (identity, 2x, half
  speed, freeze/resume without jumping, mid-flight scale change, reset
  re-anchor, negative scale, `Group` + `Timeline` driving).

Deferred (not in this change):

- Wiring a scaler into `Group`/`Timeline` as an owned clock (they
  intentionally stay clock-agnostic: the caller maps the time).
- Pause/resume helpers on the scaler itself (`setScale(0)` covers it).
- An e2e visual snapshot for the new example.

✅ Implemented
