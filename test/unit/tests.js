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
