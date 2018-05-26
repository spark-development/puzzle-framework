"use strict";

const PError = puzzle.import("exceptions/PError");

/**
 * Exception for when the model doesn't exists in the db.
 *
 * @extends exceptions.PError
 * @memberOf exceptions
 */
class ModelNotFound extends PError {
  /**
   * Initialises the Exception
   *
   * @param {number|string} id The id of the model.
   */
  constructor(id) {
    super(`The model that you try to find doesn't exists.`);
    this.extra = id;
  }
}

module.exports = ModelNotFound;
