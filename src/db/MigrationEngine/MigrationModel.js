"use strict";

module.exports = (sequelize) => {
  const Sequelize = sequelize.constructor;

  return sequelize.define(
    "SequelizeMetadata",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      module: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      runDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      }
    },
    {
      tableName: "_migrations",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
};
