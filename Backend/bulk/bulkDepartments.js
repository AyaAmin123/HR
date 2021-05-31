const { Department } = require("../models/index");

async function bulkDepartment() {
  try {
    const _DEPARTMENTS = require("../seeders/config_json_db/departments.json");
    let data_department = [];
    _DEPARTMENTS.forEach(
      ({
        id: id,
        dept_name: name,
        dept_code: dep_code,
        parent_dept_id: parent_dept_id,
      }) => {
        data_department.push({
          id,
          name,
          description: "asdasd",
          dep_code,
          parent_dept_id,
          parent_dept_id: 2,
        });
      }
    );

    const created = await Department.bulkCreate(data_department, {
      ignoreDuplicates: true,
    });

    if (created) {
      console.log("bulk Department have been executed successfully");
      return true;
    } else {
      console.log("bulk Department haven't been executed");
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
  bulkDepartment: bulkDepartment,
};
