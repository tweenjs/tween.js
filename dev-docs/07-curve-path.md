## Curve/Path primitives (`#721`)

Tween stays a scalar progress animator; `Curve`/`Path` own the shape of motion.
This replaces the array-`to()` + `Interpolation` path (see `#655`) without
removing it yet (that is a future major-version break):

```js
const curve = new CatmullRomCurve([
	{x: 0, y: 0},
	{x: 100, y: 0},
	{x: 100, y: 100},
])
const position = {x: 0, y: 0}
const progress = {t: 0}

new Tween(progress)
	.to({t: 1}, 2000)
	.onUpdate(() => curve.getPoint(progress.t, position))
	.start()
```

- Adapted from Three.js `Curve` core (MIT, attributed in `src/Curve.ts`),
  but dependency-free: points are plain `{x, y}` / `{x, y, z}` objects, so
  any renderer or physics engine can consume them.
- Minimal set: `Curve` base (`getPoint`, `getPointAt`, `getPoints`,
  `getSpacedPoints`, `getLength(s)`, `getUtoTmapping`, `getTangent(At)`,
  `updateArcLengths`, `clone`/`copy`) plus `LineCurve`,
  `QuadraticBezierCurve`, `CubicBezierCurve`, `CatmullRomCurve`
  (`centripetal` default, `chordal`, `catmullrom` + `tension`), and
  `CurvePath` (arc-length-distributed `t` across children, `add`,
  `closePath`, `getCurveLengths`). `Path` is an alias of `CurvePath`.
- `getPoint(t, optionalTarget)` mutates and returns the target, so the
  tweened object itself can be the target. Outputs never gain a `z` key:
  2D points stay 2D; sampling a 3D curve needs a 3D target (enforced by
  generics in TS, guarded at runtime for JS).
- Demo: `examples/23_curve_path.html` drives one dot along a
  `CatmullRomCurve` and another along a `CurvePath` (line + cubic), each
  with a 0 → 1 tween that restarts in `onComplete` (no deprecated
  `repeat`/`yoyo` in new sample code). Layout follows `06`: relative
  `#info`, zeroed body margin, 13px padded `#target`.
- Tests: five `Curve` cases in `src/tests.ts` (endpoints, control-point
  interpolation, path chaining by length, the 0 → 1 demo pattern, 3D
  sampling), plus three `Interpolation`-equivalence cases locking the
  migration path: `Cubic`/`QuadraticBezierCurve` equal
  `Interpolation.Bezier` for the same control values (14 digits),
  `CatmullRomCurve(points, false, 'catmullrom', 0.5)` hits the same knots
  as `Interpolation.CatmullRom`, and a `CurvePath` of `LineCurve`s equals
  `Interpolation.Linear` for evenly spaced values. All 1156 unit assertions pass; `npm run build` is clean.

Deferred (not in this change):

- Deprecating/removing array `to()` values and `Tween.interpolation`
  (major-version break per `#655`).
- `toJSON`/`fromJSON`, Frenet frames, ellipse/arc/spline curve types —
  port on demand, not up front.
- An e2e visual snapshot for the new example.

Test-writing gotcha found while verifying: nodeunit formats assertion
messages lazily, so `deepEqual(position, …)` on a mutating object reports
the object's final value, not the value at assert time. Snapshot scalars
(`position.x`) or compare before further updates when asserting animated
state.

✅ Implemented — PR [#725](https://github.com/tweenjs/tween.js/pull/725) open (`feat/curve-path` → `main`)
