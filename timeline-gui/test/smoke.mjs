/**
 * Smoke tests for the timeline-gui pure model (no DOM, no tween.js).
 * Run: `node test/smoke.mjs` from timeline-gui/.
 */
import assert from 'node:assert/strict'
import {
	addNestedTimeline,
	addTweenClip,
	adoptIds,
	clipDuration,
	defaultModel,
	deleteClip,
	duplicateClip,
	exportJSON,
	flattenTracks,
	generateCode,
	getModelDuration,
	importJSON,
	moveClip,
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

check('JSON export/import round-trips and rejects garbage', () => {
	const m = defaultModel()
	const back = importJSON(exportJSON(m))
	assert.deepEqual(back, m)
	assert.throws(() => importJSON('{"nope":true}'), /version/)
	assert.throws(() => importJSON(JSON.stringify({version: 1, labels: [], clips: [{kind: 'nope'}]})), /Bad clip/)
})

check('adoptIds keeps generated ids unique after import', () => {
	const m = defaultModel()
	const back = importJSON(exportJSON(m))
	adoptIds(back)
	const fresh = addTweenClip(back, {})
	const ids = new Set()
	const walk = clips => {
		for (const c of clips) {
			assert.ok(!ids.has(c.id), `duplicate id ${c.id}`)
			ids.add(c.id)
			if (c.children) walk(c.children)
		}
	}
	walk(back.clips)
	assert.ok(ids.has(fresh.id))
})

check('generated code rebuilds model placement', () => {
	const m = defaultModel()
	const code = generateCode(m)
	assert.match(code, /new Timeline\(\)/)
	assert.match(code, /addLabel\("drop", 1600\)/)
	assert.match(code, /tl\.add\(inner\d+, 1600\)/)
	assert.match(code, /requestAnimationFrame/)
})

check('addNestedTimeline appends at end', () => {
	const m = defaultModel()
	const dur = getModelDuration(m)
	const nested = addNestedTimeline(m)
	assert.equal(nested.offset, dur)
	assert.equal(nested.children.length, 1)
})

console.log(`\n${passed} smoke tests passed`)
