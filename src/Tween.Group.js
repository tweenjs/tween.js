/**
 * TWEEN.Group.js - v1.0
 * Easier way to grouped tweening
 * (c) 2017 @dalisoft (https://github.com/dalisoft)
 * Licensed under MIT-License
 */

// TWEEN.Group

if (this.TWEEN && TWEEN.Group === undefined) {

	// some helper for reduce size
	function recursiveObject(o) {
		for (var p in o) {
			if (typeof(o[p]) === "object")
				return true;
		}
		return false;
	}

	var methodNames = ["easing", "interpolation", "delay", "repeat"];

	TWEEN.Group = function (object) {

		var _startProps = [];
		var _totalDuration = [];
		var _listOfTweens = [];
		var totalElapsed = 1;
		var self = this;
		var groupTween = new TWEEN.Tween({
				groupElapsed: 0
			});

		var _temp;
		var addedTweens = recursiveObject(object) ? Object.keys(object)
			.map(function (k) {
				_startProps.push(k);
				_listOfTweens.push(new TWEEN.Tween(object[k]));
				return _listOfTweens[_listOfTweens.length - 1];
			}) : (_temp = new TWEEN.Tween(object), _listOfTweens.push(_temp), _temp);

		this.eachTween = function (fn) {

			_listOfTweens.map(fn);

			return this;

		};

		var methods = methodNames.map(function (method) {

				self[method] = function (value) {

					return this.eachTween(function (tween, i) {

						var newValue = typeof(value) === "function" ? value(i) : typeof(value) === "object" ? value[_startProps[i]] : value;

						if (newValue === undefined || _startProps[i] === "inserted") {

							return;

						}

						if (method === "delay") {

							_totalDuration.push(_totalDuration[_totalDuration.length - 1] + (newValue || 0));

						}

						tween[method].call(tween, newValue);

					});

				};

			});

		this.to = function (props, duration) {

			return this.eachTween(function (tween, i) {

				var _duration = typeof(duration) === "function" ? duration(i) : typeof(duration) === "object" ? duration[_startProps[i]] : duration;

				if (_duration === undefined || _startProps[i] === "inserted") {

					_duration = 1000;

				}

				_totalDuration.push(_duration);

				tween.to(props[_startProps[i]], _duration);

			});

		};

		this.start = function (time) {

			time = time !== undefined ? time : TWEEN.now();

			var _maxDuration = Math.max.apply(Math.max, _totalDuration);

			_maxDuration += (50 / 3);

			groupTween.to({
				groupElapsed: 1
			}, _maxDuration)
			.start(time);

			return this.eachTween(function (tween) {

				tween.start(time);

			});

		};

		this.stop = function (time) {

			return this.eachTween(function (tween) {

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

		this.insert = function (param) {

			_listOfTweens.push(param);
			_startProps.push("inserted");

			return this;

		};

		this.filterTweens = function (param) {

			_listOfTweens = _listOfTweens.filter(param);

			return this;

		};

		this.erase = function (param) {

			return this.filterTweens(function (tween) {
				return tween !== param;
			});

		};

		return this;

	};

}
