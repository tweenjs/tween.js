module( 'TWEEN' );

test( "TWEEN.getAll()", function() {

	var	all = TWEEN.getAll();

	ok( all instanceof Object );

});

test( "TWEEN object stores tweens automatically on start", function() {

	var	numTweensBefore = TWEEN.getLength( TWEEN.getAll() ),
		t = new TWEEN.Tween({});

	t.start();

	var numTweensAfter = TWEEN.getLength( TWEEN.getAll() );

	equal( numTweensBefore + 1, numTweensAfter );

});

test( "TWEEN.removeAll()", function() {

	var	all = TWEEN.getAll(),
		t = new TWEEN.Tween({});

	TWEEN.removeAll();

	equal( TWEEN.getLength( TWEEN.getAll() ), 0, "No tweens left" );

	t.start();

	equal( TWEEN.getLength( TWEEN.getAll() ), 1, "A tween has been added" );

	TWEEN.removeAll();

	equal( TWEEN.getLength( TWEEN.getAll() ), 0, "No tweens left" );

});

test( "TWEEN.add()", function() {

	var	all = TWEEN.getAll(),
		numTweens = TWEEN.getLength( all ),
		t = new TWEEN.Tween({});

	TWEEN.add( t );

	equal( numTweens + 1, TWEEN.getLength( TWEEN.getAll() ) );
	equal( all, TWEEN.getAll() );

});

test( "TWEEN.remove()", function() {

	var	all = TWEEN.getAll(),
		numTweens = TWEEN.getLength( all ),
		t = new TWEEN.Tween({});

	TWEEN.add( t );

	ok( all[ t.id ] );

	TWEEN.remove( t );

	equal( numTweens, TWEEN.getLength( TWEEN.getAll() ) );
	equal( all, TWEEN.getAll() );
	equal( all[ t.id ] );

});

test( "TWEEN.update() returns false when done (no tweens to animate)", function() {

	TWEEN.removeAll();

	deepEqual( TWEEN.update(), false );

});

test( "TWEEN.update() returns true when there are active tweens", function() {

	TWEEN.removeAll();

	var t = new TWEEN.Tween( {} );
	t.start();

	deepEqual( TWEEN.update(), true );

});

test( "TWEEN.update() removes tweens when they are finished", function() {

	TWEEN.removeAll();

	var t1 = new TWEEN.Tween( {} ).to( {}, 1000 ),
		t2 = new TWEEN.Tween( {} ).to( {}, 2000 );

	equal( TWEEN.getLength( TWEEN.getAll() ), 0 );

	t1.start( 0 );
	t2.start( 0 );

	equal( TWEEN.getLength( TWEEN.getAll() ), 2 );

	TWEEN.update( 0 );
	equal( TWEEN.getLength( TWEEN.getAll() ), 2 );

	TWEEN.update( 999 );
	equal( TWEEN.getLength( TWEEN.getAll() ), 2 );

	TWEEN.update( 1000 );
	equal( TWEEN.getLength( TWEEN.getAll() ), 1 );
	equal( TWEEN.getAll()[ t1.id ] );
	ok( TWEEN.getAll()[ t2.id ] );


});
