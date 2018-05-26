"use strict";

const Sequelize = require("sequelize");

const PUse = puzzle.import("core/PUse");
const ModelLoader = require("./ModelLoader");

/**
 * Database commands module.
 *
 * @namespace db
 */

/**
 * Database module initialisation class.
 *
 * @memberOf db
 * @extends core.PUse
 */
class DBModule extends PUse {
  /**
   * Returns an instance of Sequelize
   *
   * @return {Sequelize}
   */
  static get db() {
    const dbConfig = puzzle.config.db[puzzle.env];

    return new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.driver,
      logging: (message) => {
        puzzle.log.debug(message);
      }
    });
  }

  /**
   * Creates and initializes the DB Module.
   *
   * @param {PEngine} engine The engine runtime.
   */
  use(engine) {
    engine.set("db", DBModule.db);
    engine.use(ModelLoader);

    if (engine.cli) {
      engine.commands.register("db:migrate", require("./commands/Migrations"));
      engine.commands.register("db:seeds", require("./commands/Seeds"));
    }
  }
}

module.exports = DBModule;
