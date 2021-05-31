"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("attendances", "official_holiday_id", {
      type: Sequelize.INTEGER,
      after: "request_id",
      references: {
        model: "officialHolidays",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("attendances", "official_holiday_id");
  },
};
