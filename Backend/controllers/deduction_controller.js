const {
  Employee,
  EmployeeDetail,
  Deduction,
  Branch,
  Position,
  Lateness,
  EmpPenalityCounts,
  Accumulator,
  VacationAccumulator,
  Vacation,
  MonthlyCalculatedFlag,
  JobStatus,
} = require("../models/index");
const { Op } = require("sequelize");
const actionLogger = require("../utilities/actionLog");
const { calculateLatnessFromTo } = require("../scripts/calculateLatnessFromTo");
const { monthlyCloseFunc } = require("../scripts/monthlyClose");
const {
  monthlyClose: monthlyCloseDate,
} = require("../utilities/processConfig");

async function get(date, page = 0, per_page = 10) {
  try {
    let conditions = {
      ...(date
        ? {
            date: {
              [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
            },
          }
        : {}),
    };
    const { count, rows } = await Deduction.findAndCountAll({
      where: { ...conditions },
      offset: parseInt(page * per_page),
      limit: parseInt(per_page),
      include: [
        {
          model: Employee,
          attributes: ["ar_name", "id"],
          include: [
            {
              model: Branch,
              as: "Branch",
              attributes: ["name"],
            },
            {
              model: Position,
              as: "Position",
              attributes: ["en_name"],
            },
          ],
        },
      ],
      attributes: ["deducted_days_from_salary", "date", "reason", "closed"],
    });
    if (count !== 0)
      return {
        valid: true,
        page,
        per_page,
        data: rows,
        total: count,
        msg: "تم تحمبل البيانات بنجاح",
      };
    else
      return {
        valid: false,
        page,
        per_page,
        total: 0,
        msg: "لم يتم ايجاد خصومات",
      };
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
    };
  }
}
async function forgiveDeduction(emp_id, date, monthlyClose, user_id) {
  try {
    let [year, month, day] = new Date(
      `${monthlyClose.replace(" ", "T").concat(".000Z")}`
    )
      .toISOString()
      .split("T")[0]
      .split("-");

    const deduction = await Deduction.findOne({
      where: {
        emp_id,
        date: `${year}-${month}-${day} 00:00:00`,
      },
    });
    if (deduction.closed)
      return {
        valid: false,
        msg: "لن يتم السماح بالتجاوز",
      };
    let lateness = await Lateness.findOne({
      where: {
        emp_id,
        date: {
          [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
        },
      },
    });
    lateness.forgived = true;
    // lateness.lateness_hours = 0;
    // lateness.forgot_face_print = 0;
    await lateness.save();

    if (deduction.deducted_days_from_vacation >= 0) {
      const vacationAccumulator = await VacationAccumulator.findOne({
        where: {
          emp_id,
        },
      });
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });

      vacationAccumulator.count = vacationAccumulator.count + 0.5;
      vacation.remaning = vacation.remaning + 0.5;
      vacation.consumed = vacation.consumed - 0.5;
      await vacationAccumulator.save();
      await vacation.save();
    }

    let employee = await Employee.findOne({
      where: {
        id: emp_id,
      },
      include: [Branch],
    });
    const { Branch: branch } = employee;

    await updateMonthlyCloseForSpecificEmployee(monthlyClose, emp_id, branch);

    await actionLogger(
      emp_id,
      `لقد قام user بالتجاوز عن التأخير للموظف emp عن يوم ${date}`,
      user_id
    );
    return {
      valid: true,
      msg: "تم التجاوز بنجاح",
    };
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
    };
  }
}
async function updateMonthlyCloseForSpecificEmployee(
  monthlyClose,
  emp_id,
  branch
) {
  try {
    let [year, month, day] = new Date(
      `${monthlyClose.replace(" ", "T").concat(".000Z")}`
    )
      .toISOString()
      .split("T")[0]
      .split("-");
    let start_date = "",
      end_date = "";

    if (day === "15") {
      if (month === "1") {
        start_date = `${year}-${month}-1 00:00:00`;
        end_date = `${year}-${month}-15 00:00:00`;
      } else {
        start_date = `${year}-${parseInt(month) - 1}-16 00:00:00`;
        end_date = `${year}-${month}-15 00:00:00`;
      }
    } else if (day === "31" && month === "12") {
      start_date = `${year}-${month}-16 00:00:00`;
      end_date = `${year}-${month}-31 00:00:00`;
    }

    if (start_date.length !== 0 && end_date.length !== 0) {
      // get this month lateness
      const lateness = await Lateness.findAll({
        where: {
          date: {
            [Op.between]: [`${start_date}`, `${end_date}`],
          },
          emp_id,
          forgived: false,
        },
      });
      let lateness_hours_count = 0,
        forgot_face_print_count = 0;
      for (const { lateness_hours, forgot_face_print } of lateness) {
        lateness_hours_count += parseFloat(lateness_hours);
        forgot_face_print && forgot_face_print_count++;
      }

      if (lateness_hours_count <= 1) lateness_hours_count = 0;
      else lateness_hours_count = lateness_hours_count - 1;

      if (forgot_face_print_count <= 3) forgot_face_print_count = 0;
      else forgot_face_print_count = forgot_face_print_count - 3;

      EmpPenalityCounts.update(
        {
          lateness_hours_count: parseFloat(getTwoDigits(lateness_hours_count)),
          forgot_face_print_count,
        },
        {
          where: {
            emp_id,
            date: `${year}-${month}-${day}`,
          },
        }
      );
      await accumlateOrDeduct(
        emp_id,
        year,
        month,
        day,
        parseFloat(getTwoDigits(lateness_hours_count)),
        forgot_face_print_count,
        branch
      );

      console.log(
        `[${new Date(
          new Date() + "UTC"
        )}] monthly close has been calculated successfully `
      );
    }
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
  }
}
async function accumlateOrDeduct(
  emp_id,
  year,
  month,
  day,
  lateness_hours_sum,
  forgot_face_print_count,
  branch
) {
  let accumulator = await Accumulator.findOne({
    where: {
      emp_id,
      year,
    },
  });
  let sum = parseFloat(getTwoDigits(lateness_hours_sum / 8));

  if (accumulator) sum += parseFloat(accumulator.previous_count);

  forgot_face_print_count = forgot_face_print_count / 2;

  const { deduction, rest } = calculateDeductionAndRest(sum);

  //chech if emp hq or not
  if (deduction === 0.5 && branch.name === "HQ") {
    const vacationAccumulator = await VacationAccumulator.findOne({
      where: {
        emp_id,
      },
    });
    const vacation = await Vacation.findOne({
      where: {
        emp_id,
        year: new Date().getFullYear(),
      },
    });

    let consumed_from_vacation = false;
    if (vacationAccumulator.count >= 0.5) {
      vacationAccumulator.count = vacationAccumulator.count - 0.5;
      vacation.remaning = vacation.remaning - 0.5;
      vacation.consumed = vacation.consumed + 0.5;
      await vacationAccumulator.save();
      await vacation.save();
      consumed_from_vacation = true;
    } else forgot_face_print_count += 0.5;

    await Deduction.update(
      {
        emp_id,
        date: `${year}-${month}-${day} 00:00:00`,
        deducted_days_from_vacation: consumed_from_vacation ? 0.5 : 0,
        deducted_days_from_salary: forgot_face_print_count,
        reason: "lateness",
      },
      {
        where: {
          emp_id,
          date: `${year}-${month}-${day} 00:00:00`,
        },
      }
    );
  } else if (forgot_face_print_count >= 0.5 || deduction > 0.5)
    await Deduction.update(
      {
        emp_id,
        date: `${year}-${month}-${day} 00:00:00`,
        deducted_days_from_vacation: 0,
        deducted_days_from_salary: getTwoDigits(
          forgot_face_print_count + deduction
        ),
        reason: "lateness",
      },

      {
        where: {
          emp_id,
          date: `${year}-${month}-${day} 00:00:00`,
        },
      }
    );
  else {
    await Deduction.update(
      {
        emp_id,
        date: `${year}-${month}-${day} 00:00:00`,
        deducted_days_from_vacation: 0,
        deducted_days_from_salary: 0,
      },

      {
        where: {
          emp_id,
          date: `${year}-${month}-${day} 00:00:00`,
        },
      }
    );
  }

  //count rest
  accumulator.count = parseFloat(getTwoDigits(rest));

  await accumulator.save();
}
function calculateDeductionAndRest(value) {
  let start = 0.5,
    end = 0.75,
    differenceStart = 0,
    differenceEnd = 0;
  if (value < 0.5)
    return {
      deduction: 0,
      rest: value,
    };
  else {
    while (value > end) {
      start += 0.25;
      end += 0.25;
    }
  }
  differenceStart = value - start;
  differenceEnd = end - value;

  if (differenceStart < differenceEnd) {
    return {
      deduction: start,
      rest: differenceStart,
    };
  } else
    return {
      deduction: end,
      rest: -differenceEnd,
    };
}
function getTwoDigits(hours) {
  if (hours.toString().includes(".")) {
    let [after, before] = hours.toString().split(".");
    return parseFloat(`${after}.${before[0]}${before[1]}`);
  } else return parseFloat(hours);
}
async function calculateDeductionsToTheResignationDate(emp_id, end_date) {
  try {
    let startMonthlyClose = getStartDateForMonthlyCloseForResignation(end_date);
    // const deduction = await Deduction.findAll({
    //   limit: 1,
    //   where: {
    //     emp_id,
    //   },
    //   order: [["createdAt", "DESC"]],
    // });

    // if (deduction.length !== 0) {
    let start_date = new Date(new Date(`${startMonthlyClose}`) + "UTC"),
      lateness_hours_count = 0,
      forgot_face_print_count = 0;

    start_date.setDate(start_date.getDate() + 1);
    // if (new Date(end_date) < start_date)
    //   return {
    //     valid: false,
    //     msg: `يجب ادخال تاريخ بعد ${start_date}`,
    //   };
    await calculateLatnessFromTo(start_date, new Date(end_date));

    const employee = await Employee.findOne({
      where: {
        id: emp_id,
      },
      include: [
        {
          model: Branch,
          as: "Branch",
          attributes: ["name"],
        },
      ],
    });
    start_date = new Date(new Date(`${startMonthlyClose}`) + "UTC");
    const lateness = await Lateness.findAll({
      where: {
        date: {
          [Op.between]: [
            `${start_date.toISOString().split("T")[0]} 00:00:00`,
            `${new Date(end_date).toISOString().split("T")[0]} 23:59:59`,
          ],
        },
        emp_id,
      },
    });

    for (const { lateness_hours, forgot_face_print } of lateness) {
      lateness_hours_count += parseFloat(lateness_hours);
      forgot_face_print && forgot_face_print_count++;
    }

    const data = await accumlateOrDeductForResignation(
      emp_id,
      employee.Branch.name,
      lateness_hours_count,
      forgot_face_print_count
    );

    console.log(data);
    return {
      valid: true,
      msg: "تم تحميل البيانات بنجاح",
      data: data,
    };
    // }
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
    };
  }
}

