"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Employee_Details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      birth_date: {
        type: Sequelize.DATE,
      },
      position_history_en: {
        type: Sequelize.TEXT,
      },
      position_history_ar: {
        type: Sequelize.TEXT,
      },
      team_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "teams",
          key: "id",
        },
      },
      emp_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "employees",
          key: "id",
        },
      },
      is_direct_manager: {
        type: Sequelize.INTEGER,
      },
      direct_manager_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: "employees",
        //   key: "id",
        // },
      },
      delegate_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: "employees",
        //   key: "id",
        // },
      },
      probation_date: {
        type: Sequelize.DATE,
      },
      contract_type: {
        type: Sequelize.STRING,
      },
      social_insurance_no: {
        type: Sequelize.STRING,
      },
      bank_account_name: {
        type: Sequelize.STRING,
      },
      bank_account_no: {
        type: Sequelize.STRING,
      },
      business_email: {
        type: Sequelize.STRING,
      },
      personal_email: {
        type: Sequelize.STRING,
      },
      mobile: {
        type: Sequelize.STRING,
      },
      telephone: {
        type: Sequelize.STRING,
      },
      data_sheet_address: {
        type: Sequelize.STRING,
      },
      national_id_address: {
        type: Sequelize.TEXT,
      },
      national_id_no: {
        type: Sequelize.STRING,
      },
      issue_date: {
        type: Sequelize.DATE,
      },
      expire_date: {
        type: Sequelize.DATE,
      },
      insurance_days_count: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      gender: {
        type: Sequelize.STRING,
      },
      nationality_name: {
        type: Sequelize.STRING,
      },
      religion: {
        type: Sequelize.STRING,
      },
      blood_type: {
        type: Sequelize.STRING,
      },
      military_service: {
        type: Sequelize.STRING,
      },
      social_status: {
        type: Sequelize.STRING,
      },
      smart_previous_join_date: {
        type: Sequelize.DATE,
      },
      join_date: {
        type: Sequelize.DATE,
      },
      remarks: {
        type: Sequelize.TEXT,
      },

      remarks: {
        type: Sequelize.TEXT,
      },
      remarks: {
        type: Sequelize.TEXT,
      },
      educational_qualification: {
        type: Sequelize.STRING(1234),
      },
      family: {
        type: Sequelize.STRING(1234),
      },
      emergency_contacts: {
        type: Sequelize.STRING(1234),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("EmployeeDetails");
  },
};
