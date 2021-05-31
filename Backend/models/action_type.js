"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Action_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Action_type.hasMany(models.Request, {
        foreignKey: "action_id",
      });

      Action_type.hasMany(models.Transition, {
        foreignKey: "action_id",
      });
    }
  }
  Action_type.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Action_type",
    }
  );
  return Action_type;
};
