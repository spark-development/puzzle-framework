"use strict";

const puzzleServer = require("@puzzleframework/lite");
puzzleServer.version = require("../package.json");
puzzle.use(require("./utils/ExtendPuzzle"));


module.exports = puzzleServer;
