const { Attendance, RestAllowance, OfficialHolidays } = require("../models");
const { Op } = require("sequelize");
(async function calculateRestAllowance() {
  try {
    let today = new Date("2020-12-20T00:00:00.000Z");
    let valid_to = new Date("2020-12-20T00:00:00.000Z");
    valid_to.setDate(valid_to.getDate() + 14);

    const data = await Attendance.findAll({
      where: {
        current_date: {
          [Op.between]: [
            `${today.toISOString().split("T")[0]} 00:00:00`,
            `${today.toISOString().split("T")[0]} 23:59:59`,
          ],
        },
      },
    });
    console.log({
      record: JSON.stringify(data[0]),
    });
    if (data.length !== 0) {
      for (let {
        actual_in,
        actual_out,
        planned_in,
        planned_out,
        emp_id,
        forgiveness_evening_time,
        forgiveness_morning_time,
      } of data) {
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
        let number_of_hours = 0,
          differeneceIn = 0,
          differeneceOut = 0;
        if (actual_in !== null && actual_out !== null) {
          const officialHoliday = await OfficialHolidays.findOne({
            where: {
              from: {
                [Op.lte]: today,
              },
              to: {
                [Op.gte]: today,
              },
            },
          });
          if (officialHoliday) {
            if ((new Date(actual_out) - new Date(actual_in)) / 3600000 >= 7)
              number_of_hours = 16;
            else
              number_of_hours =
                ((new Date(actual_out) - new Date(actual_in)) / 3600000) * 2;
          } else if (today.getDate() !== 5 && today.getDate() !== 6) {
            /// يوم عمل عادي
            differeneceIn =
              (new Date(actual_in) - new Date(planned_in)) / 60000; // in minutes
            differeneceOut =
              (new Date(actual_out) - new Date(planned_out)) / 3600000; // in hours
            if (differeneceIn <= forgiveness_morning_time) {
              if (differeneceOut === 3) {
                number_of_hours = 1.5;
              } else if (differeneceOut === 5) {
                number_of_hours = 4;
              } else if (differeneceOut > 6.5) {
                number_of_hours = 8;
              }
            }
          } else if (today.getDate() === 5 && today.getDate() === 6) {
            // جمعة و سبت
            if ((new Date(actual_out) - new Date(actual_in)) / 3600000 >= 7)
              number_of_hours = 8;
            else
              number_of_hours =
                (new Date(actual_out) - new Date(actual_in)) / 3600000;
          }
          const data = await RestAllowance.create({
            emp_id,
            rest_allowance_date: `${
              today.toISOString().split("T")[0]
            } 00:00:00`,
            number_of_hours,
            valid_to: new Date(
              `${valid_to.toISOString().replace("T", " ").replace(".000Z", "")}`
            ),
            taked: false,
          });
        }
      }
      console.log(
        `[${new Date(
          new Date() + "UTC"
        )}] lateness has been recorded sucessfully`
      );
    } else console.log("no records found for attendance table");
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
