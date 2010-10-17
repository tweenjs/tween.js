/**
     * @author sole / http://soledadpenades.com
     * @author mr.doob / http://mrdoob.com
     * @author Philippe / http://philippe.elsass.me
     * @author Robert Eisele / http://www.xarg.org
     * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
     */

var TWEEN = TWEEN || (function() {

    var tweens = [];

    this.time = new Date().getTime();
    this.rate = 1000 / 60;
    this.ease = {};

    this.add = function(tween) {

	tweens.push(tween);
    };

    this.remove = function(tween) {

	var i = tweens.length;

	while (i--) {

	    if (tween === tweens[i]) {
		tweens.splice(i, 1);
		return true;
	    }
	}
	return false;
    };

    this.update = function() {

	this.time+= this.rate;

	var i = 0, l = tweens.length;

	while (i < l) {
	    tweens[i].update(this.time) ? ++i : tweens.splice(i, 1);
	}
    };

    return this;
})();

TWEEN.Tween = function(object) {

    TWEEN.add(this);

    var _object = object,
    _valuesStart = {},
    _valuesDelta = {},
    _valuesEnd = {},
    _duration = 1000,
    _delayTime = 0,
    _startTime = null,
    _easingCB = TWEEN.ease.ElasticEaseInOut,
    _nextTween = null,
    _onUpdateCB = null,
    _onCompleteCB = null,
    _completed = false;

    this.to = function(properties, duration) {

	_duration = duration;

	for (var property in properties) {

	    if (property in _object) {
		// The current values are read when the tween starts;
		// here we only store the final desired values
		_valuesEnd[property] = properties[property];
	    }
	}
	return this;
    };

    this.start = function() {

	_completed = false;
	_startTime = TWEEN.time + _delayTime;

	for (var property in _valuesEnd) {

	    if (property in _object) {
		_valuesStart[property] = _object[property];
		_valuesDelta[property] = _valuesEnd[property] - _object[property];
	    }
	}
	return this;
    };

    this.delay = function(amount) {

	_delayTime = amount;
	return this;
    };

    this.easing = function(easing) {

	_easingCB = easing;
	return this;
    };

    this.next = function(nextTween) {

	_nextTween = nextTween;
    };

    this.onUpdate = function(onUpdateCB) {

	_onUpdateCB = onUpdateCB;
	return this;
    };

    this.onComplete = function(onCompleteCB) {

	_onCompleteCB = onCompleteCB;
	return this;
    };

    this.update = function(time) {

	var property, elapsed, value;

	if (_startTime === null || time < _startTime) {
	    return true;
	}

	if (_completed) {
	    return _nextTween === null;
	}

	if (1 < (elapsed = (time - _startTime) / _duration)) {
	    elapsed = 1;
	}

	value = _easingCB(elapsed);

	for (property in _valuesDelta) {
	    _object[property] = _valuesStart[property] + _valuesDelta[property] * value;
	}

	if (_onUpdateCB !== null) {
	    _onUpdateCB.call(_object, value);
	}

	if (elapsed === 1) {

	    _completed = true;
	    _startTime = null;

	    if (null !== _onCompleteCB) {
		_onCompleteCB.call(_object);
	    }

	    if (null !== _nextTween) {
		_nextTween.start();
		return true;  // this tween cannot be safely destroyed
	    } else {
		return false; // no associated tweens, tween can be destroyed
	    }
	}
	return true;
    };

    this.destroy = function() {

	TWEEN.remove(this);
    };
}


TWEEN.ease.LinearEaseNone = function(k) {

    return k;
};

//

TWEEN.ease.QuadraticEaseIn = function(k) {

    return k * k;
};

TWEEN.ease.QuadraticEaseOut = function(k) {

    return -k * (k - 2);
};

TWEEN.ease.QuadraticEaseInOut = function(k) {

    if ((k*= 2) < 1)
	return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
};

//

TWEEN.ease.CubicEaseIn = function(k) {

    return k * k * k;
};

TWEEN.ease.CubicEaseOut = function(k) {

    return 1 + --k * k * k;
};

TWEEN.ease.CubicEaseInOut = function(k) {

    if ((k*= 2) < 1)
	return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
};

//

TWEEN.ease.QuarticEaseIn = function(k) {

    return k * k * k * k;
};

TWEEN.ease.QuarticEaseOut = function(k) {

    return -(--k * k * k * k - 1);

}

