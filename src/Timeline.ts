/**
 * @file Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * Timeline: compose Tweens (and nested Timelines) in sequence and in parallel.
 *
 * Inspired by trusktr's vision in #647 / #560:
 * - Tween does tweening, Timeline does orchestration (replaces `.chain`).
 * - Single class, sequential by default (append), parallel via explicit offset.
 * - Simple, Three.js ethos: small API, explicit times, no magic.
 */

import Sequence from './Sequence'
import now from './Now'

import type {EasingFunction} from './Easing'
import type {InterpolationFunction} from './Interpolation'
import type {Tween} from './Tween'

/** A Tween or nested Timeline that can be added to a timeline. */
export type TimelineChild = Tween<any> | Timeline

/**
 * A position specifier for {@link Timeline.add}:
 * - A {@link TimelineChild} to align to another child's start.
 * - A `number` for a millisecond offset.
 * - A `string` for a named label.
 */
export type TimelineAt = TimelineChild | number | string

/** Options for {@link Timeline.add} to control placement and repetition. */
export type TimelineAddOptions = {
	/**
	 * A time value, label, or child to align to. Defaults to the end of the
	 * timeline.
	 */
	at?: TimelineAt
	/** Entry index to align to (takes precedence over `at`). */
	atIndex?: number
	/** Offset added to the aligned base, in milliseconds. Defaults to 0. */
	offset?: number
	/**
	 * When true, shifts entries at and after the insertion point later so
	 * nothing overlaps.
	 */
	shift?: boolean
	/**
	 * Total number of times to play the child. Each extra play clones the
	 * child (documented), so every clip has independent playback state.
	 * Must be a positive integer, defaults to 1. One call may not expand
	 * past {@link MAX_TIMELINE_DURATION_MS}.
	 */
	repeat?: number
	/**
	 * Alternate each play with a reversed clip (`child.reverse()`), i.e. a
	 * yoyo without `yoyo()`. Total clips are `repeat * 2`, starting with the
	 * original: `{yoyo: true, repeat: 2}` plays
	 * forward, backward, forward, backward. Only supported for `Tween`
	 * children; nested timelines must be reversed manually.
	 */
	yoyo?: boolean
}

/**
 * A position specifier: a {@link TimelineAt} value or a full
 * {@link TimelineAddOptions} object.
 */
export type TimelinePosition = TimelineAt | TimelineAddOptions

/**
 * One `add()` call may not expand to more than 72 hours of clips (a full
 * three-day conference, the longest animation in the universe).
 */
const MAX_TIMELINE_DURATION_MS = 72 * 60 * 60 * 1000

type TimelineEntry = {
	node: TimelineChild
	offset: number
	// Whether the child was ever started. Only the first start captures
	// start values, so it must happen exactly when the playhead reaches the
	// child (lazy start: sequential same-property tweens then chain
	// correctly). Later re-starts never re-capture, so they may happen
	// eagerly, e.g. when scrubbing back before the child's offset.
	started: boolean
}

/**
 * Timeline composes Tweens (and nested Timelines) in sequence and in
 * parallel.
 *
 * Sequential by default: each `add()` call appends after the last child.
 * Parallel placement is achieved via explicit offsets:
 *
 * ```ts
 * const tl = new Timeline()
 * tl.add(tweenA)       // plays at 0ms
 * tl.add(tweenB, 0)    // plays in parallel at 0ms
 * tl.add(tweenC, 500)  // starts at 500ms
 * ```
 *
 * Labels allow named reference points:
 *
 * ```ts
 * tl.addLabel('drop', 1000)
 * tl.add(tweenD, 'drop')
 * ```
 */
export class Timeline {
	/**
	 * When true, calling {@link update} on a stopped timeline will
	 * implicitly call {@link start} first. Defaults to false.
	 */
	static autoStartOnUpdate = false

	private _id = Sequence.nextId()
	private _entries: Array<TimelineEntry> = []
	private _labels: Record<string, number> = {start: 0, end: 0}

	private _duration = 0
	private _startTime = 0
	private _isPlaying = false
	private _isPaused = false
	private _pauseStart = 0
	private _nextStartTime: number | undefined
	private _lastUpdateTime = -Infinity

