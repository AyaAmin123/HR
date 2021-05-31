"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmpPenalityCounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmpPenalityCounts.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  EmpPenalityCounts.init(
    {
      emp_id: DataTypes.INTEGER,
      date: DataTypes.STRING,
      lateness_hours_count: DataTypes.FLOAT,
      forgot_face_print_count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "EmpPenalityCounts",
    }
  );
  return EmpPenalityCounts;
};
