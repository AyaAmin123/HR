const { Entity_Action_Desc } = require("../models/index");

async function bulkEntity_Action_Desc() {
  try {
    const seed_data_entities_action_descs = require("../controllers/entity_action_descs_controller");
    const Entity_Action_Descs = await seed_data_entities_action_descs();
    const created = await Entity_Action_Desc.bulkCreate(Entity_Action_Descs);
    if (created) {
      console.log("bulk Entity_Action_Desc have been executed successfully");
      return true;
    } else {
      console.log("bulk Entity_Action_Desc haven't been executed");
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
  bulkEntity_Action_Desc: bulkEntity_Action_Desc,
};
