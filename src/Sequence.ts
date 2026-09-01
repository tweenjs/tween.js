/**
 * Utils
 */

const Sequence = {
	_nextId: 0,
	nextId() {
		return Sequence._nextId++
	},
}

export default Sequence
