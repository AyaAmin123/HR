const { EmpPenalityCounts } = require("../models/index");
const { Op } = require("sequelize");
const { get: getLatenesDetails } = require("./latenes_controller");
const { child } = require("winston");
async function get(emp_id, date = "2020-11-11 00:00:00", monthlyClose) {
  try {
    let [year, month] = date.split(" ")[0].split("-");
    let conditions = {
      ...(emp_id ? { emp_id } : {}),
      ...(date ? { date: { [Op.like]: `%${year}-${month}%` } } : {}),
    };

    const EmpPenalityCount = await EmpPenalityCounts.findOne({
      where: { ...conditions },
    });

    if (EmpPenalityCount) {
      const latenesDetails = await getLatenesDetails(
        emp_id,
        monthlyClose,
        year
      );
      console.log({ latenesDetails });
      return {
        valid: true,
        data: {
          EmpPenalityCount,
          latenesDetails: latenesDetails.data,
        },
        msg: "تم تحمبل البيانات بنجاح",
      };
    } else
      return {
        valid: false,
        msg: "لم يتم ايجاد خصومات",
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
  get,
};
