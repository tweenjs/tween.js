import {test, expect} from '@playwright/test'
import {
	SELECTORS,
	countSegments,
	dblclickEmpty,
	dragHandleP1,
	getCode,
	gotoTool,
	selectSource,
} from './helpers/curve.js'

test.describe('curve-tool-gui', () => {
	test('renders the graph, Curve code and a moving preview', async ({page}) => {
		const errors: Array<string> = []
		page.on('pageerror', e => errors.push(e.message))
		await gotoTool(page)

		await expect(page.locator(SELECTORS.pathChip)).toHaveText('Custom · 2 pts · 1 seg')
		const code = await getCode(page)
		expect(code).toContain('new CurvePath([')
		expect(code).not.toContain('M0,100')
		await expect(page.locator(SELECTORS.readout)).toHaveText(/t=\d\.\d\d · y=/)
		// The preview auto-plays on boot: the dot label ticks past 0%.
		await expect(page.locator(SELECTORS.previewDot)).not.toHaveText('0%', {timeout: 5000})
		expect(errors).toEqual([])
	})

	test('preset click rewrites the Curve code', async ({page}) => {
		await gotoTool(page)
		await page.click(SELECTORS.presetOvershoot)
		await expect(page.locator(SELECTORS.pathChip)).toHaveText('Custom · 3 pts · 2 seg')
		expect(await getCode(page)).toContain('1.12')
	})

	test('dragging a handle reshapes the curve and code', async ({page}) => {
		await gotoTool(page)
		const before = await getCode(page)
		await dragHandleP1(page, 60, -40)
		expect(await getCode(page)).not.toBe(before)
		await expect(page.locator(SELECTORS.codeError)).toBeHidden()
	})

	test('double-clicking empty space adds a keyframe', async ({page}) => {
		await gotoTool(page)
		await expect(page.locator(SELECTORS.inspectorRows)).toHaveCount(2)
		await dblclickEmpty(page)
		await expect(page.locator(SELECTORS.inspectorRows)).toHaveCount(3)
		expect(await countSegments(page)).toBe(2)
	})

	test('built-in source locks the graph; Custom unlocks it', async ({page}) => {
		await gotoTool(page)
		const customCode = await getCode(page)

		await selectSource(page, 'Back.Out')
		await expect(page.locator(SELECTORS.canvasLock)).toBeVisible()
		await expect(page.locator(SELECTORS.canvas)).toHaveClass(/locked/)
		await expect(page.locator(SELECTORS.pathChip)).toHaveText('Easing.Back.Out')
		await expect(page.locator(SELECTORS.codeIn)).toHaveValue(/\.easing\(Easing\.Back\.Out\)/)

		// Dragging while locked must not reshape anything.
		await dragHandleP1(page, 60, -40)
		expect(await getCode(page)).toContain('.easing(Easing.Back.Out)')

		await selectSource(page, 'Custom')
		await expect(page.locator(SELECTORS.canvasLock)).toBeHidden()
		expect(await getCode(page)).toBe(customCode)
	})

	test('pasting an SVG path imports it as Curve values', async ({page}) => {
		await gotoTool(page)
		await page.locator(SELECTORS.codeIn).fill('M0,100 C42,100 58,0 100,0')
		await page.click('#btn-apply-code')
		await expect(page.locator(SELECTORS.pathChip)).toHaveText('Custom · 2 pts · 1 seg')
		expect(await getCode(page)).toContain('{x: 0.42, y: 0}')
		expect(await getCode(page)).not.toContain('M0,100')
		await expect(page.locator(SELECTORS.codeError)).toBeHidden()
	})

	test('pasting a built-in switches the source and locks', async ({page}) => {
		await gotoTool(page)
		await page.locator(SELECTORS.codeIn).fill('Easing.Elastic.Out')
		await page.click('#btn-apply-code')
		await expect(page.locator(SELECTORS.canvasLock)).toBeVisible()
		await expect(page.locator(SELECTORS.pathChip)).toHaveText('Easing.Elastic.Out')
	})

	test('invalid code shows an error instead of running', async ({page}) => {
		await gotoTool(page)
		await page.locator(SELECTORS.codeIn).fill('ease-in-out')
		await page.click('#btn-apply-code')
		await expect(page.locator(SELECTORS.codeError)).toBeVisible()
		await expect(page.locator(SELECTORS.codeError)).toContainText('nothing to apply')
	})
})
