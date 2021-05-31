"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("requests", "vacation_cut", {
      type: Sequelize.BOOLEAN,
      after: "current_user_id",
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("requests", "vacation_cut");
  },
};
