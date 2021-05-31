const { AttendanceMisAction } = require("../models/index");

async function bulkAttendanceMisAction() {
  try {
    const created = await AttendanceMisAction.bulkCreate([
      {
        name: "اضافة الى ساعات الخصم",
        type: "negative",
        affect_column: "late_hours",
        plus_or_minus: "+",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "اضافة الي ساعات الزيادة",
        type: "posistive",
        affect_column: "extra_hours",
        plus_or_minus: "+",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "اضافة الي ايام الغياب",
        type: "negative",
        affect_column: "days_of_absence",
        plus_or_minus: "+",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "اضافة الي ايام بدل الراحة",
        type: "positive",
        affect_column: "replacement_of_rest_days",
        plus_or_minus: "+",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "اضافة الي ايام المهمات",
        type: "positive",
        affect_column: "duties_days",
        plus_or_minus: "+",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "خصم ايام من المرتب",
        type: "negative",
        affect_column: "salary_deduction_days",
        plus_or_minus: "-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "خصم فلوس من المرتب",
        type: "negative",
        affect_column: "salary_deduction_money",
        plus_or_minus: "-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (created) {
      console.log("bulk AttendanceMisAction have been executed successfully");
      return true;
    } else {
      console.log("bulk AttendanceMisAction haven't been executed");
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

module.exports = {
  bulkAttendanceMisAction: bulkAttendanceMisAction,
};
