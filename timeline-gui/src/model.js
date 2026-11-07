/**
 * Pure timeline-GUI model (no DOM, no tween.js dependency).
 *
 * The GUI owns this model as its source of truth and builds a real
 * `Timeline` from it for playback (see app.js). This keeps the core
 * library untouched: no introspection API needed.
 *
 * Code is the interchange format (cf. timeline-css): `generateCode`
 * renders the model as runnable tween.js code, and `parseCode` turns
 * edited code back into a model. Only the generated statement shapes
 * (one per line) are supported — anything else is a parse error.
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

// ---- code generation (model -> tween.js code) ----

function easingExpr(name) {
	return `Easing.${name}`
}

function tweenExpr(varName, clip) {
	const safeName = String(clip.name).replace(/[\r\n]+/g, ' ')
	return `const ${varName} = new Tween(state).to(${JSON.stringify(clip.to)}, ${clip.duration}).easing(${easingExpr(clip.easing)}); // ${safeName}`
}

function timelineExpr(varName, clip) {
	const safeName = String(clip.name).replace(/[\r\n]+/g, ' ')
	return `const ${varName} = new Timeline(); // ${safeName}`
}

function addLine(target, varName, offset) {
	return offset === 0 ? `${target}.add(${varName});` : `${target}.add(${varName}, ${offset});`
}

/** Default animated state keys for a fresh model. */
export function defaultState() {
	return {x: 0, y: 0, rotation: 0, scale: 1, opacity: 1}
}

/** Generate a runnable ESM snippet that rebuilds this model with tween.js. */
export function generateCode(model, state) {
	const lines = []
	lines.push(`import {Easing, Timeline, Tween} from '@tweenjs/tween.js';`)
	lines.push(``)
	lines.push(`// Shared animated state (one object; each tween owns different properties).`)
	lines.push(`const state = ${JSON.stringify(state)};`)
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
		lines.push(timelineExpr(v, clip))
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

// ---- code parsing (tween.js code -> model) ----

const IDENT = '[A-Za-z_$][\\w$]*'
const STATE_RE = new RegExp(`^const\\s+(${IDENT})\\s*=\\s*(\\{[\\s\\S]*\\})\\s*;\\s*$`)
const TWEEN_RE = new RegExp(
	`^const\\s+(${IDENT})\\s*=\\s*new\\s+Tween\\((${IDENT})\\)\\.to\\(([\\s\\S]+?),\\s*(-?[\\d.eE+\\-]+)\\)\\.easing\\((Easing\\.[\\w.]+)\\)\\s*;\\s*(?://(.*))?$`,
)
const TIMELINE_RE = new RegExp(`^const\\s+(${IDENT})\\s*=\\s*new\\s+Timeline\\(\\)\\s*;\\s*(?://(.*))?$`)
const ADD_RE = new RegExp(`^(${IDENT})\\.add\\(\\s*(${IDENT})\\s*(?:,\\s*(-?[\\d.eE+\\-]+))?\\s*\\)\\s*;\\s*$`)
const LABEL_RE = new RegExp(
	`^(${IDENT})\\.addLabel\\(\\s*("([^"]*)"|'([^']*)')\\s*,\\s*(-?[\\d.eE+\\-]+)\\s*\\)\\s*;\\s*$`,
)
const IMPORT_RE = /^import\s+[\s\S]*?;?\s*$/
const START_RE = /^(\w+)\.start\(\)\s*;?\s*$/

function evalObject(src, lineNo, what) {
	let value
	try {
		value = new Function(`return (${src});`)()
	} catch {
		throw new Error(`line ${lineNo}: ${what} is not a valid object.`)
	}
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`line ${lineNo}: ${what} must be an object.`)
	}
	return value
}

/**
 * Parse runnable GUI code back into `{model, state}`. Only the statement
 * shapes emitted by {@link generateCode} are accepted (one per line);
 * anything else throws with a line number.
 */
