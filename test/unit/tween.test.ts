import {afterEach, describe, expect, test} from 'bun:test'
import type {EasingFunctionGroup} from '../../src/Easing'
import * as TWEEN from '../../src/Index'
import {patchPerformanceNow, restorePerformanceNow, tickTime} from './performance-now-fake'

// The suite shares the global `mainGroup`, and the tests run in source order.
// This only guards against a patched clock leaking out of a failing test.
afterEach(() => {
	restorePerformanceNow()
})

// Circular.InOut(0), Back.In(0) and Back.InOut(0) evaluate to -0. nodeunit's
// `equal` used `==`, which treats -0 and 0 as equal; `toBe` uses Object.is,
// which does not. Normalize the sign of zero to keep the original meaning.
const unsignZero = (n: number): number => n + 0

describe('TWEEN global group', () => {
	test('hello', () => {
		expect(TWEEN).not.toBeNull()
	})

	test('TWEEN.getAll', () => {
		expect(TWEEN.getAll()).toBeInstanceOf(Array)
	})

	test('TWEEN object stores tweens automatically on start', () => {
		const numTweensBefore = TWEEN.getAll().length,
			t = new TWEEN.Tween({}, true)

		t.start()

		const numTweensAfter = TWEEN.getAll().length

		expect(numTweensBefore + 1).toBe(numTweensAfter)
	})

	test('TWEEN.removeAll()', () => {
		const t = new TWEEN.Tween({}, true)

		TWEEN.removeAll()

		expect(TWEEN.getAll().length, 'No tweens left').toBe(0)

		t.start()

		expect(TWEEN.getAll().length, 'Tweens are not automatically added/removed').toBe(0)

		TWEEN.add(t)

		expect(TWEEN.getAll().length, 'A tween has to be manually added').toBe(1)

		TWEEN.removeAll()

		expect(TWEEN.getAll().length, 'No tweens left').toBe(0)
	})

	test('TWEEN.add()', () => {
		const all = TWEEN.getAll(),
			numTweens = all.length,
			t = new TWEEN.Tween({}, true)

		TWEEN.add(t)

		expect(numTweens + 1).toBe(TWEEN.getAll().length)
	})

	test('TWEEN.remove()', () => {
		const all = TWEEN.getAll(),
			numTweens = all.length,
			t = new TWEEN.Tween({}, true)

		TWEEN.add(t)

		expect(TWEEN.getAll()).toContain(t)

		TWEEN.remove(t)

		expect(numTweens).toBe(TWEEN.getAll().length)
		expect(TWEEN.getAll()).not.toContain(t)
	})

	test('TWEEN.update() removes tweens when they are finished only if preserve is set to false', () => {
		TWEEN.removeAll()

		const t1 = new TWEEN.Tween({}, true).to({}, 1000),
			t2 = new TWEEN.Tween({}, true).to({}, 2000)

		expect(TWEEN.getAll().length).toBe(2)

		t1.start(0)
		t2.start(0)

		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(0, false)
		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(999, false)
		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(1000, false)
		expect(TWEEN.getAll().length).toBe(1)
		expect(TWEEN.getAll()).not.toContain(t1)
		expect(TWEEN.getAll()).toContain(t2)
	})

	test('TWEEN.update() does not remove tweens when they are finished with preserve true (default)', () => {
		TWEEN.removeAll()

		const t1 = new TWEEN.Tween({}, true).to({}, 1000),
			t2 = new TWEEN.Tween({}, true).to({}, 2000)

		expect(TWEEN.getAll().length).toBe(2)

		t1.start(0)
		t2.start(0)

		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(0)
		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(999)
		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(1000)
		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(1001)
		expect(TWEEN.getAll().length).toBe(2)
		expect(TWEEN.getAll()).toContain(t1)
		expect(TWEEN.getAll()).toContain(t2)
	})

	test('Unremoved tweens which have been updated past their finish time may go backward in time', () => {
		TWEEN.removeAll()

		const target1 = {a: 0}
		const target2 = {b: 0}

		const t1 = new TWEEN.Tween(target1, true).to({a: 1}, 1000),
			t2 = new TWEEN.Tween(target2, true).to({b: 1}, 2000)

		t1.start(0)
		t2.start(0)

		// To be able to make a tween go backward in time, it must be
		// updated with preserve set to true (default). Otherwise, the
		// backward-in-time feature does not apply.
		TWEEN.update(200, true)
		TWEEN.update(2500, true)

		expect(TWEEN.getAll().length).toBe(2)

		// If you want to go backward in time, start back at the beginning
		// first, then go to any time between the start and end time.
		t1.start(0)
		t2.start(0)

		TWEEN.update(750, true)
		expect(target1.a).toBe(0.75)
		expect(target2.b).toBe(0.375)

		TWEEN.update(500)
		expect(target1.a).toBe(0.5)
		expect(target2.b).toBe(0.25)
	})
})

describe('Tween construction and property tweening', () => {
	test('constructor', () => {
		const t = new TWEEN.Tween({})

		expect(t).toBeInstanceOf(TWEEN.Tween)
	})

	test('Return the same tween instance for method chaining', () => {
		const t = new TWEEN.Tween({})

		expect(t.to({}, 0)).toBeInstanceOf(TWEEN.Tween)
		expect(t.to({}, 0)).toBe(t)

		expect(t.start()).toBeInstanceOf(TWEEN.Tween)
		expect(t.start()).toBe(t)

		expect(t.stop()).toBeInstanceOf(TWEEN.Tween)
		expect(t.stop()).toBe(t)

		expect(t.delay()).toBeInstanceOf(TWEEN.Tween)
		expect(t.delay()).toBe(t)

		expect(t.easing()).toBeInstanceOf(TWEEN.Tween)
		expect(t.easing()).toBe(t)

		expect(t.interpolation()).toBeInstanceOf(TWEEN.Tween)
		expect(t.interpolation()).toBe(t)

		expect(t.chain()).toBeInstanceOf(TWEEN.Tween)
		expect(t.chain()).toBe(t)

		expect(t.onStart()).toBeInstanceOf(TWEEN.Tween)
		expect(t.onStart()).toBe(t)

		expect(t.onEveryStart()).toBeInstanceOf(TWEEN.Tween)
		expect(t.onEveryStart()).toBe(t)

		expect(t.onStop()).toBeInstanceOf(TWEEN.Tween)
		expect(t.onStop()).toBe(t)

		expect(t.onUpdate()).toBeInstanceOf(TWEEN.Tween)
		expect(t.onUpdate()).toBe(t)

		expect(t.onComplete()).toBeInstanceOf(TWEEN.Tween)
		expect(t.onComplete()).toBe(t)

		expect(t.duration()).toBeInstanceOf(TWEEN.Tween)
		expect(t.duration()).toBe(t)

		expect(t.group()).toBeInstanceOf(TWEEN.Tween)
		expect(t.group()).toBe(t)
	})

	test('Tween existing property', () => {
		const obj = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toEqual(2)
	})

	test('Tween non-existing property', () => {
		const obj: {x: number; y?: number} = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({y: 0}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toEqual(1)
		expect(obj.y).toBeUndefined()
	})

	test('Tween non-null property', () => {
		const obj = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toEqual(2)
		expect(obj.x).not.toBeNull()
	})

	test('Tween function property', () => {
		const my_function = new Function()

		const obj = {x: my_function},
			t = new TWEEN.Tween(obj)

		t.to({x: my_function})
		t.start(0)
		t.update(1000)

		expect(obj.x).toBe(my_function)
	})

	test('Tween boolean property', () => {
		const obj = {x: true},
			t = new TWEEN.Tween(obj)

		t.to({x: new Function()})
		t.start(0)
		t.update(1000)

		expect(typeof obj.x).toBe('boolean')
		expect(obj.x).toBe(true)
	})

	test('Tween null property', () => {
		const obj: {x: number | null} = {x: null},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toEqual(2)
	})

	test('Tween undefined property', () => {
		const obj: {x?: number} = {},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toBeUndefined()
	})

	test('Tween relative positive value', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '+100'}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toBe(100)
	})

	test('Tween relative negative value', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '-100'}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toBe(-100)
	})

	test('String values without a + or - sign should not be interpreted as relative', () => {
		const obj = {x: 100},
			t = new TWEEN.Tween(obj)

		t.to({x: '100'}, 1000)
		t.start(0)
		t.update(1000)

		expect(obj.x).toBe(100)
	})

	test('Tween relative positive value, with yoyo', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '+100'}, 1000)
		t.repeat(1)
		t.yoyo(true)
		t.start(0)

		t.update(500)
		expect(obj.x).toBe(50)
		t.update(1000)
		expect(obj.x).toBe(100)
		t.update(1500)
		expect(obj.x).toBe(50)
		t.update(2000)
		expect(obj.x).toBe(0)
	})

	test('Tween relative negative value, with yoyo', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '-100'}, 1000)
		t.repeat(1)
		t.yoyo(true)
		t.start(0)

		t.update(500)
		expect(obj.x).toBe(-50)
		t.update(1000)
		expect(obj.x).toBe(-100)
		t.update(1500)
		expect(obj.x).toBe(-50)
		t.update(2000)
		expect(obj.x).toBe(0)
	})

	test('Tween relative positive array interpolation values', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: ['+100', '+0', '-100', '+0']}, 2000)
		t.start(0)

		t.update(250)
		expect(obj.x).toBe(50)
		t.update(500)
		expect(obj.x).toBe(100)
		t.update(750)
		expect(obj.x).toBe(50)
		t.update(1000)
		expect(obj.x).toBe(0)
		t.update(1250)
		expect(obj.x).toBe(-50)
		t.update(1500)
		expect(obj.x).toBe(-100)
		t.update(1750)
		expect(obj.x).toBe(-50)
		t.update(2000)
		expect(obj.x).toBe(0)
	})

	test('String values without a + or - sign should not be interpreted as relative with array interpolation values', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: ['100', '0', '100', '0']}, 2000)
		t.start(0)

		t.update(250)
		expect(obj.x).toBe(50)
		t.update(500)
		expect(obj.x).toBe(100)
		t.update(750)
		expect(obj.x).toBe(50)
		t.update(1000)
		expect(obj.x).toBe(0)
		t.update(1250)
		expect(obj.x).toBe(50)
		t.update(1500)
		expect(obj.x).toBe(100)
		t.update(1750)
		expect(obj.x).toBe(50)
		t.update(2000)
		expect(obj.x).toBe(0)
	})

	test('animate values in an array', () => {
		const obj = [0, 0, 0],
			t = new TWEEN.Tween(obj)

		t.to([1000, '-2000', '+2000'], 1000)
		t.start(0)

		t.update(250)
		expect(obj[0]).toBe(250)
		expect(obj[1]).toBe(-500)
		expect(obj[2]).toBe(500)
		t.update(500)
		expect(obj[0]).toBe(500)
		expect(obj[1]).toBe(-1000)
		expect(obj[2]).toBe(1000)
		t.update(750)
		expect(obj[0]).toBe(750)
		expect(obj[1]).toBe(-1500)
		expect(obj[2]).toBe(1500)
		t.update(1000)
		expect(obj[0]).toBe(1000)
		expect(obj[1]).toBe(-2000)
		expect(obj[2]).toBe(2000)
	})

	test('animate values in a nested array', () => {
		const obj = {a: [0, 0, 0]},
			t = new TWEEN.Tween(obj)

		t.to({a: [1000, '-2000', '+2000']}, 1000)
		t.start(0)

		t.update(250)
		expect(obj.a[0]).toBe(250)
		expect(obj.a[1]).toBe(-500)
		expect(obj.a[2]).toBe(500)
		t.update(500)
		expect(obj.a[0]).toBe(500)
		expect(obj.a[1]).toBe(-1000)
		expect(obj.a[2]).toBe(1000)
		t.update(750)
		expect(obj.a[0]).toBe(750)
		expect(obj.a[1]).toBe(-1500)
		expect(obj.a[2]).toBe(1500)
		t.update(1000)
		expect(obj.a[0]).toBe(1000)
		expect(obj.a[1]).toBe(-2000)
		expect(obj.a[2]).toBe(2000)
	})
})

