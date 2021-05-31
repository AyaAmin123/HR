const axios = require("axios");
const config_attendence = require("../config/attendence_api.json");
const env = process.env.NODE_ENV || "development";
const { base_url, attendence_token } = config_attendence.attendence[env];
const { Employee } = require("../models/index");
module.exports = {
  attendence_report: async function (payload) {
    try {
      const response = await axios.get(
        base_url + "/att/api/transactionReport/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: attendence_token,
          },
          params: payload,
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log({
        lineNumber: error.stack,
        message: error.message,
      });
      console.log(error);
      return error;
    }
  },
  employees: async function () {
    try {
      let url = base_url + "/personnel/api/employees/";
      let page = 1;
      let response;

      do {
        response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: attendence_token,
          },
          params: {
            page: page,
          },
        });

        if (response.data.next === null) {
          break;
        }

        response.data.data.forEach(async (emp) => {
          const emp_in_db = await Employee.findOne({
            where: { emp_code: emp.emp_code },
          });
          if (emp_in_db !== null) {
            emp_in_db.finger_print_id = emp.id;
            emp_in_db.save();
          }
        });

        page++;
      } while (response.data.next !== null);

      return "finger prints added successfully !";
    } catch (error) {
      console.log({
        lineNumber: error.stack,
        message: error.message,
      });
      return error.message;
    }
  },
};
