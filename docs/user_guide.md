# tween.js user guide

_**NOTE** this is a work in progress, please excuse the gaps._

## What is a tween? How do they work? Why do you want to use them?

Tween objects, and only the specified properties.

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
- Be good to the GC
- Reusing tweens

## Crazy tweening

- Using the tweening functions outside of tween.js
