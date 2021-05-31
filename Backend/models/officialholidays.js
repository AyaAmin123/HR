"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OfficialHolidays extends Model {
    static associate(models) {
      OfficialHolidays.belongsTo(models.HolidaysTypes, {
        foreignKey: "holiday_type_id",
      });

      OfficialHolidays.hasMany(models.Attendance, {
        foreignKey: "official_holiday_id",
      });
    }
  }
  OfficialHolidays.init(
    {
      from: DataTypes.DATE,
      to: DataTypes.DATE,
      holiday_type_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OfficialHolidays",
    }
  );
  return OfficialHolidays;
};
