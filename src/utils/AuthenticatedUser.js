"use strict";

const _ = require("lodash");

/**
 * Checks to see if the user is authenticated or not.
 *
 * @alias AuthenticatedUser
 * @memberOf utils
 *
 * @param {models.User} user The user object.
 *
 * @return {boolean}
 */
module.exports = (user) => user !== null && user !== undefined && _.isObject(user) && user.constructor.name === "User";
