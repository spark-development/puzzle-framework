"use strict";

const Model = require("./Model");

/**
 * User model base object.
 *
 * @extends models.Model
 * @memberOf models
 */
class User extends Model {
  /**
   * User model constructor.
   */
  constructor() {
    super("User");
  }

  /**
   * Defines how the model should look like.
   *
   * @return {Object}
   */
  definition() {
    return {
      id: {
        type: this.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: this.DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: this.DataTypes.STRING
      },
      admin: this.DataTypes.BOOLEAN,
      firstName: this.DataTypes.STRING,
      lastName: this.DataTypes.STRING
    };
  }

  /**
   * Enhances the model after it was composed.
   */
  enhance() {
    this._model.isAdmin = this.isAdmin;
    this._model.allowed = this.allowed;
  }

  /**
   * Checks to see if the current user is an administrator or not.
   *
   * @type {boolean}
   */
  get isAdmin() {
    return true;
  }

  /**
   * Checks to see if the current user is allowed to perform the desired action.
   *
   * @param {string} permission The name of the permission
   *
   * @return {boolean}
   */
  allowed(permission) {
    return permission !== null && permission !== undefined && permission.length > 0;
  }
}

module.exports = User;
