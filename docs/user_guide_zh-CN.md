## tween.js 用户指南

更多语言: [English](./user_guide.md), [简体中文](./user_guide_zh-CN.md)

中文用户指南最近更新为 Tween.js v20.0.3

_**NOTE** 这是一个正在进行的工作。 如果你发现某些内容不清楚或缺少详细信息，请 [提出 issue](https://github.com/tweenjs/tween.js/issues/new) 并帮助改进本指南。 或者，如果你觉得自己也能提供帮助，请随时提交你自己的说明或改进！_

## 什么是 tween ？tween 是如何工作的？为什么要使用 tween ？

补间（动画）（来自 [in-between](https://en.wikipedia.org/wiki/Inbetweening)）是一个概念，允许你以平滑的方式更改对象的属性。你只需告诉它哪些属性要更改，当补间结束运行时它们应该具有哪些最终值，以及这需要多长时间，补间引擎将负责计算从起始点到结束点的值。

例如，`position` 对象拥有 `x` 和 `y` 两个坐标：

```js
const position = {x: 100, y: 0}
```

如果你想将 `x` 坐标的值从 `100` 变成 `200` ，你应该这么做：

```js
// 首先为位置创建一个补间(tween)
const tween = new TWEEN.Tween(position)

// 然后告诉 tween 我们想要在1000毫秒内以动画的形式移动 x 的位置
tween.to({x: 200}, 1000)
```

通常来说这样还不够，tween 已经被创建了，但是它还没被激活(使用)，你需要这样启动：

```js
// 启动
tween.start()
```

最后，想要成功的完成这种效果，你需要在主函数中调用 `TWEEN.update` ，如下使用：

```js
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	TWEEN.update()
	// [...]
}
```

这样在更新每帧的时候都会运行补间动画；经过 1 秒（1000 毫秒）后 `position.x` 将会变成 `200`。

除非你在控制台中打印出 `x` 的值，不然你看不到它的变化。你可能想要使用 `onUpdate` 回调:

```js
tween.onUpdate(function (object) {
	console.log(object.x)
})
```

每次更新补间时都会调用此函数； 这种情况发生的频率取决于许多因素——例如，你的计算机或设备的速度有多快（以及有多繁忙！）。

到目前为止，我们只使用 tweens 将值打印到控制台，但你可以将它用于 three.js 对象的动画位置之类的事情：

```js
const tween = new TWEEN.Tween(cube.position).to({x: 100, y: 100, z: 100}, 10000).start()

animate()

function animate() {
	requestAnimationFrame(animate)
	TWEEN.update()

	threeRenderer.render(scene, camera)
}
```

在这种情况下，因为 three.js 渲染器将在渲染之前查看对象的位置，所以不需要使用的 `onUpdate` 回调。

你可能也注意到了一些不同的地方：tween.js 可以链式调用！ 每个 tween 函数都会返回 tween 实例，所以你可以重写下面的代码：

```js
const tween = new TWEEN.Tween(position)
tween.to({x: 200}, 1000)
tween.start()
```

改成这样：

```js
const tween = new TWEEN.Tween(position).to({x: 200}, 1000).start()
```

在将会看到很多例子，所以熟悉它是很好的！比如 [04-simplest](../examples/04_simplest.html) 这个例子。

## tween.js 的动画

Tween.js 不会自行运行。你需要显式的调用 `update` 方法来告诉它何时运行。推荐的方法是在主动画循环中执行这个操作。使用 `requestAnimationFrame` 调用此循环以获得最佳的图形性能。

比如之前这个例子：

```js
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	TWEEN.update()
	// [...]
}
```

如果不带参数调用，`update` 将会判断当前时间点，以便找出自上次运行以来已经过了多长时间。

当然你也可以传递一个明确的时间参数给 `update` 来更新。因此：

```js
TWEEN.update(100)
```

意思是“更新时间 = 100 毫秒”。你可以使用它来确保代码中的所有时间相关函数都使用相同的时间值。例如，假设你有一个播放器，并希望同步运行补间。 你的 `animate` 函数可能看起来像这样：

```js
const currentTime = player.currentTime
TWEEN.update(currentTime)
```

我们使用明确的时间值进行单元测试。你可以看下 [tests.ts](../src/tests.ts) 这个例子，看看我们如何用不同的值调用`TWEEN.update()` 来模拟时间传递。

## 控制一个补间

### `start` 和 `stop`

到目前为止，我们已经了解了 `Tween.start` 方法，但是还有更多的方法来控制单个补间。也许最重要的一个是 `start` 对应的方法：`stop` 。 如果你想取消一个补间，只要调用这个方法通过一个单独的补间:

```js
tween.stop()
```

停止一个从未开始或已经停止的补间没有任何效果。 没有错误被抛出。

`start` 方法还接受一个 `time` 参数。如果你使用它，补间直到那个特定的时刻才会开始；否则它将立即开始（即在下一次调用 `TWEEN.update` 时）。

`start` 方法接受第二个布尔参数：当为 `true` 时，我们之前使用的补间将从目标对象中的值开始，而不是从头开始。用于停止补间，然后启动另一个将从当前位置继续的补间。

### `startFromCurrentValues`

这是 `tween.start(undefined, true)` 的别名，使以前使用的补间从目标对象的最后一个值开始，而不是从头开始。

### `update`

个别补间有一个 `update` 方法。 这实际上是由 `TWEEN.update` 调用的，用于仅使用一个参数构建的补间。

在下面的示例中，第二个参数告诉新的 Tween 不要将自己添加到默认组（`TWEEN` 是 `TWEEN.Group` 的一个实例）。如果补间不与组关联（请注意，可以通过将组作为第二个参数传递给构造函数来关联组），则补间需要使用其 `update` 方法手动更新，如下所示：

```js
const tween = new TWEEN.Tween(someObject, false).to(/*...*/).start()

function animate(time) {
	tween.update(time)
	requestAnimationFrame(animate)
}
```

> **Note** 如果你使用 `TWEEN.update()` 作为默认控制所有补间的方式，则无需直接调用 `tween.update()`，但是我们建议你直接如上例所示 [创建自己的补间组](#controlling-groups-of-tweens) 或手动更新补间。 使用组或单独控制的补间的概念很像避免在 JavaScript 代码中使用全局变量的做法：它可以防止一个组件意外破坏其他一些不相关组件的行为。

### `chain`

当你按顺序排列不同的补间时，事情会变得更有趣，例如在上一个补间结束的时候立即启动另外一个补间。我们称此为链接补间，它是通过 `chain` 方法完成的。因此，要使 `tweenB` 在 `tweenA` 完成后开始：

```js
tweenA.chain(tweenB)
```

或者，可以创造一个无限的链式，`tweenA` 完成时开始 `tweenB`，`tweenB` 完成时开始 `tweenA`：

```js
tweenA.chain(tweenB)
tweenB.chain(tweenA)
```

关于无限的链式查看案例 [Hello world](../examples/00_hello_world.html) 。

在其他情况下，你可能希望将多个补间链接到另一个补间，使它们（链接的补间）都同时开始动画：

```js
tweenA.chain(tweenB, tweenC)
```

> **Warning** 调用 `tweenA.chain（tweenB）` 实际上修改了 tweenA，所以 tweenB 总是在 tweenA 完成时启动。 `chain` 的返回值只是 tweenA，不是一个新的 tween。

### `repeat`

如果你想让一个补间永远重复，你可以链接到自己，但更好的方法是使用 `repeat` 方法。它接受一个参数，描述第一个补间完成后需要多少次重复：

```js
tween.repeat(10) // 循环10次
tween.repeat(Infinity) // 无限循环
```

补间的总次数将是重复参数加上一个初始补间。查看 [Repeat](../examples/08_repeat.html) 。

### `yoyo`

此功能仅在与 `repeat` 一起使用时才有效。 激活时，补间的行为将 _像溜溜球一样_，即它会在开始值和结束值之间来回跳动，而不是仅仅从头开始重复相同的顺序：

```js
tween.yoyo(false) // 默认值，动画只会从开始到结束值
tween.yoyo(true) // tween 将在起始值和结束值之间“yoyo”
```

### `delay`

更复杂的安排可能需要在实际开始运行之前延迟补间。 你可以使用 `delay` 方法来做到这一点：

```js
tween.delay(1000)
tween.start()
```

将在调用 `start` 方法后的 1 秒钟后开始执行。

### `repeatDelay`

通常，`delay` 时间应用于补间的重复之间，但如果向 `repeatDelay` 函数提供了一个值，则该值将确定补间重复之间经过的总时间。

参考这个例子：

```js
tween.delay(1000)
tween.repeatDelay(500)
tween.start()
```

补间的第一次迭代将在一秒后发生，第二次迭代将在第一次迭代结束后半秒发生，第三次迭代将在第二次迭代结束后半秒发生，依此类推。如果你想延迟初始迭代但不希望迭代之间有任何延迟，请确保调用 `tween.repeatDelay(0)` 。

### `dynamic`

如果 `dynamic` 设置为 `true`（默认为 `false`），则传递给 `tween.to()` 的对象可以在补间动画的外部进行修改。这可用于在运行时动态修改补间的结果。

请参阅 [dynamic 示例](http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html)。在那个例子中，在这两个场景中，兔子的位置都在动画期间更新。 兔子的位置恰好是传递给狐狸的 `tween.to()` 方法的对象。 随着兔子位置的更新，在第一个带有 `.dynamic(false)` 的场景中，狐狸向兔子的初始位置移动并且不跟随兔子，而在第二个带有 `.dynamic(true)` 的场景中，狐狸移动到兔子的最终目的地 狐狸因此也被更新，这使得狐狸跟随兔子。

> **Warning** 当 `dynamic` 设置为 `false` 时，Tween 复制传递给 `tween.to()` 的对象并且永远不会修改它（因此从外部更新原始对象不是动态的）。当 `dynamic` 为 `true` 时，Tween 在动画期间使用原始对象作为值的来源（每次更新都读取值，因此可以动态修改它们） **但请注意，在 dynamic 模式下，Tween 将修改传递给 `tween.to()` 的对象的任何插值数组，这可能会对也可能依赖于同一对象的任何外部代码造成副作用。**

## 控制*所有*补间

在 TWEEN 全局对象中可以找到以下方法，除了 `update` 之外，你通常不需要使用其中的大部分方法。

### `TWEEN.update(time)`

我们已经讨论过这种方法。它用于更新所有活动的补间。
如果 `time` 不指定，它将使用当前时间。

### `TWEEN.getAll` and `TWEEN.removeAll`

用于获取对活动 `tweens` 数组的引用，并分别通过一次调用将它们从数组中移除。

### `TWEEN.add(tween)` and `TWEEN.remove(tween)`

分别用于将补间添加到活动补间列表，或从列表中删除特定补间。

这些方法通常只在内部使用，但如果你想做一些*有趣*的事情，我们会公开这些方法。

## 控制补间集

使用 `TWEEN` 单例来管理补间可能会导致包含许多组件的大型应用程序出现问题。在这些情况下，你可能想要创建自己的更小的补间集。

### 示例：交叉组件冲突

如果你有多个组件使用 `TWEEN`，并且每个组件都想管理自己的补间集，则可能会发生冲突。 如果一个组件调用 `TWEEN.update()` 或 `TWEEN.removeAll()`，其他组件的补间也将被更新或删除。

### 创建你自己的补间集

为了解决这个问题，每个组件都可以创建自己的 `TWEEN.Group` 实例（这是全局 `TWEEN` 对象在内部使用的实例）。 在实例化新补间时，这些组可以作为第二个可选参数传入：

```js
const groupA = new TWEEN.Group()
const groupB = new TWEEN.Group()

const tweenA = new TWEEN.Tween({x: 1}, groupA).to({x: 10}, 100).start()

const tweenB = new TWEEN.Tween({x: 1}, groupB).to({x: 10}, 100).start()

const tweenC = new TWEEN.Tween({x: 1}).to({x: 10}, 100).start()

groupA.update() // 只更新tweenA
groupB.update() // 只更新tweenB
TWEEN.update() // 只更新tweenC

groupA.removeAll() // 只移除tweenA
groupB.removeAll() // 只移除tweenB
TWEEN.removeAll() // 只移除tweenC
```

这样，每个组件都可以处理创建、更新和销毁自己的补间集。

## 改变缓动功能（别名：让它弹）

Tween.js 将以线性方式执行值之间的插值（即缓动），因此变化将与经过的时间成正比。 这是可以预见的，但在视觉上也很无趣。 不用担心——可以使用缓动方法轻松更改此行为。 例如：

```js
tween.easing(TWEEN.Easing.Quadratic.In)
```

这将导致补间缓慢开始向最终值变化，向中间加速，然后快速达到其最终值。 相比之下，`TWEEN.Easing.Quadratic.Out` 将开始向该值快速变化，但在接近最终值时会减慢速度。

### 可用的缓动函数：`TWEEN.Easing`

tween.js 提供了一些现成的缓动功能。它们按照它们表示的方程类型进行分组：线性、二次、三次、四次、五次、正弦、指数、圆形、弹性、后退和反弹，然后按缓动类型：In、Out 和 InOut。

除非你已经熟悉这些概念，否则这些名称可能对你没有任何意义，所以现在可能是查看 [图表示例](../examples/17_generate_pow.html) 的时候了，该示例在一页中绘制了所有曲线，以便你可以比较它们的动画。

这些函数源自 Robert Penner 几年前慷慨地作为免费软件提供的原始方程，但已经过优化后，可以很好地与 JavaScript 配合使用。

### 使用自定义缓动功能

你不仅可以使用任何现有的缓动函数，还可以提供自己的函数，只要它遵循一些约定即可：

- 它必须接受一个参数：
  - `k`: 缓动过程，或我们的补间所处的时间有多长。允许的值在[0, 1]的范围内。
- 它必须根据输入参数返回一个值。

无论要更改多少属性，每次更新时每个补间只调用一次缓动函数。 然后将结果与初始值以及此值和最终值之间的差值（_deltas_）一起使用，如以下伪代码所示：

```js
easedElapsed = easing(k);
for each property:
	newPropertyValue = initialPropertyValue + propertyDelta * easedElapsed;
```

对于更注重性能表现的人来说：只有在补间上调用 `start()` 时才会计算 deltas。

因此，假设你想要使用自定义缓动函数来缓动值但将 `Math.floor` 应用于输出，因此只会返回整数部分，从而产生一种阶梯式输出：

```js
function tenStepEasing(k) {
	return Math.floor(k * 10) / 10
}
```

你可以通过简单地调用它的缓动方法在补间中使用它，就像我们之前看到的那样：

```js
tween.easing(tenStepEasing)
```

查看 [graphs for custom easing functions](../examples/12_graphs_custom_functions.html) 示例，以查看这个动作（还有一些用于生成步进函数的 _metaprogramming_ ）。

## 回调函数

另一个强大的特性是能够在每个补间的生命周期的特定时间运行自己的功能。 当更改属性不够时，通常需要这样做。

例如，假设你正在试图给一些不能直接访问属性的对象设置动画，但是需要你调用 setter。 你可以使用 `update` 回调来读取新的更新值，然后手动调用 setters。 所有的回调函数都将补间对象作为唯一的参数。

```js
const trickyObjTween = new TWEEN.Tween({
	propertyA: trickyObj.getPropertyA(),
	propertyB: trickyObj.getPropertyB(),
})
	.to({propertyA: 100, propertyB: 200})
	.onUpdate(function (object) {
		object.setA(object.propertyA)
		object.setB(object.propertyB)
	})
```

或者假设你想在开始补间时播放声音。 你可以使用 `start` 回调：

```js
const tween = new TWEEN.Tween(obj).to({x: 100}).onStart(function () {
	sound.play()
})
```

每个回调的范围是补间对象——在本例中为 `obj`。

### onStart

在补间开始动画之前执行，在 `delay` 方法指定的任何延迟时间之后。 每个补间只会执行一次，即当补间通过 `repeat()` 重复时不会运行。

`onStart` 非常适合与其他事件同步，或触发需要在补间开始时执行的操作。

补间对象作为第一个参数传入。

### onEveryStart

和 `onStart` 类似，单 `onEveryStart` 在每次重复补间时也会运行。

补间对象作为第一个参数传入。

### onStop

当补间通过 `stop()` 显式停止时执行，但不会在它正常完成时执行，并且在停止任何可能的链接补间之前执行。

补间对象作为第一个参数传入。

### onUpdate

每次更新补间时执行，在实际更新值之后。

补间对象作为第一个参数传入。

### onComplete

当补间正常完成（即未停止）时执行。

补间对象作为第一个参数传入。

### onRepeat

每当补间刚刚完成一个重复并将开始另一个重复时执行。

补间对象作为第一个参数传入。

要阐明何时调用 `onStart`、`onEveryStart` 和 `onRepeat`，请参考：

```js
const obj = {x: 0}

const t = new TWEEN.Tween(obj)
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
	TWEEN.update(ticks)

	console.log(obj)
	console.log()
}
```

输出如下所示，左侧如上，右侧带有 `.delay(5)`：

```txt
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

开始时为 `true`（即使是暂停）。

当补间停止时，`isPlaying` 和 `isPaused` 都将为 `false`。

### `isPaused`

暂停时为 `true`。 `isPlaying` 也将为 `true`。 如果补间已启动但未暂停，则 `isPlaying` 将为 `true` 而 `isPaused` 将为 `false`。

## 高级补间

### 相对值

使用 `to` 方法时，也可以使用相对值。 当 tween 启动时，Tween.js 将读取当前属性值并应用相对值来找出新的最终值。
**但是你需要使用引号**，否则这些值将被视为绝对的。 我们来看一个例子:

```js
// 这将使 `x` 属性始终为 100
const absoluteTween = new TWEEN.Tween(absoluteObj).to({x: 100})

// 假设 absoluteObj.x 现在为 0
absoluteTween.start() // 使 x 变为 100

// 假设 absoluteObj.x 现在是 -100
absoluteTween.start() // 使 x 变为 100

// 相比之下...

// 这将使 `x` 属性相对于开始时的实际值多 100 个单位
const relativeTween = new TWEEN.Tween(relativeObj).to({x: '+100'})

// 假设 relativeObj.x 现在是 0
relativeTween.start() // 使 x 变为 0 +100 = 100

// 假设 relativeObj.x 现在是 -100
relativeTween.start() // 使 x 变为 -100 +100 = 0
```

查看 [09_relative_values](../examples/09_relative_values.html) 示例。

### 补间嵌套对象

Tween.js 还可以跨嵌套对象更改属性。 例如：

```js
const nestedObject = {scale: {x: 0, y: 0}, alpha: 0}
const tween = new TWEEN.Tween(nestedObject).to({scale: {x: 100, y: 100}, alpha: 1})
```

### 补间值的数组

除了补间到绝对值或相对值之外，你还可以让 Tween.js 更改一系列值的属性。 为此，你只需为属性指定一个值数组而不是单个值。 例如：

```js
const tween = new TWEEN.Tween(relativeObj).to({x: [0, -100, 100]})
```

将使 `x` 从初始值变为 0，-100 和 100。

这些值的计算方法如下：

- 首先，补间进度如常计算
- 进度（从 0 到 1）用作插值函数的输入
- 基于进度和值的数组，生成内插值

例如，当补间刚刚启动（进度为 0）时，插值函数将返回数组中的第一个值。 当补间到一半时，插值函数将返回一个大约在数组中间的值，当补间结束时，插值函数将返回最后一个值。

你可以使用插值方法更改插值函数。 例如：

```js
tween.interpolation(TWEEN.Interpolation.Bezier)
```

以下值可用：

- TWEEN.Interpolation.Linear
- TWEEN.Interpolation.Bezier
- TWEEN.Interpolation.CatmullRom

默认是 `Linear`。

请注意，插值函数对于在同一补间中与数组补间的所有属性都是全局的。
你不能使用数组和线性函数更改属性 A，也不能使用数组和使用相同补间的贝塞尔函数更改属性 B； 你应该使用两个运行在同一对象上但修改不同属性并使用不同插值函数的补间对象。

查看 [06_array_interpolation](../examples/06_array_interpolation.html) 示例。

## 获得最佳性能

虽然 Tween.js 试图靠自己发挥性能，但没有什么能阻止你以反性能的方式使用它。 以下是一些在使用 Tween.js 时（或通常在 Web 中制作动画时）可以避免拖慢项目速度的方法。

### 使用高性能的 CSS

当你尝试为页面中元素的位置设置动画时，最简单的解决方案是为 `top` 和 `left` 样式属性设置动画，如下所示：

```js
const element = document.getElementById('myElement')
const tween = new TWEEN.Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.top = object.top + 'px'
	element.style.left = object.left + 'px'
})
```

但这确实效率低下，因为更改这些属性会强制浏览器在每次更新时重新计算布局，这是一项非常消耗性能的操作。你应该使用 `transform`，它不会使布局无效，并且在可能的情况下也会进行硬件加速，如下所示：

```js
const element = document.getElementById('myElement')
const tween = new TWEEN.Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.transform = 'translate(' + object.left + 'px, ' + object.top + 'px);'
})
```

如果你想了解更多关于高性能的 CSS，看看[这篇文章](https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/)。

但是，如果你的动画需求就这么简单，最好只使用 CSS 动画或过渡（在适用的情况下），这样浏览器就可以尽可能地进行优化。
当你的动画需要涉及复杂的操作时，Tween.js 是非常有用，也就是说，你需要将多个补间同步在一起，在一个完成后开始，循环多次，具有不是使用 CSS 而是使用 Canvas 渲染的图形或 WebGL 等等。

### 对垃圾收集器（别名 GC）

如果你使用 `onUpdate` 回调，你需要非常小心你放在它上面的东西。 这个函数每秒会被调用很多次，所以如果你在每次更新时都做代价高昂的操作，你可能会阻塞主线程并导致可怕的卡顿，或者——如果你的操作涉及内存分配，你最终会得到 垃圾收集器运行过于频繁，也会导致卡顿。 所以不要做这两件事。 保持你的 `onUpdate` 回调非常轻量级，并确保在开发时也使用内存分析器。

### 疯狂的补间

这是你可能不经常使用的东西，但你可以在 Tween.js 之外使用补间方程式。 毕竟，它们只是函数。 因此，你可以使用它们来计算平滑曲线作为输入数据。 例如，它们用于在[此实验](<(http://5013.es/toys/tween.audio/)>)中生成音频数据。
