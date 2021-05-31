const {
  Employee,
  VacationAccumulator,
  Vacation,
  Deduction,
  Position,
  Branch,
} = require("../models");
const {
  updateAttendanceAfterRequestHasBeenMade,
} = require("../scripts/attendanceScripts/addAttendanceTonight");
let monthlyClose = {
  "01-15": {
    from: "y-01-01T00:00:00.000Z",
    to: "y-01-15T23:59:59.000Z",
  },

  "02-15": {
    from: "y-01-16T00:00:00.000Z",
    to: "y-02-15T23:59:59.000Z",
  },
  "03-15": {
    from: "y-02-16T00:00:00.000Z",
    to: "y-03-15T23:59:59.000Z",
  },
  "04-15": {
    from: "y-03-16T00:00:00.000Z",
    to: "y-04-15T23:59:59.000Z",
  },
  "05-15": {
    from: "y-04-16T00:00:00.000Z",
    to: "y-05-15T23:59:59.000Z",
  },
  "06-15": {
    from: "y-05-16T00:00:00.000Z",
    to: "y-06-15T23:59:59.000Z",
  },
  "07-15": {
    from: "y-06-16T00:00:00.000Z",
    to: "y-07-15T23:59:59.000Z",
  },
  "08-15": {
    from: "y-07-16T00:00:00.000Z",
    to: "y-08-15T23:59:59.000Z",
  },
  "09-15": {
    from: "y-08-16T00:00:00.000Z",
    to: "y-09-15T23:59:59.000Z",
  },
  "10-15": {
    from: "y-09-16T00:00:00.000Z",
    to: "y-10-15T23:59:59.000Z",
  },
  "11-15": {
    from: "y-10-16T00:00:00.000Z",
    to: "y-11-15T23:59:59.000Z",
  },
  "12-15": {
    from: "y-11-16T00:00:00.000Z",
    to: "y-12-15T23:59:59.000Z",
  },
  "12-31": {
    from: "y-12-16T00:00:00.000Z",
    to: "y-12-31T23:59:59.000Z",
  },
};
module.exports = {
  1: {
    //اجازة سنوية
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      await checkBalance(emp_id, requests_details);
    },
    exec: decrementFromVacation,
  },
  2: {
    //مأمورية
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkBalanceFlag: false,
    checkOverlapFlag: true,
    columnName: "",
    exec: async ({ emp_id, createdAt }) => {
      await getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
        emp_id,
        createdAt.split(" ")[0]
      );
    },
  },
  3: {
    //استقالة
    affectBalanceFlag: false,
    checkBalanceFlag: false,
    checkOverlapFlag: false,
    checkIfOfficialVacationFlag: false,
    columnName: "",
    exec: async ({ emp_id }) => {
      await Employee.update(
        { actual_status: false },
        {
          where: {
            id: emp_id,
          },
        }
      );
    },
  },
  4: {
    //عارضة
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: false,
    checkOverlapFlag: true,
    columnName: "contingency_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      let newRequestFrom = new Date(
        requests_details.from.replace(" ", "T").concat(".000Z")
      );
      let newRequestTo = new Date(
        requests_details.to.replace(" ", "T").concat(".000Z")
      );
      let dif = getNearstDayCount(newRequestTo - newRequestFrom);
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      if (vacation) {
        if (vacation.vacation_block)
          throw new Error("غير مسموح بتقديم طلب عارضة في فترة الاختبار");
        else if (parseFloat(vacation.remaning) < 1)
          throw new Error("لا يوجد لديك رصيد اجازات");
        else if (parseFloat(vacation.contingency_vacation) + dif > 6)
          throw new Error("لقد تخطيت العدد المسموح بة من العارضات");
      } else throw new Error("لا يوجد لديك اجازات");
    },
    exec: async ({ emp_id, Requests_details, createdAt }, columnName) => {
      await decrementFromVacation({ emp_id, Requests_details }, columnName);
      await getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
        emp_id,
        createdAt.split(" ")[0]
      );
    },
  },
  5: {
    //اجازة سنوية بخصم من المرتب
    affectBalanceFlag: false,
    increaseRemaningFlag: true,
    detectFridayOrSaturdayFlag: false,
    checkBalanceFlag: false,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(requests_details);
      let days = getNearstDayCount(to - from);
      console.log(days);
      if (vacation.vacation_block)
        throw new Error("غير مسموح بتقديم طلب اجازة في فترة الاختبار");
      else if (vacation.remaning > days) {
        throw new Error(`يوجد لديك ${vacation.remaning} يوم من رصيد اجازاتك`);
      }
    },
    exec: async ({ emp_id, Requests_details }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });

      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let daysFromSalary = getNearstDayCount(to - from);
      vacation.exceeding_vacation_balance =
        vacation.exceeding_vacation_balance + daysFromSalary;
      vacation.remaning = vacation.remaning - days;
      await vacation.save();

      let {
        sameInterval,
        result,
      } = get_number_of_days_in_monthly_close_to_deduct(from, to);
      await deduct_from_salary(
        emp_id,
        sameInterval,
        result,
        "Exceeding Vacation Balance"
      );
    },
  },
  6: {
    //عارضة بخصم من المرتب
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkBalanceFlag: false,
    checkOverlapFlag: true,
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(requests_details);
      let day = getNearstDayCount(to - from);
      if (vacation.vacation_block)
        throw new Error(
          "غير مسموح بتقديم طلب عارضة بخصم من المرتب في فترة الاختبار"
        );
      else if (vacation.contingency_vacation + day < 6) {
        throw new Error(
          `يوجد لديك ${6 - vacation.contingency_vacation} يوم من رصيد عارضاتك`
        );
      }
    },
    exec: async ({ emp_id, Requests_details, createdAt }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });

      const vacationAccumulator = await VacationAccumulator.findOne({
        where: {
          emp_id,
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);

      let days = getNearstDayCount(to - from);

      let sundayOrThrusday = from.getDay() === 0 || from.getDay() === 4;

      if (sundayOrThrusday) {
        if (vacationAccumulator.count >= 1) {
          vacation.exceeding_contingency_vacation =
            vacation.exceeding_contingency_vacation + days;
          vacation.remaning = vacation.remaning - days;
          vacationAccumulator.count = vacationAccumulator.count - 1;
        }
      }
      let {
        sameInterval,
        result,
      } = get_number_of_days_in_monthly_close_to_deduct(from, to);
      await deduct_from_salary(
        emp_id,
        sameInterval,
        result,
        "Exceeding Contingency Vacation"
      );
      await vacationAccumulator.save();
      await vacation.save();
      await getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
        emp_id,
        createdAt.split(" ")[0]
      );
    },
  },
  7: {
    //اجازة في فترة التدريب
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });

      if (!vacation.vacation_block) {
        throw new Error(`يوجد لديك رصيد اجازات`);
      }
    },
    exec: async ({ emp_id, Requests_details }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });

      const vacationAccumulator = await VacationAccumulator.findOne({
        where: {
          emp_id,
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let daysFromSalary = getNearstDayCount(to - from);
      vacation.on_probation_vacation =
        vacation.on_probation_vacation + daysFromSalary;

      let {
        sameInterval,
        result,
      } = get_number_of_days_in_monthly_close_to_deduct(from, to);
      await deduct_from_salary(
        emp_id,
        sameInterval,
        result,
        "Vacation On Probation"
      );
      await vacation.save();
    },
  },
  8: {
    //رعاية طفل
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: false,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      if (vacation.vacation_block)
        throw new Error("غير مسموح بتقديم اجازة رعاية طفل في فترة التدريب");
    },
    exec: async ({ emp_id, Requests_details }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);
      vacation.child_care_vacation = vacation.child_care_vacation + days;
      let {
        sameInterval,
        result,
      } = get_number_of_days_in_monthly_close_to_deduct(from, to);
      await deduct_from_salary(emp_id, sameInterval, result, "Child Care");
      await vacation.save();
    },
  },
  9: {
    //اجازة مرضية
    affectBalanceFlag: true,
    detectFridayOrSaturdayFlag: true,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });

      if (vacation.vacation_block)
        throw new Error("غير مسموح بتقديم اجازة مرضية في فترة التدريب");
    },
    exec: async ({ emp_id, Requests_details }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);
      vacation.sick_vacation = vacation.sick_vacation + days;
      await vacation.save();
    },
  },
  10: {
    //وفاة الاب
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      if (vacation.death_father_vacation !== 0)
        throw new Error("غير مسموح بتقديم اجازة وفاة الاب");
    },
    exec: async ({ emp_id, Requests_details, createdAt }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);

      vacation.death_father_vacation = vacation.death_father_vacation + days;
      await vacation.save();
      await getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
        emp_id,
        createdAt.split(" ")[0]
      );
    },
  },
  11: {
    //وفاة الام
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      if (vacation.death_mother_vacation !== 0)
        throw new Error("غير مسموح بتقديم اجازة وفاة الام");
    },
    exec: async ({ emp_id, Requests_details, createdAt }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);

      vacation.death_mother_vacation = vacation.death_mother_vacation + days;
      await vacation.save();
      await getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
        emp_id,
        createdAt.split(" ")[0]
      );
    },
  },
  12: {
    //استدعاء الجيش
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async () => {},
    exec: async ({ emp_id, Requests_details }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);

      vacation.military_call_vacation = vacation.military_call_vacation + days;
      await vacation.save();
    },
  },
  13: {
    //اجازة الولادة
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: false,
    checkOverlapFlag: false,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(requests_details);
      let day = getNearstDayCount(to - from);
      if (vacation.vacation_block)
        throw new Error("غير مسموح بتقديم اجازة ولادة في فترة التدريب");
      else if (
        vacation.child_care_vacation + day > 92 ||
        vacation.child_care_vacation + day < 89
      ) {
        throw new Error(`يجب ان تكون مدة الاجازة ثلاثة اشهر فقط`);
      }
    },
    exec: async ({ emp_id, Requests_details }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);
      vacation.maternity_vacation = vacation.maternity_vacation + days;
      await vacation.save();
    },
  },
  14: {
    //اجازة الحج
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: false, // TODO:
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async (emp_id, requests_details) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      if (vacation.pilgrimage_vacation !== 0)
        throw new Error("غير مسموح بتقديم اجازة الحج");
    },
    exec: async ({ emp_id, Requests_details }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);
      if (days)
        vacation.pilgrimage_vacation = vacation.pilgrimage_vacation + days;
      await vacation.save();
    },
  },
  15: {
    //كورونا
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: false,
    checkOverlapFlag: true,
    columnName: "annual_vacation",
    beforeCreateRequest: async () => {},
    exec: async ({ emp_id, Requests_details, createdAt }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let days = getNearstDayCount(to - from);

      vacation.exceptional_corona_vacation =
        vacation.exceptional_corona_vacation + days;
      await vacation.save();
      await getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
        emp_id,
        createdAt.split(" ")[0]
      );
    },
  },
  16: {
    //اذن
    affectBalanceFlag: false,
    detectFridayOrSaturdayFlag: true,
    checkOverlapFlag: true,
    columnName: "",
    beforeCreateRequest: async (emp_id, requests_details) => {
      let newRequestFrom = new Date(
        requests_details.from.replace(" ", "T").concat(".000Z")
      );
      let newRequestTo = new Date(
        requests_details.to.replace(" ", "T").concat(".000Z")
      );

      let diff = (newRequestTo - newRequestFrom) / 3600000;
      console.log({
        newRequestFrom,
        newRequestTo,
        diff,
      });
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      if (vacation) {
        if (vacation.permission === 8)
          throw new Error("لقد استنفذت عدد ساعات الاذن");
        else if (vacation.permission + diff > 8)
          throw new Error("لقد تخطيت ال8 ساعات اذن");
        else if (diff > 3) throw new Error("اقصي عدد ساعات للاذن هو 3 ساعات");
      } else throw new Error("لا يوجد لديك اجازات");
    },
    exec: async ({ emp_id, Requests_details, createdAt }, columnName) => {
      const vacation = await Vacation.findOne({
        where: {
          emp_id,
          year: new Date().getFullYear(),
        },
      });
      const { from, to } = getFromAndToFromRequestDetails(Requests_details);
      let diff = (to - from) / 3600000;
      vacation.permission = vacation.permission + diff;
      await vacation.save();
      await getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
        emp_id,
        createdAt.split(" ")[0]
      );
    },
  },
  monthlyClose,
};

