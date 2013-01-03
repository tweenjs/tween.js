module( 'Tweens' );

test( "constructor", function() {

	var	t = new TWEEN.Tween( {} );

	ok( t instanceof TWEEN.Tween, "Pass" );

});

test( "Return the same tween instance for method chaining", function() {

	var t = new TWEEN.Tween( {} );

	ok( t.to({}, 0) instanceof TWEEN.Tween );
	equal( t.to({}, 0), t );

	ok( t.start() instanceof TWEEN.Tween );
	equal( t.start(), t );

	ok( t.stop() instanceof TWEEN.Tween );
	equal( t.stop(), t );

	ok( t.delay() instanceof TWEEN.Tween );
	equal( t.delay(), t );

	ok( t.easing() instanceof TWEEN.Tween );
	equal( t.easing(), t );

	ok( t.interpolation() instanceof TWEEN.Tween );
	equal( t.interpolation(), t );

	ok( t.chain() instanceof TWEEN.Tween );
	equal( t.chain(), t );

	ok( t.onStart() instanceof TWEEN.Tween );
	equal( t.onStart(), t );

	ok( t.onUpdate() instanceof TWEEN.Tween );
	equal( t.onUpdate(), t );

	ok( t.onComplete() instanceof TWEEN.Tween );
	equal( t.onComplete(), t );
});

test( "Tween existing property", function() {

	var obj = { x: 1 },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );
	t.start( 0 );
	t.update( 1000 );

	deepEqual( obj.x, 2 );

});

test( "Tween non-existing property", function() {

	var obj = { x: 1 },
		t = new TWEEN.Tween( obj );

	t.to( { y: 0 }, 1000 );
	t.start( 0 );
	t.update( 1000 );
	
	deepEqual( obj.y, undefined );

});

test( "Tween non-null property", function() {

	var obj = { x: 1 },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );
	t.start( 0 );
	t.update( 1000 );
	
	deepEqual( obj.x, 2 );
	ok( obj.x !== null );

});

test( "Tween null property", function() {

	var obj = { },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );
	t.start( 0 );
	t.update( 1000 );
	
	deepEqual( obj.x, undefined );

});

test( "Test TWEEN.Tween.start()", function() {

	var obj = { },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );

	TWEEN.removeAll();
	equal( TWEEN.getAll().length, 0 ); // TODO move to TWEEN test

	t.start( 0 );

	equal( TWEEN.getAll().length, 1 ); // TODO ditto
	equal( TWEEN.getAll()[0], t );

});


test( "Test TWEEN.Tween.stop()", function() {

	var obj = { },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );

	TWEEN.removeAll();

	t.start();
	t.stop();

	equal( TWEEN.getAll().length, 0 );

});

test( "Test TWEEN.Tween.delay()", function() {

	var obj = { x: 1 },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );
	t.delay( 500 );
	t.start( 0 );

	t.update( 100 );

	deepEqual( obj.x, 1, "Tween hasn't started yet" );

	t.update( 1000 );
	
	ok( (obj.x !== 1) && (obj.x !== 2), "Tween has started but hasn't finished yet" );
	
	t.update( 1500 );

	equal( obj.x, 2, "Tween finishes when expected" );

});

// TODO: not really sure how to test this. Advice appreciated!
test( "Test TWEEN.Tween.easing()", function() {

	var obj = { x: 0 },
		t = new TWEEN.Tween( obj );

	t.to( { x: 1 }, 1000 );

	t.easing( TWEEN.Easing.Quadratic.In );
	t.start( 0 );
	t.update( 500 );
	equal( obj.x, TWEEN.Easing.Quadratic.In( 0.5 ) );
	
});

// TODO test interpolation()

test( "Test TWEEN.Tween.chain --with one tween", function() {

	var	t = new TWEEN.Tween( {} ),
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
		equal( tStarted, true );
		equal( tCompleted, true );
		equal( t2Started, false );
		t2Started = true;
	});

	equal( tStarted, false );
	equal( t2Started, false );

	t.start( 0 );
	TWEEN.update( 0 );

	equal( tStarted, true );
	equal( t2Started, false );

	TWEEN.update( 1000 );

	equal( tCompleted, true );

	TWEEN.update( 1001 );

	equal( t2Started, true, 't2 is automatically started by t' );

});


test( "Test TWEEN.Tween.onStart", function() {

	var obj = { },
		t = new TWEEN.Tween( obj ),
		counter = 0;

	t.to( { x: 2 }, 1000 );
	t.onStart( function() {
		ok( true, "onStart callback is called" );
		counter++;
	});
	
	deepEqual( counter, 0 );

	t.start( 0 );
	TWEEN.update( 0 );

	deepEqual( counter, 1 );

	TWEEN.update( 500 );

	deepEqual( counter, 1, "onStart callback is not called again" );

});

test( "Test TWEEN.Tween.onUpdate", function() {

	var obj = { },
		t = new TWEEN.Tween( obj ),
		counter = 0;

	t.to( { x: 2 }, 1000 );
	t.onUpdate( function() {
		counter++;
	});
	
	deepEqual( counter, 0 );

	t.start( 0 );

	TWEEN.update( 0 );
	deepEqual( counter, 1 );

	TWEEN.update( 500 );
	deepEqual( counter, 2 );

	TWEEN.update( 600 );
	deepEqual( counter, 3 );

	TWEEN.update( 1000 );
	deepEqual( counter, 4 );

	TWEEN.update( 1500 );
	deepEqual( counter, 4, 'onUpdate callback should not be called after the tween has finished' );

});

test( "Test TWEEN.Tween.onComplete", function() {

	var obj = { },
		t = new TWEEN.Tween( obj ),
		counter = 0;

	t.to( { x: 2 }, 1000 );
	t.onComplete( function() {
		counter++;
	});
	
	deepEqual( counter, 0 );

	t.start( 0 );

	TWEEN.update( 0 );
	deepEqual( counter, 0 );

	TWEEN.update( 500 );
	deepEqual( counter, 0 );

	TWEEN.update( 600 );
	deepEqual( counter, 0 );

	TWEEN.update( 1000 );
	deepEqual( counter, 1 );

	TWEEN.update( 1500 );
	deepEqual( counter, 1, 'onComplete callback must be called only once' );

});


