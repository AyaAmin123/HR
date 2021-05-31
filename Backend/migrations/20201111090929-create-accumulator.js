"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Accumulators", {
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
      year: {
        type: Sequelize.STRING,
      },
      count: {
        type: Sequelize.FLOAT,
      },
      previous_count: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("Accumulators");
  },
};