async function getEmployeeToUpdateAttendanceAfterRequestHasBeenMade(
  emp_id,
  date
) {
  let employee = await Employee.findOne({
    where: {
      id: emp_id,
    },
    include: [Position, Branch],
  });
  await updateAttendanceAfterRequestHasBeenMade(employee, date);
}

async function decrementFromVacation({ emp_id, Requests_details }, columnName) {
  const vacationAccumulator = await VacationAccumulator.findOne({
    where: {
      emp_id,
    },
  });
  const vacation = await Vacation.findOne({
    where: {
      emp_id,
      year: new Date().getFullYear(),
    },
  });
  for (const { key, value } of Requests_details) {
    if (key === "from") {
      let [requestFromDate, requestFromTime] = value.split(" ");
      newRequestFrom = new Date(`${requestFromDate}T${requestFromTime}.000Z`);
    } else if (key === "to") {
      let [requestToDate, requestToTime] = value.split(" ");
      newRequestTo = new Date(`${requestToDate}T${requestToTime}.000Z`);
    }
  }

  let days = getNearstDayCount(newRequestTo - newRequestFrom);

  if (columnName === "contingency_vacation") {
    let sundayOrThrusday =
      newRequestFrom.getDay() === 0 || newRequestFrom.getDay() === 4;

    if (sundayOrThrusday) {
      vacationAccumulator.count =
        parseFloat(vacationAccumulator.count) - days - 1;
      vacation.remaning = parseFloat(vacation.remaning) - days - 1;
      vacation.consumed = parseFloat(vacation.consumed) + days + 1;
      vacation.contingency_vacation =
        parseFloat(vacation.contingency_vacation) + days;
    } else {
      vacationAccumulator.count = parseFloat(vacationAccumulator.count) - days;
      vacation.remaning = parseFloat(vacation.remaning) - days;
      vacation.consumed = parseFloat(vacation.consumed) + days;
      vacation.contingency_vacation =
        parseFloat(vacation.contingency_vacation) + days;
    }
  } else if (columnName === "annual_vacation") {
    vacationAccumulator.count = parseFloat(vacationAccumulator.count) - days;
    vacation.remaning = parseFloat(vacation.remaning) - days;
    vacation.consumed = parseFloat(vacation.consumed) + days;
    vacation.annual_vacation = parseFloat(vacation.annual_vacation) + days;
  }
  await vacation.save();
  await vacationAccumulator.save();
}

