/**
 * Curve-tool pure model (no DOM, no tween.js dependency).
 *
 * The tool edits a multi-point easing path — the same idea as After
 * Effects / Premiere keyframes: an ordered list of points from (0, 0)
 * to (1, 1), joined by cubic Bézier segments with per-segment handles.
 * `x` is normalized time, `y` is eased progress (allowed to overshoot
 * outside [0, 1], like Back/Elastic).
 *
 * Segment solving follows the CSS `cubic-bezier()` spec: given an input
 * `x`, find its segment, invert x(t) with Newton-Raphson (+ bisection
 * fallback) and return y(t).
 *
 * SVG interchange uses a `0 0 100 100` box with SVG-native y-down
 * coordinates: easing (x, y) maps to (100·x, 100·(1−y)). Paths pasted
 * from Figma/Illustrator (M/L/C/H/V, absolute or relative) import
 * directly, and exported paths paste straight back into those tools.
 */

/** Value range for eased progress (overshoot allowed, AE-style). */
export const LIMITS = Object.freeze({yMin: -1, yMax: 2})

/** Smallest gap kept between consecutive point times. */
const MIN_GAP = 1e-4

function pt(x, y) {
	return {x, y}
}

function seg(c1, c2) {
	return {c1: {...c1}, c2: {...c2}}
}

function thirds(p0, p3) {
	return seg(
		pt(p0.x + (p3.x - p0.x) / 3, p0.y + (p3.y - p0.y) / 3),
		pt(p0.x + ((p3.x - p0.x) * 2) / 3, p0.y + ((p3.y - p0.y) * 2) / 3),
	)
}

/** The default curve: a single Ease segment. */
export function createDefault() {
	return {points: [pt(0, 0), pt(1, 1)], handles: [seg(pt(0.25, 0.1), pt(0.25, 1))]}
}

export function cloneCurve(curve) {
	return JSON.parse(JSON.stringify(curve))
}

/** Gallery presets: classics plus multi-point Bounce / Overshoot shapes. */ export function createPreset(name) {
	const P = (points, handles) => ({points: points.map(([x, y]) => pt(x, y)), handles})
	switch (name) {
		case 'Linear':
			return P(
				[
					[0, 0],
					[1, 1],
				],
				[seg(pt(1 / 3, 1 / 3), pt(2 / 3, 2 / 3))],
			)
		case 'Ease In Out':
			return P(
				[
					[0, 0],
					[1, 1],
				],
				[seg(pt(0.42, 0), pt(0.58, 1))],
			)
		case 'Overshoot':
			return P(
				[
					[0, 0],
					[0.7, 1.12],
					[1, 1],
				],
				[seg(pt(0.3, 0), pt(0.55, 1.1)), seg(pt(0.8, 1.12), pt(0.9, 1))],
			)
		case 'Bounce':
			return P(
				[
					[0, 0],
					[0.45, 0.78],
					[0.65, 0.42],
					[0.8, 0.66],
					[0.9, 0.52],
					[1, 1],
				],
				[
					seg(pt(0.2, 0.1), pt(0.35, 0.6)),
					seg(pt(0.52, 0.9), pt(0.6, 0.6)),
					seg(pt(0.7, 0.3), pt(0.75, 0.55)),
					seg(pt(0.84, 0.74), pt(0.87, 0.6)),
					seg(pt(0.93, 0.47), pt(0.96, 0.7)),
				],
			)
		case 'Anticipation':
			return P(
				[
					[0, 0],
					[0.35, -0.28],
					[1, 1],
				],
				[seg(pt(0.15, 0), pt(0.28, -0.26)), seg(pt(0.5, -0.3), pt(0.75, 0.4))],
			)
		case 'Ease':
		default:
			return P(
				[
					[0, 0],
					[1, 1],
				],
				[seg(pt(0.25, 0.1), pt(0.25, 1))],
			)
	}
}

export const PRESET_NAMES = ['Linear', 'Ease', 'Ease In Out', 'Overshoot', 'Bounce', 'Anticipation']

