"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vacation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Vacation.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  Vacation.init(
    {
      emp_id: DataTypes.INTEGER,
      remaning: DataTypes.FLOAT,
      consumed: DataTypes.FLOAT,
      minus_march: DataTypes.FLOAT,
      annual_vacation: DataTypes.FLOAT,
      contingency_vacation: DataTypes.FLOAT,
      last_year_vacation: DataTypes.FLOAT,
      exceeding_vacation_balance: DataTypes.FLOAT,
      exceeding_contingency_vacation: DataTypes.FLOAT,
      absent: DataTypes.FLOAT,
      on_probation_vacation: DataTypes.FLOAT,
      child_care_vacation: DataTypes.FLOAT,
      sick_vacation: DataTypes.FLOAT,
      death_father_vacation: DataTypes.FLOAT,
      death_mother_vacation: DataTypes.FLOAT,
      military_call_vacation: DataTypes.FLOAT,
      maternity_vacation: DataTypes.FLOAT,
      pilgrimage_vacation: DataTypes.FLOAT,
      exceptional_corona_vacation: DataTypes.FLOAT,
      child_care_after_maternity_vacation: DataTypes.FLOAT,
      half_day_weekly_ben: DataTypes.FLOAT,
      vacation_block: DataTypes.BOOLEAN,
      two_days_every_fifteen: DataTypes.FLOAT,
      three_days_every_fifteen: DataTypes.FLOAT,
      permission: DataTypes.FLOAT,
      year: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Vacation",
    }
  );
  return Vacation;
};
