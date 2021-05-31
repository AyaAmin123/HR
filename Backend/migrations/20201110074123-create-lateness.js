"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Latenesses", {
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
      lateness_hours: {
        type: Sequelize.FLOAT,
      },
      forgot_face_print: {
        type: Sequelize.BOOLEAN,
      },
      forgived: {
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
    await queryInterface.dropTable("Latenesses");
  },
};
