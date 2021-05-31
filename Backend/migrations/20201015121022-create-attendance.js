"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Attendances", {
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
      current_date: {
        type: Sequelize.DATE,
      },
      planned_in: {
        type: Sequelize.DATE,
      },
      planned_out: {
        type: Sequelize.DATE,
      },
      actual_in: {
        type: Sequelize.DATE,
      },
      actual_out: {
        type: Sequelize.DATE,
      },
      is_exception: {
        type: Sequelize.BOOLEAN,
      },
      forgiveness_morning_time: {
        type: Sequelize.INTEGER,
      },
      forgiveness_evening_time: {
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
    await queryInterface.dropTable("Attendances");
  },
};
