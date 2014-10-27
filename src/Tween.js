/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/dalisoft/tween.js
 */

(function (win, undefined) {
	// Date.now shim for (ahem) Internet Explo(d|r)er
	if (Date.now === undefined) {

		Date.now = function () {

			return new Date().valueOf();

		};

	}

	// fix when TWEEN.remove(this) on IE7, IE8
	if (Array.prototype.indexOf === undefined) {
		Array.prototype.indexOf = function (arr) {
			var value = -1;
			for (var i = 0; i < this.length; i++) {
				if (this[i] === arr) {
					value = i;
				}
			}
			return value;
		};
	}

	var number = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;

	function stringTween(a, b) {
		var string = [],
		keys = [],
		from = [],
		to = [],
		cursor = 0,
		m;
		while (m = number.exec(b)) {
			if (m.index > cursor) {
				string.push(b.slice(cursor, m.index));
			}
			var toM = parseFloat(m[0], 10),
			rv = m[0].charAt(0);
			rv = /\+|-|\/*\/|\//g.test(rv) ? rv : false;

			to.push(toM);
			keys.push(string.length);
			string.push(null);
			cursor = number.lastIndex;
		}
		if (cursor < b.length) {
			string.push(b.slice(cursor));
		}
		while (m = number.exec(a)) {
			var fromM = parseFloat(m[0], 10);
			from.push(fromM);
		}

		return function frame(n) {
			for (var i = 0; i < keys.length; i++) {
				string[keys[i]] = from[i] + (to[i] - from[i]) * n;
			}
			return string.join('');
		}
	}

	var colorNames = {
		aliceblue : "f0f8ff",
		antiquewhite : "faebd7",
		aqua : "0ff",
		aquamarine : "7fffd4",
		azure : "f0ffff",
		beige : "f5f5dc",
		bisque : "ffe4c4",
		black : "000",
		blanchedalmond : "ffebcd",
		blue : "00f",
		blueviolet : "8a2be2",
		brown : "a52a2a",
		burlywood : "deb887",
		burntsienna : "ea7e5d",
		cadetblue : "5f9ea0",
		chartreuse : "7fff00",
		chocolate : "d2691e",
		coral : "ff7f50",
		cornflowerblue : "6495ed",
		cornsilk : "fff8dc",
		crimson : "dc143c",
		cyan : "0ff",
		darkblue : "00008b",
		darkcyan : "008b8b",
		darkgoldenrod : "b8860b",
		darkgray : "a9a9a9",
		darkgreen : "006400",
		darkgrey : "a9a9a9",
		darkkhaki : "bdb76b",
		darkmagenta : "8b008b",
		darkolivegreen : "556b2f",
		darkorange : "ff8c00",
		darkorchid : "9932cc",
		darkred : "8b0000",
		darksalmon : "e9967a",
		darkseagreen : "8fbc8f",
		darkslateblue : "483d8b",
		darkslategray : "2f4f4f",
		darkslategrey : "2f4f4f",
		darkturquoise : "00ced1",
		darkviolet : "9400d3",
		deeppink : "ff1493",
		deepskyblue : "00bfff",
		dimgray : "696969",
		dimgrey : "696969",
		dodgerblue : "1e90ff",
		firebrick : "b22222",
		floralwhite : "fffaf0",
		forestgreen : "228b22",
		fuchsia : "f0f",
		gainsboro : "dcdcdc",
		ghostwhite : "f8f8ff",
		gold : "ffd700",
		goldenrod : "daa520",
		gray : "808080",
		green : "008000",
		greenyellow : "adff2f",
		grey : "808080",
		honeydew : "f0fff0",
		hotpink : "ff69b4",
		indianred : "cd5c5c",
		indigo : "4b0082",
		ivory : "fffff0",
		khaki : "f0e68c",
		lavender : "e6e6fa",
		lavenderblush : "fff0f5",
		lawngreen : "7cfc00",
		lemonchiffon : "fffacd",
		lightblue : "add8e6",
		lightcoral : "f08080",
		lightcyan : "e0ffff",
		lightgoldenrodyellow : "fafad2",
		lightgray : "d3d3d3",
		lightgreen : "90ee90",
		lightgrey : "d3d3d3",
		lightpink : "ffb6c1",
		lightsalmon : "ffa07a",
		lightseagreen : "20b2aa",
		lightskyblue : "87cefa",
		lightslategray : "789",
		lightslategrey : "789",
		lightsteelblue : "b0c4de",
		lightyellow : "ffffe0",
		lime : "0f0",
		limegreen : "32cd32",
		linen : "faf0e6",
		magenta : "f0f",
		maroon : "800000",
		mediumaquamarine : "66cdaa",
		mediumblue : "0000cd",
		mediumorchid : "ba55d3",
		mediumpurple : "9370db",
		mediumseagreen : "3cb371",
		mediumslateblue : "7b68ee",
		mediumspringgreen : "00fa9a",
		mediumturquoise : "48d1cc",
		mediumvioletred : "c71585",
		midnightblue : "191970",
		mintcream : "f5fffa",
		mistyrose : "ffe4e1",
		moccasin : "ffe4b5",
		navajowhite : "ffdead",
		navy : "000080",
		oldlace : "fdf5e6",
		olive : "808000",
		olivedrab : "6b8e23",
		orange : "ffa500",
		orangered : "ff4500",
		orchid : "da70d6",
		palegoldenrod : "eee8aa",
		palegreen : "98fb98",
		paleturquoise : "afeeee",
		palevioletred : "db7093",
		papayawhip : "ffefd5",
		peachpuff : "ffdab9",
		peru : "cd853f",
		pink : "ffc0cb",
		plum : "dda0dd",
		powderblue : "b0e0e6",
		purple : "800080",
		red : "f00",
		rosybrown : "bc8f8f",
		royalblue : "4169e1",
		saddlebrown : "8b4513",
		salmon : "fa8072",
		sandybrown : "f4a460",
		seagreen : "2e8b57",
		seashell : "fff5ee",
		sienna : "a0522d",
		silver : "c0c0c0",
		skyblue : "87ceeb",
		slateblue : "6a5acd",
		slategray : "708090",
		slategrey : "708090",
		snow : "fffafa",
		springgreen : "00ff7f",
		steelblue : "4682b4",
		tan : "d2b48c",
		teal : "008080",
		thistle : "d8bfd8",
		tomato : "ff6347",
		turquoise : "40e0d0",
		violet : "ee82ee",
		wheat : "f5deb3",
		white : "fff",
		whitesmoke : "f5f5f5",
		yellow : "ff0",
		yellowgreen : "9acd32"
	};

	function hexToRgb(hex) {
		var shr = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shr, function (m, r, g, b) {
				return r + r + g + g + b + b;
			});
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var rgb = result ? {
			r : parseInt(result[1], 16),
			g : parseInt(result[2], 16),
			b : parseInt(result[3], 16)
		}
		 : null;
		return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
	}

	function parseColor(input) {
		var output;
		var type = input.match(/rgb|rgba|hsv|ahsv|hsl|hsla/g),
		arr = input.match(number);
		for (var i = type === 'ahsv' ? 1 : 0; i < 3; i++) {
			arr[i] = Math.round(arr[i]);
		}

		output = type + '(' + arr.join(", ") + ')';
		return output;
	}

	var TWEEN = TWEEN || (function () {

			var _tweens = [];

			return {

				REVISION : '15',

				getAll : function () {

					return _tweens;

				},

				removeAll : function () {

					_tweens = [];

				},

				add : function (tween) {

					_tweens.push(tween);

				},

				remove : function (tween) {

					var i = _tweens.indexOf(tween);

					if (i !== -1) {

						_tweens.splice(i, 1);

					}

				},

				update : function (time) {

					if (_tweens.length === 0)
						return false;

					var i = 0;

					time = time !== undefined ? time : (typeof win !== 'undefined' && win.performance !== undefined && win.performance.now !== undefined ? win.performance.now() : Date.now());
					while (i < _tweens.length) {

						if (_tweens[i].update(time)) {

							i++;

						} else {

							_tweens.splice(i, 1);

						}

					}

					return true;

				}
			};

		})();

	TWEEN.Tween = function (object) {

		var _object = object;
		var _valuesStart = {};
		var _valuesEnd = {};
		var _valuesStartRepeat = {};
		var _duration = 1000;
		var _repeat = 0;
		var _yoyo = false;
		var _isPlaying = false;
		var _reversed = false;
		var _delayTime = 0;
		var _startTime = null;
		var _easingFunction = TWEEN.Easing.Linear.None;
		var _chainedTweens = [];
		var _onStartCallback = null;
		var _onStartCallbackFired = false;
		var _onUpdateCallback = null;
		var _onCompleteCallback = null;
		var _onStopCallback = null;
		var _reverse = false;
		var _timeScale = 1;
		var _repeatDelay = 0;
		var _paused = false;
		var _pauseStart = null;
		var _now = Date.now();

		// Set all starting values present on the target object
		for (var field in object) {

			_valuesStart[field] = object[field];

		}

		this.reverse = function (state) {

			_reverse = state || true;

			return this;
		};

		this.timeScale = function (scale) {

			_timeScale = scale;

			return this;
		};

		this.repeatDelay = function (amount) {

			_repeatDelay = amount;
			return this;

		};

		this.to = function (properties, duration) {

			if (duration !== undefined) {

				_duration = duration;

			}

			_valuesEnd = properties;

			return this;

		};
		
		this.css = function ( selector, onUpdate ) {
			selector = typeof selector === "string" ? document.querySelectorAll( selector ) : selector.length ? selector : [ selector ];
			return this.onUpdate(function(value){

				if ( onUpdate ) {
					onUpdate.call(this, value);
				}
					for ( var i = 0; i < selector.length; i++ ) {
						for ( var key in this ) {
							selector[i].style[key] = this[key];
						}
					}
			});
		};

		this.start = function (time) {

			TWEEN.add(this);

			_isPlaying = true;

			_onStartCallbackFired = false;

			_startTime = time !== undefined ? time : (typeof win !== 'undefined' && win.performance !== undefined && win.performance.now !== undefined ? win.performance.now() : Date.now());
			_startTime += _delayTime;

			for (var property in _valuesEnd) {

				// check if an Array was provided as property value
				if (_valuesEnd[property]instanceof Array) {

					if (_valuesEnd[property].length === 0) {

						continue;

					}

					// create a local copy of the Array with the start value at the front
					_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

				}

				_valuesStart[property] = _object[property];

				_valuesStartRepeat[property] = _valuesStart[property] || 0;

			}

			return this;

		};

		this.pause = function () {
			if (_paused) {
				return;
			}
			_paused = true;
			_pauseStart = Date.now();

			TWEEN.remove(this);

			return this;
		};

		this.play = this.resume = function () {
			if (!_paused) {
				return;
			}
			_paused = false;
			_now = Date.now();

			_startTime += _now - _pauseStart;

			TWEEN.add(this);

			return this;
		}

		this.stop = function () {

			if (!_isPlaying) {
				return this;
			}

			TWEEN.remove(this);
			_isPlaying = false;

			if (_onStopCallback !== null) {

				_onStopCallback.call(_object);

			}

			this.stopChainedTweens();
			return this;

		};

		this.stopChainedTweens = function () {

			for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {

				_chainedTweens[i].stop();

			}

		};

		this.delay = function (amount) {

			_delayTime = amount;
			return this;

		};

		this.repeat = function (times) {

			_repeat = times;
			return this;

		};

		this.yoyo = function (yoyo) {

			_yoyo = yoyo;
			return this;

		};

		this.easing = function (easing) {

			_easingFunction = easing;
			return this;

		};

		this.chain = function () {

			_chainedTweens = arguments;
			return this;

		};

		this.onStart = function (callback) {

			_onStartCallback = callback;
			return this;

		};

		this.onUpdate = function (callback) {

			_onUpdateCallback = callback;
			return this;

		};

		this.onComplete = function (callback) {

			_onCompleteCallback = callback;
			return this;

		};

		this.onStop = function (callback) {

			_onStopCallback = callback;
			return this;

		};

		this.update = function (time) {

			var property;

			if (time < _startTime) {

				return true;

			}

			if (_onStartCallbackFired === false) {

				if (_onStartCallback !== null) {

					_onStartCallback.call(_object);

				}

				_onStartCallbackFired = true;

			}

			var elapsed = (time - _startTime) / (_duration * _timeScale);
			elapsed = elapsed > 1 ? 1 : elapsed;

			var value = _easingFunction(elapsed);

			for (property in _valuesEnd) {

				var start = (_reverse ? _valuesEnd[property] : _valuesStart[property]) || 0;
				var end = _reverse ? _valuesStart[property] : _valuesEnd[property];

				// Parses relative end values with start as base (e.g.: +10, -3, *3, /5 also you can use +=5 like relative value)
				if (typeof(start) === "string" && typeof(end) === "string") {
					start = colorNames.hasOwnProperty(start) ? '#' + colorNames[start] : start;
					end = colorNames.hasOwnProperty(end) ? '#' + colorNames[end] : end;
					start = start.charAt(0) === '#' ? hexToRgb(start) : start;
					end = end.charAt(0) === '#' ? hexToRgb(end) : end;
					var strP = stringTween(start, end)(value);
					_object[property] = /(C|c)olor/g.test(property) ? parseColor(strP) : strP;
				}
				if (typeof(end) === "string" && typeof(start) !== "string") {
					var ru = end.charAt(0),
					endV = 0,
					s = start,
					e = parseFloat(end.match(/[0-9]+/g), 10);
					if (ru === '+') {
						endV = s + e;
					} else if (ru === '-') {
						endV = s - e;
					} else if (ru === '*') {
						endV = s * e;
					} else if (ru === '/') {
						endV = s / e;
					}

					end = endV;
				}

				// protect against non numeric properties.
				if (typeof(end) === "number") {
					_object[property] = start + (end - start) * value;
				}

			}

			if (_onUpdateCallback !== null) {

				_onUpdateCallback.call(_object, value);

			}

			if (elapsed == 1) {

				if (_repeat > 0) {

					if (isFinite(_repeat)) {
						_repeat--;
					}

					// reassign starting values, restart by making startTime = now
					for (property in _valuesStartRepeat) {

						if (typeof(_valuesEnd[property]) === "string") {
							_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
						}

						if (_yoyo) {
							var tmp = _valuesStartRepeat[property];
							_valuesStartRepeat[property] = _valuesEnd[property];
							_valuesEnd[property] = tmp;
						}

						_valuesStart[property] = _valuesStartRepeat[property];

					}

					if (_yoyo) {
						_reversed = !_reversed;
					}

					_startTime = time + _delayTime;
					_startTime += _repeatDelay;

					return true;

				} else {

					if (_onCompleteCallback !== null) {

						_onCompleteCallback.call(_object);

					}

					for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {

						_chainedTweens[i].start(time);

					}

					return false;

				}

			}

			return true;

		};

	};

	TWEEN.Easing = {

		Linear : {

			None : function (k) {

				return k;

			}

		},

		Quadratic : {

			In : function (k) {

				return k * k;

			},

			Out : function (k) {

				return k * (2 - k);

			},

			InOut : function (k) {

				if ((k *= 2) < 1)
					return 0.5 * k * k;
				return  - 0.5 * (--k * (k - 2) - 1);

			}

		},

		Cubic : {

			In : function (k) {

				return k * k * k;

			},

			Out : function (k) {

				return --k * k * k + 1;

			},

			InOut : function (k) {

				if ((k *= 2) < 1)
					return 0.5 * k * k * k;
				return 0.5 * ((k -= 2) * k * k + 2);

			}

		},

		Quartic : {

			In : function (k) {

				return k * k * k * k;

			},

			Out : function (k) {

				return 1 - (--k * k * k * k);

			},

			InOut : function (k) {

				if ((k *= 2) < 1)
					return 0.5 * k * k * k * k;
				return  - 0.5 * ((k -= 2) * k * k * k - 2);

			}

		},

		Quintic : {

			In : function (k) {

				return k * k * k * k * k;

			},

			Out : function (k) {

				return --k * k * k * k * k + 1;

			},

			InOut : function (k) {

				if ((k *= 2) < 1)
					return 0.5 * k * k * k * k * k;
				return 0.5 * ((k -= 2) * k * k * k * k + 2);

			}

		},

		Sinusoidal : {

			In : function (k) {

				return 1 - Math.cos(k * Math.PI / 2);

			},

			Out : function (k) {

				return Math.sin(k * Math.PI / 2);

			},

			InOut : function (k) {

				return 0.5 * (1 - Math.cos(Math.PI * k));

			}

		},

		Exponential : {

			In : function (k) {

				return k === 0 ? 0 : Math.pow(1024, k - 1);

			},

			Out : function (k) {

				return k === 1 ? 1 : 1 - Math.pow(2,  - 10 * k);

			},

			InOut : function (k) {

				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if ((k *= 2) < 1)
					return 0.5 * Math.pow(1024, k - 1);
				return 0.5 * ( - Math.pow(2,  - 10 * (k - 1)) + 2);

			}

		},

		Circular : {

			In : function (k) {

				return 1 - Math.sqrt(1 - k * k);

			},

			Out : function (k) {

				return Math.sqrt(1 - (--k * k));

			},

			InOut : function (k) {

				if ((k *= 2) < 1)
					return  - 0.5 * (Math.sqrt(1 - k * k) - 1);
				return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

			}

		},

		Elastic : {

			In : function (k) {

				var s,
				a = 0.1,
				p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI);
				return  - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));

			},

			Out : function (k) {

				var s,
				a = 0.1,
				p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI);
				return (a * Math.pow(2,  - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);

			},

			InOut : function (k) {

				var s,
				a = 0.1,
				p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI);
				if ((k *= 2) < 1)
					return  - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
				return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

			}

		},

		Back : {

			In : function (k) {

				var s = 1.70158;
				return k * k * ((s + 1) * k - s);

			},

			Out : function (k) {

				var s = 1.70158;
				return --k * k * ((s + 1) * k + s) + 1;

			},

			InOut : function (k) {

				var s = 1.70158 * 1.525;
				if ((k *= 2) < 1)
					return 0.5 * (k * k * ((s + 1) * k - s));
				return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

			}

		},

		Bounce : {

			In : function (k) {

				return 1 - TWEEN.Easing.Bounce.Out(1 - k);

			},

			Out : function (k) {

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

			InOut : function (k) {

				if (k < 0.5)
					return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
				return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

			}

		},

		SteppedEase : {
			config : function (steps) {
				return function (k) {
					return Math.floor(k * steps) / steps;
				}
			}
		}

	};

	// Node: Export function
	if (typeof module !== "undefined" && module.exports) {
		module.exports = TWEEN;
	}
	// AMD/requirejs: Define the module
	else if (typeof define === 'function' && define.amd) {
		define(function () {
			return TWEEN;
		});
	}
	// Browser: Expose to window
	else {
		win.TWEEN = TWEEN;
	}

}(window));
