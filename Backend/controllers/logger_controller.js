const { Action_log, Employee, User } = require("../models/index");
const fs = require("fs");
const { Op } = require("sequelize");

async function get_logger(
  emp_id,
  page = 0,
  per_page = 10,
  user_role_id,
  user_id
) {
  try {
    let get_all_hr_transactions = { model: User };
    let conditions = {};
    if (user_role_id === 2) {
      conditions.user_id = user_id;
    } else if (user_role_id === 3) {
      get_all_hr_transactions = {
        model: User,
        where: {
          [Op.or]: [{ user_role_id: 2 }, { user_role_id: 3 }],
        },
      };
    } else conditions.emp_id = emp_id;
    let { rows, count } = await Action_log.findAndCountAll({
      where: {
        ...conditions,
      },
      include: [Employee, get_all_hr_transactions],
      offset: parseInt(page * per_page),
      limit: parseInt(per_page),
      order: [["createdAt", "DESC"]],
    });

    if (rows.length !== 0) {
      rows.forEach(
        ({ action_taken, Employee: employee, User: user }, index) => {
          if (user) {
            rows[index].action_taken = action_taken.replace(
              "user",
              user.email.split("@")[0]
            );
            if (employee)
              rows[index].action_taken = rows[index].action_taken.replace(
                "emp",
                employee.ar_name
              );
          } else {
            if (employee)
              rows[index].action_taken = action_taken.replace(
                /emp/gi,
                employee.ar_name
              );
          }
        }
      );

      return {
        valid: true,
        data: rows,
        total: count,
        msg: "تم تحميل الاشعارات بنجاح",
      };
    } else
      return {
        valid: false,
        msg: "لا توجد اشعارات",
      };
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
    };
  }
}

module.exports = {
  get_logger,
};
