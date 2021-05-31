"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("users", "emp_id", {
      type: Sequelize.INTEGER,
      after: "user_role_id",
      references: {
        model: "employees",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("users", "emp_id");
  },
};
