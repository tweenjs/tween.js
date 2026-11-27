// Ensure we can import into Node ESM:

import * as TWEEN from '@tweenjs/tween.js'

console.log(Object.keys(TWEEN))

const tween = new TWEEN.Tween()

console.log(Object.keys(tween))
