const xlsx = require("node-xlsx");
const { EmployeeDetail } = require("../models/index");
(async function increment_insurance_date() {
  try {
    let employeeDetails = await EmployeeDetail.findAll({});
    if (employeeDetails) {
      for (let index in employeeDetails) {
        if (employeeDetails[index].insurance_days_count > 0) {
          employeeDetails[index].insurance_days_count += 1;
          await employeeDetails[index].save();
          console.log(
            `[${new Date(
              new Date() + "UTC"
            )}] insurance_days_count has been increased successfully for emp ${
              employeeDetails[index].emp_id
            }`
          );
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
})();
