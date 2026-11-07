/**
 * Curve/Path primitives for tween.js, adapted from Three.js (MIT License).
 * https://github.com/mrdoob/three.js — src/extras/core/Curve.js and
 * src/extras/curves/* — Copyright (c) 2010-2026 three.js authors.
 *
 * Why this exists (see https://github.com/tweenjs/tween.js/issues/721):
 * array `to()` values blur the concept of a Tween (see
 * https://github.com/tweenjs/tween.js/issues/655). Instead, keep Tween
 * simple (a scalar 0 -> 1 progress) and sample a decoupled Curve/Path:
 *
 * ```js
 * import {Tween, Easing, CatmullRomCurve} from '@tweenjs/tween.js'
 *
 * const curve = new CatmullRomCurve([{x: 0, y: 0}, {x: 100, y: 0}, {x: 100, y: 100}])
 * const position = {x: 0, y: 0}
 * const progress = {t: 0}
 *
 * new Tween(progress)
 * 	.to({t: 1}, 2000)
 * 	.easing(Easing.Linear.None)
 * 	.onUpdate(() => curve.getPoint(progress.t, position))
 * 	.start()
 * ```
 *
 * Points are plain objects (`{x, y}` or `{x, y, z}`) so they work with any
 * renderer or physics engine — no `THREE.Vector` dependency. When an
 * `optionalTarget` is given, it is mutated and returned, so a tweened
 * object can be used directly as the target.
 */

/** A 2D point sampled or driven by a curve. */
export type Point2D = {x: number; y: number}

/** A 3D point sampled or driven by a curve. */
export type Point3D = {x: number; y: number; z: number}

/** Any point a curve can sample. Missing `z` is treated as `0`. */
export type Point = Point2D | Point3D

function getZ(p: Point): number {
	return (p as Point3D).z ?? 0
}

function clonePoint<T extends Point>(p: T): T {
	const out = {x: p.x, y: p.y} as T
	if ('z' in p) (out as Point3D).z = (p as Point3D).z
	return out
}

function copyPoint<T extends Point>(target: T, source: Point): T {
	target.x = source.x
	target.y = source.y
	// Never add a `z` key to a 2D target; only refresh it when present so
	// 2D points stay 2D (nodeunit diffs are by reference, extra keys fail).
	if ('z' in target) (target as Point3D).z = getZ(source)
	return target
}

