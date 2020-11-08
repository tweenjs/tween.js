~function () {
	function getTests(TWEEN) {
		var tests = {
			hello: function (test) {
				test.ok(TWEEN !== null)
				test.done()
			},

			// TWEEN tests
			'TWEEN.getAll': function (test) {
				test.ok(TWEEN.getAll() instanceof Array)
				test.done()
			},

			'TWEEN object stores tweens automatically on start': function (test) {
				var numTweensBefore = TWEEN.getAll().length,
					t = new TWEEN.Tween({})

				t.start()

				var numTweensAfter = TWEEN.getAll().length

				test.equal(numTweensBefore + 1, numTweensAfter)
				test.done()
			},

			'TWEEN.removeAll()': function (test) {
				var all = TWEEN.getAll(),
					t = new TWEEN.Tween({})

				TWEEN.removeAll()

				test.equal(TWEEN.getAll().length, 0, 'No tweens left')

				t.start()

				test.equal(TWEEN.getAll().length, 1, 'A tween has been added')

				TWEEN.removeAll()

				test.equal(TWEEN.getAll().length, 0, 'No tweens left')
				test.done()
			},

			'TWEEN.add()': function (test) {
				var all = TWEEN.getAll(),
					numTweens = all.length,
					t = new TWEEN.Tween({})

				TWEEN.add(t)

				test.equal(numTweens + 1, TWEEN.getAll().length)

				test.done()
			},

			'TWEEN.remove()': function (test) {
				var all = TWEEN.getAll(),
					numTweens = all.length,
					t = new TWEEN.Tween({})

				TWEEN.add(t)

				test.ok(TWEEN.getAll().indexOf(t) != -1)

				TWEEN.remove(t)

				test.equal(numTweens, TWEEN.getAll().length)
				test.equal(TWEEN.getAll().indexOf(t), -1)
				test.done()
			},

			'TWEEN.update() returns false when done (no tweens to animate)': function (test) {
				TWEEN.removeAll()

				test.deepEqual(TWEEN.update(), false)
				test.done()
			},

			'TWEEN.update() returns true when there are active tweens': function (test) {
				TWEEN.removeAll()

				var t = new TWEEN.Tween({})
				t.start()

				test.deepEqual(TWEEN.update(), true)
				test.done()
			},

			'TWEEN.update() removes tweens when they are finished': function (test) {
				TWEEN.removeAll()

				var t1 = new TWEEN.Tween({}).to({}, 1000),
					t2 = new TWEEN.Tween({}).to({}, 2000)

				test.equal(TWEEN.getAll().length, 0)

				t1.start(0)
				t2.start(0)

				test.equal(TWEEN.getAll().length, 2)

				TWEEN.update(0)
				test.equal(TWEEN.getAll().length, 2)

				TWEEN.update(999)
				test.equal(TWEEN.getAll().length, 2)

				TWEEN.update(1000)
				test.equal(TWEEN.getAll().length, 1)
				test.equal(TWEEN.getAll().indexOf(t1), -1)
				test.ok(TWEEN.getAll().indexOf(t2) != -1)
				test.done()
			},
			'TWEEN.update() does not remove tweens when they are finished with preserve flag': function (test) {
				TWEEN.removeAll()

				var t1 = new TWEEN.Tween({}).to({}, 1000),
					t2 = new TWEEN.Tween({}).to({}, 2000)

				test.equal(TWEEN.getAll().length, 0)

				t1.start(0)
				t2.start(0)

				test.equal(TWEEN.getAll().length, 2)

				TWEEN.update(0, true)
				test.equal(TWEEN.getAll().length, 2)

				TWEEN.update(999, true)
				test.equal(TWEEN.getAll().length, 2)

				TWEEN.update(1000, true)
				test.equal(TWEEN.getAll().length, 2)

				TWEEN.update(1001, true)
				test.equal(TWEEN.getAll().length, 2)
				test.ok(TWEEN.getAll().indexOf(t1) != -1)
				test.ok(TWEEN.getAll().indexOf(t2) != -1)
				test.done()
			},

			'Unremoved tweens which have been updated past their finish time may go backward in time': function (test) {
				TWEEN.removeAll()

				var target1 = {a: 0}
				var target2 = {b: 0}

				var t1 = new TWEEN.Tween(target1).to({a: 1}, 1000),
					t2 = new TWEEN.Tween(target2).to({b: 1}, 2000)

				t1.start(0)
				t2.start(0)

				TWEEN.update(200, true)
				TWEEN.update(2500, true)
				TWEEN.update(500, true)

				test.equal(TWEEN.getAll().length, 2)
				test.equal(target1.a, 0.5)
				test.equal(target2.b, 0.25)

				test.done()
			},

			// TWEEN.Tween tests

			constructor: function (test) {
				var t = new TWEEN.Tween({})

				test.ok(t instanceof TWEEN.Tween, 'Pass')
				test.done()
			},

			'Return the same tween instance for method chaining': function (test) {
				var t = new TWEEN.Tween({})

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

			'Tween existing property': function (test) {
				var obj = {x: 1},
					t = new TWEEN.Tween(obj)

				t.to({x: 2}, 1000)
				t.start(0)
				t.update(1000)

				test.deepEqual(obj.x, 2)
				test.done()
			},

			'Tween non-existing property': function (test) {
				var obj = {x: 1},
					t = new TWEEN.Tween(obj)

				t.to({y: 0}, 1000)
				t.start(0)
				t.update(1000)

				test.deepEqual(obj.x, 1)
				test.equal(obj.y, undefined)
				test.done()
			},

			'Tween non-null property': function (test) {
				var obj = {x: 1},
					t = new TWEEN.Tween(obj)

				t.to({x: 2}, 1000)
				t.start(0)
				t.update(1000)

				test.deepEqual(obj.x, 2)
				test.ok(obj.x !== null)
				test.done()
			},

			'Tween function property': function (test) {
				var my_function = function () {}

				var obj = {x: my_function},
					t = new TWEEN.Tween(obj)

				t.to({x: my_function})
				t.start(0)
				t.update(1000)

				test.ok(obj.x === my_function)
				test.done()
			},

			'Tween boolean property': function (test) {
				var obj = {x: true},
					t = new TWEEN.Tween(obj)

				t.to({x: function () {}})
				t.start(0)
				t.update(1000)

				test.ok(typeof obj.x === 'boolean')
				test.ok(obj.x)
				test.done()
			},

			'Tween null property': function (test) {
				var obj = {x: null},
					t = new TWEEN.Tween(obj)

				t.to({x: 2}, 1000)
				t.start(0)
				t.update(1000)

				test.deepEqual(obj.x, 2)
				test.done()
			},

			'Tween undefined property': function (test) {
				var obj = {},
					t = new TWEEN.Tween(obj)

				t.to({x: 2}, 1000)
				t.start(0)
				t.update(1000)

				test.equal(obj.x, undefined)
				test.done()
			},

			'Tween relative positive value': function (test) {
				var obj = {x: 0},
					t = new TWEEN.Tween(obj)

				t.to({x: '+100'}, 1000)
				t.start(0)
				t.update(1000)

				test.equal(obj.x, 100)
				test.done()
			},

			'Tween relative negative value': function (test) {
				var obj = {x: 0},
					t = new TWEEN.Tween(obj)

				t.to({x: '-100'}, 1000)
				t.start(0)
				t.update(1000)

				test.equal(obj.x, -100)
				test.done()
			},

			'String values without a + or - sign should not be interpreted as relative': function (test) {
				var obj = {x: 100},
					t = new TWEEN.Tween(obj)

				t.to({x: '100'}, 1000)
				t.start(0)
				t.update(1000)

				test.equal(obj.x, 100)
				test.done()
			},

			'Tween relative positive value, with yoyo': function (test) {
				var obj = {x: 0},
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

			'Tween relative negative value, with yoyo': function (test) {
				var obj = {x: 0},
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

			'Tween relative positive array interpolation values': function (test) {
				var obj = {x: 0},
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

			'String values without a + or - sign should not be interpreted as relative with array interpolation values': function (
				test,
			) {
				var obj = {x: 0},
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

			'animate values in an array': function (test) {
				var obj = [0, 0, 0],
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

			'animate values in a nested array': function (test) {
				var obj = {a: [0, 0, 0]},
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

			'Test TWEEN.Tween.start()': function (test) {
				var obj = {},
					t = new TWEEN.Tween(obj)

				t.to({}, 1000)

				TWEEN.removeAll()
				test.equal(TWEEN.getAll().length, 0) // TODO move to TWEEN test

				t.start(0)

				test.equal(TWEEN.getAll().length, 1) // TODO ditto
				test.equal(TWEEN.getAll()[0], t)
				test.done()
			},

			'Test TWEEN.Tween.stop()': function (test) {
				var obj = {},
					t = new TWEEN.Tween(obj)

				t.to({x: 2}, 1000)

				TWEEN.removeAll()

				t.start()
				t.stop()

				test.equal(TWEEN.getAll().length, 0)
				test.done()
			},

			'Test TWEEN.Tween.delay()': function (test) {
				var obj = {x: 1},
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
			'Test TWEEN.Tween.easing()': function (test) {
				var obj = {x: 0},
					t = new TWEEN.Tween(obj)

				t.to({x: 1}, 1000)

				t.easing(TWEEN.Easing.Quadratic.In)
				t.start(0)
				t.update(500)
				test.equal(obj.x, TWEEN.Easing.Quadratic.In(0.5))
				test.done()
			},

			// TODO test interpolation()

			'Test TWEEN.Tween.chain --with one tween': function (test) {
				var t = new TWEEN.Tween({}),
					tStarted = false,
					tCompleted = false,
					t2 = new TWEEN.Tween({}),
					t2Started = false

				TWEEN.removeAll()

				t.to({}, 1000)
				t2.to({}, 1000)

				t.chain(t2)

				t.onStart(function () {
					tStarted = true
				})

				t.onComplete(function () {
					tCompleted = true
				})

				t2.onStart(function () {
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

			'Test TWEEN.Tween.chain --with several tweens in an array': function (test) {
				var t = new TWEEN.Tween({}),
					chainedTweens = [],
					numChained = 3,
					numChainedStarted = 0

				TWEEN.removeAll()

				t.to({}, 1000)

				function onChainedStart() {
					numChainedStarted++
				}

				for (var i = 0; i < numChained; i++) {
					var chained = new TWEEN.Tween({})
					chained.to({}, 1000)

					chainedTweens.push(chained)

					chained.onStart(onChainedStart)
				}

				// NOTE: This is not the normal way to chain several tweens simultaneously
				// The usual way would be to specify them explicitly:
				// t.chain( tween1, tween2, ... tweenN)
				// ... not to use apply to send an array of tweens
				t.chain.apply(t, chainedTweens)

				test.equal(numChainedStarted, 0)

				t.start(0)
				TWEEN.update(0)
				TWEEN.update(1000)
				TWEEN.update(1001)

				test.equal(numChainedStarted, numChained, 'All chained tweens have been started')
				test.done()
			},

			'Test TWEEN.Tween.chain allows endless loops': function (test) {
				var obj = {x: 0},
					t1 = new TWEEN.Tween(obj).to({x: 100}, 1000),
					t2 = new TWEEN.Tween(obj).to({x: 0}, 1000)

				TWEEN.removeAll()

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
				var obj2 = {x: 0}
				var t3 = new TWEEN.Tween(obj2).to({x: 200}, 1000)
				var t4 = new TWEEN.Tween(obj2).to({x: 100}, 1000)

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

			'Test TWEEN.Tween.onStart': function (test) {
				var obj = {},
					t = new TWEEN.Tween(obj),
					counter = 0

				t.to({x: 2}, 1000)
				t.onStart(function () {
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

			'Test TWEEN.Tween.onStop': function (test) {
				var obj = {},
					t = new TWEEN.Tween(obj),
					counter = 0

				t.to({x: 2}, 1000)
				t.onStop(function () {
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

				test.deepEqual(
					counter,
					1,
					'onStop callback is called if the tween has been started already and stop is invoked',
				)

				TWEEN.update(500)
				t.stop()

				test.deepEqual(counter, 1, 'onStop callback is not called again once the tween is stopped')
				test.done()
			},

			'Test TWEEN.Tween.onUpdate': function (test) {
				var obj = {},
					t = new TWEEN.Tween(obj),
					counter = 0

				t.to({x: 2}, 1000)
				t.onUpdate(function () {
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

			'Test TWEEN.Tween.onComplete': function (test) {
				var obj = {},
					t = new TWEEN.Tween(obj),
					counter = 0

				t.to({x: 2}, 1000)
				t.onComplete(function () {
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

			'TWEEN.Tween does not repeat by default': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100)

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

			'Test single repeat happens only once': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).repeat(1)

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

			'Test Infinity repeat happens forever': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).repeat(Infinity)

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

			'Test tweening relatively with repeat': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0, y: 0},
					t = new TWEEN.Tween(obj).to({x: '+100', y: '-100'}, 100).repeat(1)

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

			'Test yoyo with repeat Infinity happens forever': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).repeat(Infinity).yoyo(true)

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

			'Test yoyo with repeat 1 happens once': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).repeat(1).yoyo(true)

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

			'Test yoyo works with arrays': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj)
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

			'Test yoyo can be stopped and restarted properly': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).repeat(1).yoyo(true)

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

			'Test TWEEN.Tween.stopChainedTweens()': function (test) {
				var t = new TWEEN.Tween({}),
					tStarted = false,
					tCompleted = false,
					t2 = new TWEEN.Tween({}),
					t2Started = false

				TWEEN.removeAll()

				t.to({}, 1000)
				t2.delay(500).to({}, 1000)

				t.chain(t2)
				t2.chain(t)

				t.onStart(function () {
					tStarted = true
				})

				t.onComplete(function () {
					tCompleted = true
				})

				t2.onStart(function () {
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
				test.equal(TWEEN.getAll().length, 0)

				test.done()
			},

			'Test TWEEN.Tween.chain progressess into chained tweens': function (test) {
				var obj = {t: 1000}

				// 1000 of nothing
				var blank = new TWEEN.Tween({}).to({}, 1000)

				// tween obj.t from 1000 -> 2000 (in time with update time)
				var next = new TWEEN.Tween(obj).to({t: 2000}, 1000)

				blank.chain(next).start(0)

				TWEEN.update(1500)
				test.equal(obj.t, 1500)

				TWEEN.update(2000)
				test.equal(obj.t, 2000)

				test.done()
			},

			'Test that TWEEN.Tween.end sets the final values.': function (test) {
				var object1 = {x: 0, y: -50, z: 1000}
				var target1 = {x: 50, y: 123, z: '+234'}

				var tween1 = new TWEEN.Tween(object1).to(target1, 1000)

				tween1.start()
				tween1.end()

				test.equal(object1.x, 50)
				test.equal(object1.y, 123)
				test.equal(object1.z, 1234)

				var object2 = {x: 0, y: -50, z: 1000}
				var target2 = {x: 50, y: 123, z: '+234'}

				var tween2 = new TWEEN.Tween(object2).to(target2, 1000)

				tween2.start(300)
				tween2.update(500)
				tween2.end()

				test.equal(object2.x, 50)
				test.equal(object2.y, 123)
				test.equal(object2.z, 1234)

				test.done()
			},

			'Test that TWEEN.Tween.end calls the onComplete callback of the tween.': function (test) {
				test.expect(1)

				var tween1 = new TWEEN.Tween({}).to({}, 1000).onComplete(function () {
					test.ok(true)
				})

				tween1.start()
				tween1.end()

				test.done()
			},

			'Test delay adds delay before each repeat': function (test) {
				// If repeatDelay isn't specified then delay is used since
				// that's the way it worked before repeatDelay was added.

				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).repeat(1).delay(100)

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

			'Test repeatDelay adds delay before each repeat': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).repeat(1).repeatDelay(200)

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

			'Test repeatDelay and delay can be used together': function (test) {
				TWEEN.removeAll()

				var obj = {x: 0},
					t = new TWEEN.Tween(obj).to({x: 100}, 100).delay(100).repeat(1).repeatDelay(200)

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

			'Tween.js compatible with Object.defineProperty getter / setters': function (test) {
				var obj = {_x: 0}

				Object.defineProperty(obj, 'x', {
					get: function () {
						return this._x
					},
					set: function (x) {
						this._x = x
					},
				})

				test.equal(obj.x, 0)

				var t = new TWEEN.Tween(obj).to({x: 100}, 100)

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

			'tween.isPlaying() is false before the tween starts': function (test) {
				TWEEN.removeAll()

				var t = new TWEEN.Tween({x: 0}).to({x: 1}, 100)

				test.equal(t.isPlaying(), false)

				test.done()
			},

			'tween.isPlaying() is true when a tween is started and before it ends': function (test) {
				TWEEN.removeAll()

				var t = new TWEEN.Tween({x: 0}).to({x: 1}, 100)
				t.start(0)
				test.equal(t.isPlaying(), true)

				test.done()
			},

			'tween.isPlaying() is false after a tween ends': function (test) {
				TWEEN.removeAll()

				var t = new TWEEN.Tween({x: 0}).to({x: 1}, 100)
				t.start(0)
				TWEEN.update(150)
				test.equal(t.isPlaying(), false)

				test.done()
			},

			'A zero-duration tween finishes at its starting time without an error.': function (test) {
				TWEEN.removeAll()

				let object = {x: 0}
				var t = new TWEEN.Tween(object).to({x: 1}, 0)
				t.start(0)
				TWEEN.update(0)

				test.equal(t.isPlaying(), false)
				test.equal(object.x, 1)

				test.done()
			},

			// Custom TWEEN.Group tests

			'Custom group.getAll()': function (test) {
				var group = new TWEEN.Group()
				test.ok(group.getAll() instanceof Array)
				test.done()
			},

			'Custom group stores tweens instead of global TWEEN group': function (test) {
				var group = new TWEEN.Group()

				var numGlobalTweensBefore = TWEEN.getAll().length
				var numGroupTweensBefore = group.getAll().length

				var globalTween = new TWEEN.Tween({})
				var groupTweenA = new TWEEN.Tween({}, group)
				var groupTweenB = new TWEEN.Tween({}, group)

				globalTween.start()
				groupTweenA.start()
				groupTweenB.start()

				test.equal(TWEEN.getAll().length, numGlobalTweensBefore + 1)
				test.equal(group.getAll().length, numGroupTweensBefore + 2)
				test.done()
			},

			"Custom group.removeAll() doesn't conflict with global TWEEN group": function (test) {
				var group = new TWEEN.Group()

				TWEEN.removeAll()
				group.removeAll()

				test.equal(TWEEN.getAll().length, 0, 'No global tweens left')
				test.equal(group.getAll().length, 0, 'No group tweens left')

				var globalTween = new TWEEN.Tween({})
				var groupTweenA = new TWEEN.Tween({}, group)
				var groupTweenB = new TWEEN.Tween({}, group)

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

			"Global TWEEN.removeAll() doesn't conflict with custom group": function (test) {
				var group = new TWEEN.Group()

				TWEEN.removeAll()
				group.removeAll()

				test.equal(TWEEN.getAll().length, 0, 'No global tweens left')
				test.equal(group.getAll().length, 0, 'No group tweens left')

				var globalTween = new TWEEN.Tween({})
				var groupTweenA = new TWEEN.Tween({}, group)
				var groupTweenB = new TWEEN.Tween({}, group)

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

			"Custom group.add() doesn't conflict with global TWEEN group, or vice versa": function (test) {
				var group = new TWEEN.Group()

				var globalTween = new TWEEN.Tween({})
				var groupTweenA = new TWEEN.Tween({}, group)
				var groupTweenB = new TWEEN.Tween({}, group)

				var numGlobalTweens = TWEEN.getAll().length
				var numGroupTweens = group.getAll().length

				TWEEN.add(globalTween)
				group.add(groupTweenA)
				group.add(groupTweenB)

				test.equal(numGlobalTweens + 1, TWEEN.getAll().length)
				test.equal(numGroupTweens + 2, group.getAll().length)

				test.done()
			},

			"Custom group.update() doesn't conflict with global TWEEN group": function (test) {
				var group = new TWEEN.Group()

				var startObj = {x: 1}
				var endObj = {x: 2}
				var duration = 1000

				var globalObj = {x: 1}
				var globalTween = new TWEEN.Tween(globalObj).to(endObj, duration).start(0)

				var groupObj = {x: 1}
				var groupTween = new TWEEN.Tween(groupObj, group).to(endObj, duration).start(0)

				group.update(duration)

				test.deepEqual(globalObj, startObj)
				test.deepEqual(groupObj, endObj)
				test.done()
			},

			"Global TWEEN.update() doesn't conflict with custom group": function (test) {
				var group = new TWEEN.Group()

				var startObj = {x: 1}
				var endObj = {x: 2}
				var duration = 1000

				var globalObj = {x: 1}
				var globalTween = new TWEEN.Tween(globalObj).to(endObj, duration).start(0)

				var groupObj = {x: 1}
				var groupTween = new TWEEN.Tween(groupObj, group).to(endObj, duration).start(0)

				TWEEN.update(duration)

				test.deepEqual(globalObj, endObj)
				test.deepEqual(groupObj, startObj)
				test.done()
			},

			'Stopping a tween within an update callback will not cause an error.': function (test) {
				TWEEN.removeAll()

				var tweenA = new TWEEN.Tween({x: 1, y: 2})
					.to({x: 3, y: 4}, 1000)
					.onUpdate(function (values) {
						tweenB.stop()
					})
					.start(0)
				var tweenB = new TWEEN.Tween({x: 5, y: 6})
					.to({x: 7, y: 8})
					.onUpdate(function (values) {
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

			'Set the duration with .duration': function (test) {
				var obj = {x: 1}
				var t = new TWEEN.Tween(obj).to({x: 2}).duration(1000).start(0)

				t.update(1000)

				test.deepEqual(obj.x, 2)
				test.done()
			},

			'Get the duration with .getDuration': function (test) {
				var t = new TWEEN.Tween({}).to({}).duration(500).start();
				test.equal(t.getDuration(), 500);
				test.done();
			},

			"Tween.group sets the tween's group.": function (test) {
				var group = new TWEEN.Group()

				var groupTweenA = new TWEEN.Tween({}).group(group)

				groupTweenA.start()

				test.equal(group.getAll().length, 1)
				test.done()
			},

			'Test TWEEN.Tween.pause() and TWEEN.Tween.resume()': function (test) {
				var obj = {x: 0.0},
					t = new TWEEN.Tween(obj)

				t.to({x: 1.0}, 1000)

				TWEEN.removeAll()

				test.equal(TWEEN.getAll().length, 0)

				t.start(0)

				test.equal(TWEEN.getAll().length, 1)
				test.equal(t.isPaused(), false)

				TWEEN.update(400)

				test.equal(obj.x, 0.4)

				t.pause(450)

				test.equal(t.isPaused(), true)
				test.equal(TWEEN.getAll().length, 0)
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

			'Arrays in the object passed to to() are not modified by start().': function (test) {
				var start = {x: 10, y: 20}
				var end = {x: 100, y: 200, values: ['a', 'b']}
				var valuesArray = end.values
				new TWEEN.Tween(start).to(end).start()
				test.equal(valuesArray, end.values)
				test.equal(end.values.length, 2)
				test.equal(end.values[0], 'a')
				test.equal(end.values[1], 'b')
				test.done()
			},

			'Tween.js animate nested object': function (test) {
				var obj = {scale: {x: 0}, alpha: 0}

				var t = new TWEEN.Tween(obj).to({scale: {x: 100}, alpha: 100}, 100)
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

			'Tween.js animate nested object including relative value': function (test) {
				var obj = {world: {hero: {scale: {x: 0}, x: 100}}, time: 0}

				var t = new TWEEN.Tween(obj).to({world: {hero: {scale: {x: 100}, x: '+100'}}, time: 100}, 100)
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

			'Test TWEEN.Tween with nested objects': function (test) {
				var obj = {x: 0.0, y: 100, some: {value: 0.0, style: {opacity: 1.0}}},
					t = new TWEEN.Tween(obj)

				t.to({x: 1.0, y: 200, some: {value: 1.0, style: {opacity: 0.5}}}, 1000)

				TWEEN.removeAll()

				test.equal(TWEEN.getAll().length, 0)

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

			'Test TWEEN.Tween.pause() and .resume() with nested objects': function (test) {
				var obj = {x: 0.0, y: 100, some: {value: 0.0}},
					t = new TWEEN.Tween(obj)

				t.to({x: 1.0, y: 200, some: {value: 1.0}}, 1000)

				TWEEN.removeAll()

				test.equal(TWEEN.getAll().length, 0)

				t.start(0)

				test.equal(TWEEN.getAll().length, 1)
				test.equal(t.isPaused(), false)

				TWEEN.update(400)

				test.equal(obj.x, 0.4)
				test.equal(obj.y, 140)
				test.equal(obj.some.value, 0.4)

				t.pause(450)

				test.equal(t.isPaused(), true)
				test.equal(TWEEN.getAll().length, 0)
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
		}

		return tests
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = getTests
	} else {
		this.getTests = getTests
	}
}.call(this)