describe('Tween lifecycle', () => {
	test('Test TWEEN.Tween.start()', () => {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)

		t.to({}, 1000)

		expect(TWEEN.getAll().length).toBe(1)

		t.start(0)

		expect(TWEEN.getAll().length).toBe(1)
	})

	test('Ensure tweens start without calling start() method.', () => {
		TWEEN.Tween.autoStartOnUpdate = true

		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1000}, 1000)
		let started = false
		t.onStart(() => (started = true))
		t.onComplete(() => (started = false))

		t.update(0)
		expect(started).toEqual(true)
		expect(obj.x).toEqual(0)
		t.update(500)
		expect(started).toEqual(true)
		expect(obj.x).toEqual(500)
		t.update(1000)
		expect(obj.x).toEqual(1000)
		expect(started).toEqual(false)

		TWEEN.Tween.autoStartOnUpdate = false
	})

	test('Test Tween.to() tweening towards a dynamic object', () => {
		const rabbit = {x: 1000, y: 0}
		const tr = new TWEEN.Tween(rabbit)
		tr.to({y: 1000}, 1000)
		tr.start(0)

		const fox = {x: 0, y: 0}
		const tf = new TWEEN.Tween(fox)
		tf.to(rabbit, 1000) // fox chase rabbit!
		tf.dynamic(true)
		tf.start(0)

		tr.update(200)
		tf.update(200)
		expect(rabbit.x).toBe(1000)
		expect(rabbit.y).toBe(200)
		expect(fox.x).toBe(200)
		expect(fox.y).toBe(40)
		tr.update(500)
		tf.update(500)
		expect(rabbit.x).toBe(1000)
		expect(rabbit.y).toBe(500)
		expect(fox.x).toBe(500)
		expect(fox.y).toBe(250)
		tr.update(800)
		tf.update(800)
		expect(rabbit.x).toBe(1000)
		expect(rabbit.y).toBe(800)
		expect(fox.x).toBe(800)
		expect(fox.y).toBe(640)
		tr.update(1000)
		tf.update(1000)
		expect(rabbit.x).toBe(1000)
		expect(rabbit.y).toBe(1000)
		expect(fox.x).toBe(1000)
		expect(fox.y).toBe(1000)
	})

	test('Test TWEEN.Tween.stop()', () => {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 2}, 1000)

		t.start()
		expect(TWEEN.getAll().length).toBe(1)

		t.stop()
		expect(TWEEN.getAll().length).toBe(1)
	})

	test('Test TWEEN.Tween.delay()', () => {
		const obj = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.delay(500)
		t.start(0)

		t.update(100)

		expect(obj.x, "Tween hasn't started yet").toEqual(1)

		t.update(1000)

		expect(obj.x !== 1 && obj.x !== 2, "Tween has started but hasn't finished yet").toBe(true)

		t.update(1500)

		expect(obj.x, 'Tween finishes when expected').toBe(2)
	})

	// TODO: not really sure how to test this. Advice appreciated!
	test('Test TWEEN.Tween.easing()', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1}, 1000)

		t.easing(TWEEN.Easing.Quadratic.In)
		t.start(0)
		t.update(500)
		expect(obj.x).toBe(TWEEN.Easing.Quadratic.In(0.5))
	})

	test('Test TWEEN.Tween.EasingFunctionGroup should be frozen', () => {
		const replaceEasingFunction = (easingGroup: EasingFunctionGroup) => {
			const throwsWithReassigned = () => {
				easingGroup.In = (amount: number) => {
					return 1.0 + amount
				}
				easingGroup.Out = (amount: number) => {
					return 1.0 + amount
				}
				easingGroup.InOut = (amount: number) => {
					return 1.0 + amount
				}
			}
			expect(throwsWithReassigned).toThrow()
			expect(unsignZero(easingGroup.In(0.0))).toBe(0.0)
			expect(unsignZero(easingGroup.Out(0.0))).toBe(0.0)
			expect(unsignZero(easingGroup.InOut(0.0))).toBe(0.0)
			expect(easingGroup.In(1.0)).toBe(1.0)
			expect(easingGroup.Out(1.0)).toBe(1.0)
			expect(easingGroup.InOut(1.0)).toBe(1.0)
		}

		const Easing = TWEEN.Easing
		const easingGroups = [
			Easing.Quadratic,
			Easing.Cubic,
			Easing.Quartic,
			Easing.Quintic,
			Easing.Sinusoidal,
			Easing.Exponential,
			Easing.Circular,
			Easing.Elastic,
			Easing.Back,
			Easing.Bounce,
		]
		easingGroups.forEach(replaceEasingFunction)
	})
})

