"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });

      Attendance.belongsTo(models.Request, {
        foreignKey: "request_id",
      });

      Attendance.belongsTo(models.OfficialHolidays, {
        foreignKey: "official_holiday_id",
      });
    }
  }
  Attendance.init(
    {
      emp_id: DataTypes.INTEGER,
      current_date: DataTypes.DATE,
      planned_in: DataTypes.DATE,
      planned_out: DataTypes.DATE,
      actual_in: DataTypes.DATE,
      actual_out: DataTypes.DATE,
      is_exception: DataTypes.BOOLEAN,
      taked_action: DataTypes.STRING,
      request_id: DataTypes.INTEGER,
      official_holiday_id: DataTypes.INTEGER,
      forgiveness_evening_time: DataTypes.INTEGER,
      forgiveness_morning_time: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
