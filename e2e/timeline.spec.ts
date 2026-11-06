import {test, expect} from '@playwright/test'

// ---------------------------------------------------------------------------
// Deterministic rAF hijack — injected before any page script so the tween
// library's performance.now() and rAF both read our controlled clock.
// ---------------------------------------------------------------------------
const RAF_HIJACK = `
let __syntheticNow = 0
const _origNow = performance.now.bind(performance)
Object.defineProperty(performance, 'now', {
  value: () => __syntheticNow,
  writable: true,
  configurable: true,
})

const _origRaf = window.requestAnimationFrame.bind(window)
window.__rafCallbacks = []
window.requestAnimationFrame = function (cb) {
  window.__rafCallbacks.push(cb)
  return window.__rafCallbacks.length
}

/** Tick one frame at the given dt, firing queued rAF callbacks. */
window.__tickFrame = function (dt = 16.667) {
  __syntheticNow += dt
  const cbs = [...window.__rafCallbacks]
  window.__rafCallbacks = []
  for (const cb of cbs) cb(__syntheticNow)
}

/** Tick frames until __syntheticNow >= targetTime (ms). */
window.__advanceTo = function (targetTime) {
  const step = 16.667
  while (__syntheticNow < targetTime) {
    window.__tickFrame(step)
  }
}
`

function pad4(n: number) {
	return String(n).padStart(4, '0')
}

function pad2(n: number) {
	return String(n).padStart(2, '0')
}

// ---------------------------------------------------------------------------
// Example 20 – timeline
//   Three boxes animated with Timeline:
//   1. sequential (y 0→200→0, 800 ms each)
//   2. parallel  (y 0→200 + rotation 0→360, 1000 ms)
//   3. labels + nesting (y 0→200, then rotation delayed at label, then back)
// ---------------------------------------------------------------------------
test.describe('20_timeline', () => {
	test.beforeEach(async ({page}) => {
		await page.addInitScript(RAF_HIJACK)
	})

	test('captures the sequential, parallel, and label-based animation', async ({page}) => {
		await page.goto('/examples/20_timeline.html', {waitUntil: 'load'})

		for (let ms = 0; ms <= 3000; ms += 200) {
			await page.evaluate(v => (window as any).__advanceTo(v), ms)
			await expect(page).toHaveScreenshot(`20_timeline_${pad4(ms)}ms.webp`, {
				fullPage: true,
				maxDiffPixelRatio: 0.01,
			})
		}
	})
})

// ---------------------------------------------------------------------------
// Example 21 – timeline slider
//   One box + page background scrubbed through 8 tweens via a range slider.
//   No rAF loop — purely slider-driven, so no hijack needed.
// ---------------------------------------------------------------------------
test.describe('21_timeline_slider', () => {
	test('captures the slider-driven animation forward and backward with mid-step samples', async ({page}) => {
		await page.goto('/examples/21_timeline_slider.html', {waitUntil: 'load'})

		async function setSlider(ms: number) {
			await page.evaluate(v => {
				const slider = document.getElementById('slider') as HTMLInputElement
				slider.value = String(v)
				slider.dispatchEvent(new Event('input', {bubbles: true}))
			}, ms)
		}

		// Forward: 0 → 6400 in 400 ms steps (step boundary every 800, mid-step every 400).
		for (let ms = 0; ms <= 6400; ms += 400) {
			await setSlider(ms)
			await expect(page).toHaveScreenshot(`21_slider_fwd_${pad4(ms)}ms.webp`, {
				fullPage: true,
				maxDiffPixelRatio: 0.01,
			})
		}

		// Backward: 6400 → 0 in 400 ms steps. Numbered so alphabetical
		// order shows frames from end (6400) to start (0000).
		let revIdx = 0
		for (let ms = 6400; ms >= 0; ms -= 400) {
			const name = `21_slider_rev_${pad2(revIdx)}_${pad4(ms)}ms.webp`
			await setSlider(ms)
			await expect(page).toHaveScreenshot(name, {fullPage: true, maxDiffPixelRatio: 0.01})
			revIdx++
		}
	})
})

// ---------------------------------------------------------------------------
// Example 22 – timeline repeat
//   Three boxes:
//   1. repeat × 3 (0→200, 600 ms each, total 1800 ms)
//   2. yoyo         (0→200→0, 600+600 = 1200 ms)
//   3. yoyo + repeat × 2 (0→200→0→200→0, 4 × 600 = 2400 ms)
//   All auto-restart when finished.
// ---------------------------------------------------------------------------
test.describe('22_timeline_repeat', () => {
	test.beforeEach(async ({page}) => {
		await page.addInitScript(RAF_HIJACK)
	})

	test('captures repeat, yoyo, and yoyo-repeat animation', async ({page}) => {
		await page.goto('/examples/22_timeline_repeat.html', {waitUntil: 'load'})

		for (let ms = 0; ms <= 3000; ms += 200) {
			await page.evaluate(v => (window as any).__advanceTo(v), ms)
			await expect(page).toHaveScreenshot(`22_repeat_${pad4(ms)}ms.webp`, {
				fullPage: true,
				maxDiffPixelRatio: 0.01,
			})
		}
	})
})
