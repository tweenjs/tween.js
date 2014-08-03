(function() {

	function getTests(TWEEN) {
		
		var tests = {
			'hello': function(test) {
				test.ok(TWEEN !== null);
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
