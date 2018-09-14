"use strict";

const path = require("path");
const fs = require("fs");

const CLIBase = puzzle.import("cli/CLIBase");

/**
 * DB Seeds class.
 *
 * @memberOf db.commands
 * @extends cli.CLIBase
 */
class Seeds extends CLIBase {
  /**
   * Constructor of the CLI migration command.
   *
   * @param {engine} engine The engine reference.
   */
  constructor(engine) {
    super(engine, "db:seeds");
    /**
     * Path to the seeds folder.
     *
     * @member {string}
     * @protected
     */
    this.seedsFolder = path.resolve(puzzle.config.db.seedsPath);
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
    const filesToRun = this.getFilesToRun(args[0]);

    if (args[0] !== "all" && options.generate) {
      this.generate(filesToRun, options.force || false);

      return;
    }

    await this.loadData(filesToRun);
  }

  /**
   * Returns a list with the seeds to be ran.
   *
   * @param {string} runtime The runtime/command to be run.
   *
   * @return {string[]}
   */
  getFilesToRun(runtime) {
    const filesToRun = [];

    if (runtime === "all") {
      if (fs.existsSync(path.join(this.seedsFolder, "all.json"))) {
        return require(path.join(this.seedsFolder, "all.json"));
      }

      const files = fs.readdirSync(this.seedsFolder);

      files.forEach((fileName) => {
        if (path.extname(fileName) === ".json") {
          filesToRun.push(path.basename(fileName, ".json"));
        }
      });
    } else {
      filesToRun.push(runtime);
    }

    return filesToRun;
  }

  /**
   * Loads data from the seed files into the DB.
   *
   * @param {string[]} filesToRun The entities that need to be loaded.
   */
  async loadData(filesToRun) {
    const results = [];
    filesToRun.forEach((entityName) => {
      const seedFile = path.join(this.seedsFolder, `${entityName}.json`);

      if (!fs.existsSync(seedFile)) {
        this.put.error(`Unable to run the seed ${entityName}! The seed file doesn't exist!`);
        return;
      }

      const model = puzzle.models.get(entityName);
      if (!this.isValid(model)) {
        this.put.error("The entity that you want to use doesn't exists!");
        return;
      }

      const data = require(seedFile);
      results.push(model.bulkCreate(data));
    });

    try {
      await Promise.all(results);
      this.put.ok("Done importing seeds!");
    } catch (e) {
      this.put.error(e.message);
    } finally {
      this.done(0);
    }
  }

  /**
   * Generates a seed file for the given entity.
   * If the seed exists, the forceCreation parameter forces the storage of the file.
   *
   * @param {string[]} filesToRun The entities that need to be generated.
   * @param {boolean} forceCreation Force the file saving.
   */
  generate(filesToRun, forceCreation) {
    const entityNames = filesToRun.pop().split(",");

    entityNames.forEach((entityName) => {
      entityName = entityName.trim();
      const seedFile = path.join(this.seedsFolder, `${entityName}.json`);
      this.put.info(`Generating seed for entity: ${entityName}`);

      if (fs.existsSync(seedFile) && !forceCreation) {
        this.put.error("Unable to generate the seed! The file already exists.");
        return;
      }

      const model = puzzle.models.get(entityName);
      if (!this.isValid(model)) {
        this.put.error("The entity that you want to use doesn't exists!");
        return;
      }

      const attributes = Object.keys(model.rawAttributes);
      const seed = {};
      attributes.forEach((key) => {
        seed[key] = "";
      });

      fs.writeFileSync(seedFile, JSON.stringify([seed], null, 2));
      this.put.ok("Generation done");
    });
  }
}

module.exports = Seeds;