TWEEN.ease.QuarticEaseInOut = function(k) {

    if ((k*= 2) < 1)
	return 0.5 * k * k * k * k;
    return - 0.5 * ((k-= 2) * k * k * k - 2);
};

//

TWEEN.ease.QuinticEaseIn = function(k) {

    return k * k * k * k * k;
};

TWEEN.ease.QuinticEaseOut = function(k) {

    return --k * k * k * k * k + 1;
};

TWEEN.ease.QuinticEaseInOut = function(k) {

    if ((k*= 2) < 1)
	return 0.5 * k * k * k * k * k;
    return 0.5 * ((k-= 2) * k * k * k * k + 2);
};

//

TWEEN.ease.SinusoidalEaseIn = function(k) {

    return 1 - Math.cos(k * Math.PI / 2);
};

TWEEN.ease.SinusoidalEaseOut = function(k) {

    return Math.sin(k * Math.PI / 2);
};

TWEEN.ease.SinusoidalEaseInOut = function(k) {

    return 0.5 - 0.5 * Math.cos(Math.PI * k);
};

//

TWEEN.ease.ExponentialEaseIn = function(k) {

    return k !== 0 ? Math.pow(1024, k - 1) : 0;
};

TWEEN.ease.ExponentialEaseOut = function(k) {

    return k !== 1 ? 1 - Math.pow(1024, -k) : 1;

};

TWEEN.ease.ExponentialEaseInOut = function(k) {

    if (k === 0)
	return 0;
    if (k === 1)
	return 1;
    if ((k*= 2) < 1)
	return 0.5 * Math.pow(1024, k - 1);

    return 1 - 512 * Math.pow(1024, -k);
};

//

TWEEN.ease.CircularEaseIn = function(k) {

    return 1 - Math.sqrt(1 - k * k);
};

TWEEN.ease.CircularEaseOut = function(k) {

    return Math.sqrt(1 - --k * k);

};

TWEEN.ease.CircularEaseInOut = function(k) {

    if ((k*= 2) < 1)
	return 0.5 - 0.5 * Math.sqrt(1 - k * k);
    return 0.5 + 0.5 * Math.sqrt(1 - (k-= 2) * k);
};

//

TWEEN.ease.ElasticEaseIn = function(k) {

    if (k === 0)
	return 0;
    if (k === 1)
	return 1;

    return -(Math.pow(1024, --k) * Math.sin((k - 0.1) * 15.7079633));
};

TWEEN.ease.ElasticEaseOut = function(k) {

    if (k === 0)
	return 0;
    if (k === 1)
	return 1;

    return 1 + Math.pow(1024, -k) * Math.sin((k - 0.1) * 15.7079633);

};

TWEEN.ease.ElasticEaseInOut = function(k) {

    if (k === 0)
	return 0;
    if (k === 1)
	return 1;

    if ((k*= 2) < 1)
	return -Math.pow(1024, --k) * 0.5 * Math.sin((k - 0.1) * 15.7079633);

    return 1 + Math.pow(1024, - --k) * 0.5 * Math.sin((k - 0.1) * 15.7079633);
};

//

TWEEN.ease.BackEaseIn = function(k) {

    return k * k * (2.70158 * k - 1.70158);
};

TWEEN.ease.BackEaseOut = function(k) {

    return 1 + --k * k * (2.70158 * k + 1.70158);
};

TWEEN.ease.BackEaseInOut = function(k) {

    var s = 1.70158 * 1.525;
    if ((k*= 2) < 1)
	return 0.5 * (k * k * ((s + 1) * k - s));
    return 0.5 * ((k-= 2) * k * ((s + 1) * k + s) + 2);
};

//

TWEEN.ease.BounceEaseIn = function(k) {

    return 1 - TWEEN.ease.BounceEaseOut(1 - k);
};

TWEEN.ease.BounceEaseOut = function(k) {

    if (k < (4 / 11)) {
	return 7.5625 * k * k;
    } else if (k < (8 / 11)) {
	return 0.75 + 7.5625 * (k-= 6 / 11) * k;
    } else if (k < (10 / 11)) {
	return 0.9375 + 7.5625 * (k-= 9 / 11) * k;
    } else {
	return 0.984375 + 7.5625 * (k-= 21 / 22) * k;
    }

};

TWEEN.ease.BounceEaseInOut = function(k) {

    if (k < 0.5)
	return TWEEN.ease.BounceEaseIn(k * 2) * 0.5;
    return TWEEN.ease.BounceEaseOut(k * 2 - 1) * 0.5 + 0.5;
};