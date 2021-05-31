"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Deductions", {
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
      date: {
        type: Sequelize.DATE,
      },
      deducted_days_from_vacation: {
        type: Sequelize.FLOAT,
      },
      deducted_days_from_salary: {
        type: Sequelize.FLOAT,
      },
      reason: {
        type: Sequelize.STRING,
      },
      closed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("Deductions");
  },
};
