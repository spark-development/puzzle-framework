"use strict";

const puzzleCLI = require("@puzzleframework/lite/src/cmd");
puzzleCLI.version = require("../package.json");
puzzle.use(require("./utils/ExtendPuzzle"));


module.exports = puzzleCLI;
