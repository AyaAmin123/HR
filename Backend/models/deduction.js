"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Deduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Deduction.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  Deduction.init(
    {
      emp_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      deducted_days_from_vacation: DataTypes.FLOAT,
      deducted_days_from_salary: DataTypes.FLOAT,
      reason: DataTypes.STRING,
      closed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Deduction",
    }
  );
  return Deduction;
};
