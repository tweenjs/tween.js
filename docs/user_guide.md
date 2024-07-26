# tween.js user guide

More languages: [English](./user_guide.md), [简体中文](./user_guide_zh-CN.md)

_**NOTE** This is a work in progress. If you find that something is unclear or missing details, please [file an issue](https://github.com/tweenjs/tween.js/issues/new) and help make this guide better. Or feel free to submit clarifications or improvements of your own if you feel you can help too!_

## What is a tween? How do they work? Why do you want to use them?

A tween (from [_in-between_](http://en.wikipedia.org/wiki/Inbetweening)) is a concept that allows you to change the values of the properties of an object in a smooth way. You just tell it which properties you want to change, which final values should they have when the tween finishes running, and how long should this take, and the tweening engine will take care of finding the intermediate values from the starting to the ending point.

For example, suppose you have a `position` object with `x` and `y` coordinates:

```javascript
const position = {x: 100, y: 0}
```

If you wanted to change the `x` value from `100` to `200`, you'd do this:

```javascript
import {Tween} from '@tweenjs/tween.js'

// Create a tween for position first
const tween = new Tween(position)

// Then tell the tween we want to animate the x property over 1000 milliseconds
tween.to({x: 200}, 1000)
```

Actually this won't do anything yet. The tween has been created but it's not active. You need to start it:

```javascript
// And set it to start
tween.start()
```

Finally in order to run as smoothly as possible you should call the `tween.update()` function in the same main loop you're using for animating. This generally looks like this:

```javascript
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	tween.update()
	// [...]
}
```

After 1 second (i.e. 1000 milliseconds) `position.x` will be `200`.

But unless you print the value of `x` to the console, you can't see its value changing. You might want to use the `onUpdate` callback:

```javascript
tween.onUpdate(function (object) {
	console.log(object.x)
})
```

This function will be called each time the tween is updated; how often this happens depends on many factors--how fast (and how busy!) your computer or device is, for example.

So far we've only used tweens to print values to the console, but you could use it for things such as animating positions of three.js objects:

```javascript
const tween = new Tween(cube.position).to({x: 100, y: 100, z: 100}, 10000).start()

animate()

function animate() {
	requestAnimationFrame(animate)
	tween.update()

	threeRenderer.render(scene, camera)
}
```

In this case, because the three.js renderer will look at the object's position before rendering, you don't need to use an explicit `onUpdate` callback.

You might have noticed something different here too: we're chaining the tween function calls! Each tween function returns the tween instance, so you can rewrite the following code:

```javascript
const tween = new Tween(position)
tween.to({x: 200}, 1000)
tween.start()
```

into this

```javascript
const tween = new Tween(position).to({x: 200}, 1000).start()
```

You'll see this a lot in the examples, so it's good to be familiar with it! Check [04-simplest](../examples/04_simplest.html) for a working example.

## Animating with tween.js

Tween.js doesn't run by itself. You need to tell it when to run, by explicitly calling the `update` method of each tween, or the `update` method of a `Group` that has multiple tweens (more on Groups below). The recommended method is to do this inside your main animation loop, which should be called with `requestAnimationFrame` for getting the best graphics performance:

We've seen this example before:

```javascript
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	tween.update()
	// [...]
}
```

If called without parameters, `update` will determine the current time in order to find out how long has it been since the last time it ran.

However you can also pass an explicit time parameter to `update`. Thus,

```javascript
tween.update(100)
```

means "update with time = 100 milliseconds". You can use this to make sure that all the time-dependent functions in your code are using the very same time value. For example, suppose you've got a player and want to run tweens in sync. Your `animate` code could look like this:

```javascript
let currentTime = player.currentTime
tween.update(currentTime)
```

We use explicit time values for the unit tests. You can have a look at [tests.ts](../src/tests.ts) to see how we call `tween.update()` with different values in order to simulate time passing.

## Controlling a tween

### `start` and `stop`

So far we've learnt about the `Tween.start` method, but there are more methods that control individual tweens. Probably the most important one is the `start` counterpart: `stop`. If you want to cancel a tween, just call this method over an individual tween:

```js
tween.stop()
```

Stopping a tween that was never started or that has already been stopped has no effect. No errors are thrown either.

The `start` method also accepts a `time` argument. If you use it, the tween won't start until that particular moment in time; otherwise it will start as soon as possible (i.e. on the next call to `tween.update()`).

The `start` method accepts a second boolean argument: when `true`, a tween that we previously used will start from the values in the target object, instead of starting from the beginning. Useful for stopping a tween, then starting another one that will continue from the current location.

### `startFromCurrentValues`

This is an alias for `tween.start(undefined, true)`, to make a previously-used
tween start from the last values of the target object, instead of from the
beginning.

### `update`

Individual tweens have an `update` method to so that they can be updated over time in an animation loop, and on each update they will apply updated values to their target object.

```js
const tween = new Tween(someObject).to(/*...*/).start()

function animate(time) {
	tween.update(time)
	requestAnimationFrame(animate)
}
```

### `pause`

While an tween is running (i.e. it has already been `start`ed and may have
already been `update`d numerous times) it can be paused. Even if `update()` is
called while the tween is paused, its time will not move forward. `isPlaying`
will still be true while a tween is `paused` and its `update()` method continues
to track time progression (you can continue to call `update()` while a tween is
paused).

```js
tween.start()

function animate() {
	tween.update()
	requestAnimationFrame(animate)
}
animate()

// at any time while the tween is running
tween.pause()
```

### `chain`

Things get more interesting when you sequence different tweens in order, i.e. setup one tween to start once a previous one has finished. We call this _chaining tweens_, and it's done with the `chain` method. Thus, to make `tweenB` start after `tweenA` finishes:

```javascript
tweenA.chain(tweenB)
```

Or, for an infinite chain, set `tweenA` to start once `tweenB` finishes:

```javascript
tweenA.chain(tweenB)
tweenB.chain(tweenA)
```

Check [Hello world](../examples/00_hello_world.html) to see an example of these infinite chains.

In other cases, you may want to chain multiple tweens to another tween in a way that they (the chained tweens) all start animating at the same time:

```javascript
tweenA.chain(tweenB, tweenC)
```

> **Warning** Calling `tweenA.chain(tweenB)` actually modifies tweenA so that tweenB is always started when tweenA finishes. The return value of `chain` is just tweenA, not a new tween.

### `repeat`

If you wanted a tween to repeat forever you could chain it to itself, but a better way is to use the `repeat` method. It accepts a parameter that describes how many repetitions you want after the first tween is completed:

```javascript
tween.repeat(10) // repeats 10 times after the first tween and stops
tween.repeat(Infinity) // repeats forever
```

The total number of tweens will be the repeat parameter plus one for the initial tween.
Check the [Repeat](../examples/08_repeat.html) example.

### `yoyo`

This function only has effect if used along with `repeat`. When active, the behaviour of the tween will be _like a yoyo_, i.e. it will bounce to and from the start and end values, instead of just repeating the same sequence from the beginning:

```js
tween.yoyo(false) // default value, animation will only go from start to end value
tween.yoyo(true) // tween will 'yoyo' between start and end values
```

### `delay`

More complex arrangements might require delaying a tween before it actually starts running. You can do that using the `delay` method:

```javascript
tween.delay(1000)
tween.start()
```

will start executing 1 second after the `start` method has been called.

### `repeatDelay`

Normally the `delay` time is applied between repetitions of a tween, but if a value is provided to the `repeatDelay` function then that value will determine the total time elapsed between repetitions of a tween.

Consider this example:

```javascript
tween.delay(1000)
tween.repeatDelay(500)
tween.start()
```

The first iteration of the tween will happen after one second, the second iteration will happen a half second after the first iteration ends, the third iteration will happen a half second after the second iteration ends, etc. If you want to delay the initial iteration but you don't want any delay between iterations, then make sure to call `tween.repeatDelay(0)`.

### `dynamic`

If `dynamic` is set to `true` (it defaults to `false`) objects passed to `tween.to()` can be modified on the outside of a tween while the tween is animating. This can be used to dynamically modify the outcome of a tween while it is running.

See the [Dynamic to](http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html) example. In that example, in both scenes, the position of the rabbit is updated during the animation. The rabbit position happens to be the object passed into the fox's `tween.to()` method. As the rabbit position is updated, in the first scene with `.dynamic(false)` the fox moves towards the initial position of the rabbit and does not chase the rabbit, and in the second scene with `.dynamic(true)` the final destination of the fox is hence also updated which makes the fox chase the rabbit.

See the other `dynamic to` examples for more ideas.

> **Warning** When `dynamic` is set to `false`, Tween makes a copy of the object passed into `tween.to()` and will never modify it (hence updating the original object from the outside is not dynamic). When `dynamic` is `true`, Tween uses the original object as the source of values during animation (every update reads the values, hence they can be modified dynamically) but note that **in dynamic mode, Tween will modify any interpolation arrays of the object passed into `tween.to()` which may cause side-effects on any external code that may also rely on the same object**.

## Controlling groups of tweens

Sometimes you want to update multiple tweens at once, which can be useful when
grouping a set of tweens into a logical component in your application. You can
do this with a `Group`.

First add multiple tweens to a group:

```js
import {Group, Tween} from '@tweenjs/tween.js'

const tween1 = new Tween(obj1).to(...).start()
const tween2 = new Tween(obj2).to(...).start()

const group = new Group()
group.add(tween1)
group.add(tween2)
```

Then call `group.update()` in your animation loop instead of on individual
tweens:

```js
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	group.update()
	// [...]
}
```

Note that a tween can only belong to a single group. Adding a tween to a group
automatically removes it from any previous group.

### `group.getAll()`

Returns an array of all tweens added to a group.

### `group.add(tween)`

Add a tween to a group.

### `group.remove(tween)`

Remove a tween from a group.

### `group.removeAll()`

Remove all tween from a group.

### `group.update(time?)`

Update all tweens in a group, with an optional time value. If time value is not
supplied, it default to the current time.

## Changing the easing function (AKA make it bouncy)

Tween.js will perform the interpolation between values (i.e. the easing) in a linear manner, so the change will be directly proportional to the elapsed time. This is predictable but also quite uninteresting visually wise. Worry not--this behaviour can be easily changed using the `easing` method. For example:

```javascript
import {Tween, Easing} from '@tweenjs/tween.js'
// ...
tween.easing(Easing.Quadratic.In)
```

This will result in the tween slowly starting to change towards the final value, accelerating towards the middle, and then quickly reaching its final value. In contrast, `Easing.Quadratic.Out` would start changing quickly towards the value, but then slow down as it approaches the final value.

### Available `Easing` functions

There are a few existing easing functions provided with tween.js. They are grouped by the type of equation they represent: Linear, Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back and Bounce, and then by the easing type: In, Out and InOut.

Probably the names won't be saying anything to you unless you're familiar with these concepts already, so it is probably the time to check the [Graphs](../examples/03_graphs.html) example, which graphs all the curves in one page so you can compare how they look at a glance.

`Easing` also has a function called `generatePow()`. This function generates easing functions for different curves depending on arguments. You can check the relevance of the arguments to curves in the [example of pow easing](../examples/17_generate_pow.html) page.

_Credit where credit is due:_ these functions are derived from the original set of equations that Robert Penner graciously made available as free software a few years ago, but have been optimised to play nicely with JavaScript.

### Using a custom easing function

Not only can you use any of the existing functions, but you can also provide your own, as long as it follows a couple of conventions:

- it must accept one parameter:
  - `k`: the easing progress, or how far along the duration of the tween we are. Allowed values are in the range [0, 1].
- it must return a value based on the input parameters.

The easing function is only called _once per tween_ on each update, no matter how many properties are to be changed. The result is then used with the initial value and the difference (the _deltas_) between this and the final values, as in this pseudocode:

```
easedElapsed = easing(k);
for each property:
    newPropertyValue = initialPropertyValue + propertyDelta * easedElapsed;
```

For the performance-obsessed people out there: the deltas are calculated only when `start()` is called on a tween.

So let's suppose you wanted to use a custom easing function that eased the values but applied a Math.floor to the output, so only the integer part would be returned, resulting in a sort of step-ladder output:

```javascript
function tenStepEasing(k) {
	return Math.floor(k * 10) / 10
}
```

And you could use it in a tween by simply calling its easing method, as we've seen before:

```javascript
tween.easing(tenStepEasing)
```

Check the [graphs for custom easing functions](../examples/12_graphs_custom_functions.html) example to see this in action (and also some _metaprogramming_ for generating step functions).

## Callbacks

Another powerful feature is to be able to run your own functions at specific times in each tween's life cycle. This is usually required when changing properties is not enough.

For example, suppose you're trying to animate some object whose properties can't be accessed directly but require you to call a setter instead. You can use an `update` callback to read the new updated values and then manually call the setters. All callbacks are passed the tweened object as the only parameter.

```javascript
const trickyObjTween = new Tween({
	propertyA: trickyObj.getPropertyA(),
	propertyB: trickyObj.getPropertyB(),
})
	.to({propertyA: 100, propertyB: 200})
	.onUpdate(function (object) {
		object.setA(object.propertyA)
		object.setB(object.propertyB)
	})
```

Or imagine you want to play a sound when a tween is started. You can use a `start` callback:

```javascript
const tween = new Tween(obj).to({x: 100}).onStart(function () {
	sound.play()
})
```

The scope for each callback is the tweened object--in this case, `obj`.

### onStart

Executed right before the tween starts animating, after any delay time specified by the `delay` method. This will be executed only once per tween, i.e. it will _not_ be run when the tween is repeated via `repeat()`.

It is great for synchronising to other events or triggering actions you want to happen when a tween starts.

The tweened object is passed in as the first parameter.

### onEveryStart

As per `onStart`, except that it _will_ be run on every repeat of the tween.

The tweened object is passed in as the first parameter.

### onStop

Executed when a tween is explicitly stopped via `stop()`, but not when it is completed normally, and before stopping any possible chained tween.

The tweened object is passed in as the first parameter.

### onUpdate

Executed each time the tween is updated, after the values have been actually updated.

The tweened object is passed in as the first parameter.

### onComplete

Executed when a tween is finished normally (i.e. not stopped).

The tweened object is passed in as the first parameter.

### onRepeat

Executed whenever a tween has just finished one repetition and will begin another.

The tweened object is passed in as the first parameter.

To clarify when `onStart`, `onEveryStart` and `onRepeat` are called, consider:

```javascript
const obj = {x: 0}

const t = new Tween(obj)
	.to({x: 5}, 5)
	.repeat(Infinity)
	.onStart(() => {
		console.log('onStart')
	})
	.onRepeat(() => {
		console.log('onRepeat')
	})
	.onEveryStart(() => {
		console.log('onEveryStart')
	})
	.start(0)

for (let ticks = 0; ticks < 22; ticks += 1) {
	console.log('Tick', ticks)
	t.update(ticks)

	console.log(obj)
	console.log()
}
```

The output would look like this, on the left as above, and on the right with `.delay(5)`:

```
Tick 0           Tick 0
onStart          { x: 0 }
onEveryStart
{ x: 0 }

Tick 1           Tick 1
{ x: 1 }         { x: 0 }

Tick 2           Tick 2
{ x: 2 }         { x: 0 }

Tick 3           Tick 3
{ x: 3 }         { x: 0 }

Tick 4           Tick 4
{ x: 4 }         { x: 0 }

Tick 5           Tick 5
onRepeat         onStart
{ x: 5 }         onEveryStart
                 { x: 0 }

Tick 6           Tick 6
onEveryStart     { x: 1 }
{ x: 1 }

Tick 7           Tick 7
{ x: 2 }         { x: 2 }

Tick 8           Tick 8
{ x: 3 }         { x: 3 }

Tick 9           Tick 9
{ x: 4 }         { x: 4 }

Tick 10          Tick 10
onRepeat         onRepeat
{ x: 5 }         { x: 5 }

Tick 11          Tick 11
onEveryStart     { x: 5 }
{ x: 1 }

Tick 12          Tick 12
{ x: 2 }         { x: 5 }

Tick 13          Tick 13
{ x: 3 }         { x: 5 }

Tick 14          Tick 14
{ x: 4 }         { x: 5 }

Tick 15          Tick 15
onRepeat         onEveryStart
{ x: 5 }         { x: 0 }

Tick 16          Tick 16
onEveryStart     { x: 1 }
{ x: 1 }

Tick 17          Tick 17
{ x: 2 }         { x: 2 }

Tick 18          Tick 18
{ x: 3 }         { x: 3 }

Tick 19          Tick 19
{ x: 4 }         { x: 4 }

Tick 20          Tick 20
onRepeat         onRepeat
{ x: 5 }         { x: 5 }

Tick 21          Tick 21
onEveryStart     { x: 5 }
{ x: 1 }
```

## Tween State

### `isPlaying`

`tween.isPlaying` is `true` when a tween is started, even if it is paused.

When a tween is stopped, `isPlaying` and `isPaused` will both be `false`, so `!tween.isPlaying()` can be used to detect if a tween is stopped (regardless if the tween has completed).

### `isPaused`

`tween.isPaused` is `true` when a tween is paused. `isPlaying` will also be `true`. If a tween is started, but not paused, `isPlaying` will be `true` and `isPaused` will be `false`.

## Advanced tweening

### Relative values

You can also use relative values when using the `to` method. When the tween is started, Tween.js will read the current property values and apply the relative values to find out the new final values. But **you need to use quotes** or the values will be taken as absolute. Let's see this with an example:

```javascript
// This will make the `x` property be 100, always
const absoluteTween = new Tween(absoluteObj).to({x: 100})

// Suppose absoluteObj.x is 0 now
absoluteTween.start() // Makes x go to 100

// Suppose absoluteObj.x is -100 now
absoluteTween.start() // Makes x go to 100

// In contrast...

// This will make the `x` property be 100 units more,
// relative to the actual value when it starts
const relativeTween = new Tween(relativeObj).to({x: '+100'})

// Suppose relativeObj.x is 0 now
relativeTween.start() // Makes x go to 0 +100 = 100

// Suppose relativeObj.x is -100 now
relativeTween.start() // Makes x go to -100 +100 = 0
```

Check [09_relative_values](../examples/09_relative_values.html) for an example.

### Tweening nested objects

Tween.js can also change properties across nested objects. For example:

```javascript
const nestedObject = {scale: {x: 0, y: 0}, alpha: 0}
const tween = new Tween(nestedObject).to({scale: {x: 100, y: 100}, alpha: 1})
```

### Tweening to arrays of values

In addition to tweening to an absolute or a relative value, you can also have Tween.js change properties across a series of values. To do this, you just need to specify an array of values instead of a single value for a property. For example:

```javascript
const tween = new Tween(relativeObj).to({x: [0, -100, 100]})
```

will make `x` go from its initial value to 0, -100 and 100.

The way these values are calculated is as follows:

- first the tween progress is calculated as usual
- the progress (from 0 to 1) is used as input for the interpolation function
- based on the progress and the array of values, an interpolated value is generated

For example, when the tween has just started (progress is 0), the interpolation function will return the first value in the array. When the tween is halfway, the interpolation function will return a value approximately in the middle of the array, and when the tween is at the end, the interpolation function will return the last value.

You can change the interpolation mode by passing an `Interpolation` function
into the `tween.interpolation` method. For example:

```javascript
import {Interpolation} from '@tweenjs/tween.js'
// ...
tween.interpolation(Interpolation.Bezier)
```

The following values are available:

- `Interpolation.Linear`
- `Interpolation.Bezier`
- `Interpolation.CatmullRom`

The default is `Linear`.

Note that the interpolation function is global to all properties that are tweened with arrays in the same tween. You can't make property A change with an array and a Linear function, and property B with an array too and a Bezier function using the same tween; you should use two tween objects running over the same object but modifying different properties and using different interpolation functions.

Check [06_array_interpolation](../examples/06_array_interpolation.html) for an example.

## Getting the best performance

While Tween.js tries to be performant on its own, nothing prevents you from using it in a way that is counterperformant. Here are some of the ways you can avoid slowing down your projects when using Tween.js (or when animating in the web, in general).

### Use performant CSS

When you try to animate the position of an element in the page, the easiest solution is to animate the `top` and `left` style properties, like this:

```javascript
const element = document.getElementById('myElement')
const tween = new Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.top = object.top + 'px'
	element.style.left = object.left + 'px'
})
```

but this is really inefficient because altering these properties forces the browser to recalculate the layout on each update, and this is a very costly operation. Instead of using these, you should use `transform`, which doesn't invalidate the layout and will also be hardware accelerated when possible, like this:

```javascript
const element = document.getElementById('myElement')
const tween = new Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.transform = 'translate(' + object.left + 'px, ' + object.top + 'px)'
})
```

If you want to read more about this, have a look at [this article](http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/).

However, if your animation needs are _that_ simple, it might be better to just use CSS animations or transitions, where applicable, so that the browser can optimise as much as possible. Tween.js is most useful when your animation needs involve complex arrangements, i.e. you need to sync several tweens together, have some start after one has finished, loop them a number of times, have graphics that are not rendered with CSS but with Canvas or WebGL, etc.

### Be good to the Garbage collector (alias the GC)

If you use an `onUpdate` callback, you need to be very careful with what you put on it. This function will be called many times per second, so if you're doing costly operations on each update, you might block the main thread and cause horrible _jank_, or---if your operations involve memory allocations, you'll end up getting the garbage collector to run too often, and cause _jank_ too. So just don't do either of those things. Keep your `onUpdate` callbacks very lightweight, and be sure to also use a memory profiler while you're developing.

## Crazy tweening

This is something you might not use often, but you can use the tweening equations outside of Tween.js. They're just functions, after all. So you could use them to calculate smooth curves as input data. For example, they're used to generate audio data in [this experiment](http://5013.es/toys/tween.audio/).
