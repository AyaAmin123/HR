const { JobStatus } = require("../models/index");

async function get_all() {
  try {
    let jobStatus = await JobStatus.findAll();

    return {
      valid: true,
      msg: "",
      data: jobStatus,
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
  get_all,
};
