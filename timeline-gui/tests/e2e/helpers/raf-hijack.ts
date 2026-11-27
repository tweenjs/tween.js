import type {Page} from '@playwright/test'

/**
 * Deterministic rAF hijack — injected before any page script so the GUI's
 * requestAnimationFrame loop and performance.now() both read our
 * controlled clock. Same technique as the repo's e2e/timeline.spec.ts.
 */
export const RAF_HIJACK = `
let __syntheticNow = 0
Object.defineProperty(performance, 'now', {
	value: () => __syntheticNow,
	writable: true,
	configurable: true,
})

window.__rafCallbacks = []
window.requestAnimationFrame = function (cb) {
	window.__rafCallbacks.push(cb)
	return window.__rafCallbacks.length
}

/** Tick frames until __syntheticNow >= targetTime (ms). */
window.__advanceTo = function (targetTime) {
	const step = 16.667
	while (__syntheticNow < targetTime) {
		__syntheticNow += step
		const cbs = [...window.__rafCallbacks]
		window.__rafCallbacks = []
		for (const cb of cbs) cb(__syntheticNow)
	}
}
`

/** Install the synthetic clock. Must run before page scripts (goto). */
export async function installClock(page: Page): Promise<void> {
	await page.addInitScript(RAF_HIJACK)
}

/** Advance the synthetic clock to an absolute time (ms). */
export async function advanceTo(page: Page, targetTime: number): Promise<void> {
	await page.evaluate((t: number) => (window as any).__advanceTo(t), targetTime)
}
