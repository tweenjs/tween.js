// We will unit test both the original library and the minified version
var TWEEN_uncompressed = require('../../src/Tween.js');
var TWEEN_min = require('../../build/tween.min.js');
var getTests = require('./tests');

// Make the tests work outside of browsers.
global.window = {
	performance: {
		now: function() {
			return Date.now();
		}
	}
};

module.exports = {
	'tween': getTests(TWEEN_uncompressed),
	'tween_min': getTests(TWEEN_min)
};
