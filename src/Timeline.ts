/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * Timeline: compose Tweens (and nested Timelines) in sequence and in parallel.
 *
 * Inspired by trusktr's vision in #647 / #560:
 * - Tween does tweening, Timeline does orchestration (replaces `.chain`,
 *   and handles repeat/yoyo at a higher level).
 * - Single class, sequential by default (append), parallel via explicit offset.
 * - Simple, Three.js ethos: small API, explicit times, no magic.
 */

import Sequence from './Sequence'
import now from './Now'

import type {EasingFunction} from './Easing'
import type {InterpolationFunction} from './Interpolation'
import type {Tween} from './Tween'

export type TimelineChild = Tween<any> | Timeline
export type TimelinePosition = number | string

type TimelineEntry = {
	node: TimelineChild
	offset: number
}

export class Timeline {
	static autoStartOnUpdate = false

	private _id = Sequence.nextId()
	private _entries: Array<TimelineEntry> = []
	private _labels: Record<string, number> = {afterInit: 0, afterLast: 0}

	private _duration = 0
	private _startTime = 0
	private _isPlaying = false
	private _isPaused = false
	private _pauseStart = 0

	private _delayTime = 0
	private _initialRepeat = 0
	private _repeat = 0
	private _repeatDelayTime?: number
	private _yoyo = false
	private _reversed = false

	private _onStartCallback?: (timeline: Timeline) => void
	private _onStartCallbackFired = false
	private _onEveryStartCallback?: (timeline: Timeline) => void
	private _onEveryStartCallbackFired = false
	private _onUpdateCallback?: (timeline: Timeline, elapsed: number) => void
	private _onRepeatCallback?: (timeline: Timeline) => void
	private _onCompleteCallback?: (timeline: Timeline) => void
	private _onStopCallback?: (timeline: Timeline) => void

	constructor() {
		// Empty on purpose. Use `.add()` to compose.
		// Sequential by default, parallel via explicit offset 0 or labels.
	}

	getId(): number {
		return this._id
	}

	isPlaying(): boolean {
		return this._isPlaying
	}

	isPaused(): boolean {
		return this._isPaused
	}

	/** Duration of one iteration (max child end), excluding own delay/repeats. */
	getDuration(): number {
		return this._duration
	}

	/**
	 * Total duration from `start()` call, including own delay, repeats and
	 * repeat delays. `Infinity` when repeating forever or containing an
	 * infinite child.
	 */
	getTotalDuration(): number {
		if (!isFinite(this._initialRepeat) || !isFinite(this._duration)) return Infinity
		const repeatDelay = this._repeatDelayTime ?? this._delayTime
		return this._delayTime + this._duration + this._initialRepeat * (this._duration + repeatDelay)
	}

	getAll(): Array<TimelineChild> {
		return this._entries.map(entry => entry.node)
	}

	has(node: TimelineChild): boolean {
		return this._entries.some(entry => entry.node === node)
	}

	/** Resolve a position to a local time in ms. */
	private _parsePosition(position?: TimelinePosition): number {
		if (position === undefined) return this._duration // append = sequential default
		if (typeof position === 'number') return position

		const s = position.trim()
		if (s === '>') return this._duration
		if (s === '<') {
			if (this._entries.length === 0) return 0
			return this._entries[this._entries.length - 1].offset
		}

		// Relative to afterLast: "+=100", "-=50"
		if (s.startsWith('+=') || s.startsWith('-=')) {
			const delta = parseFloat(s.slice(2))
			if (isNaN(delta)) return this._duration
			return this._duration + (s.startsWith('+=') ? delta : -delta)
		}

		// "label+=100", "label-=100", "label"
		const match = s.match(/^(.*?)([+-]=)(-?\d+(?:\.\d+)?)$/)
		if (match) {
			const [, label, op, amountStr] = match
			const base = this._labels[label.trim()] ?? 0
			const amount = parseFloat(amountStr)
			if (isNaN(amount)) return base
			return op === '+=' ? base + amount : base - amount
		}

		if (s in this._labels) return this._labels[s]

		const asNumber = parseFloat(s)
		if (!isNaN(asNumber)) return asNumber

		// Unknown label -> treat as append to stay robust.
		return this._duration
	}

