import path from 'node:path'
import {defineConfig} from '@playwright/test'

export default defineConfig({
	testDir: '.',
	snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
	webServer: {
		// Serve the curve-tool-gui folder itself: the vendored lib import
		// means the GUI must work from any static root, and the tests
		// prove it from here rather than from the repo root.
		command: 'python3 -m http.server 3335',
		cwd: path.join(import.meta.dirname, '..', '..'),
		port: 3335,
		reuseExistingServer: true,
	},
	use: {
		baseURL: 'http://localhost:3335',
		viewport: {width: 1280, height: 1000},
	},
})
