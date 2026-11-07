/**
 * Timeline GUI — vanilla ESM editor for tween.js Timelines.
 *
 * Design (see dev-docs/09):
 * - The GUI owns a model (./model.js) and builds a real `Timeline` from
 *   it for playback, driven with an explicit clock (`tl.start(0)` +
 *   `tl.update(v)`), the scrub pattern from
 *   `examples/21_timeline_slider.html` (cf. issue #560).
 * - Code is the interchange format (cf. timeline-css): the code box
 *   renders the model and parses edits back into it. Invalid code stops
 *   playback and shows an error instead of running.
 * - No changes to the core library were needed.
 */
import {Easing, Timeline, Tween} from '@tweenjs/tween.js'
import {
	EASING_NAMES,
	PRESETS,
	addNestedTimeline,
	addTweenClip,
	clipDuration,
	createId,
	defaultModel,
	defaultState,
	deleteClip,
	duplicateClip,
	findClip,
	flattenTracks,
	generateCode,
	getModelDuration,
	moveClip,
	parseCode,
	pxToTime,
	resizeClip,
	tickStep,
	timeToPx,
	toggleCollapsed,
	updateClip,
} from './model.js'

const NAME_COL = 130
const STORAGE_KEY = 'tweenjs-timeline-gui-v2'

const $ = id => document.getElementById(id)
const els = {
	play: $('btn-play'),
	pause: $('btn-pause'),
	stop: $('btn-stop'),
	loop: $('btn-loop'),
	speed: $('sel-speed'),
	zoom: $('sel-zoom'),
	readout: $('readout'),
	stage: $('stage'),
	box: $('box'),
	stateReadout: $('state-readout'),
	ruler: $('ruler'),
	tracks: $('tracks'),
	playhead: $('playhead'),
	scroll: $('tl-scroll'),
	slider: $('slider'),
	add: $('btn-add'),
	addNested: $('btn-add-nested'),
	addLabel: $('btn-add-label'),
	dup: $('btn-dup'),
	del: $('btn-del'),
	reset: $('btn-reset'),
	inspector: $('inspector-body'),
	codeIn: $('code-in'),
	codeError: $('code-error'),
	applyCode: $('btn-apply-code'),
	revertCode: $('btn-revert-code'),
	copyCode: $('btn-copy-code'),
}

function resolveEasing(name) {
	const parts = name.split('.')
	let fn = Easing
	for (const p of parts) fn = fn[p]
	if (typeof fn !== 'function') throw new Error(`Unknown easing: ${name}`)
	return fn
}

// ---- state ----

let model = defaultModel()
let state = defaultState()
let pxPerMs = 0.1
let speed = 1
let loop = true
let currentMs = 0
let selected = null // {type:'clip'|'label', id?, name?}
let tl = null
let rafId = 0
let wallStart = 0
let playBase = 0
let codeDirty = false
let codeError = null

function loadCode() {
	try {
		return localStorage.getItem(STORAGE_KEY)
	} catch {
		return null
	}
}

function saveCode(text) {
	try {
		localStorage.setItem(STORAGE_KEY, text)
	} catch {
		// Storage full or unavailable: the GUI still works in-memory.
	}
}

/** Restore model + state from stored code, or fall back to the demo. */
function bootModel() {
	const stored = loadCode()
	if (stored) {
		try {
			const parsed = parseCode(stored)
			model = parsed.model
			state = parsed.state
			return
		} catch {
			// Stored code predates the grammar: fall through to the demo.
		}
	}
	model = defaultModel()
	state = defaultState()
}

// ---- timeline build + explicit-clock playback ----

function buildTimeline() {
	const next = new Timeline()
	const addClip = (clip, target) => {
		if (clip.kind === 'tween') {
			const tween = new Tween(state).to({...clip.to}, clip.duration).easing(resolveEasing(clip.easing))
			target.add(tween, clip.offset)
		} else {
			const inner = new Timeline()
			for (const child of clip.children || []) addClip(child, inner)
			target.add(inner, clip.offset)
		}
	}
	for (const clip of model.clips) addClip(clip, next)
	for (const label of model.labels) next.addLabel(label.name, label.offset)
	next.onUpdate(renderStage)
	return next
}

function ensureStarted() {
	if (!tl) tl = buildTimeline()
	if (!tl.isPlaying()) tl.start(0)
}

