import {defineConfig} from '@playwright/test'

export default defineConfig({
	testDir: '.',
	snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
	webServer: {
		command: 'python3 -m http.server 3333',
		cwd: process.cwd(),
		port: 3333,
		reuseExistingServer: true,
	},
	use: {
		baseURL: 'http://localhost:3333',
		viewport: {width: 1280, height: 1030},
	},
})
