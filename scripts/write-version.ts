const { version } = await Bun.file(`${import.meta.dir}/../package.json`).json();

await Bun.write(
	`${import.meta.dir}/../src/Version.ts`,
	[`const VERSION = '${version}'`, "export default VERSION", ""].join("\n"),
);
