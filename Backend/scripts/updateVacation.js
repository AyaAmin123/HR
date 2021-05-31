const xlsx = require("node-xlsx");
const { Employee, Vacation, VacationAccumulator } = require("../models/index");
const { Op } = require("sequelize");
(async function updateVacation() {
  try {
    var fs = require("fs");

    const [{ data }] = xlsx.parse(
      fs.readFileSync(`${__dirname}/../data/vacations_balance_2021.xlsx`)
    );

    for (let i = 1; i < data.length; i++) {
      const [branch, emp_name, last_year_vacation, balance, total] = data[i];
      console.log({
        branch,
        emp_name,
        last_year_vacation,
        balance,
        total,
      });
      if (emp_name && last_year_vacation && balance && total) {
        let emp = await Employee.findOne({
          where: {
            en_name: {
              [Op.like]: `%${emp_name}%`,
            },
          },
        });
        let vacationFlag = await Vacation.update(
          {
            remaning: total,
            last_year_vacation: last_year_vacation,
          },
          {
            where: {
              emp_id: emp.id,
            },
          }
        );

        let vacationAccumulatorFlag = await VacationAccumulator.update(
          {
            count: total,
          },
          {
            where: {
              emp_id: emp.id,
            },
          }
        );
        if (vacationFlag[0] === 1 && vacationAccumulatorFlag[0] === 1)
          console.log(
            `[${new Date(new Date() + "UTC")}] vacation for emp ${
              emp.id
            } has been updated successfully\n`
          );
      }
    }
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
  }
})();
