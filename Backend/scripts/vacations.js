const {
  Employee,
  EmployeeDetail,
  Vacation,
  VacationAccumulator,
} = require("../models");
var myArgs = process.argv.slice(2);
console.log("myArgs: ", myArgs);
(async function start() {
  try {
    const employees = await Employee.findAll({
      attributes: ["id", "join_date"],
      include: [EmployeeDetail],
      where: {
        actual_status: true,
      },
    });
    for (const employee of employees) {
      if (employee.join_date) {
        let [Jdate, Jtime] = employee.join_date.toString().split(" ");
        let join_date = new Date(`${Jdate}T${Jtime}.000Z`);

        let today = new Date();

        let [Cyear, Cmonth, Cday] = today
          .toISOString()
          .split("T")[0]
          .split("-");
        // let insuranceDate = new Date("2019-03-03T00:00:00.000Z");
        let workingMonth = Math.round(
          getTwoDigits((today - join_date) / 2592000000)
        );
        if (myArgs.length !== 0 && myArgs[0] === "setVacation") {
          Cmonth = "01";
          Cday = "01";
          Cyear = today.getFullYear().toString();
        }
        if (Cmonth === "01" && Cday === "01") {
          const CurrentYearVacation = await Vacation.findOne({
            where: {
              emp_id: employee.id,
              year: Cyear,
            },
          });
          if (!CurrentYearVacation) {
            let currentYearBalance = checkInsuranceAndGetBalance(
              employee.EmployeeDetail.insurance_days_count,
              employee.EmployeeDetail.birth_date
            );
            if (currentYearBalance.toString().includes("21"))
              currentYearBalance = 21;
            else if (currentYearBalance.toString().includes("30"))
              currentYearBalance = 30;
            const vacationAccumulator = await VacationAccumulator.findOne({
              where: {
                emp_id: employee.id,
              },
            });
            let daysFromLastYear = 0;
            if (vacationAccumulator) {
              daysFromLastYear =
                parseFloat(vacationAccumulator.count) >= 6
                  ? 6
                  : parseFloat(vacationAccumulator.count);
              vacationAccumulator.count = daysFromLastYear + currentYearBalance;
              await vacationAccumulator.save();
            } else {
              await VacationAccumulator.create({
                emp_id: employee.id,
                count: parseFloat(currentYearBalance),
              });
            }
            const vacationRecord = await Vacation.create({
              emp_id: employee.id,
              year: Cyear,
              last_year_vacation: daysFromLastYear,
              remaning: daysFromLastYear + currentYearBalance,
              minus_march: 0,
              consumed: 0,
              vacation_block: workingMonth >= 6 ? false : true,
            });
            console.log(
              `[${new Date(
                new Date() + "UTC"
              )}] vacationRecord  has been inserted successfully for emp ${
                employee.id
              }`
            );
          }
        } else if (Cmonth === "03" && Cday === "31") {
          const vacation = await Vacation.findOne({
            where: {
              emp_id: employee.id,
              year: Cyear,
            },
          });
          if (vacation) {
            const vacationAccumulator = await VacationAccumulator.findOne({
              where: {
                emp_id: employee.id,
              },
            });

            if (vacation.consumed < vacation.last_year_vacation) {
              vacation.remaning = vacation.remaning - vacation.consumed;
              vacationAccumulator.count =
                vacationAccumulator.count - vacation.consumed;
              vacation.minus_march = vacation.consumed;
              await vacation.save();
              await vacationAccumulator.save();
              console.log(
                `[${new Date(
                  new Date() + "UTC"
                )}] vacation has been decreased by ${
                  vacation.consumed
                }  for emp ${employee.id}`
              );
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
})();

function checkInsuranceAndGetBalance(insurance_days_count, birth_date) {
  const {
    balance: greaterThanFiftyBalance,
    greaterThanFifty,
  } = checkIfOverFiftyOrNot(new Date().getFullYear(), birth_date);

  if (!greaterThanFifty) {
    let lessThanDaysCount = 0,
      greaterThanDaysCount = 0,
      count = 365;
    // 3655
    while (count > 0) {
      if (insurance_days_count >= 3655) {
        greaterThanDaysCount++;
      } else lessThanDaysCount++;
      insurance_days_count++;
      count--;
    }
    let balance =
      (lessThanDaysCount / 30) * 1.75 + (greaterThanDaysCount / 30) * 2.5;

    return balance;
  } else return greaterThanFiftyBalance;
}

function checkIfOverFiftyOrNot(Cyear, birth_date) {
  let start_date = new Date(`${Cyear}-01-01T00:00:00.000Z`);
  let end_date = new Date(`${Cyear}-12-31T00:00:00.000Z`);
  let greaterThanFifty = false;
  let lessThanDaysCount = 0,
    greaterThanDaysCount = 0,
    balance = 0;
  if (birth_date) {
    birth_date = new Date(birth_date.replace(" ", "T").concat(".000Z"));
    while (start_date <= end_date) {
      if (getTwoDigits((start_date - birth_date) / 31536000000) < 50)
        lessThanDaysCount++;
      else {
        greaterThanFifty = true;
        greaterThanDaysCount++;
      }
      start_date.setDate(start_date.getDate() + 1);
    }

    balance =
      (lessThanDaysCount / 30) * 1.75 + (greaterThanDaysCount / 30) * 2.5;
  }
  return { greaterThanFifty, balance };
}

async function afterEmployeehasBeenCreated(
  id,
  Cyear,
  Jyear,
  Jmonth,
  Jday,
  insuranceDate
) {
  let currentYearBalance = checkInsuranceAndGetBalance(
    Cyear,
    Jyear,
    Jmonth,
    Jday,
    insuranceDate
  );
  await VacationAccumulator.create({
    emp_id: id,
    count: parseFloat(currentYearBalance),
  });
  const vacationRecord = await Vacation.create({
    emp_id: id,
    year: Cyear,
    last_year_vacation: 0,
    remaning: currentYearBalance,
    minus_march: 0,
    consumed: 0,
    vacation_block: true,
  });
}

async function runEveryDayCheckIfEmpPassSixMonths() {
  try {
    const employees = await Employee.findAll({
      attributes: ["id", "join_date"],
    });
    let join_date = new Date("2020-11-01T00:00:00.000Z");
    let today = new Date("2021-05-01T00:00:00.000Z");
    let workingMonth = Math.round(
      getTwoDigits((today - join_date) / 2592000000)
    );

    if (workingMonth >= 6) {
      const vacation = await Vacation.findOne({
        where: {
          emp_id: employees[0].id,
          year: join_date.getFullYear().toString(),
        },
      });
      if (vacation) {
        vacation.vacation_block = false;
        await vacation.save();
      }
    }
  } catch (error) {}
}

function getTwoDigits(hours) {
  if (hours.toString().includes(".")) {
    let [after, before] = hours.toString().split(".");
    return parseFloat(`${after}.${before[0]}${before[1]}`);
  } else return parseFloat(hours);
}
