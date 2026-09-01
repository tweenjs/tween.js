import * as TWEEN from './Index.js'

// Bun's bundler has no UMD output format, so this entry point stands in for
// what rollup's `format: 'umd'` used to produce: a bundle that puts TWEEN on
// the global scope for consumers loading dist/tween.umd.js via a script tag.
Object.assign(globalThis, {TWEEN})
