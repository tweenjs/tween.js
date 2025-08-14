# tween.js

用于简单动画的 JavaScript (TypeScript) 补间引擎，结合优化的 Robert Penner 方程式。

[![NPM Version][npm-image]][npm-url]
[![CDNJS][cdnjs-image]][cdnjs-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build and Tests][ci-image]][ci-url]

更多语言: [English](./README.md), [简体中文](./README_zh-CN.md)

---

```html
<div id="box"></div>

<style>
	#box {
		background-color: deeppink;
		width: 100px;
		height: 100px;
	}
</style>

<script type="module">
	import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'

	const box = document.getElementById('box') // 获取我们想要设置动画的元素。

	const coords = {x: 0, y: 0} // 从 (0, 0) 开始

	const tween = new Tween(coords, false) // 创建一个修改"坐标"的新 tween。
		.to({x: 300, y: 200}, 1000) // 在 1 秒内移动到 (300, 200)。
		.easing(Easing.Quadratic.InOut) // 使用缓动函数使动画流畅。
		.onUpdate(() => {
			// 在 tween.js 更新"坐标"后调用。
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

# 特性

- 专注于一件事并且做得很好：补间对象的属性
- 不处理 CSS 单位（例如添加 `px`）
- 不插值颜色
- 缓动函数可在 Tween 之外重复使用
- 也可以使用自定义缓动函数
- 不创建自己的动画循环，使其能够灵活地集成到
  任何动画循环中。

# 示例

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

# 安装

推荐的方法是使用 `import` 语法。这里我们列出了各种安装方法，大致按照最推荐到最不推荐的顺序排列。请评估以下所有方法，选择最适合你项目的方法。

## 使用 `npm install` 和从 `node_modules` 导入

你可以将 tween.js 添加为 npm 依赖项：

```bash
npm install @tweenjs/tween.js
```

### 不使用构建工具

#### 本地安装

如果你将 `node_modules` 作为网站的一部分提供服务，可以使用标准的 `importmap` 脚本标签从 `node_modules` 导入。首先，假设 `node_modules` 位于你网站的根目录，你可以在 HTML 文件中编写导入映射：

```html
<script type="importmap">
	{
		"imports": {
			"@tweenjs/tween.js": "/node_modules/@tweenjs/tween.js/dist/tween.esm.js"
		}
	}
</script>
```

现在在任何模块脚本中，你都可以通过包名导入 Tween.js：

```html
<script type="module">
	import {Tween} from '@tweenjs/tween.js'
</script>
```

#### 从 CDN 导入

请注意，没有 `importmap` 的情况下，你可以像上面第一个示例一样直接从 CDN 导入：

```html
<script type="module">
	import {Tween} from 'https://unpkg.com/browse/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'
</script>
```

如果你愿意，也可以将 `importmap` 链接到 CDN 而不是本地的 `node_modules` 文件夹：

```html
<script type="importmap">
	{
		"imports": {
			"@tweenjs/tween.js": "https://unpkg.com/browse/@tweenjs/tween.js@23.1.3/dist/tween.esm.js"
		}
	}
</script>

<script type="module">
	import {Tween} from '@tweenjs/tween.js'
</script>
```

### 使用构建工具

如果你使用 [Node.js](https://nodejs.org/)、[Parcel](https://parceljs.org/)、[Webpack](https://webpack.js.org/)、[Rollup](https://rollupjs.org/)、[Vite](https://vitejs.dev/) 或其他构建工具，那么你可以使用 `npm install @tweenjs/tween.js` 安装，然后将库 `import` 到你的 JavaScript（或 TypeScript）文件中，构建工具会知道如何从 `node_modules` 找到源代码，而无需创建 `importmap` 脚本：

```javascript
import * as TWEEN from '@tweenjs/tween.js'
```

但是请注意，这种方法需要始终运行构建工具才能使你的应用程序工作，而 `importmap` 方法无需任何构建工具即可作为简单的静态 HTML 站点工作。

## 手动构建

另一种方法是使用 git 下载源代码，手动构建库，然后将输出放置在你的项目中。这需要 Node.js。

```bash
git clone https://github.com/tweenjs/tween.js
cd tween.js
npm install
npm run build
```

这将在 `dist` 目录中创建一些构建文件。目前有两种不同的库构建版本：

- ES6 模块在 `/dist/tween.esm.js`（推荐）
- UMD 在 `/dist/tween.umd.js`（已弃用，将在未来的主要版本中删除）

你现在可以将这两个文件中的一个复制到你的项目中，并像这样使用（推荐）：

```html
<script type="module">
	import {Tween} from 'path/to/tween.esm.js'
</script>
```

或（已弃用，将在未来的主要版本中删除）：

```html
<script src="path/to/tween.umd.js"></script>
<script>
	const {Tween} = TWEEN
</script>
```

其中 `path/to` 替换为你放置文件的位置。

> [!Note]
> 你也可以从 unpkg 下载这些文件，例如：
> https://unpkg.com/browse/@tweenjs/tween.js@23.1.3/dist/

## 从 CDN 使用全局变量（已弃用）

> [!Note]
> 此方法已弃用，将在未来的主要版本中删除！

使用 UMD 文件从内容分发网络（CDN）安装全局 `TWEEN` 变量。

从 cdnjs：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/23.1.3/tween.umd.js"></script>
```

或从 unpkg.com：

```html
<script src="https://unpkg.com/@tweenjs/tween.js@^23.1.3/dist/tween.umd.js"></script>
```

然后在任何脚本中使用 `TWEEN` 变量：

```html
<script>
	const {Tween, Easing, Group /*, ...*/} = TWEEN

	const tween = new Tween(someObject)
	// ...
</script>
```

> [!Note]
> unpkg.com 支持 URL 中的 semver 版本，其中 URL 中的 `^` 告诉 unpkg 提供最新版本 20.x.x。

## CommonJS（已弃用）

如果你不知道 CommonJS 是什么，请跳过此部分！

> [!Note]
> 此方法已弃用，将在未来的主要版本中删除！

以上任何方法都适用于仍使用 CommonJS 的旧系统。重复以上任何方法，但使用 `dist/tween.cjs` 而不是 `dist/tween.esm.js` 或 `dist/tween.umd.js`。

# 文档

- [用户指南](./docs/user_guide_zh-CN.md)
- [贡献者指南](./docs/contributor_guide_zh-CN.md)
- 使用 tween.js 与 three.js 的[教程](https://web.archive.org/web/20220601192930/http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/)
- 另见：[libtween](https://github.com/jsm174/libtween)，由 [jsm174](https://github.com/jsm174) 将 tween.js 移植到 C 的版本

# 测试

你需要先安装 `npm`——它随 node.js 一起提供，因此请先安装它。然后，cd 到 `tween.js` 的（或你克隆 repo 的任何地方）目录并运行：

```bash
npm install
```

运行测试：

```bash
npm test
```

如果你想添加任何功能或更改现有功能，你 _必须_ 运行测试以确保你没有破坏任何其他功能。任何拉取请求 (PR) 都需要在 `src/tests.ts` 中为功能更改提供更新的通过测试（或为新功能或修复提供新的通过测试）才能被接受。有关更多信息，请参阅 [贡献](CONTRIBUTING.md)。

# 人员

维护者：[Joe Pea (@trusktr)](https://github.com/trusktr)。

[所有贡献者](http://github.com/tweenjs/tween.js/contributors)。

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
