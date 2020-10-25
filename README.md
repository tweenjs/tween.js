# tween.js

JavaScript tweening engine for easy animations, incorporating optimised Robert Penner's equations.

[![NPM Version][npm-image]][npm-url]
[![CDNJS][cdnjs-image]][cdnjs-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build and Tests][ci-image]][ci-url]

**Update Note** In v18 the script you should include has moved from `src/Tween.js` to `dist/tween.umd.js`. See the [installation section](#Installation) below.

---

```javascript
const box = document.createElement('div')
box.style.setProperty('background-color', '#008800')
box.style.setProperty('width', '100px')
box.style.setProperty('height', '100px')
document.body.appendChild(box)

// Setup the animation loop.
function animate(time) {
	requestAnimationFrame(animate)
	TWEEN.update(time)
}
requestAnimationFrame(animate)

const coords = {x: 0, y: 0} // Start at (0, 0)
const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
	.to({x: 300, y: 200}, 1000) // Move to (300, 200) in 1 second.
	.easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
	.onUpdate(() => {
		// Called after tween.js updates 'coords'.
		// Move 'box' to the position described by 'coords' with a CSS translation.
		box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`)
	})
	.start() // Start the tween immediately.
```

[Test it with CodePen](https://codepen.io/mikebolt/pen/zzzvZg)

## Installation

Currently npm is required to build the project.

```bash
git clone https://github.com/tweenjs/tween.js
cd tween.js
npm i .
npm run build
```

This will create some builds in the `dist` directory. There are currently four different builds of the library:

- UMD : tween.umd.js
- AMD : tween.amd.js
- CommonJS : tween.cjs.js
- ES6 Module : tween.es.js

You are now able to copy tween.umd.js into your project, then include it with
a script tag. This will add TWEEN to the global scope.

```html
<script src="js/tween.umd.js"></script>
```

### With `require('@tweenjs/tween.js')`

You can add tween.js as an npm dependency:

```bash
npm i @tweenjs/tween.js@^18
```

If you are using Node, Webpack, or Browserify, then you can now use the following to include tween.js:

```javascript
const TWEEN = require('@tweenjs/tween.js')
```

## Features

- Does one thing and one thing only: tween properties
- Doesn't take care of CSS units (e.g. appending `px`)
- Doesn't interpolate colours
- Easing functions are reusable outside of Tween
- Can also use custom easing functions

## Documentation

- [User guide](./docs/user_guide.md)
- [Contributor guide](./docs/contributor_guide.md)
- [Tutorial](http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/) using tween.js with three.js
- Also: [libtween](https://github.com/jsm174/libtween), a port of tween.js to C by [jsm174](https://github.com/jsm174)
- Also: [es6-tween](https://github.com/tweenjs/es6-tween), a port of tween.js to ES6/Harmony by [dalisoft](https://github.com/dalisoft)
- [Understanding tween.js](https://mikebolt.me/article/understanding-tweenjs.html)

## Examples

<table>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/00_hello_world.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/00_hello_world.png" alt="hello world" />
			</a>
		</td>
		<td>
			hello world<br />
			(<a href="examples/00_hello_world.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/01_bars.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/01_bars.png" alt="Bars" />
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
				<img src="https://tweenjs.github.io/tween.js/assets/examples/02_black_and_red.png" alt="Black and red" />
			</a>
		</td>
		<td>
			Black and red<br />
			(<a href="examples/02_black_and_red.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/03_graphs.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Graphs" />
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
				<img src="https://tweenjs.github.io/tween.js/assets/examples/04_simplest.png" alt="Simplest possible example" />
			</a>
		</td>
		<td>
			Simplest possible example<br />
			(<a href="examples/04_simplest.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/05_video_and_time.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/06_video_and_time.png" alt="Video and time" />
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
				<img src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Array interpolation" />
			</a>
		</td>
		<td>
			Array interpolation<br />
			(<a href="examples/06_array_interpolation.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/07_dynamic_to.png" alt="Dynamic to" />
			</a>
		</td>
		<td>
			Dynamic to<br />
			(<a href="examples/07_dynamic_to.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07a_dynamic_to.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/07a_dynamic_to.png" alt="Dynamic to" />
			</a>
		</td>
		<td>
			Dynamic to<br />
			(<a href="examples/07a_dynamic_to.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07b_dynamic_to.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/07b_dynamic_to.png" alt="Dynamic to" />
			</a>
		</td>
		<td>
			Dynamic to<br />
			(<a href="examples/07b_dynamic_to.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/08_repeat.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/08_repeat.png" alt="Repeat" />
			</a>
		</td>
		<td>
			Repeat<br />
			(<a href="examples/08_repeat.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/09_relative_values.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/09_relative.png" alt="Relative values" />
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
				<img src="https://tweenjs.github.io/tween.js/assets/examples/10_yoyo.png" alt="Yoyo" />
			</a>
		</td>
		<td>
			Yoyo<br />
			(<a href="examples/10_yoyo.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/11_stop_all_chained_tweens.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/11_stop_all_chained_tweens.png" alt="Stop all chained tweens" />
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
				<img src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Custom functions" />
			</a>
		</td>
		<td>
			Custom functions<br />
			(<a href="examples/12_graphs_custom_functions.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/13_relative_start_time.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/13_relative_start_time.png" alt="Custom functions" />
			</a>
		</td>
		<td>
			Custom functions<br />
			(<a href="examples/13_relative_start_time.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/14_pause_tween.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/14_pause_tween.png" alt="Custom functions" />
			</a>
		</td>
		<td>
			Custom functions<br />
			(<a href="examples/14_pause_tween.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/15_complex_properties.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/15_complex_properties.png" alt="Custom functions" />
			</a>
		</td>
		<td>
			Custom functions<br />
			(<a href="examples/15_complex_properties.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/16_animate_an_array_of_values.html">
				<img src="https://tweenjs.github.io/tween.js/assets/examples/16_animate_an_array_of_values.png" alt="Custom functions" />
			</a>
		</td>
		<td>
			Custom functions<br />
			(<a href="examples/16_animate_an_array_of_values.html">source</a>)
		</td>
	</tr>
</table>

## Tests

You need to install `npm` first--this comes with node.js, so install that one first. Then, cd to `tween.js`'s directory and run:

```bash
npm install
```

To run the tests run:

```bash
npm test
```

If you want to add any feature or change existing features, you _must_ run the tests to make sure you didn't break anything else. Any pull request (PR) needs to have updated passing tests for feature changes (or new passing tests for new features) in `src/tests.ts`, otherwise the PR won't be accepted. See [contributing](CONTRIBUTING.md) for more information.

## People

Maintainers: [mikebolt](https://github.com/mikebolt), [sole](https://github.com/sole), [Joe Pea (@trusktr)](https://github.com/trusktr).

[All contributors](http://github.com/tweenjs/tween.js/contributors).

## Projects using tween.js

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
