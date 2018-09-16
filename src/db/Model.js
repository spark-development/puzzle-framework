"use strict";

const { DataTypes } = require("sequelize");

const PObject = puzzle.import("core/PObject");

/**
 * The base class for a Puzzle Model.
 *
 * @extends core.PObject
 * @memberOf models
 * @abstract
 */
class Model extends PObject {
  /**
   * Model constructor.
   *
   * @param {string} entity The name of the entity.
   */
  constructor(entity) {
    super();

    /**
     * The name of the entity.
     *
     * @property {string}
     */
    this.entity = entity;

    /**
     * The model class returned by the storage engine.
     *
     * @protected
     * @property {Object}
     */
    this._model = null;

    /**
     * Checks if the object is composed or not.
     */
    this.isComposed = false;

    /**
     * A reference to the datatypes defined in sequelize.
     *
     * @property {DataTypes}
     */
    this.DataTypes = DataTypes;

    /**
     * A reference to the sequelize instance.
     *
     * @property {Sequelize}
     */
    this.sequelize = puzzle.db;
  }

  /**
   * Returns the model class composed by the storage engine.
   *
   * @type {Object}
   */
  get model() {
    return this._model;
  }

  /**
   * Defines how the model should look like.
   *
   * @abstract
   * @return {Object}
   */
  definition() {

  }

  /**
   * Enhances the model after it was composed.
   *
   * @abstract
   */
  enhance() {

  }

  /**
   * Returns various options that can be passed to the definition engine.
   *
   * @return {*}
   */
  options() {
  }

  /**
   * Composes the model class that is going to be used by the framework.
   */
  compose() {
    this._model = this.sequelize.define(this.entity, this.definition(), this.options());
    this.enhance();
    this.isComposed = true;
  }
}

module.exports = Model;