describe('Easing', () => {
	test('Test TWEEN.Easing should starts at 0.0, ends at 1.0. TWEEN.Easing.InOut() should be 0.5 at midpoint', () => {
		const checkEdgeValue = (ease: EasingFunctionGroup) => {
			expect(unsignZero(ease.In(0.0))).toBe(0.0)
			expect(unsignZero(ease.Out(0.0))).toBe(0.0)
			expect(unsignZero(ease.InOut(0.0))).toBe(0.0)

			expect(ease.In(1.0)).toBe(1.0)
			expect(ease.Out(1.0)).toBe(1.0)
			expect(ease.InOut(1.0)).toBe(1.0)

			expect(ease.InOut(0.5)).toBe(0.5)
		}

		checkEdgeValue(TWEEN.Easing.Quadratic)
		checkEdgeValue(TWEEN.Easing.Cubic)
		checkEdgeValue(TWEEN.Easing.Quartic)
		checkEdgeValue(TWEEN.Easing.Quintic)
		checkEdgeValue(TWEEN.Easing.Sinusoidal)
		checkEdgeValue(TWEEN.Easing.Exponential)
		checkEdgeValue(TWEEN.Easing.Circular)
		checkEdgeValue(TWEEN.Easing.Elastic)
		checkEdgeValue(TWEEN.Easing.Back)
		checkEdgeValue(TWEEN.Easing.Bounce)
	})

	test('Test TWEEN.Easing should pass a specific value', () => {
		const checkEasingGroupPassPoints = (
			easingGroup: EasingFunctionGroup,
			expects: {In: number; Out: number; InOut: number},
		) => {
			checkPassPoint(easingGroup.In, expects.In)
			checkPassPoint(easingGroup.Out, expects.Out)
			checkPassPoint(easingGroup.InOut, expects.InOut)
		}
		const checkPassPoint = (
			easeFunc: (amount: number) => number,
			expected: number,
			numDigits = 14,
			amount = Math.LOG10E,
		) => {
			expect(easeFunc(amount)).toBeCloseTo(expected, numDigits)
		}

		checkEasingGroupPassPoints(TWEEN.Easing.Quadratic, {
			In: 0.18861169701161393,
			Out: 0.6799772667948897,
			InOut: 0.37722339402322785,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Cubic, {
			In: 0.08191301923455198,
			Out: 0.8189613739094657,
			InOut: 0.3276520769382079,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Quartic, {
			In: 0.035574372249600854,
			Out: 0.8975854502319308,
			InOut: 0.28459497799680683,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Quintic, {
			In: 0.015449753565173821,
			Out: 0.9420635240628092,
			InOut: 0.24719605704278114,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Sinusoidal, {
			In: 0.22380505208857682,
			Out: 0.630492983971101,
			InOut: 0.397521402836783,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Exponential, {
			In: 0.01981785759600918,
			Out: 0.9507231043886069,
			InOut: 0.2010867096041978,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Circular, {
			In: 0.09922905076352173,
			Out: 0.8246073409780499,
			InOut: 0.2522333699054974,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Elastic, {
			In: -0.01701121590548648,
			Out: 0.9577017895937282,
			InOut: -0.09523991217687242,
		})
		checkEasingGroupPassPoints(TWEEN.Easing.Back, {
			In: -0.09964331689734113,
			Out: 1.055453950893486,
			InOut: 0.19901899530677744,
		})

		checkEasingGroupPassPoints(TWEEN.Easing.Bounce, {
			In: 0.24689860443452594,
			Out: 0.8434464829485027,
			InOut: 0.43470212148602316,
		})
	})
})

describe('Interpolation', () => {
	test('Test TWEEN.interpolation should starts at values[0], ends at values[values.length-1].', () => {
		const generateArray = (): number[] => {
			return [0, Math.PI, Math.SQRT2, Math.E]
		}

		const checkStartAndEnd = (interpolation: (v: number[], k: number) => number, values: number[]) => {
			const originalValue = values.concat()
			expect(interpolation(values, 0.0)).toBe(originalValue[0])
			expect(interpolation(values, 1.0)).toBe(originalValue[originalValue.length - 1])
			expect(originalValue).toEqual(values)
		}

		const Interpolations = [TWEEN.Interpolation.Linear, TWEEN.Interpolation.Bezier, TWEEN.Interpolation.CatmullRom]
		Interpolations.forEach(func => {
			checkStartAndEnd(func, generateArray())
		})
	})

	test('Test TWEEN.interpolation.Bezier should return a value equal to Linear if there are two values.', () => {
		const compareToLinear = (k: number) => {
			const Interpolation = TWEEN.Interpolation
			const values = [0, Math.E]
			expect(Interpolation.Bezier(values, k)).toBe(Interpolation.Linear(values, k))
		}

		compareToLinear(0.0)
		compareToLinear(0.5)
		compareToLinear(1.0)
		compareToLinear(Math.LOG10E)
		compareToLinear(Math.LN2)
	})

	test('Test TWEEN.interpolation should pass a specific value.', () => {
		const generateArray = (): number[] => {
			return [0, Math.PI, Math.SQRT2, Math.E]
		}

		const testInterpolationPath = (
			interpolation: (v: number[], k: number) => number,
			values: number[],
			result: number,
		) => {
			expect(interpolation(values, Math.LOG10E)).toBeCloseTo(result, 14)
		}
		testInterpolationPath(TWEEN.Interpolation.Linear, generateArray(), 2.618398122395094)
		testInterpolationPath(TWEEN.Interpolation.Bezier, generateArray(), 1.985241172928958)
		testInterpolationPath(TWEEN.Interpolation.CatmullRom, generateArray(), 2.879802635590904)
	})
})

describe('Tween.chain()', () => {
	test('Test TWEEN.Tween.chain --with one tween', () => {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({}, true),
			t2 = new TWEEN.Tween({}, true)
		let tStarted = false,
			tCompleted = false,
			t2Started = false

		t.to({}, 1000)
		t2.to({}, 1000)

		t.chain(t2)

		t.onStart((): void => {
			tStarted = true
		})

		t.onComplete((): void => {
			tCompleted = true
		})

		t2.onStart((): void => {
			expect(tStarted).toBe(true)
			expect(tCompleted).toBe(true)
			expect(t2Started).toBe(false)
			t2Started = true
		})

		expect(tStarted).toBe(false)
		expect(t2Started).toBe(false)

		t.start(0)
		TWEEN.update(0)

		expect(tStarted).toBe(true)
		expect(t2Started).toBe(false)

		TWEEN.update(1000)

		expect(tCompleted).toBe(true)

		TWEEN.update(1001)

		expect(t2Started, 't2 is automatically started by t').toBe(true)
	})

	test('Test TWEEN.Tween.chain --with several tweens in an array', () => {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({}, true),
			chainedTweens: (typeof t)[] = [],
			numChained = 3
		let numChainedStarted = 0

		t.to({}, 1000)

		function onChainedStart(): void {
			numChainedStarted++
		}

		for (let i = 0; i < numChained; i++) {
			const chained = new TWEEN.Tween({}, true)
			chained.to({}, 1000)

			chainedTweens.push(chained)

			chained.onStart(onChainedStart)
		}

		t.chain(...chainedTweens)

		expect(numChainedStarted).toBe(0)

		t.start(0)
		TWEEN.update(0)
		TWEEN.update(1000)
		TWEEN.update(1001)

		expect(numChainedStarted, 'All chained tweens have been started').toBe(numChained)
	})

	test('Test TWEEN.Tween.chain allows endless loops', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t1 = new TWEEN.Tween(obj, true).to({x: 100}, 1000),
			t2 = new TWEEN.Tween(obj, true).to({x: 0}, 1000)

		t1.chain(t2)
		t2.chain(t1)

		expect(obj.x).toBe(0)

		// x == 0
		t1.start(0)
		TWEEN.update(0)

		expect(obj.x).toBe(0)

		TWEEN.update(500)
		expect(obj.x).toBe(50)

		// there... (x == 100)

		TWEEN.update(1000)
		expect(obj.x).toBe(100)

		TWEEN.update(1500)
		expect(obj.x).toBe(50)

		// ... and back again (x == 0)

		TWEEN.update(2000)
		expect(obj.x).toBe(0)

		TWEEN.update(2500)
		expect(obj.x).toBe(50)

		TWEEN.update(3000)
		expect(obj.x).toBe(100) // and x == 100 again

		// Repeat the same test but with the tweens added in the
		// opposite order.
		const obj2 = {x: 0}
		const t3 = new TWEEN.Tween(obj2, true).to({x: 200}, 1000)
		const t4 = new TWEEN.Tween(obj2, true).to({x: 100}, 1000)

		t4.chain(t3)
		t3.chain(t4)

		expect(obj2.x).toBe(0)

		t4.start(0)

		TWEEN.update(0)
		expect(obj2.x).toBe(0)

		TWEEN.update(500)
		expect(obj2.x).toBe(50)

		TWEEN.update(1000)
		expect(obj2.x).toBe(100)

		TWEEN.update(1500)
		expect(obj2.x).toBe(150)

		TWEEN.update(2000)
		expect(obj2.x).toBe(0)

		TWEEN.update(2500)
		expect(obj2.x).toBe(50)

		TWEEN.update(3000)
		expect(obj2.x).toBe(100)

		TWEEN.update(3500)
		expect(obj2.x).toBe(150)

		TWEEN.update(4000)
		expect(obj2.x).toBe(0)

		TWEEN.update(4500)
		expect(obj2.x).toBe(50)
	})
})

describe('Tween.startFromCurrentValues()', () => {
	test('Test TWEEN.Tween.startFromCurrentValues', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100})

		expect(obj.x).toBe(0)

		// x == 0
		t.start(0)
		TWEEN.update(0)

		expect(obj.x).toBe(0)

		TWEEN.update(1500)
		expect(obj.x).toBe(100)

		obj.x = 200

		t.startFromCurrentValues(0)

		TWEEN.update(0)
		expect(obj.x).toBe(200)

		TWEEN.update(500)
		expect(obj.x).toBe(150)

		TWEEN.update(1000)
		expect(obj.x).toBe(100)
	})
})

describe('Tween callbacks', () => {
	test('Test TWEEN.Tween.onStart', () => {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onStart((): void => {
			expect(true, 'onStart callback is called').toBe(true)
			counter++
		})

		expect(counter).toEqual(0)

		t.start(0)
		TWEEN.update(0)

		expect(counter).toEqual(1)

		TWEEN.update(500)

		expect(counter, 'onStart callback is not called again').toEqual(1)
	})

	test('Test TWEEN.Tween.onEveryStart', () => {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 500)
		t.delay(500)
		t.repeat(Infinity)
		t.onEveryStart((): void => {
			counter++
		})

		expect(counter).toEqual(0)

		t.start(0)
		TWEEN.update(0)
		expect(counter, 'onEveryStart callback not called before delayed start').toEqual(0)

		TWEEN.update(500)
		expect(counter, 'onEveryStart callback called at delayed start').toEqual(1)

		TWEEN.update(1000)
		expect(counter, 'onEveryStart callback not called before delayed repeat start').toEqual(1)

		TWEEN.update(1500)
		expect(counter, 'onEveryStart callback called at delayed repeat start').toEqual(2)
	})

	test('Test TWEEN.Tween.onStop', () => {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onStop((): void => {
			expect(true, 'onStop callback is called').toBe(true)
			counter++
		})

		expect(counter).toEqual(0)

		t.stop()
		TWEEN.update(0)

		expect(counter, "onStop callback not called when the tween hasn't started yet").toEqual(0)

		t.start(0)
		TWEEN.update(0)
		t.stop()

		expect(counter, 'onStop callback is called if the tween has been started already and stop is invoked').toEqual(1)

		TWEEN.update(500)
		t.stop()

		expect(counter, 'onStop callback is not called again once the tween is stopped').toEqual(1)
	})

	test('Test TWEEN.Tween.onUpdate', () => {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onUpdate((): void => {
			counter++
		})

		expect(counter).toEqual(0)

		t.start(0)

		TWEEN.update(0)
		expect(counter).toEqual(1)

		TWEEN.update(500)
		expect(counter).toEqual(2)

		TWEEN.update(600)
		expect(counter).toEqual(3)

		TWEEN.update(1000)
		expect(counter).toEqual(4)

		TWEEN.update(1500)
		expect(counter, 'onUpdate callback should not be called after the tween has finished').toEqual(4)
	})

	test('Test TWEEN.Tween.onComplete', () => {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onComplete((): void => {
			counter++
		})

		expect(counter).toEqual(0)

		t.start(0)

		TWEEN.update(0)
		expect(counter).toEqual(0)

		TWEEN.update(500)
		expect(counter).toEqual(0)

		TWEEN.update(600)
		expect(counter).toEqual(0)

		TWEEN.update(1000)
		expect(counter).toEqual(1)

		TWEEN.update(1500)
		expect(counter, 'onComplete callback must be called only once').toEqual(1)
	})
})

describe('repeat and yoyo', () => {
	test('TWEEN.Tween does not repeat by default', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(50)
		expect(obj.x).toBe(50)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(150)
		expect(obj.x).toBe(100)
	})

	test('Test single repeat happens only once', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(50)
		expect(obj.x).toBe(50)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(150)
		expect(obj.x).toBe(50)

		TWEEN.update(200)
		expect(obj.x).toBe(100)
	})

	test('Test Infinity repeat happens forever', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(50)
		expect(obj.x).toBe(50)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(150)
		expect(obj.x).toBe(50)

		TWEEN.update(200)
		expect(obj.x).toBe(100)

		TWEEN.update(250)
		expect(obj.x).toBe(50)
	})

	test('Test tweening relatively with repeat', () => {
		TWEEN.removeAll()

		const obj = {x: 0, y: 0},
			t = new TWEEN.Tween(obj, true).to({x: '+100', y: '-100'}, 100).repeat(1)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)
		expect(obj.y).toBe(0)

		TWEEN.update(50)
		expect(obj.x).toBe(50)
		expect(obj.y).toBe(-50)

		TWEEN.update(100)
		expect(obj.x).toBe(100)
		expect(obj.y).toBe(-100)

		TWEEN.update(150)
		expect(obj.x).toBe(150)
		expect(obj.y).toBe(-150)

		TWEEN.update(200)
		expect(obj.x).toBe(200)
		expect(obj.y).toBe(-200)
	})

	test('Test yoyo with repeat Infinity happens forever', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity).yoyo(true)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(25)
		expect(obj.x).toBe(25)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(125)
		expect(obj.x).toBe(75)

		TWEEN.update(200)
		expect(obj.x).toBe(0)

		TWEEN.update(225)
		expect(obj.x).toBe(25)
	})

	test('Test yoyo with repeat 1 happens once', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).yoyo(true)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(25)
		expect(obj.x).toBe(25)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(125)
		expect(obj.x).toBe(75)

		TWEEN.update(200)
		expect(obj.x).toBe(0)

		TWEEN.update(225)
		expect(obj.x).toBe(0)
	})

	test('Test yoyo works with arrays', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true)
				.to({x: [100, 200]}, 100)
				.repeat(1)
				.yoyo(true)

		t.start(0)

		TWEEN.update(50)
		expect(obj.x).toBe(100)

		TWEEN.update(100)
		expect(obj.x).toBe(200)

		TWEEN.update(150)
		expect(obj.x).toBe(100)

		TWEEN.update(200)
		expect(obj.x).toBe(0)
	})

	test('Test yoyo can be stopped and restarted properly', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).yoyo(true)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(25)
		expect(obj.x).toBe(25)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(125)
		expect(obj.x).toBe(75)

		t.stop()
		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(25)
		expect(obj.x).toBe(25)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(125)
		expect(obj.x).toBe(75)

		TWEEN.update(200)
		expect(obj.x).toBe(0)

		TWEEN.update(225)
		expect(obj.x).toBe(0)
	})
})

