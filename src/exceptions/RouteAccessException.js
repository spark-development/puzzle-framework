"use strict";

const PError = puzzle.import("exceptions/PError");

/**
 * Exception for when there is no access to the given route.
 *
 * @extends exceptions.PError
 * @memberOf exceptions
 */
class RouteAccessException extends PError {
  /**
   * Initialises the Exception
   *
   * @param {string} page The name of the route.
   */
  constructor(page) {
    super(`You cannot access this section!`);
    this.extra = page;
  }
}

module.exports = RouteAccessException;
