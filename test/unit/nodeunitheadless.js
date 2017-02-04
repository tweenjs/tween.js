// We will unit test both the original library and the minified version
var TWEEN_uncompressed = require('../../src/Tween.js');
var getTests = require('./tests');

module.exports = {
	'tween': getTests(TWEEN_uncompressed)
};
