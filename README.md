tween.js
========

### Javascript Tweening Engine ###

[![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/thing/45014/tween-js)

Super simple, fast and easy to use tweening engine which incorporates optimised Robert Penner's equations.

We are still developing this so the API might change from commit to commit.

## Examples ##

[![Tween autostart](http://sole.github.com/tween.js/assets/examples/07_autostart.png)](http://sole.github.com/tween.js/examples/07_autostart.html)
[![Video and time](http://sole.github.com/tween.js/assets/examples/06_video_and_time.png)](http://sole.github.com/tween.js/examples/06_video_and_time.html)
[![Spline](http://sole.github.com/tween.js/assets/examples/05_spline.png)](http://sole.github.com/tween.js/examples/05_spline.html)
[![Simplest possible example](http://sole.github.com/tween.js/assets/examples/04_simplest.png)](http://sole.github.com/tween.js/examples/04_simplest.html)
[![Graphs](http://sole.github.com/tween.js/assets/examples/03_graphs.png)](http://sole.github.com/tween.js/examples/03_graphs.html)
[![Black and red](http://sole.github.com/tween.js/assets/examples/02_black_and_red.png)](http://sole.github.com/tween.js/examples/02_black_and_red.html)
[![Bars](http://sole.github.com/tween.js/assets/examples/01_bars.png)](http://sole.github.com/tween.js/examples/01_bars.html)
[![hello world](http://sole.github.com/tween.js/assets/examples/00_hello_world.png)](http://sole.github.com/tween.js/examples/00_hello_world.html)

## Projects using tween.js ##

[![Minesweeper 3D](http://sole.github.com/tween.js/assets/projects/06_minesweeper3d.png)](http://egraether.com/mine3d/)
[![ROME](http://sole.github.com/tween.js/assets/projects/05_rome.png)](http://ro.me)
[![WebGL Globe](http://sole.github.com/tween.js/assets/projects/04_webgl_globe.png)](http://data-arts.appspot.com/globe)
[![Androidify](http://sole.github.com/tween.js/assets/projects/03_androidify.png)](http://www.androidify.com/)
[![Floweroscope](http://sole.github.com/tween.js/assets/projects/02_floweroscope.png)](http://www.floweroscope.com/)
[![The Wilderness Downtown](http://sole.github.com/tween.js/assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)
[![Linechart](http://sole.github.com/tween.js/assets/projects/00_linechart.png)](http://dejavis.org/linechart)

## Usage ##

Download the [minified library](http://github.com/sole/tween.js/raw/master/build/Tween.js) and include it in your html.

```html
<script type="text/javascript" src="js/Tween.js"></script>
```

The following code creates a Tween which will change the `x` attribute in a position variable, so that it goes from 50 to 400 in 2 seconds. The anonymous function set up with an interval will update the screen so that we can see something happening:

```html
<script type="text/javascript">

	TWEEN.start();

	var output = document.createElement('div');
	var target = document.getElementById('target');
	target.appendChild(output);

	var position = {x: 50, y: 0};
	var tween = new TWEEN.Tween(position).to({x: 400}, 2000).onUpdate(update).start();

	function update() {

		var newX = position.x;

		output.innerHTML = 'x == ' + Math.round(newX);
		target.style.left = (newX) + 'px';

	};

</script>
```

Note: this corresponds to the example [04_simplest.html](http://sole.github.com/tween.js/examples/04_simplest.html) that you can find in the ```examples``` folder.

Have a look at that folder to discover more functionalities of the library!

Also, Jerome Etienne has written a [tutorial](http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/) demonstrating how to use tween.js with three.js, and it's also great for understanding how tweens work!

## Frequently Asked Questions (FAQ) ##

**Is there a way to control when is update() called? I'd like to use my own interval.**

Yes, simply don't call `TWEEN.start()`, and run `TWEEN.update()` in your own periodically executing function instead.
	
**How do you set a tween to start after a while?**

Use the `delay()` method: `var t = new Tween({...}).delay(1000);`

**Is there a jQuery plug-in?**

No, we like to keep it simple and free of dependencies. Feel free to make one yourself, though! :-)


## Change log ##

2011 10 15 - **r5**

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

## Contributors ##

People who have contributed directly or indirectly to this project :-D

[sole](http://soledadpenades.com), [mrdoob](http://mrdoob.com), [Robert Eisele](http://www.xarg.org/), [Robert Penner](http://www.robertpenner.com/), [Philippe Elsass](http://philippe.elsass.me), [Paul Lewis](http://www.aerotwist.com/), Lechecacharro