	private _onStartCallback?: (timeline: Timeline) => void
	private _onStartCallbackFired = false
	private _onUpdateCallback?: (timeline: Timeline, elapsed: number) => void
	private _onCompleteCallback?: (timeline: Timeline) => void
	private _onStopCallback?: (timeline: Timeline) => void

	/**
	 * Creates a new empty Timeline. Use {@link add} to compose tweens
	 * and nested timelines.
	 */
	constructor() {
		// Empty on purpose. Use `.add()` to compose.
		// Sequential by default, parallel via explicit offsets, labels, or options.
	}

	/** Returns the unique integer ID of this timeline. */
	getId(): number {
		return this._id
	}

	/** Returns the callback registered via {@link onComplete}, if any. */
	getCompleteCallback(): ((timeline: Timeline) => void) | undefined {
		return this._onCompleteCallback
	}

	/** Returns true while the timeline is playing (including while paused). */
	isPlaying(): boolean {
		return this._isPlaying
	}

	/** Returns true if the timeline is currently paused. */
	isPaused(): boolean {
		return this._isPaused
	}

	/** Duration of the timeline (max child end). */
	getDuration(): number {
		return this._duration
	}

	/**
	 * Total duration of all children. Same as {@link getDuration} for
	 * timelines.
	 */
	getTotalDuration(): number {
		return this._duration
	}

	/** Returns all child tweens and nested timelines. */
	getAll(): Array<TimelineChild> {
		return this._entries.map(entry => entry.node)
	}

	/** Returns true if the given tween or timeline is a child of this timeline. */
	has(node: TimelineChild): boolean {
		return this._entries.some(entry => entry.node === node)
	}

	private _isAddOptions(position: TimelinePosition | undefined): position is TimelineAddOptions {
		if (typeof position !== 'object' || position === null || Array.isArray(position)) return false
		if (position instanceof Timeline) return false
		// Tween instances are objects too (and have `repeat`/`yoyo` methods),
		// so detect them by their playback interface first.
		const maybeTween = position as Tween<any>
		if (typeof maybeTween.isPlaying === 'function' && typeof maybeTween.getId === 'function') return false
		return true
	}

	private _resolveAt(at?: TimelineAt): {offset: number; insertIndex?: number} {
		if (at === undefined) return {offset: this._duration}
		if (typeof at === 'number') return {offset: at}
		if (typeof at === 'string') return {offset: this._labels[at] ?? this._duration}

		const insertIndex = this._entries.findIndex(entry => entry.node === at)
		if (insertIndex === -1) return {offset: this._duration}

		return {offset: this._entries[insertIndex].offset, insertIndex}
	}

	private _resolvePosition(position?: TimelinePosition): {offset: number; shift: boolean; insertIndex?: number} {
		if (this._isAddOptions(position)) {
			const offset = position.offset ?? 0
			if (position.atIndex !== undefined) {
				const insertIndex = Math.max(0, Math.min(position.atIndex, this._entries.length))
				const baseOffset = insertIndex < this._entries.length ? this._entries[insertIndex].offset : this._duration
				return {offset: baseOffset + offset, shift: position.shift === true, insertIndex}
			}

			const resolved = this._resolveAt(position.at)
			return {
				offset: resolved.offset + offset,
				shift: position.shift === true,
				insertIndex: resolved.insertIndex,
			}
		}

		const resolved = this._resolveAt(position)
		return {offset: resolved.offset, shift: false, insertIndex: resolved.insertIndex}
	}

	/**
	 * Adds a named label at a time offset. Labels can be used as position
	 * references in {@link add}. The built-in labels `"start"` and `"end"`
	 * cannot be modified.
	 *
	 * @param name - Label name (must not be `"start"` or `"end"`).
	 * @param offset - Time offset in milliseconds.
	 */
	addLabel(name: string, offset: number): this {
		if (name === 'start' || name === 'end') return this
		this._labels[name] = offset
		return this
	}