function distanceBetween(a: Point, b: Point): number {
	const dx = b.x - a.x
	const dy = b.y - a.y
	const dz = getZ(b) - getZ(a)
	return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Abstract base class for analytic curves. Subclasses implement `getPoint(t)`.
 * Arc-length helpers (`getPointAt`, `getTangentAt`, …) are shared here and
 * mirror the Three.js `Curve` API.
 */
export abstract class Curve<T extends Point = Point> {
	type = 'Curve'

	/**
	 * Divisions used when caching cumulative segment lengths via `getLengths()`.
	 * Increase it for very large curves when using `getPointAt()`/`getSpacedPoints()`.
	 */
	arcLengthDivisions = 200

	/** Set to `true` when curve parameters change, to invalidate the length cache. */
	needsUpdate = false

	private cacheArcLengths: Array<number> | null = null

	/**
	 * Position on the curve for interpolation factor `t` in `[0, 1]`.
	 * When `optionalTarget` is given it is mutated and returned.
	 */
	abstract getPoint(t: number, optionalTarget?: T): T

	/**
	 * Like `getPoint()`, but `u` is mapped to arc length, so samples are
	 * equidistant along the curve.
	 */
	getPointAt(u: number, optionalTarget?: T): T {
		const t = this.getUtoTmapping(u)
		return this.getPoint(t, optionalTarget)
	}

	/** Sample the curve via `getPoint()` into `divisions + 1` points. */
	getPoints(divisions = 5): Array<T> {
		const points: Array<T> = []
		for (let d = 0; d <= divisions; d++) points.push(this.getPoint(d / divisions))
		return points
	}

	/** Sample the curve via `getPointAt()` into `divisions + 1` equidistant points. */
	getSpacedPoints(divisions = 5): Array<T> {
		const points: Array<T> = []
		for (let d = 0; d <= divisions; d++) points.push(this.getPointAt(d / divisions))
		return points
	}

	/** Total arc length of the curve. */
	getLength(): number {
		const lengths = this.getLengths()
		return lengths[lengths.length - 1]
	}

	/** Cumulative segment lengths of the curve. */
	getLengths(divisions = this.arcLengthDivisions): Array<number> {
		if (this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate)
			return this.cacheArcLengths

		this.needsUpdate = false

		const cache: Array<number> = []
		let current: T
		let last = this.getPoint(0)
		let sum = 0

		cache.push(0)

		for (let p = 1; p <= divisions; p++) {
			current = this.getPoint(p / divisions)
			sum += distanceBetween(current, last)
			cache.push(sum)
			last = current
		}

		this.cacheArcLengths = cache
		return cache
	}

	/** Invalidate the cached lengths (call after changing curve parameters). */
	updateArcLengths(): void {
		this.needsUpdate = true
		this.getLengths()
	}

	/**
	 * Map an arc-length factor `u` in `[0, 1]` to the `t` that samples the
	 * same distance. Used by `getPointAt()`/`getTangentAt()`.
	 */
	getUtoTmapping(u: number, distance: number | null = null): number {
		const arcLengths = this.getLengths()
		const il = arcLengths.length

		const targetArcLength = distance ?? u * arcLengths[il - 1]

		// Binary search for the largest index smaller than the target length.
		let low = 0
		let high = il - 1
		let i = 0

		while (low <= high) {
			i = Math.floor(low + (high - low) / 2)
			const comparison = arcLengths[i] - targetArcLength

			if (comparison < 0) low = i + 1
			else if (comparison > 0) high = i - 1
			else {
				high = i
				break
			}
		}

		i = high

		if (arcLengths[i] === targetArcLength) return i / (il - 1)

		const lengthBefore = arcLengths[i]
		const lengthAfter = arcLengths[i + 1]
		const segmentLength = lengthAfter - lengthBefore
		const segmentFraction = (targetArcLength - lengthBefore) / segmentLength
		return (i + segmentFraction) / (il - 1)
	}

	/**
	 * Unit tangent for factor `t`, via a small finite difference. Returns a
	 * fresh point unless `optionalTarget` is given.
	 */
	getTangent(t: number, optionalTarget?: T): T {
		const delta = 0.0001
		const t1 = Math.max(t - delta, 0)
		const t2 = Math.min(t + delta, 1)

		const pt1 = this.getPoint(t1)
		const pt2 = this.getPoint(t2)

		const tangent = (optionalTarget ?? clonePoint(pt1)) as T
		const dx = pt2.x - pt1.x
		const dy = pt2.y - pt1.y
		const dz = getZ(pt2) - getZ(pt1)
		const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1

		tangent.x = dx / len
		tangent.y = dy / len
		// Only refresh `z` when the output already carries it; never widen 2D points.
		if ('z' in tangent) (tangent as Point3D).z = dz / len

		return tangent
	}

	/** Like `getTangent()`, but for the arc-length factor `u`. */
	getTangentAt(u: number, optionalTarget?: T): T {
		const t = this.getUtoTmapping(u)
		return this.getTangent(t, optionalTarget)
	}

	/** Copy shared settings from another curve. */
	copy(source: Curve<T>): this {
		this.arcLengthDivisions = source.arcLengthDivisions
		this.cacheArcLengths = null
		return this
	}

	abstract clone(): Curve<T>
}

/** Straight segment between two points. */
export class LineCurve<T extends Point = Point> extends Curve<T> {
	override type = 'LineCurve'

	constructor(
		public v1: T,
		public v2: T,
	) {
		super()
	}

	override getPoint(t: number, optionalTarget?: T): T {
		const point = (optionalTarget ?? clonePoint(this.v1)) as T
		point.x = this.v1.x + (this.v2.x - this.v1.x) * t
		point.y = this.v1.y + (this.v2.y - this.v1.y) * t
		if ('z' in point) (point as Point3D).z = getZ(this.v1) + (getZ(this.v2) - getZ(this.v1)) * t
		return point
	}

	override copy(source: LineCurve<T>): this {
		super.copy(source)
		this.v1 = clonePoint(source.v1)
		this.v2 = clonePoint(source.v2)
		return this
	}

	override clone(): LineCurve<T> {
		return new LineCurve<T>(clonePoint(this.v1), clonePoint(this.v2)).copy(this)
	}
}

function quadraticBezier(p0: number, p1: number, p2: number, t: number): number {
	const oneMinusT = 1 - t
	return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2
}

function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
	const oneMinusT = 1 - t
	const a = oneMinusT * oneMinusT * oneMinusT * p0
	const b = 3 * oneMinusT * oneMinusT * t * p1
	const c = 3 * oneMinusT * t * t * p2
	const d = t * t * t * p3
	return a + b + c + d
}

