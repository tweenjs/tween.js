/**
 * Pure timeline-GUI model (no DOM, no tween.js dependency).
 *
 * The GUI owns this model as its source of truth and builds a real
 * `Timeline` from it for playback (see app.js). This keeps the core
 * library untouched: no introspection API needed.
 *
 * Shape:
 * - {kind:'tween', id, name, offset, duration, to, easing}
 * - {kind:'timeline', id, name, offset, children:[...], collapsed?}
 * - labels: [{name, offset}]
 */

export const EASING_NAMES = [
	'Linear.None',
	'Quadratic.In',
	'Quadratic.Out',
	'Quadratic.InOut',
	'Cubic.InOut',
	'Sinusoidal.InOut',
	'Exponential.InOut',
	'Elastic.Out',
	'Bounce.Out',
]

export const PRESETS = [
	{name: 'move-x', to: {x: 260}},
	{name: 'move-xy', to: {x: 260, y: 120}},
	{name: 'spin', to: {rotation: 180}},
	{name: 'fade', to: {opacity: 0.35}},
	{name: 'grow', to: {scale: 1.6}},
]

let nextId = 1

export function createId(prefix = 'clip') {
	return `${prefix}-${nextId++}`
}

export function resetIds() {
	nextId = 1
}

export function defaultModel() {
	resetIds()
	return {
		version: 1,
		labels: [
			{name: 'drop', offset: 1600},
			{name: 'spin', offset: 2400},
		],
		clips: [
			{
				kind: 'tween',
				id: createId(),
				name: 'move-x',
				offset: 0,
				duration: 800,
				to: {x: 260},
				easing: 'Quadratic.InOut',
			},
			{
				kind: 'tween',
				id: createId(),
				name: 'grow',
				offset: 800,
				duration: 800,
				to: {scale: 1.6},
				easing: 'Quadratic.InOut',
			},
			{
				kind: 'timeline',
				id: createId('tl'),
				name: 'inner-spin',
				offset: 1600,
				collapsed: false,
				children: [
					{
						kind: 'tween',
						id: createId(),
						name: 'drop',
						offset: 0,
						duration: 800,
						to: {y: 120},
						easing: 'Quadratic.InOut',
					},
					{
						kind: 'tween',
						id: createId(),
						name: 'spin',
						offset: 800,
						duration: 800,
						to: {rotation: 180},
						easing: 'Sinusoidal.InOut',
					},
				],
			},
			{
				kind: 'tween',
				id: createId(),
				name: 'fade',
				offset: 3200,
				duration: 800,
				to: {opacity: 0.35},
				easing: 'Linear.None',
			},
		],
	}
}

export function clipDuration(clip) {
	if (clip.kind === 'timeline') {
		let max = 0
		for (const child of clip.children || []) max = Math.max(max, child.offset + clipDuration(child))
		return max
	}
	return clip.duration
}

/** Duration of the whole model (max child end, labels ignored). */
export function getModelDuration(model) {
	let max = 0
	for (const clip of model.clips) max = Math.max(max, clip.offset + clipDuration(clip))
	return max
}

/**
 * Flatten top-level clips (and expanded nested children) into render rows.
 * Returns [{clip, depth, baseOffset, parentId}].
 */
export function flattenTracks(model) {
	const rows = []
	for (const clip of model.clips) {
		rows.push({clip, depth: 0, baseOffset: clip.offset, parentId: null})
		if (clip.kind === 'timeline' && !clip.collapsed) {
			for (const child of clip.children || []) {
				rows.push({clip: child, depth: 1, baseOffset: clip.offset + child.offset, parentId: clip.id})
			}
		}
	}
	return rows
}

export function findClip(model, id, clips = model.clips, parent = null) {
	for (const clip of clips) {
		if (clip.id === id) return {clip, parent, container: clips}
		if (clip.kind === 'timeline') {
			const found = findClip(model, id, clip.children, clip)
			if (found) return found
		}
	}
	return null
}

export function moveClip(model, id, newOffset) {
	const found = findClip(model, id)
	if (!found) return false
	found.clip.offset = Math.max(0, Math.round(newOffset))
	return true
}

export function resizeClip(model, id, newDuration) {
	const found = findClip(model, id)
	if (!found || found.clip.kind !== 'tween') return false
	found.clip.duration = Math.max(50, Math.round(newDuration))
	return true
}

export function updateClip(model, id, patch) {
	const found = findClip(model, id)
	if (!found) return false
	Object.assign(found.clip, patch)
	if (found.clip.kind === 'tween') {
		if (!(found.clip.duration > 0)) found.clip.duration = 1000
		found.clip.offset = Math.max(0, found.clip.offset || 0)
	}
	return true
}

export function addTweenClip(
	model,
	{name = 'move-x', to = {x: 260}, duration = 800, easing = 'Quadratic.InOut', atEnd = true} = {},
) {
	const clip = {
		kind: 'tween',
		id: createId(),
		name,
		offset: atEnd ? getModelDuration(model) : 0,
		duration,
		to: {...to},
		easing,
	}
	model.clips.push(clip)
	return clip
}

export function addNestedTimeline(model) {
	const clip = {
		kind: 'timeline',
		id: createId('tl'),
		name: 'nested',
		offset: getModelDuration(model),
		collapsed: false,
		children: [
			{
				kind: 'tween',
				id: createId(),
				name: 'move-x',
				offset: 0,
				duration: 800,
				to: {x: 260},
				easing: 'Quadratic.InOut',
			},
		],
	}
	model.clips.push(clip)
	return clip
}

