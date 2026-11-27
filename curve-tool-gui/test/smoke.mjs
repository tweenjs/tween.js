/**
 * Smoke tests for the curve-tool pure model (no DOM, no tween.js).
 * Run: `node test/smoke.mjs` from curve-tool-gui/.
 */
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {
	LIMITS,
	OVERLAYS,
	PRESET_NAMES,
	SOURCES,
	addPoint,
	builtinSource,
	cloneCurve,
	createDefault,
	createPreset,
	customSource,
	deletePoint,
	generateCode,
	isCustomSource,
	isMonotonic,
	isValidCurve,
	makeEasing,
	moveHandle,
	movePoint,
	parseCode,
	parseSVGPath,
	sampleEasing,
	toSVGPath,
} from '../src/model.js'

let passed = 0
const check = (name, fn) => {
	fn()
	passed++
	console.log(`ok - ${name}`)
}

const EASE_PATH = 'M0,100 C25,90 25,0 100,0'

/** Curves agree when every number matches within codegen rounding. */
function closeCurve(a, b, eps = 1e-3) {
	if (a.points.length !== b.points.length || a.handles.length !== b.handles.length) return false
	const nums = []
	for (let i = 0; i < a.points.length; i++) nums.push(a.points[i].x - b.points[i].x, a.points[i].y - b.points[i].y)
	for (let i = 0; i < a.handles.length; i++) {
		nums.push(a.handles[i].c1.x - b.handles[i].c1.x, a.handles[i].c1.y - b.handles[i].c1.y)
		nums.push(a.handles[i].c2.x - b.handles[i].c2.x, a.handles[i].c2.y - b.handles[i].c2.y)
	}
	return nums.every(d => Math.abs(d) < eps)
}

check('default curve is a single Ease segment with pinned ends', () => {
	const c = createDefault()
	assert.ok(isValidCurve(c))
	assert.equal(c.points.length, 2)
	assert.equal(c.handles.length, 1)
	assert.deepEqual(c.points[0], {x: 0, y: 0})
	assert.deepEqual(c.points[1], {x: 1, y: 1})
})

check('linear preset is the identity, endpoints pin to 0 and 1', () => {
	for (const name of PRESET_NAMES) {
		const fn = makeEasing(createPreset(name))
		assert.equal(fn(0), 0, name)
		assert.equal(fn(1), 1, name)
	}
	const linear = makeEasing(createPreset('Linear'))
	for (const x of [0.1, 0.25, 0.5, 0.75, 0.9]) assert.ok(Math.abs(linear(x) - x) < 1e-6, `f(${x}) = ${linear(x)}`)
})

check('default Ease starts fast and every preset samples continuously', () => {
	assert.ok(makeEasing(createDefault())(0.5) > 0.5)
	for (const name of PRESET_NAMES) {
		const ys = sampleEasing(makeEasing(createPreset(name)), 200).map(([, y]) => y)
		for (let i = 1; i < ys.length; i++) assert.ok(Math.abs(ys[i] - ys[i - 1]) < 0.05, `${name} jumps at ${i}`)
	}
})

check('overshoot and bounce presets leave [0, 1] (AE-style)', () => {
	const over = sampleEasing(makeEasing(createPreset('Overshoot'))).map(([, y]) => y)
	assert.ok(Math.max(...over) > 1)
	assert.equal(isMonotonic(createPreset('Overshoot')), false)
	assert.equal(isMonotonic(createPreset('Bounce')), false)
	assert.equal(isMonotonic(createPreset('Linear')), true)
	assert.equal(isMonotonic(createPreset('Ease')), true)
})

check('addPoint snaps a keyframe onto the curve and splits the segment', () => {
	const before = createDefault()
	const oldFn = makeEasing(before)
	const {curve: c, index} = addPoint(before, 0.4)
	assert.equal(index, 1)
	assert.ok(isValidCurve(c))
	assert.equal(c.points.length, 3)
	assert.equal(c.handles.length, 2)
	const k = c.points[1]
	assert.ok(Math.abs(oldFn(k.x) - k.y) < 1e-6, 'knot sits on the old curve')
	assert.ok(Math.abs(makeEasing(c)(k.x) - k.y) < 1e-6, 'new curve passes through the knot')
})

check('deletePoint merges back; endpoints are guarded', () => {
	const {curve: c} = addPoint(createDefault(), 0.4)
	assert.equal(deletePoint(c, 0), null)
	assert.equal(deletePoint(c, 2), null)
	const back = deletePoint(c, 1)
	assert.ok(back && isValidCurve(back))
	assert.equal(back.points.length, 2)
})

check('movePoint clamps between neighbours; endpoints stay pinned', () => {
	const {curve: c} = addPoint(createDefault(), 0.4)
	const right = movePoint(c, 1, 0.99, 0.2)
	assert.ok(right.points[1].x < 1 && right.points[1].x > 0.4)
	assert.equal(right.points[1].y, 0.2)
	const pinned = movePoint(c, 0, 0.3, 0.5)
	assert.deepEqual(pinned.points[0], {x: 0, y: 0})
	const hi = movePoint(c, 1, 0.5, 99)
	assert.equal(hi.points[1].y, LIMITS.yMax)
})

