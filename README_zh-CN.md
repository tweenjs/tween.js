# tween.js

用于简单动画的 JavaScript (TypeScript) 补间引擎，结合优化的 Robert Penner 方程式。

[![NPM Version][npm-image]][npm-url]
[![CDNJS][cdnjs-image]][cdnjs-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build and Tests][ci-image]][ci-url]

更多语言: [English](./README.md), [简体中文](./README_zh-CN.md)

---

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/20.0.0/tween.umd.js"></script>

<div id="box"></div>

<style>
	#box {
		background-color: deeppink;
		width: 100px;
		height: 100px;
	}
</style>

<script>
	const box = document.getElementById('box') // 获取我们想要设置动画的元素。

	const coords = {x: 0, y: 0} // 从 (0, 0) 开始

	const tween = new TWEEN.Tween(coords, false) // 创建一个修改“坐标”的新 tween。
		.to({x: 300, y: 200}, 1000) // 在 1 秒内移动到 (300, 200)。
		.easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动函数使动画流畅。
		.onUpdate(() => {
			// 在 tween.js 更新“坐标”后调用。
			// 使用 CSS transform 将 'box' 移动到 'coords' 描述的位置。
			box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)')
		})
		.start() // 立即开始 tween。

	// 设置动画循环。
	function animate(time) {
		tween.update(time)
		requestAnimationFrame(animate)
	}
	requestAnimationFrame(animate)
</script>
```

[在 CodePen 上试试这个例子](https://codepen.io/trusktr/pen/KKGaBVz?editors=1000)

## 安装

## 从 CDN 安装

从上例中的内容分发网络 (CDN) 安装。

cdnjs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/20.0.0/tween.umd.js"></script>
```

或者 unpkg.com:

```html
<script src="https://unpkg.com/@tweenjs/tween.js@^20.0.0/dist/tween.umd.js"></script>
```

请注意，unpkg.com 支持 URL 中的 semver 版本，其中 URL 中的 `^` 告诉 unpkg 为你提供最新版本 20.x.x。

## 使用 script 标签构建并包含在你的项目中

目前需要 npm 来构建项目。

```bash
git clone https://github.com/tweenjs/tween.js
cd tween.js
npm install
npm run build
```

这将在 `dist` 目录中创建一些构建。 目前有两种不同的库版本：

- UMD : `tween.umd.js`
- ES6 Module : `tween.es.js`

你现在可以将 tween.umd.js 复制到你的项目中，然后将其包含在一个 script 标签，它将 TWEEN 添加到全局范围，

```html
<script src="path/to/tween.umd.js"></script>
```

或将 TWEEN 作为 JavaScript 模块导入，

```html
<script type="module">
	import * as TWEEN from 'path/to/tween.es.js'
</script>
```

其中 `path/to` 替换为你放置文件的位置。

## 使用 `npm install` 和 `import` 从 `node_modules` 中添加

你可以将 tween.js 添加为 npm 依赖项：

```bash
npm install @tweenjs/tween.js
```

### 使用构建工具