export function deleteClip(model, id) {
	const found = findClip(model, id)
	if (!found) return false
	const i = found.container.indexOf(found.clip)
	if (i !== -1) found.container.splice(i, 1)
	return true
}

export function duplicateClip(model, id) {
	const found = findClip(model, id)
	if (!found) return false
	const copy = JSON.parse(JSON.stringify(found.clip))
	const reid = c => {
		c.id = c.kind === 'timeline' ? createId('tl') : createId()
		if (c.children) c.children.forEach(reid)
	}
	reid(copy)
	copy.offset = (copy.offset || 0) + clipDuration(found.clip)
	found.container.splice(found.container.indexOf(found.clip) + 1, 0, copy)
	return copy
}

export function toggleCollapsed(model, id) {
	const found = findClip(model, id)
	if (!found || found.clip.kind !== 'timeline') return false
	found.clip.collapsed = !found.clip.collapsed
	return true
}

/**
 * Move the id counter past any ids present in an imported model so future
 * `createId()` calls stay unique.
 */
export function adoptIds(model) {
	let max = 0
	const walk = clips => {
		for (const c of clips || []) {
			const m = /-(\d+)$/.exec(c.id || '')
			if (m) max = Math.max(max, Number(m[1]))
			if (c.children) walk(c.children)
		}
	}
	walk(model.clips)
	while (nextId <= max) nextId++
}

// ---- time <-> px ----

export function timeToPx(time, pxPerMs) {
	return time * pxPerMs
}

export function pxToTime(px, pxPerMs) {
	return px / pxPerMs
}

/** Pick a ruler tick step (ms) so ticks are >= ~80px apart. */
export function tickStep(pxPerMs) {
	const steps = [50, 100, 250, 500, 1000, 2000, 5000, 10000]
	for (const s of steps) if (s * pxPerMs >= 80) return s
	return 30000
}

// ---- persistence / interchange (two-way binding seed, cf. timeline-css) ----

export function exportJSON(model) {
	return JSON.stringify(model, null, 2)
}

function isValidTween(c) {
	return (
		c &&
		c.kind === 'tween' &&
		typeof c.id === 'string' &&
		typeof c.name === 'string' &&
		Number.isFinite(c.offset) &&
		c.offset >= 0 &&
		Number.isFinite(c.duration) &&
		c.duration > 0 &&
		c.to !== null &&
		typeof c.to === 'object' &&
		!Array.isArray(c.to) &&
		typeof c.easing === 'string' &&
		EASING_NAMES.includes(c.easing)
	)
}

function isValidTimeline(c) {
	return (
		c &&
		c.kind === 'timeline' &&
		typeof c.id === 'string' &&
		typeof c.name === 'string' &&
		Number.isFinite(c.offset) &&
		c.offset >= 0 &&
		Array.isArray(c.children) &&
		c.children.every(ch => isValidTween(ch) || isValidTimeline(ch))
	)
}

export function importJSON(text) {
	const data = JSON.parse(text)
	if (!data || data.version !== 1 || !Array.isArray(data.clips) || !Array.isArray(data.labels)) {
		throw new Error('Expected {version:1, labels:[], clips:[].')
	}
	for (const l of data.labels) {
		if (!l || typeof l.name !== 'string' || !Number.isFinite(l.offset) || l.offset < 0)
			throw new Error(`Bad label: ${JSON.stringify(l)}.`)
	}
	for (const c of data.clips) {
		if (!isValidTween(c) && !isValidTimeline(c)) throw new Error(`Bad clip: ${JSON.stringify(c).slice(0, 120)}.`)
	}
	return data
}

// ---- code generation (model -> tween.js code) ----

function easingExpr(name) {
	return `Easing.${name}`
}

function tweenExpr(varName, clip) {
	return `const ${varName} = new Tween(state).to(${JSON.stringify(clip.to)}, ${clip.duration}).easing(${easingExpr(clip.easing)});`
}

function addLine(target, varName, offset) {
	return offset === 0 ? `${target}.add(${varName});` : `${target}.add(${varName}, ${offset});`
}

/** Generate a runnable ESM snippet that rebuilds this model with tween.js. */
export function generateCode(model) {
	const lines = []
	lines.push(`import {Easing, Timeline, Tween} from '@tweenjs/tween.js';`)
	lines.push(``)
	lines.push(`// Shared animated state (one object; each tween owns different properties).`)
	lines.push(`const state = {x: 0, y: 0, rotation: 0, scale: 1, opacity: 1};`)
	lines.push(``)
	const varFor = new Map()
	let n = 0
	const nextVar = base => `${base}${n++}`
	const emitClip = clip => {
		if (clip.kind === 'tween') {
			const v = nextVar('tween')
			varFor.set(clip.id, v)
			lines.push(tweenExpr(v, clip))
			return v
		}
		const v = nextVar('inner')
		varFor.set(clip.id, v)
		lines.push(`const ${v} = new Timeline();`)
		for (const child of clip.children || []) {
			const cv = emitClip(child)
			lines.push(addLine(v, cv, child.offset))
		}
		return v
	}
	lines.push(`const tl = new Timeline();`)
	for (const clip of model.clips) {
		const v = emitClip(clip)
		lines.push(addLine('tl', v, clip.offset))
	}
	for (const label of model.labels) lines.push(`tl.addLabel(${JSON.stringify(label.name)}, ${label.offset});`)
	lines.push(``)
	lines.push(`tl.start();`)
	lines.push(`(function animate(time) {`)
	lines.push(`\trequestAnimationFrame(animate);`)
	lines.push(`\tif (tl.update(time) === false) tl.start(time);`)
	lines.push(`})(performance.now());`)
	return lines.join('\n')
}
