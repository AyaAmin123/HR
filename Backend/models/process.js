"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Process extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Process.hasMany(models.Request, {
        foreignKey: "process_id",
      });

      Process.hasMany(models.Transition, {
        foreignKey: "process_id",
      });
    }
  }
  Process.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Process",
    }
  );
  return Process;
};
