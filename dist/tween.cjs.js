'use strict';

var NOW;
// Include a performance.now polyfill.
// In node.js, use process.hrtime.
// @ts-ignore
if (typeof (self) === 'undefined' && typeof (process) !== 'undefined' && process.hrtime) {
    NOW = function () {
        // @ts-ignore
        var time = process.hrtime();
        // Convert [seconds, nanoseconds] to milliseconds.
        return time[0] * 1000 + time[1] / 1000000;
    };
}
// In a browser, use self.performance.now if it is available.
else if (typeof (self) !== 'undefined' && self.performance !== undefined && self.performance.now !== undefined) {
    // This must be bound, because directly assigning this function
    // leads to an invocation exception in Chrome.
    NOW = self.performance.now.bind(self.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
    NOW = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
    NOW = function () {
        return new Date().getTime();
    };
}
var NOW$1 = NOW;

/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
var Group = /** @class */ (function () {
    function Group() {
        this._tweens = {};
        this._tweensAddedDuringUpdate = {};
    }
    Group.prototype.getAll = function () {
        var _this = this;
        return Object.keys(this._tweens).map(function (tweenId) {
            return _this._tweens[tweenId];
        });
    };
    Group.prototype.removeAll = function () {
        this._tweens = {};
    };
    Group.prototype.add = function (tween) {
        this._tweens[tween.getId()] = tween;
        this._tweensAddedDuringUpdate[tween.getId()] = tween;
    };
    Group.prototype.remove = function (tween) {
        delete this._tweens[tween.getId()];
        delete this._tweensAddedDuringUpdate[tween.getId()];
    };
    Group.prototype.update = function (time, preserve) {
        var tweenIds = Object.keys(this._tweens);
        if (tweenIds.length === 0) {
            return false;
        }
        time = time !== undefined ? time : NOW$1();
        // Tweens are updated in "batches". If you add a new tween during an
        // update, then the new tween will be updated in the next batch.
        // If you remove a tween during an update, it may or may not be updated.
        // However, if the removed tween was added during the current batch,
        // then it will not be updated.
        while (tweenIds.length > 0) {
            this._tweensAddedDuringUpdate = {};
            for (var i = 0; i < tweenIds.length; i++) {
                var tween = this._tweens[tweenIds[i]];
                if (tween && tween.update(time) === false) {
                    tween.playing = false;
                    if (!preserve) {
                        delete this._tweens[tweenIds[i]];
                    }
                }
            }
            tweenIds = Object.keys(this._tweensAddedDuringUpdate);
        }
        return true;
    };
    return Group;
}());

/**
 *
 */
var Easing = {
    Linear: {
        None: function (amount) {
            return amount;
        }
    },
    Quadratic: {
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
        }
    },
    Cubic: {
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
        }
    },
    Quartic: {
        In: function (amount) {
            return amount * amount * amount * amount;
        },
        Out: function (amount) {
            return 1 - (--amount * amount * amount * amount);
        },
        InOut: function (amount) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount * amount * amount;
            }
            return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
        }
    },
    Quintic: {
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
        }
    },
    Sinusoidal: {
        In: function (amount) {
            return 1 - Math.cos(amount * Math.PI / 2);
        },
        Out: function (amount) {
            return Math.sin(amount * Math.PI / 2);
        },
        InOut: function (amount) {
            return 0.5 * (1 - Math.cos(Math.PI * amount));
        }
    },
    Exponential: {
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
        }
    },
    Circular: {
        In: function (amount) {
            return 1 - Math.sqrt(1 - amount * amount);
        },
        Out: function (amount) {
            return Math.sqrt(1 - (--amount * amount));
        },
        InOut: function (amount) {
            if ((amount *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
        }
    },
    Elastic: {
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
        }
    },
    Back: {
        In: function (amount) {
            var s = 1.70158;
            return amount * amount * ((s + 1) * amount - s);
        },
        Out: function (amount) {
            var s = 1.70158;
            return --amount * amount * ((s + 1) * amount + s) + 1;
        },
        InOut: function (amount) {
            var s = 1.70158 * 1.525;
            if ((amount *= 2) < 1) {
                return 0.5 * (amount * amount * ((s + 1) * amount - s));
            }
            return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
        }
    },
    Bounce: {
        In: function (amount) {
            return 1 - Easing.Bounce.Out(1 - amount);
        },
        Out: function (amount) {
            if (amount < (1 / 2.75)) {
                return 7.5625 * amount * amount;
            }
            else if (amount < (2 / 2.75)) {
                return 7.5625 * (amount -= (1.5 / 2.75)) * amount + 0.75;
            }
            else if (amount < (2.5 / 2.75)) {
                return 7.5625 * (amount -= (2.25 / 2.75)) * amount + 0.9375;
            }
            else {
                return 7.5625 * (amount -= (2.625 / 2.75)) * amount + 0.984375;
            }
        },
        InOut: function (amount) {
            if (amount < 0.5) {
                return Easing.Bounce.In(amount * 2) * 0.5;
            }
            return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
        }
    }
};

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
                i = Math.floor(f = m * (1 + k));
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
        }
    }
};