/** Quadratic Bézier curve through three control points. */
export class QuadraticBezierCurve<T extends Point = Point> extends Curve<T> {
	override type = 'QuadraticBezierCurve'

	constructor(
		public v0: T,
		public v1: T,
		public v2: T,
	) {
		super()
	}

	override getPoint(t: number, optionalTarget?: T): T {
		const point = (optionalTarget ?? clonePoint(this.v0)) as T
		point.x = quadraticBezier(this.v0.x, this.v1.x, this.v2.x, t)
		point.y = quadraticBezier(this.v0.y, this.v1.y, this.v2.y, t)
		if ('z' in point) (point as Point3D).z = quadraticBezier(getZ(this.v0), getZ(this.v1), getZ(this.v2), t)
		return point
	}

	override copy(source: QuadraticBezierCurve<T>): this {
		super.copy(source)
		this.v0 = clonePoint(source.v0)
		this.v1 = clonePoint(source.v1)
		this.v2 = clonePoint(source.v2)
		return this
	}

	override clone(): QuadraticBezierCurve<T> {
		return new QuadraticBezierCurve<T>(clonePoint(this.v0), clonePoint(this.v1), clonePoint(this.v2)).copy(this)
	}
}

/** Cubic Bézier curve through four control points. */
export class CubicBezierCurve<T extends Point = Point> extends Curve<T> {
	override type = 'CubicBezierCurve'

	constructor(
		public v0: T,
		public v1: T,
		public v2: T,
		public v3: T,
	) {
		super()
	}

	override getPoint(t: number, optionalTarget?: T): T {
		const point = (optionalTarget ?? clonePoint(this.v0)) as T
		point.x = cubicBezier(this.v0.x, this.v1.x, this.v2.x, this.v3.x, t)
		point.y = cubicBezier(this.v0.y, this.v1.y, this.v2.y, this.v3.y, t)
		if ('z' in point) (point as Point3D).z = cubicBezier(getZ(this.v0), getZ(this.v1), getZ(this.v2), getZ(this.v3), t)
		return point
	}

	override copy(source: CubicBezierCurve<T>): this {
		super.copy(source)
		this.v0 = clonePoint(source.v0)
		this.v1 = clonePoint(source.v1)
		this.v2 = clonePoint(source.v2)
		this.v3 = clonePoint(source.v3)
		return this
	}

	override clone(): CubicBezierCurve<T> {
		return new CubicBezierCurve<T>(
			clonePoint(this.v0),
			clonePoint(this.v1),
			clonePoint(this.v2),
			clonePoint(this.v3),
		).copy(this)
	}
}

export type CatmullRomCurveType = 'centripetal' | 'chordal' | 'catmullrom'

function catmullRomInterpolate(p0: number, p1: number, p2: number, p3: number, t: number, tension: number): number {
	const v0 = (p2 - p0) * tension
	const v1 = (p3 - p1) * tension
	const t2 = t * t
	const t3 = t2 * t
	return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
}

