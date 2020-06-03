var TWEEN_uncompressed = require('../../dist/tween.cjs.js')
var getTests = require('./tests')

module.exports = {
	tween: getTests(TWEEN_uncompressed),
}
