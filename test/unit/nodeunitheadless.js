// Make the tests work outside of browsers. The included polyfill will
// automatically include a perf.now() implementation
global.window = {};

// We will unit test both the original library and the minified version
var TWEEN_uncompressed = require('../../src/Tween.js');
var TWEEN_min = require('../../build/tween.min.js');
var getTests = require('./tests');

module.exports = {
	'tween': getTests(TWEEN_uncompressed),
	'tween_min': getTests(TWEEN_min)
};