function getNearstDayCount(diffrenenceCount) {
  let start = 0.5;

  while (diffrenenceCount / 86400000 > start) {
    start += 0.5;
  }

  return start;
}

function getFromAndToFromRequestDetails(Requests_details) {
  let from, to;
  if (
    typeof Requests_details === "object" &&
    !Array.isArray(Requests_details)
  ) {
    from = new Date(Requests_details.from.replace(" ", "T").concat(".000Z"));
    to = new Date(Requests_details.to.replace(" ", "T").concat(".000Z"));
  } else
    for (const { key, value } of Requests_details) {
      if (key === "from") {
        let [requestFromDate, requestFromTime] = value.split(" ");
        from = new Date(`${requestFromDate}T${requestFromTime}.000Z`);
      } else if (key === "to") {
        let [requestToDate, requestToTime] = value.split(" ");
        to = new Date(`${requestToDate}T${requestToTime}.000Z`);
      }
    }
  return { from, to };
}

async function checkBalance(emp_id, requests_details) {
  let newRequestFrom = new Date(
    requests_details.from.replace(" ", "T").concat(".000Z")
  );
  let newRequestTo = new Date(
    requests_details.to.replace(" ", "T").concat(".000Z")
  );

  let dif = getNearstDayCount(newRequestTo - newRequestFrom);
  const vacationAccumulator = await VacationAccumulator.findOne({
    where: {
      emp_id,
    },
  });

  // for (const year in getYears(newRequestFrom, newRequestTo)) {
  let years = getYears(newRequestFrom, newRequestTo);
  if (years.length === 1) {
    let vacation = await Vacation.findOne({
      where: {
        emp_id,
        year: years[0],
      },
    });
    if (vacation.vacation_block)
      throw new Error("غير مسموح بتقديم طلب اجازة في فترة التدريب");
    else if (vacationAccumulator.count < dif)
      throw new Error(
        "عدد الايام المطلوبة اكبر من المتاح من الاجازات برجاء تقديم اجازة بخصم فرق الايام من المرتب"
      );

    // }
  } else throw new Error(`لا توجد رصيد اجازات لسنة ${years[1]}`);
}

