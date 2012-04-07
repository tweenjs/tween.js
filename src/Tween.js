/**
 * @author sole / http://soledadpenades.com
 * @author mr.doob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 */

var TWEEN = TWEEN || ( function () {

	var _interval = null, _fps = 60, _autostart = false, _tweens = [];

	return {

		setFPS: function ( fps ) {

			_fps = fps || 60;

		},

		start: function ( fps ) {

			if ( fps ) {

				this.setFPS( fps );

			}

			if ( _interval === null ) {

				_interval = setInterval( this.update, 1000 / _fps );

			}

		},

		stop: function () {

			clearInterval( _interval );

			_interval = null;

		},

		setAutostart: function ( value ) {

			_autostart = value;

			if ( _autostart && _tweens.length ) {

				this.start();

			}

		},

		add: function ( tween ) {

			_tweens.push( tween );

			if ( _autostart ) {

				this.start();

			}

		},

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			var i = 0, num_tweens = _tweens.length, time = time || Date.now();

			while ( i < num_tweens ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );
					num_tweens--;

				}

			}

			if ( num_tweens === 0 && _autostart ) {

				TWEEN.stop();

			}

		}

	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object,
	_valuesStart = {},
	_valuesDelta = {},
	_valuesEnd = {},
	_duration = 1000,
	_delayTime = 0,
	_startTime = null,
	_easingFunction = TWEEN.Easing.Linear.EaseNone,
	_interpolationFunction = TWEEN.Interpolation.Linear,
	_chainedTween = null,
	_onUpdateCallback = null,
	_onCompleteCallback = null;

	this.to = function ( properties, duration ) {

		if ( duration !== null ) {

			_duration = duration;

		}

		for ( var property in properties ) {

			// This prevents the engine from interpolating null values
			if ( _object[ property ] === null ) {

				continue;

			}

			// The current values are read when the tween starts;
			// here we only store the final desired values
			_valuesEnd[ property ] = properties[ property ];

		}

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_startTime = time ? time + _delayTime : Date.now() + _delayTime;

		for ( var property in _valuesEnd ) {

			// Again, prevent dealing with null values
			if ( _object[ property ] === null ) {

				continue;

			}

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length > 0 ) {

					_valuesStart[ property ] = _object[ property ];

					// create a local copy of the Array with the start value at the front
					_valuesDelta[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

				}

			} else {

				_valuesStart[ property ] = _object[ property ];
				_valuesDelta[ property ] = _valuesEnd[ property ] - _object[ property ];

			}

		}

		return this;

	};

	this.stop = function () {

		TWEEN.remove( this );
		return this;

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function ( chainedTween ) {

		_chainedTween = chainedTween;
		return this;

	};

	this.onUpdate = function ( onUpdateCallback ) {

		_onUpdateCallback = onUpdateCallback;
		return this;

	};

	this.onComplete = function ( onCompleteCallback ) {

		_onCompleteCallback = onCompleteCallback;
		return this;

	};

	this.update = function ( time ) {

		var property, elapsed, value;

		if ( time < _startTime ) {

			return true;

		}

		elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction( elapsed );

		for ( property in _valuesDelta ) {

			if ( _valuesDelta[ property ] instanceof Array ) {

				_object[ property ] = _interpolationFunction( _valuesDelta[ property ], value );

			} else {

				_object[ property ] = _valuesStart[ property ] + _valuesDelta[ property ] * value;

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _onCompleteCallback !== null ) {

				_onCompleteCallback.call( _object );

			}

			if ( _chainedTween !== null ) {

				_chainedTween.start();

			}

			return false;

		}

		return true;

	};

	/*
	this.destroy = function () {

		TWEEN.remove( this );

	};
	*/
};

TWEEN.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };


TWEEN.Easing.Linear.EaseNone = function ( k ) {

	return k;

};

//

TWEEN.Easing.Quadratic.EaseIn = function ( k ) {

	return k * k;

};

TWEEN.Easing.Quadratic.EaseOut = function ( k ) {

	return k * ( 2 - k );

};

TWEEN.Easing.Quadratic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
	return - 0.5 * ( --k * ( k - 2 ) - 1 );

};

//

TWEEN.Easing.Cubic.EaseIn = function ( k ) {

	return k * k * k;

};

