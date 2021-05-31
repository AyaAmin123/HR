const { Employee, Vacation } = require("../models");

(async function runEveryDayCheckIfEmpPassSixMonths() {
  try {
    const employees = await Employee.findAll({
      attributes: ["id", "join_date"],
    });

    for (const employee in employees) {
      let join_date = new Date(
        `${employee.join_date.replace(" ", "T").concat(".000Z")}`
      );
      let today = new Date(new Date() + "UTC");
      let workingMonth = Math.round(
        getTwoDigits((today - join_date) / 2592000000)
      );

      if (workingMonth >= 6) {
        const vacation = await Vacation.findOne({
          where: {
            emp_id: employee.id,
            year: join_date.getFullYear().toString(),
          },
        });
        if (vacation) {
          vacation.vacation_block = false;
          await vacation.save();
        }
        console.log(
          `[${new Date(
            new Date() + "UTC"
          )}] vacation block  has been unlocked  for emp ${employee.id}`
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
})();

function getTwoDigits(hours) {
  if (hours.toString().includes(".")) {
    let [after, before] = hours.toString().split(".");
    return parseFloat(`${after}.${before[0]}${before[1]}`);
  } else return parseFloat(hours);
}
