const { join } = require("path");
const sass = require("sass-embedded");
const jsonImporter = require("@blakedarlin/sass-json-importer");

const sassOptions = {
  importers: [jsonImporter()],
};

// Sync
const result = sass.compile(join(__dirname, "feature/a.scss"), sassOptions);
console.log(result.css);