	/**
	 * Removes a named label. Built-in `"start"` and `"end"` labels cannot be
	 * removed.
	 *
	 * @param name - Label name to remove.
	 */
	removeLabel(name: string): this {
		if (name === 'start' || name === 'end') return this
		delete this._labels[name]
		return this
	}

	/**
	 * Returns the time offset for a named label, or `undefined` if the label
	 * does not exist.
	 *
	 * @param name - Label name to look up.
	 */
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
		this._labels['end'] = this._duration
	}

	/**
	 * Add a Tween or nested Timeline.
	 *
	 * Placement (second argument):
	 * - `add(tween)` appends after the last child (sequential).
	 * - `add(tween, 0)` starts at timeline start (parallel).
	 * - `add(tween, 500)` starts at 500ms.
	 * - `add(tween, 'myLabel')` aligns to a label (`start` and `end` builtin).
	 * - `add(tween, otherTween)` aligns to another child's start.
	 * - `add(tween, {at, atIndex, offset, shift, repeat, yoyo})` for full control.
	 *
	 * Options:
	 * - `at`: a time value, label, or child to align to (default: end).
	 * - `atIndex`: entry index to align to (takes precedence over `at`).
	 * - `offset`: added to the aligned base (default: 0).
	 * - `shift`: shift entries at/after the base later so nothing overlaps.
	 * - `repeat`: total plays; extra plays clone the child (default: 1).
	 * - `yoyo`: alternate plays with reversed clips (see `Tween.reverse()`).
	 *
	 * Adding the same tween more than once clones it (each clip needs
	 * independent playback state); the original object plays first.
	 * `add([a, b])` adds sequentially; `add([a, b], 0)` adds in parallel
	 * (`repeat`/`yoyo` apply per child).
	 *
	 * @param node - A tween, timeline, or array of tweens/timelines.
	 * @param position - Optional position specifier (see above).
	 */
	add(node: TimelineChild | Array<TimelineChild>, position?: TimelinePosition): this {
		if (Array.isArray(node)) {
			for (const child of node) this.add(child, position)
			return this
		}
		return this._addSingle(node, position)
	}

	private _shiftEntries(offset: number, amount: number): void {
		if (amount === 0) return
		for (const entry of this._entries) {
			if (entry.offset >= offset) entry.offset += amount
		}
	}

	private _addSingle(node: TimelineChild, position?: TimelinePosition): this {
		const repeat = this._isAddOptions(position) && position.repeat !== undefined ? position.repeat : 1
		if (!Number.isInteger(repeat) || repeat < 1) {
			throw new Error(`Timeline.add() repeat must be a positive integer, got ${repeat}.`)
		}
		const yoyo = this._isAddOptions(position) && position.yoyo === true

		const resolved = this._resolvePosition(position)

		// Expand to clips. The original object plays first (unless it is
		// already placed, in which case every clip is a clone: sharing one
		// Tween across entries would share its playback state and break).
		// Odd clips are reversed when yoyo. `{yoyo: true, repeat: 2}` plays
		// forward, backward, forward, backward.
		const totalClips = repeat * (yoyo ? 2 : 1)
		// Fail fast before materializing: a huge repeat must throw instead
		// of allocating millions of clones.
		const clipsTotal = totalClips * node.getTotalDuration()
		if (totalClips > 1 && !(clipsTotal <= MAX_TIMELINE_DURATION_MS)) {
			throw new Error(`Timeline.add() {repeat: ${repeat}${yoyo ? ', yoyo: true' : ''}} exceeds the 72 hour cap.`)
		}
		const clips: Array<TimelineChild> = []
		for (let i = 0; i < totalClips; i++) {
			if (i === 0 && !this.has(node)) {
				clips.push(node)
			} else if (yoyo && i % 2 === 1) {
				if (node instanceof Timeline) {
					throw new Error(
						'Timeline.add() yoyo is only supported for Tween children. Reverse nested timelines manually.',
					)
				}
				clips.push(node.reverse())
			} else {
				clips.push(node.clone())
			}
		}

		if (resolved.shift) {
			const total = clips.reduce((sum, clip) => sum + clip.getTotalDuration(), 0)
			this._shiftEntries(resolved.offset, total)
		}

		let cursor = resolved.offset
		const newEntries: Array<TimelineEntry> = clips.map(clip => {
			const entry: TimelineEntry = {node: clip, offset: cursor, started: false}
			cursor += clip.getTotalDuration()
			return entry
		})

		if (resolved.insertIndex !== undefined) {
			this._entries.splice(resolved.insertIndex, 0, ...newEntries)
		} else {
			this._entries.push(...newEntries)
		}

		// Children start lazily when the playhead reaches them (see update),
		// so start values are captured at the right moment.
		this._recalculateDuration()
		return this
	}

	/**
	 * Create an independent copy of this timeline: entries, custom labels,
	 * and callbacks are copied, and every child is cloned, so the copy plays
	 * identically but owns its playback state. Used by
	 * `add(child, {repeat})` expansion for nested timelines.
	 */
	clone(): Timeline {
		const cloned = new Timeline()
		for (const entry of this._entries) {
			const child = entry.node
			cloned._entries.push({
				node: child.clone(),
				offset: entry.offset,
				started: false,
			})
		}
		for (const name of Object.keys(this._labels)) {
			if (name !== 'start' && name !== 'end') cloned._labels[name] = this._labels[name]
		}
		cloned._onStartCallback = this._onStartCallback
		cloned._onUpdateCallback = this._onUpdateCallback
		cloned._onCompleteCallback = this._onCompleteCallback
		cloned._onStopCallback = this._onStopCallback
		cloned._recalculateDuration()
		return cloned
	}

	/**
	 * Removes one or more child tweens/timelines from this timeline.
	 *
	 * @param nodes - The children to remove.
	 */
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

	/** Removes all children from this timeline. */
	removeAll(): this {
		this._entries = []
		this._recalculateDuration()
		return this
	}

	/**
	 * Sets a callback invoked when the timeline first starts playing (fires
	 * exactly once per {@link start} call).
	 *
	 * @param callback - Called with the timeline instance.
	 */
	onStart(callback?: (timeline: Timeline) => void): this {
		this._onStartCallback = callback
		return this
	}

	/**
	 * Sets a callback invoked on every update tick while the timeline is
	 * playing.
	 *
	 * @param callback - Called with the timeline instance and the elapsed
	 * portion (0 to 1). For infinite timelines, `elapsed` is always 0.
	 */
	onUpdate(callback?: (timeline: Timeline, elapsed: number) => void): this {
		this._onUpdateCallback = callback
		return this
	}

	/**
	 * Sets a callback invoked when the timeline finishes playing (reaches
	 * its total duration).
	 *
	 * @param callback - Called with the timeline instance.
	 */
	onComplete(callback?: (timeline: Timeline) => void): this {
		this._onCompleteCallback = callback
		return this
	}

	/**
	 * Sets a callback invoked when the timeline is stopped via {@link stop}.
	 *
	 * @param callback - Called with the timeline instance.
	 */
	onStop(callback?: (timeline: Timeline) => void): this {
		this._onStopCallback = callback
		return this
	}

	/** Convenience: set easing for all child Tweens (recurses into nested Timelines). */
	easing(easingFunction: EasingFunction): this {
		for (const entry of this._entries) {
			const child = entry.node
			if (child instanceof Timeline) child.easing(easingFunction)
			else child.easing(easingFunction)
		}
		return this
	}

	/** Convenience: set interpolation for all child Tweens (recurses). */
	interpolation(interpolationFunction: InterpolationFunction): this {
		for (const entry of this._entries) {
			const child = entry.node
			if (child instanceof Timeline) child.interpolation(interpolationFunction)
			else child.interpolation(interpolationFunction)
		}
		return this
	}

	/**
	 * Starts the timeline at the given time. Children start lazily when the
	 * playhead reaches their offset, so start values are captured at the
	 * right moment even for sequential same-property tweens.
	 *
	 * If already playing, this is a no-op. Stops any currently playing
	 * children.
	 *
	 * @param time - The current time in milliseconds (usually from
	 * `performance.now()` or your own clock). Defaults to `now()`.
	 */
	start(time: number = now()): this {
		if (this._isPlaying) return this

		this._recalculateDuration()
		this._isPlaying = true
		this._isPaused = false
		this._onStartCallbackFired = false
		// Snap to the ideal cycle boundary when restarting a finished
		// timeline, so repeated timelines stay in sync with longer ones.
		// Only when the caller's time is at or past the boundary;
		// a time before the boundary means a deliberate scrub-back.
		this._startTime = this._nextStartTime !== undefined && time >= this._nextStartTime ? this._nextStartTime : time
		this._nextStartTime = undefined
		this._lastUpdateTime = -Infinity

		for (const entry of this._entries) {
			if (entry.node.isPlaying()) entry.node.stop()
		}

		return this
	}

	/**
	 * Stops the timeline and all playing children. Fires the
	 * {@link onStop} callback if set.
	 */
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

	/**
	 * Pauses the timeline at the given time. The timeline continues to
	 * report `isPlaying() === true` while paused.
	 *
	 * @param time - The current time in milliseconds. Defaults to `now()`.
	 */
	pause(time: number = now()): this {
		if (this._isPaused || !this._isPlaying) return this
		this._isPaused = true
		this._pauseStart = time
		return this
	}

	/**
	 * Resumes the timeline from a paused state. The timeline's clock is
	 * adjusted so children continue from the pause point.
	 *
	 * @param time - The current time in milliseconds. Defaults to `now()`.
	 */
	resume(time: number = now()): this {
		if (!this._isPaused || !this._isPlaying) return this
		this._isPaused = false
		this._startTime += time - this._pauseStart
		this._pauseStart = 0
		return this
	}

	/**
	 * @returns true if still playing after update, false otherwise.
	 * Children use a local clock (0 = timeline start).
	 *
	 * @param time - The current time in milliseconds. Defaults to `now()`.
	 * @param autoStart - When true and the timeline is stopped, implicitly
	 * call {@link start} first. Defaults to
	 * {@link Timeline.autoStartOnUpdate}.
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

		const timelineLocal = time - this._startTime

		const effectiveLocal = Math.min(timelineLocal, this._duration)

		// Detect scrub-back vs forward play: only eagerly restart/clamp
		// late-offset children when the playhead moved backward. On
		// forward playback (including auto-restart), children start
		// lazily so same-property tweens chain correctly.
		const scrubbingBack = time < this._lastUpdateTime
		this._lastUpdateTime = time

		for (const entry of this._entries) {
			const child = entry.node
			if (!entry.started) {
				// First start must wait until due; a never-started child
				// left behind stays untouched.
				if (effectiveLocal < entry.offset) continue
				child.start(entry.offset)
				entry.started = true
			} else if (!child.isPlaying() && effectiveLocal < entry.offset + child.getTotalDuration()) {
				// On scrub-back, eagerly re-enter children past the playhead
				// so they snap to their start values. On forward playback
				// only re-enter when the playhead has reached the child.
				if (scrubbingBack || effectiveLocal >= entry.offset) {
					child.start(entry.offset)
				}
			}
			// On scrub-back, clamp late children to their offset so they
			// output start values. On forward playback let the child
			// start lazily (no output until playhead reaches offset).
			if (scrubbingBack && effectiveLocal < entry.offset) {
				child.update(entry.offset)
			} else if (!scrubbingBack && effectiveLocal < entry.offset && !child.isPlaying()) {
				// Forward play: child hasn't been reached yet, skip.
			} else {
				child.update(effectiveLocal)
			}
		}

		if (!isFinite(this._duration)) {
			if (this._onUpdateCallback) this._onUpdateCallback(this, 0)
			return true
		}

		const elapsed = this._duration === 0 ? 1 : effectiveLocal / this._duration
		if (this._onUpdateCallback) this._onUpdateCallback(this, elapsed)

		if (this._duration === 0 || time >= this._startTime + this._duration) {
			if (this._onCompleteCallback) this._onCompleteCallback(this)
			// Store the ideal next-cycle boundary so start() snaps to it
			// instead of the overshooting wall-clock time. This keeps
			// repeated timelines precisely aligned with longer ones.
			this._nextStartTime = this._startTime + this._duration
			this._isPlaying = false
			return false
		}

		return true
	}
}

export default Timeline