/** Easing source list: editable Custom path plus locked built-ins. */
export const SOURCES = [
	'Custom',
	'Linear.None',
	'Quadratic.InOut',
	'Cubic.InOut',
	'Sinusoidal.InOut',
	'Back.Out',
	'Elastic.Out',
	'Bounce.Out',
]

/** Backwards-compatible alias (the source selector replaced the overlay). */
export const OVERLAYS = SOURCES.slice(1)

/** A source is `{kind: 'custom', curve} | {kind: 'builtin', name}`. */
export function customSource(curve) {
	return {kind: 'custom', curve}
}

export function builtinSource(name) {
	return {kind: 'builtin', name}
}

export function isCustomSource(source) {
	return source && source.kind === 'custom'
}

/** Insert a keyframe on the curve at time x (snapped to the curve shape),
 * splitting its segment with de Casteljau handles; returns the new index. */
export function addPoint(curve, x) {
	const c = cloneCurve(curve)
	const cx = clamp(x, 0, 1)
	let i = 0
	while (i < c.points.length - 1 && c.points[i + 1].x < cx) i++
	const p0 = c.points[i]
	const p3 = c.points[i + 1]
	if (p3.x - p0.x < MIN_GAP * 2) return {curve: c, index: i}
	const safeX = Math.min(Math.max(cx, p0.x + MIN_GAP), p3.x - MIN_GAP)
	// Split the segment (de Casteljau at t); the knot is the on-curve split
	// point. On x-looping segments the split can fall outside the span —
	// then fall back to an evaluated knot with thirds handles.
	const t = (safeX - p0.x) / (p3.x - p0.x)
	const h = c.handles[i]
	const [left, mid, right] = splitCubic(p0, h.c1, h.c2, p3, clamp(t, 0.05, 0.95))
	let knot = pt(mid.x, mid.y)
	let halves = [seg(left.c1, left.c2), seg(right.c1, right.c2)]
	if (!(knot.x > p0.x + MIN_GAP / 2 && knot.x < p3.x - MIN_GAP / 2)) {
		knot = pt(safeX, makeEasing(c)(safeX))
		halves = [thirds(p0, knot), thirds(knot, p3)]
	}
	c.points.splice(i + 1, 0, knot)
	c.handles.splice(i, 1, halves[0], halves[1])
	return {curve: c, index: i + 1}
}

/** de Casteljau split of a cubic at t; returns {left, mid, right} handle sets. */
function splitCubic(p0, c1, c2, p3, t) {
	const lerp = (a, b) => pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
	const a = lerp(p0, c1)
	const b = lerp(c1, c2)
	const d = lerp(c2, p3)
	const e = lerp(a, b)
	const f = lerp(b, d)
	const m = lerp(e, f)
	return [seg(a, e), m, seg(f, d)]
}

/** Delete an interior point (endpoints are pinned); returns success. */
export function deletePoint(curve, index) {
	if (index <= 0 || index >= curve.points.length - 1) return null
	const c = cloneCurve(curve)
	c.points.splice(index, 1)
	// Merge the two adjacent segments: keep the outer handles.
	const left = c.handles[index - 1]
	const right = c.handles[index]
	c.handles.splice(index - 1, 2, seg(left.c1, right.c2))
	return c
}

/**
 * Move a point; interior x stays between its neighbours, endpoints stay
 * pinned at x = 0 / 1. Adjacent handles translate with the point so the
 * segment shapes survive the move.
 */
