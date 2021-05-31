const { Action_type } = require("../models/index");

async function bulkAction_types() {
  try {
    const created = await Action_type.bulkCreate([
      { name: "submit", createdAt: new Date(), updatedAt: new Date() },
      {
        name: "موافقة",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "رفض",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "الغاء",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk Action_types have been executed successfully");
      return true;
    } else {
      console.log("bulk Action_types haven't been executed");
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
  bulkAction_types: bulkAction_types,
};
