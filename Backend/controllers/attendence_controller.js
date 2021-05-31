const env = process.env.NODE_ENV || "development";
const {
  employee_attendence,
  Employee,
  Attendance,
  AttendanceMisReport,
  AttendanceMisAction,
  Request,
  Process,
  Requests_detail,
  OfficialHolidays,
  HolidaysTypes,
  sequelize,
  JobStatus,
} = require("../models/index");
const { QueryTypes } = require("sequelize");
const { Op, Sequelize } = require("sequelize");
const attendence_api = require("../services/attendence_api");
const moment = require("moment");
const actionLogger = require("../utilities/actionLog");
var fs = require("fs");

async function getAttendence(
  start_date,
  end_date,
  departments,
  page,
  page_size,
  employees
) {
  start_date = moment().format("YYYY-MM-DD");
  end_date = moment().format("YYYY-MM-DD");

  departments = "";
  page = "1";
  page_size = "20";
  employees = "32";
  // employees = await Employee.findAll({
  //     where: {
  //         finger_print_id: {
  //             [Op.not]: null
  //         }
  //     }
  // });
  var _payload = {
    start_date: start_date,
    end_date: end_date,
    departments: departments,
    page: page,
    page_size: page_size,
    employees: employees,
  };
  const get_att = await attendence_api.attendence_report(_payload);
  return get_att;
}

async function setFingerPrint() {
  const get_employees = await attendence_api.employees();
  return get_employees;
}

