/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

import TWEEN from './lib/core';
import Tween from './lib/Tween';
import Easing from './lib/Easing';
import Interpolation from './lib/Interpolation';

TWEEN.Tween = Tween;
TWEEN.Easing = Easing;
TWEEN.Interpolation = Interpolation;

export default TWEEN;
