const { default: Axios } = require("axios");
const empsController = require("../controllers/employees_controller");
const { Attendance } = require("../models");
const { Op } = require("sequelize");

async function get_employess() {
  const { data } = await empsController.get_all();
  return data;
}
async function get_attendance(
  finger_print_id,
  start_date = new Date().toISOString().split("T")[0],
  end_date = new Date().toISOString().split("T")[0]
) {
  let {
    data: { data },
  } = await Axios.get(
    `http://10.43.30.25:6060/att/api/firstLastReport/?start_date=${start_date}&end_date=${end_date}&employees=${parseInt(
      finger_print_id
    )} `,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token 691e598d940679f76942f7e012ef804089d8d7d2",
      },
    }
  );
  if (data.length !== 0) {
    const { first_punch, last_punch, att_date } = data[0];
    return {
      first_punch: `${att_date} ${first_punch}:00`,
      last_punch: `${att_date} ${last_punch}:00`,
    };
  } else {
    return {
      first_punch: null,
      last_punch: null,
    };
  }
}
async function update_actual_in_and_out(
  date = new Date().toISOString().split("T")[0]
) {
  const employees = await get_employess();

  if (employees) {
    for (const employee of employees) {
      try {
        const { first_punch = null, last_punch = null } =
          (await get_attendance(employee.finger_print_id, date, date)) || {};
        if (first_punch || last_punch)
          await Attendance.update(
            {
              actual_in: first_punch,
              actual_out: last_punch,
            },
            {
              where: {
                emp_id: employee.id,
                current_date: {
                  [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
                },
              },
            }
          );
      } catch (error) {
        console.log({
          lineNumber: error.stack,
          message: error.message,
        });
        if (error.message.includes("connect ECONNREFUSED"))
          return {
            valid: false,
            msg: error.message,
          };
      }
    }
    return {
      valid: true,
      msg: "تم تحديث الحضور و الانصراف بنجاح",
    };
  } else throw new Error("لا يوجد موظفيين");
}

module.exports = {
  update_actual_in_and_out,
};
