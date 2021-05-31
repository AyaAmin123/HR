const { Process } = require("../models/index");

async function get_all() {
  try {
    let Processes = await Process.findAll();

    Processes = Processes.reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {});

    if (Processes) {
      return {
        valid: true,
        msg: "",
        Processes,
      };
    } else
      return {
        valid: false,
        msg: "لا يوجد عمليات",
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

module.exports = {
  get_all: get_all,
};
