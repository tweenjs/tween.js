import { rm } from "node:fs/promises";

const bundles = [
	{
		entry: "src/Index.ts",
		outfile: "dist/tween.esm.js",
		format: "esm",
		target: "browser",
	},
	{
		entry: "src/Index.ts",
		outfile: "dist/tween.cjs",
		format: "cjs",
		target: "node",
	},
	{
		entry: "src/global.ts",
		outfile: "dist/tween.umd.js",
		format: "iife",
		target: "browser",
	},
] as const;

await rm("dist", { recursive: true, force: true });

for (const { entry, outfile, format, target } of bundles) {
	const banner = format === "esm" ? undefined : `'use strict';`;
	const result = await Bun.build({
		entrypoints: [entry],
		format,
		target,
		banner,
	});

	if (!result.success) {
		console.error(`Failed to bundle ${outfile}:`);
		for (const message of result.logs) console.error(message);
		process.exit(1);
	}

	await Bun.write(outfile, result.outputs[0]);
	console.log(outfile);
}

const tsc = Bun.spawn(["bunx", "tsc", "--project", "tsconfig.build.json"], {
	stdout: "inherit",
	stderr: "inherit",
});
const tscExitCode = await tsc.exited;

if (tscExitCode !== 0) process.exit(tscExitCode);

// tsc emits one declaration per module, so dist/tween.d.ts re-exports the entry
// point to keep the published `types` path unchanged.
await Bun.write(
	"dist/tween.d.ts",
	[
		`export * from './types/Index'`,
		`export {default} from './types/Index'`,
		"",
	].join("\n"),
);
console.log("dist/tween.d.ts");
