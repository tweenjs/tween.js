// Ensure we can import into Node CommonJS:

const TWEEN = require('@tweenjs/tween.js')

console.log(Object.keys(TWEEN))

const tween = new TWEEN.Tween()

console.log(Object.keys(tween))