check('moveHandle reshapes its segment only', () => {
	const c = moveHandle(createDefault(), 0, 'c1', 0.9, 0.9)
	assert.deepEqual(c.points[0], {x: 0, y: 0})
	assert.ok(makeEasing(c)(0.5) !== makeEasing(createDefault())(0.5))
})

check('SVG export matches the classic Ease path and round-trips', () => {
	assert.equal(toSVGPath(createDefault()), EASE_PATH)
	for (const name of PRESET_NAMES) {
		const c = createPreset(name)
		const back = parseSVGPath(toSVGPath(c))
		assert.ok(isValidCurve(back), name)
		const [f, g] = [makeEasing(c), makeEasing(back)]
		for (let i = 0; i <= 20; i++) assert.ok(Math.abs(f(i / 20) - g(i / 20)) < 1e-9, `${name} drifts at ${i / 20}`)
	}
})

check('SVG import keeps authored handles and rejects bad paths', () => {
	const c = parseSVGPath(EASE_PATH)
	assert.ok(Math.abs(c.handles[0].c1.x - 0.25) < 1e-9 && Math.abs(c.handles[0].c1.y - 0.1) < 1e-9)
	const rel = parseSVGPath('m0,100 c25,-10 25,-100 100,-100')
	assert.ok(isValidCurve(rel))
	assert.throws(() => parseSVGPath('M0,100 L50,50 L40,40 L100,0'), /forward in time/)
	assert.throws(() => parseSVGPath('M0,100 Q50,50 100,0'), /unsupported path command/)
	assert.throws(() => parseSVGPath('M0,100 Z'), /closepath/)
	assert.throws(() => parseSVGPath('ease-in-out'), /starting with M|unsupported path command/)
})

check('generated snippet round-trips exactly; bare bezier upgrades', () => {
	for (const name of PRESET_NAMES) {
		const c = createPreset(name)
		const back = parseCode(generateCode(customSource(c)))
		assert.equal(back.kind, 'custom')
		assert.ok(closeCurve(back.curve, c), `${name} drifts: ${JSON.stringify(back.curve)}`)
	}
	const single = parseCode('cubic-bezier(0.25, 0.1, 0.25, 1)')
	assert.ok(isCustomSource(single))
	assert.equal(toSVGPath(single.curve), EASE_PATH)
	assert.throws(() => parseCode('just some words'), /nothing to apply/)
})

check('hand-written Curve constructors parse back', () => {
	const back = parseCode(
		`import {Tween, CubicBezierCurve, CurvePath} from '@tweenjs/tween.js';
		const path = new CurvePath([
			new CubicBezierCurve({x: 0, y: 0}, {x: 0.25, y: 0.1}, {x: 0.25, y: 1}, {x: 1, y: 1}),
		]);`,
	)
	assert.equal(back.kind, 'custom')
	assert.equal(toSVGPath(back.curve), EASE_PATH)
})

check('built-in sources generate locked snippets and parse back', () => {
	assert.deepEqual(SOURCES[0], 'Custom')
	const code = generateCode(builtinSource('Back.Out'))
	assert.match(code, /\.easing\(Easing\.Back\.Out\)/)
	assert.deepEqual(parseCode(code), {kind: 'builtin', name: 'Back.Out'})
	assert.deepEqual(parseCode('Easing.Elastic.Out'), {kind: 'builtin', name: 'Elastic.Out'})
	assert.throws(() => parseCode('Easing.Nope.Nope'), /unknown built-in/)
})

check('generated snippet stores Curve values and replays standalone', () => {
	const code = generateCode(customSource(createPreset('Bounce')))
	assert.match(code, /new CurvePath\(\[/)
	assert.match(code, /new CubicBezierCurve\(\{x: 0, y: 0\}/)
	assert.match(code, /const customEase = createPathEase\(path\)/)
	assert.match(code, /new Tween\(obj\)\.to\(\{x: 300\}, 1200\)\.easing\(customEase\)/)
	assert.ok(!code.includes('M0,'), 'no SVG path strings in generated code')
})

check('overlays resolve against the Easing tree names', () => {
	assert.ok(OVERLAYS.includes('Bounce.Out'))
	assert.ok(cloneCurve(createDefault()))
})
check('vendored lib matches the dist build', () => {
	const here = dirname(fileURLToPath(import.meta.url))
	const vendored = readFileSync(join(here, '..', 'vendor', 'tween', 'tween.esm.js'), 'utf8')
	const dist = readFileSync(join(here, '..', '..', 'dist', 'tween.esm.js'), 'utf8')
	assert.equal(vendored, dist)
})

console.log(`\n${passed} smoke tests passed`)
