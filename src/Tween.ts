/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

import Easing from './Easing'
import Interpolation from './Interpolation'
import {mainGroup} from './mainGroup'
import Sequence from './Sequence'
import now from './Now'

import type {EasingFunction} from './Easing'
import type {InterpolationFunction} from './Interpolation'
import type Group from './Group'

export class Tween<T extends UnknownProps> {
	private _isPaused = false
	private _pauseStart = 0
	private _valuesStart: UnknownProps = {}
	private _valuesEnd: Record<string, number | string> = {}
	private _valuesStartRepeat: UnknownProps = {}
	private _duration = 1000
	private _isDynamic = false
	private _initialRepeat = 0
	private _repeat = 0
	private _repeatDelayTime?: number
	private _yoyo = false
	private _isPlaying = false
	private _reversed = false
	private _delayTime = 0
	private _startTime = 0
	private _easingFunction: EasingFunction = Easing.Linear.None
	private _interpolationFunction: InterpolationFunction = Interpolation.Linear
	// eslint-disable-next-line
	private _chainedTweens: Array<Tween<any>> = []
	private _onStartCallback?: (object: T) => void
	private _onStartCallbackFired = false
	private _onEveryStartCallback?: (object: T) => void
	private _onEveryStartCallbackFired = false
	private _onUpdateCallback?: (object: T, elapsed: number) => void
	private _onRepeatCallback?: (object: T) => void
	private _onCompleteCallback?: (object: T) => void
	private _onStopCallback?: (object: T) => void
	private _id = Sequence.nextId()
	private _isChainStopped = false
	private _propertiesAreSetUp = false

	constructor(private _object: T, private _group: Group | false = mainGroup) {}

	getId(): number {
		return this._id
	}

	isPlaying(): boolean {
		return this._isPlaying
	}

	isPaused(): boolean {
		return this._isPaused
	}

	to(target: UnknownProps, duration = 1000): this {
		if (this._isPlaying)
			throw new Error('Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.')

		this._valuesEnd = target
		this._propertiesAreSetUp = false
		this._duration = duration

		return this
	}

	duration(duration = 1000): this {
		this._duration = duration
		return this
	}

	dynamic(dynamic = false): this {
		this._isDynamic = dynamic
		return this
	}

	start(time: number = now(), overrideStartingValues = false): this {
		if (this._isPlaying) {
			return this
		}

		// eslint-disable-next-line
		this._group && this._group.add(this as any)

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
		this._onEveryStartCallbackFired = false

		this._isChainStopped = false

		this._startTime = time
		this._startTime += this._delayTime

		if (!this._propertiesAreSetUp || overrideStartingValues) {
			this._propertiesAreSetUp = true

			// If dynamic is not enabled, clone the end values instead of using the passed-in end values.
			if (!this._isDynamic) {
				const tmp: Record<PropertyKey, string | number> = {}
				for (const prop in this._valuesEnd) tmp[prop] = this._valuesEnd[prop]
				this._valuesEnd = tmp
			}

			this._setupProperties(
				this._object,
				this._valuesStart,
				this._valuesEnd,
				this._valuesStartRepeat,
				overrideStartingValues,
			)
		}

		return this
	}

	startFromCurrentValues(time?: number): this {
		return this.start(time, true)
	}

	private _setupProperties(
		_object: UnknownProps,
		_valuesStart: UnknownProps,
		_valuesEnd: UnknownProps,
		_valuesStartRepeat: UnknownProps,
		overrideStartingValues: boolean,
	): void {
		for (const property in _valuesEnd) {
			const startValue = _object[property] as number | Record<string, unknown>
			const startValueIsArray = Array.isArray(startValue)
			const propType = startValueIsArray ? 'array' : typeof startValue
			let isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property])

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (propType === 'undefined' || propType === 'function') {
				continue
			}

			// Check if an Array was provided as property value
			if (isInterpolationList) {
				const endValues = _valuesEnd[property] as Array<number | string>

				if (endValues.length === 0) {
					continue
				}

				// Handle an array of relative values.
				// Creates a local copy of the Array with the start value at the front
				const temp = [startValue as number]
				for (let i = 0, l = endValues.length; i < l; i += 1) {
					const value = this._handleRelativeValue(startValue as number, endValues[i])
					if (isNaN(value)) {
						isInterpolationList = false
						console.warn('Found invalid interpolation list. Skipping.')
						break
					}
					temp.push(value)
				}

				if (isInterpolationList) {
					// if (_valuesStart[property] === undefined) { // handle end values only the first time. NOT NEEDED? setupProperties is now guarded by _propertiesAreSetUp.
					_valuesEnd[property] = temp
					// }
				}
			}