export function movePoint(curve, index, x, y) {
	const c = cloneCurve(curve)
	const p = c.points[index]
	const lo = index === 0 ? 0 : c.points[index - 1].x + MIN_GAP
	const hi = index === c.points.length - 1 ? 1 : c.points[index + 1].x - MIN_GAP
	const nx = index === 0 ? 0 : index === c.points.length - 1 ? 1 : Math.min(Math.max(x, lo), Math.max(hi, lo))
	const ny = index === 0 ? 0 : index === c.points.length - 1 ? 1 : clamp(y, LIMITS.yMin, LIMITS.yMax)
	const dx = nx - p.x
	const dy = ny - p.y
	p.x = nx
	p.y = ny
	if (index > 0) {
		c.handles[index - 1].c2.x += dx
		c.handles[index - 1].c2.y += dy
	}
	if (index < c.handles.length) {
		c.handles[index].c1.x += dx
		c.handles[index].c1.y += dy
	}
	return c
}

/** Move a segment handle (c1/c2 of segment i). */
export function moveHandle(curve, index, which, x, y) {
	const c = cloneCurve(curve)
	if (!c.handles[index] || (which !== 'c1' && which !== 'c2')) return c
	c.handles[index][which].x = clamp(x, 0, 1)
	c.handles[index][which].y = clamp(y, LIMITS.yMin, LIMITS.yMax)
	return c
}

function clamp(v, lo, hi) {
	if (!Number.isFinite(v)) return lo
	return Math.min(hi, Math.max(lo, v))
}

export function isValidCurve(curve) {
	if (!curve || !Array.isArray(curve.points) || !Array.isArray(curve.handles)) return false
	if (curve.points.length < 2 || curve.handles.length !== curve.points.length - 1) return false
	for (const p of curve.points) {
		if (![p.x, p.y].every(v => typeof v === 'number' && Number.isFinite(v))) return false
	}
	for (const h of curve.handles) {
		for (const k of ['c1', 'c2']) {
			if (!h[k] || ![h[k].x, h[k].y].every(v => typeof v === 'number' && Number.isFinite(v))) return false
		}
	}
	const [first, last] = [curve.points[0], curve.points[curve.points.length - 1]]
	if (first.x !== 0 || first.y !== 0 || last.x !== 1 || last.y !== 1) return false
	for (let i = 1; i < curve.points.length; i++) {
		if (!(curve.points[i].x > curve.points[i - 1].x)) return false
	}
	return true
}

function bezier1D(t, p0, p1, p2, p3) {
	const u = 1 - t
	return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

function bezierDerivative(t, p0, p1, p2, p3) {
	const u = 1 - t
	return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2)
}

function solveT(x, p0, c1, c2, p3) {
	let t = p3 - p0 === 0 ? 0 : clamp((x - p0) / (p3 - p0), 0, 1)
	for (let i = 0; i < 8; i++) {
		const err = bezier1D(t, p0, c1, c2, p3) - x
		if (Math.abs(err) < 1e-6) break
		const d = bezierDerivative(t, p0, c1, c2, p3)
		if (Math.abs(d) < 1e-6) break
		t -= err / d
	}
	t = clamp(t, 0, 1)
	let lo = 0
	let hi = 1
	while (hi - lo > 1e-6) {
		const v = bezier1D(t, p0, c1, c2, p3)
		if (Math.abs(v - x) < 1e-6) break
		if (v < x) lo = t
		else hi = t
		t = (lo + hi) / 2
	}
	return t
}

/** Build the easing function for a multi-point curve. */
export function makeEasing(curve) {
	const pts = curve.points
	const hs = curve.handles
	return x => {
		if (x <= 0) return 0
		if (x >= 1) return 1
		let i = 0
		while (i < pts.length - 2 && x > pts[i + 1].x) i++
		const p0 = pts[i]
		const p3 = pts[i + 1]
		const h = hs[i]
		const t = solveT(x, p0.x, h.c1.x, h.c2.x, p3.x)
		return bezier1D(t, p0.y, h.c1.y, h.c2.y, p3.y)
	}
}

/** Sample an easing into `n + 1` [x, y] points for canvas/overlay drawing. */
export function sampleEasing(fn, n = 120) {
	const out = []
	for (let i = 0; i <= n; i++) {
		const x = i / n
		out.push([x, fn(x)])
	}
	return out
}