function nonUniformCatmullRomInterpolate(
	p0: number,
	p1: number,
	p2: number,
	p3: number,
	t: number,
	dt0: number,
	dt1: number,
	dt2: number,
): number {
	// Centripetal/chordal tangents, adapted from Three.js CatmullRomCurve3.
	let t1 = (p1 - p0) / dt0 - (p2 - p0) / (dt0 + dt1) + (p2 - p1) / dt1
	let t2 = (p2 - p1) / dt1 - (p3 - p1) / (dt1 + dt2) + (p3 - p2) / dt2
	t1 *= dt1
	t2 *= dt1

	const c0 = p1
	const c1 = t1
	const c2 = -3 * p1 + 3 * p2 - 2 * t1 - t2
	const c3 = 2 * p1 - 2 * p2 + t1 + t2
	return c0 + c1 * t + c2 * t * t + c3 * t * t * t
}

/**
 * Smooth spline through a list of points. `centripetal` (default) avoids
 * cusps and self-intersections on unevenly spaced points.
 */
export class CatmullRomCurve<T extends Point = Point> extends Curve<T> {
	override type = 'CatmullRomCurve'

	constructor(
		public points: Array<T> = [],
		public closed = false,
		public curveType: CatmullRomCurveType = 'centripetal',
		public tension = 0.5,
	) {
		super()
	}

	override getPoint(t: number, optionalTarget?: T): T {
		const points = this.points
		const l = points.length

		if (l === 0) throw new Error('CatmullRomCurve needs at least one point.')
		if (l === 1) return copyPoint((optionalTarget ?? clonePoint(points[0])) as T, points[0])
		if (l === 2) {
			// Degrade to a line so two-point paths still animate.
			const point = (optionalTarget ?? clonePoint(points[0])) as T
			point.x = points[0].x + (points[1].x - points[0].x) * t
			point.y = points[0].y + (points[1].y - points[0].y) * t
			if ('z' in point) (point as Point3D).z = getZ(points[0]) + (getZ(points[1]) - getZ(points[0])) * t
			return point
		}

		const point = (optionalTarget ?? clonePoint(points[0])) as T
		const p = (l - (this.closed ? 0 : 1)) * t
		let intPoint = Math.floor(p)
		let weight = p - intPoint

		if (this.closed) {
			intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / l) + 1) * l
		} else if (weight === 0 && intPoint === l - 1) {
			intPoint = l - 2
			weight = 1
		}

		let p0: Point
		let p3: Point

		if (this.closed || intPoint > 0) {
			p0 = points[(intPoint - 1) % l]
		} else {
			// Extrapolate the first point.
			p0 = {
				x: 2 * points[0].x - points[1].x,
				y: 2 * points[0].y - points[1].y,
				z: 2 * getZ(points[0]) - getZ(points[1]),
			}
		}

		const p1 = points[intPoint % l]
		const p2 = points[(intPoint + 1) % l]

		if (this.closed || intPoint + 2 < l) {
			p3 = points[(intPoint + 2) % l]
		} else {
			// Extrapolate the last point.
			const n = l - 1
			p3 = {
				x: 2 * points[n].x - points[n - 1].x,
				y: 2 * points[n].y - points[n - 1].y,
				z: 2 * getZ(points[n]) - getZ(points[n - 1]),
			}
		}

		if (this.curveType === 'centripetal' || this.curveType === 'chordal') {
			const pow = this.curveType === 'chordal' ? 0.5 : 0.25
			let dt0 = Math.pow(distanceBetween(p0, p1) ** 2, pow)
			let dt1 = Math.pow(distanceBetween(p1, p2) ** 2, pow)
			let dt2 = Math.pow(distanceBetween(p2, p3) ** 2, pow)

			if (dt1 < 1e-4) dt1 = 1.0
			if (dt0 < 1e-4) dt0 = dt1
			if (dt2 < 1e-4) dt2 = dt1

			point.x = nonUniformCatmullRomInterpolate(p0.x, p1.x, p2.x, p3.x, weight, dt0, dt1, dt2)
			point.y = nonUniformCatmullRomInterpolate(p0.y, p1.y, p2.y, p3.y, weight, dt0, dt1, dt2)
			if ('z' in point)
				(point as Point3D).z = nonUniformCatmullRomInterpolate(
					getZ(p0),
					getZ(p1),
					getZ(p2),
					getZ(p3),
					weight,
					dt0,
					dt1,
					dt2,
				)
		} else {
			point.x = catmullRomInterpolate(p0.x, p1.x, p2.x, p3.x, weight, this.tension)
			point.y = catmullRomInterpolate(p0.y, p1.y, p2.y, p3.y, weight, this.tension)
			if ('z' in point)
				(point as Point3D).z = catmullRomInterpolate(getZ(p0), getZ(p1), getZ(p2), getZ(p3), weight, this.tension)
		}

		return point
	}

	override copy(source: CatmullRomCurve<T>): this {
		super.copy(source)
		this.points = source.points.map(p => clonePoint(p))
		this.closed = source.closed
		this.curveType = source.curveType
		this.tension = source.tension
		return this
	}

	override clone(): CatmullRomCurve<T> {
		return new CatmullRomCurve<T>([], this.closed, this.curveType, this.tension).copy(this)
	}
}

