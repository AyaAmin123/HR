"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Accumulator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Accumulator.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  Accumulator.init(
    {
      emp_id: DataTypes.INTEGER,
      year: DataTypes.STRING,
      count: DataTypes.FLOAT,
      previous_count: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Accumulator",
    }
  );
  return Accumulator;
};
