"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Resposible_people", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transition_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "transitions",
          key: "id",
        },
      },
      responsible_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "responsible_types",
          key: "id",
        },
      },
      is_editor: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Resposible_people");
  },
};
