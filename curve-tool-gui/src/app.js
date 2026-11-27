/**
 * Curve Tool — After Effects / Premiere style multi-point easing editor.
 *
 * - The graph canvas edits an ordered point list from (0, 0) to (1, 1),
 *   joined by cubic Bézier segments. Drag points and per-segment handles,
 *   double-click empty space to add a point, double-click (or Delete) an
 *   interior point to remove it. Endpoints stay pinned.
 * - The preview race (eased coral dot vs linear ghost) is driven by a real
 *   `Tween` using the edited easing, so what you see is what tween.js does.
 * - The code box holds the SVG path line plus a paste-ready, dependency-free
 *   tween.js snippet; Apply parses back a path, a snippet, or a classic
 *   `cubic-bezier(...)`.
 * All math lives in ./model.js (no DOM there).
 */
import {CubicBezierCurve, Easing, Tween} from '@tweenjs/tween.js'
import {
	LIMITS,
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
	makeEasing,
	moveHandle,
	movePoint,
	parseCode,
	toSVGPath,
} from './model.js'

const STORAGE_KEY = 'tweenjs-curve-tool-v3'
const HANDLE_R = 9
const POINT_R = 9

const $ = id => document.getElementById(id)
const els = {
	play: $('btn-play'),
	pause: $('btn-pause'),
	stop: $('btn-stop'),
	yoyo: $('btn-yoyo'),
	duration: $('sel-duration'),
	overlay: $('sel-overlay'),
	overlay2: $('sel-overlay-2'),
	readout: $('readout'),
	reset: $('btn-reset'),
	canvas: $('curve-canvas'),
	presets: $('presets'),
	pathChip: $('path-chip'),
	track: $('preview-track'),
	dot: $('preview-dot'),
	ghost: $('ghost-dot'),
	meta: $('preview-meta'),
	inspector: $('inspector-body'),
	codeIn: $('code-in'),
	codeError: $('code-error'),
	applyCode: $('btn-apply-code'),
	revertCode: $('btn-revert-code'),
	copyCode: $('btn-copy-code'),
	canvasWrap: $('canvas-wrap'),
	canvasLock: $('canvas-lock'),
}

function resolveEasing(name) {
	let fn = Easing
	for (const p of name.split('.')) fn = fn[p]
	if (typeof fn !== 'function') throw new Error(`Unknown easing: ${name}`)
	return fn
}

// ---- state ----

let curve = createDefault()
let sourceName = 'Custom' // 'Custom' or a SOURCES built-in like 'Back.Out'
let duration = 1200
let yoyo = true
let selected = {type: 'point', index: 1}
let lastCanonical = ''

function isCustom() {
	return sourceName === 'Custom'
}

function currentEasing() {
	return isCustom() ? makeEasing(curve) : resolveEasing(sourceName)
}

function currentSource() {
	return isCustom() ? customSource(curve) : builtinSource(sourceName)
}

// Preview race (explicit clock: we own `previewT`, the same pattern as
// examples/21_timeline_slider.html).
let tween = null
let previewT = 0
let previewDir = 1
let rafId = 0
let lastWall = 0

function loadStored() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		return JSON.parse(raw)
	} catch {
		return null
	}
}

function save() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({sourceName, curve, duration, yoyo}))
	} catch {
		// Storage full/unavailable: the tool still works in-memory.
	}
}

function boot() {
	const stored = loadStored()
	if (stored) {
		if (typeof stored.sourceName === 'string' && SOURCES.includes(stored.sourceName)) sourceName = stored.sourceName
		// Backwards compat with the v2 overlay key.
		if (typeof stored.overlayName === 'string' && SOURCES.includes(stored.overlayName)) sourceName = stored.overlayName
		if (stored.curve && Array.isArray(stored.curve.points)) curve = stored.curve
		if (Number.isFinite(+stored.duration)) duration = +stored.duration
		yoyo = stored.yoyo !== false
	}
	if (curve.points.length < 2) curve = createDefault()
	selected = {type: 'point', index: Math.min(1, curve.points.length - 1)}
	window.__guiBooted = true
}

// ---- canvas graph ----

const PAD = {l: 44, r: 16, t: 16, b: 28}

function canvasBox() {
	const dpr = Math.min(2, window.devicePixelRatio || 1)
	const w = els.canvas.clientWidth
	const h = els.canvas.clientHeight
	return {w, h, dpr}
}

