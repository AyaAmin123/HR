const { Related_to_table } = require("../models/index");

async function bulkRelated_to_table() {
  try {
    const created = await Related_to_table.bulkCreate([
      {
        table_id: 1,
        table_name: "الطلبات",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk Related_to_table have been executed successfully");
      return true;
    } else {
      console.log("bulk Related_to_table haven't been executed");
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
  bulkRelated_to_table: bulkRelated_to_table,
};
