"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Transitions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      from_state: {
        type: Sequelize.INTEGER,
        references: {
          model: "states",
          key: "id",
        },
      },
      to_state: {
        type: Sequelize.INTEGER,
        references: {
          model: "states",
          key: "id",
        },
      },
      process_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "processes",
          key: "id",
        },
      },
      action_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "action_types",
          key: "id",
        },
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
    await queryInterface.dropTable("Transitions");
  },
};
