(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TWEEN = {}));
})(this, (function (exports) { 'use strict';

    /**
     * The Ease class provides a collection of easing functions for use with tween.js.
     */
    var Easing = Object.freeze({
        Linear: Object.freeze({
            None: function (amount) {
                return amount;
            },
            In: function (amount) {
                return amount;
            },
            Out: function (amount) {
                return amount;
            },
            InOut: function (amount) {
                return amount;
            },
        }),
        Quadratic: Object.freeze({
            In: function (amount) {
                return amount * amount;
            },
            Out: function (amount) {
                return amount * (2 - amount);
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1) {
                    return 0.5 * amount * amount;
                }
                return -0.5 * (--amount * (amount - 2) - 1);
            },
        }),
        Cubic: Object.freeze({
            In: function (amount) {
                return amount * amount * amount;
            },
            Out: function (amount) {
                return --amount * amount * amount + 1;
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1) {
                    return 0.5 * amount * amount * amount;
                }
                return 0.5 * ((amount -= 2) * amount * amount + 2);
            },
        }),
        Quartic: Object.freeze({
            In: function (amount) {
                return amount * amount * amount * amount;
            },
            Out: function (amount) {
                return 1 - --amount * amount * amount * amount;
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1) {
                    return 0.5 * amount * amount * amount * amount;
                }
                return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
            },
        }),
        Quintic: Object.freeze({
            In: function (amount) {
                return amount * amount * amount * amount * amount;
            },
            Out: function (amount) {
                return --amount * amount * amount * amount * amount + 1;
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1) {
                    return 0.5 * amount * amount * amount * amount * amount;
                }
                return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
            },
        }),
        Sinusoidal: Object.freeze({
            In: function (amount) {
                return 1 - Math.sin(((1.0 - amount) * Math.PI) / 2);
            },
            Out: function (amount) {
                return Math.sin((amount * Math.PI) / 2);
            },
            InOut: function (amount) {
                return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)));
            },
        }),
        Exponential: Object.freeze({
            In: function (amount) {
                return amount === 0 ? 0 : Math.pow(1024, amount - 1);
            },
            Out: function (amount) {
                return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
            },
            InOut: function (amount) {
                if (amount === 0) {
                    return 0;
                }
                if (amount === 1) {
                    return 1;
                }
                if ((amount *= 2) < 1) {
                    return 0.5 * Math.pow(1024, amount - 1);
                }
                return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
            },
        }),
        Circular: Object.freeze({
            In: function (amount) {
                return 1 - Math.sqrt(1 - amount * amount);
            },
            Out: function (amount) {
                return Math.sqrt(1 - --amount * amount);
            },
            InOut: function (amount) {
                if ((amount *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
            },
        }),
        Elastic: Object.freeze({
            In: function (amount) {
                if (amount === 0) {
                    return 0;
                }
                if (amount === 1) {
                    return 1;
                }
                return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
            },
            Out: function (amount) {
                if (amount === 0) {
                    return 0;
                }
                if (amount === 1) {
                    return 1;
                }
                return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
            },
            InOut: function (amount) {
                if (amount === 0) {
                    return 0;
                }
                if (amount === 1) {
                    return 1;
                }
                amount *= 2;
                if (amount < 1) {
                    return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
                }
                return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
            },
        }),
        Back: Object.freeze({
            In: function (amount) {
                var s = 1.70158;
                return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s);
            },
            Out: function (amount) {
                var s = 1.70158;
                return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1;
            },
            InOut: function (amount) {
                var s = 1.70158 * 1.525;
                if ((amount *= 2) < 1) {
                    return 0.5 * (amount * amount * ((s + 1) * amount - s));
                }
                return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
            },
        }),
        Bounce: Object.freeze({
            In: function (amount) {
                return 1 - Easing.Bounce.Out(1 - amount);
            },
            Out: function (amount) {
                if (amount < 1 / 2.75) {
                    return 7.5625 * amount * amount;
                }
                else if (amount < 2 / 2.75) {
                    return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
                }
                else if (amount < 2.5 / 2.75) {
                    return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
                }
                else {
                    return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
                }
            },
            InOut: function (amount) {
                if (amount < 0.5) {
                    return Easing.Bounce.In(amount * 2) * 0.5;
                }
                return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
            },
        }),
        generatePow: function (power) {
            if (power === void 0) { power = 4; }
            power = power < Number.EPSILON ? Number.EPSILON : power;
            power = power > 10000 ? 10000 : power;
            return {
                In: function (amount) {
                    return Math.pow(amount, power);
                },
                Out: function (amount) {
                    return 1 - Math.pow((1 - amount), power);
                },
                InOut: function (amount) {
                    if (amount < 0.5) {
                        return Math.pow((amount * 2), power) / 2;
                    }
                    return (1 - Math.pow((2 - amount * 2), power)) / 2 + 0.5;
                },
            };
        },
    });

    var _nowFunc = function () { return performance.now(); };
    var now = function () {
        return _nowFunc();
    };
    function setNow(nowFunction) {
        _nowFunc = nowFunction;
    }

    /**
     * Controlling groups of tweens
     *
     * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
     * In these cases, you may want to create your own smaller groups of tween
     *
     * Groups can also hold `Timeline` instances (timelines are playable, like tweens).
     */
    var Group = /** @class */ (function () {
        function Group() {
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            this._tweens = {};
            this._tweensAddedDuringUpdate = {};
            this.add.apply(this, tweens);
        }
        Group.prototype.getAll = function () {
            var _this = this;
            return Object.keys(this._tweens).map(function (tweenId) { return _this._tweens[tweenId]; });
        };
        Group.prototype.removeAll = function () {
            this._tweens = {};
        };
        Group.prototype.add = function () {
            var _a;
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            for (var _b = 0, tweens_1 = tweens; _b < tweens_1.length; _b++) {
                var tween = tweens_1[_b];
                // Remove from any other group first, a tween can only be in one group at a time.
                // @ts-expect-error library internal access
                (_a = tween._group) === null || _a === void 0 ? void 0 : _a.remove(tween);
                // @ts-expect-error library internal access
                tween._group = this;
                this._tweens[tween.getId()] = tween;
                this._tweensAddedDuringUpdate[tween.getId()] = tween;
            }
        };
        Group.prototype.remove = function () {
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            for (var _a = 0, tweens_2 = tweens; _a < tweens_2.length; _a++) {
                var tween = tweens_2[_a];
                // @ts-expect-error library internal access
                tween._group = undefined;
                delete this._tweens[tween.getId()];
                delete this._tweensAddedDuringUpdate[tween.getId()];
            }
        };
        /** Return true if all tweens in the group are not paused or playing. */
        Group.prototype.allStopped = function () {
            return this.getAll().every(function (tween) { return !tween.isPlaying(); });
        };
        Group.prototype.update = function (time, preserve) {
            if (time === void 0) { time = now(); }
            if (preserve === void 0) { preserve = true; }
            var tweenIds = Object.keys(this._tweens);
            if (tweenIds.length === 0)
                return;
            // Tweens are updated in "batches". If you add a new tween during an
            // update, then the new tween will be updated in the next batch.
            // If you remove a tween during an update, it may or may not be updated.
            // However, if the removed tween was added during the current batch,
            // then it will not be updated.
            while (tweenIds.length > 0) {
                this._tweensAddedDuringUpdate = {};
                for (var i = 0; i < tweenIds.length; i++) {
                    var tween = this._tweens[tweenIds[i]];
                    var autoStart = !preserve;
                    if (tween && tween.update(time, autoStart) === false && !preserve)
                        this.remove(tween);
                }
                tweenIds = Object.keys(this._tweensAddedDuringUpdate);
            }
        };
        Group.prototype.onComplete = function (callback) {
            var group = this.getAll();
            group.forEach(function (tween) {
                // Timelines have onComplete but no getCompleteCallback; only wrap when available (plain Tweens).
                var maybeTween = tween;
                var prevCallback = typeof maybeTween.getCompleteCallback === 'function' ? maybeTween.getCompleteCallback() : undefined;
                tween.onComplete(function () {
                    prevCallback === null || prevCallback === void 0 ? void 0 : prevCallback(tween);
                    // After the onComplete callback completes, _isPlaying is updated to false, so if the total number of completed tweens is -1, then they are all complete.
                    var completedGroup = group.filter(function (tween) { return !tween.isPlaying(); });
                    if (completedGroup.length === group.length - 1)
                        callback(group);
                });
            });
        };
        return Group;
    }());

    /**
     *
     */
    var Interpolation = {
        Linear: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = Interpolation.Utils.Linear;
            if (k < 0) {
                return fn(v[0], v[1], f);
            }
            if (k > 1) {
                return fn(v[m], v[m - 1], m - f);
            }
            return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
        },
        Bezier: function (v, k) {
            var b = 0;
            var n = v.length - 1;
            var pw = Math.pow;
            var bn = Interpolation.Utils.Bernstein;
            for (var i = 0; i <= n; i++) {
                b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
            }
            return b;
        },
        CatmullRom: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = Interpolation.Utils.CatmullRom;
            if (v[0] === v[m]) {
                if (k < 0) {
                    i = Math.floor((f = m * (1 + k)));
                }
                return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            }
            else {
                if (k < 0) {
                    return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                }
                if (k > 1) {
                    return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                }
                return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }
        },
        Utils: {
            Linear: function (p0, p1, t) {
                return (p1 - p0) * t + p0;
            },
            Bernstein: function (n, i) {
                var fc = Interpolation.Utils.Factorial;
                return fc(n) / fc(i) / fc(n - i);
            },
            Factorial: (function () {
                var a = [1];
                return function (n) {
                    var s = 1;
                    if (a[n]) {
                        return a[n];
                    }
                    for (var i = n; i > 1; i--) {
                        s *= i;
                    }
                    a[n] = s;
                    return s;
                };
            })(),
            CatmullRom: function (p0, p1, p2, p3, t) {
                var v0 = (p2 - p0) * 0.5;
                var v1 = (p3 - p1) * 0.5;
                var t2 = t * t;
                var t3 = t * t2;
                return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
            },
        },
    };

    /**
     * Utils
     */
    var Sequence = /** @class */ (function () {
        function Sequence() {
        }
        Sequence.nextId = function () {
            return Sequence._nextId++;
        };
        Sequence._nextId = 0;
        return Sequence;
    }());

    var mainGroup = new Group();

    /**
     * Tween.js - Licensed under the MIT license
     * https://github.com/tweenjs/tween.js
     * ----------------------------------------------
     *
     * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
     * Thank you all, you're awesome!
     */
    var Tween = /** @class */ (function () {
        function Tween(object, group) {
            this._isPaused = false;
            this._pauseStart = 0;
            this._valuesStart = {};
            this._valuesEnd = {};
            this._valuesStartRepeat = {};
            this._duration = 1000;
            this._isDynamic = false;
            this._initialRepeat = 0;
            this._repeat = 0;
            this._yoyo = false;
            this._isPlaying = false;
            this._reversed = false;
            this._delayTime = 0;
            this._startTime = 0;
            this._easingFunction = Easing.Linear.None;
            this._interpolationFunction = Interpolation.Linear;
            // eslint-disable-next-line
            this._chainedTweens = [];
            this._onStartCallbackFired = false;
            this._onEveryStartCallbackFired = false;
            this._id = Sequence.nextId();
            this._isChainStopped = false;
            this._propertiesAreSetUp = false;
            this._goToEnd = false;
            this._object = object;
            if (typeof group === 'object') {
                this._group = group;
                group.add(this);
            }
            // Use "true" to restore old behavior (will be removed in future release).
            else if (group === true) {
                this._group = mainGroup;
                mainGroup.add(this);
            }
        }
        Tween.prototype.getId = function () {
            return this._id;
        };
        Tween.prototype.getCompleteCallback = function () {
            return this._onCompleteCallback;
        };
        Tween.prototype.isPlaying = function () {
            return this._isPlaying;
        };
        Tween.prototype.isPaused = function () {
            return this._isPaused;
        };
        Tween.prototype.getDuration = function () {
            return this._duration;
        };
        /**
         * Total duration from `start()` call (including initial delay, repeats
         * and repeat delays). Used by `Timeline` to compute its own duration.
         * Returns `Infinity` when the tween repeats forever.
         */
        Tween.prototype.getTotalDuration = function () {
            var _a;
            if (!isFinite(this._initialRepeat))
                return Infinity;
            var repeatDelay = (_a = this._repeatDelayTime) !== null && _a !== void 0 ? _a : this._delayTime;
            return this._delayTime + this._duration + this._initialRepeat * (this._duration + repeatDelay);
        };
        Tween.prototype.to = function (target, duration) {
            if (duration === void 0) { duration = 1000; }
            if (this._isPlaying)
                throw new Error('Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.');
            this._valuesEnd = target;
            this._propertiesAreSetUp = false;
            this._duration = duration < 0 ? 0 : duration;
            return this;
        };
        Tween.prototype.duration = function (duration) {
            if (duration === void 0) { duration = 1000; }
            this._duration = duration < 0 ? 0 : duration;
            return this;
        };
        Tween.prototype.dynamic = function (dynamic) {
            if (dynamic === void 0) { dynamic = false; }
            this._isDynamic = dynamic;
            return this;
        };
        Tween.prototype.start = function (time, overrideStartingValues) {
            if (time === void 0) { time = now(); }
            if (overrideStartingValues === void 0) { overrideStartingValues = false; }
            if (this._isPlaying) {
                return this;
            }
            this._repeat = this._initialRepeat;
            if (this._reversed) {
                // If we were reversed (f.e. using the yoyo feature) then we need to
                // flip the tween direction back to forward.
                this._reversed = false;
                for (var property in this._valuesStartRepeat) {
                    this._swapEndStartRepeatValues(property);
                    this._valuesStart[property] = this._valuesStartRepeat[property];
                }
            }
            this._isPlaying = true;
            this._isPaused = false;
            this._onStartCallbackFired = false;
            this._onEveryStartCallbackFired = false;
            this._isChainStopped = false;
            this._startTime = time;
            this._startTime += this._delayTime;
            if (!this._propertiesAreSetUp || overrideStartingValues) {
                this._propertiesAreSetUp = true;
                // If dynamic is not enabled, clone the end values instead of using the passed-in end values.
                if (!this._isDynamic) {
                    var tmp = {};
                    for (var prop in this._valuesEnd)
                        tmp[prop] = this._valuesEnd[prop];
                    this._valuesEnd = tmp;
                }
                this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, overrideStartingValues);
            }
            return this;
        };
        Tween.prototype.startFromCurrentValues = function (time) {
            return this.start(time, true);
        };
        Tween.prototype._setupProperties = function (_object, _valuesStart, _valuesEnd, _valuesStartRepeat, overrideStartingValues) {
            for (var property in _valuesEnd) {
                var startValue = _object[property];
                var startValueIsArray = Array.isArray(startValue);
                var propType = startValueIsArray ? 'array' : typeof startValue;
                var isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]);
                // If `to()` specifies a property that doesn't exist in the source object,
                // we should not set that property in the object
                if (propType === 'undefined' || propType === 'function') {
                    continue;
                }
                // Check if an Array was provided as property value
                if (isInterpolationList) {
                    var endValues = _valuesEnd[property];
                    if (endValues.length === 0) {
                        continue;
                    }
                    // Handle an array of relative values.
                    // Creates a local copy of the Array with the start value at the front
                    var temp = [startValue];
                    for (var i = 0, l = endValues.length; i < l; i += 1) {
                        var value = this._handleRelativeValue(startValue, endValues[i]);
                        if (isNaN(value)) {
                            isInterpolationList = false;
                            console.warn('Found invalid interpolation list. Skipping.');
                            break;
                        }
                        temp.push(value);
                    }
                    if (isInterpolationList) {
                        // if (_valuesStart[property] === undefined) { // handle end values only the first time. NOT NEEDED? setupProperties is now guarded by _propertiesAreSetUp.
                        _valuesEnd[property] = temp;
                        // }
                    }
                }
                // handle the deepness of the values
                if ((propType === 'object' || startValueIsArray) && startValue && !isInterpolationList) {
                    _valuesStart[property] = startValueIsArray ? [] : {};
                    var nestedObject = startValue;
                    for (var prop in nestedObject) {
                        _valuesStart[property][prop] = nestedObject[prop];
                    }
                    // TODO? repeat nested values? And yoyo? And array values?
                    _valuesStartRepeat[property] = startValueIsArray ? [] : {};
                    var endValues = _valuesEnd[property];
                    // If dynamic is not enabled, clone the end values instead of using the passed-in end values.
                    if (!this._isDynamic) {
                        var tmp = {};
                        for (var prop in endValues)
                            tmp[prop] = endValues[prop];
                        _valuesEnd[property] = endValues = tmp;
                    }
                    this._setupProperties(nestedObject, _valuesStart[property], endValues, _valuesStartRepeat[property], overrideStartingValues);
                }
                else {
                    // Save the starting value, but only once unless override is requested.
                    if (typeof _valuesStart[property] === 'undefined' || overrideStartingValues) {
                        _valuesStart[property] = startValue;
                    }
                    if (!startValueIsArray) {
                        // eslint-disable-next-line
                        // @ts-ignore FIXME?
                        _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
                    }
                    if (isInterpolationList) {
                        // eslint-disable-next-line
                        // @ts-ignore FIXME?
                        _valuesStartRepeat[property] = _valuesEnd[property].slice().reverse();
                    }
                    else {
                        _valuesStartRepeat[property] = _valuesStart[property] || 0;
                    }
                }
            }
        };
        Tween.prototype.stop = function () {
            if (!this._isChainStopped) {
                this._isChainStopped = true;
                this.stopChainedTweens();
            }
            if (!this._isPlaying) {
                return this;
            }
            this._isPlaying = false;
            this._isPaused = false;
            if (this._onStopCallback) {
                this._onStopCallback(this._object);
            }
            return this;
        };
        Tween.prototype.end = function () {
            this._goToEnd = true;
            this.update(this._startTime + this._duration);
            return this;
        };
        Tween.prototype.pause = function (time) {
            if (time === void 0) { time = now(); }
            if (this._isPaused || !this._isPlaying) {
                return this;
            }
            this._isPaused = true;
            this._pauseStart = time;
            return this;
        };
        Tween.prototype.resume = function (time) {
            if (time === void 0) { time = now(); }
            if (!this._isPaused || !this._isPlaying) {
                return this;
            }
            this._isPaused = false;
            this._startTime += time - this._pauseStart;
            this._pauseStart = 0;
            return this;
        };
        Tween.prototype.stopChainedTweens = function () {
            for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                this._chainedTweens[i].stop();
            }
            return this;
        };
        Tween.prototype.group = function (group) {
            if (!group) {
                console.warn('tween.group() without args has been removed, use group.add(tween) instead.');
                return this;
            }
            group.add(this);
            return this;
        };
        /**
         * Removes the tween from whichever group it is in.
         */
        Tween.prototype.remove = function () {
            var _a;
            (_a = this._group) === null || _a === void 0 ? void 0 : _a.remove(this);
            return this;
        };
        Tween.prototype.delay = function (amount) {
            if (amount === void 0) { amount = 0; }
            this._delayTime = amount;
            return this;
        };
        Tween.prototype.repeat = function (times) {
            if (times === void 0) { times = 0; }
            this._initialRepeat = times;
            this._repeat = times;
            return this;
        };
        Tween.prototype.repeatDelay = function (amount) {
            this._repeatDelayTime = amount;
            return this;
        };
        Tween.prototype.yoyo = function (yoyo) {
            if (yoyo === void 0) { yoyo = false; }
            this._yoyo = yoyo;
            return this;
        };
        Tween.prototype.easing = function (easingFunction) {
            if (easingFunction === void 0) { easingFunction = Easing.Linear.None; }
            this._easingFunction = easingFunction;
            return this;
        };
        Tween.prototype.interpolation = function (interpolationFunction) {
            if (interpolationFunction === void 0) { interpolationFunction = Interpolation.Linear; }
            this._interpolationFunction = interpolationFunction;
            return this;
        };
        // eslint-disable-next-line
        Tween.prototype.chain = function () {
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            this._chainedTweens = tweens;
            return this;
        };
        Tween.prototype.onStart = function (callback) {
            this._onStartCallback = callback;
            return this;
        };
        Tween.prototype.onEveryStart = function (callback) {
            this._onEveryStartCallback = callback;
            return this;
        };
        Tween.prototype.onUpdate = function (callback) {
            this._onUpdateCallback = callback;
            return this;
        };
        Tween.prototype.onRepeat = function (callback) {
            this._onRepeatCallback = callback;
            return this;
        };
        Tween.prototype.onComplete = function (callback) {
            this._onCompleteCallback = callback;
            return this;
        };
        Tween.prototype.onStop = function (callback) {
            this._onStopCallback = callback;
            return this;
        };
        /**
         * @returns true if the tween is still playing after the update, false
         * otherwise (calling update on a paused tween still returns true because
         * it is still playing, just paused).
         *
         * @param autoStart - When true, calling update will implicitly call start()
         * as well. Note, if you stop() or end() the tween, but are still calling
         * update(), it will start again!
         */
        Tween.prototype.update = function (time, autoStart) {
            var _this = this;
            var _a;
            if (time === void 0) { time = now(); }
            if (autoStart === void 0) { autoStart = Tween.autoStartOnUpdate; }
            if (this._isPaused)
                return true;
            var property;
            if (!this._goToEnd && !this._isPlaying) {
                if (autoStart)
                    this.start(time, true);
                else
                    return false;
            }
            this._goToEnd = false;
            if (time < this._startTime) {
                return true;
            }
            if (this._onStartCallbackFired === false) {
                if (this._onStartCallback) {
                    this._onStartCallback(this._object);
                }
                this._onStartCallbackFired = true;
            }
            if (this._onEveryStartCallbackFired === false) {
                if (this._onEveryStartCallback) {
                    this._onEveryStartCallback(this._object);
                }
                this._onEveryStartCallbackFired = true;
            }
            var elapsedTime = time - this._startTime;
            var durationAndDelay = this._duration + ((_a = this._repeatDelayTime) !== null && _a !== void 0 ? _a : this._delayTime);
            var totalTime = this._duration + this._repeat * durationAndDelay;
            var calculateElapsedPortion = function () {
                if (_this._duration === 0)
                    return 1;
                if (time >= _this._startTime + totalTime) {
                    return 1;
                }
                var timesRepeated = Math.trunc(elapsedTime / durationAndDelay);
                var timeIntoCurrentRepeat = elapsedTime - timesRepeated * durationAndDelay;
                // TODO use %?
                // const timeIntoCurrentRepeat = elapsedTime % durationAndDelay
                var portion = Math.min(timeIntoCurrentRepeat / _this._duration, 1);
                if ((portion === 0 || 1 - portion <= Number.EPSILON) && time >= _this._startTime + _this._duration) {
                    return 1;
                }
                return portion;
            };
            var elapsed = calculateElapsedPortion();
            var value = this._easingFunction(elapsed);
            // properties transformations
            this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);
            if (this._onUpdateCallback) {
                this._onUpdateCallback(this._object, elapsed);
            }
            if (this._duration === 0 || time >= this._startTime + this._duration) {
                if (this._repeat > 0) {
                    var completeCount = Math.min(Math.trunc((elapsedTime - this._duration) / durationAndDelay) + 1, this._repeat);
                    if (isFinite(this._repeat)) {
                        this._repeat -= completeCount;
                    }
                    // Reassign starting values, restart by making startTime = now
                    for (property in this._valuesStartRepeat) {
                        if (!this._yoyo && typeof this._valuesEnd[property] === 'string') {
                            this._valuesStartRepeat[property] =
                                // eslint-disable-next-line
                                // @ts-ignore FIXME?
                                this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
                        }
                        if (this._yoyo) {
                            this._swapEndStartRepeatValues(property);
                        }
                        this._valuesStart[property] = this._valuesStartRepeat[property];
                    }
                    if (this._yoyo) {
                        this._reversed = !this._reversed;
                    }
                    this._startTime += durationAndDelay * completeCount;
                    if (this._onRepeatCallback) {
                        this._onRepeatCallback(this._object);
                    }
                    this._onEveryStartCallbackFired = false;
                    return true;
                }
                else {
                    if (this._onCompleteCallback) {
                        this._onCompleteCallback(this._object);
                    }
                    for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                        // Make the chained tweens start exactly at the time they should,
                        // even if the `update()` method was called way past the duration of the tween
                        this._chainedTweens[i].start(this._startTime + this._duration, false);
                    }
                    this._isPlaying = false;
                    return false;
                }
            }
            return true;
        };
        Tween.prototype._updateProperties = function (_object, _valuesStart, _valuesEnd, value) {
            for (var property in _valuesEnd) {
                // Don't update properties that do not exist in the source object
                if (_valuesStart[property] === undefined) {
                    continue;
                }
                var start = _valuesStart[property] || 0;
                var end = _valuesEnd[property];
                var startIsArray = Array.isArray(_object[property]);
                var endIsArray = Array.isArray(end);
                var isInterpolationList = !startIsArray && endIsArray;
                if (isInterpolationList) {
                    _object[property] = this._interpolationFunction(end, value);
                }
                else if (typeof end === 'object' && end) {
                    // eslint-disable-next-line
                    // @ts-ignore FIXME?
                    this._updateProperties(_object[property], start, end, value);
                }
                else {
                    // Parses relative end values with start as base (e.g.: +10, -3)
                    end = this._handleRelativeValue(start, end);
                    // Protect against non numeric properties.
                    if (typeof end === 'number') {
                        // eslint-disable-next-line
                        // @ts-ignore FIXME?
                        _object[property] = start + (end - start) * value;
                    }
                }
            }
        };
        Tween.prototype._handleRelativeValue = function (start, end) {
            if (typeof end !== 'string') {
                return end;
            }
            if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                return start + parseFloat(end);
            }
            return parseFloat(end);
        };
        Tween.prototype._swapEndStartRepeatValues = function (property) {
            var tmp = this._valuesStartRepeat[property];
            var endValue = this._valuesEnd[property];
            if (typeof endValue === 'string') {
                this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(endValue);
            }
            else {
                this._valuesStartRepeat[property] = this._valuesEnd[property];
            }
            this._valuesEnd[property] = tmp;
        };
        Tween.autoStartOnUpdate = false;
        return Tween;
    }());

    /**
     * Tween.js - Licensed under the MIT license
     * https://github.com/tweenjs/tween.js
     * ----------------------------------------------
     *
     * Timeline: compose Tweens (and nested Timelines) in sequence and in parallel.
     *
     * Inspired by trusktr's vision in #647 / #560:
     * - Tween does tweening, Timeline does orchestration (replaces `.chain`).
     * - Single class, sequential by default (append), parallel via explicit offset.
     * - Simple, Three.js ethos: small API, explicit times, no magic.
     */
    var Timeline = /** @class */ (function () {
        function Timeline() {
            this._id = Sequence.nextId();
            this._entries = [];
            this._labels = { start: 0, end: 0 };
            this._duration = 0;
            this._startTime = 0;
            this._isPlaying = false;
            this._isPaused = false;
            this._pauseStart = 0;
            this._onStartCallbackFired = false;
            this._onEveryStartCallbackFired = false;
            // Empty on purpose. Use `.add()` to compose.
            // Sequential by default, parallel via explicit offsets, labels, or options.
        }
        Timeline.prototype.getId = function () {
            return this._id;
        };
        Timeline.prototype.isPlaying = function () {
            return this._isPlaying;
        };
        Timeline.prototype.isPaused = function () {
            return this._isPaused;
        };
        /** Duration of the timeline (max child end). */
        Timeline.prototype.getDuration = function () {
            return this._duration;
        };
        Timeline.prototype.getTotalDuration = function () {
            return this._duration;
        };
        Timeline.prototype.getAll = function () {
            return this._entries.map(function (entry) { return entry.node; });
        };
        Timeline.prototype.has = function (node) {
            return this._entries.some(function (entry) { return entry.node === node; });
        };
        Timeline.prototype._isAddOptions = function (position) {
            return (typeof position === 'object' &&
                position !== null &&
                !Array.isArray(position) &&
                ('at' in position || 'atIndex' in position || 'offset' in position || 'shift' in position));
        };
        Timeline.prototype._resolveAt = function (at) {
            var _a;
            if (at === undefined)
                return { offset: this._duration };
            if (typeof at === 'number')
                return { offset: at };
            if (typeof at === 'string')
                return { offset: (_a = this._labels[at]) !== null && _a !== void 0 ? _a : this._duration };
            var insertIndex = this._entries.findIndex(function (entry) { return entry.node === at; });
            if (insertIndex === -1)
                return { offset: this._duration };
            return { offset: this._entries[insertIndex].offset, insertIndex: insertIndex };
        };
        Timeline.prototype._resolvePosition = function (position) {
            var _a;
            if (this._isAddOptions(position)) {
                var offset = (_a = position.offset) !== null && _a !== void 0 ? _a : 0;
                if (position.atIndex !== undefined) {
                    var insertIndex = Math.max(0, Math.min(position.atIndex, this._entries.length));
                    var baseOffset = insertIndex < this._entries.length ? this._entries[insertIndex].offset : this._duration;
                    return { offset: baseOffset + offset, shift: position.shift === true, insertIndex: insertIndex };
                }
                var resolved_1 = this._resolveAt(position.at);
                return {
                    offset: resolved_1.offset + offset,
                    shift: position.shift === true,
                    insertIndex: resolved_1.insertIndex,
                };
            }
            var resolved = this._resolveAt(position);
            return { offset: resolved.offset, shift: false, insertIndex: resolved.insertIndex };
        };
        Timeline.prototype.addLabel = function (name, offset) {
            if (name === 'start' || name === 'end')
                return this;
            this._labels[name] = offset;
            return this;
        };
        Timeline.prototype.removeLabel = function (name) {
            if (name === 'start' || name === 'end')
                return this;
            delete this._labels[name];
            return this;
        };
        Timeline.prototype.getLabel = function (name) {
            return this._labels[name];
        };
        Timeline.prototype._recalculateDuration = function () {
            var max = 0;
            var infinite = false;
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                var childTotal = entry.node.getTotalDuration();
                if (!isFinite(childTotal)) {
                    infinite = true;
                    break;
                }
                max = Math.max(max, entry.offset + childTotal);
            }
            this._duration = infinite ? Infinity : max;
            this._labels['end'] = this._duration;
        };
        /**
         * Add a Tween or nested Timeline.
         *
         * - `add(tween)` appends after the last child (sequential).
         * - `add(tween, 0)` starts at timeline start (parallel).
         * - `add(tween, 500)` starts at 500ms.
         * - `add(tween, 'myLabel')` aligns to an existing label.
         * - `add(tween, otherTween)` aligns to another child.
         * - `add(tween, {at: 'myLabel', offset: 100})` adds with an offset.
         * - `add(tween, {atIndex: 5, shift: true})` inserts and shifts later children.
         * - `add([a, b])` adds sequentially; `add([a, b], 0)` adds in parallel.
         */
        Timeline.prototype.add = function (node, position) {
            if (Array.isArray(node)) {
                if (position === undefined)
                    for (var _i = 0, node_1 = node; _i < node_1.length; _i++) {
                        var child = node_1[_i];
                        this.add(child);
                    }
                else
                    for (var _a = 0, node_2 = node; _a < node_2.length; _a++) {
                        var child = node_2[_a];
                        this.add(child, position);
                    }
                return this;
            }
            return this._addSingle(node, position);
        };
        Timeline.prototype._shiftEntries = function (offset, amount) {
            if (amount === 0)
                return;
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.offset >= offset)
                    entry.offset += amount;
            }
        };
        Timeline.prototype._addSingle = function (node, position) {
            var resolved = this._resolvePosition(position);
            var existingIndex = this._entries.findIndex(function (entry) { return entry.node === node; });
            var entry = existingIndex === -1 ? { node: node, offset: resolved.offset, started: false } : this._entries.splice(existingIndex, 1)[0];
            if (resolved.shift)
                this._shiftEntries(resolved.offset, node.getTotalDuration());
            entry.offset = resolved.offset;
            entry.started = false;
            if (resolved.insertIndex !== undefined) {
                var insertIndex = existingIndex !== -1 && existingIndex < resolved.insertIndex ? resolved.insertIndex - 1 : resolved.insertIndex;
                this._entries.splice(insertIndex, 0, entry);
            }
            else {
                this._entries.push(entry);
            }
            // Children start lazily when the playhead reaches them (see update),
            // so start values are captured at the right moment.
            this._recalculateDuration();
            return this;
        };
        Timeline.prototype.remove = function () {
            var nodes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                nodes[_i] = arguments[_i];
            }
            var changed = false;
            var _loop_1 = function (node) {
                var index = this_1._entries.findIndex(function (entry) { return entry.node === node; });
                if (index !== -1) {
                    this_1._entries.splice(index, 1);
                    changed = true;
                }
            };
            var this_1 = this;
            for (var _a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
                var node = nodes_1[_a];
                _loop_1(node);
            }
            if (changed)
                this._recalculateDuration();
            return this;
        };
        Timeline.prototype.removeAll = function () {
            this._entries = [];
            this._recalculateDuration();
            return this;
        };
        Timeline.prototype.onStart = function (callback) {
            this._onStartCallback = callback;
            return this;
        };
        Timeline.prototype.onEveryStart = function (callback) {
            this._onEveryStartCallback = callback;
            return this;
        };
        Timeline.prototype.onUpdate = function (callback) {
            this._onUpdateCallback = callback;
            return this;
        };
        Timeline.prototype.onComplete = function (callback) {
            this._onCompleteCallback = callback;
            return this;
        };
        Timeline.prototype.onStop = function (callback) {
            this._onStopCallback = callback;
            return this;
        };
        /** Convenience: set easing for all child Tweens (recurses into nested Timelines). */
        Timeline.prototype.easing = function (easingFunction) {
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                var child = entry.node;
                if (child instanceof Timeline)
                    child.easing(easingFunction);
                else
                    child.easing(easingFunction);
            }
            return this;
        };
        /** Convenience: set interpolation for all child Tweens (recurses). */
        Timeline.prototype.interpolation = function (interpolationFunction) {
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                var child = entry.node;
                if (child instanceof Timeline)
                    child.interpolation(interpolationFunction);
                else
                    child.interpolation(interpolationFunction);
            }
            return this;
        };
        Timeline.prototype.start = function (time) {
            if (time === void 0) { time = now(); }
            if (this._isPlaying)
                return this;
            this._recalculateDuration();
            this._isPlaying = true;
            this._isPaused = false;
            this._onStartCallbackFired = false;
            this._onEveryStartCallbackFired = false;
            this._startTime = time;
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.node.isPlaying())
                    entry.node.stop();
            }
            return this;
        };
        Timeline.prototype.stop = function () {
            if (!this._isPlaying)
                return this;
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.node.isPlaying())
                    entry.node.stop();
            }
            this._isPlaying = false;
            this._isPaused = false;
            if (this._onStopCallback)
                this._onStopCallback(this);
            return this;
        };
        Timeline.prototype.pause = function (time) {
            if (time === void 0) { time = now(); }
            if (this._isPaused || !this._isPlaying)
                return this;
            this._isPaused = true;
            this._pauseStart = time;
            return this;
        };
        Timeline.prototype.resume = function (time) {
            if (time === void 0) { time = now(); }
            if (!this._isPaused || !this._isPlaying)
                return this;
            this._isPaused = false;
            this._startTime += time - this._pauseStart;
            this._pauseStart = 0;
            return this;
        };
        /**
         * @returns true if still playing after update, false otherwise.
         * Children use a local clock (0 = timeline start).
         */
        Timeline.prototype.update = function (time, autoStart) {
            if (time === void 0) { time = now(); }
            if (autoStart === void 0) { autoStart = Timeline.autoStartOnUpdate; }
            if (this._isPaused)
                return true;
            if (!this._isPlaying) {
                if (autoStart)
                    this.start(time);
                else
                    return false;
            }
            if (time < this._startTime)
                return true;
            if (!this._onStartCallbackFired) {
                if (this._onStartCallback)
                    this._onStartCallback(this);
                this._onStartCallbackFired = true;
            }
            if (!this._onEveryStartCallbackFired) {
                if (this._onEveryStartCallback)
                    this._onEveryStartCallback(this);
                this._onEveryStartCallbackFired = true;
            }
            var timelineLocal = time - this._startTime;
            var effectiveLocal = !isFinite(this._duration) ? timelineLocal : Math.min(timelineLocal, this._duration);
            for (var _i = 0, _a = this._entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                var child = entry.node;
                if (!entry.started) {
                    // First start must wait until due; a never-started child left
                    // behind stays untouched. (Later re-starts are harmless and
                    // handled below, since Tween keeps its captured setup.)
                    if (effectiveLocal < entry.offset)
                        continue;
                    child.start(entry.offset);
                    entry.started = true;
                }
                else if (!child.isPlaying() && effectiveLocal < entry.offset + child.getTotalDuration()) {
                    // Re-enter when the playhead is inside the child's range after
                    // scrubbing back.
                    child.start(entry.offset);
                }
                // Clamp the lower end so reversed/scrubbed playheads snap the
                // child to its start value instead of freezing on stale values.
                child.update(effectiveLocal < entry.offset ? entry.offset : effectiveLocal);
            }
            if (!isFinite(this._duration)) {
                if (this._onUpdateCallback)
                    this._onUpdateCallback(this, 0);
                return true;
            }
            var elapsed = this._duration === 0 ? 1 : effectiveLocal / this._duration;
            if (this._onUpdateCallback)
                this._onUpdateCallback(this, elapsed);
            if (this._duration === 0 || timelineLocal >= this._duration) {
                if (this._onCompleteCallback)
                    this._onCompleteCallback(this);
                this._isPlaying = false;
                return false;
            }
            return true;
        };
        Timeline.autoStartOnUpdate = false;
        return Timeline;
    }());

    var VERSION = '25.0.0';

    /**
     * Tween.js - Licensed under the MIT license
     * https://github.com/tweenjs/tween.js
     * ----------------------------------------------
     *
     * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
     * Thank you all, you're awesome!
     */
    var nextId = Sequence.nextId;
    /**
     * Controlling groups of tweens
     *
     * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
     * In these cases, you may want to create your own smaller groups of tweens.
     */
    var TWEEN = mainGroup;
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
    var getAll = TWEEN.getAll.bind(TWEEN);
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
    var removeAll = TWEEN.removeAll.bind(TWEEN);
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
    var add = TWEEN.add.bind(TWEEN);
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
    var remove = TWEEN.remove.bind(TWEEN);
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
    var update = TWEEN.update.bind(TWEEN);
    var exports$1 = {
        Easing: Easing,
        Group: Group,
        Interpolation: Interpolation,
        now: now,
        setNow: setNow,
        Sequence: Sequence,
        nextId: nextId,
        Tween: Tween,
        Timeline: Timeline,
        VERSION: VERSION,
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
        getAll: getAll,
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
        removeAll: removeAll,
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
        add: add,
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
        remove: remove,
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
        update: update,
    };

    exports.Easing = Easing;
    exports.Group = Group;
    exports.Interpolation = Interpolation;
    exports.Sequence = Sequence;
    exports.Timeline = Timeline;
    exports.Tween = Tween;
    exports.VERSION = VERSION;
    exports.add = add;
    exports.default = exports$1;
    exports.getAll = getAll;
    exports.nextId = nextId;
    exports.now = now;
    exports.remove = remove;
    exports.removeAll = removeAll;
    exports.setNow = setNow;
    exports.update = update;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