TWEEN.Easing.Cubic.EaseOut = function ( k ) {

	return --k * k * k + 1;

};

TWEEN.Easing.Cubic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k + 2 );

};

//

TWEEN.Easing.Quartic.EaseIn = function ( k ) {

	return k * k * k * k;

};

TWEEN.Easing.Quartic.EaseOut = function ( k ) {

	return 1 - --k * k * k * k;

};

TWEEN.Easing.Quartic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
	return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

};

//

TWEEN.Easing.Quintic.EaseIn = function ( k ) {

	return k * k * k * k * k;

};

TWEEN.Easing.Quintic.EaseOut = function ( k ) {

	return --k * k * k * k * k + 1;

};

TWEEN.Easing.Quintic.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

};

//

TWEEN.Easing.Sinusoidal.EaseIn = function ( k ) {

	return 1 - Math.cos( k * Math.PI / 2 );

};

TWEEN.Easing.Sinusoidal.EaseOut = function ( k ) {

	return Math.sin( k * Math.PI / 2 );

};

TWEEN.Easing.Sinusoidal.EaseInOut = function ( k ) {

	return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

};

//

TWEEN.Easing.Exponential.EaseIn = function ( k ) {

	return k === 0 ? 0 : Math.pow( 1024, k - 1 );

};

TWEEN.Easing.Exponential.EaseOut = function ( k ) {

	return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

};

TWEEN.Easing.Exponential.EaseInOut = function ( k ) {

	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
	return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

};

//

TWEEN.Easing.Circular.EaseIn = function ( k ) {

	return 1 - Math.sqrt( 1 - k * k );

};

TWEEN.Easing.Circular.EaseOut = function ( k ) {

	return Math.sqrt( 1 - --k * k );

};

TWEEN.Easing.Circular.EaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

};

//

TWEEN.Easing.Elastic.EaseIn = function ( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
	return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

};

TWEEN.Easing.Elastic.EaseOut = function ( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
	return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

};

TWEEN.Easing.Elastic.EaseInOut = function ( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0;
	if ( k === 1 ) return 1;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
	if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
	return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

};

//

TWEEN.Easing.Back.EaseIn = function ( k ) {

	var s = 1.70158;
	return k * k * ( ( s + 1 ) * k - s );

};

TWEEN.Easing.Back.EaseOut = function ( k ) {

	var s = 1.70158;
	return --k * k * ( ( s + 1 ) * k + s ) + 1;

};

TWEEN.Easing.Back.EaseInOut = function ( k ) {

	var s = 1.70158 * 1.525;
	if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
	return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

};

//

TWEEN.Easing.Bounce.EaseIn = function ( k ) {

	return 1 - TWEEN.Easing.Bounce.EaseOut( 1 - k );

};

TWEEN.Easing.Bounce.EaseOut = function ( k ) {

	if ( k < ( 1 / 2.75 ) ) {

		return 7.5625 * k * k;

	} else if ( k < ( 2 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

	} else if ( k < ( 2.5 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

	} else {

		return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

	}

};

TWEEN.Easing.Bounce.EaseInOut = function ( k ) {

	if ( k < 0.5 ) return TWEEN.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
	return TWEEN.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;

};


TWEEN.Interpolation = { Utils: {

	Linear: function ( p0, p1, t ) {

		return ( p1 - p0 ) * t + p0;

	},

	Bernstein: function ( n , i ) {

		var fc = TWEEN.Interpolation.Utils.Factorial;
		return fc( n ) / fc( i ) / fc( n - i );

	},

	Factorial: ( function () {

		var a = [ 1 ];

		return function ( n ) {

			var s = 1, i;
			if ( a[ n ] ) return a[ n ];
			for ( i = n; i > 1; i-- ) s *= i;
			return a[ n ] = s;

		}

	} )(),

	CatmullRom: function ( p0, p1, p2, p3, t ) {

		var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

}};

TWEEN.Interpolation.Linear = function( v, k ) {

	var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

	if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
	if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

	return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

};

TWEEN.Interpolation.Bezier = function( v, k ) {

	var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

	for ( i = 0; i <= n; i++ ) {
		b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
	}

	return b;

};

TWEEN.Interpolation.Spline = function( v, k ) {

	var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

	if ( v[ 0 ] === v[ m ] ) {

		if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

		return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

	} else {

		if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
		if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

		return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

	}

};