async function accumlateOrDeductForResignation(
  emp_id,
  branch,
  lateness_hours_sum,
  forgot_face_print_count
) {
  console.log(emp_id, branch, lateness_hours_sum, forgot_face_print_count);
  let year = new Date().getFullYear();
  let sum = parseFloat(getTwoDigits(lateness_hours_sum / 8));
  console.log({ sum });
  let accumulator = await Accumulator.findOne({
    where: {
      emp_id,
      year,
    },
  });

  if (accumulator) sum += parseFloat(accumulator.count);
  else {
    accumulator = await Accumulator.findOne({
      where: {
        emp_id,
        year: year - 1, // decresea
      },
    });
  }
  forgot_face_print_count = forgot_face_print_count / 2;

  const { deduction, rest } = calculateDeductionAndRest(sum);
  //chech if emp hq or not
  let deductionOb = {};
  if (deduction === 0.5 && branch.name === "HQ") {
    const vacationAccumulator = await VacationAccumulator.findOne({
      where: {
        emp_id,
      },
    });

    let consumed_from_vacation = false;
    if (vacationAccumulator.count >= 0.5) {
      consumed_from_vacation = true;
    } else forgot_face_print_count += 0.5;
    deductionOb = {
      deducted_days_from_vacation: consumed_from_vacation ? 0.5 : 0,
      deducted_days_from_salary: forgot_face_print_count,
    };
  } else if (forgot_face_print_count >= 0.5 || deduction > 0.5)
    deductionOb = {
      deducted_days_from_vacation: 0,
      deducted_days_from_salary: getTwoDigits(
        forgot_face_print_count + deduction
      ),
    };
  return { deductionOb, rest };
}

