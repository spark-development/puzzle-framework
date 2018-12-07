"use strict";

const Joi = require("joi-i18n");
const fs = require("fs");
const path = require("path");

const PObject = puzzle.import("core/PObject");
const Model = require("./Model");

class ModelLoader extends PObject {
  constructor() {
    super();

    /**
     * A list with all the models available in the application.
     *
     * @property {Array<string,models.Model>}
     * @private
     */
    this._models = {};
  }

  /**
   * Creates and initializes the Model Loader.
   *
   * @param {PEngine} engine The engine runtime.
   */
  use(engine) {
    engine.set("models", this);
    engine.set("Joi", Joi);

    const localesPath = path.resolve(`${process.cwd()}/${engine.config.i18n.locales}`);
    engine
      .config
      .i18n
      .languages
      .forEach((language) => {
        const filePath = path.join(localesPath, `${language}.joi.js`);
        Joi.addLocaleData(language, fs.existsSync(filePath) ? require(filePath) : {});
      });
  }

  /**
   * Pushes a model onto the engine, to be used throughout the framework.
   *
   * @param {model.Model} model The model to be added into the framework.
   */
  push(model) {
    let m;
    if (model instanceof Model) {
      m = model;
    } else if (model.prototype instanceof Model) {
      m = new model();
    }

    if (!m.isComposed) {
      m.compose();
    }
    this._models[m.entity] = m;
  }

  /**
   * Returns a list with the entities loaded into the application.
   *
   * @return {Array<string>}
   */
  get entities() {
    return Object.keys(this._models);
  }

  /**
   * Returns the model from the application.
   *
   * @param {string} entity The model name to be fetched.
   *
   * @return {model.Model | null}
   */
  get(entity) {
    return this._models[entity]
      ? this._models[entity].model
      : null;
  }
}

module.exports = ModelLoader;
