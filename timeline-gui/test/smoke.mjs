/**
 * Smoke tests for the timeline-gui pure model (no DOM, no tween.js).
 * Run: `node test/smoke.mjs` from timeline-gui/.
 */
import assert from 'node:assert/strict'
import {
	addNestedTimeline,
	addTweenClip,
	clipDuration,
	defaultModel,
	defaultState,
	deleteClip,
	duplicateClip,
	easingTree,
	extractPrefix,
	flattenTracks,
	generateCode,
	getCompletions,
	getModelDuration,
	highlightCode,
	moveClip,
	parseCode,
	pxToTime,
	resizeClip,
	tickStep,
	timeToPx,
	toggleCollapsed,
	updateClip,
} from '../src/model.js'

let passed = 0
const check = (name, fn) => {
	fn()
	passed++
	console.log(`ok - ${name}`)
}

const stripIds = model => JSON.parse(JSON.stringify(model, (k, v) => (k === 'id' ? undefined : v)))

check('default model has positive duration and nested children', () => {
	const m = defaultModel()
	assert.ok(getModelDuration(m) > 0)
	assert.equal(flattenTracks(m).length, 6) // 4 top-level + 2 expanded children
})

check('time<->px round-trips', () => {
	assert.equal(pxToTime(timeToPx(1234, 0.1), 0.1), 1234)
})

check('tick step keeps >=80px spacing', () => {
	for (const ppm of [0.03, 0.1, 0.4]) assert.ok(tickStep(ppm) * ppm >= 80)
})

check('move clamps at zero and resizes clamp at 50ms', () => {
	const m = defaultModel()
	const id = m.clips[0].id
	assert.ok(moveClip(m, id, -500))
	assert.equal(m.clips[0].offset, 0)
	assert.ok(resizeClip(m, id, 10))
	assert.equal(m.clips[0].duration, 50)
})

check('nested timeline duration derives from children', () => {
	const m = defaultModel()
	const nested = m.clips.find(c => c.kind === 'timeline')
	assert.equal(clipDuration(nested), 1600)
	assert.ok(toggleCollapsed(m, nested.id))
	assert.equal(flattenTracks(m).length, 4)
})

check('add/duplicate/delete round-trip', () => {
	const m = defaultModel()
	const before = m.clips.length
	const added = addTweenClip(m, {name: 'spin', to: {rotation: 90}})
	assert.equal(m.clips.length, before + 1)
	assert.equal(added.offset, getModelDuration(m) - added.duration)
	const copy = duplicateClip(m, added.id)
	assert.equal(m.clips.length, before + 2)
	assert.ok(deleteClip(m, copy.id))
	assert.ok(deleteClip(m, added.id))
	assert.equal(m.clips.length, before)
})

check('updateClip guards duration', () => {
	const m = defaultModel()
	updateClip(m, m.clips[0].id, {duration: -5})
	assert.equal(m.clips[0].duration, 1000)
})

check('code round-trips the model (names, offsets, labels, state)', () => {
	const m = defaultModel()
	const s = defaultState()
	const {model, state} = parseCode(generateCode(m, s))
	assert.deepEqual(stripIds(model), stripIds(m))
	assert.deepEqual(state, s)
})

check('edited code parses back (offset, duration, label, new key)', () => {
	const m = defaultModel()
	let code = generateCode(m, defaultState())
	code = code
		.replace('.to({"x":260}, 800)', '.to({"x":100,"y":50}, 400)')
		.replace('tl.addLabel("drop", 1600)', 'tl.addLabel("drop", 200)')
	const {model, state} = parseCode(code)
	const first = model.clips[0]
	assert.equal(first.offset, 0)
	assert.equal(first.duration, 400)
	assert.deepEqual(first.to, {x: 100, y: 50})
	assert.deepEqual(model.labels[0], {name: 'drop', offset: 200})
	assert.deepEqual(state, defaultState())
	const ids = new Set()
	const walk = clips => {
		for (const c of clips) {
			assert.ok(!ids.has(c.id), `duplicate id ${c.id}`)
			ids.add(c.id)
			if (c.children) walk(c.children)
		}
	}
	walk(model.clips)
})

check('invalid code throws with line numbers', () => {
	const good = generateCode(defaultModel(), defaultState())
	assert.throws(() => parseCode(good.replace('Quadratic.InOut', 'Nope.Nope')), /line \d+: unknown easing/)
	assert.throws(() => parseCode(good + '\nfoo(bar);'), /unsupported statement/)
	assert.throws(() => parseCode('const inner0 = new Timeline();'), /missing root timeline/)
	assert.throws(() => parseCode('const x = 1;\nconst tl = new Timeline();'), /unsupported statement/)
	assert.throws(() => parseCode(good.replace('.to({"x":260}, 800)', '.to({"x":260}, -5)')), /duration must be > 0/)
	assert.throws(() => parseCode(good.replace('tl.add(tween5, 3200)', 'tl.add(tween5, -20)')), /offset must be >= 0/)
})

check('declared-but-never-added tween is an error', () => {
	const code = [
		`import {Easing, Timeline, Tween} from '@tweenjs/tween.js';`,
		`const state = {"x": 0};`,
		`const tween0 = new Tween(state).to({x: 1}, 100).easing(Easing.Linear.None);`,
		`const tl = new Timeline();`,
	].join('\n')
	assert.throws(() => parseCode(code), /never added/)
})

check('highlight escapes HTML and wraps tokens', () => {
	const html = highlightCode('const s = "<x>"; // hi\nconst n = new Tween(state).to({"a":1}, 100);')
	assert.ok(!html.includes('<x>') && html.includes('&lt;x&gt;'))
	assert.match(html, /<span class="tok-kw">const<\/span>/)
	assert.match(html, /<span class="tok-str">"&lt;x&gt;"<\/span>/)
	assert.match(html, /<span class="tok-com">\/\/ hi<\/span>/)
	assert.match(html, /<span class="tok-num">100<\/span>/)
	assert.ok(html.endsWith('\n'))
})

check('completions cover Tween/Timeline/Easing tree', () => {
	assert.deepEqual(getCompletions('Twe'), ['Tween'])
	assert.deepEqual(getCompletions('t'), ['Tween', 'Timeline'])
	assert.deepEqual(getCompletions('Easing.'), Object.keys(easingTree()))
	assert.deepEqual(getCompletions('Easing.Quad'), ['Quadratic'])
	assert.deepEqual(getCompletions('Easing.Quadratic.'), ['In', 'Out', 'InOut'])
	assert.deepEqual(getCompletions('Easing.Quadratic.X'), [])
	assert.deepEqual(getCompletions('Foo'), [])
	assert.deepEqual(getCompletions('tl.'), [])
})

check('prefix extraction skips comments and strings', () => {
	assert.equal(extractPrefix('const t = new Twe'), 'Twe')
	assert.equal(extractPrefix('x = Easing.'), 'Easing.')
	assert.equal(extractPrefix('new Timeline'), 'Timeline')
	assert.equal(extractPrefix('// mov'), null)
	assert.equal(extractPrefix('"ab'), null)
})

check('addNestedTimeline appends at end', () => {
	const m = defaultModel()
	const dur = getModelDuration(m)
	const nested = addNestedTimeline(m)
	assert.equal(nested.offset, dur)
	assert.equal(nested.children.length, 1)
})

console.log(`\n${passed} smoke tests passed`)
