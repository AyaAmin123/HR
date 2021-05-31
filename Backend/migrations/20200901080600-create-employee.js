"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Employees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      en_name: {
        type: Sequelize.STRING,
      },
      ar_name: {
        type: Sequelize.STRING,
      },
      finger_print_id: {
        type: Sequelize.STRING,
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "positions", // 'Movies' would also work
          key: "id",
        },
      },
      emp_code: {
        type: Sequelize.STRING,
      },
      actual_status: {
        type: Sequelize.INTEGER,
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "departments",
          key: "id",
        },
      },
      join_date: {
        type: Sequelize.DATE,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "branches",
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
    await queryInterface.dropTable("Employees");
  },
};
