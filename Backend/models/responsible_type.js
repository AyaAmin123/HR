"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Responsible_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Responsible_type.hasMany(models.Resposible_people, {
        foreignKey: "responsible_type_id",
      });
    }
  }
  Responsible_type.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Responsible_type",
    }
  );
  return Responsible_type;
};
