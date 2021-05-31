"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transition extends Model {
    static associate(models) {
      Transition.belongsTo(models.State, {
        foreignKey: "from_state",
        targetKey: "id",
      });
      Transition.belongsTo(models.State, {
        foreignKey: "to_state",
        targetKey: "id",
      });
      Transition.belongsTo(models.Process, {
        foreignKey: "process_id",
        targetKey: "id",
      });
      Transition.belongsTo(models.Action_type, {
        foreignKey: "action_id",
        targetKey: "id",
      });

      Transition.hasMany(models.Resposible_people, {
        foreignKey: "transition_id",
      });
    }
  }
  Transition.init(
    {
      from_state: DataTypes.INTEGER,
      to_state: DataTypes.INTEGER,
      process_id: DataTypes.INTEGER,
      action_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transition",
    }
  );
  return Transition;
};
