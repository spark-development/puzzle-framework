"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Finds the right path for the given module.
 *
 * @alias db.FindPathUtil
 * @param {string} module The module name.
 * @param {string} folder The folder name.
 *
 * @return {string}
 */
module.exports = (module, folder) => {
  const basePath = path.join(process.cwd(), "puzzles");

  let splitPath = path.join(
    basePath,
    module.replace(new RegExp(/\./, "gi"), "/"),
    folder
  );

  let dottedPath = path.join(basePath, module, folder);

  splitPath = path.resolve(splitPath);
  dottedPath = path.resolve(dottedPath);

  return fs.existsSync(splitPath)
    ? splitPath
    : dottedPath;
};