/**
 * Utils
 */
var Sequence = /** @class */ (function () {
    function Sequence() {
    }
    Sequence._nextId = 0;
    Sequence.nextId = function () {
        return Sequence._nextId++;
    };
    return Sequence;
}());

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
/**
 * A tween (from in-between) is a concept that allows you to change the values of the properties of an object in a
 * smooth way. You just tell it which properties you want to change, which final values should they have when the
 * tween finishes running, and how long should this take, and the tweening engine will take care of finding the
 * intermediate values from the starting to the ending point.
 */
var Tween = /** @class */ (function () {
    function Tween(object, groupRef) {
        this.playing = false;
        this.paused = false;
        this.pauseStart = 0;
        this.valuesStart = {};
        this.valuesEnd = {};
        this.valuesStartRepeat = {};
        this.durationValue = 1000;
        this.repeatValue = 0;
        this.yoyoValue = false;
        this.reversed = false;
        this.delayTime = 0;
        this.startTime = 0;
        this.easingFunction = Easing.Linear.None;
        this.interpolationFunction = Interpolation.Linear;
        this.chainedTweens = [];
        this.onStartCallbackFired = false;
        this.id = Sequence.nextId();
        this.object = object;
        this.groupRef = groupRef || Tween.TWEEN;
    }
    Tween.inject = function (instance) {
        Tween.TWEEN = instance;
    };
    Tween.prototype.getId = function () {
        return this.id;
    };
    Tween.prototype.isPlaying = function () {
        return this.playing;
    };
    Tween.prototype.isPaused = function () {
        return this.paused;
    };
    Tween.prototype.to = function (properties, duration) {
        this.valuesEnd = Object.create(properties);
        if (duration !== undefined) {
            this.durationValue = duration;
        }
        return this;
    };
    Tween.prototype.duration = function (value) {
        this.durationValue = value;
        return this;
    };
    Tween.prototype.start = function (time) {
        this.groupRef.add(this);
        this.playing = true;
        this.paused = false;
        this.onStartCallbackFired = false;
        this.startTime = time !== undefined
            ? (typeof time === 'string'
                ? NOW$1() + parseFloat(time)
                : time)
            : NOW$1();
        this.startTime += this.delayTime;
        for (var property in this.valuesEnd) {
            // Check if an Array was provided as property value
            if (this.valuesEnd[property] instanceof Array) {
                if (this.valuesEnd[property].length === 0) {
                    continue;
                }
                // Create a local copy of the Array with the start value at the front
                this.valuesEnd[property] = [this.object[property]].concat(this.valuesEnd[property]);
            }
            // If `to()` specifies a property that doesn't exist in the source object,
            // we should not set that property in the object
            if (this.object[property] === undefined) {
                continue;
            }
            // Save the starting value, but only once.
            if (typeof (this.valuesStart[property]) === 'undefined') {
                this.valuesStart[property] = this.object[property];
            }
            if ((this.valuesStart[property] instanceof Array) === false) {
                this.valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }
            this.valuesStartRepeat[property] = this.valuesStart[property] || 0;
        }
        return this;
    };
    Tween.prototype.stop = function () {
        if (!this.playing) {
            return this;
        }
        this.groupRef.remove(this);
        this.playing = false;
        this.paused = false;
        if (this.onStopCallback) {
            this.onStopCallback(this.object);
        }
        this.stopChainedTweens();
        return this;
    };
    Tween.prototype.end = function () {
        this.update(Infinity);
        return this;
    };
    Tween.prototype.pause = function (time) {
        if (this.paused || !this.playing) {
            return this;
        }
        this.paused = true;
        this.pauseStart = time === undefined ? NOW$1() : time;
        this.groupRef.remove(this);
        return this;
    };
    Tween.prototype.resume = function (time) {
        if (!this.paused || !this.playing) {
            return this;
        }
        this.paused = false;
        this.startTime += (time === undefined ? NOW$1() : time) - this.pauseStart;
        this.pauseStart = 0;
        this.groupRef.add(this);
        return this;
    };
    Tween.prototype.stopChainedTweens = function () {
        for (var i = 0, numChainedTweens = this.chainedTweens.length; i < numChainedTweens; i++) {
            this.chainedTweens[i].stop();
        }
    };
    Tween.prototype.group = function (group) {
        this.groupRef = group;
        return this;
    };
    Tween.prototype.delay = function (amount) {
        this.delayTime = amount;
        return this;
    };
    Tween.prototype.repeat = function (times) {
        this.repeatValue = times;
        return this;
    };
    Tween.prototype.repeatDelay = function (amount) {
        this.repeatDelayTime = amount;
        return this;
    };
    Tween.prototype.yoyo = function (yoyo) {
        this.yoyoValue = yoyo;
        return this;
    };
    Tween.prototype.easing = function (easing) {
        this.easingFunction = easing;
        return this;
    };
    Tween.prototype.interpolation = function (interpolation) {
        this.interpolationFunction = interpolation;
        return this;
    };
    Tween.prototype.chain = function () {
        var tweens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
        }
        this.chainedTweens = tweens;
        return this;
    };
    Tween.prototype.onStart = function (callback) {
        this.onStartCallback = callback;
        return this;
    };
    Tween.prototype.onUpdate = function (callback) {
        this.onUpdateCallback = callback;
        return this;
    };
    Tween.prototype.onRepeat = function (callback) {
        this.onRepeatCallback = callback;
        return this;
    };
    Tween.prototype.onComplete = function (callback) {
        this.onCompleteCallback = callback;
        return this;
    };
    Tween.prototype.onStop = function (callback) {
        this.onStopCallback = callback;
        return this;
    };
    /**
     * Tween.js doesn't run by itself. You need to tell it when to run, by explicitly calling the update method.
     * The recommended method is to do this inside your main animation loop, which should be called with
     * requestAnimationFrame for getting the best graphics performance
     *
     * If called without parameters, update will determine the current time in order to find out how long has it been
     * since the last time it ran.
     *
     * @param time
     */
    Tween.prototype.update = function (time) {
        if (time === void 0) { time = 0; }
        var property;
        var elapsed;
        var value;
        if (time < this.startTime) {
            return true;
        }
        if (this.onStartCallbackFired === false) {
            if (this.onStartCallback) {
                this.onStartCallback(this.object);
            }
            this.onStartCallbackFired = true;
        }
        elapsed = (time - this.startTime) / this.durationValue;
        elapsed = (this.durationValue === 0 || elapsed > 1) ? 1 : elapsed;
        value = this.easingFunction(elapsed);
        for (property in this.valuesEnd) {
            // Don't update properties that do not exist in the source object
            if (this.valuesStart[property] === undefined) {
                continue;
            }
            var start = this.valuesStart[property] || 0;
            var end = this.valuesEnd[property];
            if (end instanceof Array) {
                this.object[property] = this.interpolationFunction(end, value);
            }
            else {
                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof (end) === 'string') {
                    if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                        end = start + parseFloat(end);
                    }
                    else {
                        end = parseFloat(end);
                    }
                }
                // Protect against non numeric properties.
                if (typeof (end) === 'number') {
                    this.object[property] = start + (end - start) * value;
                }
            }
        }
        if (this.onUpdateCallback) {
            this.onUpdateCallback(this.object, elapsed);
        }
        if (elapsed === 1) {
            if (this.repeatValue > 0) {
                if (isFinite(this.repeatValue)) {
                    this.repeatValue--;
                }
                // Reassign starting values, restart by making startTime = now
                for (property in this.valuesStartRepeat) {
                    if (typeof (this.valuesEnd[property]) === 'string') {
                        this.valuesStartRepeat[property] = this.valuesStartRepeat[property] + parseFloat(this.valuesEnd[property]);
                    }
                    if (this.yoyoValue) {
                        var tmp = this.valuesStartRepeat[property];
                        this.valuesStartRepeat[property] = this.valuesEnd[property];
                        this.valuesEnd[property] = tmp;
                    }
                    this.valuesStart[property] = this.valuesStartRepeat[property];
                }
                if (this.yoyoValue) {
                    this.reversed = !this.reversed;
                }
                if (this.repeatDelayTime !== undefined) {
                    this.startTime = time + this.repeatDelayTime;
                }
                else {
                    this.startTime = time + this.delayTime;
                }
                if (this.onRepeatCallback) {
                    this.onRepeatCallback(this.object);
                }
                return true;
            }
            else {
                if (this.onCompleteCallback) {
                    this.onCompleteCallback(this.object);
                }
                for (var i = 0, numChainedTweens = this.chainedTweens.length; i < numChainedTweens; i++) {
                    // Make the chained tweens start exactly at the time they should,
                    // even if the `update()` method was called way past the duration of the tween
                    this.chainedTweens[i].start(this.startTime + this.durationValue);
                }
                return false;
            }
        }
        return true;
    };
    return Tween;
}());

var VERSION = '18.6.0';

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.version = VERSION;
        _this.now = NOW$1;
        _this.Group = Group;
        _this.Easing = Easing;
        _this.Interpolation = Interpolation;
        _this.nextId = Sequence.nextId;
        _this.Tween = Tween;
        return _this;
    }
    return Main;
}(Group));
var TWEEN = new Main();
Tween.inject(TWEEN);

module.exports = TWEEN;
