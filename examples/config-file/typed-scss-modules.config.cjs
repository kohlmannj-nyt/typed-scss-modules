/* eslint-env node */
const { join } = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonImporter = require("@blakedarlin/sass-json-importer");

/** @type {import('../../dist/lib').ConfigOptions} */
export const config = {
  banner: "// config file banner",
  nameFormat: "kebab",
  exportType: "default",
  importers: [jsonImporter({ loadPaths: [join(__dirname, "./feature")] })],
};