export function parseCode(text) {
	const objects = new Map()
	const tweens = new Map()
	const timelines = new Map()
	const labels = []
	let root = null

	const fail = (lineNo, msg) => {
		throw new Error(`line ${lineNo}: ${msg}`)
	}

	for (const [index, raw] of String(text).split('\n').entries()) {
		const lineNo = index + 1
		const line = raw.trim()
		if (!line || line.startsWith('//')) continue
		if (IMPORT_RE.test(line)) continue
		if (START_RE.test(line)) continue
		if (
			/^\(function\s/.test(line) ||
			line.startsWith('requestAnimationFrame') ||
			line.startsWith('if (') ||
			line.startsWith('})(')
		)
			continue
		let m
		if ((m = STATE_RE.exec(line))) {
			const [, name, src] = m
			if (objects.has(name)) fail(lineNo, `"${name}" is already declared.`)
			objects.set(name, evalObject(src, lineNo, 'state'))
			continue
		}
		if ((m = TWEEN_RE.exec(line))) {
			const [, name, obj, toSrc, durSrc, easingPath, comment] = m
			if (tweens.has(name) || timelines.has(name) || objects.has(name)) fail(lineNo, `"${name}" is already declared.`)
			const easing = easingPath.slice('Easing.'.length)
			if (!EASING_NAMES.includes(easing)) fail(lineNo, `unknown easing "${easingPath}".`)
			const duration = Number(durSrc)
			if (!Number.isFinite(duration) || duration <= 0) fail(lineNo, `duration must be > 0, got "${durSrc}".`)
			const to = evalObject(toSrc, lineNo, 'to')
			const keys = Object.keys(to)
			if (keys.length === 0) fail(lineNo, 'to needs at least one property.')
			for (const key of keys) {
				if (typeof to[key] !== 'number' && typeof to[key] !== 'string')
					fail(lineNo, `to.${key} must be a number or string.`)
			}
			tweens.set(name, {obj, to, duration, easing, name: (comment || '').trim() || name})
			continue
		}
		if ((m = TIMELINE_RE.exec(line))) {
			const [, name, comment] = m
			if (tweens.has(name) || timelines.has(name) || objects.has(name)) fail(lineNo, `"${name}" is already declared.`)
			timelines.set(name, {name: (comment || '').trim() || name, items: []})
			if (name === 'tl') {
				if (root) fail(lineNo, 'duplicate root timeline "tl".')
				root = name
			}
			continue
		}
		if ((m = ADD_RE.exec(line))) {
			const [, target, child, offSrc] = m
			if (!timelines.has(target)) fail(lineNo, `"${target}" is not a declared Timeline.`)
			if (!tweens.has(child) && !timelines.has(child)) fail(lineNo, `"${child}" is not a declared tween or timeline.`)
			if (target === child) fail(lineNo, 'a timeline cannot contain itself.')
			const offset = offSrc === undefined ? 0 : Number(offSrc)
			if (!Number.isFinite(offset) || offset < 0) fail(lineNo, `offset must be >= 0, got "${offSrc}".`)
			timelines.get(target).items.push({child, offset})
			continue
		}
		if ((m = LABEL_RE.exec(line))) {
			const [, target, , doubleQuoted, singleQuoted, offSrc] = m
			if (target !== 'tl') fail(lineNo, 'labels are only supported on the root "tl".')
			const offset = Number(offSrc)
			if (!Number.isFinite(offset) || offset < 0) fail(lineNo, `label offset must be >= 0, got "${offSrc}".`)
			labels.push({name: doubleQuoted ?? singleQuoted, offset})
			continue
		}
		fail(lineNo, `unsupported statement: ${line.slice(0, 60)}.`)
	}

	if (!root) throw new Error('missing root timeline: `const tl = new Timeline();`.')

	const tweenList = [...tweens.keys()]
	const reachable = new Set()
	const stack = timelines.get('tl').items.map(item => item.child)
	while (stack.length > 0) {
		const name = stack.pop()
		if (reachable.has(name)) continue
		reachable.add(name)
		const inner = timelines.get(name)
		if (inner) for (const item of inner.items) stack.push(item.child)
	}
	for (const name of [...tweenList, ...timelines.keys()]) {
		if (name !== 'tl' && !reachable.has(name)) throw new Error(`"${name}" is declared but never added.`)
	}

	let state
	if (tweenList.length === 0) {
		state = defaultState()
	} else {
		const first = tweens.get(tweenList[0])
		for (const name of tweenList) {
			if (tweens.get(name).obj !== first.obj)
				throw new Error(`all tweens must share one state object, got "${tweens.get(name).obj}".`)
		}
		const decl = objects.get(first.obj)
		if (!decl) throw new Error(`unknown state object "${first.obj}".`)
		for (const [key, value] of Object.entries(decl)) {
			if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`state.${key} must be a finite number.`)
		}
		state = {...decl}
	}

	resetIds()
	const visiting = new Set()
	const buildClip = (varName, offset) => {
		if (tweens.has(varName)) {
			const t = tweens.get(varName)
			return {
				kind: 'tween',
				id: createId(),
				name: t.name,
				offset,
				duration: t.duration,
				to: {...t.to},
				easing: t.easing,
			}
		}
		if (visiting.has(varName)) throw new Error(`"${varName}" contains itself (cycle).`)
		visiting.add(varName)
		const t = timelines.get(varName)
		const clip = {
			kind: 'timeline',
			id: createId('tl'),
			name: t.name,
			offset,
			collapsed: false,
			children: t.items.map(item => buildClip(item.child, item.offset)),
		}
		visiting.delete(varName)
		return clip
	}
	const clips = timelines.get('tl').items.map(item => buildClip(item.child, item.offset))
	return {model: {labels, clips}, state}
}
