## tween 是什么？如何使用？你为什么想用它？

中文用户指南最近更新为 Tween.js v18.5.0

补间(动画)（来自 [in-between](https://en.wikipedia.org/wiki/Inbetweening)）是一个概念，允许你以平滑的方式更改对象的属性。你只需告诉它哪些属性要更改，当补间结束运行时它们应该具有哪些最终值，以及这需要多长时间，补间引擎将负责计算从起始点到结束点的值。

例如，`position`对象拥有`x`和`y`两个坐标:

```js
var position = {x: 100, y: 0}
```

如果你想将`x`坐标的值从`100`变成`200`，你应该这么做：

```js
// 首先为位置创建一个补间(tween)
var tween = new TWEEN.Tween(position)

// 然后告诉 tween 我们想要在1000毫秒内以动画的形式移动 x 的位置
tween.to({x: 200}, 1000)
```

一般来说这样还不够，tween 已经被创建了，但是它还没被激活(使用)，你需要这样启动：

```js
// 启动
tween.start()
```

最后，想要成功的完成这种效果，你需要在主函数中调用`TWEEN.update`，如下使用：

```js
animate()

function animate() {
	requestAnimationFrame(animate)
	// [...]
	TWEEN.update()
	// [...]
}
```

这样在更新每帧的时候都会运行补间动画；经过 1 秒后 (1000 毫秒) `position.x`将会变成 `200`。

除非你在控制台中打印出 `x` 的值，不然你看不到它的变化。你可能想要使用 `onUpdate` 回调:

```js
tween.onUpdate(function (object) {
	console.log(object.x)
})
```

> tips:你可能在这里获取不到 `object.x` ,具体的见我提的这个 [issue](https://github.com/tweenjs/tween.js/issues/402)

这个函数将会在动画每次更新的时候被调用；这种情况发生的频率取决于很多因素 - 例如，计算机或设备的速度有多快（以及如何繁忙）。

到目前为止，我们只使用补间动画向控制台输出值，但是您可以将它与 three.js 对象结合：

```js
var tween = new TWEEN.Tween(cube.position).to({x: 100, y: 100, z: 100}, 10000).start()

animate()

function animate() {
	requestAnimationFrame(animate)
	TWEEN.update()

	threeRenderer.render(scene, camera)
}
```

在这种情况下，因为 three.js 渲染器将在渲染之前查看对象的位置，所以不需要使用明确的`onUpdate`回调。

你可能也注意到了一些不同的地方：tween.js 可以链式调用！ 每个`tween`函数都会返回`tween`实例，所以你可以重写下面的代码：

```js
var tween = new TWEEN.Tween(position)
tween.to({x: 200}, 1000)
tween.start()
```

改成这样：

```js
var tween = new TWEEN.Tween(position).to({x: 200}, 1000).start()
```

在将会看到很多例子，所以熟悉它是很好的！比如 [04-simplest](https://github.com/tweenjs/tween.js/blob/master/examples/04_simplest.html) 这个例子。

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

如果调用的时候不传入参数，`update` 将会判断当前时间点以确定自上次运行以来已经有多久。

当然你也可以传递一个明确的时间参数给 `update`

```js
TWEEN.update(100)
```

意思是"更新时间 = 100 毫秒"。你可以使用它来确保代码中的所有时间相关函数都使用相同的时间值。例如，假设你有一个播放器，并希望同步运行补间。 你的 `animate` 函数可能看起来像这样：

```js
var currentTime = player.currentTime
TWEEN.update(currentTime)
```

我们使用明确的时间值进行单元测试。你可以看下 [tests.js](https://github.com/tweenjs/tween.js/blob/master/test/unit/tests.js) 这个例子，看看我们如何用不同的值调用`TWEEN.update()` 来模拟时间传递。

## 控制一个补间

### start 和 stop

到目前为止，我们已经了解了`Tween.start`方法，但是还有更多的方法来控制单个补间。 也许最重要的一个是 `start` 对应的方法：`停止` 。 如果你想取消一个补间，只要调用这个方法通过一个单独的补间:

```js
tween.stop()
```

停止一个从未开始或已经停止的补间没有任何效果。 没有错误被抛出。

`start` 方法接受一个参数 `time`。如果你使用它，那么补间不会立即开始，直到特定时刻，否则会尽快启动（i.e 即在下次调用 `TWEEN.update`）。

### update

补间也有一个更新的方法---这实际上是由 `TWEEN.update` 调用的。 你通常不需要直接调用它，除非你是个 疯狂的 hacker。

### chain

当你顺序排列不同的补间时，事情会变得有趣，例如在上一个补间结束的时候立即启动另外一个补间。我们称这为链式补间，这使用 `chain` 方法去做。因此，为了使 `tweenB` 在 `tewwnA` 启动：

```js
tweenA.chain(tweenB)
```

或者，对于一个无限的链式，设置 tweenA 一旦 tweenB 完成就开始：

```js
tweenA.chain(tweenB)
tweenB.chain(tweenA)
```

关于无限的链式查看 [Hello world](https://github.com/tweenjs/tween.js/blob/master/examples/00_hello_world.html) 。

在其他情况下，您可能需要将多个补间链接到另一个补间，以使它们（链接的补间）同时开始动画：

```js
tweenA.chain(tweenB, tweenC)
```

> 警告：调用 `tweenA.chain（tweenB）` 实际上修改了 tweenA，所以 tweenA 总是在 tweenA 完成时启动。 `chain` 的返回值只是 tweenA，不是一个新的 tween。

### repeat

如果你想让一个补间永远重复，你可以链接到自己，但更好的方法是使用 `repeat` 方法。 它接受一个参数，描述第一个补间完成后需要多少次重复

```js
tween.repeat(10) // 循环10次
tween.repeat(Infinity) // 无限循环
```

补间的总次数将是重复参数加上一个初始补间。查看 [Repeat](https://github.com/tweenjs/tween.js/blob/master/examples/08_repeat.html)。

### yoyo

这个功能只有在独自使用 `repeat` 时才有效果。 活跃时，补间的行为将像 yoyo 一样，i.e 它会从起始值和结束值之间跳出，而不是从头开始重复相同的顺序。

### delay

更复杂的安排可能需要在实际开始运行之前延迟补间。 你可以使用 `delay` 方法来做到这一点

```js
tween.delay(1000)
tween.start()
```

将在调用启动方法后的 1 秒钟后开始执行。

## 控制所有补间

在 TWEEN 全局对象中可以找到以下方法，除了 `update` 之外，通常不需要使用其中的大部分对象。

### TWEEN.update(time)

我们已经讨论过这种方法。 它用于更新所有活动的补间。
如果 `time` 不指定，它将使用当前时间。

### TWEEN.getAll and TWEEN.removeAll

用于获取对活动 `tweens` 数组的引用，并分别仅从一个调用中将它们全部从数组中删除

### TWEEN.add(tween) and TWEEN.remove(tween)

用于将补间添加到活动补间的列表，或者分别从列表中删除特定的补间。

这些方法通常只在内部使用，但是如果您想要做一些有趣的事情，则会被暴露。

## 控制补间组

使用 `TWEEN` 单例来管理补间可能会导致包含许多组件的大型应用程序出现问题。 在这些情况下，您可能希望创建自己的更小的补间组。

### 示例：交叉组件冲突

如果使用 `TWEEN` 有多个组件，并且每个组件都想管理自己的一组补间，则可能发生冲突。 如果一个组件调用 `TWEEN.update（）` 或 `TWEEN.removeAll（）`，则其他组件的补间也将被更新或删除。

### 创建你自己的补间组

为了解决这个问题，每个组件都可以创建自己的 `TWEEN.Group` 实例（这是全局的 `TWEEN` 对象在内部使用的）。 实例化新的补间时，可以将这些组作为第二个可选参数传入：

```js
var groupA = new TWEEN.Group()
var groupB = new TWEEN.Group()

var tweenA = new TWEEN.Tween({x: 1}, groupA).to({x: 10}, 100).start()

var tweenB = new TWEEN.Tween({x: 1}, groupB).to({x: 10}, 100).start()

var tweenC = new TWEEN.Tween({x: 1}).to({x: 10}, 100).start()

groupA.update() // 只更新tweenA
groupB.update() // 只更新tweenB
TWEEN.update() // 只更新tweenC

groupA.removeAll() // 只移除tweenA
groupB.removeAll() // 只移除tweenB
TWEEN.removeAll() // 只移除tweenC
```

通过这种方式，每个组件都可以处理创建，更新和销毁自己的一组补间。

## 改变缓动功能

Tween.js 将以线性方式执行值之间的插值（即缓动），所以变化将与流逝的时间成正比。 这是可以预见的，但在视觉上也是相当无趣的。 不要担心 - 使用缓动方法可以轻松更改此行为。 例如：

```js
tween.easing(TWEEN.Easing.Quadratic.In)
```

这将导致缓慢地开始向最终值变化，向中间加速，然后迅速达到其最终值，相反，`TWEEN.Easing.Quadratic.Out` 一开始会加速，但随着值的接近最终放缓。

### 可用的缓动函数：TWEEN.Easing

tween.js 提供了一些现有的缓动功能。它们按照它们表示的方程式进行分组：线性，二次，三次，四次，五次，正弦，指数，圆形，弹性，背部和弹跳，然后是缓动型：In，Out 和 InOut。

除非您已经熟悉这些概念，否则这些名称可能不会对您说什么，所以您可能需要查看 [Graphs](https://github.com/tweenjs/tween.js/blob/master/examples/03_graphs.html) 示例，该示例将一个页面中的所有曲线进行图形化，以便比较它们如何看待一瞥。

这些功能是从 Robert Penner 慷慨地提供几年前作为自由软件提供的原始方程派生而来的，但是已经被优化以便与 JavaScript 很好地发挥作用。

### 使用自定义缓动功能

您不仅可以使用任何现有的功能，还可以提供您自己的功能，只要遵循一些约定即可：

- 它必须接受一个参数：
  - `k`: 缓动过程，或我们的补间所处的时间有多长。允许的值在[0，1]的范围内。
- 它必须根据输入参数返回一个值。

不管要修改多少个属性，easing 函数在每次更新时只调用一次。 然后将结果与初始值以及这个值和最终值之间的差值（delta）一起使用，就像这个伪代码一样：

```js
easedElapsed = easing(k);
for each property:
	newPropertyValue = initialPropertyValue + propertyDelta * easedElapsed;
```

对于更注重性能表现的人来说：只有在补间上调用 `start()` 时才会计算增量值。

因此，让我们假设您想使用一个缓解值的自定义缓动函数，但是将 Math.floor 应用于输出，所以只返回整数部分，从而产生一种梯级输出:

```js
function tenStepEasing(k) {
	return Math.floor(k * 10) / 10
}
```

你可以通过简单地调用它的缓动方法来使用它，就像我们之前看到的那样：

```js
tween.easing(tenStepEasing)
```

查看 [graphs for custom easing functions](https://github.com/tweenjs/tween.js/blob/master/examples/12_graphs_custom_functions.html) 示例，以查看这个动作（还有一些用于生成步进函数的元编程）。

## 回调函数

另一个强大的特性是能够在每个补间的生命周期的特定时间运行自己的功能。 当更改属性不够时，通常需要这样做。

例如，假设你正在试图给一些不能直接访问属性的对象设置动画，但是需要你调用 setter。 您可以使用 `update` 回调来读取新的更新值，然后手动调用 setters。 所有的回调函数都将补间对象作为唯一的参数。

```js
var trickyObjTween = new TWEEN.Tween({
	propertyA: trickyObj.getPropertyA(),
	propertyB: trickyObj.getPropertyB(),
})
	.to({propertyA: 100, propertyB: 200})
	.onUpdate(function (object) {
		object.setA(object.propertyA)
		object.setB(object.propertyB)
	})
```

或者想象一下，当一个补间开始时，你想播放声音。你可以使用 `start` 回调：

```js
var tween = new TWEEN.Tween(obj).to({x: 100}).onStart(function () {
	sound.play()
})
```

每个回调的范围是补间对象--在这种情况下，是 `obj`。

### onStart

在补间开始之前执行--i.e. 在计算之前。每个补间只能执行一次，i.e. 当通过 `repeat()` 重复补间时，它将不会运行。

同步到其他事件或触发您要在补间启动时发生的操作是非常好的。

补间对象作为第一个参数传入。

### onStop

当通过 `stop()` 显式停止补间时执行，但在正常完成时并且在停止任何可能的链补间之前执行补间。

补间对象作为第一个参数传入。

### onUpdate

每次补间更新时执行，实际更新后的值。

补间对象作为第一个参数传入。

### onComplete

当补间正常完成（即不停止）时执行。

补间对象作为第一个参数传入。

## 高级补间

### 相对值

使用 `to` 方法时，也可以使用相对值。 当 tween 启动时，Tween.js 将读取当前属性值并应用相对值来找出新的最终值。
**但是你需要使用引号**，否则这些值将被视为绝对的。 我们来看一个例子:

```js
// This will make the `x` property be 100, always
var absoluteTween = new TWEEN.Tween(absoluteObj).to({x: 100})

// Suppose absoluteObj.x is 0 now
absoluteTween.start() // Makes x go to 100

// Suppose absoluteObj.x is -100 now
absoluteTween.start() // Makes x go to 100

// In contrast...

// This will make the `x` property be 100 units more,
// relative to the actual value when it starts
var relativeTween = new TWEEN.Tween(relativeObj).to({x: '+100'})

// Suppose relativeObj.x is 0 now
relativeTween.start() // Makes x go to 0 +100 = 100

// Suppose relativeObj.x is -100 now
relativeTween.start() // Makes x go to -100 +100 = 0
```

查看 [09_relative_values](https://github.com/tweenjs/tween.js/blob/master/examples/09_relative_values.html) 示例。

### 补间值的数组

除了补间为绝对值或相对值之外，还可以让 Tween.js 跨一系列值更改属性。 要做到这一点，你只需要指定一个数组的值，而不是一个属性的单个值。 例如：

```js
var tween = new TWEEN.Tween(relativeObj).to({x: [0, -100, 100]})
```

将使 `x` 从初始值变为 0，-100 和 100。

这些值的计算方法如下：

- 首先，补间进度如常计算
- 进度（从 0 到 1）用作插值函数的输入
- 基于进度和值的数组，生成内插值

例如，当补间刚刚启动（进度为 0）时，插值函数将返回数组中的第一个值。 当补间到一半时，插值函数将返回一个大约在数组中间的值，当补间结束时，插值函数将返回最后一个值。

您可以使用插值方法更改插值函数。 例如：

```js
tween.interpolation(TWEEN.Interpolation.Bezier)
```

以下值可用：

- TWEEN.Interpolation.Linear
- TWEEN.Interpolation.Bezier
- TWEEN.Interpolation.CatmullRom

默认是 `Linear`。

请注意，插值函数对于与同一补间中的数组进行补间的所有属性是全局的。
您不能使用数组和线性函数进行属性 A 的更改，也不能使用相同的补间进行数组 B 的属性 B 和 Bezier 函数的更改; 您应该使用运行在同一对象上的两个补间对象，但修改不同的属性并使用不同的插值函数。

查看 [06_array_interpolation](https://github.com/tweenjs/tween.js/blob/master/examples/06_array_interpolation.html) 示例。

## 获得最佳性能

虽然 Tween.js 试图自己执行，但是没有什么能够阻止你以一种反作用的方式使用它。 这里有一些方法可以避免在使用 Tween.js 时（或者在网页中进行动画制作时）减慢项目速度。

### 使用高性能的 CSS

当您尝试在页面中设置元素的位置时，最简单的解决方案是为 `top` 和 `left` 属性设置动画，如下所示：

```js
var element = document.getElementById('myElement')
var tween = new TWEEN.Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.top = object.top + 'px'
	element.style.left = object.left + 'px'
})
```

但这实际上是效率低下的，因为改变这些属性会迫使浏览器在每次更新时重新计算布局，这是非常昂贵的操作。 相反的，您应该使用 `transform`，这不会使布局无效，并且在可能的情况下也将被硬件加速，比如：

```js
var element = document.getElementById('myElement')
var tween = new TWEEN.Tween({top: 0, left: 0}).to({top: 100, left: 100}, 1000).onUpdate(function (object) {
	element.style.transform = 'translate(' + object.left + 'px, ' + object.top + 'px);'
})
```

如果你想了解更多关于这个，看看[这篇文章](https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/)。

但是，如果您的动画需求非常简单，那么在适用的情况下使用 CSS 动画或转换可能会更好，以便浏览器尽可能优化。
当您的动画需要涉及复杂的布局时，Tween.js 是非常有用的，也就是说，您需要将多个补间同步到一起，在完成一些动作之后，循环多次等等。

### 对垃圾收集器（别名 GC）

如果你使用 onUpdate 回调函数，你需要非常小心的使用它。 因为这个函数每秒钟会被调用很多次，所以如果每次更新都要花费很多的代价，那么你可能会阻塞主线程并导致可怕的结果，或者如果你的操作涉及到内存分配的话， 垃圾收集器运行太频繁，也导致结果。 所以只是不要做些事情中的其中一个。 保持你的 onUpdate 回调非常轻量级，并确保在开发时也使用内存分析器。

### 疯狂的补间

这是你可能不经常使用的东西，但是你可以在 Tween.js 之外使用补间公式。 毕竟，它们只是功能。 所以你可以使用它们来计算平滑曲线作为输入数据。
例如，他们用于在 [这个实验](http://5013.es/toys/tween.audio/) 中生成音频数据。
