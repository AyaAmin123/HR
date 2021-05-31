const xlsx = require("node-xlsx");
const { Employee, EmployeeDetail } = require("../models/index");
const { Op } = require("sequelize");
(async function updateVacationAndDelegate() {
  try {
    var fs = require("fs");

    const [{ data }] = xlsx.parse(
      fs.readFileSync(`${__dirname}/../data/updateVacationAndDelegate.xlsx`)
    );

    for (let i = 1; i < data.length; i++) {
      const [emp_name, delegate_name, vacation] = data[i];

      let emp = await Employee.findOne({
        where: {
          en_name: {
            [Op.like]: `%${emp_name}%`,
          },
        },
      });

      let del = await Employee.findOne({
        where: {
          en_name: {
            [Op.like]: `%${delegate_name}%`,
          },
        },
      });

      await EmployeeDetail.update(
        { delegate_id: del.id },
        {
          where: {
            emp_id: emp.id,
          },
        }
      );
    }
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
  }
})();
