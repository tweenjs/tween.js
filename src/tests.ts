import {tickTime, patchPerformanceNow, restorePerformanceNow} from './test-performance-now-fake'
import * as TWEEN from './Index'
import type {EasingFunctionGroup} from './Easing'

export const tests = {
	hello(test: Test): void {
		test.ok(TWEEN !== null)
		test.done()
	},

	// TWEEN tests
	'TWEEN.getAll'(test: Test): void {
		test.ok(TWEEN.getAll() instanceof Array)
		test.done()
	},

	'TWEEN object stores tweens automatically on start'(test: Test): void {
		const numTweensBefore = TWEEN.getAll().length,
			t = new TWEEN.Tween({}, true)

		t.start()

		const numTweensAfter = TWEEN.getAll().length

		test.equal(numTweensBefore + 1, numTweensAfter)
		test.done()
	},

	'TWEEN.removeAll()'(test: Test): void {
		const t = new TWEEN.Tween({}, true)

		TWEEN.removeAll()

		test.equal(TWEEN.getAll().length, 0, 'No tweens left')

		t.start()

		test.equal(TWEEN.getAll().length, 0, 'Tweens are not automatically added/removed')

		TWEEN.add(t)

		test.equal(TWEEN.getAll().length, 1, 'A tween has to be manually added')

		TWEEN.removeAll()

		test.equal(TWEEN.getAll().length, 0, 'No tweens left')
		test.done()
	},

	'TWEEN.add()'(test: Test): void {
		const all = TWEEN.getAll(),
			numTweens = all.length,
			t = new TWEEN.Tween({}, true)

		TWEEN.add(t)

		test.equal(numTweens + 1, TWEEN.getAll().length)

		test.done()
	},

	'TWEEN.remove()'(test: Test): void {
		const all = TWEEN.getAll(),
			numTweens = all.length,
			t = new TWEEN.Tween({}, true)

		TWEEN.add(t)

		test.ok(TWEEN.getAll().indexOf(t) != -1)

		TWEEN.remove(t)

		test.equal(numTweens, TWEEN.getAll().length)
		test.equal(TWEEN.getAll().indexOf(t), -1)
		test.done()
	},

	'TWEEN.update() removes tweens when they are finished only if preserve is set to false'(test: Test): void {
		TWEEN.removeAll()

		const t1 = new TWEEN.Tween({}, true).to({}, 1000),
			t2 = new TWEEN.Tween({}, true).to({}, 2000)

		test.equal(TWEEN.getAll().length, 2)

		t1.start(0)
		t2.start(0)

		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(0, false)
		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(999, false)
		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(1000, false)
		test.equal(TWEEN.getAll().length, 1)
		test.equal(TWEEN.getAll().indexOf(t1), -1)
		test.ok(TWEEN.getAll().indexOf(t2) != -1)
		test.done()
	},
	'TWEEN.update() does not remove tweens when they are finished with preserve true (default)'(test: Test): void {
		TWEEN.removeAll()

		const t1 = new TWEEN.Tween({}, true).to({}, 1000),
			t2 = new TWEEN.Tween({}, true).to({}, 2000)

		test.equal(TWEEN.getAll().length, 2)

		t1.start(0)
		t2.start(0)

		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(0)
		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(999)
		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(1000)
		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(1001)
		test.equal(TWEEN.getAll().length, 2)
		test.ok(TWEEN.getAll().indexOf(t1) != -1)
		test.ok(TWEEN.getAll().indexOf(t2) != -1)
		test.done()
	},

	'Unremoved tweens which have been updated past their finish time may go backward in time'(test: Test): void {
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

		test.equal(TWEEN.getAll().length, 2)

		// If you want to go backward in time, start back at the beginning
		// first, then go to any time between the start and end time.
		t1.start(0)
		t2.start(0)

		TWEEN.update(750, true)
		test.equal(target1.a, 0.75)
		test.equal(target2.b, 0.375)

		TWEEN.update(500)
		test.equal(target1.a, 0.5)
		test.equal(target2.b, 0.25)

		test.done()
	},

	// TWEEN.Tween tests

	constructor(test: Test): void {
		const t = new TWEEN.Tween({})

		test.ok(t instanceof TWEEN.Tween, 'Pass')
		test.done()
	},

	'Return the same tween instance for method chaining'(test: Test): void {
		const t = new TWEEN.Tween({})

		test.ok(t.to({}, 0) instanceof TWEEN.Tween)
		test.equal(t.to({}, 0), t)

		test.ok(t.start() instanceof TWEEN.Tween)
		test.equal(t.start(), t)

		test.ok(t.stop() instanceof TWEEN.Tween)
		test.equal(t.stop(), t)

		test.ok(t.delay() instanceof TWEEN.Tween)
		test.equal(t.delay(), t)

		test.ok(t.easing() instanceof TWEEN.Tween)
		test.equal(t.easing(), t)

		test.ok(t.interpolation() instanceof TWEEN.Tween)
		test.equal(t.interpolation(), t)

		test.ok(t.chain() instanceof TWEEN.Tween)
		test.equal(t.chain(), t)

		test.ok(t.onStart() instanceof TWEEN.Tween)
		test.equal(t.onStart(), t)

		test.ok(t.onEveryStart() instanceof TWEEN.Tween)
		test.equal(t.onEveryStart(), t)

		test.ok(t.onStop() instanceof TWEEN.Tween)
		test.equal(t.onStop(), t)

		test.ok(t.onUpdate() instanceof TWEEN.Tween)
		test.equal(t.onUpdate(), t)

		test.ok(t.onComplete() instanceof TWEEN.Tween)
		test.equal(t.onComplete(), t)

		test.ok(t.duration() instanceof TWEEN.Tween)
		test.equal(t.duration(), t)

		test.ok(t.group() instanceof TWEEN.Tween)
		test.equal(t.group(), t)

		test.done()
	},

	'Tween existing property'(test: Test): void {
		const obj = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		test.deepEqual(obj.x, 2)
		test.done()
	},

	'Tween non-existing property'(test: Test): void {
		const obj = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({y: 0}, 1000)
		t.start(0)
		t.update(1000)

		test.deepEqual(obj.x, 1)
		// eslint-disable-next-line
		// @ts-ignore
		test.equal(obj.y, undefined)
		test.done()
	},

	'Tween non-null property'(test: Test): void {
		const obj = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		test.deepEqual(obj.x, 2)
		test.ok(obj.x !== null)
		test.done()
	},

	'Tween function property'(test: Test): void {
		const my_function = new Function()

		const obj = {x: my_function},
			t = new TWEEN.Tween(obj)

		t.to({x: my_function})
		t.start(0)
		t.update(1000)

		test.ok(obj.x === my_function)
		test.done()
	},

	'Tween boolean property'(test: Test): void {
		const obj = {x: true},
			t = new TWEEN.Tween(obj)

		t.to({x: new Function()})
		t.start(0)
		t.update(1000)

		test.ok(typeof obj.x === 'boolean')
		test.ok(obj.x === true)
		test.done()
	},

	'Tween null property'(test: Test): void {
		const obj = {x: null},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		test.deepEqual(obj.x, 2)
		test.done()
	},

	'Tween undefined property'(test: Test): void {
		const obj = {},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.start(0)
		t.update(1000)

		// eslint-disable-next-line
		// @ts-ignore
		test.equal(obj.x, undefined)
		test.done()
	},

	'Tween relative positive value'(test: Test): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '+100'}, 1000)
		t.start(0)
		t.update(1000)

		test.equal(obj.x, 100)
		test.done()
	},

	'Tween relative negative value'(test: Test): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '-100'}, 1000)
		t.start(0)
		t.update(1000)

		test.equal(obj.x, -100)
		test.done()
	},

	'String values without a + or - sign should not be interpreted as relative'(test: Test): void {
		const obj = {x: 100},
			t = new TWEEN.Tween(obj)

		t.to({x: '100'}, 1000)
		t.start(0)
		t.update(1000)

		test.equal(obj.x, 100)
		test.done()
	},

	'Tween relative positive value, with yoyo'(test: Test): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '+100'}, 1000)
		t.repeat(1)
		t.yoyo(true)
		t.start(0)

		t.update(500)
		test.equal(obj.x, 50)
		t.update(1000)
		test.equal(obj.x, 100)
		t.update(1500)
		test.equal(obj.x, 50)
		t.update(2000)
		test.equal(obj.x, 0)

		test.done()
	},

	'Tween relative negative value, with yoyo'(test: Test): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: '-100'}, 1000)
		t.repeat(1)
		t.yoyo(true)
		t.start(0)

		t.update(500)
		test.equal(obj.x, -50)
		t.update(1000)
		test.equal(obj.x, -100)
		t.update(1500)
		test.equal(obj.x, -50)
		t.update(2000)
		test.equal(obj.x, -0)

		test.done()
	},

	'Tween relative positive array interpolation values'(test: Test): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: ['+100', '+0', '-100', '+0']}, 2000)
		t.start(0)

		t.update(250)
		test.equal(obj.x, 50)
		t.update(500)
		test.equal(obj.x, 100)
		t.update(750)
		test.equal(obj.x, 50)
		t.update(1000)
		test.equal(obj.x, 0)
		t.update(1250)
		test.equal(obj.x, -50)
		t.update(1500)
		test.equal(obj.x, -100)
		t.update(1750)
		test.equal(obj.x, -50)
		t.update(2000)
		test.equal(obj.x, 0)

		test.done()
	},

	'String values without a + or - sign should not be interpreted as relative with array interpolation values'(
		test: Test,
	): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: ['100', '0', '100', '0']}, 2000)
		t.start(0)

		t.update(250)
		test.equal(obj.x, 50)
		t.update(500)
		test.equal(obj.x, 100)
		t.update(750)
		test.equal(obj.x, 50)
		t.update(1000)
		test.equal(obj.x, 0)
		t.update(1250)
		test.equal(obj.x, 50)
		t.update(1500)
		test.equal(obj.x, 100)
		t.update(1750)
		test.equal(obj.x, 50)
		t.update(2000)
		test.equal(obj.x, 0)

		test.done()
	},

	'animate values in an array'(test: Test): void {
		const obj = [0, 0, 0],
			t = new TWEEN.Tween(obj)

		t.to([1000, '-2000', '+2000'], 1000)
		t.start(0)

		t.update(250)
		test.equal(obj[0], 250)
		test.equal(obj[1], -500)
		test.equal(obj[2], 500)
		t.update(500)
		test.equal(obj[0], 500)
		test.equal(obj[1], -1000)
		test.equal(obj[2], 1000)
		t.update(750)
		test.equal(obj[0], 750)
		test.equal(obj[1], -1500)
		test.equal(obj[2], 1500)
		t.update(1000)
		test.equal(obj[0], 1000)
		test.equal(obj[1], -2000)
		test.equal(obj[2], 2000)

		test.done()
	},

	'animate values in a nested array'(test: Test): void {
		const obj = {a: [0, 0, 0]},
			t = new TWEEN.Tween(obj)

		t.to({a: [1000, '-2000', '+2000']}, 1000)
		t.start(0)

		t.update(250)
		test.equal(obj.a[0], 250)
		test.equal(obj.a[1], -500)
		test.equal(obj.a[2], 500)
		t.update(500)
		test.equal(obj.a[0], 500)
		test.equal(obj.a[1], -1000)
		test.equal(obj.a[2], 1000)
		t.update(750)
		test.equal(obj.a[0], 750)
		test.equal(obj.a[1], -1500)
		test.equal(obj.a[2], 1500)
		t.update(1000)
		test.equal(obj.a[0], 1000)
		test.equal(obj.a[1], -2000)
		test.equal(obj.a[2], 2000)

		test.done()
	},

	'Test TWEEN.Tween.start()'(test: Test): void {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)

		t.to({}, 1000)

		test.equal(TWEEN.getAll().length, 1)

		t.start(0)

		test.equal(TWEEN.getAll().length, 1)
		test.done()
	},

	'Ensure tweens start without calling start() method.'(test: Test): void {
		TWEEN.Tween.autoStartOnUpdate = true

		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1000}, 1000)
		let started = false
		t.onStart(() => (started = true))
		t.onComplete(() => (started = false))

		t.update(0)
		test.deepEqual(started, true)
		test.deepEqual(obj.x, 0)
		t.update(500)
		test.deepEqual(started, true)
		test.deepEqual(obj.x, 500)
		t.update(1000)
		test.deepEqual(obj.x, 1000)
		test.deepEqual(started, false)

		TWEEN.Tween.autoStartOnUpdate = false

		test.done()
	},

	'Test Tween.to() tweening towards a dynamic object'(test: Test): void {
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
		test.equal(rabbit.x, 1000)
		test.equal(rabbit.y, 200)
		test.equal(fox.x, 200)
		test.equal(fox.y, 40)
		tr.update(500)
		tf.update(500)
		test.equal(rabbit.x, 1000)
		test.equal(rabbit.y, 500)
		test.equal(fox.x, 500)
		test.equal(fox.y, 250)
		tr.update(800)
		tf.update(800)
		test.equal(rabbit.x, 1000)
		test.equal(rabbit.y, 800)
		test.equal(fox.x, 800)
		test.equal(fox.y, 640)
		tr.update(1000)
		tf.update(1000)
		test.equal(rabbit.x, 1000)
		test.equal(rabbit.y, 1000)
		test.equal(fox.x, 1000)
		test.equal(fox.y, 1000)

		test.done()
	},

	'Test TWEEN.Tween.stop()'(test: Test): void {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 2}, 1000)

		t.start()
		test.equal(TWEEN.getAll().length, 1)

		t.stop()
		test.equal(TWEEN.getAll().length, 1)
		test.done()
	},

	'Test TWEEN.Tween.delay()'(test: Test): void {
		const obj = {x: 1},
			t = new TWEEN.Tween(obj)

		t.to({x: 2}, 1000)
		t.delay(500)
		t.start(0)

		t.update(100)

		test.deepEqual(obj.x, 1, "Tween hasn't started yet")

		t.update(1000)

		test.ok(obj.x !== 1 && obj.x !== 2, "Tween has started but hasn't finished yet")

		t.update(1500)

		test.equal(obj.x, 2, 'Tween finishes when expected')
		test.done()
	},

	// TODO: not really sure how to test this. Advice appreciated!
	'Test TWEEN.Tween.easing()'(test: Test): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1}, 1000)

		t.easing(TWEEN.Easing.Quadratic.In)
		t.start(0)
		t.update(500)
		test.equal(obj.x, TWEEN.Easing.Quadratic.In(0.5))
		test.done()
	},

	'Test TWEEN.Tween.EasingFunctionGroup should be frozen'(test: Test): void {
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
			test.throws(throwsWithReassigned)
			test.equal(easingGroup.In(0.0), 0.0)
			test.equal(easingGroup.Out(0.0), 0.0)
			test.equal(easingGroup.InOut(0.0), 0.0)
			test.equal(easingGroup.In(1.0), 1.0)
			test.equal(easingGroup.Out(1.0), 1.0)
			test.equal(easingGroup.InOut(1.0), 1.0)
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

		test.done()
	},

	'Test TWEEN.Easing should starts at 0.0, ends at 1.0. TWEEN.Easing.InOut() should be 0.5 at midpoint'(
		test: Test,
	): void {
		const checkEdgeValue = (ease: EasingFunctionGroup) => {
			test.equal(ease.In(0.0), 0.0)
			test.equal(ease.Out(0.0), 0.0)
			test.equal(ease.InOut(0.0), 0.0)

			test.equal(ease.In(1.0), 1.0)
			test.equal(ease.Out(1.0), 1.0)
			test.equal(ease.InOut(1.0), 1.0)

			test.equal(ease.InOut(0.5), 0.5)
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
		test.done()
	},

	'Test TWEEN.Easing should pass a specific value'(test: Test): void {
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
			expect: number,
			numDigits = 14,
			amount = Math.LOG10E,
		) => {
			toBeCloseTo(test, easeFunc(amount), expect, numDigits)
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
		test.done()
	},

	'Test TWEEN.interpolation should starts at values[0], ends at values[values.length-1].'(test: Test): void {
		const generateArray = (): number[] => {
			return [0, Math.PI, Math.SQRT2, Math.E]
		}

		const checkStartAndEnd = (interpolation: (v: number[], k: number) => number, values: number[]) => {
			const originalValue = values.concat()
			test.equal(interpolation(values, 0.0), originalValue[0])
			test.equal(interpolation(values, 1.0), originalValue[originalValue.length - 1])
			test.deepEqual(originalValue, values)
		}

		const Interpolations = [TWEEN.Interpolation.Linear, TWEEN.Interpolation.Bezier, TWEEN.Interpolation.CatmullRom]
		Interpolations.forEach(func => {
			checkStartAndEnd(func, generateArray())
		})
		test.done()
	},

	'Test TWEEN.interpolation.Bezier should return a value equal to Linear if there are two values.'(test: Test): void {
		const compareToLinear = (k: number) => {
			const Interpolation = TWEEN.Interpolation
			const values = [0, Math.E]
			test.equal(Interpolation.Bezier(values, k), Interpolation.Linear(values, k))
		}

		compareToLinear(0.0)
		compareToLinear(0.5)
		compareToLinear(1.0)
		compareToLinear(Math.LOG10E)
		compareToLinear(Math.LN2)
		test.done()
	},

	'Test TWEEN.interpolation should pass a specific value.'(test: Test): void {
		const generateArray = (): number[] => {
			return [0, Math.PI, Math.SQRT2, Math.E]
		}

		const testInterpolationPath = (
			interpolation: (v: number[], k: number) => number,
			values: number[],
			result: number,
		) => {
			toBeCloseTo(test, interpolation(values, Math.LOG10E), result, 14)
		}
		testInterpolationPath(TWEEN.Interpolation.Linear, generateArray(), 2.618398122395094)
		testInterpolationPath(TWEEN.Interpolation.Bezier, generateArray(), 1.985241172928958)
		testInterpolationPath(TWEEN.Interpolation.CatmullRom, generateArray(), 2.879802635590904)
		test.done()
	},

	'Test TWEEN.Tween.chain --with one tween'(test: Test): void {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({}, true),
			t2 = new TWEEN.Tween({}, true)
		let tStarted = false,
			tCompleted = false,
			t2Started = false

		t.to({}, 1000)
		t2.to({}, 1000)

		t.chain(t2)

		t.onStart(function (): void {
			tStarted = true
		})

		t.onComplete(function (): void {
			tCompleted = true
		})

		t2.onStart(function (): void {
			test.equal(tStarted, true)
			test.equal(tCompleted, true)
			test.equal(t2Started, false)
			t2Started = true
		})

		test.equal(tStarted, false)
		test.equal(t2Started, false)

		t.start(0)
		TWEEN.update(0)

		test.equal(tStarted, true)
		test.equal(t2Started, false)

		TWEEN.update(1000)

		test.equal(tCompleted, true)

		TWEEN.update(1001)

		test.equal(t2Started, true, 't2 is automatically started by t')
		test.done()
	},

	'Test TWEEN.Tween.chain --with several tweens in an array'(test: Test): void {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({}, true),
			chainedTweens: TWEEN.Tween<any>[] = [],
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

		test.equal(numChainedStarted, 0)

		t.start(0)
		TWEEN.update(0)
		TWEEN.update(1000)
		TWEEN.update(1001)

		test.equal(numChainedStarted, numChained, 'All chained tweens have been started')
		test.done()
	},

	'Test TWEEN.Tween.chain allows endless loops'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t1 = new TWEEN.Tween(obj, true).to({x: 100}, 1000),
			t2 = new TWEEN.Tween(obj, true).to({x: 0}, 1000)

		t1.chain(t2)
		t2.chain(t1)

		test.equal(obj.x, 0)

		// x == 0
		t1.start(0)
		TWEEN.update(0)

		test.equal(obj.x, 0)

		TWEEN.update(500)
		test.equal(obj.x, 50)

		// there... (x == 100)

		TWEEN.update(1000)
		test.equal(obj.x, 100)

		TWEEN.update(1500)
		test.equal(obj.x, 50)

		// ... and back again (x == 0)

		TWEEN.update(2000)
		test.equal(obj.x, 0)

		TWEEN.update(2500)
		test.equal(obj.x, 50)

		TWEEN.update(3000)
		test.equal(obj.x, 100) // and x == 100 again

		// Repeat the same test but with the tweens added in the
		// opposite order.
		const obj2 = {x: 0}
		const t3 = new TWEEN.Tween(obj2, true).to({x: 200}, 1000)
		const t4 = new TWEEN.Tween(obj2, true).to({x: 100}, 1000)

		t4.chain(t3)
		t3.chain(t4)

		test.equal(obj2.x, 0)

		t4.start(0)

		TWEEN.update(0)
		test.equal(obj2.x, 0)

		TWEEN.update(500)
		test.equal(obj2.x, 50)

		TWEEN.update(1000)
		test.equal(obj2.x, 100)

		TWEEN.update(1500)
		test.equal(obj2.x, 150)

		TWEEN.update(2000)
		test.equal(obj2.x, 0)

		TWEEN.update(2500)
		test.equal(obj2.x, 50)

		TWEEN.update(3000)
		test.equal(obj2.x, 100)

		TWEEN.update(3500)
		test.equal(obj2.x, 150)

		TWEEN.update(4000)
		test.equal(obj2.x, 0)

		TWEEN.update(4500)
		test.equal(obj2.x, 50)

		test.done()
	},

	'Test TWEEN.Tween.startFromCurrentValues'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100})

		test.equal(obj.x, 0)

		// x == 0
		t.start(0)
		TWEEN.update(0)

		test.equal(obj.x, 0)

		TWEEN.update(1500)
		test.equal(obj.x, 100)

		obj.x = 200

		t.startFromCurrentValues(0)

		TWEEN.update(0)
		test.equal(obj.x, 200)

		TWEEN.update(500)
		test.equal(obj.x, 150)

		TWEEN.update(1000)
		test.equal(obj.x, 100)

		test.done()
	},

	'Test TWEEN.Tween.onStart'(test: Test): void {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onStart(function (): void {
			test.ok(true, 'onStart callback is called')
			counter++
		})

		test.deepEqual(counter, 0)

		t.start(0)
		TWEEN.update(0)

		test.deepEqual(counter, 1)

		TWEEN.update(500)

		test.deepEqual(counter, 1, 'onStart callback is not called again')
		test.done()
	},

	'Test TWEEN.Tween.onEveryStart'(test: Test): void {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 500)
		t.delay(500)
		t.repeat(Infinity)
		t.onEveryStart(function (): void {
			counter++
		})

		test.deepEqual(counter, 0)

		t.start(0)
		TWEEN.update(0)
		test.deepEqual(counter, 0, 'onEveryStart callback not called before delayed start')

		TWEEN.update(500)
		test.deepEqual(counter, 1, 'onEveryStart callback called at delayed start')

		TWEEN.update(1000)
		test.deepEqual(counter, 1, 'onEveryStart callback not called before delayed repeat start')

		TWEEN.update(1500)
		test.deepEqual(counter, 2, 'onEveryStart callback called at delayed repeat start')

		test.done()
	},

	'Test TWEEN.Tween.onStop'(test: Test): void {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onStop(function (): void {
			test.ok(true, 'onStop callback is called')
			counter++
		})

		test.deepEqual(counter, 0)

		t.stop()
		TWEEN.update(0)

		test.deepEqual(counter, 0, "onStop callback not called when the tween hasn't started yet")

		t.start(0)
		TWEEN.update(0)
		t.stop()

		test.deepEqual(counter, 1, 'onStop callback is called if the tween has been started already and stop is invoked')

		TWEEN.update(500)
		t.stop()

		test.deepEqual(counter, 1, 'onStop callback is not called again once the tween is stopped')
		test.done()
	},

	'Test TWEEN.Tween.onUpdate'(test: Test): void {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onUpdate(function (): void {
			counter++
		})

		test.deepEqual(counter, 0)

		t.start(0)

		TWEEN.update(0)
		test.deepEqual(counter, 1)

		TWEEN.update(500)
		test.deepEqual(counter, 2)

		TWEEN.update(600)
		test.deepEqual(counter, 3)

		TWEEN.update(1000)
		test.deepEqual(counter, 4)

		TWEEN.update(1500)
		test.deepEqual(counter, 4, 'onUpdate callback should not be called after the tween has finished')

		test.done()
	},

	'Test TWEEN.Tween.onComplete'(test: Test): void {
		TWEEN.removeAll()

		const obj = {},
			t = new TWEEN.Tween(obj, true)
		let counter = 0

		t.to({x: 2}, 1000)
		t.onComplete(function (): void {
			counter++
		})

		test.deepEqual(counter, 0)

		t.start(0)

		TWEEN.update(0)
		test.deepEqual(counter, 0)

		TWEEN.update(500)
		test.deepEqual(counter, 0)

		TWEEN.update(600)
		test.deepEqual(counter, 0)

		TWEEN.update(1000)
		test.deepEqual(counter, 1)

		TWEEN.update(1500)
		test.deepEqual(counter, 1, 'onComplete callback must be called only once')
		test.done()
	},

	'TWEEN.Tween does not repeat by default'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(50)
		test.equal(obj.x, 50)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(150)
		test.equal(obj.x, 100)
		test.done()
	},

	'Test single repeat happens only once'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(50)
		test.equal(obj.x, 50)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(150)
		test.equal(obj.x, 50)

		TWEEN.update(200)
		test.equal(obj.x, 100)
		test.done()
	},

	'Test Infinity repeat happens forever'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(50)
		test.equal(obj.x, 50)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(150)
		test.equal(obj.x, 50)

		TWEEN.update(200)
		test.equal(obj.x, 100)

		TWEEN.update(250)
		test.equal(obj.x, 50)
		test.done()
	},

	'Test tweening relatively with repeat'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0, y: 0},
			t = new TWEEN.Tween(obj, true).to({x: '+100', y: '-100'}, 100).repeat(1)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)
		test.equal(obj.y, 0)

		TWEEN.update(50)
		test.equal(obj.x, 50)
		test.equal(obj.y, -50)

		TWEEN.update(100)
		test.equal(obj.x, 100)
		test.equal(obj.y, -100)

		TWEEN.update(150)
		test.equal(obj.x, 150)
		test.equal(obj.y, -150)

		TWEEN.update(200)
		test.equal(obj.x, 200)
		test.equal(obj.y, -200)
		test.done()
	},

	'Test yoyo with repeat Infinity happens forever'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity).yoyo(true)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(25)
		test.equal(obj.x, 25)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(125)
		test.equal(obj.x, 75)

		TWEEN.update(200)
		test.equal(obj.x, 0)

		TWEEN.update(225)
		test.equal(obj.x, 25)
		test.done()
	},

	'Test yoyo with repeat 1 happens once'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).yoyo(true)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(25)
		test.equal(obj.x, 25)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(125)
		test.equal(obj.x, 75)

		TWEEN.update(200)
		test.equal(obj.x, 0)

		TWEEN.update(225)
		test.equal(obj.x, 0)
		test.done()
	},

	'Test yoyo works with arrays'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true)
				.to({x: [100, 200]}, 100)
				.repeat(1)
				.yoyo(true)

		t.start(0)

		TWEEN.update(50)
		test.equal(obj.x, 100)

		TWEEN.update(100)
		test.equal(obj.x, 200)

		TWEEN.update(150)
		test.equal(obj.x, 100)

		TWEEN.update(200)
		test.equal(obj.x, 0)

		test.done()
	},

	'Test yoyo can be stopped and restarted properly'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).yoyo(true)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(25)
		test.equal(obj.x, 25)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(125)
		test.equal(obj.x, 75)

		t.stop()
		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(25)
		test.equal(obj.x, 25)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(125)
		test.equal(obj.x, 75)

		TWEEN.update(200)
		test.equal(obj.x, 0)

		TWEEN.update(225)
		test.equal(obj.x, 0)

		test.done()
	},

	'Test TWEEN.Tween.stopChainedTweens()'(test: Test): void {
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

		t.onStart(function (): void {
			tStarted = true
		})

		t.onComplete(function (): void {
			tCompleted = true
		})

		t2.onStart(function (): void {
			test.equal(tStarted, true)
			test.equal(tCompleted, true)
			test.equal(t2Started, false)
			t2Started = true
		})

		test.equal(tStarted, false)
		test.equal(t2Started, false)

		t.start(0)
		TWEEN.update(1001)
		t.stop()

		test.equal(tStarted, true)
		test.equal(t2Started, false)
		test.equal(TWEEN.getAll().length, 2)

		TWEEN.update(1501)

		test.equal(t2Started, false)

		test.done()
	},

	'Test TWEEN.Tween.chain progressess into chained tweens'(test: Test): void {
		TWEEN.removeAll()

		const obj = {t: 1000}

		// 1000 of nothing
		const blank = new TWEEN.Tween({}, true).to({}, 1000)

		// tween obj.t from 1000 -> 2000 (in time with update time)
		const next = new TWEEN.Tween(obj, true).to({t: 2000}, 1000)

		blank.chain(next).start(0)

		TWEEN.update(1500)
		test.equal(obj.t, 1500)

		TWEEN.update(2000)
		test.equal(obj.t, 2000)

		test.done()
	},

	'Test that TWEEN.Tween.end sets the final values.'(test: Test): void {
		const object1 = {x: 0, y: -50, z: 1000}
		const target1 = {x: 50, y: 123, z: '+234'}

		const tween1 = new TWEEN.Tween(object1).to(target1, 1000)

		tween1.start()
		tween1.end()

		test.equal(object1.x, 50)
		test.equal(object1.y, 123)
		test.equal(object1.z, 1234)

		const object2 = {x: 0, y: -50, z: 1000}
		const target2 = {x: 50, y: 123, z: '+234'}

		const tween2 = new TWEEN.Tween(object2).to(target2, 1000)

		tween2.start(300)
		tween2.update(500)
		tween2.end()

		test.equal(object2.x, 50)
		test.equal(object2.y, 123)
		test.equal(object2.z, 1234)

		test.done()
	},

	'Test that TWEEN.Tween.end calls the onComplete callback of the tween.'(test: Test): void {
		test.expect(1)

		const tween1 = new TWEEN.Tween({}).to({}, 1000).onComplete(function (): void {
			test.ok(true)
		})

		tween1.start()
		tween1.end()

		test.done()
	},

	'Ensure Tween.end() works after stopping a tween.'(test: Test): void {
		const object = {x: 0, y: -50, z: 1000}
		const target = {x: 50, y: 123, z: '+234'}

		const tween = new TWEEN.Tween(object).to(target, 1000)

		tween.start(300)
		tween.update(500)
		tween.stop()
		tween.end()

		test.equal(object.x, 50)
		test.equal(object.y, 123)
		test.equal(object.z, 1234)

		test.done()
	},

	'Test delay adds delay before each repeat'(test: Test): void {
		// If repeatDelay isn't specified then delay is used since
		// that's the way it worked before repeatDelay was added.

		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).delay(100)

		t.start(0)

		TWEEN.update(100)
		test.equal(obj.x, 0)

		TWEEN.update(150)
		test.equal(obj.x, 50)

		TWEEN.update(200)
		test.equal(obj.x, 100)

		TWEEN.update(250)
		test.equal(obj.x, 100)

		TWEEN.update(300)
		test.equal(obj.x, 0)

		TWEEN.update(350)
		test.equal(obj.x, 50)

		TWEEN.update(400)
		test.equal(obj.x, 100)

		test.done()
	},

	'Test repeatDelay adds delay before each repeat'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(0)
		test.equal(obj.x, 0)

		TWEEN.update(50)
		test.equal(obj.x, 50)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(200)
		test.equal(obj.x, 100)

		TWEEN.update(300)
		test.equal(obj.x, 0)

		TWEEN.update(350)
		test.equal(obj.x, 50)

		TWEEN.update(400)
		test.equal(obj.x, 100)

		test.done()
	},

	'Test repeatDelay and delay can be used together'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).delay(100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(100)
		test.equal(obj.x, 0)

		TWEEN.update(150)
		test.equal(obj.x, 50)

		TWEEN.update(200)
		test.equal(obj.x, 100)

		TWEEN.update(300)
		test.equal(obj.x, 100)

		TWEEN.update(400)
		test.equal(obj.x, 0)

		TWEEN.update(450)
		test.equal(obj.x, 50)

		TWEEN.update(500)
		test.equal(obj.x, 100)

		test.done()
	},

	'TWEEN.Tween.onRepeat should not be called if repeat = 0 or default'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		test.equal(callbackCounter, 0)
		TWEEN.update(50)
		test.equal(callbackCounter, 0)
		TWEEN.update(100)
		test.equal(callbackCounter, 0)
		TWEEN.update(150)
		test.equal(callbackCounter, 0)
		test.ok(!t.isPlaying())

		test.done()
	},

	'TWEEN.Tween.onRepeat should be called once if repeat = 1'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		test.equal(callbackCounter, 0)
		TWEEN.update(50)
		test.equal(callbackCounter, 0)
		TWEEN.update(99.99999999)
		test.equal(callbackCounter, 0)
		TWEEN.update(100)
		test.equal(callbackCounter, 1)
		test.ok(t.isPlaying())

		TWEEN.update(150)
		test.equal(callbackCounter, 1)
		TWEEN.update(200)
		test.equal(callbackCounter, 1)
		test.ok(!t.isPlaying())

		test.done()
	},

	'TWEEN.Tween.onRepeat should be called every time if repeat = Infinity'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		const repeatTween = (repeatCount: number): void => {
			TWEEN.update(repeatCount * 100)
			test.equal(callbackCounter, repeatCount)
			TWEEN.update(50 + repeatCount * 100)
			test.equal(callbackCounter, repeatCount)
			TWEEN.update(99.99999999 + repeatCount * 100)
			test.equal(callbackCounter, repeatCount)
			TWEEN.update(100 + repeatCount * 100)
			test.equal(callbackCounter, repeatCount + 1)
			test.ok(t.isPlaying())
		}

		for (let i = 0; i < 10; i++) {
			repeatTween(i)
		}

		test.done()
	},

	'TWEEN.Tween.onRepeat should not be called if Tween.pause() or Tween.stop(), and should be called after Tween.resume() or restart'(
		test: Test,
	): void {
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
		test.equal(tweenPause.counter.count, 1, 'repeats after first completion')
		test.equal(tweenStop.counter.count, 1, 'repeats after first completion')

		TWEEN.update(200)
		test.equal(tweenPause.counter.count, 2, 'repeats after second completion')
		test.equal(tweenStop.counter.count, 2, 'repeats after second completion')

		tweenPause.tween.pause(200)
		TWEEN.update(300)
		test.equal(tweenPause.counter.count, 2, 'tween is paused hence it did not repeat')
		test.equal(tweenStop.counter.count, 3, 'tween is not stopped hence it repeated')

		tweenPause.tween.resume(300)
		tweenStop.tween.stop()
		TWEEN.update(400)
		test.equal(tweenPause.counter.count, 3, 'tween is resumed so it repeated')
		test.equal(tweenStop.counter.count, 3, 'tween was stopped hence it did not repeat')

		tweenStop.tween.start(400)
		TWEEN.update(500)
		test.equal(tweenPause.counter.count, 4, 'tween is not paused hence it repeated')
		test.equal(tweenStop.counter.count, 4, 'tween is not stopped hence it repeated')

		test.done()
	},

	'If Tween.delay is set, TWEEN.Tween.onRepeat should be called when repeat section finished'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).delay(50).repeat(1).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		test.equal(callbackCounter, 0)

		TWEEN.update(50) //start first section
		test.equal(obj.x, 0)
		test.equal(callbackCounter, 0)

		TWEEN.update(100)
		test.equal(obj.x, 50)
		test.equal(callbackCounter, 0)

		TWEEN.update(150) //first section is finished
		test.equal(obj.x, 100)
		test.equal(callbackCounter, 1)

		TWEEN.update(200) //restart
		test.equal(obj.x, 0)
		test.equal(callbackCounter, 1)

		TWEEN.update(250)
		test.equal(obj.x, 50)
		test.equal(callbackCounter, 1)

		TWEEN.update(300) //second section is finished
		test.equal(obj.x, 100)
		test.equal(callbackCounter, 1)
		test.ok(!t.isPlaying())

		TWEEN.update(400)
		test.equal(obj.x, 100)
		test.equal(callbackCounter, 1)

		test.done()
	},

	'If Tween.repeatDelay is set, TWEEN.Tween.onRepeat should be called when repeat section finished'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0}
		let callbackCounter = 0

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeatDelay(100).repeat(1).start(0)
		t.onRepeat(() => {
			callbackCounter++
		})

		TWEEN.update(0)
		test.equal(callbackCounter, 0)

		TWEEN.update(50)
		test.equal(callbackCounter, 0)

		TWEEN.update(99.99999999)
		test.equal(callbackCounter, 0)

		TWEEN.update(100) //first section is finished
		test.equal(callbackCounter, 1)

		TWEEN.update(150) //delay
		test.equal(callbackCounter, 1)

		TWEEN.update(200) //restart
		test.equal(callbackCounter, 1)

		TWEEN.update(300) //second section is finished
		test.equal(callbackCounter, 1)
		test.ok(!t.isPlaying())

		TWEEN.update(400)
		test.equal(callbackCounter, 1)

		test.done()
	},

	'Test TWEEN.update() should reduce the repeat count'(test: Test) {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(5).delay(100)

		t.start(0)

		TWEEN.update(100)
		// @ts-expect-error
		test.equal(t._repeat, 5)

		TWEEN.update(150)
		// @ts-expect-error
		test.equal(t._repeat, 5)

		TWEEN.update(200)
		// @ts-expect-error
		test.equal(t._repeat, 4)

		TWEEN.update(250)
		// @ts-expect-error
		test.equal(t._repeat, 4)

		TWEEN.update(300)
		// @ts-expect-error
		test.equal(t._repeat, 4)

		TWEEN.update(350)
		// @ts-expect-error
		test.equal(t._repeat, 4)

		TWEEN.update(400)
		// @ts-expect-error
		test.equal(t._repeat, 3)

		test.done()
	},

	'Test TWEEN.update() should reduce the repeat count multiple times'(test: Test) {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(5).delay(100)

		t.start(0)

		TWEEN.update(400)
		// @ts-expect-error
		test.equal(t._repeat, 3)

		test.done()
	},

	'Test browser tab sleep with delay'(test: Test) {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(Infinity).delay(100)

		t.start(0)

		TWEEN.update(350)
		test.equal(obj.x, 50)

		TWEEN.update(750)
		test.equal(obj.x, 50)

		test.done()
	},

	'Test browser tab sleep with repeatDelay'(test: Test) {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(350)
		test.equal(obj.x, 50)

		TWEEN.update(600)
		test.equal(obj.x, 100)

		TWEEN.update(Infinity)
		test.equal(obj.x, 100)

		test.done()
	},

	'Test browser tab sleep with repeatDelay and delay'(test: Test) {
		TWEEN.removeAll()

		const obj = {x: 0},
			t = new TWEEN.Tween(obj, true).to({x: 100}, 100).delay(100).repeat(1).repeatDelay(200)

		t.start(0)

		TWEEN.update(450)
		test.equal(obj.x, 50)

		TWEEN.update(500)
		test.equal(obj.x, 100)

		TWEEN.update(Infinity)
		test.equal(obj.x, 100)

		test.done()
	},

	'Tween.js compatible with Object.defineProperty getter / setters'(test: Test): void {
		TWEEN.removeAll()

		const obj = {_x: 0, x: 0}

		Object.defineProperty(obj, 'x', {
			get(): void {
				return this._x
			},
			set(x): void {
				this._x = x
			},
		})

		test.equal(obj.x, 0)

		const t = new TWEEN.Tween(obj, true).to({x: 100}, 100)

		t.start(0)

		test.equal(obj.x, 0)

		TWEEN.update(37)
		test.equal(obj.x, 37)

		TWEEN.update(100)
		test.equal(obj.x, 100)

		TWEEN.update(115)
		test.equal(obj.x, 100)

		test.done()
	},

	'tween.isPlaying() is false before the tween starts'(test: Test): void {
		const t = new TWEEN.Tween({x: 0}).to({x: 1}, 100)

		test.equal(t.isPlaying(), false)

		test.done()
	},

	'tween.isPlaying() is true when a tween is started and before it ends'(test: Test): void {
		const t = new TWEEN.Tween({x: 0}).to({x: 1}, 100)
		t.start(0)
		test.equal(t.isPlaying(), true)

		test.done()
	},

	'tween.isPlaying() is false after a tween ends'(test: Test): void {
		TWEEN.removeAll()

		const t = new TWEEN.Tween({x: 0}, true).to({x: 1}, 100)
		t.start(0)
		TWEEN.update(150)
		test.equal(t.isPlaying(), false)

		test.done()
	},

	'A zero-duration tween finishes at its starting time without an error.'(test: Test): void {
		TWEEN.removeAll()

		const object = {x: 0}
		const t = new TWEEN.Tween(object, true).to({x: 1}, 0)
		t.start(0)
		TWEEN.update(0)

		test.equal(t.isPlaying(), false)
		test.equal(object.x, 1)

		test.done()
	},

	// Custom TWEEN.Group tests

	'Custom group.getAll()'(test: Test): void {
		const group = new TWEEN.Group()
		test.ok(group.getAll() instanceof Array)
		test.done()
	},

	'Custom group stores tweens instead of global TWEEN group'(test: Test): void {
		const group = new TWEEN.Group()

		const numGlobalTweensBefore = TWEEN.getAll().length
		const numGroupTweensBefore = group.getAll().length

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		globalTween.start()
		groupTweenA.start()
		groupTweenB.start()

		test.equal(TWEEN.getAll().length, numGlobalTweensBefore + 1)
		test.equal(group.getAll().length, numGroupTweensBefore + 2)
		test.done()
	},

	"Custom group.removeAll() doesn't conflict with global TWEEN group"(test: Test): void {
		const group = new TWEEN.Group()

		TWEEN.removeAll()
		group.removeAll()

		test.equal(TWEEN.getAll().length, 0, 'No global tweens left')
		test.equal(group.getAll().length, 0, 'No group tweens left')

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		globalTween.start()
		groupTweenA.start()
		groupTweenB.start()

		test.equal(TWEEN.getAll().length, 1, 'One global tween has been added')
		test.equal(group.getAll().length, 2, 'Two group tweens have been added')

		group.removeAll()

		test.equal(TWEEN.getAll().length, 1, 'One global tween left')
		test.equal(group.getAll().length, 0, 'No group tweens left')

		TWEEN.removeAll()

		test.equal(TWEEN.getAll().length, 0, 'No global tweens left')

		test.done()
	},

	"Global TWEEN.removeAll() doesn't conflict with custom group"(test: Test): void {
		const group = new TWEEN.Group()

		TWEEN.removeAll()
		group.removeAll()

		test.equal(TWEEN.getAll().length, 0, 'No global tweens left')
		test.equal(group.getAll().length, 0, 'No group tweens left')

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		globalTween.start()
		groupTweenA.start()
		groupTweenB.start()

		test.equal(TWEEN.getAll().length, 1, 'One global tween has been added')
		test.equal(group.getAll().length, 2, 'Two group tweens have been added')

		TWEEN.removeAll()

		test.equal(TWEEN.getAll().length, 0, 'No global tweens left')
		test.equal(group.getAll().length, 2, 'Two group tweens left')

		group.removeAll()

		test.equal(group.getAll().length, 0, 'No group tweens left')

		test.done()
	},

	"Custom group.add() doesn't conflict with global TWEEN group, or vice versa"(test: Test): void {
		const group = new TWEEN.Group()

		const globalTween = new TWEEN.Tween({}, true)
		const groupTweenA = new TWEEN.Tween({}, group)
		const groupTweenB = new TWEEN.Tween({}, group)

		TWEEN.add(globalTween)
		group.add(groupTweenA)
		group.add(groupTweenB)

		test.equal(TWEEN.getAll().length, 1)
		test.equal(group.getAll().length, 2)

		test.done()
	},

	"Custom group.update() doesn't conflict with global TWEEN group"(test: Test): void {
		const group = new TWEEN.Group()

		const startObj = {x: 1}
		const endObj = {x: 2}
		const duration = 1000

		const globalObj = {x: 1}
		new TWEEN.Tween(globalObj, true).to(endObj, duration).start(0)

		const groupObj = {x: 1}
		new TWEEN.Tween(groupObj, group).to(endObj, duration).start(0)

		group.update(duration)

		test.deepEqual(globalObj, startObj)
		test.deepEqual(groupObj, endObj)
		test.done()
	},

	"Global TWEEN.update() doesn't conflict with custom group"(test: Test): void {
		const group = new TWEEN.Group()

		const startObj = {x: 1}
		const endObj = {x: 2}
		const duration = 1000

		const globalObj = {x: 1}
		new TWEEN.Tween(globalObj, true).to(endObj, duration).start(0)

		const groupObj = {x: 1}
		new TWEEN.Tween(groupObj, group).to(endObj, duration).start(0)

		TWEEN.update(duration)

		test.deepEqual(globalObj, endObj)
		test.deepEqual(groupObj, startObj)
		test.done()
	},

	'Ensure tweens work without any group'(test: Test): void {
		const obj = {x: 0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1000}, 1000)

		t.start(0)
		test.equal(obj.x, 0)
		t.update(500)
		test.equal(obj.x, 500)
		t.pause(600)
		test.equal(obj.x, 500)
		t.update(750)
		test.equal(obj.x, 500)
		t.resume(800)
		test.equal(obj.x, 500)
		t.update(1000)
		test.equal(obj.x, 800)
		t.update(1001)
		test.equal(obj.x, 801)
		t.stop().end()
		test.equal(obj.x, 1000)

		test.done()
	},

	'Stopping a tween within an update callback will not cause an error.'(test: Test): void {
		TWEEN.removeAll()

		const tweenA = new TWEEN.Tween({x: 1, y: 2}, true)
			.to({x: 3, y: 4}, 1000)
			.onUpdate(function (): void {
				tweenB.stop()
			})
			.start(0)
		const tweenB = new TWEEN.Tween({x: 5, y: 6}, true)
			.to({x: 7, y: 8})
			.onUpdate(function (): void {
				tweenA.stop()
			})
			.start(0)

		let success = true

		try {
			TWEEN.update(500)
		} catch (exception) {
			success = false
		} finally {
			test.ok(success)
			test.done()
		}
	},

	'Set the duration with .duration'(test: Test): void {
		const obj = {x: 1}
		const t = new TWEEN.Tween(obj).to({x: 2}).duration(1000).start(0)

		t.update(1000)

		test.deepEqual(obj.x, 2)
		test.done()
	},

	'Get the duration with .getDuration'(test: Test): void {
		const obj = {x: 1}
		const t = new TWEEN.Tween(obj).to({x: 2}).duration(100)

		test.deepEqual(t.getDuration(), 100)
		test.done()
	},

	"Tween.group sets the tween's group."(test: Test): void {
		const group = new TWEEN.Group()

		const groupTweenA = new TWEEN.Tween({}).group(group)

		groupTweenA.start()

		test.equal(group.getAll().length, 1)
		test.done()
	},

	'Test TWEEN.Tween.pause() and TWEEN.Tween.resume()'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0.0},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 1.0}, 1000)

		test.equal(TWEEN.getAll().length, 1)

		t.start(0)
		test.equal(t.isPaused(), false)

		TWEEN.update(400)
		test.equal(obj.x, 0.4)

		t.pause(450)
		test.equal(t.isPaused(), true)
		test.equal(TWEEN.getAll().length, 1)
		test.equal(obj.x, 0.4)

		TWEEN.update(900)
		test.equal(obj.x, 0.4)

		TWEEN.update(3000)
		test.equal(obj.x, 0.4)

		t.resume(3200)
		// values do not change until an update
		test.equal(obj.x, 0.4)
		test.equal(TWEEN.getAll().length, 1)
		test.equal(t.isPaused(), false)

		TWEEN.update(3500)
		test.equal(obj.x, 0.75)

		TWEEN.update(5000)
		test.equal(obj.x, 1.0)
		test.done()
	},

	'Test TWEEN.Tween.pause() and TWEEN.Tween.resume(), without groups'(test: Test): void {
		const obj = {x: 0.0},
			t = new TWEEN.Tween(obj)

		t.to({x: 1.0}, 1000)

		t.start(0)
		test.equal(t.isPaused(), false)

		t.update(400)
		test.equal(obj.x, 0.4)

		t.pause(450)
		test.equal(t.isPaused(), true)
		test.equal(obj.x, 0.4)

		t.update(900)
		test.equal(obj.x, 0.4)

		t.update(3000)
		test.equal(obj.x, 0.4)

		t.resume(3200)
		// values do not change until an update
		test.equal(obj.x, 0.4)
		test.equal(t.isPaused(), false)

		t.update(3500)
		test.equal(obj.x, 0.75)

		t.update(5000)
		test.equal(obj.x, 1.0)
		test.done()
	},

	'Arrays in the object passed to to() are not modified by start() if dynamic is false.'(test: Test): void {
		const start = {x: 10, y: 20, z: 30}
		const end = {x: 100, y: 200, z: ['+10', '-10']}
		const valuesArray = end.z
		new TWEEN.Tween(start).to(end).start()
		test.equal(valuesArray, end.z)
		test.equal(end.z.length, 2)
		test.equal(end.z[0], '+10')
		test.equal(end.z[1], '-10')
		test.done()
	},

	'Arrays in the object passed to to() are modified by start() if dynamic is true.'(test: Test): void {
		const start = {x: 10, y: 20, z: 30}
		const end = {x: 100, y: 200, z: ['+10', '-10']}
		const valuesArray = end.z
		test.equal(end.z.length, 2)
		new TWEEN.Tween(start).to(end).dynamic(true).start()
		test.notEqual(valuesArray, end.z)
		test.equal(end.z.length, 3)
		test.equal(end.z[0], 30)
		test.equal(end.z[1], 40)
		test.equal(end.z[2], 20)
		test.done()
	},

	'Arrays in the object passed to to() are not modified by start() if they are not interpolation arrays, regardless of dynamic.'(
		test: Test,
	): void {
		// eslint-disable-next-line
		function testWithDynamic(start: any, end: any, dynamic: boolean): void {
			// const start = {x: 10, y: 20, z: [1, 2]}
			// const end = {x: 100, y: 200, z: ['a', 'b']}
			const valuesArray = end.z
			new TWEEN.Tween(start).to(end).dynamic(dynamic).start()
			test.equal(valuesArray, end.z)
			test.equal(end.z.length, 2)
			test.equal(end.z[0], 'a')
			test.equal(end.z[1], 'b')
		}

		testWithDynamic({x: 10, y: 20, z: [1, 2]}, {x: 100, y: 200, z: ['a', 'b']}, true)
		testWithDynamic({x: 10, y: 20, z: [1, 2]}, {x: 100, y: 200, z: ['a', 'b']}, false)
		testWithDynamic({x: 10, y: 20, z: 30}, {x: 100, y: 200, z: ['a', 'b']}, true)
		testWithDynamic({x: 10, y: 20, z: 30}, {x: 100, y: 200, z: ['a', 'b']}, false)
		test.done()
	},

	'Tween.js animate nested object'(test: Test): void {
		TWEEN.removeAll()

		const obj = {scale: {x: 0}, alpha: 0}

		const t = new TWEEN.Tween(obj, true).to({scale: {x: 100}, alpha: 100}, 100)
		t.start(0)

		test.equal(obj.scale.x, 0)

		TWEEN.update(37)
		test.equal(obj.scale.x, 37)
		test.equal(obj.alpha, 37)

		TWEEN.update(100)
		test.equal(obj.scale.x, 100)
		test.equal(obj.alpha, 100)

		TWEEN.update(115)
		test.equal(obj.scale.x, 100)
		test.equal(obj.alpha, 100)

		test.done()
	},

	'Tween.js animate nested object including relative value'(test: Test): void {
		TWEEN.removeAll()

		const obj = {world: {hero: {scale: {x: 0}, x: 100}}, time: 0}

		const t = new TWEEN.Tween(obj, true).to({world: {hero: {scale: {x: 100}, x: '+100'}}, time: 100}, 100)
		t.start(0)

		test.equal(obj.world.hero.scale.x, 0)

		TWEEN.update(37)
		test.equal(obj.world.hero.scale.x, 37)
		test.equal(obj.world.hero.x, 137)
		test.equal(obj.time, 37)

		TWEEN.update(100)
		test.equal(obj.world.hero.scale.x, 100)
		test.equal(obj.world.hero.x, 200)
		test.equal(obj.time, 100)

		TWEEN.update(115)
		test.equal(obj.world.hero.scale.x, 100)
		test.equal(obj.world.hero.x, 200)
		test.equal(obj.time, 100)

		test.done()
	},

	'Test TWEEN.Tween with nested objects'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0.0, y: 100, some: {value: 0.0, style: {opacity: 1.0}}},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 1.0, y: 200, some: {value: 1.0, style: {opacity: 0.5}}}, 1000)

		test.equal(TWEEN.getAll().length, 1)

		t.start(0)

		test.equal(TWEEN.getAll().length, 1)
		test.equal(t.isPaused(), false)

		TWEEN.update(400)

		test.equal(obj.x, 0.4)
		test.equal(obj.y, 140)
		test.equal(obj.some.style.opacity, 0.8)
		test.equal(obj.some.value, 0.4)

		TWEEN.update(750)

		test.equal(obj.x, 0.75)
		test.equal(obj.y, 175)
		test.equal(obj.some.style.opacity, 0.625)
		test.equal(obj.some.value, 0.75)

		TWEEN.update(1000)

		test.equal(obj.x, 1.0)
		test.equal(obj.y, 200)
		test.equal(obj.some.style.opacity, 0.5)
		test.equal(obj.some.value, 1.0)

		test.done()
	},

	'Test TWEEN.Tween.pause() and .resume() with nested objects'(test: Test): void {
		TWEEN.removeAll()

		const obj = {x: 0.0, y: 100, some: {value: 0.0}},
			t = new TWEEN.Tween(obj, true)

		t.to({x: 1.0, y: 200, some: {value: 1.0}}, 1000)

		test.equal(TWEEN.getAll().length, 1)

		t.start(0)

		test.equal(TWEEN.getAll().length, 1)
		test.equal(t.isPaused(), false)

		TWEEN.update(400)

		test.equal(obj.x, 0.4)
		test.equal(obj.y, 140)
		test.equal(obj.some.value, 0.4)

		t.pause(450)

		test.equal(t.isPaused(), true)
		test.equal(TWEEN.getAll().length, 1)
		test.equal(obj.x, 0.4)
		test.equal(obj.y, 140)
		test.equal(obj.some.value, 0.4)

		TWEEN.update(900)

		test.equal(obj.x, 0.4)
		test.equal(obj.y, 140)
		test.equal(obj.some.value, 0.4)

		TWEEN.update(3000)

		test.equal(obj.x, 0.4)
		test.equal(obj.y, 140)
		test.equal(obj.some.value, 0.4)

		t.resume(3200)

		// values do not change until an update
		test.equal(obj.x, 0.4)
		test.equal(obj.y, 140)
		test.equal(obj.some.value, 0.4)

		test.equal(TWEEN.getAll().length, 1)
		test.equal(t.isPaused(), false)

		TWEEN.update(3500)

		test.equal(obj.x, 0.75)
		test.equal(obj.y, 175)
		test.equal(obj.some.value, 0.75)

		TWEEN.update(5000)

		test.equal(obj.x, 1.0)
		test.equal(obj.y, 200)
		test.equal(obj.some.value, 1.0)

		test.done()
	},

	'Test TWEEN.Easing.generatePow(1) equals Linear'(test: Test): void {
		const ease1 = TWEEN.Easing.generatePow(1)

		const compareWithLinear = (ease: EasingFunctionGroup, amount: number) => {
			const linearResult = TWEEN.Easing.Linear.None(amount)
			test.equal(linearResult, ease.In(amount))
			test.equal(linearResult, ease.Out(amount))
			test.equal(linearResult, ease.InOut(amount))
		}
		compareWithLinear(ease1, 0)
		compareWithLinear(ease1, 0.25)
		compareWithLinear(ease1, 0.5)
		compareWithLinear(ease1, 0.75)
		compareWithLinear(ease1, 1)
		compareWithLinear(ease1, -1)
		compareWithLinear(ease1, Infinity)

		test.done()
	},

	'Test TWEEN.Easing.generatePow(n) should pass 0.0, 0.5, 1.0'(test: Test): void {
		const checkEdgeValue = (ease: EasingFunctionGroup) => {
			test.equal(ease.InOut(0.0), 0.0)
			test.equal(ease.In(0.0), 0.0)
			test.equal(ease.Out(0.0), 0.0)

			test.equal(ease.InOut(0.5), 0.5)

			test.equal(ease.InOut(1.0), 1.0)
			test.equal(ease.In(1.0), 1.0)
			test.equal(ease.Out(1.0), 1.0)
		}
		checkEdgeValue(TWEEN.Easing.generatePow(Number.NEGATIVE_INFINITY))
		checkEdgeValue(TWEEN.Easing.generatePow(-1.0))
		checkEdgeValue(TWEEN.Easing.generatePow(1))
		checkEdgeValue(TWEEN.Easing.generatePow(Math.LOG2E))
		checkEdgeValue(TWEEN.Easing.generatePow(Math.PI))
		checkEdgeValue(TWEEN.Easing.generatePow())
		checkEdgeValue(TWEEN.Easing.generatePow(6))
		checkEdgeValue(TWEEN.Easing.generatePow(Number.POSITIVE_INFINITY))

		test.done()
	},

	"Test TWEEN.to(ends) shouldn't grow endless on ends value"(test: Test): void {
		TWEEN.removeAll()

		const target = {y: 0}
		const ends = {y: [100, 200]}
		const tween = new TWEEN.Tween(target, true).to(ends, 1000)

		tween.stop().start(0)
		tween.stop().start(0)

		TWEEN.update(250)
		test.equal(target.y, 50)

		test.done()
	},

	'Test TWEEN.Tween.to() with a dynamic target provided as object'(test: Test): void {
		TWEEN.removeAll()

		const dynamicTargetValue = {x: 5}
		const chasingValue = {x: 0}
		const duration = 1000 // must be even
		const t1 = new TWEEN.Tween(dynamicTargetValue, true).to({x: 10}, duration),
			t2 = new TWEEN.Tween(chasingValue, true).to(dynamicTargetValue, duration).dynamic(true)

		test.equal(TWEEN.getAll().length, 2)

		t1.start(0)
		t2.start(0)
		test.notDeepEqual(chasingValue, dynamicTargetValue)

		TWEEN.update(duration / 2, true)
		test.notDeepEqual(chasingValue, dynamicTargetValue)

		TWEEN.update(duration, true)
		test.deepEqual(chasingValue, dynamicTargetValue)

		test.done()
	},

	'Test TWEEN.Tween.to() with a dynamic target provided as array': function (test: Test): void {
		TWEEN.removeAll()

		const dynamicTargetValue = [5]
		const chasingValue = [0]
		const duration = 1000 // must be even
		const t1 = new TWEEN.Tween(dynamicTargetValue, true).to([10], duration),
			t2 = new TWEEN.Tween(chasingValue, true).to(dynamicTargetValue, duration).dynamic(true)

		test.equal(TWEEN.getAll().length, 2)

		t1.start(0)
		t2.start(0)
		test.notDeepEqual(chasingValue, dynamicTargetValue)

		TWEEN.update(duration / 2, true)
		test.notDeepEqual(chasingValue, dynamicTargetValue)

		TWEEN.update(duration, true)
		test.deepEqual(chasingValue, dynamicTargetValue)

		test.done()
	},

	'Test TWEEN.Tween.to() with multiple dynamic targets provided as array': function (test: Test): void {
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
				new TWEEN.Tween(initialValue, true).to({x: dynamicTargetValues.x[i]}, duration).onUpdate(function (object) {
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

		test.equal(TWEEN.getAll().length, 5)

		tweens.forEach(tween => tween.start(0))
		t.start(0)

		test.equal(TWEEN.getAll().length, tweens.length + 1)

		for (let i = 0; i < tweens.length; i++) {
			const progress = ((i + 1) * duration) / tweens.length
			TWEEN.update(progress, true)
			test.equal(chasingValue.x, observedValues[i].x)
		}

		test.done()
	},

	'Test TWEEN.Tween.update() with no arguments'(test: Test): void {
		patchPerformanceNow()

		const targetNow = {x: 0.0}
		const targetTime = {x: 0.0}

		const tweenNow = new TWEEN.Tween(targetNow).to({x: 1.0}).start()
		const tweenTime = new TWEEN.Tween(targetTime).to({x: 1.0}).start(0)

		const tick = (time: number) => {
			tickTime(time)
			tweenNow.update()
			tweenTime.update(time)
			test.equal(targetNow.x, targetTime.x)
		}

		tick(0)
		tick(16)
		tick(16.66)
		tick(100)
		tick(20000)

		restorePerformanceNow()

		test.done()
	},
}

type Test = {
	ok(a: unknown, failMessage?: string): void
	equal(a: unknown, b: unknown, failMessage?: string): void
	notEqual(a: unknown, b: unknown, failMessage?: string): void
	deepEqual(a: unknown, b: unknown, failMessage?: string): void
	notDeepEqual(a: unknown, b: unknown, failMessage?: string): void
	expect(n: number): void
	throws(block: unknown, error?: unknown, message?: string): void
	done(): void
}

function toBeCloseTo(test: Test, numberA: number, numberB: number, numDigits = 2): void {
	const diff = Math.abs(numberA - numberB)
	test.ok(
		diff < 10 ** -numDigits / 2,
		`
actual : ${numberA}
expect : ${numberB}
diff : ${diff}`,
	)
}

// TODO test that starting and stopping a tween multiple times doesn't cause
// interpolation arrays to modified yet again (and similar with other
// initialization items). Initialization should happen only once, on first
// start.

// TODO test onRepeat
