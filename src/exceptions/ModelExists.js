"use strict";

const PError = puzzle.import("exceptions/PError");

/**
 * Exception for when the model already exists in the db.
 *
 * @extends exceptions.PError
 * @memberOf exceptions
 */
class ModelExists extends PError {
  /**
   * Initialises the Exception
   *
   * @param {string} entityName The name of the entity.
   */
  constructor(entityName) {
    super(`The entity that you try to create already exists.`);
    this.extra = entityName;
  }
}

module.exports = ModelExists;