			// handle the deepness of the values
			if ((propType === 'object' || startValueIsArray) && startValue && !isInterpolationList) {
				_valuesStart[property] = startValueIsArray ? [] : {}
				const nestedObject = startValue as Record<string, unknown>

				for (const prop in nestedObject) {
					_valuesStart[property][prop] = nestedObject[prop]
				}

				// TODO? repeat nested values? And yoyo? And array values?
				_valuesStartRepeat[property] = startValueIsArray ? [] : {}

				let endValues = _valuesEnd[property]

				// If dynamic is not enabled, clone the end values instead of using the passed-in end values.
				if (!this._isDynamic) {
					const tmp: Record<PropertyKey, unknown> = {}
					for (const prop in endValues) tmp[prop] = endValues[prop]
					_valuesEnd[property] = endValues = tmp
				}

				this._setupProperties(
					nestedObject,
					_valuesStart[property],
					endValues,
					_valuesStartRepeat[property],
					overrideStartingValues,
				)
			} else {
				// Save the starting value, but only once unless override is requested.
				if (typeof _valuesStart[property] === 'undefined' || overrideStartingValues) {
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
		this._group && this._group.remove(this as any)

		this._isPlaying = false

		this._isPaused = false

		if (this._onStopCallback) {
			this._onStopCallback(this._object)
		}

		return this
	}

	end(): this {
		this._goToEnd = true
		this.update(Infinity)
		return this
	}

	pause(time: number = now()): this {
		if (this._isPaused || !this._isPlaying) {
			return this
		}

		this._isPaused = true

		this._pauseStart = time

		// eslint-disable-next-line
		this._group && this._group.remove(this as any)

		return this
	}

	resume(time: number = now()): this {
		if (!this._isPaused || !this._isPlaying) {
			return this
		}

		this._isPaused = false

		this._startTime += time - this._pauseStart

		this._pauseStart = 0

		// eslint-disable-next-line
		this._group && this._group.add(this as any)

		return this
	}

	stopChainedTweens(): this {
		for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].stop()
		}
		return this
	}

	group(group = mainGroup): this {
		this._group = group
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

	easing(easingFunction: EasingFunction = Easing.Linear.None): this {
		this._easingFunction = easingFunction
		return this
	}

	interpolation(interpolationFunction: InterpolationFunction = Interpolation.Linear): this {
		this._interpolationFunction = interpolationFunction
		return this
	}

	// eslint-disable-next-line
	chain(...tweens: Array<Tween<any>>): this {
		this._chainedTweens = tweens
		return this
	}

	onStart(callback?: (object: T) => void): this {
		this._onStartCallback = callback
		return this
	}

	onEveryStart(callback?: (object: T) => void): this {
		this._onEveryStartCallback = callback
		return this
	}

	onUpdate(callback?: (object: T, elapsed: number) => void): this {
		this._onUpdateCallback = callback
		return this
	}

	onRepeat(callback?: (object: T) => void): this {
		this._onRepeatCallback = callback
		return this
	}

	onComplete(callback?: (object: T) => void): this {
		this._onCompleteCallback = callback
		return this
	}

	onStop(callback?: (object: T) => void): this {
		this._onStopCallback = callback
		return this
	}

	private _goToEnd = false

	/**
	 * @returns true if the tween is still playing after the update, false
	 * otherwise (calling update on a paused tween still returns true because
	 * it is still playing, just paused).
	 */
	update(time = now(), autoStart = true): boolean {
		if (this._isPaused) return true

		let property
		let elapsed

		const endTime = this._startTime + this._duration

		if (!this._goToEnd && !this._isPlaying) {
			if (time > endTime) return false
			if (autoStart) this.start(time, true)
		}

		this._goToEnd = false

		if (time < this._startTime) {
			return true
		}

		if (this._onStartCallbackFired === false) {
			if (this._onStartCallback) {
				this._onStartCallback(this._object)
			}

			this._onStartCallbackFired = true
		}

		if (this._onEveryStartCallbackFired === false) {
			if (this._onEveryStartCallback) {
				this._onEveryStartCallback(this._object)
			}

			this._onEveryStartCallbackFired = true
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

				this._onEveryStartCallbackFired = false

				return true
			} else {
				if (this._onCompleteCallback) {
					this._onCompleteCallback(this._object)
				}

				for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					this._chainedTweens[i].start(this._startTime + this._duration, false)
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
		}

		return parseFloat(end)
	}

	private _swapEndStartRepeatValues(property: string): void {
		const tmp = this._valuesStartRepeat[property]
		const endValue = this._valuesEnd[property]

		if (typeof endValue === 'string') {
			this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(endValue)
		} else {
			this._valuesStartRepeat[property] = this._valuesEnd[property]
		}

		this._valuesEnd[property] = tmp
	}
}

export type UnknownProps = Record<string, any>

export default Tween
