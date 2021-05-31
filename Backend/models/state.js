"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      State.hasMany(models.Request, {
        foreignKey: "state_id",
      });

      State.hasMany(models.Transition, {
        foreignKey: "from_state",
      });

      State.hasMany(models.Transition, {
        foreignKey: "to_state",
      });
    }
  }
  State.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "State",
    }
  );
  return State;
};
