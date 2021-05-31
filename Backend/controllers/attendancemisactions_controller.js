const { AttendanceMisAction } = require("../models/index");

async function get_all() {
  try {
    let attendanceMisAction = await AttendanceMisAction.findAll();

    attendanceMisAction = attendanceMisAction.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    if (attendanceMisAction) {
      return {
        valid: true,
        msg: "",
        attendanceMisAction,
      };
    } else
      return {
        valid: false,
        msg: "لا يوجد اجراء يرجي اتخاذها",
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

exports.get_all = get_all;
