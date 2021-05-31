"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lateness extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lateness.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  Lateness.init(
    {
      emp_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      lateness_hours: DataTypes.FLOAT,
      forgot_face_print: DataTypes.BOOLEAN,
      forgived: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Lateness",
    }
  );
  return Lateness;
};
