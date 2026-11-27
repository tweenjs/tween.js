/**
 * @fileoverview Tool for patching performance.now so we can fake it in the
 * tests.
 */

let time = 0

export function tickTime(t: number): void {
	time = t
}

export function patchPerformanceNow(): void {
	Object.defineProperties(performance, {
		now: {
			value: () => {
				return time
			},
			configurable: true,
		},
	})
}

export function restorePerformanceNow(): void {
	// The original is on the prototype, simply delete ours to expose that one again.
	delete (performance as any).now
}
