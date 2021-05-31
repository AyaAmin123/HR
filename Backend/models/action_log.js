"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Action_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Action_log.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });

      Action_log.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Action_log.init(
    {
      emp_id: DataTypes.INTEGER,
      action_taken: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Action_log",
    }
  );
  return Action_log;
};
