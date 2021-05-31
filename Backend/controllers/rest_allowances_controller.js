const { RestAllowance } = require("../models");

async function get_all(emp_id) {
  try {
    let restAllowances = await RestAllowance.findAll({
      where: {
        emp_id,
      },
    });

    if (restAllowances) {
      return {
        valid: true,
        msg: "",
        restAllowances,
      };
    } else
      return {
        valid: false,
        msg: "لاتوجد بدل راحة",
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

async function update(id) {
  try {
    let flag = await RestAllowance.update(
      { taked: true },
      {
        where: {
          id,
        },
      }
    );
    if (flag[0] === 1) {
      return {
        valid: true,
        msg: "تم تجاوز التاخير للموظف بنجاح",
      };
    } else {
      return {
        valid: false,
        msg: " لم يتم تجاوز التاخير للموظف ",
      };
    }
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
  get_all,
  update,
};
