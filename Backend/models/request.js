"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Request.hasMany(models.Requests_detail, {
        foreignKey: "request_id",
      });
      Request.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });

      Request.belongsTo(models.Process, {
        foreignKey: "process_id",
      });

      Request.belongsTo(models.State, {
        foreignKey: "state_id",
      });

      Request.belongsTo(models.Action_type, {
        foreignKey: "action_id",
      });

      Request.belongsTo(models.User, {
        foreignKey: "current_user_id",
      });

      Request.hasOne(models.Attendance, {
        foreignKey: "request_id",
      });
    }
  }
  Request.init(
    {
      emp_id: DataTypes.INTEGER,
      process_id: DataTypes.INTEGER,
      state_id: DataTypes.INTEGER,
      action_id: DataTypes.INTEGER,
      current_user_id: DataTypes.INTEGER,
      vacation_cut: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Request",
    }
  );
  return Request;
};
