"use strict";

const _ = require("lodash");
const path = require("path");
const umzug = require("umzug");

const CLIBase = puzzle.import("cli/CLIBase");

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
    /**
     * What this command should perform.
     *
     * @member {Object}
     * @protected
     */
    this._runtimes = {
      up: this._migrateUp,
      down: this._migrateDown,
      reset: this._migrateReset,
      status: this._status
    };

    const sequelize = puzzle.db;
    const that = this;

    /**
     * The Umzug reference.
     *
     * @member {umzug}
     * @protected
     */
    this._umzug = new umzug({
      storage: "sequelize",
      storageOptions: {
        sequelize,
        modelName: "_migrations",
        tableName: "_migrations",
      },

      migrations: {
        params: [
          sequelize.getQueryInterface(), // queryInterface
          sequelize.constructor, // DataTypes
        ],
        path: path.resolve(this.engine.config.db.migrationsPath),
        pattern: /\.js$/
      },

      logging: function loggingSequelize(...args) {
        that.log.debug(...args);
      },
    });

    this._umzug.on("migrating", this._umzugEvent("migrating"));
    this._umzug.on("migrated", this._umzugEvent("migrated"));
    this._umzug.on("reverting", this._umzugEvent("reverting"));
    this._umzug.on("reverted", this._umzugEvent("reverted"));
  }

  /**
   * Runs the migration command.
   *
   * @param {string[]} args The command line arguments
   * @param {Object} options The options given to the command.
   */
  run(args, options) {
    if (args.length === 0) {
      this.put.fatal("No command given");
      return;
    }
    const runtime = this._runtimes[args[0]];

    if (runtime === undefined || runtime === null) {
      this.put.fatal("Invalid argument given.");
      return;
    }

    runtime.apply(this)
      .then((result) => {
        this.put.ok(`${args[0].toUpperCase()} DONE`);
      })
      .catch((err) => {
        this.put.error(`${args[0].toUpperCase()} ERROR`);
        if (err !== null && err !== undefined) {
          this.putU.error(err);
        }
        this.done(1);
      })
      .then(() => this.done());
  }

  /**
   * Undos the last migration that was run.
   *
   * Command to run: `db:migrate down`
   *
   * @return {Promise}
   */
  _migrateDown() {
    return this._umzug.down();
  }

  /**
   * Undos all migrations that were run.
   *
   * Command to run: `db:migrate reset`
   *
   * @return {Promise}
   */
  _migrateReset() {
    return this._umzug.down({
      to: 0
    });
  }

  /**
   * Runs all the migrations that weren't loaded into the application from
   * the migrations folder.
   *
   * Command to run: `db:migrate up`
   *
   * @return {Promise}
   */
  _migrateUp() {
    return this._umzug.up();
  }

  /**
   * Displays the status of the migrations (which migrations were run, which aren't run,
   * which is the latest migration that was run).
   *
   * Command to run: `db:migrate status`
   *
   * @return {Promise}
   */
  _status() {
    const result = {};

    return this._umzug.executed()
      .then((executed) => {
        result.executed = executed;
        return this._umzug.pending();
      })
      .then((pending) => {
        result.pending = pending;
        return result;
      })
      .then(({ executed, pending }) => {
        executed = executed.map((m) => {
          m.name = path.basename(m.file, ".js");
          return m;
        });
        pending = pending.map((m) => {
          m.name = path.basename(m.file, ".js");
          return m;
        });

        const status = {
          current: executed.length > 0 ? executed[0].file : "<NO_MIGRATIONS>",
          executed: "",
          pending: "",
        };

        _.each(executed, (v) => {
          status.executed += `\t- ${v.file}\n`;
        });

        _.each(pending, (v) => {
          status.pending += `\t- ${v.file}\n`;
        });

        this.put.info("Current migration to be run:");
        this.putU.info(status.current);
        this.put.info("Migrations that have ran:");
        this.putU.info(status.executed.trimRight() || "\t- NONE -");
        this.put.info("Pending migrations:");
        this.putU.info(status.pending.trimRight() || "\t- NONE -");

        return { executed, pending };
      });
  }

  /**
   * Displays the status of the current run on the console and in the log.
   *
   * @param {string} eventName The name of the event.
   *
   * @return {callback}
   */
  _umzugEvent(eventName) {
    /**
     * Callback that is used when a migration event is triggered. Logs the status of the
     * event.
     *
     * @param {string} name The name of the current running migration.
     * @param {Object} migration All the information available for the current migration.
     */
    return (name, migration) => {
      if (eventName.endsWith("ed")) {
        this.putU.ok(`${eventName.toUpperCase()}: ${name}`);
      } else {
        this.putU.info(`${eventName.toUpperCase()} ${name}`);
      }
    };
  }
}

module.exports = Migrations;
