# tween.js

JavaScript tweening engine for easy animations, incorporating optimised Robert Penner's equations.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Travis tests][travis-image]][travis-url]
[![Flattr this][flattr-image]][flattr-url]
[![CDNJS][cdnjs-image]][cdnjs-url]

```javascript
var coords = { x: 0, y: 0 };
var tween = new TWEEN.Tween(coords)
	.to({ x: 100, y: 100 }, 1000)
	.onUpdate(function() {
		console.log(this.x, this.y);
	})
	.start();

requestAnimationFrame(animate);

function animate(time) {
	requestAnimationFrame(animate);
	TWEEN.update(time);
}
```

## Installation

Download the [library](https://raw.githubusercontent.com/tweenjs/tween.js/master/src/Tween.js) and include it in your code:

```html
<script src="js/Tween.js"></script>
```

You can also reference a CDN-hosted version in your code, thanks to cdnjs. For example:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"></script>
```

See [tween.js](https://cdnjs.com/libraries/tween.js/) for more versions.

### More advanced users might want to...

#### Use `npm`

```bash
npm install tween.js
```

Then include the Tween.js module with the standard node.js `require`:

```javascript
var TWEEN = require('tween.js');
```

And you can use Tween.js as in all other examples--for example:

```javascript
var t = new TWEEN.Tween( /* etc */ );
t.start();
```

You will need to use a tool such as `browserify` to convert code using this style into something that can be run in the browser (browsers don't know about `require`).

#### Use `bower`

```bash
bower install tweenjs --save
```

or install an specific tag. They are git tags, and you can run `git tag` in the command line for a list if you have cloned the repository locally, or you can also check out the list in the [tween.js tags page](https://github.com/tweenjs/tween.js/tags). For example, to install `v16.3.0`:

```bash
bower install tweenjs#v16.3.0
```

Then reference the library source:

```html
<script src="bower_components/tweenjs/src/Tween.js"></script>
```

## Features

* Does one thing and one thing only: tween properties
* Doesn't take care of CSS units (e.g. appending `px`)
* Doesn't interpolate colours
* Easing functions are reusable outside of Tween
* Can also use custom easing functions

## Documentation

* [User guide](./docs/user_guide.md)
* [Tutorial](http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/)  using tween.js with three.js
* Also: [libtween](https://github.com/jsm174/libtween), a port of tween.js to C by [jsm174](https://github.com/jsm174)

## Examples

[![Custom functions](http://tweenjs.github.io/tween.js/assets/examples/03_graphs.png)](http://tweenjs.github.io/tween.js/examples/12_graphs_custom_functions.html)
[source](./examples/12_graphs_custom_functions.html)
[![Stop all chained tweens](http://tweenjs.github.io/tween.js/assets/examples/11_stop_all_chained_tweens.png)](http://tweenjs.github.io/tween.js/examples/11_stop_all_chained_tweens.html) [source](./examples/11_stop_all_chained_tweens.html)
[![Yoyo](http://tweenjs.github.io/tween.js/assets/examples/10_yoyo.png)](http://tweenjs.github.io/tween.js/examples/10_yoyo.html) [source](./examples/10_yoyo.html)
[![Relative values](http://tweenjs.github.io/tween.js/assets/examples/09_relative.png)](http://tweenjs.github.io/tween.js/examples/09_relative_values.html) [source](./examples/09_relative_values.html)
[![Repeat](http://tweenjs.github.io/tween.js/assets/examples/08_repeat.png)](http://tweenjs.github.io/tween.js/examples/08_repeat.html) [source](./examples/08_repeat.html)
[![Dynamic to](http://tweenjs.github.io/tween.js/assets/examples/07_dynamic_to.png)](http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html) [source](./examples/07_dynamic_to.html)
[![Array interpolation](http://tweenjs.github.io/tween.js/assets/examples/03_graphs.png)](http://tweenjs.github.io/tween.js/examples/06_array_interpolation.html) [source](./examples/06_array_interpolation.html)
[![Video and time](http://tweenjs.github.io/tween.js/assets/examples/06_video_and_time.png)](http://tweenjs.github.io/tween.js/examples/05_video_and_time.html) [source](./examples/05_video_and_time.html)
[![Simplest possible example](http://tweenjs.github.io/tween.js/assets/examples/04_simplest.png)](http://tweenjs.github.io/tween.js/examples/04_simplest.html) [source](./examples/04_simplest.html)
[![Graphs](http://tweenjs.github.io/tween.js/assets/examples/03_graphs.png)](http://tweenjs.github.io/tween.js/examples/03_graphs.html) [source](./examples/03_graphs.html)
[![Black and red](http://tweenjs.github.io/tween.js/assets/examples/02_black_and_red.png)](http://tweenjs.github.io/tween.js/examples/02_black_and_red.html) [source](./examples/02_black_and_red.html)
[![Bars](http://tweenjs.github.io/tween.js/assets/examples/01_bars.png)](http://tweenjs.github.io/tween.js/examples/01_bars.html) [source](./examples/01_bars.html)
[![hello world](http://tweenjs.github.io/tween.js/assets/examples/00_hello_world.png)](http://tweenjs.github.io/tween.js/examples/00_hello_world.html) [source](./examples/00_hello_world.html)

## Tests

You need to install `npm` first--this comes with node.js, so install that one first. Then, cd to `tween.js`'s directory and run:

```bash
npm install
```

if running the tests for the first time, to install additional dependencies for running tests, and then run

```bash
npm test
```

every time you want to run the tests.

If you want to add any feature or change existing features, you *must* run the tests to make sure you didn't break anything else. If you send a PR to add something new and it doesn't have tests, or the tests don't pass, the PR won't be accepted. See [contributing](CONTRIBUTING.md) for more information.

## People

Maintainers: [mikebolt](https://github.com/mikebolt), [sole](https://github.com/sole).

[All contributors](http://github.com/tweenjs/tween.js/contributors).

## Projects using tween.js

[![A-Frame VR](http://tweenjs.github.io/tween.js/assets/projects/10_aframe.png)](https://aframe.io)
[![MOMA Inventing Abstraction 1910-1925](http://tweenjs.github.io/tween.js/assets/projects/09_moma.png)](http://www.moma.org/interactives/exhibitions/2012/inventingabstraction/)
[![Web Lab](http://tweenjs.github.io/tween.js/assets/projects/08_web_lab.png)](http://www.chromeweblab.com/)
[![MACCHINA I](http://tweenjs.github.io/tween.js/assets/projects/07_macchina.png)](http://5013.es/toys/macchina)
[![Minesweeper 3D](http://tweenjs.github.io/tween.js/assets/projects/06_minesweeper3d.png)](http://egraether.com/mine3d/)
[![ROME](http://tweenjs.github.io/tween.js/assets/projects/05_rome.png)](http://ro.me)
[![WebGL Globe](http://tweenjs.github.io/tween.js/assets/projects/04_webgl_globe.png)](http://data-arts.appspot.com/globe)
[![Androidify](http://tweenjs.github.io/tween.js/assets/projects/03_androidify.png)](http://www.androidify.com/)
[![The Wilderness Downtown](http://tweenjs.github.io/tween.js/assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)
[![Linechart](http://tweenjs.github.io/tween.js/assets/projects/00_linechart.png)](http://dejavis.org/linechart)

[npm-image]: https://img.shields.io/npm/v/tween.js.svg
[npm-url]: https://npmjs.org/package/tween.js
[downloads-image]: https://img.shields.io/npm/dm/tween.js.svg
[downloads-url]: https://npmjs.org/package/tween.js
[travis-image]: https://travis-ci.org/tweenjs/tween.js.svg?branch=master
[travis-url]: https://travis-ci.org/tweenjs/tween.js
[flattr-image]: https://api.flattr.com/button/flattr-badge-large.png
[flattr-url]: https://flattr.com/thing/45014/tween-js
[cdnjs-image]: https://img.shields.io/cdnjs/v/tween.js.svg
[cdnjs-url]: https://cdnjs.com/libraries/tween.js