function xToPx(x, w) {
	return PAD.l + x * (w - PAD.l - PAD.r)
}

function yToPx(y, h) {
	const {yMin, yMax} = LIMITS
	return PAD.t + (1 - (y - yMin) / (yMax - yMin)) * (h - PAD.t - PAD.b)
}

function pxToCurve(px, py, w, h) {
	const {yMin, yMax} = LIMITS
	return {
		x: (px - PAD.l) / (w - PAD.l - PAD.r),
		y: yMax - ((py - PAD.t) / (h - PAD.t - PAD.b)) * (yMax - yMin),
	}
}

/**
 * Sample the edited path as real tween.js curves: one CubicBezierCurve per
 * segment, uniformly sampled in t. This is the shape the canvas draws; the
 * easing itself (`makeEasing`) inverts these same segments x → y.
 */
function sampleSegments(perSeg = 24) {
	const out = []
	for (let i = 0; i < curve.handles.length; i++) {
		const seg = new CubicBezierCurve(curve.points[i], curve.handles[i].c1, curve.handles[i].c2, curve.points[i + 1])
		for (let k = i === 0 ? 0 : 1; k <= perSeg; k++) {
			const p = seg.getPoint(k / perSeg)
			out.push([p.x, p.y])
		}
	}
	return out
}

