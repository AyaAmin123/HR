const { Action_log } = require("../models/index");
const actionLogger = async (emp_id, action_taken, user_id) => {
  await Action_log.create({ emp_id, action_taken, user_id });
};
module.exports = actionLogger;
