"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasOne(models.EmployeeDetail, {
        foreignKey: "emp_id",
      });
      // Employee.hasOne(models.EmployeeDetail, {
      //   foreignKey: "direct_manager_id",
      // });
      Employee.belongsTo(models.Department, {
        foreignKey: "department_id",
      });
      Employee.belongsTo(models.Position, {
        foreignKey: "position_id",
      });
      Employee.belongsTo(models.Branch, {
        foreignKey: "branch_id",
      });
      Employee.hasMany(models.Attendance, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.RestAllowance, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.Request, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.Action_log, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.User, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.Vacation, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.Lateness, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.EmpPenalityCounts, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.Accumulator, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.Deduction, {
        foreignKey: "emp_id",
      });

      Employee.hasMany(models.VacationAccumulator, {
        foreignKey: "emp_id",
      });
    }
  }
  Employee.init(
    {
      en_name: DataTypes.STRING,
      ar_name: DataTypes.STRING,
      finger_print_id: DataTypes.STRING,
      branch_id: DataTypes.INTEGER,
      position_id: DataTypes.INTEGER,
      emp_code: DataTypes.STRING,
      actual_status: DataTypes.INTEGER,
      department_id: DataTypes.INTEGER,
      join_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
