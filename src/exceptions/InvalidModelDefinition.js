"use strict";

const PError = puzzle.import("exceptions/PError");

/**
 * Exception for when the model isn't defined correctly.
 *
 * @extends exceptions.PError
 * @memberOf exceptions
 */
class InvalidModelDefinition extends PError {
  /**
   * Initialises the Exception
   *
   * @param {string} entityName The name of the entity.
   */
  constructor(entityName) {
    super(`The entity that you try to define is not valid.`);
    this.extra = entityName;
  }
}

module.exports = InvalidModelDefinition;