	addLabel(name: string, offset: TimelinePosition): this {
		const time = typeof offset === 'number' ? offset : this._parsePosition(offset)
		this._labels[name] = time
		return this
	}

	removeLabel(name: string): this {
		if (name === 'afterInit' || name === 'afterLast') return this
		delete this._labels[name]
		return this
	}

	getLabel(name: string): number | undefined {
		return this._labels[name]
	}

	private _recalculateDuration(): void {
		let max = 0
		let infinite = false
		for (const entry of this._entries) {
			const childTotal = entry.node.getTotalDuration()
			if (!isFinite(childTotal)) {
				infinite = true
				break
			}
			max = Math.max(max, entry.offset + childTotal)
		}
		this._duration = infinite ? Infinity : max
		this._labels['afterLast'] = this._duration
	}

	/**
	 * Add a Tween or nested Timeline.
	 *
	 * - `add(tween)` appends after the last child (sequential).
	 * - `add(tween, 0)` starts at timeline start (parallel).
	 * - `add(tween, 500)` starts at 500ms.
	 * - `add(tween, 'myLabel')`, `add(tween, 'myLabel+=100')`, `add(tween, '<')`, `add(tween, '>')`.
	 * - `add([a, b])` adds sequentially; `add([a, b], 0)` adds in parallel.
	 */
	add(node: TimelineChild | Array<TimelineChild>, position?: TimelinePosition): this {
		if (Array.isArray(node)) {
			// Sequential when no explicit position, parallel when explicit.
			if (position === undefined) {
				for (const child of node) this.add(child)
			} else {
				const offset = this._parsePosition(position)
				for (const child of node) this._addSingle(child, offset)
			}
			return this
		}
		const offset = this._parsePosition(position)
		return this._addSingle(node, offset)
	}

	private _addSingle(node: TimelineChild, offset: number): this {
		// A child can only be in one timeline at a time for predictable ownership.
		// If it was already added, move it (update offset) instead of duplicating.
		const existing = this._entries.find(entry => entry.node === node)
		if (existing) {
			existing.offset = offset
		} else {
			this._entries.push({node, offset})
			// If timeline is already playing, new child joins immediately.
			if (this._isPlaying && !this._isPaused) {
				if (node.isPlaying()) node.stop()
				node.start(offset)
			}
		}
		this._recalculateDuration()
		return this
	}

	remove(...nodes: Array<TimelineChild>): this {
		let changed = false
		for (const node of nodes) {
			const index = this._entries.findIndex(entry => entry.node === node)
			if (index !== -1) {
				this._entries.splice(index, 1)
				changed = true
			}
		}
		if (changed) this._recalculateDuration()
		return this
	}

	removeAll(): this {
		this._entries = []
		this._recalculateDuration()
		return this
	}

	delay(amount = 0): this {
		this._delayTime = amount
		return this
	}

	repeat(times = 0): this {
		this._initialRepeat = times
		this._repeat = times
		return this
	}

	repeatDelay(amount?: number): this {
		this._repeatDelayTime = amount
		return this
	}

	yoyo(yoyo = false): this {
		this._yoyo = yoyo
		return this
	}

	onStart(callback?: (timeline: Timeline) => void): this {
		this._onStartCallback = callback
		return this
	}

	onEveryStart(callback?: (timeline: Timeline) => void): this {
		this._onEveryStartCallback = callback
		return this
	}

	onUpdate(callback?: (timeline: Timeline, elapsed: number) => void): this {
		this._onUpdateCallback = callback
		return this
	}

	onRepeat(callback?: (timeline: Timeline) => void): this {
		this._onRepeatCallback = callback
		return this
	}

	onComplete(callback?: (timeline: Timeline) => void): this {
		this._onCompleteCallback = callback
		return this
	}

	onStop(callback?: (timeline: Timeline) => void): this {
		this._onStopCallback = callback
		return this
	}

	/** Convenience: set easing for all child Tweens (recurses into nested Timelines). */
	easing(easingFunction: EasingFunction): this {
		for (const entry of this._entries) {
			const child = entry.node
			if (child instanceof Timeline) child.easing(easingFunction)
			else (child as Tween<any>).easing(easingFunction)
		}
		return this
	}

