"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HolidaysTypes extends Model {
    static associate(models) {
      HolidaysTypes.hasMany(models.OfficialHolidays, {
        foreignKey: "holiday_type_id",
      });
    }
  }
  HolidaysTypes.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HolidaysTypes",
    }
  );
  return HolidaysTypes;
};
