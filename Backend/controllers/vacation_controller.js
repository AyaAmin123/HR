const { Vacation } = require("../models");

async function getVacationBalance(emp_id, year) {
  try {
    const result = await Vacation.findOne({
      where: {
        emp_id,
        year,
      },
    });

    if (result)
      return {
        valid: true,
        data: result,
        msg: "تم تحميل البيانات بنجاح",
      };
    else throw new Error("لا توجد بيانات لهذا الموظف");
  } catch (error) {
    return {
      valid: false,
      msg: error.message,
    };
  }
}

module.exports = {
  getVacationBalance,
};
