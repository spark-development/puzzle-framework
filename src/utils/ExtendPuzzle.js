"use strict";

const path = require("path");
const fs = require("fs");

const PEngine = puzzle.import("core/PEngine");

const DBModule = require("../db");
const DefaultFull = require("../defaults/config");

/**
 * Extends the puzzle runtime with some options/enhancements.
 *
 * @extends core.PEngine
 * @memberOf utils
 */
class ExtendPuzzle extends PEngine {
  /**
   * Extends the Puzzle system variable.
   *
   * @param {PEngine} engine The engine runtime.
   */
  use(engine) {
    global.puzzleLight = false;
    engine.import = this.import;
    engine.config.load(DefaultFull);

    engine.use(DBModule);
  }

  /**
   * Returns the module you need to use. Can be extended to use files relative
   * to current project/framework.
   *
   * @param {string} moduleName The module name.
   * @param {boolean} [fromSuper] Should be imported from the super framework.
   *
   * @return {*}
   */
  import(moduleName, fromSuper) {
    if ((!this.isValid(fromSuper) || !fromSuper)
      && (fs.existsSync(path.resolve(`${__dirname}/../${moduleName}.js`))
        || fs.existsSync(path.resolve(`${__dirname}/../${moduleName}/index.js`)))) {
      return require(`${__dirname}/../${moduleName}`);
    }

    return super.import(moduleName);
  }
}

module.exports = ExtendPuzzle;
