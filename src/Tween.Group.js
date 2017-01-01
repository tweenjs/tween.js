/**
 * TWEEN.Group.js - v1.0
 * Easier way to grouped tweening
 * (c) 2017 @dalisoft (https://github.com/dalisoft)
 * Licensed under MIT-License
 */

var globalScope = typeof(exports) !== "undefined" ? exports : typeof(module) !== "undefined" && typeof(global) !== "undefined" ? global : typeof(window) !== "undefined" ? window : this;

(function (root, requirement, factory) {
	if (requirement) {
		if (typeof(module) !== "undefined") {
			module.exports = factory.call(root, requirement);
		} else if (typeof(define) !== "undefined") {
			define([], function () {
				return factory.call(root, requirement);
			});
		} else {
			factory.call(root, requirement);
		}
	}
}
	(globalScope, globalScope.TWEEN, function (TWEEN, undefined) {

		// is[type] checker
		var _is = {
			arr: Array.isArray || function (o) {
				return (o instanceof Array);
			},
			func: function (o) {
				return (typeof(o) === "function");
			},
			obj: function (o) {
				return !_is.arr(o) && typeof(o) === "object";
			},
			tween: function (o) {
				return o && o.stop && o.start && o.to;
			},
			recursiveObj: function (o) {
				for (var p in o) {
					if (_is.obj(o[p]))
						return true;
				}
				return false;
			}
		};

		// Helper functions
		var _helper = {
			plusArray: function (o) {
				var n = 0;
				if (_is.arr(o)) {
					o.map(function (v) {
						n += typeof v === "number" ? v : 0;
					});
				}
				return n;
			},
			valAndDef: function (val, def) {
				return val !== undefined && val !== null ? val : def;
			},
			createObjByVal: function (name, val) {
				var o = {};
				o[name] = val;
				return o;
			},
			createMultiObj: function (o) {
				return o;
			},
			getKeys: Object.keys || function (o) {
				var _k = [];
				for (var p in o) {
					_k.push(p);
				}
				return _k;
			},
			getVals: Object.values || function (o) {
				var _k = [];
				for (var p in o) {
					_k.push(o[p]);
				}
				return _k;
			}
		};

		var _ev = {
			emit: this.EventEmitter || this.Emit || (function () {
				var _emitCallbacks = {};
				return function (t, ev, fn) {
					if (!_emitCallbacks[t]) {
						_emitCallbacks[t] = [];
					}
					if (fn) {
						_emitCallbacks[t].push(_helper.createObjByVal(ev, fn));
					} else {
						_emitCallbacks[t].map(function (emit) {
							if (emit[ev]) {
								emit[ev].call(t, _helper.createMultiObj({
										timestamp: Date.now()
									}));
							}
						});
					}
				};
			}
				())
		};


		// TWEEN.Event

		if (TWEEN.Event === undefined) {

			TWEEN.Event = {};

		}

		TWEEN.Event.Emitter = _ev.emit;


		// TWEEN.Group

		if (TWEEN.Group === undefined) {

			TWEEN.Group = function (object) {

				var _startProps = [];
				var _startVals = [];
				var _totalDuration = [];
				var _listOfTweens = [];
				var methodNames = ["easing", "interpolation", "delay", "repeat"];
				var totalElapsed = 1;
				var self = this;
				var groupTween = new TWEEN.Tween({groupElapsed:0});

				var _temp;
				var addedTweens = _is.recursiveObj(object) ? _helper.getKeys(object).map(function (k) {
						_startProps.push(k);
						_startVals.push(object[k]);
						_listOfTweens.push(new TWEEN.Tween(object[k]));
						return _listOfTweens[_listOfTweens.length - 1];
					}) : (_temp = new TWEEN.Tween(object), _listOfTweens.push(_temp), _temp);

				this.listenTweens = function (fn) {

					_listOfTweens.map(fn);

					return this;

				};

				var methods = methodNames.map(function (method) {

						self[method] = function (value) {

							return this.listenTweens(function (tween, i) {

								var getValue = _is.func(value) ? value(i) : _is.obj(value) ? value[_startProps[i]] : value;

								if (getValue === undefined || _startProps[i] === "inserted") {

									return;

								}

								if (method === "delay") {

									_totalDuration.push(_totalDuration[_totalDuration.length - 1] + (getValue || 0));

								}

								tween[method].call(tween, getValue);

							});

						};

					});

				this.to = function (props, duration) {

					return this.listenTweens(function (tween, i) {

						var getDuration = _is.func(duration) ? duration(i) : _is.obj(duration) ? duration[_startProps[i]] : duration;

						if (getDuration === undefined || _startProps[i] === "inserted") {

							getDuration = 1000;

						}

						_totalDuration.push(getDuration);

						tween.to(props[_startProps[i]], getDuration);

					});

				};

				this.start = function (time) {

					time = time !== undefined ? time : TWEEN.now();

					var _maxDuration = Math.max.apply(Math.max, _totalDuration);

						_maxDuration += (50 / 3);

					groupTween.to({groupElapsed:1}, _maxDuration).start(time);

					return this.listenTweens(function (tween) {

						tween.start(time);

					});

				};

				this.stop = function (time) {

					return this.listenTweens(function (tween) {

						tween.stop(time);

					});

				};

				this.onUpdate = function (fn) {

					groupTween.onUpdate(function (elapsed) {

							totalElapsed = this.groupElapsed;

							fn.call(object, totalElapsed);

						});

					return fn === undefined ? totalElapsed : this;

				};

				this.insert = function () {

					[].slice.call(arguments).map(function (param) {

						if (_is.tween(param)) {

							_listOfTweens.push(param);
							_startProps.push("inserted");
							_startVals.push("inserted");

						}

					});

					return this;

				};

				this.addDelayed = function (amount) {

					return listenTweens.map(function (tween, i) {

						return tween.delay(amount * i);

					});

				};

				this.erase = function () {

					var i;
					[].slice.call(arguments).map(function (param) {

						if (_is.tween(param) && (i = _listOfTweens.indexOf(param)) > -1) {

							_listOfTweens.splice(i, 1);

						}

					});

					return this;

				};

				return this;

			};

		}

		return TWEEN;

	}));