function draw() {
	const {w, h, dpr} = canvasBox()
	if (w === 0 || h === 0) return
	if (els.canvas.width !== Math.round(w * dpr) || els.canvas.height !== Math.round(h * dpr)) {
		els.canvas.width = Math.round(w * dpr)
		els.canvas.height = Math.round(h * dpr)
	}
	const ctx = els.canvas.getContext('2d')
	if (!ctx) return
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	ctx.clearRect(0, 0, w, h)

	// Grid.
	ctx.lineWidth = 1
	for (let i = 0; i <= 10; i++) {
		const x = xToPx(i / 10, w)
		ctx.strokeStyle = i % 5 === 0 ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.1)'
		ctx.beginPath()
		ctx.moveTo(x, PAD.t)
		ctx.lineTo(x, h - PAD.b)
		ctx.stroke()
		if (i % 5 === 0) {
			ctx.fillStyle = '#8b8fa3'
			ctx.font = '10px system-ui'
			ctx.fillText((i / 10).toFixed(1), x - 8, h - 10)
		}
	}
	for (let y = LIMITS.yMin; y <= LIMITS.yMax + 1e-9; y += 0.5) {
		const py = yToPx(y, h)
		const major = y === 0 || y === 1
		ctx.strokeStyle = major ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.1)'
		ctx.setLineDash(major ? [] : [3, 4])
		ctx.beginPath()
		ctx.moveTo(PAD.l, py)
		ctx.lineTo(w - PAD.r, py)
		ctx.stroke()
		ctx.setLineDash([])
		if (major) {
			ctx.fillStyle = '#6366f1'
			ctx.font = 'bold 10px system-ui'
			ctx.fillText(`y=${y}`, 6, py + 3)
		}
	}
	ctx.fillStyle = '#8b8fa3'
	ctx.font = '10px system-ui'
	ctx.fillText('time →', w - 52, h - 10)

	// The active easing: editable custom path, or a locked built-in sampled
	// straight from the Easing tree.
	const active = currentEasing()
	const sampled = []
	if (isCustom()) {
		for (const [x, y] of sampleSegments()) sampled.push([x, Math.max(LIMITS.yMin, Math.min(LIMITS.yMax, y))])
	} else {
		const n = 120
		for (let i = 0; i <= n; i++) {
			const x = i / n
			sampled.push([x, Math.max(LIMITS.yMin, Math.min(LIMITS.yMax, active(x)))])
		}
	}
	const baseY = yToPx(0, h)
	const grad = ctx.createLinearGradient(0, PAD.t, 0, h - PAD.b)
	grad.addColorStop(0, 'rgba(99,102,241,0.22)')
	grad.addColorStop(1, 'rgba(99,102,241,0.02)')
	ctx.beginPath()
	for (const [i, [sx, sy]] of sampled.entries()) {
		const px = xToPx(sx, w)
		const py = yToPx(Math.max(LIMITS.yMin, Math.min(LIMITS.yMax, sy)), h)
		if (i === 0) ctx.moveTo(px, baseY)
		ctx.lineTo(px, py)
	}
	ctx.lineTo(xToPx(1, w), baseY)
	ctx.closePath()
	ctx.fillStyle = grad
	ctx.fill()

	ctx.save()
	ctx.shadowColor = 'rgba(99,102,241,0.55)'
	ctx.shadowBlur = 12
	ctx.strokeStyle = '#6366f1'
	ctx.lineWidth = 3
	ctx.lineJoin = 'round'
	ctx.beginPath()
	for (const [i, [sx, sy]] of sampled.entries()) {
		const px = xToPx(sx, w)
		const py = yToPx(Math.max(LIMITS.yMin, Math.min(LIMITS.yMax, sy)), h)
		if (i === 0) ctx.moveTo(px, py)
		else ctx.lineTo(px, py)
	}
	ctx.stroke()
	ctx.restore()

	// Handles + points only in Custom mode; built-ins are locked.
	if (isCustom()) {
		// Handle arms + handles per segment.
		curve.handles.forEach((sg, i) => {
			const p0 = curve.points[i]
			const p3 = curve.points[i + 1]
			const a = {x: xToPx(p0.x, w), y: yToPx(p0.y, h)}
			const b = {x: xToPx(p3.x, w), y: yToPx(p3.y, h)}
			const c1 = {x: xToPx(sg.c1.x, w), y: yToPx(sg.c1.y, h)}
			const c2 = {x: xToPx(sg.c2.x, w), y: yToPx(sg.c2.y, h)}
			ctx.strokeStyle = 'rgba(244,114,182,0.55)'
			ctx.lineWidth = 1.5
			ctx.beginPath()
			ctx.moveTo(a.x, a.y)
			ctx.lineTo(c1.x, c1.y)
			ctx.moveTo(b.x, b.y)
			ctx.lineTo(c2.x, c2.y)
			ctx.stroke()
			for (const [which, p] of [
				['c1', c1],
				['c2', c2],
			]) {
				const isSel = selected.type === 'handle' && selected.seg === i && selected.which === which
				ctx.fillStyle = isSel ? '#fff' : '#f9a8d4'
				ctx.strokeStyle = '#db2777'
				ctx.lineWidth = 2
				ctx.beginPath()
				ctx.arc(p.x, p.y, HANDLE_R - 2, 0, Math.PI * 2)
				ctx.fill()
				ctx.stroke()
			}
		})

		// Points (endpoints pinned, interior draggable).
		curve.points.forEach((p, i) => {
			const px = xToPx(p.x, w)
			const py = yToPx(p.y, h)
			const pinned = i === 0 || i === curve.points.length - 1
			const isSel = selected.type === 'point' && selected.index === i
			ctx.save()
			if (isSel) {
				ctx.shadowColor = 'rgba(99,102,241,0.6)'
				ctx.shadowBlur = 10
			}
			ctx.fillStyle = pinned ? '#c7d2fe' : '#4f46e5'
			ctx.strokeStyle = '#fff'
			ctx.lineWidth = 2.5
			ctx.beginPath()
			ctx.arc(px, py, POINT_R - 1, 0, Math.PI * 2)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
			if (pinned) {
				ctx.fillStyle = '#4f46e5'
				ctx.font = 'bold 8px system-ui'
				ctx.fillText('🔒', px - 5, py + 3)
			}
		})
	}
}

// ---- preview race (a real Tween with the edited easing) ----

function buildTween() {
	previewT = 0
	previewDir = 1
	const state = {t: 0}
	tween = new Tween(state)
		.to({t: 1}, duration)
		.easing(currentEasing())
		.onUpdate(() => {
			previewT = state.t
			renderPreview()
		})
		.start(0)
	lastWall = performance.now()
}

