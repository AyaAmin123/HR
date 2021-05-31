"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeDetail extends Model {
    static associate(models) {
      EmployeeDetail.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });

      // EmployeeDetail.belongsTo(models.Employee, {
      //   foreignKey: "direct_manager_id",
      // });

      EmployeeDetail.belongsTo(models.Team, {
        foreignKey: "team_id",
      });
    }
  }

  EmployeeDetail.init(
    {
      birth_date: DataTypes.DATE,
      team_id: DataTypes.INTEGER,
      emp_id: DataTypes.INTEGER,
      is_direct_manager: DataTypes.INTEGER,
      direct_manager_id: DataTypes.INTEGER,
      delegate_id: DataTypes.INTEGER,
      probation_date: DataTypes.DATE,
      contract_type: DataTypes.STRING,
      social_insurance_no: DataTypes.STRING,
      bank_account_name: DataTypes.STRING,
      position_history_en: DataTypes.STRING,
      position_history_ar: DataTypes.STRING,
      bank_account_no: DataTypes.STRING,
      business_email: DataTypes.STRING,
      personal_email: DataTypes.STRING,
      mobile: DataTypes.STRING,
      telephone: DataTypes.STRING,
      data_sheet_address: DataTypes.STRING,
      national_id_address: DataTypes.TEXT,
      national_id_no: DataTypes.STRING,
      issue_date: DataTypes.DATE,
      insurance_days_count: DataTypes.FLOAT,
      expire_date: DataTypes.DATE,
      gender: DataTypes.STRING,
      nationality_name: DataTypes.STRING,
      educational_qualification: DataTypes.STRING,
      family: DataTypes.STRING,
      emergency_contacts: DataTypes.STRING,
      religion: DataTypes.STRING,
      blood_type: DataTypes.STRING,
      military_service: DataTypes.STRING,
      social_status: DataTypes.STRING,
      smart_previous_join_date: DataTypes.DATE,
      join_date: DataTypes.DATE,
      remarks: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "EmployeeDetail",
      tableName: "employee_details",
    }
  );
  return EmployeeDetail;
};
