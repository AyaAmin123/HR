"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      emp_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "employees",
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
      state_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "states",
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
      current_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
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
    await queryInterface.dropTable("Requests");
  },
};
