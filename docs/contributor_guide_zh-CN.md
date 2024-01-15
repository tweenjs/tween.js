# tween.js 贡献者指南

更多语言: [English](./contributor_guide.md), [简体中文](./contributor_guide_zh-CN.md)

本指南适用于想要向库贡献的人，或者想了解背后的内容：如何进行测试？我们自动化什么？我们如何做发布？等等。

如果你正在查找*如何使用*库的文档，[用户指南](./user_guide_zh-CN.md) 是适合你的。

**NOTE: 这个文档是一个正在进行的工作。更多内容将分阶段添加。如果你有问题，你想看到回答，请在 [as comments on this issue](https://github.com/tweenjs/tween.js/issues/323) 中提出，谢谢！**

目录:

- [tween.js 贡献者指南](#tween.js-贡献者指南)
- [开发者要求](#开发者要求)
- [测试](#测试)
  - [单元测试](#单元测试)
  - [代码风格和 lint 测试](#代码风格和-lint-测试)
  - [其他类型的测试](#其他类型的测试)
- [持续集成](#持续集成)
- [发布流程](#发布流程)

## 开发者要求

虽然 tween.js *不*需要依赖 node.js 运行，但我们使用 node.js 来进行开发。所以我们需要先 [安装 node.js](https://nodejs.org/en/download/)，然后才能在库中工作。

Node.js 包括我们用来运行脚本的 npm 工具，例如打包、运行测试等的脚本。在你尝试运行下面详述的任何步骤之前，请确保它在你的系统中正常工作。

安装 node.js 后，克隆 tween.js 存储库：

```bash
git clone https://github.com/tweenjs/tween.js.git
```

进入该文件夹：

```bash
cd tween.js
```

并运行脚本来安装开发依赖项：

```bash
npm install
```

或者分三行：

```bash
git clone https://github.com/tweenjs/tween.js.git
cd tween.js
npm install
```

`npm install` 成功完成后，尝试运行测试：

```bash
npm test
```

如果你在运行上述任何步骤时遇到问题，请尝试使用你选择的搜索引擎搜索错误文本。这通常是最快的解决方法，因为很多人可能已经遇到过同样的问题。

## 测试

`test` 目录中有一套自动化测试。

这些可以快速发现代码上的回归，在添加新功能或更改代码以修复 Bug 时很有用；我们不想引入新的 Bugs！自动化测试还会发现风格问题，这有助于我们保持库的凝聚力。

要运行测试，请输入：

```bash
npm test
```

你应该在更改库中的代码后运行测试。如果你更改测试描述的行为，测试将不会通过，你将得到指向失败测试的错误。 这可能是因为...

- 你忽略了一些东西，或者你的代码有错误，或者...
- 库或测试本身是错误的

以上两种情况，发生频率更高的是第一个，但第如果二个发生了，可能是边缘情况。

**自动化测试通过之后，你应该做的另一件事是运行 `examples` 文件夹中的示例**。有种情况很少见，但可能会发生：你的更改引入了自动测试未检查的外观差异，注意到这一点的唯一方法是运行示例并让人工发现输出中的差异。如果你不想签出库的两个副本，可以查看[在线例子](https://github.com/tweenjs/tween.js#examples)。

### 单元测试

测试用例在 `src/tests.ts` 文件中。

测试使用 [nodeunit](https://www.npmjs.com/package/nodeunit) 执行。

**TODO:** 如果在浏览器中打开 `test/unit/nodeunit.html`，测试也应该能够正常运行，但是现在已经被损坏。有一个 [打开的问题](https://github.com/tweenjs/tween.js/issues/307) 可以使他们再次工作。

### 代码风格和 lint 测试

我们使用 [JSCS](http://jscs.info/) 和 [JSHint](http://jshint.com/) 来保证代码风格的统一。

要自动格式化代码并报告不可被格式化的代码片段的任何错误，请运行：

```base
npm run test-lint
```

Prettier 规则在 `.prettierrc.js` 中，ESLint 规则在 `.eslintrc.js` 中。

### 其他类型的测试

我们想回归测试性能，即如果更改使运行变得更慢，或者简单地测试性能，那么我们可以比较不同浏览器之间相同代码的性能。

有一个[open issue](https://github.com/tweenjs/discuss/issues/3)来跟踪这方面的工作，但我们还没有取得进展。请求帮助！ :-)

## 持续集成

我们使用 GitHub Actions 进行持续集成，以便为每个 pull request 运行构建和测试。 `.github/workflows/tests.yml` 文件告诉 GitHub 要运行什么；在我们的例子中，我们在该文件中指定的操作系统和 Node.js 版本中运行 `npm install`，然后运行 `npm test`。

**TODO**：将 macOS 和 Windows 添加到运行测试的操作系统。 请求帮助！ :)

## 发布流程

目前发布过程是手动的。

当准备好在 `master` 分支上发布时，确保没有未提交的更改，然后运行 `npm run release:patch` 发布一个新版本，其补丁号已被修改，`npm run release:minor` ，修改 minor 版本号并发布一个新版本，或者 `npm run release:major` 修改 major 版本号并发布一个新版本。

Tip: 请参阅 [semver.org](https://semver.org/) 和 [npm-semver](https://docs.npmjs.com/misc/semver) 文档以了解语义版本控制。
