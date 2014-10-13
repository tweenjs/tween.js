# tween.js (r15dev) [![Travis tests](https://travis-ci.org/sole/tween.js.svg?branch=master)](https://travis-ci.org/sole/tween.js)

**JavaScript tweening engine for easy animations**

[![Install with NPM](https://nodei.co/npm/tween.js.png?downloads=true&stars=true)](https://nodei.co/npm/tween.js/)

[![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/thing/45014/tween-js)

Super simple, fast and easy to use tweening engine which incorporates optimised Robert Penner's equations.

[Contributors](http://github.com/sole/tween.js/contributors)

## Examples

[![Custom functions](http://sole.github.io/tween.js/assets/examples/03_graphs.png)](http://sole.github.io/tween.js/examples/12_graphs_custom_functions.html)
[source](./examples/12_graphs_custom_functions.html)
[![Stop all chained tweens](http://sole.github.io/tween.js/assets/examples/11_stop_all_chained_tweens.png)](http://sole.github.io/tween.js/examples/11_stop_all_chained_tweens.html) [source](./examples/11_stop_all_chained_tweens.html)
[![Yoyo](http://sole.github.io/tween.js/assets/examples/10_yoyo.png)](http://sole.github.io/tween.js/examples/10_yoyo.html) [source](./examples/10_yoyo.html)
[![Relative values](http://sole.github.io/tween.js/assets/examples/09_relative.png)](http://sole.github.io/tween.js/examples/09_relative_values.html) [source](./examples/09_relative_values.html)
[![Repeat](http://sole.github.io/tween.js/assets/examples/08_repeat.png)](http://sole.github.io/tween.js/examples/08_repeat.html) [source](./examples/08_repeat.html)
[![Dynamic to](http://sole.github.io/tween.js/assets/examples/07_dynamic_to.png)](http://sole.github.io/tween.js/examples/07_dynamic_to.html) [source](./examples/07_dynamic_to.html)
[![Array interpolation](http://sole.github.io/tween.js/assets/examples/03_graphs.png)](http://sole.github.io/tween.js/examples/06_array_interpolation.html) [source](./examples/06_array_interpolation.html)
[![Video and time](http://sole.github.io/tween.js/assets/examples/06_video_and_time.png)](http://sole.github.io/tween.js/examples/05_video_and_time.html) [source](./examples/05_video_and_time.html)
[![Simplest possible example](http://sole.github.io/tween.js/assets/examples/04_simplest.png)](http://sole.github.io/tween.js/examples/04_simplest.html) [source](./examples/04_simplest.html)
[![Graphs](http://sole.github.io/tween.js/assets/examples/03_graphs.png)](http://sole.github.io/tween.js/examples/03_graphs.html) [source](./examples/03_graphs.html)
[![Black and red](http://sole.github.io/tween.js/assets/examples/02_black_and_red.png)](http://sole.github.io/tween.js/examples/02_black_and_red.html) [source](./examples/02_black_and_red.html)
[![Bars](http://sole.github.io/tween.js/assets/examples/01_bars.png)](http://sole.github.io/tween.js/examples/01_bars.html) [source](./examples/01_bars.html)
[![hello world](http://sole.github.io/tween.js/assets/examples/00_hello_world.png)](http://sole.github.io/tween.js/examples/00_hello_world.html) [source](./examples/00_hello_world.html)

## Projects using tween.js

[![MOMA Inventing Abstraction 1910-1925](http://sole.github.io/tween.js/assets/projects/09_moma.png)](http://www.moma.org/interactives/exhibitions/2012/inventingabstraction/)
[![Web Lab](http://sole.github.io/tween.js/assets/projects/08_web_lab.png)](http://www.chromeweblab.com/)
[![MACCHINA I](http://sole.github.io/tween.js/assets/projects/07_macchina.png)](http://5013.es/toys/macchina)
[![Minesweeper 3D](http://sole.github.io/tween.js/assets/projects/06_minesweeper3d.png)](http://egraether.com/mine3d/)
[![ROME](http://sole.github.io/tween.js/assets/projects/05_rome.png)](http://ro.me)
[![WebGL Globe](http://sole.github.io/tween.js/assets/projects/04_webgl_globe.png)](http://data-arts.appspot.com/globe)
[![Androidify](http://sole.github.io/tween.js/assets/projects/03_androidify.png)](http://www.androidify.com/)
[![The Wilderness Downtown](http://sole.github.io/tween.js/assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)
[![Linechart](http://sole.github.io/tween.js/assets/projects/00_linechart.png)](http://dejavis.org/linechart)

## Getting it

Download the [minified library](https://raw.githubusercontent.com/sole/tween.js/r14/build/tween.min.js) and include it in your html. Or use the [unminified version](https://raw.githubusercontent.com/sole/tween.js/r14/src/Tween.js) for better debugging.

```html
<script src="js/tween.min.js"></script>
```

### More advanced users might want to...

#### Use development version

The steps above are for getting the latest stable version (tagged with a release tag in git). If you want to check the latest and greatest, simply check out the repository as it is, or download either
* [tween.min.js](https://raw.githubusercontent.com/sole/tween.js/master/build/tween.min.js)
* [tween.js](https://raw.githubusercontent.com/sole/tween.js/master/src/Tween.js)

#### Use `npm`

```bash
npm install tween.js
```

Then use `browserify` or your `npm` tool of choice, or just include the module using the standard `node` require:

```javascript
var TWEEN = require('tween.js');
```

You're an advanced user, so find your way around.

#### Use `bower`

```bash
bower install git@github.com:sole/tween.js.git
```

or install an specific tag (it's just git tags, you can run `git tag` for a list):

```bash
bower install git@github.com:sole/tween.js.git#r13
```

And reference either the minified file:

```html
<script src="bower_components/tween.js/build/tween.min.js"></script>
```

or the unminified file

```html
<script src="bower_components/tween.js/src/Tween.js"></script>
```

## Usage

The following code creates a Tween which will change the `x` attribute in a position variable, so that it goes from 50 to 400 in 2 seconds. We'll use `requestAnimationFrame` to call `TWEEN.update` so that "time ticks", the `tween` gets updated and the `onUpdate` method makes things happen on the screen:

```javascript

	init();
	animate();

	function init() {

		var output = document.createElement( 'div' );
		output.style.cssText = 'position: absolute; left: 50px; top: 300px; font-size: 100px';
		document.body.appendChild( output );

		var tween = new TWEEN.Tween( { x: 50, y: 0 } )
			.to( { x: 400 }, 2000 )
			.easing( TWEEN.Easing.Elastic.InOut )
			.onUpdate( function () {

				output.innerHTML = 'x == ' + Math.round( this.x );
				var transform = 'translateX(' + this.x + 'px)';
				output.style.webkitTransform = transform;
				output.style.transform = transform;

			} )
			.start();

	}

	function animate(time) {

		requestAnimationFrame( animate ); // js/RequestAnimationFrame.js needs to be included too.
		TWEEN.update(time);

	}

```

Note: this corresponds to the example [04_simplest.html](./examples/04_simplest.html) that you can find in the ```examples``` folder.

Have a look at that folder to discover more functionalities of the library, or read the [user guide](./docs/user_guide.md)!

Also, Jerome Etienne has written a [tutorial](http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/) demonstrating how to use tween.js with three.js, and it's also great for understanding how tweens work!

Finally, if you need to use tweens in C/C++ code, you now have an option! Check out [libtween](https://github.com/jsm174/libtween) which is a port of tween.js to C by [jsm174](https://github.com/jsm174)!

## Running the tests

You need to install `npm` first--this comes with node.js, so install that one first. Then, cd to `tween.js`'s directory and run:

```bash
npm test
```

If you want to add any feature or change existing features, you *must* run the tests to make sure you didn't break anything else. If you send a PR to add something new and it doesn't have tests, the PR won't be accepted (unless it's seriously good). See [contributing](CONTRIBUTING.md) for more info.

## Change log

2014 06 15 - **r14** (5,798 KB, gzip: 2,168 KB)

* Include license header on the minified files too ([hyandell](https://github.com/hyandell))
* Make examples more efficient by using `requestAnimationFrame`'s own timer instead of calling `Date.now` again ([Robert Eisele](https://github.com/hyandell))
* Make it explicit that you can install tween.js with `npm` and `bower` ([sole](https://github.com/sole))

2014 05 05 - **r13** (5,765 KB, gzip: 2,149 KB)

* Add ```Tween.onStop``` ([colinsullivan](https://github.com/colinsullivan))
* Fix `_reversed` yoyo flag bug ([deanm](https://github.com/deanm))
* Initial version of [docs/user guide](./docs/user_guide.md) ([sole](https://github.com/sole))

2013 11 03 - **r12** (5,697 KB, gzip: 2,131 KB)

* Fix bug with cached ```tweens.length``` value inside ```update()``` loop ([freestlr](https://github.com/freestlr))
* Move assets and all examples and stuff to use the ```gh-pages``` branch, so things are always properly updated ([sole](https://github.com/sole)).
* Fix bug where chained tweens were not stopped if the previous tween had been stopped, under certain circumstances, by [fundon](https://github.com/fundon)
* Use tweens in C/C++ with [libtween](https://github.com/jsm174/libtween) by [jsm174](https://github.com/jsm174)!

2013 08 10 - **r11**

* Add ```yoyo``` functionality: tweens can bounce back to their original value when finished ([benjamind](https://github.com/benjamind))
* Make tween.js an _official_ npm module ([sole](https://github.com/sole)) (hint: ```npm install tween.js```)
* Bring node.js compatibility back! ([benjamind](https://github.com/benjamind))
* Bring IE shim back! ([sole](https://github.com/sole))
* Tween only strings, arrays or numbers ([JAStanton](https://github.com/JAStanton))

2013 03 03 - **r10** (5,342 KB, gzip: 2,010 KB)

* Added the ability to tween using relative values with ```to()``` ([endel](https://github.com/endel))

2013 02 04 - **r9** (5,224 KB, gzip: 1,959 KB)

* Use window.performance.now() if available for even smoother animations ([tdreyno](https://github.com/tdreyno), [mrdoob](https://github.com/mrdoob) and [sole](https://github.com/sole))
* Added tween.repeat() ([sole](https://github.com/sole))
* Improve example_01 performance ([mrdoob](https://github.com/mrdoob))
* Use CONTRIBUTING.md instead of having the section on README.md ([sole](https://github.com/sole))

2013 01 04 - **r8** (4,961 KB, gzip: 1,750 KB)

* New Date.now() shim by [roshambo](http://github.com/roshambo) makes the lib compatible with IE
* Fix for checking undefined `duration` ([deanm](http://github.com/deanm))
* Add unit tests ([sole](http://github.com/sole))
* Fixed non-existing properties sent in `to` and ending up as NaN in the target object ([sole](http://github.com/sole))
* Add missing example screenshot ([sole](http://github.com/sole))
* Add CONTRIBUTING section in README ([sole](http://github.com/sole))

2012 10 27 - **r7** (4,882 KB, gzip: 1,714 KB)

* Fixed start time of chained tweens when using custom timing. ([egraether](http://github.com/egraether))
* TWEEN.update() now returns a boolean (tweens pending or not). ([mrdoob](http://github.com/mrdoob))
* Added tween.onStart(). ([mrdoob](http://github.com/mrdoob))
* tween.chain() now accepts multiple tweens. ([mrdoob](http://github.com/mrdoob))


2012 04 10 - **r6** (4,707 KB, gzip: 1,630 KB)

* Returning instance also in `.chain()`. ([mrdoob](http://github.com/mrdoob))
* Refactoring and code clean up. ([egraether](http://github.com/egraether))
* Simplified easing formulas. ([infusion](http://github.com/infusion))
* Added support to arrays in `.to()` using linear, catmull-rom or bezier `.interpolation()`. ([egraether](http://github.com/egraether))
* Removed autostart/stop. ([mrdoob](http://github.com/mrdoob))
* Renamed `EaseNone`, `EaseIn`, `EaseOut` ane `EaseInOut`, to `None`, `In`, `Out` and `InOut`. ([mrdoob](http://github.com/mrdoob))
* Made `.to()` values dynamic. ([egraether](http://github.com/egraether) and [jeromeetienne](http://github.com/jeromeetienne))


2011 10 15 - **r5** (4,733 KB, gzip: 1,379 KB)

* Add autostart/stop functionalities ([jocafa](http://github.com/jocafa) and [sole](http://github.com/sole))
* Add 07_autostart example demonstrating the new functionalities ([sole](http://github.com/sole))


2011 10 15 - **r4**

* Use ``Date.now()`` instead of ``new Date.getTime()`` as it's faster ([mrdoob](http://github.com/mrdoob))


2011 09 30 - **r3**

* Added new ``time`` parameter to TWEEN.update, in order to allow synchronizing the tweens to an external timeline ([lechecacharro](http://github.com/lechecacharro))
* Added example to demonstrate the new synchronizing feature. ([sole](http://github.com/sole))


2011 06 18 - **r2**

* Added new utility methods getAll and removeAll for getting and removing all tweens ([Paul Lewis](http://github.com/paullewis))


2011 05 18 - **r1**

* Started using revision numbers in the build file
* Consider this kind of an stable revision :-)

## FAQ

**How do you set a tween to start after a while?**

Use the `delay()` method: `var t = new TWEEN.Tween({...}).delay(1000);`

**Is there a jQuery plug-in?**

Yes, now available via <a href="https://github.com/thednp/jQueryTween">jQueryTween</a>.