/** `true` when the curve never decreases (safe for CSS-style usage). */
export function isMonotonic(curve, n = 80) {
	const fn = makeEasing(curve)
	let prev = -Infinity
	for (let i = 0; i <= n; i++) {
		const y = fn(i / n)
		if (y < prev - 1e-9) return false
		prev = y
	}
	return true
}

// ---- SVG path interchange (owneasing-compatible) ----

function r2(v) {
	return String(Math.round(v * 100) / 100)
}

/** Export the curve as SVG path data in a `0 0 100 100` y-down box. */
export function toSVGPath(curve) {
	const X = x => r2(x * 100)
	const Y = y => r2((1 - y) * 100)
	let d = `M${X(curve.points[0].x)},${Y(curve.points[0].y)}`
	for (let i = 0; i < curve.handles.length; i++) {
		const h = curve.handles[i]
		const p = curve.points[i + 1]
		d += ` C${X(h.c1.x)},${Y(h.c1.y)} ${X(h.c2.x)},${Y(h.c2.y)} ${X(p.x)},${Y(p.y)}`
	}
	return d
}

/**
 * Parse SVG path data (M/L/C/H/V, absolute or relative) from a
 * `0 0 100 100` y-down box back into a curve. Other commands throw.
 */
export function parseSVGPath(text) {
	const src = String(text)
	const bad = src
		.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/g, '')
		.match(/[a-zA-Z]/g)
		?.filter(ch => !/[MLCHVZmlchvz]/.test(ch))
	if (bad && bad.length > 0)
		throw new Error(`unsupported path command ${bad[0]} — only M/L/H/V/C import as easings (no Q/S/T/A)`)
	const tokens = src.match(/[MLCHVZmlchvz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)
	if (!tokens || !/[Mm]/.test(tokens[0])) throw new Error('expected an SVG path starting with M (e.g. "M0,100 C…")')
	const X = v => v / 100
	const Y = v => 1 - v / 100
	const points = []
	const handles = []
	let cx = 0
	let cy = 0
	let cmd = ''
	let i = 0
	const num = () => {
		if (i >= tokens.length || /[MLCHVZmlchvz]/.test(tokens[i]))
			throw new Error(`missing number for ${cmd} (token ${i})`)
		return Number(tokens[i++])
	}
	while (i < tokens.length) {
		if (/[MLCHVZmlchvz]/.test(tokens[i])) cmd = tokens[i++]
		if (!cmd) throw new Error('path data must start with a command')
		const rel = cmd === cmd.toLowerCase() && cmd !== 'Z' && cmd !== 'z'
		const C = cmd.toUpperCase()
		if (C === 'Z') throw new Error('closepath (Z) is not an easing — remove it')
		else if (C === 'M') {
			const x = num()
			const y = num()
			cx = rel ? cx + x : x
			cy = rel ? cy + y : y
			points.push(pt(X(cx), Y(cy)))
			cmd = rel ? 'l' : 'L' // further pairs are implicit linetos
		} else if (C === 'L' || C === 'H' || C === 'V') {
			let x = cx
			let y = cy
			if (C === 'L') {
				x = num()
				y = num()
			} else if (C === 'H') x = num()
			else y = num()
			if (rel) {
				x = cx + x
				y = cy + y
			}
			const p0 = points[points.length - 1]
			const p3 = pt(X(x), Y(y))
			points.push(p3)
			handles.push(thirds(p0, p3))
			cx = x
			cy = y
		} else if (C === 'C') {
			const vals = [num(), num(), num(), num(), num(), num()]
			let [x1, y1, x2, y2, x, y] = vals
			if (rel) {
				x1 += cx
				y1 += cy
				x2 += cx
				y2 += cy
				x += cx
				y += cy
			}
			points.push(pt(X(x), Y(y)))
			handles.push(seg(pt(X(x1), Y(y1)), pt(X(x2), Y(y2))))
			cx = x
			cy = y
		} else {
			throw new Error(`unsupported path command ${cmd} — only M/L/H/V/C import as easings (no Q/S/T/A)`)
		}
	}
	if (points.length < 2) throw new Error('path needs at least a start and an end point')
	// Points/handles above are already in easing space; keep authored shapes.
	const mapped = points
	const mappedHandles = handles
	// An easing is a function of time: x must always move forward.
	for (let k = 1; k < mapped.length; k++) {
		if (!(mapped[k].x > mapped[k - 1].x))
			throw new Error('path must always move forward in time (strictly increasing x)')
	}
	// Pin the ends, clamp handle ranges.
	mapped[0] = pt(0, 0)
	mapped[mapped.length - 1] = pt(1, 1)
	for (const h of mappedHandles) {
		for (const k of ['c1', 'c2']) {
			h[k].x = clamp(h[k].x, 0, 1)
			h[k].y = clamp(h[k].y, LIMITS.yMin, LIMITS.yMax)
		}
	}
	const norm = {points: mapped, handles: mappedHandles}
	if (!isValidCurve(norm)) throw new Error('path does not describe a usable 0→1 easing')
	return norm
}

