const { Responsible_type } = require("../models/index");

async function bulkResponsible_types() {
  try {
    const created = await Responsible_type.bulkCreate([
      {
        name: "request_submitter",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "direct_manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "hr_manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "miss_may",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk Responsible_types have been executed successfully");
      return true;
    } else {
      console.log("bulk Responsible_types haven't been executed");
      return false;
    }
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return false;
  }
}

module.exports = {
  bulkResponsible_types: bulkResponsible_types,
};
