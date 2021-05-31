"use strict";
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
const { validations } = require("../utilities/validations");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Request, {
        foreignKey: "current_user_id",
      });

      User.hasMany(models.Action_log, {
        foreignKey: "user_id",
      });

      User.belongsTo(models.Employee, {
        foreignKey: "emp_id",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      reset_password: DataTypes.BOOLEAN,
      user_role_id: DataTypes.INTEGER,
      emp_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.prototype.generate_token = function () {
    let token = {};
    if (this.user_role_id === 1)
      token = jwt.sign(
        {
          id: this.id,
          name: this.name,
          email: this.email,
          user_role_id: this.user_role_id,
          emp_id: this.emp_id,
        },
        "jwtsectertkey"
      );
    else if (this.user_role_id === 2 || this.user_role_id === 3) {
      token.hr = jwt.sign(
        {
          id: this.id,
          name: this.name,
          email: this.email,
          user_role_id: this.user_role_id,
          emp_id: this.emp_id,
        },
        "jwtsectertkey"
      );

      token.emp = jwt.sign(
        {
          id: this.id,
          name: this.name,
          email: this.email,
          user_role_id: 1,
          emp_id: this.emp_id,
        },
        "jwtsectertkey"
      );
    }
    return token;
  };

  User.prototype.generate_routes = function () {
    let routes = {
      hr: [
        "/hr/employees",
        // "/hr/update_employee",
        "/hr/attendance",
        "/hr/vacation",
        "/hr/deductions",
        "/hr/myRequests",
        "/hr/officialHolidays",
        "/hr/uploadAttendanceFile",
        "/hr/addAttendance",
        "/hr/jobStatus",
      ],
      emp: ["/hr/vacation", "/hr/myRequests"],
      miss_may: [
        "/hr/employees",
        "/hr/attendance",
        "/hr/deductions",
        "/hr/myRequests",
      ],
    };
    if (this.user_role_id === 1) {
      delete routes.hr;
      return routes;
    } else if (this.user_role_id === 2) return routes;
    else if (this.user_role_id === 3) return routes;
  };
  return User;
};
