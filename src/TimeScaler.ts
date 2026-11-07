/**
 * @file Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * TimeScaler: a decoupled clock that scales time.
 *
 * Tween stays a scalar progress animator with no time-scaling logic of its
 * own (see #655). To run tweens in slow motion, fast-forward, or frozen,
 * feed them scaled times instead of raw times:
 *
 * ```ts
 * const scaler = new TimeScaler(1)
 * const tween = new Tween(obj).to({x: 100}, 1000)
 * tween.start(scaler.update(performance.now()))
 *
 * function animate(time) {
 * 	requestAnimationFrame(animate)
 * 	tween.update(scaler.update(time))
 * }
 *
 * // Later: slow motion, freeze, resume — no Tween changes needed.
 * scaler.setScale(0.5)
 * scaler.setScale(0)
 * scaler.setScale(2)
 * ```
 *
 * Works with `Tween`, `Group`, and `Timeline`: anything that takes a time
 * value can take `scaler.update(rawTime)`.
 */

import now from './Now'

/**
 * Scales a monotonic source clock (for example `requestAnimationFrame`
 * timestamps) into a scaled clock for driving tweens.
 *
 * With scale `1` this is the identity (`update(t) === t`), so wrapping an
 * existing loop is a drop-in change. Other scales advance the scaled clock
 * by `(raw - lastRaw) * scale` per update: `0` freezes it, values between
 * `0` and `1` slow it down, values above `1` speed it up, and negative
 * values run it backwards.
 */
export class TimeScaler {
	private _scale = 1
	private _lastRawTime: number | undefined = undefined
	private _scaledTime = 0

	/**
	 * Creates a scaler with the given initial scale. Defaults to `1`
	 * (unscaled).
	 *
	 * @param scale - Initial scale factor. Defaults to `1`.
	 */
	constructor(scale = 1) {
		this._scale = scale
	}

	/**
	 * Sets the scale factor applied to source-clock deltas from now on.
	 * Past output is not rewritten; the next `update()` advances from the
	 * last scaled time using the new scale.
	 *
	 * @param scale - New scale factor (`0` freezes, negative runs backwards).
	 */
	setScale(scale: number): this {
		this._scale = scale
		return this
	}

	/** Returns the current scale factor. */
	getScale(): number {
		return this._scale
	}

	/**
	 * Returns the last scaled time (the value the previous `update()`
	 * returned, or `0` before the first update).
	 */
	getTime(): number {
		return this._scaledTime
	}

	/**
	 * Forgets the last source time, so the next `update()` re-anchors to
	 * its input instead of advancing from the previous one. Restarting a
	 * tween from scratch after a seek is the typical use.
	 */
	reset(): this {
		this._lastRawTime = undefined
		return this
	}

	/**
	 * Maps a source-clock reading to the scaled clock. Call once per frame
	 * with the same value you would otherwise pass to `Tween.update()`,
	 * `Group.update()`, or `Timeline.update()`, and pass the result on.
	 *
	 * The first call anchors both clocks and returns its input unchanged;
	 * later calls add `(rawTime - lastRawTime) * scale`.
	 *
	 * @param rawTime - Source time in milliseconds (usually from
	 * `performance.now()` or your own clock). Defaults to `now()`.
	 */
	update(rawTime: number = now()): number {
		if (this._lastRawTime === undefined) {
			this._lastRawTime = rawTime
			this._scaledTime = rawTime
			return this._scaledTime
		}
		this._scaledTime += (rawTime - this._lastRawTime) * this._scale
		this._lastRawTime = rawTime
		return this._scaledTime
	}
}

export default TimeScaler