async function get(
  lateness_filter,
  department_id,
  branch_id,
  ar_name,
  finger_print_id,
  date = new Date().toISOString().split("T")[0],
  page = 0,
  per_page = 10
) {
  try {
    // if (lateness_filter) {
    //   let dateFrom = `${date} 00:00:00`;
    //   let dateTo = `${date} 23:59:59`;

    //   let rows = [];
    //   if (lateness_filter === "1") {
    //     console.log("here");
    //     rows = await sequelize.query(
    //       `SELECT * FROM
    //        attendances INNER JOIN employees ON attendances.emp_id=employees.id
    //        INNER JOIN employees ON attendances.emp_id=employees.id

    //       where actual_in > planned_in + 15 and createdAt between  '${dateFrom}' and '${dateTo}'`,
    //       { type: QueryTypes.SELECT }
    //     );
    //   } else if (lateness_filter === "2") {
    //     rows = await sequelize.query(
    //       `SELECT * FROM attendances where actual_out <  planned_out - 15 and createdAt between  '${dateFrom}' and '${dateTo}'`,
    //       { type: QueryTypes.SELECT }
    //     );
    //   } else if (lateness_filter === "3") {
    //     rows = await sequelize.query(
    //       `SELECT * FROM attendances where actual_in = null and  actual_out = null and createdAt between  '${dateFrom}' and '${dateTo}'`,
    //       { type: QueryTypes.SELECT }
    //     );
    //   }

    //   if (rows.length !== 0)
    //     return {
    //       valid: true,
    //       page: 0,
    //       per_page: 10,
    //       data: rows,
    //       total: rows.length,
    //       msg: "تم تحمبل البيانات بنجاح",
    //     };
    //   else
    //     return {
    //       valid: false,
    //       page: 0,
    //       per_page: 10,
    //       total: 0,
    //       msg: "لم يتم ايجاد موظفين",
    //     };
    // }
    let emp_conditions = {
      ...(department_id ? { department_id } : {}),
      ...(branch_id ? { branch_id } : {}),
      ...(ar_name ? { ar_name: { [Op.like]: `%${ar_name}%` } } : {}),
      ...(finger_print_id ? { finger_print_id } : {}),
      actual_status: 1,
    };

    if (lateness_filter) {
      let result = [];
      const { count, rows } = await Attendance.findAndCountAll({
        where: {
          ...(date
            ? {
                createdAt: {
                  [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
                },
              }
            : {}),
        },
        include: [
          {
            model: Employee,
            attributes: ["ar_name", "emp_code"],
            where: {
              ...emp_conditions,
            },
          },
          {
            model: Request,
            include: [{ model: Requests_detail }, { model: Process }],
          },
          { model: OfficialHolidays, include: [HolidaysTypes] },
        ],
      });

      // if (count !== 0)
      //   return {
      //     valid: true,
      //     page,
      //     per_page,
      //     data: rows,
      //     total: count,
      //     msg: "تم تحمبل البيانات بنجاح",
      //   };
      // else
      //   return {
      //     valid: false,
      //     page,
      //     per_page,
      //     total: 0,
      //     msg: "لم يتم ايجاد موظفين",
      //   };
      if (lateness_filter === "1") {
        rows.forEach((row) => {
          if (row.actual_in) {
            let tempPlanned_in = new Date(
              row.planned_in.replace(" ", "T").concat(".000Z")
            );
            let tempActual_in = new Date(
              row.actual_in.replace(" ", "T").concat(".000Z")
            );
            let tempActual_out = new Date(
              row.actual_out.replace(" ", "T").concat(".000Z")
            );
            if (
              (tempActual_in - tempPlanned_in) / 60000 > 15 &&
              tempActual_in - tempActual_out === 0
            ) {
              result.push(row);
            }
          }
        });
        return {
          valid: true,
          page: 0,
          per_page: 10,
          data: result,
          total: result.length,
          msg: "تم تحمبل البيانات بنجاح",
        };
      } else if (lateness_filter === "2") {
        rows.forEach((row) => {
          if (row.actual_in && row.actual_in !== row.actual_out) {
            let tempPlanned_out = new Date(
              row.planned_out.replace(" ", "T").concat(".000Z")
            );
            let tempPlanned_in = new Date(
              row.planned_in.replace(" ", "T").concat(".000Z")
            );
            let tempActual_out = new Date(
              row.actual_out.replace(" ", "T").concat(".000Z")
            );
            let tempActual_in = new Date(
              row.actual_in.replace(" ", "T").concat(".000Z")
            );
            if (
              (tempActual_in - tempPlanned_in) / 60000 > 15 &&
              (tempActual_out - tempActual_in) / 60000 > 5 &&
              (tempPlanned_out - tempActual_out) / 60000 > 15
            )
              result.push(row);
          }
        });
        return {
          valid: true,
          page: 0,
          per_page: 10,
          data: result,
          total: result.length,
          msg: "تم تحمبل البيانات بنجاح",
        };
      } else if (lateness_filter === "3") {
        rows.forEach((row) => {
          if (row.actual_in && row.actual_in !== row.actual_out) {
            let tempPlanned_out = new Date(
              row.planned_out.replace(" ", "T").concat(".000Z")
            );
            let tempPlanned_in = new Date(
              row.planned_in.replace(" ", "T").concat(".000Z")
            );
            let tempActual_out = new Date(
              row.actual_out.replace(" ", "T").concat(".000Z")
            );
            let tempActual_in = new Date(
              row.actual_in.replace(" ", "T").concat(".000Z")
            );
            if (
              (tempActual_in - tempPlanned_in) / 60000 > 15 &&
              (tempActual_out - tempActual_in) / 60000 > 5 &&
              (tempPlanned_out - tempActual_out) / 60000 < 15
            )
              result.push(row);
          }
        });
        return {
          valid: true,
          page: 0,
          per_page: 10,
          data: result,
          total: result.length,
          msg: "تم تحمبل البيانات بنجاح",
        };
      } else if (lateness_filter === "4") {
        rows.forEach((row) => {
          if (row.actual_in && row.actual_in !== row.actual_out) {
            let tempPlanned_out = new Date(
              row.planned_out.replace(" ", "T").concat(".000Z")
            );
            let tempPlanned_in = new Date(
              row.planned_in.replace(" ", "T").concat(".000Z")
            );
            let tempActual_out = new Date(
              row.actual_out.replace(" ", "T").concat(".000Z")
            );
            let tempActual_in = new Date(
              row.actual_in.replace(" ", "T").concat(".000Z")
            );
            if (
              tempActual_in - tempActual_out === 0 &&
              (tempPlanned_out - tempActual_out) / 60000 > 15
            )
              result.push(row);
          }
        });
        return {
          valid: true,
          page: 0,
          per_page: 10,
          data: result,
          total: result.length,
          msg: "تم تحمبل البيانات بنجاح",
        };
      } else if (lateness_filter === "5") {
        rows.forEach((row) => {
          if (row.actual_in && row.actual_in !== row.actual_out) {
            let tempPlanned_out = new Date(
              row.planned_out.replace(" ", "T").concat(".000Z")
            );
            let tempPlanned_in = new Date(
              row.planned_in.replace(" ", "T").concat(".000Z")
            );
            let tempActual_out = new Date(
              row.actual_out.replace(" ", "T").concat(".000Z")
            );
            let tempActual_in = new Date(
              row.actual_in.replace(" ", "T").concat(".000Z")
            );
            if (
              (tempActual_in - tempPlanned_in) / 60000 < 15 &&
              (tempPlanned_out - tempActual_out) / 60000 > 15 &&
              (tempActual_out - tempActual_in) / 60000 > 5
            )
              result.push(row);
          }
        });
        return {
          valid: true,
          page: 0,
          per_page: 10,
          data: result,
          total: result.length,
          msg: "تم تحمبل البيانات بنجاح",
        };
      } else if (lateness_filter === "6") {
        rows.forEach((row) => {
          if (row.actual_in === null && row.actual_out === null)
            result.push(row);
        });
        return {
          valid: true,
          page: 0,
          per_page: 10,
          data: result,
          total: result.length,
          msg: "تم تحمبل البيانات بنجاح",
        };
      }
    }

    const { count, rows } = await Attendance.findAndCountAll({
      where: {
        ...(date
          ? {
              createdAt: {
                [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
              },
            }
          : {}),
      },
      offset: parseInt(page * per_page),
      limit: parseInt(per_page),
      include: [
        {
          model: Employee,
          attributes: ["ar_name", "emp_code"],
          where: {
            ...emp_conditions,
          },
        },
        {
          model: Request,
          include: [{ model: Requests_detail }, { model: Process }],
        },
        { model: OfficialHolidays, include: [HolidaysTypes] },
      ],
    });

    console.log({ data: JSON.stringify(rows) });

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
        msg: "لم يتم ايجاد موظفين",
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

async function attendanceMisReport(
  attendance_id,
  emp_id,
  month_year,
  affect_column,
  plus_or_minus,
  value
) {
  try {
    const report = await AttendanceMisReport.findOne({
      where: { emp_id, month_year },
    });

    if (report) {
      if (plus_or_minus === "+") {
        report[affect_column] =
          parseFloat(report[affect_column]) + parseFloat(value);
      } else if (plus_or_minus === "-") {
        report[affect_column] =
          parseFloat(report[affect_column]) - parseFloat(value);
      }
      await report.save();
    } else {
      let reportData = {};
      reportData[affect_column] = value;
      reportData["emp_id"] = emp_id;
      reportData["month_year"] = month_year;
      await AttendanceMisReport.create(reportData);
    }
    await Attendance.update(
      { taked_action: true },
      {
        where: {
          id: attendance_id,
          emp_id,
        },
      }
    );
    return {
      valid: true,
      msg: "تم اتخاذ الاجراء بنجاح",
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

async function forgiveAction(id, emp_id, current_user_id) {
  try {
    let flag = await Attendance.update(
      { taked_action: true, is_exception: true },
      {
        where: {
          id,
          emp_id,
        },
      }
    );
    let at = await Attendance.findOne({
      where: {
        id,
        emp_id,
      },
    });
    if (flag[0] === 1) {
      await actionLogger(
        emp_id,
        `لقد قام user بالتجاوز عن التأخير للموظف emp عن يوم ${at.current_date}`,
        current_user_id
      );
      return {
        valid: true,
        msg: "تم تجاوز التاخير للموظف بنجاح",
      };
    } else {
      return {
        valid: false,
        msg: " لم يتم تجاوز التاخير للموظف ",
      };
    }
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

async function update_attendance_from_file(files) {
  try {
    for (const file of files) {
      let attendance = {};
      if (file !== undefined) {
        let jobName = `تحديث حضور و الانصراف ${file.filename}`;
        let job = await JobStatus.create({
          name: jobName,
          status: "يتم تنفيذها",
        });
        let path = __basedir + "/data/attendance/" + file.filename; // `Aswan.txt`;
        var data = fs.readFileSync(path, "utf8");
        for (const row of data.split("\n")) {
          if (row.trim().length !== 0) {
            let [code, dateTime] = row.split("\t");
            code = code.trim();
            const [date, time] = dateTime.split(" ");
            !attendance[code] && (attendance[code] = {});
            !attendance[code][date] && (attendance[code][date] = [time]);

            attendance[code] = {
              ...attendance[code],
              [date]: [attendance[code][date][0], time],
            };
          }
        }

        for (const emp_code in attendance) {
          let days = attendance[emp_code];
          let employee = await Employee.findOne({
            where: {
              emp_code,
            },
          });
          if (employee) {
            for (const day in days) {
              let [actual_in, actual_out] = days[day];
              const attendance = await Attendance.update(
                {
                  actual_in: `${day} ${actual_in}`,
                  actual_out: `${day} ${actual_out}`,
                },
                {
                  where: {
                    emp_id: employee.id,
                    current_date: {
                      [Op.between]: [`${day} 00:00:00`, `${day} 23:59:59`],
                    },
                  },
                }
              );
              console.log(
                attendance[0] === 1
                  ? `record for [${day} ${actual_in},${employee.en_name}] has been updated successfully`
                  : ""
              );
            }
          }
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
    }
  } catch (error) {
    console.log(error.stack);
    return {
      valid: false,
      msg: error.message,
    };
  }
}

module.exports = {
  getAttendence,
  setFingerPrint,
  get,
  attendanceMisReport,
  forgiveAction,
  update_attendance_from_file,
};