/** Drive the timeline to local time v (ms). Does nothing while code is invalid. */
function scrub(v) {
	if (codeError) return
	const duration = getModelDuration(model)
	currentMs = Math.max(0, Math.min(v, duration))
	ensureStarted()
	tl.update(currentMs)
	renderTransport()
	renderPlayhead()
}

function tick(wallNow) {
	const duration = getModelDuration(model)
	const v = playBase + (wallNow - wallStart) * speed
	if (v >= duration) {
		if (loop && duration > 0) {
			tl.update(duration)
			playBase = 0
			wallStart = wallNow
			tl.start(0)
			tl.update(0)
			currentMs = 0
		} else {
			scrub(duration)
			stopRaf()
			return
		}
	} else {
		currentMs = v
		tl.update(v)
	}
	renderTransport()
	renderPlayhead()
	renderStage()
	rafId = requestAnimationFrame(tick)
}

function stopRaf() {
	if (rafId) cancelAnimationFrame(rafId)
	rafId = 0
}

function play() {
	ensureStarted()
	const duration = getModelDuration(model)
	if (currentMs >= duration) {
		tl.start(0)
		currentMs = 0
	}
	playBase = currentMs
	wallStart = performance.now()
	stopRaf()
	rafId = requestAnimationFrame(tick)
}

function pause() {
	stopRaf()
}

function stop() {
	stopRaf()
	if (tl) tl.stop()
	currentMs = 0
	ensureStarted()
	tl.update(0)
	renderAll()
}

/** Rebuild the playback timeline after a model edit, keeping the playhead. */
function rebuild(keepPlaying = false) {
	const wasRaf = rafId !== 0
	stopRaf()
	tl = buildTimeline()
	tl.start(0)
	tl.update(currentMs)
	renderAll()
	if (keepPlaying || wasRaf) play()
}

// ---- rendering ----

function laneWidth() {
	return Math.max(200, getModelDuration(model) * pxPerMs + 40)
}

function renderRuler() {
	const duration = getModelDuration(model)
	const width = laneWidth()
	els.ruler.innerHTML = ''
	els.ruler.style.width = `${NAME_COL + width}px`
	const spacer = document.createElement('div')
	spacer.style.cssText = `position:absolute;left:0;top:0;bottom:0;width:${NAME_COL}px;background:var(--panel);border-right:1px solid var(--border);`
	els.ruler.appendChild(spacer)
	const step = tickStep(pxPerMs)
	for (let t = 0; t <= duration + step; t += step) {
		const tick = document.createElement('div')
		tick.className = 'tick'
		tick.style.left = `${NAME_COL + timeToPx(t, pxPerMs)}px`
		tick.textContent = `${t}ms`
		els.ruler.appendChild(tick)
	}
	for (const label of model.labels) {
		const chip = document.createElement('div')
		chip.className = 'ruler-label'
		chip.style.left = `${NAME_COL + timeToPx(label.offset, pxPerMs)}px`
		chip.textContent = `◆ ${label.name}`
		chip.dataset.label = label.name
		if (selected && selected.type === 'label' && selected.name === label.name) {
			chip.style.outline = '2px solid var(--accent-2)'
		}
		els.ruler.appendChild(chip)
	}
}

function renderTracks() {
	const width = laneWidth()
	els.tracks.innerHTML = ''
	for (const {clip, depth, baseOffset, parentId} of flattenTracks(model)) {
		const row = document.createElement('div')
		row.className = 'track-row'
		const name = document.createElement('div')
		name.className = `track-name depth-${depth}`
		name.textContent = (clip.kind === 'timeline' ? (clip.collapsed ? '▸ ' : '▾ ') : '') + clipName(clip, parentId)
		name.title = clip.kind === 'timeline' ? 'Click clip to expand/collapse' : clip.id
		const lane = document.createElement('div')
		lane.className = 'track-lane'
		lane.style.width = `${width}px`
		const el = document.createElement('div')
		el.className = 'clip' + (clip.kind === 'timeline' ? ' nested' : '')
		if (selected && selected.type === 'clip' && selected.id === clip.id) el.classList.add('selected')
		el.style.left = `${timeToPx(baseOffset, pxPerMs)}px`
		el.style.width = `${Math.max(8, timeToPx(clipDuration(clip), pxPerMs))}px`
		el.textContent = `${clip.name} · ${Math.round(clipDuration(clip))}ms`
		el.dataset.id = clip.id
		if (clip.kind === 'tween') {
			const handle = document.createElement('div')
			handle.className = 'resize'
			el.appendChild(handle)
		}
		lane.appendChild(el)
		row.appendChild(name)
		row.appendChild(lane)
		els.tracks.appendChild(row)
	}
}

