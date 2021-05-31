"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Requests_detail extends Model {
    static associate(models) {
      Requests_detail.belongsTo(models.Request, {
        foreignKey: "request_id",
      });
    }
  }
  Requests_detail.init(
    {
      key: DataTypes.STRING,
      value: DataTypes.STRING,
      request_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Requests_detail",
    }
  );
  return Requests_detail;
};
