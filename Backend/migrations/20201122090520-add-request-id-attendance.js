"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("attendances", "request_id", {
      type: Sequelize.INTEGER,
      after: "taked_action",
      defaultValue: null,
      references: {
        model: "requests",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("attendances", "request_id");
  },
};
