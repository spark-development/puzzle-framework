"use strict";

const puzzleServer = require("puzzle-framework-lite");
puzzleServer.version = require("../package.json");
puzzle.use(require("./utils/ExtendPuzzle"));


module.exports = puzzleServer;
