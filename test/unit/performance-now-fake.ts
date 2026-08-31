/**
 * @fileoverview Tool for patching performance.now so we can fake it in the
 * tests.
 */

let time = 0
let patched = false
let originalNow: PropertyDescriptor | undefined

export function tickTime(t: number): void {
	time = t
}

export function patchPerformanceNow(): void {
	if (!patched) {
		originalNow = Object.getOwnPropertyDescriptor(performance, 'now')
		patched = true
	}

	Object.defineProperty(performance, 'now', {
		value: () => {
			return time
		},
		configurable: true,
	})
}

export function restorePerformanceNow(): void {
	if (!patched) return
	patched = false

	if (originalNow) {
		// Bun defines performance.now as an own property, so put the original back.
		Object.defineProperty(performance, 'now', originalNow)
		originalNow = undefined
	} else {
		// The original is on the prototype, simply delete ours to expose that one again.
		delete (performance as {now?: unknown}).now
	}
}