describe('chained tween progression', () => {
	test('Test TWEEN.Tween.stopChainedTweens()', () => {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({}, true),
			t2 = new TWEEN.Tween({}, true)
		let tStarted = false,
			tCompleted = false,
			t2Started = false

		t.to({}, 1000)
		t2.delay(500).to({}, 1000)

		t.chain(t2)
		t2.chain(t)

		t.onStart((): void => {
			tStarted = true
		})

		t.onComplete((): void => {
			tCompleted = true
		})

		t2.onStart((): void => {
			expect(tStarted).toBe(true)
			expect(tCompleted).toBe(true)
			expect(t2Started).toBe(false)
			t2Started = true
		})

		expect(tStarted).toBe(false)
		expect(t2Started).toBe(false)

		t.start(0)
		TWEEN.update(1001)
		t.stop()

		expect(tStarted).toBe(true)
		expect(t2Started).toBe(false)
		expect(TWEEN.getAll().length).toBe(2)

		TWEEN.update(1501)

		expect(t2Started).toBe(false)
	})

	test('Test TWEEN.Tween.chain progressess into chained tweens', () => {
		TWEEN.removeAll()

		const obj = {t: 1000}

		// 1000 of nothing
		const blank = new TWEEN.Tween({}, true).to({}, 1000)

		// tween obj.t from 1000 -> 2000 (in time with update time)
		const next = new TWEEN.Tween(obj, true).to({t: 2000}, 1000)

		blank.chain(next).start(0)

		TWEEN.update(1500)
		expect(obj.t).toBe(1500)

		TWEEN.update(2000)
		expect(obj.t).toBe(2000)
	})
})