function renderPreview() {
	const trackW = els.track.clientWidth - 16
	const dotW = 40
	const y = currentEasing()(Math.max(0, Math.min(1, previewT)))
	const x = Math.max(0, Math.min(1, y)) * (trackW - dotW)
	const gx = previewT * (trackW - 14)
	els.dot.style.transform = `translateX(${Math.round(x)}px)`
	els.ghost.style.transform = `translateX(${Math.round(gx)}px)`
	els.dot.textContent = `${Math.round(previewT * 100)}%`
	els.readout.textContent = `t=${previewT.toFixed(2)} · y=${y.toFixed(2)}`
	if (isCustom()) {
		const bits = [`${curve.points.length} pts · ${curve.handles.length} seg`, `eased ${Math.round(y * 100)}%`]
		if (!isMonotonic(curve)) bits.push('⚠ non-monotonic: overshoot/anticipation mid-flight')
		els.meta.textContent = bits.join(' · ')
	} else {
		els.meta.textContent = `Easing.${sourceName} (locked built-in) · eased ${Math.round(y * 100)}%`
	}
}

function tick(wallNow) {
	const dt = wallNow - lastWall
	lastWall = wallNow
	const step = (dt / duration) * previewDir
	let next = previewT + step
	if (next >= 1) {
		if (yoyo) {
			next = 1 - (next - 1)
			previewDir = -1
		} else {
			buildTweenSilent()
			next = 0
		}
	} else if (next <= 0) {
		if (yoyo) {
			next = -next
			previewDir = 1
		} else {
			buildTweenSilent()
			next = 1
		}
	}
	previewT = Math.max(0, Math.min(1, next))
	if (tween) tween.update(previewT * duration)
	renderPreview()
	rafId = requestAnimationFrame(tick)
}

function buildTweenSilent() {
	const state = {t: 0}
	tween = new Tween(state)
		.to({t: 1}, duration)
		.easing(currentEasing())
		.onUpdate(() => {
			previewT = state.t
		})
		.start(0)
}

function play() {
	stopRaf()
	buildTween()
	previewDir = 1
	rafId = requestAnimationFrame(tick)
}

function pause() {
	stopRaf()
}

function stop() {
	stopRaf()
	previewT = 0
	previewDir = 1
	buildTweenSilent()
	if (tween) tween.update(0)
	renderPreview()
}

function stopRaf() {
	if (rafId) cancelAnimationFrame(rafId)
	rafId = 0
}

// ---- inspector / presets / overlays ----

function renderInspector() {
	els.inspector.innerHTML = ''
	if (!isCustom()) {
		const note = document.createElement('p')
		note.className = 'hint'
		note.textContent = `Easing.${sourceName} is a locked built-in — switch the source back to Custom to edit keyframes.`
		els.inspector.appendChild(note)
		return
	}
	const title = document.createElement('p')
	title.className = 'hint'
	title.textContent = 'Endpoints are pinned; drag or edit interior points.'
	els.inspector.appendChild(title)
	curve.points.forEach((p, i) => {
		const pinned = i === 0 || i === curve.points.length - 1
		const row = document.createElement('div')
		row.className = 'pt-row' + (selected.type === 'point' && selected.index === i ? ' picked' : '')
		const dot = document.createElement('span')
		dot.className = 'pt-dot' + (pinned ? ' locked' : '')
		dot.textContent = pinned ? '🔒' : `P${i}`
		row.appendChild(dot)
		for (const key of ['x', 'y']) {
			const input = document.createElement('input')
			input.type = 'number'
			input.step = '0.01'
			input.value = String(Math.round(p[key] * 1000) / 1000)
			input.title = key === 'x' ? 'time' : 'value'
			input.disabled = pinned
			input.addEventListener('change', () => {
				const v = Number(input.value)
				if (!Number.isFinite(v)) {
					input.value = String(p[key])
					return
				}
				setCurve(movePoint(curve, i, key === 'x' ? v : p.x, key === 'y' ? v : p.y), {type: 'point', index: i})
			})
			input.addEventListener('focus', () => {
				selected = {type: 'point', index: i}
				draw()
			})
			row.appendChild(input)
		}
		if (!pinned) {
			const del = document.createElement('button')
			del.textContent = '×'
			del.title = 'Delete point'
			del.onclick = () => {
				const next = deletePoint(curve, i)
				if (next) setCurve(next, {type: 'point', index: Math.max(0, i - 1)})
			}
			row.appendChild(del)
		}
		row.addEventListener('pointerdown', () => {
			selected = {type: 'point', index: i}
			draw()
			renderInspector()
		})
		els.inspector.appendChild(row)
	})
	if (!isMonotonic(curve)) {
		const warn = document.createElement('p')
		warn.className = 'warn'
		warn.textContent =
			'⚠ Non-monotonic: eased values overshoot [0, 1] or move backwards — intentional for anticipation / follow-through.'
		els.inspector.appendChild(warn)
	}
}

