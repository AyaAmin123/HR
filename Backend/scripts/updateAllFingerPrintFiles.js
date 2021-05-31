var fs = require("fs");
const { Employee, Attendance } = require("../models/index");
const { Op } = require("sequelize");
async function update_attendance_from_file(path) {
  try {
    let attendance = {};

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

    return {
      valid: true,
      msg: "تم تحميل الملف بنجاح",
    };
  } catch (error) {
    console.log(error.stack);
    return {
      valid: false,
      msg: error.message,
    };
  }
}

(async function start() {
  try {
    var files = fs.readdirSync(`${__dirname}/../data/Fingerprintflash/`);
    for (const file of files) {
      await update_attendance_from_file(
        `${__dirname}/../data/Fingerprintflash/${file}`
      );
    }
    console.log("data has been updated successfully");
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    console.log({ error: error.message });
  }
})();
