"use strict";

const CLIBase = puzzle.import("cli/CLIBase");
const MigrationRunner = require("../MigrationEngine/MigrationRunner");

/**
 * DB Migrations class.
 *
 * @memberOf db.commands
 * @extends cli.CLIBase
 */
class Migrations extends CLIBase {
  /**
   * Constructor of the CLI migration command.
   */
  constructor() {
    super("db:migrate");

    this.options = {
      module: [false, "The module for which we run the migrations", "string", ""],
      folder: [false, "The migrations folder", "string", "Migrations"]
    };
  }

  /**
   * Displays the usage information.
   */
  usage() {
    this.cli.getUsage();
  }

  /**
   * Runs the migration command.
   *
   * @param {string[]} args The command line arguments
   * @param {Object} options The options given to the command.
   */
  async run(args, options) {
    if (args.length === 0) {
      this.put.fatal("No command given");
      return;
    }

    const runtime = args.shift();

    if (!this.isValid(runtime)) {
      this.put.fatal("No command given!");
      return;
    }

    const folder = this.isValid(options.folder) ? options.folder : "Migrations";

    if (options.module === true) {
      options.module = args.pop();
    }

    try {
      const migrationRunner = new MigrationRunner(this.put);
      migrationRunner.disableFileLogging();
      await migrationRunner.run(runtime, options.module, folder);
    } catch (err) {
      this.done(1);
    }
  }
}

module.exports = Migrations;
