import dts from 'rollup-plugin-dts'

export default [
	{
		input: '.tmp/Index.js',
		// https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
		context: 'this',
		watch: {clearScreen: false},
		output: [
			{
				file: 'dist/tween.umd.js',
				name: 'TWEEN',
				format: 'umd',
				exports: 'named',
			},
			{
				file: 'dist/tween.amd.js',
				format: 'amd',
				exports: 'named',
			},
			{
				file: 'dist/tween.cjs.js',
				format: 'cjs',
				exports: 'named',
			},
			{
				file: 'dist/tween.esm.js',
				format: 'es',
				exports: 'named',
			},
		],
	},
	{
		input: '.tmp/tests.js',
		context: 'this',
		watch: {clearScreen: false},
		output: [
			{file: '.tmp/tests.cjs', format: 'cjs', exports: 'named'}, // For tests running in Node.js
			{file: '.tmp/tests.umd.js', format: 'umd', exports: 'named', name: 'TWEEN'}, // For the nodeunit.html tests in browser
		],
	},
	{
		input: './.tmp/Index.d.ts',
		watch: {clearScreen: false},
		output: [{file: 'dist/tween.d.ts', format: 'es'}],
		plugins: [dts()],
	},
]
