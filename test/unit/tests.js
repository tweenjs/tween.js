(function() {

	function getTests(TWEEN) {

		var tests = {
			'hello': function(test) {
				test.ok(TWEEN !== null);
				test.done();
			},

			// TWEEN tests
			'TWEEN.getAll': function(test) {
				test.ok(TWEEN.getAll() instanceof Array);
				test.done();
			},

			'TWEEN object stores tweens automatically on start': function(test) {

				var numTweensBefore = TWEEN.getAll().length,
					t = new TWEEN.Tween({});

				t.start();

				var numTweensAfter = TWEEN.getAll().length;

				test.equal( numTweensBefore + 1, numTweensAfter );
				test.done();

			},

			'TWEEN.removeAll()': function(test) {

				var all = TWEEN.getAll(),
					t = new TWEEN.Tween({});

				TWEEN.removeAll();

				test.equal( TWEEN.getAll().length, 0, "No tweens left" );

				t.start();

				test.equal( TWEEN.getAll().length, 1, "A tween has been added" );

				TWEEN.removeAll();

				test.equal( TWEEN.getAll().length, 0, "No tweens left" );
				test.done();

			},

			'TWEEN.add()': function(test) {

				var all = TWEEN.getAll(),
					numTweens = all.length,
					t = new TWEEN.Tween({});

				TWEEN.add( t );

				test.equal( numTweens + 1, TWEEN.getAll().length );
				test.equal( all, TWEEN.getAll() );
				test.done();

			},

			'TWEEN.remove()': function(test) {

				var all = TWEEN.getAll(),
					numTweens = all.length,
					t = new TWEEN.Tween({});

				TWEEN.add( t );

				test.ok( all.indexOf( t ) != -1 );

				TWEEN.remove( t );

				test.equal( numTweens, TWEEN.getAll().length );
				test.equal( all, TWEEN.getAll() );
				test.equal( all.indexOf( t ), -1 );
				test.done();

			},

			'TWEEN.update() returns false when done (no tweens to animate)': function(test) {

				TWEEN.removeAll();

				test.deepEqual( TWEEN.update(), false );
				test.done();

			},

			'TWEEN.update() returns true when there are active tweens': function(test) {

				TWEEN.removeAll();

				var t = new TWEEN.Tween( {} );
				t.start();

				test.deepEqual( TWEEN.update(), true );
				test.done();

			},

			'TWEEN.update() removes tweens when they are finished': function(test) {

				TWEEN.removeAll();

				var t1 = new TWEEN.Tween( {} ).to( {}, 1000 ),
					t2 = new TWEEN.Tween( {} ).to( {}, 2000 );

				test.equal( TWEEN.getAll().length, 0 );

				t1.start( 0 );
				t2.start( 0 );

				test.equal( TWEEN.getAll().length, 2 );

				TWEEN.update( 0 );
				test.equal( TWEEN.getAll().length, 2 );

				TWEEN.update( 999 );
				test.equal( TWEEN.getAll().length, 2 );

				TWEEN.update( 1000 );
				test.equal( TWEEN.getAll().length, 1 );
				test.equal( TWEEN.getAll().indexOf( t1 ), -1 );
				test.ok( TWEEN.getAll().indexOf( t2 ) != -1 );
				test.done();

			},
			'TWEEN.update() does not remove tweens when they are finished with preserve flag': function(test) {

				TWEEN.removeAll();

				var t1 = new TWEEN.Tween( {} ).to( {}, 1000 ),
					t2 = new TWEEN.Tween( {} ).to( {}, 2000 );

				test.equal( TWEEN.getAll().length, 0 );

				t1.start( 0 );
				t2.start( 0 );

				test.equal( TWEEN.getAll().length, 2 );

				TWEEN.update(0, true);
				test.equal( TWEEN.getAll().length, 2 );

				TWEEN.update(999, true);
				test.equal( TWEEN.getAll().length, 2 );

				TWEEN.update(1000, true);
				test.equal( TWEEN.getAll().length, 2 );

				TWEEN.update(1001, true);
				test.equal( TWEEN.getAll().length, 2 );
				test.ok( TWEEN.getAll().indexOf( t1 ) != -1 );
				test.ok( TWEEN.getAll().indexOf( t2 ) != -1 );
				test.done();
			},


			'Unremoved tweens which have been updated past their finish time may be reused': function(test) {

				TWEEN.removeAll();

				var target1 = {a:0};
				var target2 = {b:0};

				var t1 = new TWEEN.Tween( target1 ).to( {a:1}, 1000 ),
					t2 = new TWEEN.Tween( target2 ).to( {b:1}, 2000 );

				t1.start( 0 );
				t2.start( 0 );

				TWEEN.update(200, true);
				TWEEN.update(2500, true);
				TWEEN.update(500, true);

				test.equal(TWEEN.getAll().length, 2);
				test.equal(target1.a, 0.5);
				test.equal(target2.b, 0.25);

				test.done();
			},


			// TWEEN.Tween tests

			'constructor': function(test) {

				var t = new TWEEN.Tween( {} );

				test.ok( t instanceof TWEEN.Tween, "Pass" );
				test.done();

			},

			'Return the same tween instance for method chaining': function(test) {

				var t = new TWEEN.Tween( {} );

				test.ok( t.to({}, 0) instanceof TWEEN.Tween );
				test.equal( t.to({}, 0), t );

				test.ok( t.start() instanceof TWEEN.Tween );
				test.equal( t.start(), t );

				test.ok( t.stop() instanceof TWEEN.Tween );
				test.equal( t.stop(), t );

				test.ok( t.delay() instanceof TWEEN.Tween );
				test.equal( t.delay(), t );

				test.ok( t.easing() instanceof TWEEN.Tween );
				test.equal( t.easing(), t );

				test.ok( t.interpolation() instanceof TWEEN.Tween );
				test.equal( t.interpolation(), t );

				test.ok( t.chain() instanceof TWEEN.Tween );
				test.equal( t.chain(), t );

				test.ok( t.onStart() instanceof TWEEN.Tween );
				test.equal( t.onStart(), t );

				test.ok( t.onStop() instanceof TWEEN.Tween );
				test.equal( t.onStop(), t );

				test.ok( t.onUpdate() instanceof TWEEN.Tween );
				test.equal( t.onUpdate(), t );

				test.ok( t.onComplete() instanceof TWEEN.Tween );
				test.equal( t.onComplete(), t );

				test.done();

			},

			'Tween existing property': function(test) {

				var obj = { x: 1 },
					t = new TWEEN.Tween( obj );

				t.to( { x: 2 }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.deepEqual( obj.x, 2 );
				test.done();

			},

			'Tween non-existing property': function(test) {

				var obj = { x: 1 },
					t = new TWEEN.Tween( obj );

				t.to( { y: 0 }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.deepEqual( obj.x, 1 );
				test.equal( obj.y, undefined );
				test.done();

			},

			'Tween non-null property': function(test) {

				var obj = { x: 1 },
					t = new TWEEN.Tween( obj );

				t.to( { x: 2 }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.deepEqual( obj.x, 2 );
				test.ok( obj.x !== null );
				test.done();

			},

			'Tween function property': function(test) {

				var my_function = function() {};

				var obj = { x: my_function },
					t = new TWEEN.Tween( obj );

				t.to( { x: my_function } );
				t.start( 0 );
				t.update( 1000 );

				test.ok( obj.x === my_function );
				test.done();

			},

			'Tween boolean property': function(test) {

				var obj = { x: true },
					t = new TWEEN.Tween( obj );

				t.to( { x: function() {} } );
				t.start( 0 );
				t.update( 1000 );

				test.ok( typeof obj.x === "boolean" );
				test.ok( obj.x );
				test.done();

			},

			'Tween null property': function(test) {

				var obj = { x: null },
					t = new TWEEN.Tween( obj );

				t.to( { x: 2 }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.deepEqual( obj.x, 2 );
				test.done();

			},

			'Tween undefined property': function(test) {

				var obj = { },
					t = new TWEEN.Tween( obj );

				t.to( { x: 2 }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.equal( obj.x, undefined );
				test.done();

			},

			'Tween relative positive value, with sign': function(test) {

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj );

				t.to( { x: "+100" }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.equal( obj.x, 100 );
				test.done();

			},

			'Tween relative negative value': function(test) {

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj );

				t.to( { x: "-100" }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.equal( obj.x, -100 );
				test.done();

			},

			'String values without a + or - sign should not be interpreted as relative': function(test) {

				var obj = { x: 100 },
					t = new TWEEN.Tween( obj );

				t.to( { x: "100" }, 1000 );
				t.start( 0 );
				t.update( 1000 );

				test.equal( obj.x, 100 );
				test.done();

			},

			'Test TWEEN.Tween.start()': function(test) {

				var obj = { },
					t = new TWEEN.Tween( obj );

				t.to( { }, 1000 );

				TWEEN.removeAll();
				test.equal( TWEEN.getAll().length, 0 ); // TODO move to TWEEN test

				t.start( 0 );

				test.equal( TWEEN.getAll().length, 1 ); // TODO ditto
				test.equal( TWEEN.getAll()[0], t );
				test.done();

			},

			'Test TWEEN.Tween.stop()': function(test) {

				var obj = { },
					t = new TWEEN.Tween( obj );

				t.to( { x: 2 }, 1000 );

				TWEEN.removeAll();

				t.start();
				t.stop();

				test.equal( TWEEN.getAll().length, 0 );
				test.done();

			},

			'Test TWEEN.Tween.delay()': function(test) {

				var obj = { x: 1 },
					t = new TWEEN.Tween( obj );

				t.to( { x: 2 }, 1000 );
				t.delay( 500 );
				t.start( 0 );

				t.update( 100 );

				test.deepEqual( obj.x, 1, "Tween hasn't started yet" );

				t.update( 1000 );

				test.ok( (obj.x !== 1) && (obj.x !== 2), "Tween has started but hasn't finished yet" );

				t.update( 1500 );

				test.equal( obj.x, 2, "Tween finishes when expected" );
				test.done();

			},

			// TODO: not really sure how to test this. Advice appreciated!
			'Test TWEEN.Tween.easing()': function(test) {

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj );

				t.to( { x: 1 }, 1000 );

				t.easing( TWEEN.Easing.Quadratic.In );
				t.start( 0 );
				t.update( 500 );
				test.equal( obj.x, TWEEN.Easing.Quadratic.In( 0.5 ) );
				test.done();

			},

			// TODO test interpolation()

			'Test TWEEN.Tween.chain --with one tween': function(test) {

				var t = new TWEEN.Tween( {} ),
					tStarted = false,
					tCompleted = false,
					t2 = new TWEEN.Tween( {} ),
					t2Started = false;

				TWEEN.removeAll();

				t.to( {}, 1000 );
				t2.to( {}, 1000 );

				t.chain( t2 );

				t.onStart(function() {
					tStarted = true;
				});

				t.onComplete(function() {
					tCompleted = true;
				});

				t2.onStart(function() {
					test.equal( tStarted, true );
					test.equal( tCompleted, true );
					test.equal( t2Started, false );
					t2Started = true;
				});

				test.equal( tStarted, false );
				test.equal( t2Started, false );

				t.start( 0 );
				TWEEN.update( 0 );

				test.equal( tStarted, true );
				test.equal( t2Started, false );

				TWEEN.update( 1000 );

				test.equal( tCompleted, true );

				TWEEN.update( 1001 );

				test.equal( t2Started, true, 't2 is automatically started by t' );
				test.done();

			},

			'Test TWEEN.Tween.chain --with several tweens in an array': function(test) {

				var t = new TWEEN.Tween( {} ),
					chainedTweens = [],
					numChained = 3,
					numChainedStarted = 0;

				TWEEN.removeAll();

				t.to( {}, 1000 );

				function onChainedStart() {
					numChainedStarted++;
				}

				for(var i = 0; i < numChained; i++ ){
					var chained = new TWEEN.Tween( {} );
						chained.to( {}, 1000 );

					chainedTweens.push( chained );

					chained.onStart(onChainedStart);
				}

				// NOTE: This is not the normal way to chain several tweens simultaneously
				// The usual way would be to specify them explicitly:
				// t.chain( tween1, tween2, ... tweenN)
				// ... not to use apply to send an array of tweens
				t.chain.apply( t, chainedTweens );

				test.equal( numChainedStarted, 0 );

				t.start( 0 );
				TWEEN.update( 0 );
				TWEEN.update( 1000 );
				TWEEN.update( 1001 );

				test.equal( numChainedStarted, numChained, 'All chained tweens have been started' );
				test.done();

			},

			'Test TWEEN.Tween.chain allows endless loops': function(test) {

				var obj = { x: 0 },
					t1 = new TWEEN.Tween( obj ).to( { x: 100 }, 1000 ),
					t2 = new TWEEN.Tween( obj ).to( { x: 0 }, 1000 );

				TWEEN.removeAll();

				t1.chain( t2 );
				t2.chain( t1 );

				test.equal( obj.x, 0 );

				// x == 0
				t1.start( 0 );
				TWEEN.update( 0 );

				test.equal( obj.x, 0 );

				TWEEN.update( 500 );
				test.equal( obj.x, 50 );

				// there... (x == 100)

				TWEEN.update( 1000 );
				test.equal( obj.x, 100 );

				TWEEN.update( 1500 );
				test.equal( obj.x, 50 );

				// ... and back again (x == 0)

				TWEEN.update( 2000 );
				test.equal( obj.x, 0);

				TWEEN.update( 2500 );
				test.equal( obj.x, 50 );

				TWEEN.update( 3000 );
				test.equal( obj.x, 100 ); // and x == 100 again
				test.done();

			},

			'Test TWEEN.Tween.onStart': function(test) {

				var obj = { },
					t = new TWEEN.Tween( obj ),
					counter = 0;

				t.to( { x: 2 }, 1000 );
				t.onStart( function() {
					test.ok( true, "onStart callback is called" );
					counter++;
				});

				test.deepEqual( counter, 0 );

				t.start( 0 );
				TWEEN.update( 0 );

				test.deepEqual( counter, 1 );

				TWEEN.update( 500 );

				test.deepEqual( counter, 1, "onStart callback is not called again" );
				test.done();

			},

			'Test TWEEN.Tween.onStop': function(test) {

				var obj = { },
					t = new TWEEN.Tween( obj ),
					counter = 0;

				t.to( { x: 2 }, 1000 );
				t.onStop( function() {
					test.ok( true, "onStop callback is called" );
					counter++;
				});

				test.deepEqual( counter, 0 );

				t.stop();
				TWEEN.update(0);

				test.deepEqual( counter, 0, "onStop callback not called when the tween hasn't started yet");

				t.start( 0 );
				TWEEN.update( 0 );
				t.stop();

				test.deepEqual( counter, 1, "onStop callback is called if the tween has been started already and stop is invoked");

				TWEEN.update( 500 );
				t.stop();

				test.deepEqual( counter, 1, "onStop callback is not called again once the tween is stopped" );
				test.done();

			},

			'Test TWEEN.Tween.onUpdate': function(test) {

				var obj = { },
					t = new TWEEN.Tween( obj ),
					counter = 0;

				t.to( { x: 2 }, 1000 );
				t.onUpdate( function() {
					counter++;
				});

				test.deepEqual( counter, 0 );

				t.start( 0 );

				TWEEN.update( 0 );
				test.deepEqual( counter, 1 );

				TWEEN.update( 500 );
				test.deepEqual( counter, 2 );

				TWEEN.update( 600 );
				test.deepEqual( counter, 3 );

				TWEEN.update( 1000 );
				test.deepEqual( counter, 4 );

				TWEEN.update( 1500 );
				test.deepEqual( counter, 4, 'onUpdate callback should not be called after the tween has finished' );

				test.done();

			},

			'Test TWEEN.Tween.onComplete': function(test) {

				var obj = { },
					t = new TWEEN.Tween( obj ),
					counter = 0;

				t.to( { x: 2 }, 1000 );
				t.onComplete( function() {
					counter++;
				});

				test.deepEqual( counter, 0 );

				t.start( 0 );

				TWEEN.update( 0 );
				test.deepEqual( counter, 0 );

				TWEEN.update( 500 );
				test.deepEqual( counter, 0 );

				TWEEN.update( 600 );
				test.deepEqual( counter, 0 );

				TWEEN.update( 1000 );
				test.deepEqual( counter, 1 );

				TWEEN.update( 1500 );
				test.deepEqual( counter, 1, 'onComplete callback must be called only once' );
				test.done();

			},

			'TWEEN.Tween does not repeat by default': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 );

				t.start( 0 );

				TWEEN.update( 0 );
				test.equal( obj.x, 0 );

				TWEEN.update( 50 );
				test.equal( obj.x, 50 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );

				TWEEN.update( 150 );
				test.equal( obj.x, 100 );
				test.done();

			},

			'Test single repeat happens only once': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( 1 );

				t.start( 0 );

				TWEEN.update( 0 );
				test.equal( obj.x, 0 );

				TWEEN.update( 50 );
				test.equal( obj.x, 50 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );

				TWEEN.update( 150 );
				test.equal( obj.x, 50 );

				TWEEN.update( 200 );
				test.equal( obj.x, 100 );
				test.done();

			},

			'Test Infinity repeat happens forever': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( Infinity );

				t.start( 0 );

				TWEEN.update( 0 );
				test.equal( obj.x, 0 );

				TWEEN.update( 50 );
				test.equal( obj.x, 50 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );

				TWEEN.update( 150 );
				test.equal( obj.x, 50 );

				TWEEN.update( 200 );
				test.equal( obj.x, 100 );

				TWEEN.update( 250 );
				test.equal( obj.x, 50 );
				test.done();

			},

			'Test tweening relatively with repeat': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0, y: 0 },
					t = new TWEEN.Tween( obj ).to( { x: "+100", y: "-100" }, 100 ).repeat( 1 );

				t.start( 0 );

				TWEEN.update( 0 );
				test.equal( obj.x, 0 );
				test.equal( obj.y, 0 );

				TWEEN.update( 50 );
				test.equal( obj.x, 50 );
				test.equal( obj.y, -50 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );
				test.equal( obj.y, -100 );

				TWEEN.update( 150 );
				test.equal( obj.x, 150 );
				test.equal( obj.y, -150 );

				TWEEN.update( 200 );
				test.equal( obj.x, 200 );
				test.equal( obj.y, -200 );
				test.done();

			},

			'Test yoyo with repeat Infinity happens forever': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( Infinity ).yoyo(true);

				t.start( 0 );

				TWEEN.update( 0 );
				test.equal( obj.x, 0 );

				TWEEN.update( 25 );
				test.equal( obj.x, 25 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );

				TWEEN.update( 125 );
				test.equal( obj.x, 75 );

				TWEEN.update( 200 );
				test.equal( obj.x, 0 );

				TWEEN.update( 225 );
				test.equal( obj.x, 25 );
				test.done();

			},

			'Test yoyo with repeat 1 happens once': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( 1 ).yoyo(true);

				t.start( 0 );

				TWEEN.update( 0 );
				test.equal( obj.x, 0 );

				TWEEN.update( 25 );
				test.equal( obj.x, 25 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );

				TWEEN.update( 125 );
				test.equal( obj.x, 75 );

				TWEEN.update( 200 );
				test.equal( obj.x, 0 );

				TWEEN.update( 225 );
				test.equal( obj.x, 0 );
				test.done();
			},


			'Test TWEEN.Tween.stopChainedTweens()': function(test) {
				var t = new TWEEN.Tween( {} ),
					tStarted = false,
					tCompleted = false,
					t2 = new TWEEN.Tween( {} ),
					t2Started = false;

				TWEEN.removeAll();

				t.to( {}, 1000 );
				t2.delay(500).to( {}, 1000 );

				t.chain( t2 );
				t2.chain( t );

				t.onStart(function() {
					tStarted = true;
				});

				t.onComplete(function() {
					tCompleted = true;
				});

				t2.onStart(function() {
					test.equal( tStarted, true );
					test.equal( tCompleted, true );
					test.equal( t2Started, false );
					t2Started = true;
				});

				test.equal( tStarted, false );
				test.equal( t2Started, false );

				t.start( 0 );
				TWEEN.update( 1001 );
				t.stop();

				test.equal( tStarted, true );
				test.equal( t2Started, false );
				test.equal( TWEEN.getAll().length, 0 );
				test.done();

			},

			'Test TWEEN.Tween.chain progressess into chained tweens': function(test) {

				var obj = { t: 1000 };

				// 1000 of nothing
				var blank = new TWEEN.Tween({}).to({}, 1000);

				// tween obj.t from 1000 -> 2000 (in time with update time)
				var next  = new TWEEN.Tween(obj).to({ t: 2000 }, 1000);

				blank.chain(next).start(0);

				TWEEN.update(1500);
				test.equal(obj.t, 1500);

				TWEEN.update(2000);
				test.equal(obj.t, 2000);

				test.done();

			},

			'Test that TWEEN.Tween.end sets the final values.': function(test) {

				var object1 = {x: 0, y: -50, z: 1000};
				var target1 = {x: 50, y: 123, z: '+234'};

				var tween1 = new TWEEN.Tween(object1).to(target1, 1000);

				tween1.start();
				tween1.end();

				test.equal(object1.x, 50);
				test.equal(object1.y, 123);
				test.equal(object1.z, 1234);

				var object2 = {x: 0, y: -50, z: 1000};
				var target2 = {x: 50, y: 123, z: '+234'};

				var tween2 = new TWEEN.Tween(object2).to(target2, 1000);

				tween2.start(300);
				tween2.update(500);
				tween2.end();

				test.equal(object2.x, 50);
				test.equal(object2.y, 123);
				test.equal(object2.z, 1234);

				test.done();
			},

			'Test that TWEEN.Tween.end calls the onComplete callback of the tween.': function(test) {

				test.expect(1);

				var tween1 = new TWEEN.Tween({}).to({}, 1000).onComplete(function () {
					test.ok(true);
				});

				tween1.start();
				tween1.end();

				test.done();

			},

			'Test delay adds delay before each repeat': function(test) {

				// If repeatDelay isn't specified then delay is used since
				// that's the way it worked before repeatDelay was added.

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( 1 ).delay(100);

				t.start( 0 );

				TWEEN.update( 100 );
				test.equal( obj.x, 0 );

				TWEEN.update( 150 );
				test.equal( obj.x, 50 );

				TWEEN.update( 200 );
				test.equal( obj.x, 100 );

				TWEEN.update( 250 );
				test.equal( obj.x, 100 );

				TWEEN.update( 300 );
				test.equal( obj.x, 0 );

				TWEEN.update( 350 );
				test.equal( obj.x, 50 );

				TWEEN.update( 400 );
				test.equal( obj.x, 100 );

				test.done();

			},

			'Test repeatDelay adds delay before each repeat': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).repeat( 1 ).repeatDelay(200);

				t.start( 0 );

				TWEEN.update( 0 );
				test.equal( obj.x, 0 );

				TWEEN.update( 50 );
				test.equal( obj.x, 50 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );

				TWEEN.update( 200 );
				test.equal( obj.x, 100 );

				TWEEN.update( 300 );
				test.equal( obj.x, 0 );

				TWEEN.update( 350 );
				test.equal( obj.x, 50 );

				TWEEN.update( 400 );
				test.equal( obj.x, 100 );

				test.done();

			},

			'Test repeatDelay and delay can be used together': function(test) {

				TWEEN.removeAll();

				var obj = { x: 0 },
					t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 ).delay(100).repeat( 1 ).repeatDelay(200);

				t.start( 0 );

				TWEEN.update( 100 );
				test.equal( obj.x, 0 );

				TWEEN.update( 150 );
				test.equal( obj.x, 50 );

				TWEEN.update( 200 );
				test.equal( obj.x, 100 );

				TWEEN.update( 300 );
				test.equal( obj.x, 100 );

				TWEEN.update( 400 );
				test.equal( obj.x, 0 );

				TWEEN.update( 450 );
				test.equal( obj.x, 50 );

				TWEEN.update( 500 );
				test.equal( obj.x, 100 );

				test.done();

			},

			'Tween.js compatible with Object.defineProperty getter / setters': function(test) {

				var obj = { _x: 0 };

				Object.defineProperty( obj, 'x', {
					get: function() {
						return this._x;
					},
					set: function( x ) {
						this._x = x;
					}
				});

				test.equal( obj.x, 0 );

				var t = new TWEEN.Tween( obj ).to( { x: 100 }, 100 );

				t.start( 0 );

				test.equal( obj.x, 0 );

				TWEEN.update( 37 );
				test.equal( obj.x, 37 );

				TWEEN.update( 100 );
				test.equal( obj.x, 100 );

				TWEEN.update( 115 );
				test.equal( obj.x, 100 );

				test.done();

			},

			'Tween.js animate nested object': function(test) {

				var obj = { scale: { x: 0 } };

				var t = new TWEEN.Tween( obj ).to( { 'scale.x': 100 }, 100 );
				t.start( 0 );

				test.equal( obj.scale.x, 0 );

				TWEEN.update( 37 );
				test.equal( obj.scale.x, 37 );

				TWEEN.update( 100 );
				test.equal( obj.scale.x, 100 );

				TWEEN.update( 115 );
				test.equal( obj.scale.x, 100 );

				test.done();

			},


			'Tween.js animate complex nested object': function(test) {

				var obj = { world: { hero: { scale: { x: 0 }, x: 100 } }, time: 0 };

				var t = new TWEEN
					.Tween( obj )
					.to( {
						'world.hero.scale.x': 100,
						'world.hero.x': '+100',
						'time': 100,
					}, 100 );
				t.start( 0 );

				test.equal( obj.world.hero.scale.x, 0 );

				TWEEN.update( 37 );
				test.equal( obj.world.hero.scale.x, 37 );
				test.equal( obj.world.hero.x, 137 );
				test.equal( obj.time, 37 );

				TWEEN.update( 100 );
				test.equal( obj.world.hero.scale.x, 100 );
				test.equal( obj.world.hero.x, 200 );
				test.equal( obj.time, 100 );

				TWEEN.update( 115 );
				test.equal( obj.world.hero.scale.x, 100 );
				test.equal( obj.world.hero.x, 200 );
				test.equal( obj.time, 100 );

				test.done();

			},

			'Tween.js protect wrong path in nested object': function(test) {

				var obj = { world: { hero: { scale: { x: 0 } } } };

				var t = new TWEEN.Tween( obj ).to( { 'world.x': 100 }, 100 );
				t.start( 0 );

				test.equal( obj.world.hero.scale.x, 0 );

				TWEEN.update( 37 );
				test.equal( obj.world.hero.scale.x, 0 );

				TWEEN.update( 100 );
				test.equal( obj.world.hero.scale.x, 0 );

				TWEEN.update( 115 );
				test.equal( obj.world.hero.scale.x, 0 );

				test.equal( obj.world.x, undefined );

				test.done();

			},

			'Tween.js animation flat property with array': function(test) {

				var obj = { scale: { x: 0 } };

				var t = new TWEEN.Tween( obj ).to( { 'scale.x': [ 50, 100 ] }, 100 );
				t.start( 0 );

				test.equal( obj.scale.x, 0 );

				TWEEN.update( 37 );
				test.equal( obj.scale.x, 37 );

				TWEEN.update( 100 );
				test.equal( obj.scale.x, 100 );

				TWEEN.update( 115 );
				test.equal( obj.scale.x, 100 );

				test.done();

			},

			'Tween.js animation flat property with array and relative values': function(test) {

				var obj = { scale: { x: 100 } };

				var t = new TWEEN.Tween( obj ).to( { 'scale.x': [ '+50', '+100' ] }, 100 );
				t.start( 0 );

				test.equal( obj.scale.x, 100 );

				TWEEN.update( 37 );
				test.equal( obj.scale.x, 137 );

				TWEEN.update( 100 );
				test.equal( obj.scale.x, 200 );

				TWEEN.update( 115 );
				test.equal( obj.scale.x, 200 );

				test.done();

			},

			'Tween.js animation with array and relative values': function(test) {

				var obj = { x: 100 };

				var t = new TWEEN.Tween( obj ).to( { x: [ '+50', '+100' ] }, 100 );
				t.start( 0 );

				test.equal( obj.x, 100 );

				TWEEN.update( 37 );
				test.equal( obj.x, 137 );

				TWEEN.update( 100 );
				test.equal( obj.x, 200 );

				TWEEN.update( 115 );
				test.equal( obj.x, 200 );

				test.done();

			},

		};

		return tests;

	}

	if(typeof module !== 'undefined' && module.exports) {
		module.exports = getTests;
	} else {
		this.getTests = getTests;
	}

}).call(this);
