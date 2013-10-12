tween.js
========

#### Javascript Tweening Engine ####

[![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/thing/45014/tween-js)

Super simple, fast and easy to use tweening engine which incorporates optimised Robert Penner's equations.

[Contributors](http://github.com/sole/tween.js/contributors)

### Examples ###

[![Relative values](./assets/examples/09_relative.png)](./examples/09_relative_values.html)
[![Repeat](./assets/examples/08_repeat.png)](./examples/08_repeat.html)
[![Dynamic to](./assets/examples/07_dynamic_to.png)](./examples/07_dynamic_to.html)
[![Array interpolation](./assets/examples/03_graphs.png)](./examples/06_array_interpolation.html)
[![Video and time](./assets/examples/06_video_and_time.png)](./examples/05_video_and_time.html)
[![Simplest possible example](./assets/examples/04_simplest.png)](./examples/04_simplest.html)
[![Graphs](./assets/examples/03_graphs.png)](./examples/03_graphs.html)
[![Black and red](./assets/examples/02_black_and_red.png)](./examples/02_black_and_red.html)
[![Bars](./assets/examples/01_bars.png)](./examples/01_bars.html)
[![hello world](./assets/examples/00_hello_world.png)](./examples/00_hello_world.html)

### Projects using tween.js ###

[![MOMA Inventing Abstraction 1910-1925](./assets/projects/09_moma.png)](http://www.moma.org/interactives/exhibitions/2012/inventingabstraction/)
[![Web Lab](./assets/projects/08_web_lab.png)](http://www.chromeweblab.com/)
[![MACCHINA I](./assets/projects/07_macchina.png)](http://5013.es/toys/macchina)
[![Minesweeper 3D](./assets/projects/06_minesweeper3d.png)](http://egraether.com/mine3d/)
[![ROME](./assets/projects/05_rome.png)](http://ro.me)
[![WebGL Globe](./assets/projects/04_webgl_globe.png)](http://data-arts.appspot.com/globe)
[![Androidify](./assets/projects/03_androidify.png)](http://www.androidify.com/)
[![The Wilderness Downtown](./assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)
[![Linechart](./assets/projects/00_linechart.png)](http://dejavis.org/linechart)

### Usage ###

Download the [minified library](https://github.com/sole/tween.js/raw/master/build/tween.min.js) and include it in your html.

```html
<script src="js/tween.min.js"></script>
```

The following code creates a Tween which will change the `x` attribute in a position variable, so that it goes from 50 to 400 in 2 seconds. The anonymous function set up with an interval will update the screen so that we can see something happening:

```html
<script>

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
				output.style.left = this.x + 'px';

			} )
			.start();

	}

	function animate() {

		requestAnimationFrame( animate ); // js/RequestAnimationFrame.js needs to be included too.
		TWEEN.update();

	}

</script>
```

Note: this corresponds to the example [04_simplest.html](./examples/04_simplest.html) that you can find in the ```examples``` folder.

Have a look at that folder to discover more functionalities of the library!

Also, Jerome Etienne has written a [tutorial](http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/) demonstrating how to use tween.js with three.js, and it's also great for understanding how tweens work!

Finally, if you need to use tweens in C/C++ code, you now have an option! Check out [libtween](https://github.com/jsm174/libtween) which is a port of tween.js to C by [jsm174](https://github.com/jsm174)!

### FAQ ###

**How do you set a tween to start after a while?**

Use the `delay()` method: `var t = new TWEEN.Tween({...}).delay(1000);`

**Is there a jQuery plug-in?**

No, we like to keep it simple and free of dependencies. Feel free to make one yourself, though! :-)

### Change log ###

2013 09 xx - **r12**

* Use tweens in C/C++ with [libtween](https://github.com/jsm174/libtween) by [jsm174](https://github.com/jsm174)!
* Fix bug with cached ```tweens.length``` value inside ```update()``` loop ([freestlr](https://github.com/freestlr))
* Move assets and all examples and stuff to use the ```gh-pages``` branch, so things are always properly updated ([sole](https://github.com/sole)).

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
