const { State } = require("../models/index");

async function bulkStates() {
  try {
    const created = await State.bulkCreate([
      { name: "البداية", createdAt: new Date(), updatedAt: new Date() },
      {
        name: "في انتظار رد المدير المباشر",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "في انتظار رد احد افراد ادارة الموارد البشرية",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: "تم", createdAt: new Date(), updatedAt: new Date() },
      { name: "تم الغاء الطلب", createdAt: new Date(), updatedAt: new Date() },
      {
        name: "في انتظار رد مدير ادارة الموارد البشرية",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk States have been executed successfully");
      return true;
    } else {
      console.log("bulk States haven't been executed");
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
  bulkStates: bulkStates,
};
