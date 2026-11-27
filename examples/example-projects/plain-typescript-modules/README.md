This example is written in TypeScript and requires running a build step, using
JavaScript module format to organize code into separate files and importing from
one file to the other using native `import` syntax.

This example uses the `tsc` (TypeScript compiler) to compile `.ts` files into
`.js` files. The `tsconfig.json` file specifies the output format to be
`esnext`, which means the output `.js` files will have `import` statements just
as we've written them in the `.ts` files, and the output `.js` files will be
executed as native JS modules in the browser.

To set up, run `npm install`.

To build and run the project in a single command, run `npm start`.

To compile only, run `npm run build` to generate `.js` files from `.ts` files.

To continuously build `.ts` files into `.js` files any time the `.ts` files change, run `npm run dev`.
