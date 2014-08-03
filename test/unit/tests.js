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

			}

		};

		return tests;

	}

	if(typeof module !== 'undefined' && module.exports) {
		module.exports = getTests;
	} else {
		this.getTests = getTests;
	}
	
}).call(this);