describe('Tween.end()', () => {
	test('Test that TWEEN.Tween.end sets the final values.', () => {
		const object1 = {x: 0, y: -50, z: 1000}
		const target1 = {x: 50, y: 123, z: '+234'}

		const tween1 = new TWEEN.Tween(object1).to(target1, 1000)

		tween1.start()
		tween1.end()

		expect(object1.x).toBe(50)
		expect(object1.y).toBe(123)
		expect(object1.z).toBe(1234)

		const object2 = {x: 0, y: -50, z: 1000}
		const target2 = {x: 50, y: 123, z: '+234'}

		const tween2 = new TWEEN.Tween(object2).to(target2, 1000)

		tween2.start(300)
		tween2.update(500)
		tween2.end()

		expect(object2.x).toBe(50)
		expect(object2.y).toBe(123)
		expect(object2.z).toBe(1234)
	})

	test('Test that TWEEN.Tween.end calls the onComplete callback of the tween.', () => {
		expect.assertions(1)

		const tween1 = new TWEEN.Tween({}).to({}, 1000).onComplete((): void => {
			expect(true).toBe(true)
		})

		tween1.start()
		tween1.end()
	})

	test('Ensure Tween.end() works after stopping a tween.', () => {
		const object = {x: 0, y: -50, z: 1000}
		const target = {x: 50, y: 123, z: '+234'}

		const tween = new TWEEN.Tween(object).to(target, 1000)

		tween.start(300)
		tween.update(500)
		tween.stop()
		tween.end()

		expect(object.x).toBe(50)
		expect(object.y).toBe(123)
		expect(object.z).toBe(1234)
	})
})

describe('delay and repeatDelay', () => {
	test('Test delay adds delay before each repeat', () => {
		// If repeatDelay isn't specified then delay is used since
		// that's the way it worked before repeatDelay was added.

		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).delay(100)

		t.start(0)

		TWEEN.update(100)
		expect(obj.x).toBe(0)

		TWEEN.update(150)
		expect(obj.x).toBe(50)

		TWEEN.update(200)
		expect(obj.x).toBe(100)

		TWEEN.update(250)
		expect(obj.x).toBe(100)

		TWEEN.update(300)
		expect(obj.x).toBe(0)

		TWEEN.update(350)
		expect(obj.x).toBe(50)

		TWEEN.update(400)
		expect(obj.x).toBe(100)
	})

	test('Test repeatDelay adds delay before each repeat', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(0)
		expect(obj.x).toBe(0)

		TWEEN.update(50)
		expect(obj.x).toBe(50)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(200)
		expect(obj.x).toBe(100)

		TWEEN.update(300)
		expect(obj.x).toBe(0)

		TWEEN.update(350)
		expect(obj.x).toBe(50)

		TWEEN.update(400)
		expect(obj.x).toBe(100)
	})

	test('Test repeatDelay and delay can be used together', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).delay(100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(100)
		expect(obj.x).toBe(0)

		TWEEN.update(150)
		expect(obj.x).toBe(50)

		TWEEN.update(200)
		expect(obj.x).toBe(100)

		TWEEN.update(300)
		expect(obj.x).toBe(100)

		TWEEN.update(400)
		expect(obj.x).toBe(0)

		TWEEN.update(450)
		expect(obj.x).toBe(50)

		TWEEN.update(500)
		expect(obj.x).toBe(100)
	})
})

describe('Tween.onRepeat()', () => {
	test('TWEEN.Tween.onRepeat should not be called if repeat = 0 or default', () => {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		expect(callbackCounter).toBe(0)
		TWEEN.update(50)
		expect(callbackCounter).toBe(0)
		TWEEN.update(100)
		expect(callbackCounter).toBe(0)
		TWEEN.update(150)
		expect(callbackCounter).toBe(0)
		expect(t.isPlaying()).toBe(false)
	})

	test('TWEEN.Tween.onRepeat should be called once if repeat = 1', () => {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		expect(callbackCounter).toBe(0)
		TWEEN.update(50)
		expect(callbackCounter).toBe(0)
		TWEEN.update(99.99999999)
		expect(callbackCounter).toBe(0)
		TWEEN.update(100)
		expect(callbackCounter).toBe(1)
		expect(t.isPlaying()).toBe(true)

		TWEEN.update(150)
		expect(callbackCounter).toBe(1)
		TWEEN.update(200)
		expect(callbackCounter).toBe(1)
		expect(t.isPlaying()).toBe(false)
	})

	test('TWEEN.Tween.onRepeat should be called every time if repeat = Infinity', () => {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		const repeatTween = (repeatCount: number): void => {
			TWEEN.update(repeatCount * 100)
			expect(callbackCounter).toBe(repeatCount)
			TWEEN.update(50 + repeatCount * 100)
			expect(callbackCounter).toBe(repeatCount)
			TWEEN.update(99.99999999 + repeatCount * 100)
			expect(callbackCounter).toBe(repeatCount)
			TWEEN.update(100 + repeatCount * 100)
			expect(callbackCounter).toBe(repeatCount + 1)
			expect(t.isPlaying()).toBe(true)
		}

		for (let i = 0; i < 10; i++) {
			repeatTween(i)
		}
	})

	test('TWEEN.Tween.onRepeat should not be called if Tween.pause() or Tween.stop(), and should be called after Tween.resume() or restart', () => {
		TWEEN.removeAll()

		const generateTween = () => {
			const obj = {x: 0}
			const counter = {count: 0}
			const tween = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity).start(0)
			tween.onRepeat(() => {
				counter.count++
			})
			return {
				tween,
				counter,
			}
		}

		const tweenPause = generateTween()
		const tweenStop = generateTween()

		TWEEN.update(100)
		expect(tweenPause.counter.count, 'repeats after first completion').toBe(1)
		expect(tweenStop.counter.count, 'repeats after first completion').toBe(1)

		TWEEN.update(200)
		expect(tweenPause.counter.count, 'repeats after second completion').toBe(2)
		expect(tweenStop.counter.count, 'repeats after second completion').toBe(2)

		tweenPause.tween.pause(200)
		TWEEN.update(300)
		expect(tweenPause.counter.count, 'tween is paused hence it did not repeat').toBe(2)
		expect(tweenStop.counter.count, 'tween is not stopped hence it repeated').toBe(3)

		tweenPause.tween.resume(300)
		tweenStop.tween.stop()
		TWEEN.update(400)
		expect(tweenPause.counter.count, 'tween is resumed so it repeated').toBe(3)
		expect(tweenStop.counter.count, 'tween was stopped hence it did not repeat').toBe(3)

		tweenStop.tween.start(400)
		TWEEN.update(500)
		expect(tweenPause.counter.count, 'tween is not paused hence it repeated').toBe(4)
		expect(tweenStop.counter.count, 'tween is not stopped hence it repeated').toBe(4)
	})

	test('If Tween.delay is set, TWEEN.Tween.onRepeat should be called when repeat section finished', () => {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).delay(50).repeat(1).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		expect(callbackCounter).toBe(0)

		TWEEN.update(50) //start first section
		expect(obj.x).toBe(0)
		expect(callbackCounter).toBe(0)

		TWEEN.update(100)
		expect(obj.x).toBe(50)
		expect(callbackCounter).toBe(0)

		TWEEN.update(150) //first section is finished
		expect(obj.x).toBe(100)
		expect(callbackCounter).toBe(1)

		TWEEN.update(200) //restart
		expect(obj.x).toBe(0)
		expect(callbackCounter).toBe(1)

		TWEEN.update(250)
		expect(obj.x).toBe(50)
		expect(callbackCounter).toBe(1)

		TWEEN.update(300) //second section is finished
		expect(obj.x).toBe(100)
		expect(callbackCounter).toBe(1)
		expect(t.isPlaying()).toBe(false)

		TWEEN.update(400)
		expect(obj.x).toBe(100)
		expect(callbackCounter).toBe(1)
	})

	test('If Tween.repeatDelay is set, TWEEN.Tween.onRepeat should be called when repeat section finished', () => {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeatDelay(100).repeat(1).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		expect(callbackCounter).toBe(0)

		TWEEN.update(50)
		expect(callbackCounter).toBe(0)

		TWEEN.update(99.99999999)
		expect(callbackCounter).toBe(0)

		TWEEN.update(100) //first section is finished
		expect(callbackCounter).toBe(1)

		TWEEN.update(150) //delay
		expect(callbackCounter).toBe(1)

		TWEEN.update(200) //restart
		expect(callbackCounter).toBe(1)

		TWEEN.update(300) //second section is finished
		expect(callbackCounter).toBe(1)
		expect(t.isPlaying()).toBe(false)

		TWEEN.update(400)
		expect(callbackCounter).toBe(1)
	})
})

describe('repeat count', () => {
	test('Test TWEEN.update() should reduce the repeat count', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(5).delay(100)

		t.start(0)

		TWEEN.update(100)
		// @ts-expect-error
		expect(t._repeat).toBe(5)

		TWEEN.update(150)
		// @ts-expect-error
		expect(t._repeat).toBe(5)

		TWEEN.update(200)
		// @ts-expect-error
		expect(t._repeat).toBe(4)

		TWEEN.update(250)
		// @ts-expect-error
		expect(t._repeat).toBe(4)

		TWEEN.update(300)
		// @ts-expect-error
		expect(t._repeat).toBe(4)

		TWEEN.update(350)
		// @ts-expect-error
		expect(t._repeat).toBe(4)

		TWEEN.update(400)
		// @ts-expect-error
		expect(t._repeat).toBe(3)
	})

	test('Test TWEEN.update() should reduce the repeat count multiple times', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(5).delay(100)

		t.start(0)

		TWEEN.update(400)
		// @ts-expect-error
		expect(t._repeat).toBe(3)
	})
})

