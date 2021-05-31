const empsController = require("../../controllers/employees_controller");
const {
  Attendance,
  Request,
  Requests_detail,
  OfficialHolidays,
} = require("../../models");
const { Op } = require("sequelize");
let branches_9 = ["HQ", "Maintenance Center"];
let employees_types = ["Office Boy", "Public Relations"];
async function get_employess() {
  const { data } = await empsController.get_all();
  return data;
}
// id, emp_id, current_date, planned_in, planned_out, actual_in, actual_out, is_exception
(async function insertRecords() {
  try {
    //main
    const employees = await get_employess();
    for (const employee of employees) {
      let timeFrom = "09:00:00",
        timeTo = "17:00:00",
        forgiveness_evening_time = 15,
        forgiveness_morning_time = 15;
      if (
        employee.Branch &&
        employee.Branch.name &&
        branches_9.includes(employee.Branch.name.trim())
      ) {
        timeFrom = "09:00:00";
        timeTo = "17:00:00";
        forgiveness_evening_time = 15;
        forgiveness_morning_time = 15;
      } else {
        if (employees_types.includes(employee.Position.en_name.trim())) {
          timeFrom = "08:00:00";
          timeTo = "17:00:00";
          forgiveness_evening_time = 10;
          forgiveness_morning_time = 30;
        } else {
          timeFrom = "08:00:00";
          timeTo = "16:00:00";
          forgiveness_evening_time = 10;
          forgiveness_morning_time = 15;
        }
      }
      const {
        planned_in,
        planned_out,
        is_exception,
        request_id,
        official_holiday_id,
      } = await get_planned_in_and_out(
        employee.id,
        new Date().toISOString().split("T")[0],
        timeFrom,
        timeTo
      );
      let att = await Attendance.findOne({
        where: {
          emp_id: employee.id,
          current_date: new Date(
            `${new Date().toISOString().split("T")[0]} 00:00:00`
          ),
        },
      });
      if (att === null)
        await Attendance.create({
          emp_id: employee.id,
          current_date: new Date().toISOString(),
          planned_in,
          planned_out,
          request_id,
          is_exception,
          official_holiday_id,
          forgiveness_evening_time,
          forgiveness_morning_time,
        });
    }

    console.log(
      `[${new Date(new Date() + "UTC")}] new attendanceRecord for emp ${
        employee.id
      } has been inserted successfully\n`
    );
  } catch (error) {
    return {
      valid: false,
      msg: error.message,
    };
  }
})();

async function get_planned_in_and_out(emp_id, date, timeFrom, timeTo) {
  let Presence = new Date(`${date} ${timeFrom}`),
    departure = new Date(`${date} ${timeTo}`),
    todayDate = new Date(`${date}T02:00:00.000Z`).toISOString(), // new Date(new Date() + "UTC").toISOString(),
    fridayOrsaturday = new Date(`${date}T02:00:00.000Z`).getDay(),
    count = 0,
    request_id = null,
    official_holiday_id = null,
    is_exception = false;

  const officialHoliday = await OfficialHolidays.findOne({
    where: {
      from: {
        [Op.lte]: todayDate,
      },
      to: {
        [Op.gte]: todayDate,
      },
    },
  });
  if (officialHoliday) {
    official_holiday_id = officialHoliday.holiday_type_id;
    is_exception = true;
    Presence = new Date(`${officialHoliday.from}`);
    departure = new Date(`${officialHoliday.to}`);
  } else if (fridayOrsaturday === 5 || fridayOrsaturday === 6) {
    is_exception = true;
    Presence = null;
    departure = null;
  } else {
    const requests = await Request.findAll({
      where: {
        emp_id,
        state_id: 4,
        action_id: 2,
        process_id: {
          [Op.ne]: 3,
        },
      },
      include: [Requests_detail],
    });
    if (requests) {
      for (let request of requests) {
        count = 0;
        for (const { key, value } of request.Requests_details) {
          if (key === "from") {
            let [requestFromDate, requestFromTime] = value.split(" ");
            let from = new Date(`${requestFromDate}T${requestFromTime}.000Z`);

            if (
              from <= todayDate ||
              from.toISOString().includes(todayDate.split("T")[0])
            ) {
              count++;

              Presence = new Date(`${requestFromDate} ${requestFromTime}`);
            }
          } else if (key === "to") {
            let [requestToDate, requestToTime] = value.split(" ");
            let to = new Date(`${requestToDate}T${requestToTime}.000Z`);

            if (
              to >= todayDate ||
              to.toISOString().includes(todayDate.split("T")[0])
            ) {
              count++;
              departure = new Date(`${requestToDate} ${requestToTime}`);
            }
          }
        }
        if (count === 2) {
          let tempPresence = new Date(
            `2020-10-10T${
              new Date(new Date(Presence.toISOString()) + "UTC")
                .toISOString()
                .split("T")[1]
                .split(".")[0]
            }.000Z`
          );
          let tempDeparture = new Date(
            `2020-10-10T${
              new Date(new Date(departure.toISOString()) + "UTC")
                .toISOString()
                .split("T")[1]
                .split(".")[0]
            }.000Z`
          );
          let tempFrom = new Date(`2020-10-10T${timeFrom}.000Z`);
          let tempTo = new Date(`2020-10-10T${timeTo}.000Z`);

          if (request.process_id === 2 || request.process_id === 16) {
            if (tempPresence - tempFrom === 0 && tempTo - tempDeparture > 0) {
              //in first
              Presence = departure;
              departure = new Date(`${date} ${timeTo}`);
              is_exception = false;
            } else if (
              tempPresence - tempFrom > 0 &&
              tempTo - tempDeparture > 0
            ) {
              // middle
              Presence = new Date(`${date} ${timeFrom}`);
              departure = new Date(`${date} ${timeTo}`);
              is_exception = false;
            } //last
            else if (
              tempTo - tempDeparture === 0 &&
              tempPresence - tempFrom > 0
            ) {
              departure = Presence;
              Presence = new Date(`${date} ${timeFrom}`);
              is_exception = false;
            } else if (
              tempPresence - tempFrom === 0 &&
              tempTo - tempDeparture === 0
            ) {
              is_exception = true;
            }
            request_id = request.id;
          } else {
            request_id = request.id;
            is_exception = true;
            Presence = null;
            departure = null;
          }
          break;
        }
      }
    }
    if (count !== 2) {
      Presence = new Date(`${date} ${timeFrom}`);
      departure = new Date(`${date} ${timeTo}`);
    }
  }
  return {
    planned_in: Presence,
    planned_out: departure,
    is_exception: is_exception,
    request_id,
    official_holiday_id,
  };

  // return request;
}
