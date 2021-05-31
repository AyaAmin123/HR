"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Vacations", {
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
      remaning: {
        type: Sequelize.FLOAT,
      },
      consumed: {
        type: Sequelize.FLOAT,
      },
      minus_march: {
        type: Sequelize.FLOAT,
      },
      annual_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      contingency_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      last_year_vacation: {
        type: Sequelize.FLOAT,
      },
      exceeding_vacation_balance: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      exceeding_contingency_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      absent: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      on_probation_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      vacation_block: {
        type: Sequelize.BOOLEAN,
      },

      child_care_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      sick_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      death_father_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      death_mother_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      military_call_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      maternity_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      pilgrimage_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      exceptional_corona_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      child_care_after_maternity_vacation: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      half_day_weekly_ben: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      two_days_every_fifteen: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      three_days_every_fifteen: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      permission: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      year: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Vacations");
  },
};