describe('browser tab sleep', () => {
	test('Test browser tab sleep with delay', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity).delay(100)

		t.start(0)

		TWEEN.update(350)
		expect(obj.x).toBe(50)

		TWEEN.update(750)
		expect(obj.x).toBe(50)
	})

	test('Test browser tab sleep with repeatDelay', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(350)
		expect(obj.x).toBe(50)

		TWEEN.update(600)
		expect(obj.x).toBe(100)

		TWEEN.update(Infinity)
		expect(obj.x).toBe(100)
	})

	test('Test browser tab sleep with repeatDelay and delay', () => {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).delay(100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(450)
		expect(obj.x).toBe(50)

		TWEEN.update(500)
		expect(obj.x).toBe(100)

		TWEEN.update(Infinity)
		expect(obj.x).toBe(100)
	})
})

describe('getters, setters and isPlaying()', () => {
	test('Tween.js compatible with Object.defineProperty getter / setters', () => {
		TWEEN.removeAll()

		const obj = {_x: 0, x: 0}

		Object.defineProperty(obj, 'x', {
			get(): number {
				return this._x
			},
			set(x): void {
				this._x = x
			},
		})

		expect(obj.x).toBe(0)

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100)

		t.start(0)

		expect(obj.x).toBe(0)

		TWEEN.update(37)
		expect(obj.x).toBe(37)

		TWEEN.update(100)
		expect(obj.x).toBe(100)

		TWEEN.update(115)
		expect(obj.x).toBe(100)
	})

	test('tween.isPlaying() is false before the tween starts', () => {
		const t = new TWEEN.Tween({x: 0}).to({x: 1}, 100)

		expect(t.isPlaying()).toBe(false)
	})

	test('tween.isPlaying() is true when a tween is started and before it ends', () => {
		const t = new TWEEN.Tween({x: 0}).to({x: 1}, 100)
		t.start(0)
		expect(t.isPlaying()).toBe(true)
	})

	test('tween.isPlaying() is false after a tween ends', () => {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({x: 0}, true).to({x: 1}, 100)
		t.start(0)
		TWEEN.update(150)
		expect(t.isPlaying()).toBe(false)
	})

	test('A zero-duration tween finishes at its starting time without an error.', () => {
		TWEEN.removeAll()

		const object = {x: 0}
		const t = new TWEEN.Tween(object, true).to({x: 1}, 0)
		t.start(0)
		TWEEN.update(0)

		expect(t.isPlaying()).toBe(false)
		expect(object.x).toBe(1)
	})
})

describe('custom TWEEN.Group', () => {
	test('Custom group.getAll()', () => {
		const group = new TWEEN.Group()
		expect(group.getAll()).toBeInstanceOf(Array)
	})

	test('Custom group.onComplete() should be triggered when all Tweens in the group have reached their completion, and the child Tween.onComplete() should also be fired', () => {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({x: 1}),
			t2 = new TWEEN.Tween({x: 1}),
			t3 = new TWEEN.Tween({x: 1}),
			group = new TWEEN.Group()
		let groupCounter = 0,
			childCounter = 0,
			childCounter2 = 0,
			childCounter3 = 0

		group.add(t)
		group.add(t2)
		group.add(t3)

		t.to({x: 2}, 1000)
		t2.to({x: 2}, 2000)
		t3.to({x: 2}, 3000)

		t.onComplete((): void => {
			childCounter++
		})
		t2.onComplete((): void => {
			childCounter2++
		})
		t3.onComplete((): void => {
			childCounter3++
		})
		group.onComplete((): void => {
			groupCounter++
		})

		t.start(0)
		t2.start(0)
		t3.start(0)

		group.update(0)
		expect(groupCounter).toEqual(0)
		expect(childCounter).toEqual(0)
		expect(childCounter2).toEqual(0)
		expect(childCounter3).toEqual(0)

		group.update(1000)
		expect(groupCounter).toEqual(0)
		expect(childCounter).toEqual(1)
		expect(childCounter2).toEqual(0)
		expect(childCounter3).toEqual(0)

		group.update(2000)
		expect(childCounter).toEqual(1)
		expect(groupCounter).toEqual(0)
		expect(childCounter2).toEqual(1)
		expect(childCounter3).toEqual(0)

		group.update(3000)
		expect(groupCounter).toEqual(1)
		expect(childCounter).toEqual(1)
		expect(childCounter2).toEqual(1)
		expect(childCounter3).toEqual(1)
	})

	test('Custom group stores tweens instead of global TWEEN group', () => {
		const group = new TWEEN.Group()

		const numGlobalTweensBefore = TWEEN.getAll().length
		const numGroupTweensBefore = group.getAll().length

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		globalTween.start()
		groupTweenA.start()
		groupTweenB.start()

		expect(TWEEN.getAll().length).toBe(numGlobalTweensBefore + 1)
		expect(group.getAll().length).toBe(numGroupTweensBefore + 2)
	})

	test("Custom group.removeAll() doesn't conflict with global TWEEN group", () => {
		const group = new TWEEN.Group()

		TWEEN.removeAll()
		group.removeAll()

		expect(TWEEN.getAll().length, 'No global tweens left').toBe(0)
		expect(group.getAll().length, 'No group tweens left').toBe(0)

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		globalTween.start()
		groupTweenA.start()
		groupTweenB.start()

		expect(TWEEN.getAll().length, 'One global tween has been added').toBe(1)
		expect(group.getAll().length, 'Two group tweens have been added').toBe(2)

		group.removeAll()

		expect(TWEEN.getAll().length, 'One global tween left').toBe(1)
		expect(group.getAll().length, 'No group tweens left').toBe(0)

		TWEEN.removeAll()

		expect(TWEEN.getAll().length, 'No global tweens left').toBe(0)
	})

	test("Global TWEEN.removeAll() doesn't conflict with custom group", () => {
		const group = new TWEEN.Group()

		TWEEN.removeAll()
		group.removeAll()

		expect(TWEEN.getAll().length, 'No global tweens left').toBe(0)
		expect(group.getAll().length, 'No group tweens left').toBe(0)

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		globalTween.start()
		groupTweenA.start()
		groupTweenB.start()

		expect(TWEEN.getAll().length, 'One global tween has been added').toBe(1)
		expect(group.getAll().length, 'Two group tweens have been added').toBe(2)

		TWEEN.removeAll()

		expect(TWEEN.getAll().length, 'No global tweens left').toBe(0)
		expect(group.getAll().length, 'Two group tweens left').toBe(2)

		group.removeAll()

		expect(group.getAll().length, 'No group tweens left').toBe(0)
	})

	test("Custom group.add() doesn't conflict with global TWEEN group, or vice versa", () => {
		const group = new TWEEN.Group()

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		TWEEN.add(globalTween)
		group.add(groupTweenA)
		group.add(groupTweenB)

		expect(TWEEN.getAll().length).toBe(1)
		expect(group.getAll().length).toBe(2)
	})

	test("Custom group.update() doesn't conflict with global TWEEN group", () => {
		const group = new TWEEN.Group()

		const startObj = {x: 1}
		const endObj = {x: 2}
		const duration = 1000

		const globalObj = {x: 1}
		new TWEEN.Tween(globalObj, true).to(endObj, duration).start(0)

		const groupObj = {x: 1}
		new TWEEN.Tween(groupObj, group).to(endObj, duration).start(0)

		group.update(duration)

		expect(globalObj).toEqual(startObj)
		expect(groupObj).toEqual(endObj)
	})

	test("Global TWEEN.update() doesn't conflict with custom group", () => {
		const group = new TWEEN.Group()

		const startObj = {x: 1}
		const endObj = {x: 2}
		const duration = 1000

		const globalObj = {x: 1}
		new TWEEN.Tween(globalObj, true).to(endObj, duration).start(0)

		const groupObj = {x: 1}
		new TWEEN.Tween(groupObj, group).to(endObj, duration).start(0)

		TWEEN.update(duration)

		expect(globalObj).toEqual(endObj)
		expect(groupObj).toEqual(startObj)
	})
})

