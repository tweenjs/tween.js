import {test, expect} from '@playwright/test'

test('03_graphs.html — easing curve thumbnails', async ({page}) => {
	await page.goto('/examples/03_graphs.html', {waitUntil: 'load'})

	// Wait for the 2000ms tween animations to finish drawing all curves.
	await page.waitForTimeout(2500)

	// The grid of canvas thumbnails should now show complete easing curves.
	await expect(page).toHaveScreenshot('03_graphs.webp', {
		fullPage: true,
		maxDiffPixelRatio: 0.01,
	})
})