function presetPath(name) {
	return toSVGPath(createPreset(name))
}

function renderPresets() {
	els.presets.innerHTML = ''
	const current = isCustom() ? toSVGPath(curve) : null
	for (const name of PRESET_NAMES) {
		const b = document.createElement('button')
		b.textContent = name
		b.title = presetPath(name)
		b.disabled = !isCustom()
		if (current !== null && presetPath(name) === current) b.classList.add('picked')
		b.onclick = () => setCurve(createPreset(name), {type: 'point', index: 0})
		els.presets.appendChild(b)
	}
}

function renderSources() {
	for (const sel of [els.overlay, els.overlay2]) {
		sel.innerHTML = ''
		for (const name of SOURCES) {
			const opt = document.createElement('option')
			opt.value = name
			opt.textContent = name === 'Custom' ? 'Custom (editable)' : `Easing.${name}`
			sel.appendChild(opt)
		}
		sel.value = sourceName
		sel.onchange = () => setSource(sel.value)
	}
}

/** Switch the easing source; built-ins lock the graph, Custom unlocks it. */
function setSource(name) {
	if (!SOURCES.includes(name)) return
	sourceName = name
	els.overlay.value = sourceName
	els.overlay2.value = sourceName
	els.canvas.classList.toggle('locked', !isCustom())
	els.canvasLock.hidden = isCustom()
	save()
	renderAll()
	const wasPlaying = rafId !== 0
	buildTweenSilent()
	if (wasPlaying) play()
	else {
		if (tween) tween.update(previewT * duration)
		renderPreview()
	}
}

// ---- code box ----

function syncCode() {
	const text = generateCode(currentSource())
	if (text !== lastCanonical) {
		els.codeIn.value = text
		lastCanonical = text
	}
	els.pathChip.textContent = isCustom()
		? `Custom · ${curve.points.length} pts · ${curve.handles.length} seg`
		: `Easing.${sourceName}`
}

function showError(msg) {
	if (msg) {
		els.codeError.textContent = msg
		els.codeError.hidden = false
	} else {
		els.codeError.hidden = true
	}
}

function applyCode() {
	try {
		const next = parseCode(els.codeIn.value)
		showError(null)
		if (isCustomSource(next)) setCurve(next.curve, {type: 'point', index: 0})
		else setSource(next.name)
	} catch (err) {
		showError(err instanceof Error ? err.message : String(err))
	}
}

// ---- model edit entry point ----

function setCurve(next, select) {
	curve = cloneCurve(next)
	if (select) selected = select
	if (selected.type === 'point') selected.index = Math.min(selected.index, curve.points.length - 1)
	save()
	renderAll()
	const wasPlaying = rafId !== 0
	buildTweenSilent()
	if (wasPlaying) play()
	else {
		if (tween) tween.update(previewT * duration)
		renderPreview()
	}
}

function renderAll() {
	draw()
	renderInspector()
	renderPresets()
	syncCode()
	renderPreview()
}

// ---- canvas gestures ----

function canvasPos(evt) {
	const r = els.canvas.getBoundingClientRect()
	return {x: evt.clientX - r.left, y: evt.clientY - r.top}
}

function hitTest(pos) {
	const {w, h} = canvasBox()
	// Handles first (smaller targets on top).
	for (let i = 0; i < curve.handles.length; i++) {
		for (const which of ['c1', 'c2']) {
			const s = curve.handles[i][which]
			if (Math.hypot(xToPx(s.x, w) - pos.x, yToPx(s.y, h) - pos.y) <= HANDLE_R + 4) {
				return {type: 'handle', seg: i, which}
			}
		}
	}
	for (let i = 0; i < curve.points.length; i++) {
		const p = curve.points[i]
		if (Math.hypot(xToPx(p.x, w) - pos.x, yToPx(p.y, h) - pos.y) <= POINT_R + 4) {
			return {type: 'point', index: i}
		}
	}
	return null
}