如果你使用 [Node.js](https://nodejs.org/)、[Parcel](https://parceljs.org/)、[Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/)、[Vite](https://vitejs.dev/) 或者其他的构建工具，那么你现在可以使用以下方式来导入 tween.js：

```javascript
import * as TWEEN from '@tweenjs/tween.js'
```

### 没有构建工具

如果你将 `node_modules` 作为网站的一部分提供服务，则可以使用 `importmap` script 标签从 `node_modules` 导入。 首先，假设 `node_modules` 位于你网站的根目录，你可以编写一个导入映射：

```html
<script type="importmap">
	{
		"imports": {
			"@tweenjs/tween.js": "/node_modules/@tweenjs/tween.js/dist/tween.es.js"
		}
	}
</script>
```

现在，在任何 module script 中，你都可以通过包名导入它：

```javascript
import * as TWEEN from '@tweenjs/tween.js'
```

# 特性

- 做一件事并且只做一件事：补间属性
- 不处理 CSS 单位（例如附加 `px`）
- 不插值颜色
- 缓动函数可在 Tween 之外重复使用
- 也可以使用自定义缓动函数

# 文档

<table>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/00_hello_world.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/00_hello_world.png" alt="hello world" />
			</a>
		</td>
		<td>
			hello world<br />
			(<a href="examples/00_hello_world.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/01_bars.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/01_bars.png" alt="Bars" />
			</a>
		</td>
		<td>
			Bars<br />
			(<a href="examples/01_bars.html">source</a>)
		</td>
	<tr>
	</tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/02_black_and_red.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/02_black_and_red.png" alt="Black and red" />
			</a>
		</td>
		<td>
			Black and red<br />
			(<a href="examples/02_black_and_red.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/03_graphs.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Graphs" />
			</a>
		</td>
		<td>
			Graphs<br />
			(<a href="examples/03_graphs.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/04_simplest.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/04_simplest.png" alt="Simplest possible example" />
			</a>
		</td>
		<td>
			Simplest possible example<br />
			(<a href="examples/04_simplest.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/05_video_and_time.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/06_video_and_time.png" alt="Video and time" />
			</a>
		</td>
		<td>
			Video and time<br />
			(<a href="examples/05_video_and_time.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/06_array_interpolation.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Array interpolation" />
			</a>
		</td>
		<td>
			Array interpolation<br />
			(<a href="examples/06_array_interpolation.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07_dynamic_to.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/07_dynamic_to.png" alt="Dynamic to, object" />
			</a>
		</td>
		<td>
			Dynamic to, object<br />
			(<a href="examples/07_dynamic_to.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07a_dynamic_to_two_array_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/07a_dynamic_to.png" alt="Dynamic to, interpolation array" />
			</a>
		</td>
		<td>
			Dynamic to, interpolation array<br />
			(<a href="examples/07a_dynamic_to_two_array_values.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/07b_dynamic_to_an_array_of_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/07b_dynamic_to.png" alt="Dynamic to, large interpolation array" />
			</a>
		</td>
		<td>
			Dynamic to, large interpolation array<br />
			(<a href="examples/07b_dynamic_to_an_array_of_values.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/08_repeat.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/08_repeat.png" alt="Repeat" />
			</a>
		</td>
		<td>
			Repeat<br />
			(<a href="examples/08_repeat.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/09_relative_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/09_relative.png" alt="Relative values" />
			</a>
		</td>
		<td>
			Relative values<br />
			(<a href="examples/09_relative_values.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/10_yoyo.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/10_yoyo.png" alt="Yoyo" />
			</a>
		</td>
		<td>
			Yoyo<br />
			(<a href="examples/10_yoyo.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/11_stop_all_chained_tweens.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/11_stop_all_chained_tweens.png" alt="Stop all chained tweens" />
			</a>
		</td>
		<td>
			Stop all chained tweens<br />
			(<a href="examples/11_stop_all_chained_tweens.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/12_graphs_custom_functions.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/03_graphs.png" alt="Custom functions" />
			</a>
		</td>
		<td>
			Custom functions<br />
			(<a href="examples/12_graphs_custom_functions.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/13_relative_start_time.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/13_relative_start_time.png" alt="Relative start time" />
			</a>
		</td>
		<td>
			Relative start time<br />
			(<a href="examples/13_relative_start_time.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/14_pause_tween.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/14_pause_tween.png" alt="Pause tween" />
			</a>
		</td>
		<td>
			Pause tween<br />
			(<a href="examples/14_pause_tween.html">source</a>)
		</td>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/15_complex_properties.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/15_complex_properties.png" alt="Complex properties" />
			</a>
		</td>
		<td>
			Complex properties<br />
			(<a href="examples/15_complex_properties.html">source</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://tweenjs.github.io/tween.js/examples/16_animate_an_array_of_values.html">
				<img width="100" height="50" src="https://tweenjs.github.io/tween.js/assets/examples/16_animate_an_array_of_values.png" alt="Animate an array of values" />
			</a>
		</td>
		<td>
			Animate an array of values<br />
			(<a href="examples/16_animate_an_array_of_values.html">source</a>)
		</td>
	</tr>
</table>

# 测试

你需要先安装 `npm`——它随 node.js 一起提供，因此请先安装它。 然后，cd 到 `tween.js` 的（或你克隆 repo 的任何地方）目录并运行：

```bash
npm install
```

运行测试：

```bash
npm test
```

如果你想添加任何功能或更改现有功能，你 _必须_ 运行测试以确保你没有破坏任何其他功能。任何拉取请求 (PR) 都需要在 `src/tests.ts` 中更新通过功能更改测试（或通过新功能或修复的新测试）才能接受 PR。 有关更多信息，请参阅 [贡献](CONTRIBUTING.md)。

# 使用 tween.js 的项目

[<img src="./assets/projects/11_lume.jpg" width="100" alt="Lume" />](https://lume.io)
[![A-Frame VR](https://tweenjs.github.io/tween.js/assets/projects/10_aframe.png)](https://aframe.io)
[![MOMA Inventing Abstraction 1910-1925](https://tweenjs.github.io/tween.js/assets/projects/09_moma.png)](http://www.moma.org/interactives/exhibitions/2012/inventingabstraction/)
[![Web Lab](https://tweenjs.github.io/tween.js/assets/projects/08_web_lab.png)](http://www.chromeweblab.com/)
[![MACCHINA I](https://tweenjs.github.io/tween.js/assets/projects/07_macchina.png)](http://5013.es/toys/macchina)
[![Minesweeper 3D](https://tweenjs.github.io/tween.js/assets/projects/06_minesweeper3d.png)](http://egraether.com/mine3d/)
[![ROME](https://tweenjs.github.io/tween.js/assets/projects/05_rome.png)](http://ro.me)
[![WebGL Globe](https://tweenjs.github.io/tween.js/assets/projects/04_webgl_globe.png)](http://data-arts.appspot.com/globe)
[![Androidify](https://tweenjs.github.io/tween.js/assets/projects/03_androidify.png)](http://www.androidify.com/)
[![The Wilderness Downtown](https://tweenjs.github.io/tween.js/assets/projects/01_wilderness.png)](http://thewildernessdowntown.com/)
[![Linechart](https://tweenjs.github.io/tween.js/assets/projects/00_linechart.png)](http://dejavis.org/linechart)

[npm-image]: https://img.shields.io/npm/v/@tweenjs/tween.js.svg
[npm-url]: https://npmjs.org/package/@tweenjs/tween.js
[downloads-image]: https://img.shields.io/npm/dm/@tweenjs/tween.js.svg
[downloads-url]: https://npmjs.org/package/@tweenjs/tween.js
[ci-image]: https://github.com/tweenjs/tween.js/workflows/build%20and%20tests/badge.svg?branch=master
[ci-url]: https://github.com/tweenjs/tween.js/actions
[cdnjs-image]: https://img.shields.io/cdnjs/v/tween.js.svg
[cdnjs-url]: https://cdnjs.com/libraries/tween.js