function getStartDateForMonthlyCloseForResignation(end_date) {
  let [year] = end_date.split("T")[0].split("-"),
    start_date = "";
  end_date = new Date(end_date);
  for (const date in monthlyCloseDate) {
    let { from, to } = monthlyCloseDate[date];
    from = new Date(from.replace("y", year));
    to = new Date(to.replace("y", year));
    if (end_date - from >= 0 && to - end_date >= 0) {
      start_date = from;
      break;
    }
  }
  return start_date;
}

function calculateMonthlyClose() {
  try {
    let baseYear = "2021";
    let [currentYear] = new Date().toISOString().split("T")[0].split("-");
    let whichMonthlyCloseToStart = getKeyPeriodOfMonthlyClose(
      new Date().toISOString()
    );
    console.log(whichMonthlyCloseToStart);
    checkWhichCloseNotCalculated(
      baseYear,
      currentYear,
      `${currentYear}-${whichMonthlyCloseToStart}`
    );
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
  }
}

function getKeyPeriodOfMonthlyClose(end_date) {
  let [year] = end_date.split("T")[0].split("-"),
    key = "";
  end_date = new Date(end_date);
  for (const date in monthlyCloseDate) {
    let { from, to } = monthlyCloseDate[date];
    from = new Date(from.replace("y", year));
    to = new Date(to.replace("y", year));
    if (end_date - from >= 0 && to - end_date >= 0) {
      key = date;
      break;
    }
  }
  return key;
}
async function checkWhichCloseNotCalculated(
  baseYear,
  currentYear,
  whichMonthlyCloseToStart
) {
  baseYear = parseInt(baseYear);
  currentYear = parseInt(currentYear);

  let jobName = `حساب التقفيلات`;
  let job = await JobStatus.create({
    name: jobName,
    status: "يتم تنفيذها",
  });

  while (baseYear <= currentYear) {
    for (const date in monthlyCloseDate) {
      if (
        new Date(`${baseYear}-${date}`) - new Date(whichMonthlyCloseToStart) <
        0
      ) {
        console.log(`${baseYear}-${date}`);
        const monthlyCalculatedFlag = await MonthlyCalculatedFlag.findOne({
          where: {
            monthly_close_date: `${baseYear}-${date}`,
          },
        });

        if (!monthlyCalculatedFlag) {
          let [month, day] = date.split("-");
          await monthlyCloseFunc(baseYear, month, day);
          await MonthlyCalculatedFlag.create({
            monthly_close_date: `${baseYear}-${date}`,
          });
        }
      }
    }

    baseYear++;
  }
  await JobStatus.update(
    { status: "تم تنفيذها بنجاح" },
    {
      where: {
        id: job.id,
      },
    }
  );
}
module.exports = {
  get: get,
  forgiveDeduction: forgiveDeduction,
  calculateDeductionsToTheResignationDate,
  calculateMonthlyClose,
};
