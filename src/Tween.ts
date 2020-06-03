/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

import NOW from './Now'
import Easing, {EasingFunction} from './Easing'
import Interpolation, {InterpolationFunction} from './Interpolation'
import Group, {TweenBase} from './Group'
import Sequence from './Sequence'

type AnyProps = {
	[key: string]: any
}

/**
 * A tween (from in-between) is a concept that allows you to change the values of the properties of an object in a
 * smooth way. You just tell it which properties you want to change, which final values should they have when the
 * tween finishes running, and how long should this take, and the tweening engine will take care of finding the
 * intermediate values from the starting to the ending point.
 */
export default class Tween implements TweenBase {
	static TWEEN: Group

	static inject(instance: Group) {
		Tween.TWEEN = instance
	}

	public playing = false

	private id: number

	private object: any

	private groupRef: Group

	private paused = false

	private pauseStart = 0

	private valuesStart: AnyProps = {}

	private valuesEnd: AnyProps = {}

	private valuesStartRepeat: AnyProps = {}

	private durationValue = 1000

	private repeatValue = 0

	private repeatDelayTime: number

	private yoyoValue = false

	private reversed = false

	private delayTime = 0

	private startTime = 0

	private easingFunction: EasingFunction = Easing.Linear.None

	private interpolationFunction: InterpolationFunction = Interpolation.Linear

	private chainedTweens: Tween[] = []

	private onStartCallbackFired = false

	private onStartCallback: (object: any) => void

	private onUpdateCallback: (object: any, elapsed: number) => void

	private onRepeatCallback: (object: any) => void

	private onCompleteCallback: (object: any) => void

	private onStopCallback: (object: any) => void

	constructor(object: any, groupRef?: Group) {
		this.id = Sequence.nextId()
		this.object = object
		this.groupRef = groupRef || Tween.TWEEN
	}

	getId() {
		return this.id
	}

	isPlaying() {
		return this.playing
	}

	isPaused() {
		return this.paused
	}

	to(properties: {}, duration?: number) {
		this.valuesEnd = Object.create(properties)

		if (duration !== undefined) {
			this.durationValue = duration
		}

		return this
	}

	duration(value: number) {
		this.durationValue = value
		return this
	}

