import * as TWEEN from './Index'
import {tests} from './tests'

// Browser entry point for test/unit/nodeunit.html, which reads `TWEEN.tests`.
Object.assign(globalThis, {TWEEN: {...TWEEN, tests}})
