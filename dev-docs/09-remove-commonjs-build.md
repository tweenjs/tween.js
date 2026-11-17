## Remove legacy CommonJS distribution (`#655`)

Electron has supported native ES modules since Electron 28, resolving the
remaining blocker recorded in `#655` ("remove legacy CommonJS after Electron
ESM comes out").

- `rollup.config.js`: drops the `dist/tween.cjs` library output while keeping
  the internal `.tmp/tests.cjs` bundle used by `nodeunit` until unit tests move
  to `@web/test-runner`.
- `dist/tween.cjs`: removed from tracked build output.
- `package.json`: points `"main"` at `"dist/tween.esm.js"`, removes the
  `"require"` condition from `"exports"`, and places `"types"` ahead of
  `"import"` in `"exports"` so TypeScript `node16`/`nodenext` resolution
  matches `"./dist/tween.d.ts"` before runtime conditions.
- Docs & examples: removes the deprecated CommonJS sections referencing
  `dist/tween.cjs` from `README.md` and `README_zh-CN.md`, and removes
  `examples/example-projects/nodejs-commonjs/`.

✅ Implemented
