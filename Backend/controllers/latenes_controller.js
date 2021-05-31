const { Lateness } = require("../models/index");
const monthlyCloseLookup = {
  Jan: {
    from: "01-01",
    to: "01-15",
  },
  "Jan./Feb": {
    from: "01-16",
    to: "02-15",
  },
  "Feb./Mar": {
    from: "02-16",
    to: "03-15",
  },
  "Mar./Apr": {
    from: "03-16",
    to: "04-15",
  },
  "Apr./May": {
    from: "04-16",
    to: "05-15",
  },
  "May./Jun": {
    from: "05-16",
    to: "06-15",
  },
  "Jun./Jul": {
    from: "06-16",
    to: "07-15",
  },
  "Jul./Aug": {
    from: "07-16",
    to: "08-15",
  },
  "Aug./Sept": {
    from: "08-16",
    to: "09-15",
  },
  "Sept./Oct": {
    from: "09-16",
    to: "10-15",
  },
  "Oct./Nov": {
    from: "10-16",
    to: "11-15",
  },
  "Nov./Dec": {
    from: "11-16",
    to: "12-15",
  },
  Dec: {
    from: "12-16",
    to: "12-31",
  },
};
const { Op } = require("sequelize");
async function get(emp_id, date = "Jan", year) {
  const { from, to } = monthlyCloseLookup[date];

  try {
    let conditions = {
      ...(emp_id ? { emp_id } : {}),
      ...(date
        ? {
            date: {
              [Op.between]: [
                `${year}-${from} 00:00:00`,
                `${year}-${to} 23:59:59`,
              ],
            },
          }
        : {}),
    };

    const { count, rows } = await Lateness.findAndCountAll({
      where: { ...conditions },
    });

    if (count !== 0)
      return {
        valid: true,
        data: rows,
        msg: "تم تحمبل البيانات بنجاح",
      };
    else
      return {
        valid: false,
        msg: "لم يتم ايجاد موظفين",
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
async function getLatnessByMonthAndDay(emp_id) {
  let [year, month, day] = new Date().toISOString().split("T")[0].split("-");
  try {
    const { count, rows } = await Lateness.findAndCountAll({
      where: {
        emp_id,
        date: {
          [Op.between]: [
            `${year}-${month}-01 00:00:00`,
            `${year}-${month}-${day} 00:00:00`,
          ],
        },
      },
    });
    console.log({ rows });
    let lattnesSum = 0;
    rows.forEach(({ lateness_hours }) => {
      lattnesSum = parseFloat(lateness_hours) + lattnesSum;
    });
    if (count !== 0)
      return {
        valid: true,
        data: lattnesSum,
        msg: "تم تحمبل البيانات بنجاح",
      };
    else
      return {
        valid: false,
        msg: "لا توجد تاخيرات ",
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

//TODO: get lattness from to

module.exports = {
  get,
  getLatnessByMonthAndDay,
};
