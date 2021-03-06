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
   * Returns the default instance of Sequelize
   *
   * @return {Sequelize}
   */
  static get db() {
    return DBModule.getDBConnection(puzzle.env);
  }

  /**
   * Returns a new instance of Sequelize for the given environment.
   *
   * @param {string} env The environment for which we want the database connection.
   *
   * @return {Sequelize}
   */
  static getDBConnection(env) {
    const dbConfig = puzzle.config.db[env];
    const options = {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.driver,
      logging: (message) => {
        puzzle.log.debug(message);
      }
    };
    if (puzzle.isValid(dbConfig.timezone)) {
      options.timezone = dbConfig.timezone;
    }
    return new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, options);
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
      engine.commands.load(__dirname);
    }
  }
}

module.exports = DBModule;
