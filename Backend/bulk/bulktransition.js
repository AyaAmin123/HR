const { Transition } = require("../models/index");
const { process: processes } = require("./bulkProcess");
let transitions = generate_transitions_for_process();
async function bulkTransition() {
  try {
    //  from_state, to_state, process_id, action_id
    const created = await Transition.bulkCreate(transitions);
    if (created) {
      console.log("bulk Transition have been executed successfully");
      return true;
    } else {
      console.log("bulk Transition haven't been executed");
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

function generate_transitions_for_process() {
  let t = [];
  processes.forEach((process, index) => {
    t.push(
      {
        from_state: 2,
        to_state: 3,
        process_id: index + 1,
        action_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        from_state: 2,
        to_state: 4,
        process_id: index + 1,
        action_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        from_state: 3,
        to_state: 4,
        process_id: index + 1,
        action_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        from_state: 3,
        to_state: 4,
        process_id: index + 1,
        action_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        from_state: 6,
        to_state: 4,
        process_id: index + 1,
        action_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        from_state: 6,
        to_state: 4,
        process_id: index + 1,
        action_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  });
  return t;
}

module.exports = {
  bulkTransition: bulkTransition,
  transitions: transitions,
};