/**
 * A path made of chained curves. `t` in `[0, 1]` is distributed by arc
 * length, so a Tween driving `t` moves at near-constant speed when sampled
 * with `getPointAt()`, and proportionally through each child with `getPoint()`.
 */
export class CurvePath<T extends Point = Point> extends Curve<T> {
	override type = 'CurvePath'

	public curves: Array<Curve<T>> = []
	public autoClose = false

	constructor(curves: Array<Curve<T>> = []) {
		super()
		this.curves = curves
	}

	/** Add a curve to the end of the path. */
	add(curve: Curve<T>): this {
		this.curves.push(curve)
		this.updateArcLengths()
		return this
	}

	/** Connect the end of the path back to the start with a line. */
	closePath(): this {
		if (this.curves.length === 0) return this

		const start = this.curves[0].getPoint(0)
		const end = this.curves[this.curves.length - 1].getPoint(1)
		if (distanceBetween(start, end) > Number.EPSILON) this.add(new LineCurve<T>(clonePoint(end), clonePoint(start)))

		this.autoClose = true
		return this
	}

	/** Length of each child curve (cached until the path changes). */
	getCurveLengths(): Array<number> {
		return this.curves.map(curve => curve.getLength())
	}

	override getPoint(t: number, optionalTarget?: T): T {
		if (this.curves.length === 0) throw new Error('CurvePath needs at least one curve. Use path.add(curve).')
		if (this.curves.length === 1) return this.curves[0].getPoint(t, optionalTarget)

		// Distribute `t` by arc length so short segments are not over-weighted.
		const lengths = this.getCurveLengths()
		const total = lengths.reduce((sum, len) => sum + len, 0)
		let target = t * total
		let i = 0

		while (i < lengths.length - 1 && target > lengths[i]) {
			target -= lengths[i]
			i++
		}

		const fraction = lengths[i] === 0 ? 0 : target / lengths[i]
		return this.curves[i].getPoint(fraction, optionalTarget)
	}

	override getLength(): number {
		return this.getCurveLengths().reduce((sum, len) => sum + len, 0)
	}

	override updateArcLengths(): void {
		this.needsUpdate = true
		for (const curve of this.curves) curve.updateArcLengths()
		super.updateArcLengths()
	}

	override copy(source: CurvePath<T>): this {
		super.copy(source)
		this.curves = source.curves.map(curve => curve.clone() as Curve<T>)
		this.autoClose = source.autoClose
		return this
	}

	override clone(): CurvePath<T> {
		return new CurvePath<T>().copy(this)
	}
}

/**
 * Alias matching the `Curve`/`Path` naming in
 * https://github.com/tweenjs/tween.js/issues/721. A `Path` is a `CurvePath`:
 * an ordered list of curves sampled with a single `t` in `[0, 1]`.
 */
export type Path<T extends Point = Point> = CurvePath<T>
export const Path = CurvePath

export default Curve
