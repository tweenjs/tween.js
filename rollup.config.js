import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	dest: 'dist/TWEEN.js',
	format: 'umd',
	moduleName: 'TWEEN',
	plugins: [
		buble()
	]
};