// (
function get_number_of_days_in_monthly_close_to_deduct(
  incomingFrom,
  incomingTo
) {
  let sameInterval = false;
  // let incomingFrom = new Date(incomingFrom.replace(" ", "T").concat(".000Z"));
  // let incomingTo = new Date(incomingTo.replace(" ", "T").concat(".000Z"));
  let result = {
    from: {
      whichMonthlyClose: "",
      daysCount: 0,
      year: "",
    },
    to: {
      whichMonthlyClose: "",
      daysCount: 0,
      year: "",
    },
  };
  getYears(incomingFrom, incomingTo).forEach((year) => {
    for (const date in monthlyClose) {
      let { from: monthlyFrom, to: monthlyTo } = monthlyClose[date];

      let monthlyFromTemp = new Date(`${monthlyFrom.replace("y", year)}`);
      let monthlyToTemp = new Date(`${monthlyTo.replace("y", year)}`);
      if (
        incomingFrom >= monthlyFromTemp &&
        incomingFrom <= monthlyToTemp &&
        incomingTo >= monthlyFromTemp &&
        incomingTo <= monthlyToTemp
      ) {
        sameInterval = true;
        result.from.whichMonthlyClose = monthlyTo
          .replace("y-", "")
          .split("T")[0];
        result.from.daysCount = getNearstDayCount(incomingTo - incomingFrom);
        result.from.year = year;
        break;
      } else if (
        incomingFrom >= monthlyFromTemp &&
        incomingFrom <= monthlyToTemp
      ) {
        result.from.whichMonthlyClose = monthlyTo
          .replace("y-", "")
          .split("T")[0];
        result.from.daysCount = getNearstDayCount(monthlyToTemp - incomingFrom);
        result.from.year = year;
      } else if (incomingTo >= monthlyFromTemp && incomingTo <= monthlyToTemp) {
        result.to.whichMonthlyClose = monthlyTo.replace("y-", "").split("T")[0];
        result.to.daysCount = getNearstDayCount(incomingTo - monthlyFromTemp);
        result.to.year = year;
      }
    }
  });
  return {
    sameInterval,
    result,
  };
}
// )(new Date("2020-12-25T00:00:00.000Z"), new Date("2021-01-03T23:59:59.000Z"));

