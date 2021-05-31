const { default: Axios } = require("axios");
const fs = require("fs");
const empsController = require("../controllers/employees_controller");
const {
  Attendance,
  Request,
  Requests_detail,
  Lateness,
  EmpPenalityCounts,
  Deduction,
  Accumulator,
  OfficialHolidays,
  VacationAccumulator,
  Vacation,
} = require("../models");
const { Op } = require("sequelize");
const { calculateLatnessFromTo } = require("./calculateLatnessFromTo");
async function get_employess() {
  const { data } = await empsController.get_all();
  return data;
}

function getTwoDigits(hours) {
  if (hours.toString().includes(".")) {
    let [after, before] = hours.toString().split(".");
    return parseFloat(`${after}.${before[0]}${before[1]}`);
  } else return parseFloat(hours);
}
async function monthlyClose(year, month, day) {
  try {
    // let [year, month, day] = new Date().toISOString().split("T")[0].split("-");
    let start_date = "",
      end_date = "";
    // day = "16";
    // month = "01";
    if (day === "15") {
      //(day === "16") {
      //day = "15";
      if (month === "01") {
        start_date = `${year}-${month}-01 00:00:00`;
        end_date = `${year}-${month}-15 00:00:00`;
      } else {
        let last = parseInt(month) - 1;
        start_date = `${year}-${
          last.toString().length === 1 ? `0${last}` : `${last}`
        }-16 00:00:00`;
        end_date = `${year}-${month}-15 00:00:00`;
      }
    } else if (day === "31" && month === "12") {
      //else if (day === "01" && month === "01") {
      //day = "31";
      //month = "12";
      // year = parseInt(year) - 1;
      start_date = `${year}-${month}-16 00:00:00`;
      end_date = `${year}-${month}-31 00:00:00`;
    }

    if (start_date.length !== 0 && end_date.length !== 0) {
      await Deduction.update(
        {
          closed: true,
        },
        {
          where: {
            closed: false,
          },
        }
      );

      await calculateLatnessFromTo(new Date(start_date), new Date(end_date));

      let employess = await get_employess();
      for (const { id, Branch: branch } of employess) {
        // TODO: calculate lateness before deduction

        // get this month lateness
        const lateness = await Lateness.findAll({
          where: {
            date: {
              [Op.between]: [`${start_date}`, `${end_date}`],
            },
            emp_id: id,
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

        const EmpPenalityCountsCreated = await EmpPenalityCounts.findOne({
          where: {
            emp_id: id,
            date: `${year}-${month}-${day}`,
          },
        });

        if (!EmpPenalityCountsCreated) {
          EmpPenalityCounts.create({
            emp_id: id,
            date: `${year}-${month}-${day}`,
            lateness_hours_count: parseFloat(
              getTwoDigits(lateness_hours_count)
            ),
            forgot_face_print_count,
          });

          await accumlateOrDeduct(
            id,
            year,
            month,
            day,
            parseFloat(getTwoDigits(lateness_hours_count)),
            forgot_face_print_count,
            branch
          );
        } else {
          console.log("deduction has been calculated before");
        }
      }
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

  if (accumulator) sum += parseFloat(accumulator.count);
  else {
    accumulator = await Accumulator.create({
      emp_id,
      year,
      count: 0,
      previous_count: 0,
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
    deductionOb = {
      emp_id,
      date: `${year}-${month}-${day} 00:00:00`,
      deducted_days_from_vacation: consumed_from_vacation ? 0.5 : 0,
      deducted_days_from_salary: forgot_face_print_count,
      reason: "lateness",
    };
  } else if (forgot_face_print_count >= 0.5 || deduction > 0.5)
    deductionOb = {
      emp_id,
      date: `${year}-${month}-${day} 00:00:00`,
      deducted_days_from_vacation: 0,
      deducted_days_from_salary: getTwoDigits(
        forgot_face_print_count + deduction
      ),
      reason: "lateness",
    };
  const deductionFound = await Deduction.findOne({
    where: {
      emp_id,
      date: `${year}-${month}-${day} 00:00:00`,
    },
  });
  if (deductionFound) {
    deductionFound.deducted_days_from_vacation =
      deductionFound.deducted_days_from_vacation +
      deductionOb.deducted_days_from_vacation;
    deductionFound.deducted_days_from_salary =
      deductionFound.deducted_days_from_salary +
      deductionOb.deducted_days_from_salary;
    deductionFound.save();
  } else if (Object.keys(deductionOb).length !== 0)
    await Deduction.create(deductionOb);
  //count rest
  accumulator.previous_count = accumulator.count;
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
module.exports = {
  monthlyCloseFunc: monthlyClose,
};
