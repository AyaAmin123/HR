const { Branch } = require("../models/index");

async function bulkBranch() {
  try {
    const _BRANCHES = require("../seeders/config_json_db/areas.json");
    let data_branches = [];
    _BRANCHES.forEach(
      ({
        id: id,
        area_code: branch_code,
        area_name: name,
        parent_area_id: parent_branch_id,
      }) => {
        data_branches.push({
          id,
          name,
          branch_code,
          parent_branch_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    );

    const created = await Branch.bulkCreate(data_branches, {
      ignoreDuplicates: true,
    });
    if (created) {
      console.log("bulk Branch have been executed successfully");
      return true;
    } else {
      console.log("bulk Branch haven't been executed");
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
  bulkBranch: bulkBranch,
};