	/** Convenience: set interpolation for all child Tweens (recurses). */
	interpolation(interpolationFunction: InterpolationFunction): this {
		for (const entry of this._entries) {
			const child = entry.node
			if (child instanceof Timeline) child.interpolation(interpolationFunction)
			else (child as Tween<any>).interpolation(interpolationFunction)
		}
		return this
	}

	start(time: number = now()): this {
		if (this._isPlaying) return this

		this._recalculateDuration()
		this._repeat = this._initialRepeat
		this._reversed = false
		this._isPlaying = true
		this._isPaused = false
		this._onStartCallbackFired = false
		this._onEveryStartCallbackFired = false
		this._startTime = time + this._delayTime

		for (const entry of this._entries) {
			if (entry.node.isPlaying()) entry.node.stop()
			entry.node.start(entry.offset)
		}

		return this
	}

	stop(): this {
		if (!this._isPlaying) return this

		for (const entry of this._entries) {
			if (entry.node.isPlaying()) entry.node.stop()
		}

		this._isPlaying = false
		this._isPaused = false

		if (this._onStopCallback) this._onStopCallback(this)

		return this
	}

	pause(time: number = now()): this {
		if (this._isPaused || !this._isPlaying) return this
		this._isPaused = true
		this._pauseStart = time
		return this
	}

	resume(time: number = now()): this {
		if (!this._isPaused || !this._isPlaying) return this
		this._isPaused = false
		this._startTime += time - this._pauseStart
		this._pauseStart = 0
		return this
	}

	/**
	 * @returns true if still playing after update, false otherwise.
	 * Children use a local clock (0 = timeline start), so yoyo/reverse is a
	 * single time mapping with no offset mirroring needed.
	 */
	update(time = now(), autoStart = Timeline.autoStartOnUpdate): boolean {
		if (this._isPaused) return true

		if (!this._isPlaying) {
			if (autoStart) this.start(time)
			else return false
		}

		if (time < this._startTime) return true

		if (!this._onStartCallbackFired) {
			if (this._onStartCallback) this._onStartCallback(this)
			this._onStartCallbackFired = true
		}

		if (!this._onEveryStartCallbackFired) {
			if (this._onEveryStartCallback) this._onEveryStartCallback(this)
			this._onEveryStartCallbackFired = true
		}

		const timelineLocal = time - this._startTime

		// Infinite timelines never complete; just drive children.
		if (!isFinite(this._duration)) {
			const effective = this._reversed ? 0 : timelineLocal
			for (const entry of this._entries) entry.node.update(effective)
			const elapsed = 0
			if (this._onUpdateCallback) this._onUpdateCallback(this, elapsed)
			return true
		}

		const clampedLocal = Math.min(timelineLocal, this._duration)
		const effectiveLocal = this._reversed ? this._duration - clampedLocal : clampedLocal

		for (const entry of this._entries) entry.node.update(effectiveLocal)

		const elapsed = this._duration === 0 ? 1 : effectiveLocal / this._duration
		if (this._onUpdateCallback) this._onUpdateCallback(this, elapsed)

		if (this._duration === 0 || timelineLocal >= this._duration) {
			if (this._repeat > 0 || !isFinite(this._repeat)) {
				const durationAndDelay = this._duration + (this._repeatDelayTime ?? this._delayTime)
				// How many iterations completed in this overshoot (tab sleep safe).
				const completeCount = Math.min(
					Math.trunc((timelineLocal - this._duration) / durationAndDelay) + 1,
					isFinite(this._repeat) ? this._repeat : Infinity,
				)

				if (isFinite(this._repeat)) this._repeat -= completeCount
				this._startTime += durationAndDelay * completeCount

				if (this._yoyo) {
					// Odd number of completed iterations flips direction.
					if (completeCount % 2 === 1) this._reversed = !this._reversed
				}

				// Restart children for the next iteration.
				for (const entry of this._entries) {
					if (entry.node.isPlaying()) entry.node.stop()
					entry.node.start(entry.offset)
				}

				if (this._onRepeatCallback) this._onRepeatCallback(this)
				this._onEveryStartCallbackFired = false

				return true
			} else {
				if (this._onCompleteCallback) this._onCompleteCallback(this)
				this._isPlaying = false
				return false
			}
		}

		return true
	}
}

export default Timeline
