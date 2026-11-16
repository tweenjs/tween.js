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
const startTime = performance.now()
scaler.start(startTime)
tween.start(startTime)

function animate(time) {
	requestAnimationFrame(animate)
	tween.update(scaler.update(time))
}

scaler.scale = 0.5 // slow motion
scaler.scale = 0 // freeze
scaler.scale = 2 // fast-forward
```

- Semantics: a constant scale of `1` is the identity (`update(t) === t`).
  Calls advance by
  `(raw - lastRaw) * scale`: `0` freezes, `0..1` slows, `>1` speeds up,
  negative runs the scaled clock backwards. `start(raw)` anchors both clocks
  immediately; use the same raw time to start a tween so the first frame's
  elapsed time is scaled. Without `start()`, the first `update(raw)` anchors
  both clocks and returns its input.
- Minimal API: `new TimeScaler(scale?)`, `scale` (a tweenable property),
  `start(rawTime?)`, `update(rawTime?)` (both default to `now()`),
  `getTime()` (last scaled time or start time), `reset()`
  (forget the anchor so the next `update()` re-anchors for replay).
  `scale` applies to the next delta; raw time kept flowing while
  frozen, so resume never jumps.
- Demo: `examples/25_timescaler.html` drives one box with a tween that loops
  forever via the `update() === false → start()` pattern from example 22
  (restarting inside `onComplete` cannot work: `start()` is a no-op while
  the tween is still flagged playing, and `update()` clears the flag right
  after the callback). No deprecated `repeat`/`yoyo` in new sample code; a
  slider sets the scale live from `0` to `2`; a separate raw-clock tween
  can animate the scale from `0` to `1`. The scaler is updated before that
  tween each frame so the sampled scale applies to the next interval.
- Tests cover delayed first frames, explicit and default anchoring, identity,
  2x, half speed, freeze/resume, mid-flight and tweened scale changes, reset,
  negative scale, `Group` + `Timeline` driving, and looping.

Deferred (not in this change):

- Wiring a scaler into `Group`/`Timeline` as an owned clock (they
  intentionally stay clock-agnostic: the caller maps the time).
- Pause/resume helpers on the scaler itself (`scale = 0` covers it).
- An e2e visual snapshot for the new example.

✅ Implemented
