# tween.js 用户指南

更多语言: [English](./user_guide.md), [简体中文](./user_guide_zh-CN.md)

_**注意** 这是正在进行的工作。如果你发现某些内容不清楚或缺少详细信息，请[提出 issue](https://github.com/tweenjs/tween.js/issues/new)并帮助改进本指南。如果你觉得你也能提供帮助，也可以随时提交你自己的说明或改进！_

## 什么是补间？它们是如何工作的？为什么要使用它们？

补间（来自[_中间帧_](http://en.wikipedia.org/wiki/Inbetweening)）是一个概念，允许你以平滑的方式更改对象的属性值。你只需告诉它你想要更改哪些属性，当补间完成运行时它们应该具有什么最终值，以及这应该花费多长时间，补间引擎将负责找到从开始点到结束点的中间值。

例如，假设你有一个具有 `x` 和 `y` 坐标的 `position` 对象：

```javascript
const position = {x: 100, y: 0}
```

如果你想将 `x` 值从 `100` 更改为 `200`，你可以这样做：

```javascript
import {Tween} from '@tweenjs/tween.js'

// 首先为 position 创建一个补间
const tween = new Tween(position)

// 然后告诉补间我们想要在 1000 毫秒内对 x 属性进行动画处理
tween.to({x: 200}, 1000)
```

实际上这还不会做任何事情。补间已经创建，但它不是活动的。你需要启动它：

```javascript
// 并将其设置为开始
tween.start()
```

最后，为了尽可能平稳地运行，你应该在用于动画的同一主循环中调用 `tween.update()` 函数。这通常看起来像这样：

```javascript
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	tween.update()
	// [...]
}
```

1 秒后（即 1000 毫秒），`position.x` 将为 `200`。

但除非你将 `x` 的值打印到控制台，否则你看不到它的值变化。你可能想要使用 `onUpdate` 回调：

```javascript
tween.onUpdate(function (object) {
	console.log(object.x)
})
```

每次更新补间时都会调用此函数；这种情况发生的频率取决于许多因素——例如，你的计算机或设备有多快（以及有多忙！）。

到目前为止，我们只使用补间将值打印到控制台，但你可以将其用于诸如对 three.js 对象的位置进行动画处理之类的事情：

```javascript
const tween = new Tween(cube.position).to({x: 100, y: 100, z: 100}, 10000).start()

animate()

function animate() {
	requestAnimationFrame(animate)
	tween.update()

	threeRenderer.render(scene, camera)
}
```

在这种情况下，由于 three.js 渲染器将在渲染前查看对象的位置，你不需要使用显式的 `onUpdate` 回调。

你可能也注意到这里有些不同：我们在链式调用补间函数！每个补间函数都返回补间实例，所以你可以将以下代码：

```javascript
const tween = new Tween(position)
tween.to({x: 200}, 1000)
tween.start()
```

重写为：

```javascript
const tween = new Tween(position).to({x: 200}, 1000).start()
```

你将在示例中看到很多这种用法，所以熟悉它是好的！查看 [04-simplest](../examples/04_simplest.html) 作为工作示例。

## 使用 tween.js 进行动画

Tween.js 不会自行运行。你需要通过显式调用每个补间的 `update` 方法或具有多个补间的 `Group` 的 `update` 方法来告诉它何时运行（下面会详细介绍 Groups）。推荐的方法是在你的主动画循环中执行此操作，该循环应使用 `requestAnimationFrame` 调用以获得最佳图形性能：

我们之前已经看过这个示例：

```javascript
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	tween.update()
	// [...]
}
```

如果不带参数调用，`update` 将确定当前时间，以找出自上次运行以来经过了多长时间。

但是你也可以将明确的时间参数传递给 `update`。因此，

```javascript
tween.update(100)
```

意味着"用时间 = 100 毫秒更新"。你可以使用它来确保代码中的所有时间相关函数都使用完全相同的时间值。例如，假设你有一个播放器并想要同步运行补间。你的 `animate` 代码可能如下所示：

```javascript
let currentTime = player.currentTime
tween.update(currentTime)
```

我们使用明确的时间值进行单元测试。你可以查看 [tests.ts](../src/tests.ts) 来了解我们如何使用不同的值调用 `tween.update()` 来模拟时间流逝。

## 控制补间

### `start` 和 `stop`

到目前为止，我们已经了解了 `Tween.start` 方法，但还有更多方法来控制个别补间。可能最重要的一个是 `start` 的对应方法：`stop`。如果你想取消补间，只需在个别补间上调用此方法：

```js
tween.stop()
```

停止从未启动或已经停止的补间没有任何效果。也不会抛出错误。

`start` 方法还接受 `time` 参数。如果你使用它，补间在那个特定时刻之前不会开始；否则它将尽快开始（即在下一次调用 `tween.update()` 时）。

`start` 方法接受第二个布尔参数：当为 `true` 时，我们之前使用的补间将从目标对象中的值开始，而不是从头开始。对于停止补间然后启动另一个将从当前位置继续的补间很有用。

### `startFromCurrentValues`

这是 `tween.start(undefined, true)` 的别名，使之前使用的
补间从目标对象的最后值开始，而不是从
开头开始。

### `update`

个别补间有一个 `update` 方法，以便它们可以在动画循环中随时间更新，在每次更新时它们将将更新的值应用到其目标对象。

```js
const tween = new Tween(someObject).to(/*...*/).start()

function animate(time) {
	tween.update(time)
	requestAnimationFrame(animate)
}
```

### `pause`

当补间正在运行时（即它已经被 `start` 并且可能已经被 `update` 了多次），它可以被暂停。即使在补间暂停时调用 `update()`，其时间也不会向前移动。`isPlaying` 在补间 `paused` 时仍为 true，其 `update()` 方法继续跟踪时间进度（你可以在补间暂停时继续调用 `update()`）。

```js
tween.start()

function animate() {
	tween.update()
	requestAnimationFrame(animate)
}
animate()

// 在补间运行时的任何时候
tween.pause()
```

### `chain`

当你按顺序排列不同的补间时，事情变得更有趣，即设置一个补间在前一个完成后开始。我们称之为_链式补间_，这通过 `chain` 方法完成。因此，要使 `tweenB` 在 `tweenA` 完成后开始：

```javascript
tweenA.chain(tweenB)
```

或者，对于无限链，设置 `tweenA` 在 `tweenB` 完成后开始：

```javascript
tweenA.chain(tweenB)
tweenB.chain(tweenA)
```

查看 [Hello world](../examples/00_hello_world.html) 来了解这些无限链的示例。

在其他情况下，你可能希望将多个补间链接到另一个补间，以便它们（链式补间）都同时开始动画：

```javascript
tweenA.chain(tweenB, tweenC)
```

> **警告** 调用 `tweenA.chain(tweenB)` 实际上修改了 tweenA，因此 tweenB 总是在 tweenA 完成时启动。`chain` 的返回值只是 tweenA，不是新的补间。

### `repeat`

如果你希望补间永远重复，你可以将其链接到自身，但更好的方法是使用 `repeat` 方法。它接受一个参数，描述在第一个补间完成后你希望有多少次重复：

```javascript
tween.repeat(10) // 在第一个补间后重复 10 次并停止
tween.repeat(Infinity) // 永远重复
```

补间的总数将是重复参数加上一个初始补间。
查看 [Repeat](../examples/08_repeat.html) 示例。

### `yoyo`

此函数只有与 `repeat` 一起使用时才有效。当激活时，补间的行为将_像溜溜球_，即它将在开始值和结束值之间来回跳跃，而不是只是从头开始重复相同的序列：

```js
tween.yoyo(false) // 默认值，动画只会从开始值到结束值
tween.yoyo(true) // 补间将在开始值和结束值之间"yoyo"
```

### `delay`

更复杂的安排可能需要在实际开始运行之前延迟补间。你可以使用 `delay` 方法：

```javascript
tween.delay(1000)
tween.start()
```

将在调用 `start` 方法后 1 秒开始执行。

### `repeatDelay`

通常 `delay` 时间应用于补间的重复之间，但如果为 `repeatDelay` 函数提供了值，则该值将确定补间重复之间经过的总时间。

考虑这个示例：

```javascript
tween.delay(1000)
tween.repeatDelay(500)
tween.start()
```

补间的第一次迭代将在一秒后发生，第二次迭代将在第一次迭代结束后半秒发生，第三次迭代将在第二次迭代结束后半秒发生，等等。如果你想延迟初始迭代但不希望迭代之间有任何延迟，请确保调用 `tween.repeatDelay(0)`。

### `dynamic`

如果 `dynamic` 设置为 `true`（默认为 `false`），传递给 `tween.to()` 的对象可以在补间动画时从外部修改。这可用于在补间运行时动态修改补间的结果。

查看 [Dynamic to](http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html) 示例。在该示例中，在两个场景中，兔子的位置在动画期间更新。兔子位置恰好是传递给狐狸的 `tween.to()` 方法的对象。随着兔子位置的更新，在第一个带有 `.dynamic(false)` 的场景中，狐狸移动到兔子的初始位置，不追逐兔子，在第二个带有 `.dynamic(true)` 的场景中，狐狸的最终目的地也被更新，这使得狐狸追逐兔子。

查看其他 `dynamic to` 示例以获得更多想法。

> **警告** 当 `dynamic` 设置为 `false` 时，Tween 复制传递给 `tween.to()` 的对象且永远不会修改它（因此从外部更新原始对象不是动态的）。当 `dynamic` 为 `true` 时，Tween 在动画期间使用原始对象作为值的来源（每次更新都读取值，因此可以动态修改它们），但请注意**在动态模式下，Tween 将修改传递给 `tween.to()` 的对象的任何插值数组，这可能对也可能依赖于同一对象的任何外部代码造成副作用**。

## 控制补间组

有时你想要一次更新多个补间，当将一组补间分组到应用程序中的逻辑组件时，这可能很有用。你可以使用 `Group` 来做到这一点。

首先将多个补间添加到组中：

```js
import {Group, Tween} from '@tweenjs/tween.js'

const tween1 = new Tween(obj1).to(...).start()
const tween2 = new Tween(obj2).to(...).start()

const group = new Group()
group.add(tween1)
group.add(tween2)
```

然后在你的动画循环中调用 `group.update()` 而不是在个别补间上：

```js
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	group.update()
	// [...]
}
```

请注意，补间只能属于单个组。将补间添加到组中会自动将其从任何先前的组中删除。

### `group.getAll()`

返回添加到组中的所有补间的数组。

### `group.add(tween)`

将补间添加到组中。

### `group.remove(tween)`

从组中删除补间。

### `group.removeAll()`

从组中删除所有补间。

### `group.update(time?)`

更新组中的所有补间，带有可选的时间值。如果未提供时间值，则默认为当前时间。

## 更改缓动函数（AKA 使其弹跳）

Tween.js 将以线性方式执行值之间的插值（即缓动），因此变化将与经过的时间成正比。这是可预测的，但在视觉上也相当无趣。不用担心——可以使用 `easing` 方法轻松更改此行为。例如：

```javascript
import {Tween, Easing} from '@tweenjs/tween.js'
// ...
tween.easing(Easing.Quadratic.In)
```

这将导致补间缓慢开始向最终值变化，向中间加速，然后快速达到其最终值。相比之下，`Easing.Quadratic.Out` 会开始快速向值变化，但在接近最终值时会减慢。

### 可用的 `Easing` 函数

tween.js 提供了一些现有的缓动函数。它们按照它们代表的方程类型分组：Linear、Quadratic、Cubic、Quartic、Quintic、Sinusoidal、Exponential、Circular、Elastic、Back 和 Bounce，然后按缓动类型：In、Out 和 InOut。

除非你已经熟悉这些概念，否则名称可能对你没有意义，所以现在可能是查看 [Graphs](../examples/03_graphs.html) 示例的时候了，它在一页中绘制了所有曲线，以便你可以一眼比较它们的外观。

`Easing` 也有一个名为 `generatePow()` 的函数。此函数根据参数生成不同曲线的缓动函数。你可以在[生成幂缓动的示例](../examples/17_generate_pow.html)页面中查看参数对曲线的相关性。

_在应得的地方给予信任：_ 这些函数来自 Robert Penner 几年前慷慨地作为免费软件提供的原始方程集，但已经过优化以与 JavaScript 很好地配合。

### 使用自定义缓动函数

你不仅可以使用任何现有函数，还可以提供自己的函数，只要它遵循几个约定：

- 它必须接受一个参数：
  - `k`：缓动进度，或我们在补间持续时间中的位置。允许的值在 [0, 1] 范围内。
- 它必须根据输入参数返回一个值。

无论要更改多少属性，每次更新时每个补间只调用一次缓动函数。然后将结果与初始值和此值与最终值之间的差值（_增量_）一起使用，如此伪代码所示：

```
easedElapsed = easing(k);
for each property:
    newPropertyValue = initialPropertyValue + propertyDelta * easedElapsed;
```

对于性能痴迷的人：只有在补间上调用 `start()` 时才计算增量。

因此，假设你想要使用一个自定义缓动函数，该函数缓动值但将 Math.floor 应用于输出，因此只返回整数部分，从而产生一种阶梯输出：

```javascript
function tenStepEasing(k) {
	return Math.floor(k * 10) / 10
}
```

你可以通过简单地调用其缓动方法在补间中使用它，就像我们之前看到的：

```javascript
tween.easing(tenStepEasing)
```

查看[自定义缓动函数的图表](../examples/12_graphs_custom_functions.html)示例以查看实际效果（以及一些用于生成步进函数的_元编程_）。

## 回调

另一个强大的功能是能够在每个补间生命周期中的特定时间运行你自己的函数。当更改属性不够时，通常需要这样做。

例如，假设你正在尝试为某个无法直接访问属性但需要你调用 setter 的对象制作动画。你可以使用 `update` 回调来读取新的更新值，然后手动调用 setter。所有回调都以补间对象作为唯一参数传递。

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

或者假设你想在补间开始时播放声音。你可以使用 `start` 回调：

```javascript
const tween = new Tween(obj).to({x: 100}).onStart(function () {
	sound.play()
})
```

每个回调的作用域是补间对象——在这种情况下是 `obj`。

### onStart

在补间开始动画之前执行，在 `delay` 方法指定的任何延迟时间之后。每个补间只会执行一次，即当补间通过 `repeat()` 重复时_不会_运行。

它非常适合与其他事件同步或触发你希望在补间开始时发生的操作。

补间对象作为第一个参数传入。

### onEveryStart

与 `onStart` 一样，但它_会_在补间的每次重复时运行。

补间对象作为第一个参数传入。

### onStop

当补间通过 `stop()` 显式停止时执行，但不会在正常完成时执行，并且在停止任何可能的链式补间之前执行。

补间对象作为第一个参数传入。

### onUpdate

每次更新补间时执行，在值实际更新之后。

补间对象作为第一个参数传入。

### onComplete

当补间正常完成时执行（即未停止）。

补间对象作为第一个参数传入。

### onRepeat

每当补间刚完成一次重复并将开始另一次重复时执行。

补间对象作为第一个参数传入。

为了澄清何时调用 `onStart`、`onEveryStart` 和 `onRepeat`，请考虑：

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

输出看起来像这样，左边如上所示，右边带有 `.delay(5)`：

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

## 补间状态

### `isPlaying`

当补间启动时，`tween.isPlaying` 为 `true`，即使它被暂停也是如此。

当补间停止时，`isPlaying` 和 `isPaused` 都将为 `false`，因此 `!tween.isPlaying()` 可用于检测补间是否已停止（无论补间是否已完成）。

### `isPaused`

当补间被暂停时，`tween.isPaused` 为 `true`。`isPlaying` 也将为 `true`。如果补间已启动但未暂停，`isPlaying` 将为 `true`，`isPaused` 将为 `false`。

## 高级补间

### 相对值

当使用 `to` 方法时，你也可以使用相对值。当补间启动时，Tween.js 将读取当前属性值并应用相对值来找出新的最终值。但**你需要使用引号**否则这些值将被视为绝对值。让我们用示例来看这个：

```javascript
// 这将使 `x` 属性始终为 100
const absoluteTween = new Tween(absoluteObj).to({x: 100})

// 假设 absoluteObj.x 现在为 0
absoluteTween.start() // 使 x 变为 100

// 假设 absoluteObj.x 现在为 -100
absoluteTween.start() // 使 x 变为 100

// 相比之下...

// 这将使 `x` 属性多 100 个单位，
// 相对于它开始时的实际值
const relativeTween = new Tween(relativeObj).to({x: '+100'})

// 假设 relativeObj.x 现在为 0
relativeTween.start() // 使 x 变为 0 +100 = 100

// 假设 relativeObj.x 现在为 -100
relativeTween.start() // 使 x 变为 -100 +100 = 0
```

查看 [09_relative_values](../examples/09_relative_values.html) 示例。

### 补间嵌套对象

Tween.js 也可以更改跨嵌套对象的属性。例如：

```javascript
const nestedObject = {scale: {x: 0, y: 0}, alpha: 0}
const tween = new Tween(nestedObject).to({scale: {x: 100, y: 100}, alpha: 1})
```

### 补间到值数组

除了补间到绝对值或相对值之外，你还可以让 Tween.js 跨一系列值更改属性。为此，你只需为属性指定值数组而不是单个值。例如：

```javascript
const tween = new Tween(relativeObj).to({x: [0, -100, 100]})
```

将使 `x` 从其初始值变为 0、-100 和 100。

计算这些值的方式如下：

- 首先照常计算补间进度
- 进度（从 0 到 1）用作插值函数的输入
- 基于进度和值数组，生成插值

例如，当补间刚开始时（进度为 0），插值函数将返回数组中的第一个值。当补间进行到一半时，插值函数将返回大约在数组中间的值，当补间结束时，插值函数将返回最后一个值。

你可以通过将 `Interpolation` 函数传递给
`tween.interpolation` 方法来更改插值模式。例如：

```javascript
import {Interpolation} from '@tweenjs/tween.js'
// ...
tween.interpolation(Interpolation.Bezier)
```

以下值可用：

- `Interpolation.Linear`
- `Interpolation.Bezier`
- `Interpolation.CatmullRom`

默认为 `Linear`。

请注意，插值函数对于在同一补间中使用数组补间的所有属性都是全局的。你不能使属性 A 使用数组和 Linear 函数更改，属性 B 使用数组和 Bezier 函数使用同一补间；你应该使用两个在同一对象上运行但修改不同属性并使用不同插值函数的补间对象。

查看 [06_array_interpolation](../examples/06_array_interpolation.html) 示例。

## 更改"现在"的定义

在处理补间时，你不可避免地依赖于对"现在"是什么的定义。默认情况下，Tween.js 使用 performance.now，这是一种可靠且精确的方法。但是，如果你需要调整时间流——例如，减慢时间或为自定义目的操纵时间——你可能会在内部对"现在"的定义与 Tween.js 认为的"现在"之间遇到差异。

为了解决这个问题，引入了一个新函数 setNow。此函数允许你重新定义 Tween.js 使用的内部"现在"。你可以将自定义函数传递给 setNow，这将替换默认定义。这提供了更大的灵活性，并能够与你对时间控制的特定要求同步。

## 获得最佳性能

虽然 Tween.js 试图自己保持高性能，但没有什么能阻止你以反性能的方式使用它。以下是一些在使用 Tween.js 时（或在 Web 中进行动画制作时）避免减慢项目速度的方法。

### 使用高性能的 CSS

当你试图为页面中元素的位置制作动画时，最简单的解决方案是为 `top` 和 `left` 样式属性制作动画，如下所示：

```javascript
const element = document.getElementById('myElement')
const tween = new Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.top = object.top + 'px'
	element.style.left = object.left + 'px'
})
```

但这真的效率很低，因为更改这些属性会强制浏览器在每次更新时重新计算布局，这是一个非常昂贵的操作。相反，你应该使用 `transform`，它不会使布局无效，并且在可能的情况下也会进行硬件加速，如下所示：

```javascript
const element = document.getElementById('myElement')
const tween = new Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.transform = 'translate(' + object.left + 'px, ' + object.top + 'px)'
})
```

如果你想了解更多相关信息，请查看[这篇文章](http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/)。

但是，如果你的动画需求_就是那么_简单，最好只使用 CSS 动画或过渡（在适用的情况下），以便浏览器可以尽可能地优化。当你的动画需求涉及复杂的安排时，Tween.js 最有用，即你需要将多个补间同步在一起，在一个完成后开始一些补间，循环它们多次，有不是用 CSS 而是用 Canvas 或 WebGL 渲染的图形等等。

### 对垃圾收集器友好（别名 GC）

如果你使用 `onUpdate` 回调，你需要对放入其中的内容非常小心。此函数每秒将被调用多次，因此如果你在每次更新时进行昂贵的操作，你可能会阻塞主线程并导致可怕的_卡顿_，或者——如果你的操作涉及内存分配，你最终会让垃圾收集器运行得太频繁，也会导致_卡顿_。所以不要做这两件事中的任何一件。保持你的 `onUpdate` 回调非常轻量级，并确保在开发时也使用内存分析器。

## 疯狂的补间

这是你可能不经常使用的东西，但你可以在 Tween.js 之外使用补间方程。它们毕竟只是函数。因此，你可以使用它们来计算平滑曲线作为输入数据。例如，它们在[这个实验](http://5013.es/toys/tween.audio/)中用于生成音频数据。