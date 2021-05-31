"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RestAllowance extends Model {
    static associate(models) {
      RestAllowance.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  RestAllowance.init(
    {
      emp_id: DataTypes.INTEGER,
      rest_allowance_date: DataTypes.DATE,
      number_of_hours: DataTypes.FLOAT,
      valid_to: DataTypes.DATE,
      taked: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "RestAllowance",
    }
  );
  return RestAllowance;
};
