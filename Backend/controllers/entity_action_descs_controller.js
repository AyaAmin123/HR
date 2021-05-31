const { Entity, Action } = require("../models");
async function seed_data_entities_action_descs() {
  const entities = await Entity.findAll({ attributes: ["id"] });
  const actions = await Action.findAll({ attributes: ["id"] });
  let Entity_Action_Descs = [];
  actions.forEach((action) => {
    entities.forEach((entitie) => {
      Entity_Action_Descs.push({
        entity_id: entitie.id,
        action_id: action.id,
        desc: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });
  return Entity_Action_Descs;
}
module.exports = seed_data_entities_action_descs;