describe('misc tween behaviour', () => {
	test('Ensure tweens work without any group', () => {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1000}, 1000)

		t.start(0)
		expect(obj.x).toBe(0)
		t.update(500)
		expect(obj.x).toBe(500)
		t.pause(600)
		expect(obj.x).toBe(500)
		t.update(750)
		expect(obj.x).toBe(500)
		t.resume(800)
		expect(obj.x).toBe(500)
		t.update(1000)
		expect(obj.x).toBe(800)
		t.update(1001)
		expect(obj.x).toBe(801)
		t.stop().end()
		expect(obj.x).toBe(1000)
	})

	test('Stopping a tween within an update callback will not cause an error.', () => {
		TWEEN.removeAll()

		const tweenA = new TWEEN.Tween({x: 1, y: 2}, true)
			.to({x: 3, y: 4}, 1000)
			.onUpdate((): void => {
				tweenB.stop()
			})
			.start(0)
		const tweenB = new TWEEN.Tween({x: 5, y: 6}, true)
			.to({x: 7, y: 8})
			.onUpdate((): void => {
				tweenA.stop()
			})
			.start(0)

		let success = true

		try {
			TWEEN.update(500)
		} catch {
			success = false
		} finally {
			expect(success).toBe(true)
		}
	})
})

describe('duration and group setters', () => {
	test('Set the duration with .duration', () => {
		const obj = {x: 1}
		const t = new TWEEN.Tween(obj).to({x: 2}).duration(1000).start(0)

		t.update(1000)

		expect(obj.x).toEqual(2)
	})

	test('Get the duration with .getDuration', () => {
		const obj = {x: 1}
		const t = new TWEEN.Tween(obj).to({x: 2}).duration(100)

		expect(t.getDuration()).toEqual(100)
	})

	test("Tween.group sets the tween's group.", () => {
		const group = new TWEEN.Group()

		const groupTweenA = new TWEEN.Tween({}).group(group)

		groupTweenA.start()

		expect(group.getAll().length).toBe(1)
	})
})

describe('pause and resume', () => {
	test('Test TWEEN.Tween.pause() and TWEEN.Tween.resume()', () => {
		TWEEN.removeAll()

		const obj = {x: 0.0},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 1.0}, 1000)

		expect(TWEEN.getAll().length).toBe(1)

		t.start(0)
		expect(t.isPaused()).toBe(false)

		TWEEN.update(400)
		expect(obj.x).toBe(0.4)

		t.pause(450)
		expect(t.isPaused()).toBe(true)
		expect(TWEEN.getAll().length).toBe(1)
		expect(obj.x).toBe(0.4)

		TWEEN.update(900)
		expect(obj.x).toBe(0.4)

		TWEEN.update(3000)
		expect(obj.x).toBe(0.4)

		t.resume(3200)
		// values do not change until an update
		expect(obj.x).toBe(0.4)
		expect(TWEEN.getAll().length).toBe(1)
		expect(t.isPaused()).toBe(false)

		TWEEN.update(3500)
		expect(obj.x).toBe(0.75)

		TWEEN.update(5000)
		expect(obj.x).toBe(1.0)
	})

	test('Test TWEEN.Tween.pause() and TWEEN.Tween.resume(), without groups', () => {
		const obj = {x: 0.0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1.0}, 1000)

		t.start(0)
		expect(t.isPaused()).toBe(false)

		t.update(400)
		expect(obj.x).toBe(0.4)

		t.pause(450)
		expect(t.isPaused()).toBe(true)
		expect(obj.x).toBe(0.4)

		t.update(900)
		expect(obj.x).toBe(0.4)

		t.update(3000)
		expect(obj.x).toBe(0.4)

		t.resume(3200)
		// values do not change until an update
		expect(obj.x).toBe(0.4)
		expect(t.isPaused()).toBe(false)

		t.update(3500)
		expect(obj.x).toBe(0.75)

		t.update(5000)
		expect(obj.x).toBe(1.0)
	})
})

describe('arrays passed to to()', () => {
	test('Arrays in the object passed to to() are not modified by start() if dynamic is false.', () => {
		const start = {x: 10, y: 20, z: 30}
		const end = {x: 100, y: 200, z: ['+10', '-10']}
		const valuesArray = end.z
		new TWEEN.Tween(start).to(end).start()
		expect(valuesArray).toBe(end.z)
		expect(end.z.length).toBe(2)
		expect(end.z[0]).toBe('+10')
		expect(end.z[1]).toBe('-10')
	})

	test('Arrays in the object passed to to() are modified by start() if dynamic is true.', () => {
		const start = {x: 10, y: 20, z: 30}
		// start() rewrites the interpolation array in place, replacing the relative
		// strings with the absolute numbers they resolve to.
		const end: {x: number; y: number; z: (string | number)[]} = {x: 100, y: 200, z: ['+10', '-10']}
		const valuesArray = end.z
		expect(end.z.length).toBe(2)
		new TWEEN.Tween(start).to(end).dynamic(true).start()
		expect(valuesArray).not.toBe(end.z)
		expect(end.z.length).toBe(3)
		expect(end.z[0]).toBe(30)
		expect(end.z[1]).toBe(40)
		expect(end.z[2]).toBe(20)
	})

	test('Arrays in the object passed to to() are not modified by start() if they are not interpolation arrays, regardless of dynamic.', () => {
		// biome-ignore lint/suspicious/noExplicitAny: the test intentionally mixes incompatible start/end shapes
		function testWithDynamic(start: any, end: any, dynamic: boolean): void {
			// const start = {x: 10, y: 20, z: [1, 2]}
			// const end = {x: 100, y: 200, z: ['a', 'b']}
			const valuesArray = end.z
			new TWEEN.Tween(start).to(end).dynamic(dynamic).start()
			expect(valuesArray).toBe(end.z)
			expect(end.z.length).toBe(2)
			expect(end.z[0]).toBe('a')
			expect(end.z[1]).toBe('b')
		}

		testWithDynamic({x: 10, y: 20, z: [1, 2]}, {x: 100, y: 200, z: ['a', 'b']}, true)
		testWithDynamic({x: 10, y: 20, z: [1, 2]}, {x: 100, y: 200, z: ['a', 'b']}, false)
		testWithDynamic({x: 10, y: 20, z: 30}, {x: 100, y: 200, z: ['a', 'b']}, true)
		testWithDynamic({x: 10, y: 20, z: 30}, {x: 100, y: 200, z: ['a', 'b']}, false)
	})
})

describe('nested objects', () => {
	test('Tween.js animate nested object', () => {
		TWEEN.removeAll()

		const obj = {scale: {x: 0}, alpha: 0}

		const t = new TWEEN.Tween(obj, true).to({scale: {x: 100}, alpha: 100}, 100)
		t.start(0)

		expect(obj.scale.x).toBe(0)

		TWEEN.update(37)
		expect(obj.scale.x).toBe(37)
		expect(obj.alpha).toBe(37)

		TWEEN.update(100)
		expect(obj.scale.x).toBe(100)
		expect(obj.alpha).toBe(100)

		TWEEN.update(115)
		expect(obj.scale.x).toBe(100)
		expect(obj.alpha).toBe(100)
	})

	test('Tween.js animate nested object including relative value', () => {
		TWEEN.removeAll()

		const obj = {world: {hero: {scale: {x: 0}, x: 100}}, time: 0}

		const t = new TWEEN.Tween(obj, true).to({world: {hero: {scale: {x: 100}, x: '+100'}}, time: 100}, 100)
		t.start(0)

		expect(obj.world.hero.scale.x).toBe(0)

		TWEEN.update(37)
		expect(obj.world.hero.scale.x).toBe(37)
		expect(obj.world.hero.x).toBe(137)
		expect(obj.time).toBe(37)

		TWEEN.update(100)
		expect(obj.world.hero.scale.x).toBe(100)
		expect(obj.world.hero.x).toBe(200)
		expect(obj.time).toBe(100)

		TWEEN.update(115)
		expect(obj.world.hero.scale.x).toBe(100)
		expect(obj.world.hero.x).toBe(200)
		expect(obj.time).toBe(100)
	})

	test('Test TWEEN.Tween with nested objects', () => {
		TWEEN.removeAll()

		const obj = {x: 0.0, y: 100, some: {value: 0.0, style: {opacity: 1.0}}},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 1.0, y: 200, some: {value: 1.0, style: {opacity: 0.5}}}, 1000)

		expect(TWEEN.getAll().length).toBe(1)

		t.start(0)

		expect(TWEEN.getAll().length).toBe(1)
		expect(t.isPaused()).toBe(false)

		TWEEN.update(400)

		expect(obj.x).toBe(0.4)
		expect(obj.y).toBe(140)
		expect(obj.some.style.opacity).toBe(0.8)
		expect(obj.some.value).toBe(0.4)

		TWEEN.update(750)

		expect(obj.x).toBe(0.75)
		expect(obj.y).toBe(175)
		expect(obj.some.style.opacity).toBe(0.625)
		expect(obj.some.value).toBe(0.75)

		TWEEN.update(1000)

		expect(obj.x).toBe(1.0)
		expect(obj.y).toBe(200)
		expect(obj.some.style.opacity).toBe(0.5)
		expect(obj.some.value).toBe(1.0)
	})

	test('Test TWEEN.Tween.pause() and .resume() with nested objects', () => {
		TWEEN.removeAll()

		const obj = {x: 0.0, y: 100, some: {value: 0.0}},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 1.0, y: 200, some: {value: 1.0}}, 1000)

		expect(TWEEN.getAll().length).toBe(1)

		t.start(0)

		expect(TWEEN.getAll().length).toBe(1)
		expect(t.isPaused()).toBe(false)

		TWEEN.update(400)

		expect(obj.x).toBe(0.4)
		expect(obj.y).toBe(140)
		expect(obj.some.value).toBe(0.4)

		t.pause(450)

		expect(t.isPaused()).toBe(true)
		expect(TWEEN.getAll().length).toBe(1)
		expect(obj.x).toBe(0.4)
		expect(obj.y).toBe(140)
		expect(obj.some.value).toBe(0.4)

		TWEEN.update(900)

		expect(obj.x).toBe(0.4)
		expect(obj.y).toBe(140)
		expect(obj.some.value).toBe(0.4)

		TWEEN.update(3000)

		expect(obj.x).toBe(0.4)
		expect(obj.y).toBe(140)
		expect(obj.some.value).toBe(0.4)

		t.resume(3200)

		// values do not change until an update
		expect(obj.x).toBe(0.4)
		expect(obj.y).toBe(140)
		expect(obj.some.value).toBe(0.4)

		expect(TWEEN.getAll().length).toBe(1)
		expect(t.isPaused()).toBe(false)

		TWEEN.update(3500)

		expect(obj.x).toBe(0.75)
		expect(obj.y).toBe(175)
		expect(obj.some.value).toBe(0.75)

		TWEEN.update(5000)

		expect(obj.x).toBe(1.0)
		expect(obj.y).toBe(200)
		expect(obj.some.value).toBe(1.0)
	})
})

