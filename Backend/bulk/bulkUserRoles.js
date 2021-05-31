const { userrole } = require("../models/index");

async function bulkuserroles() {
  try {
    const created = await userrole.bulkCreate([
      {
        role_name: "emp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_name: "hr",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_name: "super_user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk userroles have been executed successfully");
      return true;
    } else {
      console.log("bulk userroles haven't been executed");
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
  bulkUserRoles: bulkuserroles,
};
