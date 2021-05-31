"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Position.init(
    {
      ar_name: DataTypes.STRING,
      en_name: DataTypes.STRING,
      description: DataTypes.STRING,
      parent_position_id: DataTypes.INTEGER,
      position_code: DataTypes.STRING,
      parent_position_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Position",
    }
  );
  return Position;
};