function clipName(clip, parentId) {
	return parentId ? clip.name : clip.name
}

function renderPlayhead() {
	els.playhead.style.left = `${NAME_COL + timeToPx(currentMs, pxPerMs)}px`
}

function renderTransport() {
	const duration = getModelDuration(model)
	els.readout.textContent = `${Math.round(currentMs)}ms / ${Math.round(duration)}ms`
	els.slider.max = String(Math.max(1, Math.round(duration)))
	els.slider.value = String(Math.round(currentMs))
	els.loop.classList.toggle('active', loop)
}

function renderStage() {
	const x = Number(state.x) || 0
	const y = Number(state.y) || 0
	const rotation = Number(state.rotation) || 0
	const scale = Number(state.scale) || 0
	const opacity = state.opacity === undefined ? 1 : Number(state.opacity) || 0
	els.box.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) rotate(${Math.round(rotation)}deg) scale(${scale})`
	els.box.style.opacity = String(opacity)
	els.stateReadout.textContent = `x=${Math.round(x)} y=${Math.round(y)} rot=${Math.round(rotation)} scale=${scale.toFixed(2)} opacity=${opacity.toFixed(2)}`
}

function renderInspector() {
	const body = els.inspector
	body.innerHTML = ''
	if (!selected) {
		body.innerHTML = '<p class="hint">Select a clip or label to edit it.</p>'
		return
	}
	if (selected.type === 'label') {
		const label = model.labels.find(l => l.name === selected.name)
		if (!label) {
			selected = null
			renderInspector()
			return
		}
		body.appendChild(
			field(
				'Name',
				textInput(label.name, v => {
					label.name = v
					selected.name = v
					rebuild()
				}),
			),
		)
		body.appendChild(
			field(
				'Offset (ms)',
				numberInput(label.offset, v => {
					label.offset = Math.max(0, Math.round(v))
					rebuild()
				}),
			),
		)
		const del = document.createElement('button')
		del.textContent = 'Delete label'
		del.onclick = () => {
			model.labels = model.labels.filter(l => l !== label)
			selected = null
			rebuild()
		}
		body.appendChild(del)
		return
	}
	const found = findClip(model, selected.id)
	if (!found) {
		selected = null
		renderInspector()
		return
	}
	const {clip} = found
	body.appendChild(
		field(
			'Name',
			textInput(clip.name, v => {
				updateClip(model, clip.id, {name: v})
				rebuild()
			}),
		),
	)
	body.appendChild(
		field(
			'Offset (ms)',
			numberInput(clip.offset, v => {
				moveClip(model, clip.id, v)
				rebuild()
			}),
		),
	)
	if (clip.kind === 'tween') {
		body.appendChild(
			field(
				'Duration (ms)',
				numberInput(clip.duration, v => {
					resizeClip(model, clip.id, v)
					rebuild()
				}),
			),
		)
		const sel = document.createElement('select')
		for (const name of EASING_NAMES) {
			const opt = document.createElement('option')
			opt.value = name
			opt.textContent = name
			if (clip.easing === name) opt.selected = true
			sel.appendChild(opt)
		}
		sel.onchange = () => {
			updateClip(model, clip.id, {easing: sel.value})
			rebuild()
		}
		body.appendChild(field('Easing', sel))
		const area = document.createElement('textarea')
		area.rows = 4
		area.spellcheck = false
		area.value = JSON.stringify(clip.to)
		area.onchange = () => {
			try {
				const to = JSON.parse(area.value)
				if (to === null || typeof to !== 'object' || Array.isArray(to)) throw new Error('object expected')
				updateClip(model, clip.id, {to})
				rebuild()
			} catch {
				area.style.borderColor = 'var(--playhead)'
			}
		}
		body.appendChild(field('To (JSON)', area))
	} else {
		const btn = document.createElement('button')
		btn.textContent = clip.collapsed ? 'Expand' : 'Collapse'
		btn.onclick = () => {
			toggleCollapsed(model, clip.id)
			renderAll()
		}
		body.appendChild(btn)
		const add = document.createElement('button')
		add.textContent = '+ child tween'
		add.style.marginLeft = '6px'
		add.onclick = () => {
			clip.children.push({
				kind: 'tween',
				id: createId(),
				name: 'move-x',
				offset: clipDuration(clip),
				duration: 800,
				to: {x: 260},
				easing: 'Quadratic.InOut',
			})
			rebuild()
		}
		body.appendChild(add)
	}
}

function field(labelText, input) {
	const wrap = document.createElement('div')
	wrap.className = 'field'
	const label = document.createElement('label')
	label.textContent = labelText
	wrap.appendChild(label)
	wrap.appendChild(input)
	return wrap
}

function textInput(value, onChange) {
	const input = document.createElement('input')
	input.value = value
	input.onchange = () => onChange(input.value)
	return input
}

function numberInput(value, onChange) {
	const input = document.createElement('input')
	input.type = 'number'
	input.value = String(Math.round(value))
	input.onchange = () => onChange(Number(input.value))
	return input
}

function setCodeError(msg) {
	codeError = msg
	els.codeError.hidden = !msg
	els.codeError.textContent = msg || ''
	const blocked = !!msg
	els.play.disabled = blocked
	els.pause.disabled = blocked
	els.stop.disabled = blocked
	els.slider.disabled = blocked
	els.applyCode.classList.toggle('active', codeDirty && !msg)
}

function renderCode() {
	const text = generateCode(model, state)
	els.codeIn.value = text
	codeDirty = false
	setCodeError(null)
	saveCode(text)
}

function renderAll() {
	renderRuler()
	renderTracks()
	renderPlayhead()
	renderTransport()
	renderStage()
	renderInspector()
	renderCode()
}

// ---- interactions ----

function laneXToMs(clientX) {
	const rect = els.scroll.getBoundingClientRect()
	return Math.max(0, pxToTime(clientX - rect.left - NAME_COL + els.scroll.scrollLeft, pxPerMs))
}

els.ruler.addEventListener('pointerdown', e => {
	const chip = e.target.closest('[data-label]')
	if (chip) {
		selected = {type: 'label', name: chip.dataset.label}
		renderRuler()
		renderInspector()
		return
	}
	els.ruler.setPointerCapture(e.pointerId)
	scrub(laneXToMs(e.clientX))
	const move = ev => scrub(laneXToMs(ev.clientX))
	const up = () => {
		els.ruler.removeEventListener('pointermove', move)
		els.ruler.removeEventListener('pointerup', up)
	}
	els.ruler.addEventListener('pointermove', move)
	els.ruler.addEventListener('pointerup', up)
})

els.tracks.addEventListener('pointerdown', e => {
	const el = e.target.closest('.clip')
	if (!el) return
	const found = findClip(model, el.dataset.id)
	if (!found) return
	const {clip} = found
	selected = {type: 'clip', id: clip.id}
	if (clip.kind === 'timeline' && !e.target.classList.contains('resize')) {
		// Single click toggles collapse; drag still moves.
	}
	const resizing = clip.kind === 'tween' && e.target.classList.contains('resize')
	const startX = e.clientX
	const origOffset = clip.offset
	const origDuration = clipDuration(clip)
	el.setPointerCapture(e.pointerId)
	renderTracks()
	renderInspector()
	const move = ev => {
		const dMs = pxToTime(ev.clientX - startX, pxPerMs)
		if (resizing) {
			resizeClip(model, clip.id, origDuration + dMs)
			el.style.width = `${Math.max(8, timeToPx(clipDuration(clip), pxPerMs))}px`
		} else {
			moveClip(model, clip.id, origOffset + dMs)
			// baseOffset includes parent offset for nested children.
			const base = found.parent ? found.parent.offset + clip.offset : clip.offset
			el.style.left = `${timeToPx(base, pxPerMs)}px`
		}
		els.readout.textContent = `${clip.name}: offset=${Math.round(clip.offset)}ms dur=${Math.round(clipDuration(clip))}ms`
	}
	const up = ev => {
		el.removeEventListener('pointermove', move)
		el.removeEventListener('pointerup', up)
		// Click (no drag) on a nested clip toggles collapse.
		if (Math.abs(ev.clientX - startX) < 3 && clip.kind === 'timeline') toggleCollapsed(model, clip.id)
		rebuild()
	}
	el.addEventListener('pointermove', move)
	el.addEventListener('pointerup', up)
})

els.slider.addEventListener('input', () => {
	pause()
	scrub(Number(els.slider.value))
})

els.play.onclick = play
els.pause.onclick = pause
els.stop.onclick = stop
els.loop.onclick = () => {
	loop = !loop
	renderTransport()
}
els.speed.onchange = () => {
	// Rebase so the playhead does not jump when speed changes mid-flight.
	if (rafId) {
		playBase = currentMs
		wallStart = performance.now()
	}
	speed = Number(els.speed.value)
}
els.zoom.onchange = () => {
	pxPerMs = Number(els.zoom.value)
	renderRuler()
	renderTracks()
	renderPlayhead()
}

els.add.onclick = () => {
	const preset = PRESETS[model.clips.length % PRESETS.length]
	const clip = addTweenClip(model, {name: preset.name, to: preset.to})
	selected = {type: 'clip', id: clip.id}
	rebuild()
}

els.addNested.onclick = () => {
	const clip = addNestedTimeline(model)
	selected = {type: 'clip', id: clip.id}
	rebuild()
}

els.addLabel.onclick = () => {
	const n = model.labels.length + 1
	model.labels.push({name: `label-${n}`, offset: Math.round(currentMs)})
	selected = {type: 'label', name: `label-${n}`}
	rebuild()
}

els.dup.onclick = () => {
	if (selected && selected.type === 'clip') {
		const copy = duplicateClip(model, selected.id)
		if (copy) {
			selected = {type: 'clip', id: copy.id}
			rebuild()
		}
	}
}

els.del.onclick = () => {
	if (!selected) return
	if (selected.type === 'clip') deleteClip(model, selected.id)
	else model.labels = model.labels.filter(l => l.name !== selected.name)
	selected = null
	rebuild()
}

els.reset.onclick = () => {
	stopRaf()
	model = defaultModel()
	state = defaultState()
	currentMs = 0
	selected = null
	tl = null
	ensureStarted()
	tl.update(0)
	renderAll()
}

/** Push code edits into the model + tracks. Invalid code stops playback. */
function applyCode() {
	let parsed
	try {
		parsed = parseCode(els.codeIn.value)
	} catch (err) {
		stopRaf()
		if (tl) tl.stop()
		codeDirty = true
		setCodeError(String((err && err.message) || err))
		return
	}
	model = parsed.model
	state = parsed.state
	currentMs = Math.min(currentMs, getModelDuration(model))
	selected = null
	tl = null
	codeDirty = false
	ensureStarted()
	tl.update(currentMs)
	renderAll()
}

els.applyCode.onclick = applyCode

els.revertCode.onclick = () => {
	renderAll()
}

els.copyCode.onclick = async () => {
	await copyText(els.codeIn.value)
}

els.codeIn.addEventListener('input', () => {
	codeDirty = true
	els.applyCode.classList.add('active')
})

async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text)
	} catch {
		const ta = document.createElement('textarea')
		ta.value = text
		document.body.appendChild(ta)
		ta.select()
		document.execCommand('copy')
		ta.remove()
	}
}

document.addEventListener('keydown', e => {
	if (e.target === els.codeIn && e.key === 'Tab') {
		e.preventDefault()
		const ta = els.codeIn
		const {selectionStart: start, selectionEnd: end, value} = ta
		ta.value = value.slice(0, start) + '  ' + value.slice(end)
		ta.selectionStart = ta.selectionEnd = start + 2
		codeDirty = true
		els.applyCode.classList.add('active')
		return
	}
	if (e.target === els.codeIn && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
		e.preventDefault()
		applyCode()
		return
	}
	if (e.target.matches('input, textarea, select')) return
	if (e.code === 'Space') {
		e.preventDefault()
		if (codeError) return
		if (rafId) pause()
		else play()
	} else if (e.key === 'Delete' || e.key === 'Backspace') {
		els.del.onclick()
	}
})

// ---- boot ----

bootModel()
ensureStarted()
tl.update(0)
renderAll()
