/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

import type {EasingFunction} from './Easing'
import type {InterpolationFunction} from './Interpolation'
import type Group from './Group'
import TWEEN from './Index'

export class Tween<T extends UnknownProps> {
	private _isPaused = false
	private _pauseStart = 0
	private _valuesStart: UnknownProps = {}
	private _valuesEnd: UnknownProps = {}
	private _valuesStartRepeat: UnknownProps = {}
	private _duration = 1000
	private _initialRepeat = 0
	private _repeat = 0
	private _repeatDelayTime?: number
	private _yoyo = false
	private _isPlaying = false
	private _reversed = false
	private _delayTime = 0
	private _startTime = 0
	private _easingFunction: EasingFunction = TWEEN.Easing.Linear.None
	private _interpolationFunction: InterpolationFunction = TWEEN.Interpolation.Linear
	private _chainedTweens: Array<Tween<UnknownProps>> = []
	private _onStartCallback?: (object: T) => void
	private _onStartCallbackFired = false
	private _onUpdateCallback?: (object: T, elapsed: number) => void
	private _onRepeatCallback?: (object: T) => void
	private _onCompleteCallback?: (object: T) => void
	private _onStopCallback?: (object: T) => void
	private _id = TWEEN.nextId()
	private _isChainStopped = false

	constructor(private _object: T, private _group: Group = TWEEN) {}

	getId(): number {
		return this._id
	}

	isPlaying(): boolean {
		return this._isPlaying
	}

	isPaused(): boolean {
		return this._isPaused
	}

	to(properties: UnknownProps, duration?: number): this {
		for (const prop in properties) {
			this._valuesEnd[prop] = properties[prop]
		}

		if (duration !== undefined) {
			this._duration = duration
		}

		return this
	}

	duration(d: number): this {
		this._duration = d
		return this
	}

	start(time: number): this {
		if (this._isPlaying) {
			return this
		}

		// eslint-disable-next-line
		// @ts-ignore FIXME?
		this._group.add(this)

		this._repeat = this._initialRepeat

		if (this._reversed) {
			// If we were reversed (f.e. using the yoyo feature) then we need to
			// flip the tween direction back to forward.

			this._reversed = false

			for (const property in this._valuesStartRepeat) {
				this._swapEndStartRepeatValues(property)
				this._valuesStart[property] = this._valuesStartRepeat[property]
			}
		}

		this._isPlaying = true

		this._isPaused = false

		this._onStartCallbackFired = false

		this._isChainStopped = false

		this._startTime =
			time !== undefined ? (typeof time === 'string' ? TWEEN.now() + parseFloat(time) : time) : TWEEN.now()
		this._startTime += this._delayTime

		this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat)