function bindGestures() {
	let dragging = null
	els.canvas.addEventListener('pointerdown', evt => {
		if (!isCustom()) return // locked built-in: the graph can't be changed
		const pos = canvasPos(evt)
		const hit = hitTest(pos)
		if (!hit) {
			selected = {type: 'point', index: 0}
			renderInspector()
			draw()
			return
		}
		dragging = hit
		selected =
			hit.type === 'point' ? {type: 'point', index: hit.index} : {type: 'handle', seg: hit.seg, which: hit.which}
		els.canvas.setPointerCapture(evt.pointerId)
		evt.preventDefault()
		renderInspector()
		draw()
	})
	els.canvas.addEventListener('pointermove', evt => {
		if (!dragging) return
		const pos = canvasPos(evt)
		const {w, h} = canvasBox()
		const {x, y} = pxToCurve(pos.x, pos.y, w, h)
		if (dragging.type === 'point') {
			setCurve(movePoint(curve, dragging.index, x, y), {type: 'point', index: dragging.index})
		} else {
			setCurve(moveHandle(curve, dragging.seg, dragging.which, x, y), {
				type: 'handle',
				seg: dragging.seg,
				which: dragging.which,
			})
		}
	})
	const end = () => {
		dragging = null
	}
	els.canvas.addEventListener('pointerup', end)
	els.canvas.addEventListener('pointercancel', end)

	els.canvas.addEventListener('dblclick', evt => {
		if (!isCustom()) return // locked built-in: the graph can't be changed
		const pos = canvasPos(evt)
		const hit = hitTest(pos)
		if (hit && hit.type === 'point' && hit.index > 0 && hit.index < curve.points.length - 1) {
			const next = deletePoint(curve, hit.index)
			if (next) setCurve(next, {type: 'point', index: hit.index - 1})
			return
		}
		if (!hit) {
			const {w, h} = canvasBox()
			const {x} = pxToCurve(pos.x, pos.y, w, h)
			const {curve: next, index} = addPoint(curve, x)
			setCurve(next, {type: 'point', index})
		}
	})

	window.addEventListener('keydown', evt => {
		if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return
		if (!isCustom()) return // locked built-in: the graph can't be changed
		if ((evt.key === 'Delete' || evt.key === 'Backspace') && selected.type === 'point') {
			const next = deletePoint(curve, selected.index)
			if (next) {
				setCurve(next, {type: 'point', index: Math.max(0, selected.index - 1)})
				evt.preventDefault()
			}
			return
		}
		const step = evt.shiftKey ? 0.05 : 0.01
		const nudge = (dx, dy) => {
			if (selected.type === 'point') {
				const p = curve.points[selected.index]
				setCurve(movePoint(curve, selected.index, p.x + dx, p.y + dy), selected)
			} else {
				const s = curve.handles[selected.seg][selected.which]
				setCurve(moveHandle(curve, selected.seg, selected.which, s.x + dx, s.y + dy), selected)
			}
		}
		if (evt.key === 'ArrowLeft') nudge(-step, 0)
		else if (evt.key === 'ArrowRight') nudge(step, 0)
		else if (evt.key === 'ArrowUp') nudge(0, step)
		else if (evt.key === 'ArrowDown') nudge(0, -step)
		else return
		evt.preventDefault()
	})
}

// ---- boot ----

function bindTransport() {
	els.play.onclick = play
	els.pause.onclick = pause
	els.stop.onclick = stop
	els.yoyo.onclick = () => {
		yoyo = !yoyo
		els.yoyo.classList.toggle('active', yoyo)
		save()
	}
	els.yoyo.classList.toggle('active', yoyo)
	els.duration.onchange = () => {
		duration = Number(els.duration.value) || 1200
		save()
		setCurve(curve)
	}
	els.duration.value = String(duration)
	els.reset.onclick = () => setCurve(createDefault(), {type: 'point', index: 1})
	els.applyCode.onclick = applyCode
	els.revertCode.onclick = () => {
		showError(null)
		els.codeIn.value = lastCanonical
	}
	els.copyCode.onclick = async () => {
		try {
			await navigator.clipboard.writeText(els.codeIn.value)
			els.copyCode.textContent = 'Copied!'
			setTimeout(() => (els.copyCode.textContent = 'Copy'), 1200)
		} catch {
			els.codeIn.select()
			document.execCommand('copy')
		}
	}
	els.codeIn.addEventListener('keydown', evt => {
		if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') applyCode()
	})
	window.addEventListener('resize', draw)
}

boot()
renderSources()
bindGestures()
bindTransport()
setSource(sourceName)
play()
