module( 'TWEEN' );

test( "TWEEN.getAll()", function() {

	var	all = TWEEN.getAll();

	ok( all instanceof Array );

});


test( "TWEEN object stores tweens automatically on start", function() {

	var	numTweensBefore = TWEEN.getAll().length,
		t = new TWEEN.Tween({});

	t.start();

	var numTweensAfter = TWEEN.getAll().length;

	equal( numTweensBefore + 1, numTweensAfter );

});

test( "TWEEN.removeAll()", function() {

	var	all = TWEEN.getAll(),
		t = new TWEEN.Tween({});

	TWEEN.removeAll();

	equal( TWEEN.getAll().length, 0, "No tweens left" );

	t.start();

	equal( TWEEN.getAll().length, 1, "A tween has been added" );

	TWEEN.removeAll();

	equal( TWEEN.getAll().length, 0, "No tweens left" );

});

test( "TWEEN.add()", function() {

	var	all = TWEEN.getAll(),
		numTweens = all.length,
		t = new TWEEN.Tween({});

	TWEEN.add( t );

	equal( numTweens + 1, TWEEN.getAll().length );
	equal( all, TWEEN.getAll() );

});

test( "TWEEN.remove()", function() {

	var	all = TWEEN.getAll(),
		numTweens = all.length,
		t = new TWEEN.Tween({});

	TWEEN.add( t );

	ok( all.indexOf( t ) != -1 );

	TWEEN.remove( t );

	equal( numTweens, TWEEN.getAll().length );
	equal( all, TWEEN.getAll() );
	equal( all.indexOf( t ), -1 );

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
