"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resposible_people extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index`  file will call this method automatically.
     */
    static associate(models) {
      Resposible_people.belongsTo(models.Responsible_type, {
        foreignKey: "responsible_type_id",
      });
      Resposible_people.belongsTo(models.Transition, {
        foreignKey: "transition_id",
      });
    }
  }
  Resposible_people.init(
    {
      transition_id: DataTypes.INTEGER,
      responsible_type_id: DataTypes.INTEGER,
      is_editor: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Resposible_people",
    }
  );
  return Resposible_people;
};
