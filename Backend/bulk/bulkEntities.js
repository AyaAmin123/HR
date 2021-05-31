const { Entity } = require("../models/index");

async function bulkEntity() {
  try {
    const created = await Entity.bulkCreate([
      {
        name: "employee",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "vacation",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk Entity have been executed successfully");
      return true;
    } else {
      console.log("bulk Entity haven't been executed");
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
  bulkEntity: bulkEntity,
};