/**
 * Generate a runnable tween.js snippet for a source.
 * Custom stores the path as `Curve` values — a `CurvePath` of
 * `CubicBezierCurve`s, ready to manage, reuse, or migrate — plus a small
 * `createPathEase` inverter (a Curve maps t → point; an easing needs the
 * inverse x → y). Built-in uses the matching `Easing.*` directly.
 * No SVG strings are ever written into code.
 */
export function generateCode(source) {
	if (!isCustomSource(source)) {
		const name = source.name
		return [
			`import {Tween, Easing} from '@tweenjs/tween.js';`,
			``,
			`// Easing.${name} — locked built-in. Switch the tool to Custom to edit the graph.`,
			`const obj = {x: 0};`,
			`new Tween(obj).to({x: 300}, 1200).easing(Easing.${name}).start();`,
		].join('\n')
	}
	const curve = source.curve
	const segs = curve.handles
		.map((h, i) => {
			const p0 = curve.points[i]
			const p3 = curve.points[i + 1]
			return `\tnew CubicBezierCurve(${v(p0)}, ${v(h.c1)}, ${v(h.c2)}, ${v(p3)}),`
		})
		.join('\n')
	return [
		`import {Tween, CubicBezierCurve, CurvePath} from '@tweenjs/tween.js';`,
		``,
		`// Custom easing designed in curve-tool-gui: ${curve.points.length} keyframes.`,
		`const path = new CurvePath([`,
		segs,
		`]);`,
		`const customEase = createPathEase(path);`,
		``,
		`const obj = {x: 0};`,
		`new Tween(obj).to({x: 300}, 1200).easing(customEase).start();`,
		``,
		`function createPathEase(path) {`,
		`	const segs = path.curves;`,
		`	return x => {`,
		`		if (x <= 0) return 0;`,
		`		if (x >= 1) return 1;`,
		`		let i = 0;`,
		`		while (i < segs.length - 1 && x > segs[i].v3.x) i++;`,
		`		const s = segs[i];`,
		`		return cub(solveT(x, s.v0.x, s.v1.x, s.v2.x, s.v3.x), s.v0.y, s.v1.y, s.v2.y, s.v3.y);`,
		`	};`,
		`}`,
		``,
		`function solveT(x, p0, p1, p2, p3) {`,
		`	let t = p3 === p0 ? 0 : Math.min(1, Math.max(0, (x - p0) / (p3 - p0)));`,
		`	for (let i = 0; i < 8; i++) {`,
		`		const err = cub(t, p0, p1, p2, p3) - x;`,
		`		if (Math.abs(err) < 1e-6) break;`,
		`		const d = cubD(t, p0, p1, p2, p3);`,
		`		if (Math.abs(d) < 1e-6) break;`,
		`		t -= err / d;`,
		`	}`,
		`	return Math.min(1, Math.max(0, t));`,
		`}`,
		``,
		`function cub(t, p0, p1, p2, p3) {`,
		`	const u = 1 - t;`,
		`	return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;`,
		`}`,
		``,
		`function cubD(t, p0, p1, p2, p3) {`,
		`	const u = 1 - t;`,
		`	return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);`,
		`}`,
	].join('\n')
}

