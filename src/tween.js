var TWEEN_MANAGER = TWEEN_MANAGER || {}

TWEEN_MANAGER = {
	_tweens : [],

	addTween : function(tween) {
		if(this._tweens.indexOf(tween) == -1) {
			this._tweens.push(tween);
		}
	},

	update : function() {
		var numTweens = this._tweens.length;
		for(var i = 0; i < numTweens; i++) {
			this._tweens[i].update();
		}
	}
}

var TWEEN = TWEEN || {}

TWEEN.Easing = {Back: {}, Elastic: {}, Expo: {}};

TWEEN.Easing.Back.EaseIn = function(t, b, c, d) {
	var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}

TWEEN.Easing.Back.EaseOut = function(t, b, c, d) {
	var s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

TWEEN.Easing.Back.EaseInOut = function(t, b, c, d) {
	var s = 1.70158;
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}

TWEEN.Easing.Elastic.EaseIn = function(t, b, c, d) {
	if (t==0) return b;  if ((t/=d)==1) return b+c;
	var p=d*.3;
	var a=c;
	var s=p/4;
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}

TWEEN.Easing.Elastic.EaseOut = function(t, b, c, d) {
	if (t==0) return b;  if ((t/=d)==1) return b+c;
	var p=d*.3;
	var a=c;
	var s=p/4;
	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
}

TWEEN.Easing.Elastic.EaseInOut = function(t, b, c, d) {
	if(t==0) return b;
	if((t/=d/2)==2) return b+c;
	var p=d*(.3*1.5);
	var a=c;
	var s=p/4;
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}

TWEEN.Easing.Expo.EaseIn = function(t, b, c, d) {
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
}

TWEEN.Easing.Expo.EaseOut = function(t, b, c, d) {
	return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
}

TWEEN.Easing.Expo.EaseInOut = function(t, b, c, d) {
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
}




TWEEN.Property = function(name, valueStart, valueChange) {
	this.name = name;
	this.valueStart = valueStart;
	this.valueChange = valueChange;
}

TWEEN.Tween = function(object) {
	this._dstObject = object;
	this._length = 1000;
	this._delayTime = 0;
	this._startTime = 0;
	this._objectProperties = {};
	this._easingFunction = TWEEN.Easing.Elastic.EaseInOut;
	this._nextTween = null;
	this._complete = false;
	this._onUpdateFunction = null;

	this.property = function(propertyName, a, b) {
		var valueStart, valueEnd, currValue;
		if(arguments.length == 3) {
			valueStart = a;
			valueEnd = b;
			this._objectProperties[propertyName] = new TWEEN.Property(propertyName, valueStart, valueEnd - valueStart);
		} else if(arguments.length == 2) {
			currValue = this._dstObject[propertyName];
			valueEnd = a;

			this._objectProperties[propertyName] = new TWEEN.Property(propertyName, currValue, valueEnd - currValue);
		}
		
		return this;
	}

	this.length = function(amount) {
		this._length = amount * 1000;
		return this;
	}

	this.delay = function(amount) {
		this._delayTime = amount * 1000;
		return this;
	}

	this.easing = function(easing) {
		this._easingFunction = easing;
		return this;
	}

	this.chain = function(tween) {
		this._nextTween = tween;
		return this;
	}

	this.onUpdate = function(onUpdateFunction) {
		this._onUpdateFunction = onUpdateFunction;
		return this;
	}

	this.start = function()	{
		this._complete = false;
		this._startTime = new Date().getTime() + this._delayTime;
		return this;
	}

	this.getTarget = function() {
		return this._dstObject;
	}

	this.update = function() {
		if(this._complete) {
			return;
		}
		var length = this._length;
		var elapsed = new Date().getTime() - this._startTime;
		var properties = this._objectProperties;
		var p;
		var obj = this._dstObject;
		var easingFunction = this._easingFunction;


		if(elapsed > length) {
			if(this._nextTween !== null) {
				this._complete = true;
				this._nextTween.start();
			} else {
				this._complete = true;
			}
		}
		
		for(var k in properties) {
			p = properties[k];
			obj[p.name] = easingFunction(elapsed, p.valueStart, p.valueChange, length);
		}

		if(this._onUpdateFunction !== null) {
			this._onUpdateFunction();
		}
	}
}

