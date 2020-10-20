import dts from 'rollup-plugin-dts'

export default [
	{
		input: '.tmp/Index.js',
		// https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
		context: 'this',
		output: [
			{
				file: 'dist/tween.umd.js',
				name: 'TWEEN',
				format: 'umd',
			},
			{
				file: 'dist/tween.amd.js',
				format: 'amd',
			},
			{
				file: 'dist/tween.cjs.js',
				format: 'cjs',
			},
			{
				file: 'dist/tween.esm.js',
				format: 'es',
			},
		],
	},
	{
		input: './.tmp/Index.d.ts',
		output: [{file: 'dist/tween.d.ts', format: 'es'}],
		plugins: [dts()],
	},
]
