import {rm} from 'node:fs/promises'

// The published bundles target the last few browser releases and Node.js 22+,
// so nothing needs downlevelling and Bun can bundle the TypeScript sources
// directly. `bun run build:types` writes the declarations into dist/types
// afterwards.
const bundles = [
	{
		entry: 'src/Index.ts',
		outfile: 'dist/tween.esm.js',
		minfile: false,
		format: 'esm',
		target: 'node',
	},
	{
		entry: 'src/Index.ts',
		outfile: 'dist/tween.cjs',
		minfile: false,
		format: 'cjs',
		target: 'node',
	},
	{
		entry: 'src/global.ts',
		outfile: 'dist/tween.browser.js',
		minfile: `dist/tween.browser.min.js`,
		format: 'iife',
		target: 'browser',
	},
] as const

await rm('dist', {recursive: true, force: true})

for (const {entry, outfile, minfile, format, target} of bundles) {
	const banner = ['esm', 'cjs'].includes(format) ? undefined : `'use strict';`
	const result = await Bun.build({
		entrypoints: [entry],
		format,
		target,
		banner,
	})
	const result_min =
		minfile &&
		(await Bun.build({
			entrypoints: [entry],
			format,
			target,
			banner,
			minify: true,
		}))

	if (!result.success) {
		console.error(`Failed to bundle ${outfile}:`)
		for (const message of result.logs) console.error(message)
		process.exit(1)
	}
	if (minfile && !result_min.success) {
		console.error(`Failed to minify ${minfile}:`)
		for (const message of result_min.logs) console.error(message)
		process.exit(1)
	}

	await Bun.write(outfile, result.outputs[0])
	if (minfile) {
		await Bun.write(minfile, result_min.outputs[0])
	}
}

const tsc = Bun.spawn(['bunx', 'tsc', '--project', 'tsconfig.build.json'], {
	stdout: 'inherit',
	stderr: 'inherit',
})
const tscExitCode = await tsc.exited

if (tscExitCode !== 0) process.exit(tscExitCode)

// tsc emits one declaration per module, so dist/tween.d.ts re-exports the entry
// point to keep the published `types` path unchanged.
await Bun.write(
	'dist/tween.d.ts',
	[`export * from './types/Index'`, `export {default} from './types/Index'`, ''].join('\n'),
)
