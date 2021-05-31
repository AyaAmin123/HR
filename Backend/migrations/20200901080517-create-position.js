"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Positions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ar_name: {
        type: Sequelize.STRING,
      },
      en_name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },

      position_code: {
        type: Sequelize.STRING,
      },

      parent_position_id: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Positions");
  },
};
