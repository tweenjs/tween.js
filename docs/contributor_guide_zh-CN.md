# tween.js 贡献者指南

更多语言: [English](./contributor_guide.md), [简体中文](./contributor_guide_zh-CN.md)

本指南适用于想要为该库做出贡献的人，或者对了解幕后情况感到好奇的人：如何进行测试？我们自动化了什么？我们如何发布？等等。

如果你正在寻找如何使用库的文档，[用户指南](./user_guide_zh-CN.md)适合你。

**注意：本文档是正在进行的工作。更多内容将分阶段添加。如果你有想看到解答的问题，请在[此 issue 的评论](https://github.com/tweenjs/tween.js/issues/323)中添加它们。谢谢！**

本指南内容：

- [tween.js 贡献者指南](#tweenjs-贡献者指南)
  - [开发者要求](#开发者要求)
  - [测试](#测试)
    - [单元测试](#单元测试)
    - [代码风格和 lint 测试](#代码风格和-lint-测试)
    - [其他类型的测试](#其他类型的测试)
  - [持续集成](#持续集成)
  - [发布流程](#发布流程)

## 开发者要求

虽然 tween.js 不需要 node.js 即可运行，但我们在开发中使用它。因此，在能够使用该库之前，你需要[安装 node.js](https://nodejs.org/en/download/)。

Node.js 包含我们用来运行脚本的 `npm` 工具，例如打包、运行测试等脚本。在尝试运行下面详述的任何步骤之前，请确保它在你的系统中正常工作。

安装 node.js 后，克隆 tween.js 存储库：

```bash
git clone https://github.com/tweenjs/tween.js.git
```

切换到该文件夹：

```bash
cd tween.js
```

并运行脚本来安装开发依赖项：

```bash
npm install
```

或者三行代码：

```bash
git clone https://github.com/tweenjs/tween.js.git
cd tween.js
npm install
```

`npm install` 成功完成后，尝试运行测试：

```bash
npm test
```

如果你在运行上述任何命令时遇到问题，请尝试使用你选择的搜索引擎搜索错误文本。这通常是最快的解决方案，因为许多人可能已经遇到了相同的问题。

## 测试

`test` 目录中有一套自动化测试。

这些测试可以快速发现代码中的回归问题——在添加新功能或更改代码以修复错误时很有用；我们不想引入新的错误！它们还会发现风格问题，这有助于保持库的凝聚力。

要运行测试，请输入：

```bash
npm test
```

你应该在更改库中的代码后运行测试。如果你更改了测试所描述的行为，测试将不会通过，你将得到指向失败测试的错误。这可能是因为……

- 你忽略了某些内容或代码中有错误，或者……
- 库或测试本身是错误的

更频繁发生的是第一种情况，但第二种情况也有发生，在边缘情况下。

**自动化测试通过后你应该做的另一件事是运行 `examples` 文件夹中的示例**。这种情况很少见，但可能发生你的更改引入了自动化测试没有检查的外观差异，注意到这一点的唯一方法是运行示例并让人眼发现输出中的差异。如果你不想检出库的两个副本，可以查看[在线示例](https://github.com/tweenjs/tween.js#examples)。

### 单元测试

测试位于 `src/tests.ts` 文件中。

测试使用 [nodeunit](https://www.npmjs.com/package/nodeunit) 执行。

**TODO：** 如果在浏览器中打开 `test/unit/nodeunit.html`，测试也应该能正常工作，但目前它们已损坏。有一个[未解决的 issue](https://github.com/tweenjs/tween.js/issues/307) 使其重新工作。

### 代码风格和 lint 测试

我们使用 [Prettier](https://prettier.io) 和 [ESLint](https://eslint.org) 来确保代码风格统一。

要自动格式化代码并报告不能自动格式化的代码片段的任何错误，请运行：

```bash
npm run test-lint
```

Prettier 规则在 `.prettierrc.js` 中，ESLint 规则在 `.eslintrc.js` 中。

### 其他类型的测试

我们希望测试性能回归，即更改是否使事情变慢，或者简单地测试性能，这样我们可以比较不同浏览器之间相同代码的性能。

有一个[未解决的 issue](https://github.com/tweenjs/discuss/issues/3) 来跟踪这方面的工作，但我们还没有取得进展。求助！:-)

## 持续集成

我们使用 GitHub Actions 进行持续集成，以便为每个拉取请求运行构建和测试。`.github/workflows/tests.yml` 文件告诉 GitHub 要运行什么；在我们的情况下，我们在该文件中指定的操作系统和 Node.js 版本中运行 `npm install`，然后运行 `npm test`。

**TODO：** 将 macOS 和 Windows 添加到运行测试的操作系统中。求助！:)

## 发布流程

目前发布流程是手动的。

当准备在 `master` 分支上发布时，确保没有未提交的更改，然后运行 `npm run release:patch` 来发布补丁版本号递增的新版本，运行 `npm run release:minor` 来发布次版本号递增的新版本，或运行 `npm run release:major` 来发布主版本号递增的新版本。

提示：请参阅 [semver.org](https://semver.org) 和 [npm-semver](https://docs.npmjs.com/misc/semver) 文档来了解语义版本控制。