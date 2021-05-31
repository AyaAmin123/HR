const { Process } = require("../models/index");
let process = [
  { name: "اجازة سنوية", createdAt: new Date(), updatedAt: new Date() },
  { name: "مأمورية", createdAt: new Date(), updatedAt: new Date() },
  { name: "استقالة", createdAt: new Date(), updatedAt: new Date() },
  { name: "عارضة", createdAt: new Date(), updatedAt: new Date() },
  {
    name: "اجازة",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "عارضة",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "اجازة في فترة الاختبار",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { name: "رعاية طفل", createdAt: new Date(), updatedAt: new Date() },
  { name: "اجازة مرضية", createdAt: new Date(), updatedAt: new Date() },

  { name: "وفاة الوالد", createdAt: new Date(), updatedAt: new Date() },
  { name: "وفاة الوالدة", createdAt: new Date(), updatedAt: new Date() },
  { name: "استدعاء الجيش", createdAt: new Date(), updatedAt: new Date() },
  { name: "اجازة الوضع", createdAt: new Date(), updatedAt: new Date() },
  { name: "اجازة الحج", createdAt: new Date(), updatedAt: new Date() },
  {
    name: "اجازة استثنائية - كورونا (مخالط)",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { name: "اذن", createdAt: new Date(), updatedAt: new Date() },
  // { name: "بدل راحة", createdAt: new Date(), updatedAt: new Date() },
];
async function bulkProcesses() {
  try {
    const created = await Process.bulkCreate(process);
    if (created) {
      console.log("bulk processes have been executed successfully");
      return true;
    } else {
      console.log("bulk processes haven't been executed");
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
  bulkProcesses: bulkProcesses,
  process: process,
};
