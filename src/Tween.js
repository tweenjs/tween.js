/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time, preserve) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time) || preserve) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
		 window.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	TWEEN.now = function () {
		return new Date().getTime();
	};
}

var privates = new WeakMap();

function _(instance) {
	var privateObject = privates.get(instance);

	if (!privateObject) {
		privateObject = {};
		privates.set(instance, privateObject);
	}

	return privateObject;
}

TWEEN.Tween = function (object) {

	_(this).object = object;
	_(this).valuesStart = {};
	_(this).valuesEnd = {};
	_(this).valuesStartRepeat = {};
	_(this).duration = 1000;
	_(this).repeat = 0;
	_(this).repeatDelayTime = undefined;
	_(this).yoyo = false;
	_(this).isPlaying = false;
	_(this).reversed = false;
	_(this).delayTime = 0;
	_(this).startTime = null;
	_(this).easingFunction = TWEEN.Easing.Linear.None;
	_(this).interpolationFunction = TWEEN.Interpolation.Linear;
	_(this).chainedTweens = [];
	_(this).onStartCallback = null;
	_(this).onStartCallbackFired = false;
	_(this).onUpdateCallback = null;
	_(this).onCompleteCallback = null;
	_(this).onStopCallback = null;

};

TWEEN.Tween.prototype = Object.assign(Object.create(Object.prototype), {
	to: function to(properties, duration) {

		_(this).valuesEnd = properties;

		if (duration !== undefined) {
			_(this).duration = duration;
		}

		return this;

	},

	start: function start(time) {

		TWEEN.add(this);

		_(this).isPlaying = true;

		_(this).onStartCallbackFired = false;

		_(this).startTime = time !== undefined ? time : TWEEN.now();
		_(this).startTime += _(this).delayTime;

		for (var property in _(this).valuesEnd) {

			// Check if an Array was provided as property value
			if (_(this).valuesEnd[property] instanceof Array) {

				if (_(this).valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_(this).valuesEnd[property] = [_(this).object[property]].concat(_(this).valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_(this).object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			_(this).valuesStart[property] = _(this).object[property];

			if ((_(this).valuesStart[property] instanceof Array) === false) {
				_(this).valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_(this).valuesStartRepeat[property] = _(this).valuesStart[property] || 0;

		}

		return this;

	},

	stop: function stop() {

		if (!_(this).isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_(this).isPlaying = false;

		if (_(this).onStopCallback !== null) {
			_(this).onStopCallback.call(_(this).object, _(this).object);
		}

		this.stopChainedTweens();
		return this;

	},

	end: function end() {

		this.update(_(this).startTime + _(this).duration);
		return this;

	},

	stopChainedTweens: function stopChainedTweens() {

		for (var i = 0, numChainedTweens = _(this).chainedTweens.length; i < numChainedTweens; i++) {
			_(this).chainedTweens[i].stop();
		}

	},

	delay: function delay(amount) {

		_(this).delayTime = amount;
		return this;

	},

	repeat: function repeat(times) {

		_(this).repeat = times;
		return this;

	},

	repeatDelay: function repeatDelay(amount) {

		_(this).repeatDelayTime = amount;
		return this;

	},

	yoyo: function yoyo(yoyo) {

		_(this).yoyo = yoyo;
		return this;

	},

	easing: function easing(easing) {

		_(this).easingFunction = easing;
		return this;

	},

	interpolation: function interpolation(interpolation) {

		_(this).interpolationFunction = interpolation;
		return this;

	},

	chain: function chain() {

		_(this).chainedTweens = arguments;
		return this;

	},

	onStart: function onStart(callback) {

		_(this).onStartCallback = callback;
		return this;

	},

	onUpdate: function onUpdate(callback) {

		_(this).onUpdateCallback = callback;
		return this;

	},

	onComplete: function onComplete(callback) {

		_(this).onCompleteCallback = callback;
		return this;

	},

	onStop: function onStop(callback) {

		_(this).onStopCallback = callback;
		return this;

	},

	update: function update(time) {

		var property;
		var elapsed;
		var value;

		if (time < _(this).startTime) {
			return true;
		}

		if (_(this).onStartCallbackFired === false) {

			if (_(this).onStartCallback !== null) {
				_(this).onStartCallback.call(_(this).object, _(this).object);
			}

			_(this).onStartCallbackFired = true;
		}

		elapsed = (time - _(this).startTime) / _(this).duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _(this).easingFunction(elapsed);

		for (property in _(this).valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_(this).valuesStart[property] === undefined) {
				continue;
			}

			var start = _(this).valuesStart[property] || 0;
			var end = _(this).valuesEnd[property];

			if (end instanceof Array) {

				_(this).object[property] = _(this).interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_(this).object[property] = start + (end - start) * value;
				}

			}

		}

		if (_(this).onUpdateCallback !== null) {
			_(this).onUpdateCallback.call(_(this).object, value);
		}

		if (elapsed === 1) {

			if (_(this).repeat > 0) {

				if (isFinite(_(this).repeat)) {
					_(this).repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _(this).valuesStartRepeat) {

					if (typeof (_(this).valuesEnd[property]) === 'string') {
						_(this).valuesStartRepeat[property] = _(this).valuesStartRepeat[property] + parseFloat(_(this).valuesEnd[property]);
					}

					if (_(this).yoyo) {
						var tmp = _(this).valuesStartRepeat[property];

						_(this).valuesStartRepeat[property] = _(this).valuesEnd[property];
						_(this).valuesEnd[property] = tmp;
					}

					_(this).valuesStart[property] = _(this).valuesStartRepeat[property];

				}

				if (_(this).yoyo) {
					_(this).reversed = !_(this).reversed;
				}

				if (_(this).repeatDelayTime !== undefined) {
					_(this).startTime = time + _(this).repeatDelayTime;
				} else {
					_(this).startTime = time + _(this).delayTime;
				}

				return true;

			} else {

				if (_(this).onCompleteCallback !== null) {

					_(this).onCompleteCallback.call(_(this).object, _(this).object);
				}

				for (var i = 0, numChainedTweens = _(this).chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_(this).chainedTweens[i].start(_(this).startTime + _(this).duration);
				}

				return false;

			}

		}

		return true;

	}
});


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

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
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

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

			var fc = TWEEN.Interpolation.Utils.Factorial;

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

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof define === 'function' && define.amd) {

		// AMD
		define([], function () {
			return TWEEN;
		});

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);
