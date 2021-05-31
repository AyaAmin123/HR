const { OfficialHolidays, HolidaysTypes } = require("../models");
const { Op } = require("sequelize");
const actionLogger = require("../utilities/actionLog");
async function set_holiday(from, to, holiday_type_id, current_user_id) {
  try {
    // detectFridayOrSaturday(from, to);
    await checkOverlap(from, to);
    const officialHolidays = await OfficialHolidays.create({
      from,
      to,
      holiday_type_id,
    });

    const holidayType = await HolidaysTypes.findByPk(holiday_type_id);

    await actionLogger(
      null,
      `لقد قام user بتحديد موعد من ${from} الي ${to} كعطلة رسمية (${holidayType.name})`,
      current_user_id
    );
    return {
      valid: true,
      msg: "تم انشاء الاجازة الرسمية بنجاح",
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

async function get_all() {
  try {
    let year = new Date().getFullYear();
    const officialHolidays = await OfficialHolidays.findAll({
      where: {
        createdAt: {
          [Op.between]: [`${year}-01-01 00:00:00`, `${year}-12-31 00:00:00`],
        },
      },
    });

    return {
      valid: true,
      data: officialHolidays,
      msg: "تم تحميل البيانات بنجاح",
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

async function checkOverlap(from, to) {
  let newOfficialHolidayFrom = new Date(from.replace(" ", "T").concat(".000Z"));
  let newOfficialHolidayTo = new Date(to.replace(" ", "T").concat(".000Z"));
  const officialHolidays = await OfficialHolidays.findAll({
    include: [HolidaysTypes],
  });
  if (officialHolidays.length !== 0) {
    for (let officialHoliday of officialHolidays) {
      let [requestFromDate, requestFromTime] = officialHoliday.from.split(" ");
      let officialHolidayfrom = new Date(
        `${requestFromDate}T${requestFromTime}.000Z`
      );
      let [requestToDate, requestToTime] = officialHoliday.to.split(" ");
      let officialHolidayto = new Date(
        `${requestToDate}T${requestToTime}.000Z`
      );

      if (
        (newOfficialHolidayFrom >= officialHolidayfrom &&
          newOfficialHolidayFrom <= officialHolidayto) ||
        (newOfficialHolidayTo >= officialHolidayfrom &&
          newOfficialHolidayTo <= officialHolidayto) ||
        (newOfficialHolidayFrom <= officialHolidayfrom &&
          newOfficialHolidayTo >= officialHolidayto)
      ) {
        throw new Error(
          `يوجد اجازة ${officialHoliday.HolidaysType.name} في خلال هذة الايام`
        );
      }
    }
  }
}

function detectFridayOrSaturday(from, to) {
  let start = new Date(from.replace(" ", "T").concat(".000Z"));
  let end = new Date(to.replace(" ", "T").concat(".000Z"));

  while (start < end) {
    if (start.getDay() === 5)
      throw new Error(`في خلال هذة الايام يوجد يوم جمعة`);
    else if (start.getDay() === 6)
      throw new Error(`في خلال هذة الايام يوجد يوم سبت`);
    start.setDate(start.getDate() + 1);
  }
}

module.exports = {
  set_holiday,
  get_all,
};
