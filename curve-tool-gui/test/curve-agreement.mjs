/**
 * Agreement between the curve-tool solver and the tween.js core.
 * The graph draws through real `CubicBezierCurve` segments while the easing
 * inverts them x → y; this test proves both views describe the same shape:
 * a dense lib-sampled lookup must match `makeEasing` for monotonic curves.
 * Run: `node test/curve-agreement.mjs` from curve-tool-gui/.
 */
import assert from 'node:assert/strict'
import {CubicBezierCurve} from '../../dist/tween.esm.js'
import {PRESET_NAMES, createPreset, isMonotonic, makeEasing} from '../src/model.js'

let passed = 0
const check = (name, fn) => {
	fn()
	passed++
	console.log(`ok - ${name}`)
}

function lookupTable(curve, perSeg = 200) {
	const pts = []
	for (let i = 0; i < curve.handles.length; i++) {
		const seg = new CubicBezierCurve(curve.points[i], curve.handles[i].c1, curve.handles[i].c2, curve.points[i + 1])
		for (let k = i === 0 ? 0 : 1; k <= perSeg; k++) {
			const p = seg.getPoint(k / perSeg)
			pts.push([p.x, p.y])
		}
	}
	return x => {
		if (x <= 0) return 0
		if (x >= 1) return 1
		let lo = 0
		let hi = pts.length - 1
		while (hi - lo > 1) {
			const mid = (lo + hi) >> 1
			if (pts[mid][0] < x) lo = mid
			else hi = mid
		}
		const [x0, y0] = pts[lo]
		const [x1, y1] = pts[hi]
		return x1 === x0 ? y0 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
	}
}

for (const name of PRESET_NAMES) {
	const curve = createPreset(name)
	if (!isMonotonic(curve)) continue // lookup needs single-valued x → y
	check(`${name}: lib-sampled shape matches the solver`, () => {
		const [exact, approx] = [makeEasing(curve), lookupTable(curve)]
		for (let i = 0; i <= 40; i++) {
			const x = i / 40
			assert.ok(Math.abs(exact(x) - approx(x)) < 2e-3, `${name} drifts at x=${x}`)
		}
	})
}

console.log(`\n${passed} agreement tests passed`)
