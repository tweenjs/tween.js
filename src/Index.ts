/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

import Easing from './Easing'
import Group from './Group'
import Interpolation from './Interpolation'
import now, { setNow } from './Now'
import Sequence from './Sequence'
import Tween from './Tween'
import VERSION from './Version'
import {mainGroup} from './mainGroup'

const nextId = Sequence.nextId

/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tweens.
 */
const TWEEN = mainGroup

// This is the best way to export things in a way that's compatible with both ES
// Modules and CommonJS, without build hacks, and so as not to break the
// existing API.
// https://github.com/rollup/rollup/issues/1961#issuecomment-423037881
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
const getAll = TWEEN.getAll.bind(TWEEN)
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
const removeAll = TWEEN.removeAll.bind(TWEEN)
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
const add = TWEEN.add.bind(TWEEN)
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
const remove = TWEEN.remove.bind(TWEEN)
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
const update = TWEEN.update.bind(TWEEN)

// NOTE! Make sure both lists of exports below are kept in sync:

export {Easing, Group, Interpolation, now, setNow, Sequence, nextId, Tween, VERSION, getAll, removeAll, add, remove, update}

const exports = {
	Easing,
	Group,
	Interpolation,
	now,
	setNow,
	Sequence,
	nextId,
	Tween,
	VERSION,

	/**
	 * @deprecated The global TWEEN Group will be removed in a following major
	 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
	 * group.
	 *
	 * Old code:
	 *
	 * ```js
	 * import * as TWEEN from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new TWEEN.Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   TWEEN.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 *
	 * New code:
	 *
	 * ```js
	 * import {Tween, Group} from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * const group = new Group()
	 * group.add(tween)
	 * group.add(tween2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   group.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 */
	getAll,
	/**
	 * @deprecated The global TWEEN Group will be removed in a following major
	 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
	 * group.
	 *
	 * Old code:
	 *
	 * ```js
	 * import * as TWEEN from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new TWEEN.Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   TWEEN.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 *
	 * New code:
	 *
	 * ```js
	 * import {Tween, Group} from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * const group = new Group()
	 * group.add(tween)
	 * group.add(tween2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   group.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 */
	removeAll,
	/**
	 * @deprecated The global TWEEN Group will be removed in a following major
	 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
	 * group.
	 *
	 * Old code:
	 *
	 * ```js
	 * import * as TWEEN from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new TWEEN.Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   TWEEN.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 *
	 * New code:
	 *
	 * ```js
	 * import {Tween, Group} from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * const group = new Group()
	 * group.add(tween)
	 * group.add(tween2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   group.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 */
	add,
	/**
	 * @deprecated The global TWEEN Group will be removed in a following major
	 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
	 * group.
	 *
	 * Old code:
	 *
	 * ```js
	 * import * as TWEEN from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new TWEEN.Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   TWEEN.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 *
	 * New code:
	 *
	 * ```js
	 * import {Tween, Group} from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * const group = new Group()
	 * group.add(tween)
	 * group.add(tween2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   group.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 */
	remove,
	/**
	 * @deprecated The global TWEEN Group will be removed in a following major
	 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
	 * group.
	 *
	 * Old code:
	 *
	 * ```js
	 * import * as TWEEN from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new TWEEN.Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   TWEEN.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 *
	 * New code:
	 *
	 * ```js
	 * import {Tween, Group} from '@tweenjs/tween.js'
	 *
	 * //...
	 *
	 * const tween = new Tween(obj)
	 * const tween2 = new TWEEN.Tween(obj2)
	 *
	 * //...
	 *
	 * const group = new Group()
	 * group.add(tween)
	 * group.add(tween2)
	 *
	 * //...
	 *
	 * requestAnimationFrame(function loop(time) {
	 *   group.update(time)
	 *   requestAnimationFrame(loop)
	 * })
	 * ```
	 */
	update,
}

export default exports
