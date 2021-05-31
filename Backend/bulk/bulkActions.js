const { Action } = require("../models/index");

async function bulkAction() {
  try {
    const created = await Action.bulkCreate([
      {
        name: "create",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "update",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "delete",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "agree",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "refused",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk Action have been executed successfully");
      return true;
    } else {
      console.log("bulk Action haven't been executed");
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
  bulkAction: bulkAction,
};