function v(p) {
	return `{x: ${r3(p.x)}, y: ${r3(p.y)}}`
}

function r3(v) {
	return Math.round(v * 1000) / 1000
}

/**
 * Parse the code box into a source: a generated snippet (`CurvePath` of
 * `CubicBezierCurve`s), a bare SVG path (`M…C…`, e.g. pasted from Figma),
 * a classic `cubic-bezier(…)` (upgraded to a single custom segment), or a
 * built-in (`Easing.*` / `.easing(Easing.*)`).
 */
export function parseCode(text) {
	const src = String(text)
	// Exact round-trip: generated snippets carry `Curve` values.
	const found = parseCurveConstructors(src)
	if (found) return customSource(found)
	const e =
		src.match(/\.easing\(\s*Easing\.([A-Za-z]+\.[A-Za-z]+)\s*\)/) ||
		src.match(/^\s*Easing\.([A-Za-z]+\.[A-Za-z]+)\s*$/m)
	if (e) {
		if (!SOURCES.includes(e[1])) throw new Error(`unknown built-in Easing.${e[1]} — pick one from the source selector`)
		return builtinSource(e[1])
	}
	const m = src.match(/M[\d\s.,\-+eLCVHvhlcqstaz]*/i)
	if (m) {
		try {
			return customSource(parseSVGPath(m[0]))
		} catch {
			// Fall through to the cubic-bezier / error paths below.
		}
	}
	const b = src.match(/cubic-bezier\s*\(\s*([^)]+)\)/i)
	if (b) {
		const parts = b[1].split(',').map(s => Number(s.trim()))
		if (parts.length !== 4 || parts.some(v => !Number.isFinite(v)))
			throw new Error('expected cubic-bezier(x1, y1, x2, y2) with 4 finite numbers')
		const [x1, y1, x2, y2] = parts
		if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) throw new Error('cubic-bezier x1/x2 must stay inside [0, 1]')
		return customSource({points: [pt(0, 0), pt(1, 1)], handles: [seg(pt(x1, y1), pt(x2, y2))]})
	}
	throw new Error('nothing to apply — paste a snippet, an SVG path, cubic-bezier(…), or Easing.*')
}

/**
 * Read `new CubicBezierCurve({x, y}, …×4)` values back into a curve.
 * Returns null when the text carries no curve constructors.
 */
export function parseCurveConstructors(src) {
	const re = /new\s+CubicBezierCurve\(\s*(\{[^{}]+\})\s*,\s*(\{[^{}]+\})\s*,\s*(\{[^{}]+\})\s*,\s*(\{[^{}]+\})\s*\)/g
	let m
	const num = (obj, key) => {
		const mm = obj.match(new RegExp(`${key}\\s*:\\s*(-?\\d*\\.?\\d+(?:e[-+]?\\d+)?)`))
		return mm ? Number(mm[1]) : NaN
	}
	const segs = []
	while ((m = re.exec(src)) !== null) {
		const [p0, c1, c2, p3] = [m[1], m[2], m[3], m[4]].map(o => pt(num(o, 'x'), num(o, 'y')))
		for (const p of [p0, c1, c2, p3]) {
			if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return null
		}
		segs.push({p0, c1, c2, p3})
	}
	if (segs.length === 0) return null
	// Consecutive segments must join end-to-start.
	const points = [segs[0].p0]
	const handles = []
	for (const s of segs) {
		const prev = points[points.length - 1]
		if (Math.abs(prev.x - s.p0.x) > 1e-9 || Math.abs(prev.y - s.p0.y) > 1e-9) return null
		points.push(s.p3)
		handles.push(seg(s.c1, s.c2))
	}
	const curve = {points, handles}
	if (!isValidCurve(curve)) return null
	return curve
}
