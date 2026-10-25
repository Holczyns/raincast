// Bundles the panel into the integration's www folder.
import * as esbuild from "esbuild";

const options = {
  entryPoints: {
    "raincast-panel": "src/raincast-panel.ts",
  },
  outdir: "../custom_components/raincast/www",
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  legalComments: "none",
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const context = await esbuild.context({ ...options, minify: false });
  await context.watch();
} else {
  await esbuild.build(options);
}
