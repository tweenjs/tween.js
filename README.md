# tween.js

JavaScript (TypeScript) tweening engine for easy animations, incorporating optimised Robert Penner's equations.

[![NPM Version][npm-image]][npm-url]
[![CDNJS][cdnjs-image]][cdnjs-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build and Tests][ci-image]][ci-url]

More languages: [English](./README.md), [简体中文](./README_zh-CN.md)

---

```html
<div id="box"></div>

<style>
	#box {
		background-color: deeppink;
		width: 100px;
		height: 100px;
	}
</style>

<script type="module">
	import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'

	const box = document.getElementById('box') // Get the element we want to animate.

	const coords = {x: 0, y: 0} // Start at (0, 0)

	const tween = new Tween(coords, false) // Create a new tween that modifies 'coords'.
		.to({x: 300, y: 200}, 1000) // Move to (300, 200) in 1 second.
		.easing(Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
		.onUpdate(() => {
			// Called after tween.js updates 'coords'.
			// Move 'box' to the position described by 'coords' with a CSS translation.
			box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)')
		})
		.start() // Start the tween immediately.

	// Setup the animation loop.
	function animate(time) {
		tween.update(time)
		requestAnimationFrame(animate)
	}
	requestAnimationFrame(animate)
</script>
```

[Try this example on CodePen](https://codepen.io/trusktr/pen/KKGaBVz?editors=1000)

# Features

- Does one thing only and does it well: tweens properties of an object
- Doesn't take care of CSS units (e.g. appending `px`)
- Doesn't interpolate colors
- Easing functions are reusable outside of Tween
- Can also use custom easing functions
- Doesn't make its own animation loop, making it flexible for integration into
  any animation loop.

# Examples

<table>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/00_hello_world.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/00_hello_world.png" alt="hello world" />
			</a>
		</td>
		<td>
			hello world<br />
			(<a href="examples/00_hello_world.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/01_bars.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/01_bars.png" alt="Bars" />
			</a>
		</td>
		<td>
			Bars<br />
			(<a href="examples/01_bars.html">source</a>)
		</td>
	<tr>
	</tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/02_black_and_red.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/02_black_and_red.png" alt="Black and red" />
			</a>
		</td>
		<td>
			Black and red<br />
			(<a href="examples/02_black_and_red.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/03_graphs.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Graphs" />
			</a>
		</td>
		<td>
			Graphs<br />
			(<a href="examples/03_graphs.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/04_simplest.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/04_simplest.png" alt="Simplest possible example" />
			</a>
		</td>
		<td>
			Simplest possible example<br />
			(<a href="examples/04_simplest.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/05_video_and_time.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/06_video_and_time.png" alt="Video and time" />
			</a>
		</td>
		<td>
			Video and time<br />
			(<a href="examples/05_video_and_time.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/06_array_interpolation.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Array interpolation" />
			</a>
		</td>
		<td>
			Array interpolation<br />
			(<a href="examples/06_array_interpolation.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/07_dynamic_to.png" alt="Dynamic to, object" />
			</a>
		</td>
		<td>
			Dynamic to, object<br />
			(<a href="examples/07_dynamic_to.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07a_dynamic_to_two_array_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/07a_dynamic_to.png" alt="Dynamic to, interpolation array" />
			</a>
		</td>
		<td>
			Dynamic to, interpolation array<br />
			(<a href="examples/07a_dynamic_to_two_array_values.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07b_dynamic_to_an_array_of_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/07b_dynamic_to.png" alt="Dynamic to, large interpolation array" />
			</a>
		</td>
		<td>
			Dynamic to, large interpolation array<br />
			(<a href="examples/07b_dynamic_to_an_array_of_values.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/08_repeat.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/08_repeat.png" alt="Repeat" />
			</a>
		</td>
		<td>
			Repeat<br />
			(<a href="examples/08_repeat.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/09_relative_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/09_relative.png" alt="Relative values" />
			</a>
		</td>
		<td>
			Relative values<br />
			(<a href="examples/09_relative_values.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/10_yoyo.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/10_yoyo.png" alt="Yoyo" />
			</a>
		</td>
		<td>
			Yoyo<br />
			(<a href="examples/10_yoyo.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/11_stop_all_chained_tweens.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/11_stop_all_chained_tweens.png" alt="Stop all chained tweens" />
			</a>
		</td>
		<td>
			Stop all chained tweens<br />
			(<a href="examples/11_stop_all_chained_tweens.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/12_graphs_custom_functions.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Custom functions" />
			</a>
		</td>
		<td>
			Custom functions<br />
			(<a href="examples/12_graphs_custom_functions.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/13_relative_start_time.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/13_relative_start_time.png" alt="Relative start time" />
			</a>
		</td>
		<td>
			Relative start time<br />
			(<a href="examples/13_relative_start_time.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/14_pause_tween.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/14_pause_tween.png" alt="Pause tween" />
			</a>
		</td>
		<td>
			Pause tween<br />
			(<a href="examples/14_pause_tween.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/15_complex_properties.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/15_complex_properties.png" alt="Complex properties" />
			</a>
		</td>
		<td>
			Complex properties<br />
			(<a href="examples/15_complex_properties.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/16_animate_an_array_of_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/16_animate_an_array_of_values.png" alt="Animate an array of values" />
			</a>
		</td>
		<td>
			Animate an array of values<br />
			(<a href="examples/16_animate_an_array_of_values.html">source</a>)
		</td>
	</tr>
</table>

# Installation

The recommended method is to use `import` syntax. Here we've listed various
install methods starting roughly with the most recommended first and least
desirable last. Evaluate all of the following methods to pick what is most
suitable for your project.

## With `npm install` and `import` from `node_modules`

You can add tween.js as an npm dependency:

```bash
npm install @tweenjs/tween.js
```

### Without a build tool

#### Installed locally

You can import from `node_modules` if you serve `node_modules` as part of your
website, using a standard `importmap` script tag. First, assuming `node_modules`
is at the root of your website, you can write an import map like so in your HTML
file:

```html
<script type="importmap">
	{
		"imports": {
			"@tweenjs/tween.js": "/node_modules/@tweenjs/tween.js/dist/tween.esm.js"
		}
	}
</script>
```

Now in any of your module scripts you can import Tween.js by its package name:

```html
<script type="module">
	import {Tween} from '@tweenjs/tween.js'
</script>
```

#### Import from CDN

Note that, without the `importmap`, you can import directly from a CDN as with the first example above, like so:

```html
<script type="module">
	import {Tween} from 'https://unpkg.com/browse/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'
</script>
```

You can also link your `importmap` to the CDN instead of a local `node_modules` folder, if you prefer that:

```html
<script type="importmap">
	{
		"imports": {
			"@tweenjs/tween.js": "https://unpkg.com/browse/@tweenjs/tween.js@23.1.3/dist/tween.esm.js"
		}
	}
</script>

<script type="module">
	import {Tween} from '@tweenjs/tween.js'
</script>
```

### With a build tool

If you are using [Node.js](https://nodejs.org/),
[Parcel](https://parceljs.org/), [Webpack](https://webpack.js.org/),
[Rollup](https://rollupjs.org/), [Vite](https://vitejs.dev/), or another build
tool, then you can install `@tweenjs/tween.js` with `npm install
@tweenjs/tween.js`, and `import` the library into your JavaScript (or
TypeScript) file, and the build tool will know how to find the source code from
`node_modules` without needing to create an `importmap` script:

```javascript
import * as TWEEN from '@tweenjs/tween.js'
```

However, note that this approach requires always running a build tool for your
app to work, while the `importmap` approach will simply work without any build
tools as a simple static HTML site.

## Manual build

Another approach is to download the source code with git, manually build the
library, then place the output in your project. Node.js is required for this.

```bash
git clone https://github.com/tweenjs/tween.js
cd tween.js
npm install
npm run build
```

This will create some builds in the `dist` directory. There are currently two different builds of the library:

- ES6 Module in `/dist/tween.esm.js` (recommended)
- UMD in `/dist/tween.umd.js` (deprecated, will be removed in a future major version)

You are now able to copy one of those two files into your project, and use like this (recommended):

```html
<script type="module">
	import {Tween} from 'path/to/tween.esm.js'
</script>
```

or (deprecated, to be removed in future major):

```html
<script src="path/to/tween.umd.js"></script>
<script>
	const {Tween} = TWEEN
</script>
```

where `path/to` is replaced with the location where you placed the file.

> [!Note]
> You can also download these files from unpkg, for example here:
> https://unpkg.com/browse/@tweenjs/tween.js@23.1.3/dist/

## Global variable from CDN (deprecated)

> [!Note]
> This method is deprecated and will be removed in a future major version!

Install a global `TWEEN` variable from a content-delivery network (CDN) using the UMD file.

From cdnjs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/23.1.3/tween.umd.js"></script>
```

Or from unpkg.com:

```html
<script src="https://unpkg.com/@tweenjs/tween.js@^23.1.3/dist/tween.umd.js"></script>
```

Then use the `TWEEN` variable in any script:

```html
<script>
	const {Tween, Easing, Group /*, ...*/} = TWEEN

	const tween = new Tween(someObject)
	// ...
</script>
```

> [!Note]
> unpkg.com supports a semver version in the URL, where the `^` in the
> URL tells unpkg to give you the latest version 20.x.x.

## CommonJS (deprecated)

Skip this section if you don't know what CommonJS is!

> [!Note]
> This method is deprecated and will be removed in a future major version!

Any of the above methods work in older systems that still use CommonJS. Repeat
any of the above methods but using `dist/tween.cjs` instead of
`dist/tween.esm.js` or `dist/tween.umd.js`.

# Documentation

- [User guide](./docs/user_guide.md)
- [Contributor guide](./docs/contributor_guide.md)
- [Tutorial](https://web.archive.org/web/20220601192930/http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/) using tween.js with three.js
- Also: [libtween](https://github.com/jsm174/libtween), a port of tween.js to C by [jsm174](https://github.com/jsm174)

# Tests

You need to install `npm` first--this comes with node.js, so install that one first. Then, cd to `tween.js`'s (or wherever you cloned the repo) directory and run:

```bash
npm install
```

To run the tests run:

```bash
npm test
```

If you want to add any feature or change existing features, you _must_ run the
tests to make sure you didn't break anything else. Any pull request (PR) needs
to have updated passing tests for feature changes (or new passing tests for new
features or fixes) in `src/tests.ts` to be accepted. See
[contributing](CONTRIBUTING.md) for more information.

# People

Maintainers: [Joe Pea (@trusktr)](https://github.com/trusktr).

[All contributors](http://github.com/tweenjs/tween.js/contributors).

# Projects using tween.js

[<img src="./assets/projects/11_lume.jpg" width="100" alt="Lume" />](https://lume.io)
[![A-Frame VR](https://tweenjs.github.io/tween.js/assets/projects/10_aframe.png)](https://aframe.io)
[![MOMA Inventing Abstraction 1910-1925](https://tweenjs.github.io/tween.js/assets/projects/09_moma.png)](http://www.moma.org/interactives/exhibitions/2012/inventingabstraction/)
[![Web Lab](https://tweenjs.github.io/tween.js/assets/projects/08_web_lab.png)](http://www.chromeweblab.com/)
[![MACCHINA I](https://tweenjs.github.io/tween.js/assets/projects/07_macchina.png)](http://5013.es/toys/macchina)
[![Minesweeper 3D](https://tweenjs.github.io/tween.js/assets/projects/06_minesweeper3d.png)](http://egraether.com/mine3d/)
[![ROME](https://tweenjs.github.io/tween.js/assets/projects/05_rome.png)](http://ro.me)
[![WebGL Globe](https://tweenjs.github.io/tween.js/assets/projects/04_webgl_globe.png)](http://data-arts.appspot.com/globe)
[![Androidify](https://tweenjs.github.io/tween.js/assets/projects/03_androidify.png)](http://www.androidify.com/)
[![The Wilderness Downtown](https://tweenjs.github.io/tween.js/assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)
[![Linechart](https://tweenjs.github.io/tween.js/assets/projects/00_linechart.png)](http://dejavis.org/linechart)

[npm-image]: https://img.shields.io/npm/v/@tweenjs/tween.js.svg
[npm-url]: https://npmjs.org/package/@tweenjs/tween.js
[downloads-image]: https://img.shields.io/npm/dm/@tweenjs/tween.js.svg
[downloads-url]: https://npmjs.org/package/@tweenjs/tween.js
[ci-image]: https://github.com/tweenjs/tween.js/workflows/build%20and%20tests/badge.svg?branch=master
[ci-url]: https://github.com/tweenjs/tween.js/actions
[cdnjs-image]: https://img.shields.io/cdnjs/v/tween.js.svg
[cdnjs-url]: https://cdnjs.com/libraries/tween.js
