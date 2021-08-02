# tween.js 贡献者指南

本指南适用于想要向库贡献的人,或者想了解背后的内容:如何进行测试?我们自动化什么?我们如何做发布?等等.

如果您正在查找*如何使用*库的文档，[用户指南](./ user_guide_zh-CN.md)是适合你的。

**这个文档是一个正在进行的工作.更多内容将分阶段添加.如果你有问题,你想看到回答,请在 [as comments on this issue](https://github.com/tweenjs/tween.js/issues/323) 中提出.谢谢!**

目录:

- [开发者要求](#developer-requirements)
- [测试](#testing)
- [持续集成](#continuous-integration)
- [发布过程](#release-process)

## 开发者要求

虽然 tween.js*不*需要 nodejs 工作,我们用它来开发.所以我们需要 [安装 nodejs](https://nodejs.org/en/download/),然后才能在库中工作.

Node.js 包含了我们使用的`npm`工具来运行脚本,比如打包,运行测试等等.请确保它在你的系统中正常工作,然后再尝试运行下面详述的任何步骤。

一旦安装了 node.js,请克隆 tween.js 仓库:

```bash
git clone https://github.com/tweenjs/tween.js.git
```

进入该文件夹

```bash
cd tween.js
```

运行脚本安装依赖

```bash
npm install
```

或者三行:

```bash
git clone https://github.com/tweenjs/tween.js.git
cd tween.js
npm install
```

一旦`npm install`成功,试着运行测试:

```bash
npm test
```

如果您遇到上述任何问题,请尝试使用你的搜索引擎搜索错误文本.这通常是最快的路线,因为许多人可能已经遇到同样的问题。

## 测试

`test`目录中有一套自动化测试.

这些可以快速找到代码上的回归,在添加新功能或更改代码以修复错误时非常有用;我们不想引入新的问题!他们还能发现代码风格问题,这有助于我们保持库 cohesive.

运行测试用例,输入:

```bash
npm test
```

在更改库中的代码后,你应该运行测试.如果你更改测试描述的行为,则测试将不会通过,你将得到指向失败测试的错误.这可能是因为...

- 你忽略了一些东西,或者你的代码有错误,或者...
- 库或测试本身是错误的

经常发生的是第一次,但第二次发生了,有边缘情况

**自动化测试通过之后,您应该执行的另一件事是运行`examples`文件夹中的示例**.这不常见,但是可能会发生这样的情况:您的更改引入了自动化测试未检查的外观差异,唯一注意到这一点的方法是运行示例,并在输出上产生差异.如果你不想捡出两个库的副本,你可以看看[在线例子](https://github.com/tweenjs/tween.js#examples).

### 单元测试

测试用例在`src/tests.ts`文件中.

测试使用[nodeunit](https://www.npmjs.com/package/nodeunit)执行.

**TODO:** 如果在浏览器中打开`test/unit/nodeunit.html`,测试也应该能够正常工作,但是现在已经被破坏了.有一个[打开的问题](https://github.com/tweenjs/tween.js/issues/307)使他们再次工作。

### 修正和样式测试

我们使用[JSCS](http://jscs.info/)和[JSHint](http://jshint.com/)来确保代码风格是统一的。

#### JSCS

这个工具可以帮助我们发现大部分"修饰"代码风格问题.例如,空格与制表符,括号之间的空格等.

运行:

```bash
npm run test-style
```

JSCS 规则在`test/jscs.json`中.

#### JSHint

这个工具帮助我们发现代码质量问题.例如,使用正确的相等运算符,未使用的变量等.

运行:

```bash
npm run test-correctness
```

JSHint 规则在`test/jshintrc`中.

### 其他类型的测试

我们想测试性能回归,也就是说,如果变化使得事情变得更慢,或者说性能变差,那么我们可以比较不同浏览器之间相同代码的性能.

有一个[open issue](https://github.com/tweenjs/discuss/issues/3)来跟踪这方面的工作,但我们还没有取得进展.请求帮助!:-)

## 持续集成

我们实施了一个持续集成系统,为我们自动完成任务.它在每次发出拉取请求时自动运行测试,并且在某些情况下还可以自动发布新版本.

如果建议的拉取请求中的变更破坏了任何内容,则贡献者可以获得反馈,而无需等待人员查看代码.此外,请求不能合并,直到测试通过.

我们正在使用 Travis CI 平台来运行测试.您会在拉请求页面的底部找到一个小信息区,让您了解测试的状态.

所有检查通过的例子:

![Automated checks OK](./imgs/pull-request-checks.png)

当检查失败时:

![Automated checks failing](./imgs/pull-request-checks-failing.png)

如果一个 pull request 通过添加新的提交被更新,测试将再次运行.

Travis 配置了`.travis.yml`文件(如果你没有在你的文件浏览器或 Finder 中看到它,那是因为文件名以一个点开头,因此它被*隐藏*了)-尝试用终端打开).

## 发布过程

我们使用[semantic-release](https://github.com/semantic-release/semantic-release)工具结合 Travis 自动[在 GitHub 上创建版本](https://github.com/tweenjs/tween.js/releases)并将它们发布到[npm](https://npmjs.org).

每次 pull request 合并时,Travis 都会运行测试.如果他们通过没有错误.Travis 将运行`after_success`步骤：

```yaml
after_success:
  - npm run semantic-release
```

这反过来会运行`package.json`中的`semantic-release`脚本:

```json
"semantic-release": "semantic-release pre && npm publish && semantic-release post"
```

当新版本发布时:

- `semantic-release`决定了下一个版本号
- 一个新的条目被添加到 GitHub 发布列表,以及包含在更改中的所有提交列表,以及一个包含该版本的 ZIP 文件,供希望下载 ZIP 的用户使用
- git commit 是用版本号(像[Bower](http://bower.io/)这样的工具使用标签)
- 它也被发布到 npm,在 package.json 里有新的版本号

**Note:** `semantic-release`的默认配置选项只在分支名称为`master`的情况下运行.否则,我们会产生大量的推送和发布,因为 Travis 在每个 pull request 中运行!

请注意`package.json`中的版本号是故意为`0.0.0-development`,因为我们不想鼓励任何人手动修改这个,但是我们也不能从文件中删除`version`字段,或者直接使用 git 仓库安装模块将会失败.

### 如何确定新的版本号

和 npm 一样,`semantic-release`遵循[semver](http://semver.org/)约定,所以每个版本都由唯一的`MAJOR.MINOR.PATCH`版本号来标识.例如,给定版本`1.2.3`:1 = 重要，2 = 轻微，3 = 补丁。

在这个系统中,重大更改(例如,API 被修改,更新到新版本可能需要更新使用库的代码)应该增加主编号.如果存在向后兼容的更改(例如,不修改现有 API 的新功能),次要号码将会增加.较小的更改(如文档更新)只会增加修补程序编号.

`semantic-release`使用提交消息自动决定下一个版本号.

这真是*太好了*,因为跟踪版本号或决定新版本是主要还是次要的改变是一件非常无聊的事情,最好留给机器自己去做.

为了自动构建,提交消息需要遵循一定的语法:

`<type_of_commit>: <commit log message as usual>.`

下表使用[默认行为](https://github.com/semantic-release/commit-analyzer/blob/master/src/index.js)列出了提交类型及其对版本号的影响.

| Type of commit  | Description                                                             | Version increase? |
| --------------- | ----------------------------------------------------------------------- | ----------------- |
| fix             | fixes a bug but does not change the API                                 | Increases PATCH   |
| style           | formatting changes                                                      |                   |
| docs            | adding/removing/changing docs                                           |                   |
| refactor        | rewriting code but not breaking changes, adding features or fixing bugs |                   |
| test            | changes in tests, e.g. adding a missing one)                            |                   |
| feat            | adding new features which do not change the API                         | Increases MINOR   |
| BREAKING CHANGE | changes the API                                                         | Increases MAJOR   |

### 如何安装和配置`semantic-release`

这主要是为了信息的目的,因为`semantic-release`已经配置了 Travis,贡献者不需要担心这一点,但是记录所有内容是很好的.

#### Option 1: 使用 CLI 工具

首先安装全局 cli 工具:

```bash
npm install -g semantic-release-cli
```

然后在现有的基于 node.js 的项目中(即`package.json`已经存在):

```bash
semantic-release-cli setup
```

在项目上设置`semantic-release`时它会问你一系列的问题.如果一切顺利,下一次你推到 GitHub,一个新版本将自动发生.

您需要在您的帐户中启用 TravisCI。

#### Option 2: 手动

安装模块:

```bash
npm install --save-dev semantic-release
```

编辑`package.json`来添加`semantic-release`脚本:

```javascript
"scripts": {
	//...
	"semantic-release": "semantic-release pre && npm publish && semantic-release post"
	//...
},
```

如果不存在,创建一个`.travis.yml`文件(这里是[帮助创建`travis.yml`文件](https://docs.travis-ci.com/user/getting-started/))或[看看我们的](https://github.com/tweenjs/tween.js/blob/master/.travis.yml).

在`.travis.yml`中添加`after_success`部分，以运行`语义释放`
Add an `after_success` section to `.travis.yml`, in order to run `semantic-release`:

```yaml
after_success:
  - npm run semantic-release
```

现在我们需要在 Travis CI 中启用这个项目,所以请确保你有一个帐户并登录.

在 Travis 中启用项目（如果你是维护者）或者请求维护者启用它,在[Travis 设置页面](https://travis-ci.org/profile/)中.

点击项目名称附近的齿轮来配置一些选项.

向下滚动，直到看到*环境变量*.

添加`GH_TOKEN`和`NPM_TOKEN`的标记.确保这两个变量都是隐藏的：`构建日志中的显示值`应该是`Off`.

你可以从[npm](https://www.npmjs.com/settings/tokens)和[GitHub](https://github.com/settings/tokens)获得令牌.这些允许像 Travis 这样的服务代表您,这就是为什么您需要确保它们不会显示在构建日志中.

希望现在每次你提交并推送到 GitHub 时,`semantic-release`将运行（如果使用上述的`master`分支）,并且可能会发布一个新版本.