		return this
	}

	private _setupProperties(
		_object: UnknownProps,
		_valuesStart: UnknownProps,
		_valuesEnd: UnknownProps,
		_valuesStartRepeat: UnknownProps,
	): void {
		for (const property in _valuesEnd) {
			const startValue = _object[property]
			const startValueIsArray = Array.isArray(startValue)
			const propType = startValueIsArray ? 'array' : typeof startValue
			const isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property])

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (propType === 'undefined' || propType === 'function') {
				continue
			}

			// Check if an Array was provided as property value
			if (isInterpolationList) {
				let endValues = _valuesEnd[property] as Array<number | string>

				if (endValues.length === 0) {
					continue
				}

				// handle an array of relative values
				endValues = endValues.map(this._handleRelativeValue.bind(this, startValue as number))

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [startValue].concat(endValues)
			}

			// handle the deepness of the values
			if ((propType === 'object' || startValueIsArray) && startValue && !isInterpolationList) {
				_valuesStart[property] = startValueIsArray ? [] : {}

				// eslint-disable-next-line
				for (const prop in startValue as object) {
					// eslint-disable-next-line
					// @ts-ignore FIXME?
					_valuesStart[property][prop] = startValue[prop]
				}

				_valuesStartRepeat[property] = startValueIsArray ? [] : {} // TODO? repeat nested values? And yoyo? And array values?

				// eslint-disable-next-line
				// @ts-ignore FIXME?
				this._setupProperties(startValue, _valuesStart[property], _valuesEnd[property], _valuesStartRepeat[property])
			} else {
				// Save the starting value, but only once.
				if (typeof _valuesStart[property] === 'undefined') {
					_valuesStart[property] = startValue
				}

				if (!startValueIsArray) {
					// eslint-disable-next-line
					// @ts-ignore FIXME?
					_valuesStart[property] *= 1.0 // Ensures we're using numbers, not strings
				}

				if (isInterpolationList) {
					// eslint-disable-next-line
					// @ts-ignore FIXME?
					_valuesStartRepeat[property] = _valuesEnd[property].slice().reverse()
				} else {
					_valuesStartRepeat[property] = _valuesStart[property] || 0
				}
			}
		}
	}

	stop(): this {
		if (!this._isChainStopped) {
			this._isChainStopped = true
			this.stopChainedTweens()
		}

		if (!this._isPlaying) {
			return this
		}

		// eslint-disable-next-line
		// @ts-ignore FIXME?
		this._group.remove(this)

		this._isPlaying = false

		this._isPaused = false

		if (this._onStopCallback) {
			this._onStopCallback(this._object)
		}

		return this
	}

	end(): this {
		this.update(Infinity)
		return this
	}

	pause(time: number): this {
		if (this._isPaused || !this._isPlaying) {
			return this
		}

		this._isPaused = true

		this._pauseStart = time === undefined ? TWEEN.now() : time

		// eslint-disable-next-line
		// @ts-ignore FIXME?
		this._group.remove(this)

		return this
	}

	resume(time: number): this {
		if (!this._isPaused || !this._isPlaying) {
			return this
		}

		this._isPaused = false

		this._startTime += (time === undefined ? TWEEN.now() : time) - this._pauseStart

		this._pauseStart = 0

		// eslint-disable-next-line
		// @ts-ignore FIXME?
		this._group.add(this)

		return this
	}

	stopChainedTweens(): this {
		for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].stop()
		}
		return this
	}

	group(group: Group): this {
		this._group = group
		return this
	}

	delay(amount: number): this {
		this._delayTime = amount
		return this
	}

	repeat(times: number): this {
		this._initialRepeat = times
		this._repeat = times
		return this
	}

	repeatDelay(amount: number): this {
		this._repeatDelayTime = amount
		return this
	}

	yoyo(yoyo: boolean): this {
		this._yoyo = yoyo
		return this
	}

	easing(easingFunction: EasingFunction): this {
		this._easingFunction = easingFunction
		return this
	}

	interpolation(interpolationFunction: InterpolationFunction): this {
		this._interpolationFunction = interpolationFunction
		return this
	}

	chain(...tweens: Array<Tween<UnknownProps>>): this {
		this._chainedTweens = tweens
		return this
	}

	onStart(callback: (object: T) => void): this {
		this._onStartCallback = callback
		return this
	}

	onUpdate(callback: (object: T, elapsed: number) => void): this {
		this._onUpdateCallback = callback
		return this
	}

	onRepeat(callback: (object: T) => void): this {
		this._onRepeatCallback = callback
		return this
	}

	onComplete(callback: (object: T) => void): this {
		this._onCompleteCallback = callback
		return this
	}

	onStop(callback: (object: T) => void): this {
		this._onStopCallback = callback
		return this
	}

	update(time: number): boolean {
		let property
		let elapsed
		const endTime = this._startTime + this._duration

		if (time > endTime && !this._isPlaying) {
			return false
		}

		// If the tween was already finished,
		if (!this.isPlaying) {
			this.start(time)
		}

		if (time < this._startTime) {
			return true
		}

		if (this._onStartCallbackFired === false) {
			if (this._onStartCallback) {
				this._onStartCallback(this._object)
			}

			this._onStartCallbackFired = true
		}

		elapsed = (time - this._startTime) / this._duration
		elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed

		const value = this._easingFunction(elapsed)

		// properties transformations
		this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value)

		if (this._onUpdateCallback) {
			this._onUpdateCallback(this._object, elapsed)
		}

		if (elapsed === 1) {
			if (this._repeat > 0) {
				if (isFinite(this._repeat)) {
					this._repeat--
				}

				// Reassign starting values, restart by making startTime = now
				for (property in this._valuesStartRepeat) {
					if (!this._yoyo && typeof this._valuesEnd[property] === 'string') {
						this._valuesStartRepeat[property] =
							// eslint-disable-next-line
							// @ts-ignore FIXME?
							this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property])
					}

					if (this._yoyo) {
						this._swapEndStartRepeatValues(property)
					}

					this._valuesStart[property] = this._valuesStartRepeat[property]
				}

				if (this._yoyo) {
					this._reversed = !this._reversed
				}

				if (this._repeatDelayTime !== undefined) {
					this._startTime = time + this._repeatDelayTime
				} else {
					this._startTime = time + this._delayTime
				}

				if (this._onRepeatCallback) {
					this._onRepeatCallback(this._object)
				}

				return true
			} else {
				if (this._onCompleteCallback) {
					this._onCompleteCallback(this._object)
				}

				for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					this._chainedTweens[i].start(this._startTime + this._duration)
				}

				this._isPlaying = false

				return false
			}
		}

		return true
	}

	private _updateProperties(
		_object: UnknownProps,
		_valuesStart: UnknownProps,
		_valuesEnd: UnknownProps,
		value: number,
	): void {
		for (const property in _valuesEnd) {
			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue
			}

			const start = _valuesStart[property] || 0
			let end = _valuesEnd[property]
			const startIsArray = Array.isArray(_object[property])
			const endIsArray = Array.isArray(end)
			const isInterpolationList = !startIsArray && endIsArray

			if (isInterpolationList) {
				_object[property] = this._interpolationFunction(end as Array<number>, value)
			} else if (typeof end === 'object' && end) {
				// eslint-disable-next-line
				// @ts-ignore FIXME?
				this._updateProperties(_object[property], start, end, value)
			} else {
				// Parses relative end values with start as base (e.g.: +10, -3)
				end = this._handleRelativeValue(start as number, end as number | string)

				// Protect against non numeric properties.
				if (typeof end === 'number') {
					// eslint-disable-next-line
					// @ts-ignore FIXME?
					_object[property] = start + (end - start) * value
				}
			}
		}
	}

	private _handleRelativeValue(start: number, end: number | string): number {
		if (typeof end !== 'string') {
			return end
		}

		if (end.charAt(0) === '+' || end.charAt(0) === '-') {
			return start + parseFloat(end)
		} else {
			return parseFloat(end)
		}
	}

	private _swapEndStartRepeatValues(property: string): void {
		const tmp = this._valuesStartRepeat[property]

		if (typeof this._valuesEnd[property] === 'string') {
			// eslint-disable-next-line
			// @ts-ignore FIXME?
			this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property])
		} else {
			this._valuesStartRepeat[property] = this._valuesEnd[property]
		}

		this._valuesEnd[property] = tmp
	}
}

export type UnknownProps = Record<string, unknown>

export default Tween
