# tween.js contributor guide

We provide more languages: [English](./contributor_guide.md), [简体中文](./contributor_guide_zh-CN.md)

This guide is for people who want to _contribute_ to the library or are curious to learn what's behind the scenes: how is it tested? what do we automate? how do we do releases? etc.

If you are looking for documentation on _how to use_ the library, the [user guide](./user_guide.md) is for you.

**NOTE: this document is a work in progress. More content will be added in stages. If you have questions you'd like to see answered, please add them [as comments on this issue](https://github.com/tweenjs/tween.js/issues/323). THANKS!**

In this guide:

- [tween.js contributor guide](#tweenjs-contributor-guide)
  - [Developer requirements](#developer-requirements)
  - [Testing](#testing)
    - [Unit tests](#unit-tests)
    - [Code style and lint tests](#code-style-and-lint-tests)
    - [Other types of tests](#other-types-of-tests)
  - [Continuous integration](#continuous-integration)
  - [Release process](#release-process)

## Developer requirements

Although tween.js does _not_ need node.js to work, we use it for development. So you will need to [install node.js](https://nodejs.org/en/download/) before you can work on the library.

Node.js includes the `npm` tool that we use to run scripts such as the one for packaging, running tests, etc. Please make sure it is working in your system before you attempt to run any of the steps detailed below.

Once node.js is installed, clone the tween.js repository:

```bash
git clone https://github.com/tweenjs/tween.js.git
```

Change to the folder:

```bash
cd tween.js
```

And run the script to install development dependencies:

```bash
npm install
```

Or in three lines:

```bash
git clone https://github.com/tweenjs/tween.js.git
cd tween.js
npm install
```

Once `npm install` completes successfully, try having a go at running the tests:

```bash
npm test
```

If you get issues running any of the above, try to search for the text of the error using your search engine of choice. This is normally the fastest route, as many people might have encountered the same issue already.

## Testing

There's a suite of automated tests in the `test` directory.

These can quickly spot regressions on the code--useful when new features are added or when code is changed to fix a bug; we don't want to introduce new bugs! They also spot style issues, which helps us keep the library cohesive.

To run the tests, type:

```bash
npm test
```

You should run the tests after you change code in the library. If you change the behaviour the tests describe, the tests won't pass and you'll get an error pointing to the test(s) that failed. This might be either because...

- you overlooked something or there's an error in your code, or...
- the library or the tests themselves are wrong

The one that happens more frequently is the first one, but the second one has happened, with edge cases.

**Another thing you should do once the automated tests pass is to run the examples in the `examples` folder**. It is rare, but it might happen that your changes introduced cosmetic differences that the automated tests are not checking for, and the only way to notice this is by running the examples and have a human spot the difference in output. If you don't want to checkout two copies of the library, you can look at [the online examples](https://github.com/tweenjs/tween.js#examples).

### Unit tests

Tests are in the `src/tests.ts` file.

The tests are executed using [nodeunit](https://www.npmjs.com/package/nodeunit).

**TODO:** the tests should also work if opening `test/unit/nodeunit.html` in a browser, but they are broken right now. There is [an open issue](https://github.com/tweenjs/tween.js/issues/307) to make them work again.

### Code style and lint tests

We use [Prettier](https://prettier.io) and [ESLint](https://eslint.org) to ensure the code style is uniform.

To automatically format code and report any errors for pieces of code that aren't automatically formattable, run:

```bash
npm run test-lint
```

The Prettier rules are in `.prettierrc.js` and ESLint rules are in `.eslintrc.js`.

### Other types of tests

We would like to test for performance regressions i.e. if a change made things go slower, or simply, for performance, so we can compare the performance of the same code between different browsers.

There's an [open issue](https://github.com/tweenjs/discuss/issues/3) to track work on this, but we have not made progress on it yet. Help! :-)

## Continuous integration

We use GitHub Actions for continuous integration so that a build and tests will run for every pull request. The `.github/workflows/tests.yml` file tells GitHub what to run; in our case we run `npm install` followed by `npm test` in the OSes and versions of Node.js specified in that file.

**TODO:** Add macOS and Windows to OSes that the tests run on. Help! :)

## Release process

Currently the release process is manual.

When ready to make a release on the `master` branch, ensure there are no un-committed changes, then run `npm run release:patch` to release a new version with its patch number bumped, `npm run release:minor` to release a new version with its minor number bumped, or `npm run release:major` to release a new version with its major number bumped.

Tip: see [semver.org](https://semver.org) and the [npm-semver](https://docs.npmjs.com/misc/semver) docs to learn about semantic versioning.
