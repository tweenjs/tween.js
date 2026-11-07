import type {Page} from '@playwright/test'
import {expect} from '@playwright/test'

/** Reusable page interactions for the timeline-gui editor. */
export const SELECTORS = {
	track: '#tracks .clip',
	nestedTrack: '#tracks .clip.nested',
	trackRow: '#tracks .track-row',
	codeIn: '#code-in',
	readout: '#readout',
	stateReadout: '#state-readout',
	playButton: '#btn-play',
	addButton: '#btn-add',
} as const

/** Open the GUI and wait until tracks render (boot complete). */
export async function gotoGui(page: Page): Promise<void> {
	await page.goto('/', {waitUntil: 'load'})
	await expect(page.locator(SELECTORS.track).first()).toBeVisible()
}

/** The generated `const state = {...}` line from the code box. */
export async function getStateLine(page: Page): Promise<string | undefined> {
	return page.evaluate(() =>
		(document.querySelector('#code-in') as HTMLTextAreaElement).value
			.split('\n')
			.find(l => l.startsWith('const state = ')),
	)
}

/** Drag the first track clip right by dx pixels (ends on pointerup). */
export async function dragFirstClip(page: Page, dx: number): Promise<void> {
	const clip = page.locator(SELECTORS.track).first()
	await clip.scrollIntoViewIfNeeded()
	const box = await clip.boundingBox()
	if (!box) throw new Error('clip has no bounding box')
	await page.mouse.move(box.x + 10, box.y + box.height / 2)
	await page.mouse.down()
	await page.mouse.move(box.x + 10 + dx, box.y + box.height / 2, {steps: 5})
	await page.mouse.up()
}
