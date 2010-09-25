Tween.js
========

#### Javascript Tweening Engine ####

[![Flattr this](http://api.flattr.com/button/button-compact-static-100x17.png)](https://flattr.com/thing/45014/tween-js)

Super simple, fast and easy to use engine which incorporates Robert Penner's easing equations (and Philippe Elsass's optimised equations from his AS3 Eaze library).

We are still developing this so the API might probably change from commit to commit.

### Examples ###

[![hello world](http://sole.github.com/tween.js/assets/examples/00_hello_world.png)](http://sole.github.com/tween.js/examples/00_hello_world.html)
[![Bars](http://sole.github.com/tween.js/assets/examples/01_bars.png)](http://sole.github.com/tween.js/examples/01_bars.html)
[![Black and red](http://sole.github.com/tween.js/assets/examples/02_black_and_red.png)](http://sole.github.com/tween.js/examples/02_black_and_red.html)
[![Graphs](http://sole.github.com/tween.js/assets/examples/03_graphs.png)](http://sole.github.com/tween.js/examples/03_graphs.html)

### Projects using tween.js ###

[![Linechart](http://github.com/sole/sole.github.com/raw/master/tween.js/assets/projects/00_linechart.png)](http://dejavis.org/linechart)
[![The Wilderness Downtown](http://github.com/sole/sole.github.com/raw/master/tween.js/assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)

### Usage ###

Download the [minified library](http://github.com/sole/tween.js/raw/master/build/Tween.js) and include it in your html.

	<script type="text/javascript" src="js/Tween.js"></script>

The following code creates a Tween which will change the 'x' attribute in a position variable, so that it goes from 50 to 400 in 2 seconds. The anonymous function set up with an interval will update the screen so that we can see something happening:

	<script type="text/javascript">
		var position = { x: 50, y: 0 };
		var tween = new TWEEN.Tween(position).to(2, {x: 400}).start();
		var output = document.createElement('div');
		var target = document.getElementById('target');
		target.appendChild(output);
	
		setInterval(function() {
			TWEEN_MANAGER.update();
		
			var newX = position.x;
			
			output.innerHTML = 'x == ' + Math.round(newX);
			target.style.left = ( newX ) + 'px';
			
		}, 1000 / 60);
	</script>

Note: this corresponds to the example 04_simplest.html that you can find in the examples folder.

Have a look at that folder to discover more functionalities of the library!

### Contributors ###

People who have contributed directly or indirectly to this project :-D

[sole](http://soledadpenades.com), [mrdoob](http://mrdoob.com), [Robert Penner](http://www.robertpenner.com/), [Philippe Elsass](http://philippe.elsass.me)
