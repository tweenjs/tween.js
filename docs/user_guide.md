# tween.js user guide

_**NOTE** this is a work in progress, please excuse the gaps._

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

You'll see this a lot in the examples, so it's good to be familiar with it!

## Animating with tween.js

requestAnimationFrame
TWEEN.update()

## Controlling a tween

- start
- stop
- update(t)
- delay
- yoyo

Also: controlling all the tweens

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
