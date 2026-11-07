import {test, expect} from '@playwright/test'
import {advanceTo, installClock} from './helpers/raf-hijack.js'
import {SELECTORS, dragFirstClip, getStateLine, gotoGui} from './helpers/gui.js'

test.describe('timeline-gui', () => {
	test('renders tracks, code and inspector from the default model', async ({page}) => {
		const errors: Array<string> = []
		page.on('pageerror', e => errors.push(e.message))
		await gotoGui(page)
		await expect(page.locator(SELECTORS.track)).toHaveCount(6)
		await expect(page.locator(SELECTORS.codeIn)).toHaveValue(/const tl = new Timeline\(\);/)
		await expect(page.locator(SELECTORS.stateReadout)).toHaveText(/x=0 y=0 rot=0/)
		expect(errors).toEqual([])
	})

	test('structural edits after playback keep generated state initial', async ({page}) => {
		await installClock(page)
		await gotoGui(page)

		// Play past the end so the live object holds end values (and the
		// timeline loops). Then trigger a rebuild via "+ tween".
		await page.click(SELECTORS.playButton)
		await advanceTo(page, 4200)
		await page.click(SELECTORS.addButton)

		// The regenerated code must carry start values, not the
		// mid-flight object: otherwise reloading would freeze every
		// tween whose start was captured at an end value.
		expect(await getStateLine(page)).toBe('const state = {"x":0,"y":0,"rotation":0,"scale":1,"opacity":1};')
	})

	test('replay after reload animates every tween', async ({page}) => {
		await installClock(page)
		await gotoGui(page)
		await page.click(SELECTORS.playButton)
		// 2600ms: move-x and drop done, spin mid-flight, fade pending.
		await advanceTo(page, 2600)
		const readout = await page.locator(SELECTORS.stateReadout).textContent()
		expect(readout).toContain('x=260')
		expect(readout).toContain('y=120')
		expect(readout).toContain('rot=26')
		expect(readout).toContain('scale=1.60')
		expect(readout).toContain('opacity=1.00')
	})

	test('drag moves clips, edge resizes, click collapses nested rows', async ({page}) => {
		await gotoGui(page)

		await dragFirstClip(page, 100)
		// NOTE: toContainText reads innerText (the default value), which
		// stays empty for programmatic edits — assert on value instead.
		await expect(page.locator(SELECTORS.codeIn)).toHaveValue(/tl\.add\(tween0, 1000\);/)

		// Nested group header collapses/expands its children on click.
		const nested = page.locator(SELECTORS.nestedTrack).first()
		await nested.scrollIntoViewIfNeeded()
		const rows = page.locator(SELECTORS.trackRow)
		await expect(rows).toHaveCount(6)
		const nbox = await nested.boundingBox()
		if (!nbox) throw new Error('nested clip has no bounding box')
		await page.mouse.move(nbox.x + 40, nbox.y + nbox.height / 2)
		await page.mouse.down()
		await page.mouse.up()
		await expect(rows).toHaveCount(4)
		await page.mouse.down()
		await page.mouse.up()
		await expect(rows).toHaveCount(6)
	})

	test('stale v2 stored code is ignored', async ({page}) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				'tweenjs-timeline-gui-v2',
				'const state = {"x":0};\nconst tl = new Timeline();\ntl.add(new Tween(state).to({"x":260}, 800).easing(Easing.Linear.None));',
			)
		})
		await gotoGui(page)
		await expect(page.locator(SELECTORS.readout)).toContainText('/ 4000ms')
	})

	test('visual: default tracks view', async ({page}) => {
		await gotoGui(page)
		// Highlighting resolves async; wait for it so pixels are stable.
		await page.locator('#code-hl-code .shj-syn-kwd').first().waitFor()
		await expect(page).toHaveScreenshot('timeline-gui_default.webp', {
			fullPage: true,
			maxDiffPixelRatio: 0.01,
		})
	})

	test('visual: mid-play state', async ({page}) => {
		await installClock(page)
		await gotoGui(page)
		await page.locator('#code-hl-code .shj-syn-kwd').first().waitFor()
		await page.click(SELECTORS.playButton)
		// Deterministic clock: move-x and drop done, spin mid-flight.
		await advanceTo(page, 2600)
		await expect(page).toHaveScreenshot('timeline-gui_playing.webp', {
			fullPage: true,
			maxDiffPixelRatio: 0.01,
		})
	})
})
