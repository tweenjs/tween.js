import type {Page} from '@playwright/test'
import {expect} from '@playwright/test'

/** Reusable page interactions for the curve-tool editor. */
export const SELECTORS = {
	canvas: '#curve-canvas',
	canvasLock: '#canvas-lock',
	codeIn: '#code-in',
	codeError: '#code-error',
	pathChip: '#path-chip',
	readout: '#readout',
	sourceSelect: '#sel-overlay',
	previewDot: '#preview-dot',
	inspectorRows: '#inspector-body .pt-row',
	presetOvershoot: '#presets button:has-text("Overshoot")',
} as const

/** Open the tool and wait until the graph + code render (boot complete). */
export async function gotoTool(page: Page): Promise<void> {
	await page.goto('/', {waitUntil: 'load'})
	await expect(page.locator(SELECTORS.canvas)).toBeVisible()
	await expect(page.locator(SELECTORS.codeIn)).toHaveValue(/new CurvePath\(\[/)
}

/** The full code-box text. */
export async function getCode(page: Page): Promise<string> {
	return page.locator(SELECTORS.codeIn).inputValue()
}

/** Switch the easing source (Custom or Easing.*) via the header select. */
export async function selectSource(page: Page, name: string): Promise<void> {
	await page.locator(SELECTORS.sourceSelect).selectOption(name)
}

/** Drag the P1 handle (pink circle near 1/4 time) by a pixel offset. */
export async function dragHandleP1(page: Page, dx: number, dy: number): Promise<void> {
	const canvas = page.locator(SELECTORS.canvas)
	await canvas.scrollIntoViewIfNeeded()
	const box = await canvas.boundingBox()
	if (!box) throw new Error('canvas has no bounding box')
	// Default Ease c1 handle at (0.25, 0.1), using the graph mapping in
	// src/app.js (PAD l=44 r=16 t=16 b=28, y in [-1, 2]).
	const w = box.width
	const h = box.height
	const startX = box.x + 44 + 0.25 * (w - 44 - 16)
	const startY = box.y + 16 + (1 - (0.1 + 1) / 3) * (h - 16 - 28)
	await page.mouse.move(startX, startY)
	await page.mouse.down()
	await page.mouse.move(startX + dx, startY + dy, {steps: 8})
	await page.mouse.up()
}

/** Double-click empty graph space (right of the curve) to add a keyframe. */
export async function dblclickEmpty(page: Page): Promise<void> {
	const canvas = page.locator(SELECTORS.canvas)
	await canvas.scrollIntoViewIfNeeded()
	const box = await canvas.boundingBox()
	if (!box) throw new Error('canvas has no bounding box')
	await page.mouse.dblclick(box.x + box.width * 0.65, box.y + box.height * 0.3)
}

/** Count the cubic segments in the code box (one constructor per segment). */
export async function countSegments(page: Page): Promise<number> {
	return (await getCode(page)).split('new CubicBezierCurve(').length - 1
}