describe('Easing.generatePow()', () => {
	test('Test TWEEN.Easing.generatePow(1) equals Linear', () => {
		const ease1 = TWEEN.Easing.generatePow(1)

		const compareWithLinear = (ease: EasingFunctionGroup, amount: number) => {
			const linearResult = TWEEN.Easing.Linear.None(amount)
			expect(linearResult).toBe(ease.In(amount))
			expect(linearResult).toBe(ease.Out(amount))
			expect(linearResult).toBe(ease.InOut(amount))
		}
		compareWithLinear(ease1, 0)
		compareWithLinear(ease1, 0.25)
		compareWithLinear(ease1, 0.5)
		compareWithLinear(ease1, 0.75)
		compareWithLinear(ease1, 1)
		compareWithLinear(ease1, -1)
		compareWithLinear(ease1, Infinity)
	})

	test('Test TWEEN.Easing.generatePow(n) should pass 0.0, 0.5, 1.0', () => {
		const checkEdgeValue = (ease: EasingFunctionGroup) => {
			expect(ease.InOut(0.0)).toBe(0.0)
			expect(ease.In(0.0)).toBe(0.0)
			expect(ease.Out(0.0)).toBe(0.0)

			expect(ease.InOut(0.5)).toBe(0.5)

			expect(ease.InOut(1.0)).toBe(1.0)
			expect(ease.In(1.0)).toBe(1.0)
			expect(ease.Out(1.0)).toBe(1.0)
		}
		checkEdgeValue(TWEEN.Easing.generatePow(Number.NEGATIVE_INFINITY))
		checkEdgeValue(TWEEN.Easing.generatePow(-1.0))
		checkEdgeValue(TWEEN.Easing.generatePow(1))
		checkEdgeValue(TWEEN.Easing.generatePow(Math.LOG2E))
		checkEdgeValue(TWEEN.Easing.generatePow(Math.PI))
		checkEdgeValue(TWEEN.Easing.generatePow())
		checkEdgeValue(TWEEN.Easing.generatePow(6))
		checkEdgeValue(TWEEN.Easing.generatePow(Number.POSITIVE_INFINITY))
	})
})

describe('dynamic to() targets', () => {
	test("Test TWEEN.to(ends) shouldn't grow endless on ends value", () => {
		TWEEN.removeAll()

		const target = {y: 0}
		const ends = {y: [100, 200]}
		const tween = new TWEEN.Tween(target, true).to(ends, 1000)

		tween.stop().start(0)
		tween.stop().start(0)

		TWEEN.update(250)
		expect(target.y).toBe(50)
	})

	test('Test TWEEN.Tween.to() with a dynamic target provided as object', () => {
		TWEEN.removeAll()

		const dynamicTargetValue = {x: 5}
		const chasingValue = {x: 0}
		const duration = 1000 // must be even
		const t1 = new TWEEN.Tween(dynamicTargetValue, true).to({x: 10}, duration),
			t2 = new TWEEN.Tween(chasingValue, true).to(dynamicTargetValue, duration).dynamic(true)

		expect(TWEEN.getAll().length).toBe(2)

		t1.start(0)
		t2.start(0)
		expect(chasingValue).not.toEqual(dynamicTargetValue)

		TWEEN.update(duration / 2, true)
		expect(chasingValue).not.toEqual(dynamicTargetValue)

		TWEEN.update(duration, true)
		expect(chasingValue).toEqual(dynamicTargetValue)
	})

	test('Test TWEEN.Tween.to() with a dynamic target provided as array', () => {
		TWEEN.removeAll()

		const dynamicTargetValue = [5]
		const chasingValue = [0]
		const duration = 1000 // must be even
		const t1 = new TWEEN.Tween(dynamicTargetValue, true).to([10], duration),
			t2 = new TWEEN.Tween(chasingValue, true).to(dynamicTargetValue, duration).dynamic(true)

		expect(TWEEN.getAll().length).toBe(2)

		t1.start(0)
		t2.start(0)
		expect(chasingValue).not.toEqual(dynamicTargetValue)

		TWEEN.update(duration / 2, true)
		expect(chasingValue).not.toEqual(dynamicTargetValue)

		TWEEN.update(duration, true)
		expect(chasingValue).toEqual(dynamicTargetValue)
	})

	test('Test TWEEN.Tween.to() with multiple dynamic targets provided as array', () => {
		TWEEN.removeAll()

		const dynamicTargetValues = {x: [4, 10, 12, 20]}
		const chasingValue = {x: 0}
		const duration = 1000 // must be even
		const tweens = []

		const observedValues = []
		for (let i = 0; i < dynamicTargetValues.x.length; i++) {
			const initialValue = {x: 0}
			observedValues.push(initialValue)
			tweens.push(
				new TWEEN.Tween(initialValue, true).to({x: dynamicTargetValues.x[i]}, duration).onUpdate(object => {
					// TODO the fact that we need `index + 1` instead of just
					// `index` here is confusing. It is because Tween adds an
					// axtra start value at the beginning of the array. Update
					// Tween so it does not add the start value to the array,
					// and instead reads it from _valuesStart.
					dynamicTargetValues.x[i + 1] = object.x
				}),
			)
		}

		const t = new TWEEN.Tween(chasingValue, true).to(dynamicTargetValues, duration).dynamic(true)

		expect(TWEEN.getAll().length).toBe(5)

		tweens.forEach(tween => {
			tween.start(0)
		})
		t.start(0)

		expect(TWEEN.getAll().length).toBe(tweens.length + 1)

		for (let i = 0; i < tweens.length; i++) {
			const progress = ((i + 1) * duration) / tweens.length
			TWEEN.update(progress, true)
			expect(chasingValue.x).toBe(observedValues[i].x)
		}
	})
})

describe('Tween.update() with no arguments', () => {
	test('Test TWEEN.Tween.update() with no arguments', () => {
		patchPerformanceNow()

		const targetNow = {x: 0.0}
		const targetTime = {x: 0.0}

		const tweenNow = new TWEEN.Tween(targetNow).to({x: 1.0}).start()
		const tweenTime = new TWEEN.Tween(targetTime).to({x: 1.0}).start(0)

		const tick = (time: number) => {
			tickTime(time)
			tweenNow.update()
			tweenTime.update(time)
			expect(targetNow.x).toBe(targetTime.x)
		}

		tick(0)
		tick(16)
		tick(16.66)
		tick(100)
		tick(20000)

		restorePerformanceNow()
	})
})

// TODO test that starting and stopping a tween multiple times doesn't cause
// interpolation arrays to modified yet again (and similar with other
// initialization items). Initialization should happen only once, on first
// start.

// TODO test onRepeat