	start(time?: number | string) {
		this.groupRef.add(this)

		this.playing = true

		this.paused = false

		this.onStartCallbackFired = false

		this.startTime = time !== undefined ? (typeof time === 'string' ? NOW() + parseFloat(time) : time) : NOW()
		this.startTime += this.delayTime

		for (const property in this.valuesEnd) {
			// Check if an Array was provided as property value
			if (this.valuesEnd[property] instanceof Array) {
				if (this.valuesEnd[property].length === 0) {
					continue
				}

				// Create a local copy of the Array with the start value at the front
				this.valuesEnd[property] = [this.object[property]].concat(this.valuesEnd[property])
			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (this.object[property] === undefined) {
				continue
			}

			// Save the starting value, but only once.
			if (typeof this.valuesStart[property] === 'undefined') {
				this.valuesStart[property] = this.object[property]
			}

			if (this.valuesStart[property] instanceof Array === false) {
				this.valuesStart[property] *= 1.0 // Ensures we're using numbers, not strings
			}

			this.valuesStartRepeat[property] = this.valuesStart[property] || 0
		}

		return this
	}

	stop() {
		if (!this.playing) {
			return this
		}

		this.groupRef.remove(this)

		this.playing = false

		this.paused = false

		if (this.onStopCallback) {
			this.onStopCallback(this.object)
		}

		this.stopChainedTweens()
		return this
	}

	end() {
		this.update(Infinity)
		return this
	}

	pause(time: number) {
		if (this.paused || !this.playing) {
			return this
		}

		this.paused = true

		this.pauseStart = time === undefined ? NOW() : time

		this.groupRef.remove(this)

		return this
	}

	resume(time: number) {
		if (!this.paused || !this.playing) {
			return this
		}

		this.paused = false

		this.startTime += (time === undefined ? NOW() : time) - this.pauseStart

		this.pauseStart = 0

		this.groupRef.add(this)

		return this
	}

	stopChainedTweens() {
		for (let i = 0, numChainedTweens = this.chainedTweens.length; i < numChainedTweens; i++) {
			this.chainedTweens[i].stop()
		}
	}

	group(group: Group) {
		this.groupRef = group
		return this
	}

	delay(amount: number) {
		this.delayTime = amount
		return this
	}

	repeat(times: number) {
		this.repeatValue = times
		return this
	}

	repeatDelay(amount: number) {
		this.repeatDelayTime = amount
		return this
	}

	yoyo(yoyo: boolean) {
		this.yoyoValue = yoyo
		return this
	}

	easing(easing: EasingFunction) {
		this.easingFunction = easing
		return this
	}

	interpolation(interpolation: InterpolationFunction) {
		this.interpolationFunction = interpolation
		return this
	}

	chain(...tweens: Tween[]) {
		this.chainedTweens = tweens
		return this
	}

	onStart(callback: (object: any) => void) {
		this.onStartCallback = callback
		return this
	}

	onUpdate(callback: (object: any, elapsed: number) => void) {
		this.onUpdateCallback = callback
		return this
	}

	onRepeat(callback: (object: any) => void) {
		this.onRepeatCallback = callback
		return this
	}

	onComplete(callback: (object: any) => void) {
		this.onCompleteCallback = callback
		return this
	}

	onStop(callback: (object: any) => void) {
		this.onStopCallback = callback
		return this
	}

	/**
	 * Tween.js doesn't run by itself. You need to tell it when to run, by explicitly calling the update method.
	 * The recommended method is to do this inside your main animation loop, which should be called with
	 * requestAnimationFrame for getting the best graphics performance
	 *
	 * If called without parameters, update will determine the current time in order to find out how long has it been
	 * since the last time it ran.
	 *
	 * @param time
	 */
	update(time = 0) {
		let property
		let elapsed

		if (time < this.startTime) {
			return true
		}

		if (this.onStartCallbackFired === false) {
			if (this.onStartCallback) {
				this.onStartCallback(this.object)
			}

			this.onStartCallbackFired = true
		}

		elapsed = (time - this.startTime) / this.durationValue
		elapsed = this.durationValue === 0 || elapsed > 1 ? 1 : elapsed

		const value = this.easingFunction(elapsed)

		for (property in this.valuesEnd) {
			// Don't update properties that do not exist in the source object
			if (this.valuesStart[property] === undefined) {
				continue
			}

			const start = this.valuesStart[property] || 0
			let end = this.valuesEnd[property]

			if (end instanceof Array) {
				this.object[property] = this.interpolationFunction(end, value)
			} else {
				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof end === 'string') {
					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end)
					} else {
						end = parseFloat(end)
					}
				}

				// Protect against non numeric properties.
				if (typeof end === 'number') {
					this.object[property] = start + (end - start) * value
				}
			}
		}

		if (this.onUpdateCallback) {
			this.onUpdateCallback(this.object, elapsed)
		}

		if (elapsed === 1) {
			if (this.repeatValue > 0) {
				if (isFinite(this.repeatValue)) {
					this.repeatValue--
				}

				// Reassign starting values, restart by making startTime = now
				for (property in this.valuesStartRepeat) {
					if (typeof this.valuesEnd[property] === 'string') {
						this.valuesStartRepeat[property] = this.valuesStartRepeat[property] + parseFloat(this.valuesEnd[property])
					}

					if (this.yoyoValue) {
						const tmp = this.valuesStartRepeat[property]

						this.valuesStartRepeat[property] = this.valuesEnd[property]
						this.valuesEnd[property] = tmp
					}

					this.valuesStart[property] = this.valuesStartRepeat[property]
				}

				if (this.yoyoValue) {
					this.reversed = !this.reversed
				}

				if (this.repeatDelayTime !== undefined) {
					this.startTime = time + this.repeatDelayTime
				} else {
					this.startTime = time + this.delayTime
				}

				if (this.onRepeatCallback) {
					this.onRepeatCallback(this.object)
				}

				return true
			} else {
				if (this.onCompleteCallback) {
					this.onCompleteCallback(this.object)
				}

				for (let i = 0, numChainedTweens = this.chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					this.chainedTweens[i].start(this.startTime + this.durationValue)
				}

				return false
			}
		}

		return true
	}
}
