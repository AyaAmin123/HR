const { Resposible_people } = require("../models/index");
const { transitions } = require("./bulktransition");
async function bulkResposible_people() {
  console.log(transitions);
  try {
    // transition_id, responsible_type_id, is_editor,
    const created = await Resposible_people.bulkCreate(
      generate_resposible_people_for_each_transition()
    );
    if (created) {
      console.log("bulk Resposible_people have been executed successfully");
      return true;
    } else {
      console.log("bulk Resposible_people haven't been executed");
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

function generate_resposible_people_for_each_transition() {
  let Resposible_people = [],
    count = 1;
  while (count <= transitions.length) {
    console.log(count);
    Resposible_people.push(
      {
        transition_id: count++,
        responsible_type_id: 2,
        is_editor: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transition_id: count++,
        responsible_type_id: 2,
        is_editor: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transition_id: count++,
        responsible_type_id: 3,
        is_editor: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transition_id: count++,
        responsible_type_id: 3,
        is_editor: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transition_id: count++,
        responsible_type_id: 4,
        is_editor: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transition_id: count++,
        responsible_type_id: 4,
        is_editor: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  }

  return Resposible_people;
}

module.exports = {
  bulkResposible_people: bulkResposible_people,
};
