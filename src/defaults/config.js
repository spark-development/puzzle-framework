"use strict";

const liteConfig = puzzle.import("defaults/config", true);

/**
 * Default configuration values
 *
 * @type {Object}
 * @alias config
 * @memberOf engine
 */
module.exports = Object.assign(liteConfig, {
  /**
   * Database configuration.
   *
   * @type {Object}
   */
  db: {
    /**
     * Location of the migrations.
     *
     * @var {string}
     */
    migrationsPath: "./db/migrations",

    /**
     * Location of the seeds.
     *
     * @var {string}
     */
    seedsPath: "./db/seeds",

    /**
     * Timezone where the server runs.
     *
     * @var {string}
     */
    timezone: "Europe/Bucharest"
  }
});
