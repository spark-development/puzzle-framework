"use strict";

const puzzleCLI = require("puzzle-framework-lite/src/cmd");
puzzleCLI.version = require("../package.json");
puzzle.use(require("./utils/ExtendPuzzle"));


module.exports = puzzleCLI;
