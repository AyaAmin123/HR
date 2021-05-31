const { Attendance, Lateness } = require("../../models");
const { Op } = require("sequelize");
const { update_actual_in_and_out } = require("../update_actual_in_and_out");

(async function calculateLatenessEveryDay() {
  try {
    let today = new Date();
    today.setDate(today.getDate() - 1);
    today = today.toISOString().split("T")[0];
    const { valid, msg } = (await update_actual_in_and_out(today)) || {};

    //test
    // for (const iterator of [
    //   "01",
    //   "02",
    //   "03",
    //   "04",
    //   "05",
    //   "06",
    //   "07",
    //   "08",
    //   "09",
    //   "10",
    //   "11",
    //   "12",
    //   "13",
    //   "14",
    //   "15",
    //   // "16",
    //   // "17",
    //   // "18",
    //   // "19",
    //   // "20",
    //   // "21",
    //   // "22",
    //   // "23",
    //   // "24",
    //   // "25",
    //   // "26",
    //   // "27",
    //   // "28",
    //   // "29",
    //   // "30",
    //   // "31",
    // ]) {
    // today = `2021-02-${iterator}`;
    // await update_actual_in_and_out(today);
    if (valid) {
      const data = await Attendance.findAll({
        where: {
          current_date: {
            [Op.between]: [`${today} 00:00:00`, `${today} 23:59:59`],
          },
          is_exception: false,
        },
      });
      if (data && data.length !== 0) {
        for (let {
          actual_in,
          actual_out,
          planned_in,
          planned_out,
          emp_id,
          forgiveness_evening_time,
          forgiveness_morning_time,
        } of data) {
          const latnessCreated = await Lateness.findOne({
            where: {
              emp_id,
              date: `${today} 00:00:00`,
            },
          });
          if (latnessCreated) {
            console.log("lateness has been calculated before");
            continue;
          }

          if (
            forgiveness_evening_time === 10 &&
            forgiveness_morning_time === 30
          ) {
            const {
              plan_in,
              plan_out,
            } = get_planned_in_out_for_office_boys_and_public_relations(
              actual_in ? new Date(actual_in) : null,
              actual_out ? new Date(actual_out) : null
            );
            planned_in = plan_in;
            planned_out = plan_out;
          }
          let latenessSum = 0,
            differeneceIn = 0,
            differeneceOut = 0;
          if (
            actual_in !== null &&
            actual_out !== null &&
            // actual_in === actual_out //forget to take face print
            (new Date(actual_out) - new Date(actual_in)) / 60000 <= 5
          ) {
            differeneceIn =
              (new Date(actual_in) - new Date(planned_in)) / 60000; // in minutes
            differeneceOut =
              (new Date(planned_out) - new Date(actual_out)) / 60000; // in minutes
            if (differeneceIn > forgiveness_morning_time) {
              latenessSum = differeneceIn;
            }
            if (differeneceOut > forgiveness_evening_time) {
              latenessSum += differeneceOut;
            }
            //TODO: check if employee has record before or not
            const data = await Lateness.create({
              emp_id,
              date: `${today} 00:00:00`,
              lateness_hours:
                latenessSum !== 0 ? getTwoDigits(latenessSum / 60) : 0,
              forgot_face_print: true,
            });
          } else if (actual_in !== null && actual_out !== null) {
            differeneceIn =
              (new Date(actual_in) - new Date(planned_in)) / 60000; //in minutes
            differeneceOut =
              (new Date(actual_out) - new Date(planned_out)) / 60000; //in minutes

            if (differeneceIn > forgiveness_morning_time) {
              latenessSum = differeneceIn;
            }
            if (differeneceOut < -forgiveness_evening_time) {
              latenessSum += Math.abs(differeneceOut);
            }

            if (latenessSum !== 0) {
              let data = await Lateness.findOne({
                where: {
                  emp_id,
                  date: `${today} 00:00:00`,
                },
              });
              if (data === null)
                await Lateness.create({
                  emp_id,
                  date: `${today} 00:00:00`,
                  lateness_hours: getTwoDigits(latenessSum / 60),
                  forgot_face_print: false,
                });
            }
          } else {
            await Lateness.create({
              emp_id,
              date: `${today} 00:00:00`,
              lateness_hours:
                forgiveness_evening_time === 10 &&
                forgiveness_morning_time === 30
                  ? 9
                  : 8,
              forgot_face_print: false,
            });
          }
          //TODO: check if have vacations or deduct from salary
        }
        console.log(
          `[${new Date(
            new Date() + "UTC"
          )}] lateness has been recorded sucessfully`
        );
      } else console.log("no records found for attendance table");
      // }
    } else console.log(msg);
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

function get_planned_in_out_for_office_boys_and_public_relations(
  actual_in,
  actual_out
) {
  if (actual_in && actual_out) {
    let year_month_day = actual_in.toISOString().split("T")[0];
    let r1 = new Date(`${year_month_day} 07:00:00`);
    let e1 = new Date(`${year_month_day} 07:30:00`);
    let r2 = new Date(`${year_month_day} 08:00:00`);
    let e2 = new Date(`${year_month_day} 08:30:00`);
    let plan_out = "";
    let plan_in = "";

    if (actual_in >= r1 && actual_in <= e1 && actual_in !== actual_out) {
      plan_in = `${year_month_day} 07:00:00`;
      plan_out = `${year_month_day} 16:00:00`;
    } else if (actual_in >= r2 && actual_in <= e2 && actual_in !== actual_out) {
      plan_in = `${year_month_day} 08:00:00`;
      plan_out = `${year_month_day} 17:00:00`;
    } else {
      let diff_from_5 =
        (actual_out - new Date(`${year_month_day} 17:00:00`)) / 60000;
      let diff_from_4 =
        (actual_out - new Date(`${year_month_day} 16:00:00`)) / 60000;

      let diff_from_8 =
        (actual_out - new Date(`${year_month_day} 08:00:00`)) / 60000;
      let diff_from_7 =
        (actual_out - new Date(`${year_month_day} 07:00:00`)) / 60000;

      if (diff_from_5 + diff_from_8 <= diff_from_4 + diff_from_7) {
        plan_in = `${year_month_day} 08:00:00`;
        plan_out = `${year_month_day} 17:00:00`;
      } else {
        plan_in = `${year_month_day} 07:00:00`;
        plan_out = `${year_month_day} 16:00:00`;
      }
    }
    return {
      plan_in,
      plan_out,
    };
  } else
    return {
      plan_in: null,
      plan_out: null,
    };
}
