"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("attendances", "taked_action", {
      type: Sequelize.BOOLEAN,
      after: "is_exception",
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("attendances", "taked_action");
  },
};
