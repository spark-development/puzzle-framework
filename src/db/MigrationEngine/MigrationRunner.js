"use strict";

const _ = require("lodash");
const path = require("path");
const umzug = require("umzug");

const PRunner = puzzle.import("utils/PRunner");

const FindPathUtil = require("../FindPathUtil");
const MigrationStorage = require("../MigrationEngine/MigrationStorage");

class MigrationRunner extends PRunner {
  constructor(logger) {
    super(logger);

    /**
     * What this command should perform.
     *
     * @protected
     *
     * @property {Object}
     */
    this._runtimes = {
      up: this._migrateUp,
      down: this._migrateDown,
      reset: this._migrateReset,
      status: this._status
    };

    /**
     * The Umzug reference.
     *
     * @protected
     *
     * @property {umzug|null}
     */
    this._umzug = null;
  }

  /**
   * Task runner entry point.
   *
   * @async
   *
   * @param {string} whatToRun What has to be ran.
   * @param {string} module For which module we run the migrations.
   * @param {string} folder In which folder we look for the migrations.
   */
  async run(whatToRun, module, folder) {
    const runtime = this._runtimes[whatToRun];

    if (!this.isValid(runtime)) {
      this.log.error(`Unable to find command ${whatToRun}`);
      return;
    }

    folder = this.isValid(folder) ? folder : "Migrations";

    if (module !== "") {
      this.initUmzug(module, FindPathUtil(module, folder));
    } else {
      this.initUmzug();
    }

    try {
      await runtime.apply(this);
      this.log.info(`${whatToRun.toUpperCase()} DONE`);
    } catch (err) {
      this.log.error(`${whatToRun.toUpperCase()} ERROR`);
      if (err !== null && err !== undefined) {
        this.log.error(err);
      }
      throw err;
    }
  }

  /**
   * Initialization of the Umzug migration engine.
   *
   * @param {string} [module=""] The module for which we run the migrations.
   * @param {string} [migrationPath=""] The path to migrations that we want to run.
   */
  initUmzug(module = "", migrationPath = "") {
    const sequelize = puzzle.db;
    const that = this;

    if (!this.isValid(migrationPath) || migrationPath === "") {
      migrationPath = puzzle.config.db.migrationsPath;
      module = "";
    }

    this._umzug = new umzug({
      storage: new MigrationStorage(module),
      migrations: {
        params: [
          sequelize.getQueryInterface(), // queryInterface
          sequelize.constructor, // DataTypes
        ],
        path: path.resolve(migrationPath),
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

        this.log.info("Current migration to be run:");
        this.log.info(status.current);
        this.log.info("Migrations that have ran:");
        this.log.info(status.executed.trimRight() || "\t- NONE -");
        this.log.info("Pending migrations:");
        this.log.info(status.pending.trimRight() || "\t- NONE -");

        return {
          executed,
          pending
        };
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
      this.log.info(`${eventName.toUpperCase()}: ${name}`);
    };
  }
}

module.exports = MigrationRunner;
