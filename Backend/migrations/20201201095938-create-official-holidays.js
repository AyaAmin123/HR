"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OfficialHolidays", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      from: {
        type: Sequelize.DATE,
      },
      to: {
        type: Sequelize.DATE,
      },
      holiday_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "HolidaysTypes",
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
    await queryInterface.dropTable("OfficialHolidays");
  },
};
