"use strict";

const Storage = require("umzug/lib/storages/Storage").default;
const SparkMigrationModel = require("./MigrationModel");

class MigrationStorage extends Storage {
  constructor(module) {
    super();

    this.model = SparkMigrationModel(puzzle.db);
    this.module = module || "";
  }

  /**
   * Logs migration to be considered as executed.
   *
   * @param {String} migrationName - Name of the migration to be logged.
   * @returns {Promise}
   */
  logMigration(migrationName) {
    return this.model
      .sync()
      .then(Model => Model.create({
        name: migrationName,
        module: this.module,
      }));
  }

  /**
   * Unlogs migration to be considered as pending.
   *
   * @param {String} migrationName - Name of the migration to be unlogged.
   * @returns {Promise}
   */
  unlogMigration(migrationName) {
    return this.model
      .sync()
      .then(Model => Model.destroy({
        where: {
          name: migrationName,
          module: this.module,
        }
      }));
  }

  /**
   * Gets list of executed migrations.
   *
   * @returns {Promise.<String[]>}
   */
  executed() {
    return this.model
      .sync()
      .then(Model => Model.findAll({ order: [["id", "ASC"]] }))
      .then(migrations => migrations.map(migration => migration.name));
  }
}

module.exports = MigrationStorage;