async function deduct_from_salary(emp_id, sameInterval, result, reason) {
  if (sameInterval) {
    let deduction = await Deduction.findOne({
      where: {
        reason,
        emp_id,
        date: `${result.from.year}-${result.from.whichMonthlyClose} 00:00:00`,
      },
    });

    if (deduction) {
      deduction.deducted_days_from_salary =
        deduction.deducted_days_from_salary + result.from.daysCount;
      await deduction.save();
    } else
      await Deduction.create({
        emp_id,
        date: `${result.from.year}-${result.from.whichMonthlyClose} 00:00:00`,
        deducted_days_from_vacation: 0,
        deducted_days_from_salary: result.from.daysCount,
        reason,
      });
  } else {
    let d1 = await Deduction.findOne({
      where: {
        emp_id,
        date: `${result.from.year}-${result.from.whichMonthlyClose} 00:00:00`,
        reason,
      },
    });

    if (d1) {
      d1.deducted_days_from_salary =
        d1.deducted_days_from_salary + result.from.daysCount;
      await d1.save();
    } else {
      await Deduction.create({
        emp_id,
        date: `${result.from.year}-${result.from.whichMonthlyClose} 00:00:00`,
        deducted_days_from_vacation: 0,
        deducted_days_from_salary: result.from.daysCount,
        reason,
      });
    }

    let d2 = await Deduction.findOne({
      where: {
        emp_id,
        date: `${result.to.year}-${result.to.whichMonthlyClose} 00:00:00`,
        reason,
      },
    });

    if (d2) {
      d2.deducted_days_from_salary =
        d2.deducted_days_from_salary + result.to.daysCount;
      await d2.save();
    } else {
      await Deduction.create({
        emp_id,
        date: `${result.to.year}-${result.to.whichMonthlyClose} 00:00:00`,
        deducted_days_from_vacation: 0,
        deducted_days_from_salary: result.to.daysCount,
        reason,
      });
    }
  }
}

function getYears(incomingFrom, incomingTo) {
  let years = [];
  if (incomingFrom.getFullYear() === incomingTo.getFullYear())
    years.push(incomingFrom.getFullYear());
  else {
    years.push(incomingFrom.getFullYear());
    years.push(incomingTo.getFullYear());
  }
  return years;
}
