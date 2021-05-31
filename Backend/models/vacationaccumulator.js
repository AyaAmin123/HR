"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VacationAccumulator extends Model {
    static associate(models) {
      VacationAccumulator.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  VacationAccumulator.init(
    {
      emp_id: DataTypes.INTEGER,
      count: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "VacationAccumulator",
    }
  );
  return VacationAccumulator;
};
