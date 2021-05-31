const { HolidaysTypes } = require("../models/index");

async function bulkHolidaysTypes() {
  try {
    const created = await HolidaysTypes.bulkCreate([
      {
        name: "عيد الميلاد المجيد",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "عيد الشرطة",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "عيد تحرير سيناء",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "عيد العمال",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "شم النسيم",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "عيد الفطر",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ثورة 30 يونيو",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ثورة 23 يوليو",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "وقفة عرفات",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "عيد الاضحي",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        name: "رأس السنة الهجرية",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "حرب اكتوبر",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "المولد النبوي الشريف",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk HolidaysTypes have been executed successfully");
      return true;
    } else {
      console.log("bulk HolidaysTypes haven't been executed");
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

module.exports = {
  bulkHolidaysTypes: bulkHolidaysTypes,
};
