/**
 * Utils
 */

export default {
	_nextId: 0,
	nextId() {
		return this._nextId++
	},
}
