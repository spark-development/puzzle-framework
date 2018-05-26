"use strict";

const PError = puzzle.import("exceptions/PError");

/**
 * Exception for when the user has no permission to access a zone.
 *
 * @extends exceptions.PError
 * @memberOf exceptions
 */
class NoPermission extends PError {
  /**
   * Initialises the Exception
   *
   * @param {string} permission The permission name.
   */
  constructor(permission) {
    super(`You don't have the permission to access section!`);
    this.extra = permission;
  }
}

module.exports = NoPermission;
