import { now } from './polyfills';

var _tweens = [];

const TWEEN = {
	now,

	getAll() {

		return _tweens;

	},

	removeAll() {

		_tweens = [];

	},

	add(tween) {

		_tweens.push(tween);

	},

	remove(tween) {

		const i = _tweens.indexOf(tween);

		if (i !== -1) {
			_tweens.splice(i, 1);
		}

	},

	update(time, preserve) {

		if (_tweens.length === 0) {
			return false;
		}

		let i = 0;

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

export default TWEEN;
