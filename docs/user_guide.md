# tween.js user guide

_**NOTE** this is a work in progress, please excuse the gaps. Wherever you see something marked as TODO, it's not done yet._

## What is a tween? How do they work? Why do you want to use them?

A tween (TODO: from _in-between_?) is a concept that allows you to change the values of the properties of an object in a smooth way. You just tell it which properties you want to change, which final values should they have when the tween finishes running, and how long should this take. For example, suppose you have a `position` object with `x` and `y` coordinates:

````javascript
var position = { x: 100, y: 0 }
````

If you wanted to change the `x` value from `100` to `200` you'd do this:

````javascript
// Create a tween for position first
var tween = new TWEEN.Tween(position);

// Then tell the tween we want to animate the x property over 1000 milliseconds
tween.to({ x: 200 }, 1000);
````

Actually this won't do anything yet. The tween has been created but it's not active. You need to start it:

````javascript
// And set it to start
tween.start();
````

Finally in order to run as smoothly as possible you should call the `TWEEN.update` function in the same main loop you're using for animating. This generally looks like this:

````javascript
animate();

function animate() {
	requestAnimationFrame(animate);
	// [...]
	TWEEN.update();
	// [...]
}
````

This will take care of updating all active tweens; after 1 second (i.e. 1000 milliseconds) `position.x` will be `200`.

But unless you print the value of `x` to the console, you can't see its value changing. You might want to use the `onUpdate` callback:

````javascript
tween.onUpdate(function() {
	console.log(this.x);
});
````

This function will be called each time the tween is updated; how often this happens depends on many factors--how fast (and how busy!) your computer or device is, for example.

So far we've only used tweens to print values to the console, but you could use it for things such as animating positions of three.js objects:

````javascript
var tween = new TWEEN.Tween(cube.position);
		.to({ x: 100, y: 100, z: 100 }, 10000)
		.start();

animate();

function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();

	threeRenderer.render(scene, camera);
}
````

In this case, because the three.js renderer will look at the object's position before rendering, you don't need to use an explicit `onUpdate` callback.

You might have noticed something different here too: we're chaining the tween function calls! Each tween function returns the tween instance, so you can rewrite the following code:

````javascript
var tween = new TWEEN.Tween(position);
tween.to({ x: 200 }, 1000);
tween.start();
````

into this

````javascript
var tween = new TWEEN.Tween(position)
	.to({ x: 200 }, 1000)
	.start();
````

You'll see this a lot in the examples, so it's good to be familiar with it! Check [04-simplest](./examples/04_simplest.html) for a working example.

## Animating with tween.js

Tween.js doesn't run by itself. You need to tell it when to run, by explicitly calling the `update` method. The recommended method is to do this inside your main animation loop, which should be called with `requestAnimationFrame` for getting the best graphics performance:

We've seen this example before:

````javascript
animate();

function animate() {
	requestAnimationFrame(animate);
	// [...]
	TWEEN.update();
	// [...]
}
````

If called without parameters, `update` will determine the current time in order to find out how long has it been since the last time it ran.

However you can also pass an explicit time parameter to `update`. Thus,

````javascript
TWEEN.update(100);
````

means "update with time = 100 milliseconds". You can use this to make sure that all the time-dependent functions in your code are using the very same time value. For example suppose you've got a player and want to run tweens in sync. Your `animate` code could look like this:

````javascript
var currentTime = player.currentTime;
TWEEN.update(currentTime);
````

We use explicit time values for the unit tests. You can have a look at [TestTweens](../test/unit/TestTweens.js) to see how we call TWEEN.update() with different values in order to simulate time passing.

## Controlling a tween

### `start` and `stop`
So far we've learnt about the `Tween.start` method, but there are more methods that control individual tweens. Probably the most important one is the `start` counterpart: `stop`. If you want to cancel a tween, just call this method over an individual tween:

````
tween.stop();
````

Stopping a tween that was never started or that has already been stopped has no effect. No errors are thrown either.

### `update`

Individual tweens also have an `update` method---this is in fact called by `TWEEN.update`. You generally don't need to call this directly, but might be useful if you're doing _crazy hacks_.

### `chain`

Things get more interesting when you sequence different tweens in order, i.e. setup one tween to start once a previous one has finished. We call this _chaining tweens_, and it's done with the `chain` method. Thus, to make `tweenB` start after `tweenA` finishes:

````javascript
tweenA.chain(tweenB);
````

Or, for an infinite chain, set `tweenA` to start once `tweenB` finishes:

````javascript
tweenA.chain(tweenB);
tweenB.chain(tweenA);
````

Check [Hello world](../examples/00_hello_world.html) to see an example of these infinite chains.
### `repeat`

If you wanted a tween to repeat forever you could chain it to itself, but a better way is to use the `repeat` method. It accepts a parameter that describes how many repetitions you want:

````javascript
tween.repeat(10); // repeats 10 times and stops
tween.repeat(Infinity); // repeats forever
````

Check the [Repeat](../examples/08_repeat.html) example.

### `yoyo`

This function only has effect if used along with `repeat`. When active, the behaviour of the tween will be _like a yoyo_, i.e. it will bounce to and from the start and end values, instead of just repeating the same sequence from the beginning.

### `delay`

More complex arrangements might require delaying a tween before it actually starts running. You can do that using the `delay` method:

````javascript
tween.delay(1000);
tween.start();
````

will start executing 1 second after the `start` method has been called.

TODO: Also: controlling all the tweens

- getAll, updateAll, ...

## Changing the tween function (AKA make it bouncy)

Choose from existing
Or define own
tween function signature


## Chaining

## Repeating

## Callbacks

- start
- stop
- update
- complete

## Advanced tweening

- relative values
- arrays - and which interpolation function? (linear, bezier, catmull-rom)

## Getting the best performance

- CSS properties which shouldn't be used (e.g. marginLeft? use transform instead?)
	- or use animations/transitions instead
	- When to use tween -> for more complex arrangements
- Be good to the GC
- Reusing tweens

## Crazy tweening

- Using the tweening functions outside of tween.js
