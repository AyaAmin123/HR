const {
  Request,
  State,
  Transition,
  Process,
  Requests_detail,
  Employee,
  Action_type,
  Resposible_people,
  Responsible_type,
  EmployeeDetail,
  VacationAccumulator,
  Vacation,
  Attendance,
  User,
  Department,
  OfficialHolidays,
  HolidaysTypes,
} = require("../models");
const processConfig = require("../utilities/processConfig");

const actionLogger = require("../utilities/actionLog");
const { Op } = require("sequelize");

async function checkIfHrRequest(emp_id, user_id) {
  const user = await User.findByPk(user_id);
  if (user.user_role_id === 2 && user.emp_id === emp_id) {
    return true;
  } else return false;
}

async function createRequest(
  emp_id,
  process_id,
  current_user_id,
  requests_details,
  isNewRequest,
  user_role_id
) {
  try {
    const hr_request = await checkIfHrRequest(emp_id, current_user_id);

    const requests_details_arr = Object.keys(requests_details).map((key) => {
      return {
        key,
        value: requests_details[key],
      };
    });

    let {
      checkOverlapFlag,
      detectFridayOrSaturdayFlag = false,
      beforeCreateRequest = () => {},
      checkIfOfficialVacationFlag = true,
    } = processConfig[process_id];
    checkIfOfficialVacationFlag &&
      (await checkIfOfficialVacationOrNot(
        requests_details.from,
        requests_details.to
      ));
    detectFridayOrSaturdayFlag &&
      detectFridayOrSaturday(requests_details.from, requests_details.to);
    checkOverlapFlag && (await checkOverlap(emp_id, requests_details));
    await beforeCreateRequest(emp_id, requests_details);
    const transition = await Transition.findOne({
      where: {
        process_id,
      },
    });
    const employee = await Employee.findOne({
      where: {
        id: emp_id,
      },
      include: [EmployeeDetail],
    });
    if (transition) {
      const request = await Request.create(
        {
          emp_id,
          process_id,
          state_id: isNewRequest
            ? employee.EmployeeDetail &&
              employee.EmployeeDetail.direct_manager_id
              ? transition.from_state
              : hr_request
              ? 6
              : 3
            : 3,
          action_id: 1,
          current_user_id,
          Requests_details: requests_details_arr,
        },
        {
          include: [Requests_detail],
        }
      );
      const process = await Process.findByPk(process_id);
      if (process) {
        await actionLogger(
          emp_id,
          `لقد قام user بتقديم طلب  ${process.name} للموظف emp`,
          current_user_id
        );

        !isNewRequest &&
          (await updateRequest(
            request.id,
            2,
            4,
            current_user_id,
            user_role_id,
            emp_id
          ));
        return {
          valid: true,
          msg: isNewRequest
            ? `  تم انشاء طلب ${process.name} بنجاح`
            : "تمت العملية بنجاح",
        };
      }
    } else throw new Error(`لا يوجد طريقة لمعرفة كيفية تنفيذ الطلب`);
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

async function getRequests(
  { user_role_id, emp_id: current_user_emp_id, id: current_user_id },
  { request_status: action_id, request_type: process_id, date_from, date_to }
) {
  try {
    let conditions = {
      ...(action_id ? { action_id } : {}),
      ...(process_id ? { process_id } : {}),
      ...(date_from && date_to
        ? {
            createdAt: {
              [Op.between]: [`${date_from} 00:00:00`, `${date_to} 23:59:59`],
            },
          }
        : {}),
    };

    const requests = await Request.findAll({
      include: [
        {
          model: Employee,
          include: [
            {
              model: EmployeeDetail,
              attributes: ["direct_manager_id"],
            },
            { model: Department, attributes: ["name"] },
          ],
        },
        { model: Requests_detail, attributes: ["key", "value"] },
        { model: State, attributes: ["name"] },
        Action_type,
        { model: Process, attributes: ["name"] },
      ],
      where: { ...conditions },
    });

    data = [];
    let result = {};
    for (const request of requests) {
      result = await checkIfRequestBelongToUserOrNot(
        request.emp_id,
        request.state_id,
        request.process_id,
        request.Employee.EmployeeDetail.direct_manager_id,
        request.Employee.EmployeeDetail.delegate_id,
        user_role_id,
        current_user_emp_id
      );
      console.log({ result: JSON.stringify(result) });
      if (result.belong)
        data.push({
          id: request.id,
          emp_id: request.emp_id,
          ar_name: request.Employee.ar_name,
          process_id: request.process_id,
          process_name: request.Process.name,
          state_name: request.State.name,
          action_name: request.Action_type.name,
          Requests_details: request.Requests_details,
          ...(result.withActions
            ? { actionToTake: result.transitionsWithResponsible }
            : {}),
          created_at: request.createdAt,
          department_name: request.Employee.Department.name,
        });
      else if (
        ((request.state_id === 4 || request.state_id === 5) && //closed or canceled
          ((request.emp_id === current_user_emp_id && user_role_id === 1) || // sa7eb el request
            (request.Employee.EmployeeDetail &&
              current_user_emp_id ===
                request.Employee.EmployeeDetail.direct_manager_id) || // direct manager
            (user_role_id === 2 && request.emp_id !== current_user_emp_id))) || // hr
        (user_role_id === 3 && request.current_user_id === current_user_id) // madam may
      ) {
        data.push({
          id: request.id,
          ar_name: request.Employee.ar_name,
          emp_id: request.emp_id,
          process_name: request.Process.name,
          process_id: request.process_id,
          state_name: `تم ال${request.Action_type.name}`,
          created_at: request.createdAt,
          Requests_details: request.Requests_details,
          closed: true,
          action_taked: request.Action_type.id === 2 ? "approved" : "rejected",
          vacation_cut: request.vacation_cut,
          department_name: request.Employee.Department.name,
        });
      }
    }

    if (data.length !== 0)
      return {
        valid: true,
        msg: "تم تحميل الطلبات بنجاح",
        data,
        // nextTransition,
      };
    else
      return {
        valid: false,
        msg: "لا توجد طلبات",
      };
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
      // nextTransition,
    };
  }
}

async function checkIfRequestBelongToUserOrNot(
  emp_id,
  state_id,
  process_id,
  direct_manager_id,
  delegate_id,
  user_role_id,
  current_user_emp_id
) {
  // console.log({
  //   emp_id,
  //   state_id,
  //   process_id,
  //   direct_manager_id,
  //   user_role_id,
  //   current_user_emp_id,
  // });
  // const {
  //   EmployeeDetail: { direct_manager_id: manager_of_direct_manager = 0 } = {},
  // } =
  //   (await Employee.findOne({
  //     where: {
  //       id: direct_manager_id,
  //     },
  //     include: [{ model: EmployeeDetail, attributes: ["direct_manager_id"] }],
  //   })) || {};

  let belong = false;
  let withActions = false;

  const transitions = await Transition.findAll({
    where: {
      from_state: state_id,
      process_id: process_id,
    },
    include: [
      {
        model: Resposible_people,
        include: [{ model: Responsible_type, attributes: ["id", "name"] }],
        attributes: ["is_editor"],
      },
      { model: Action_type, attributes: ["id", "name"] },
    ],
    attributes: ["from_state", "to_state"],
  });
  let transitionsWithResponsible = [];

  transitions.forEach(
    ({ Resposible_people, from_state, to_state, Action_type }, index) => {
      transitionsWithResponsible.push({
        to_state,
        Action_type_id: Action_type.id,
        Action_type_name: Action_type.name,
        is_editor: false,
      });
      let {
        is_editor,
        Responsible_type: { id, name },
      } = Resposible_people[0];
      // Resposible_people.forEach(
      //   //                        id  ==>:2 direct_manager   , 3 :hr_manager
      //   ({ is_editor, Responsible_type: { id, name } }) => {
      //user_role_id: ==>  1 emp ,2 hr
      if (
        (id === 2 && //directmanager or mangaer of manager
          user_role_id === 1 &&
          // manager_of_direct_manager === current_user_emp_id ||
          (delegate_id === current_user_emp_id ||
            direct_manager_id === current_user_emp_id)) ||
        (id === 3 && user_role_id === 2) || // hr
        (id === 4 && user_role_id === 3)
        //  ||
        // (id === 2 &&
        //   user_role_id === 3 &&
        //   emp_id === 192 &&
        //   current_user_emp_id === 2)
      ) {
        //direct_manager

        belong = true;
        withActions = true;
      } else if (
        emp_id === current_user_emp_id ||
        (user_role_id === 1 && direct_manager_id === current_user_emp_id) ||
        (id === 4 && user_role_id === 3)
      )
        belong = true;
      transitionsWithResponsible[index].is_editor = is_editor;
      // }
      // );
    }
  );

  if (user_role_id === 3 && emp_id === 192 && current_user_emp_id === 2) {
    if (state_id !== 4) {
      belong = true;
      withActions = true;
      transitionsWithResponsible = [];
      transitionsWithResponsible.push({
        to_state: 4,
        Action_type_id: 2,
        Action_type_name: "موافقة",
        is_editor: false,
      });
      transitionsWithResponsible.push({
        to_state: 4,
        Action_type_id: 3,
        Action_type_name: "رفض",
        is_editor: false,
      });
    } else {
      belong = false;
      withActions = false;
    }
  }

  return { belong, withActions, transitionsWithResponsible };
}

async function updateRequest(
  request_id,
  action_id,
  state_id,
  current_user_id,
  user_role_id,
  current_user_emp_id
) {
  try {
    const request = await Request.findByPk(request_id, {
      include: [
        {
          model: Employee,
          include: [
            { model: EmployeeDetail, attributes: ["direct_manager_id"] },
          ],
        },
        { model: Requests_detail, attributes: ["key", "value"] },
      ],
    });

    if (request) {
      const { belong, withActions } = await checkIfRequestBelongToUserOrNot(
        request.emp_id,
        request.state_id,
        request.process_id,
        request.Employee.EmployeeDetail.direct_manager_id,
        request.Employee.EmployeeDetail.delegate_id,
        user_role_id,
        current_user_emp_id
      );

      if (belong && withActions) {
        const flag = await Request.update(
          {
            action_id,
            state_id,
            current_user_id,
          },
          {
            where: {
              id: request_id,
            },
          }
        );

        if (flag[0] === 1) {
          const action = await Action_type.findByPk(action_id);
          const process = await Process.findByPk(request.process_id);
          await actionLogger(
            request.emp_id,
            `لقد قام user بال${action.name} علي طلب ${process.name} رقم ${request.id} للموظف emp`,
            current_user_id
          );

          if (action_id === 2 && state_id === 4) {
            let { exec, columnName } = processConfig[request.process_id];
            await exec(request, columnName); //TODO:
          }
          return {
            valid: true,
            msg: "تم تعديل الطلب بنجاح",
          };
        } else {
          return {
            valid: false,
            msg: "لم يتم تعديل الطلب ",
          };
        }
      } else {
        return {
          valid: false,
          msg: "غير مصرح لك بتعديل هذا الطلب",
        };
      }
    } else
      return {
        valid: false,
        msg: "هذا الطلب غير موجود",
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

async function checkIfProcessIsResignation(
  process_id,
  emp_id,
  action_id,
  state_id
) {
  if (process_id === 3 && action_id === 2 && state_id === 4) {
    await Employee.update(
      { actual_status: false },
      {
        where: {
          id: emp_id,
        },
      }
    );
  }
}

async function checkIfProcessAffectingBalance(emp_id, Requests_details) {
  const vacationAccumulator = await vacationAccumulator.findOne({
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
  let from = "",
    to = "";
  for (const { key, value } of Requests_details) {
    if (key === "from") {
      let [requestFromDate, requestFromTime] = value.split(" ");
      from = new Date(`${requestFromDate}T${requestFromTime}.000Z`);
    } else if (key === "to") {
      let [requestToDate, requestToTime] = value.split(" ");
      to = new Date(`${requestToDate}T${requestToTime}.000Z`);
    }
  }
  let newRequestFrom = new Date(from.replace(" ", "T").concat(".000Z"));
  let newRequestTo = new Date(to.replace(" ", "T").concat(".000Z"));

  let days = getNearstDayCount((newRequestTo - newRequestFrom) / 86400000);
  vacationAccumulator.count = parseFloat(vacationAccumulator.count) - days;
  await vacationAccumulator.save();
  vacation.remaning = parseFloat(vacation.remaning) - days;
  vacation.consumed = parseFloat(vacation.consumed) + days;
  vacation.annual_vacation = parseFloat(vacation.annual_vacation) + days;
  await vacation.save();

  //
}

async function get_by_id(id) {
  const request = await Request.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Employee,
        include: [{ model: EmployeeDetail, attributes: ["direct_manager_id"] }],
      },
      { model: Requests_detail, attributes: ["key", "value"] },
      { model: State, attributes: ["name"] },
      Action_type,
      { model: Process, attributes: ["name"] },
    ],
  });
  if (request) {
    return {
      valid: true,
      data: request,
    };
  } else {
    return {
      valid: false,
      msg: "هذا الطلب غير موجود",
    };
  }
}

async function get_by_emp_id_and_date(emp_id, createdAt) {
  let conditions = {
    ...(emp_id ? { emp_id } : {}),
    ...(createdAt
      ? {
          createdAt: {
            [Op.between]: [`${createdAt} 00:00:00`, `${createdAt} 23:59:59`],
          },
        }
      : {}),
  };
  const request = await Request.findOne({
    where: {
      ...conditions,
      state_id: 4,
    },
    include: [
      {
        model: Employee,
        include: [{ model: EmployeeDetail, attributes: ["direct_manager_id"] }],
      },
      { model: Requests_detail, attributes: ["key", "value"] },
      { model: State, attributes: ["name"] },
      Action_type,
      { model: Process, attributes: ["name"] },
    ],
  });
  if (request) {
    return {
      valid: true,
      data: {
        emp_name: request.Employee.ar_name,
        exception_name: request.Process.name,
        exception_details: request.Requests_details,
      },
      msg: "تم ايجاد الطلب بنجاح",
    };
  } else {
    return {
      valid: false,
      msg: "هذا الطلب غير موجود",
    };
  }
}

async function delete_by_id(request_id, emp_id, current_user_id) {
  try {
    const result = await get_by_id(request_id);
    if (result.valid) {
      if (result.data.emp_id !== emp_id)
        return {
          valid: false,
          msg: "غير مسموح لك بمسح هذا الطلب",
        };
      else {
        const flag = await Request.update(
          {
            action_id: 4,
            state_id: 5,
            current_user_id,
          },
          {
            where: {
              id: request_id,
            },
          }
        );

        if (flag[0] === 1) {
          // await actionLogger(
          //   request.emp_id,
          //   `لقد قام user بال${action.name} علي طلب ${process.name} رقم ${request.id} للموظف emp`,
          //   current_user_id,
          //   1
          // );
          return {
            valid: true,
            msg: "تم الغاء الطلب بنجاح",
          };
        } else {
          return {
            valid: false,
            msg: "لم يتم الغاء الطلب ",
          };
        }
      }
    } else return result;
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

async function checkOverlap(emp_id, requests_details) {
  let newRequestFrom = new Date(
    requests_details.from.replace(" ", "T").concat(".000Z")
  );
  let newRequestTo = new Date(
    requests_details.to.replace(" ", "T").concat(".000Z")
  );
  let count = 0,
    request_id = 0;
  const requests = await Request.findAll({
    where: {
      emp_id,
      [Op.or]: [
        { state_id: 2, action_id: 1 },
        { state_id: 3, action_id: 2 },
        { state_id: 4, action_id: 2 },
      ],
    },
    include: [Requests_detail],
  });

  console.log(JSON.stringify(requests));

  if (requests.length !== 0) {
    for (let request of requests) {
      console.log(request.id);
      count = 0;
      for (const { key, value } of request.Requests_details) {
        if (key === "from") {
          let [requestFromDate, requestFromTime] = value.split(" ");
          let from = new Date(`${requestFromDate}T${requestFromTime}.000Z`);

          if (newRequestTo < from) {
            count++;
          }
        } else if (key === "to") {
          let [requestToDate, requestToTime] = value.split(" ");
          let to = new Date(`${requestToDate}T${requestToTime}.000Z`);

          if (newRequestFrom > to) {
            count++;
          }
        }
      }

      // count === 0 not vacation taked
      // count === 1 it's
      if (count === 0) {
        request_id = request.id;
        break;
      }
    }
    if (count === 0) {
      throw new Error(`يوجد طلب رقم ${request_id} في خلال هذة الايام`);
    } else
      return {
        success: true,
        msg: "",
      };
  } else
    return {
      success: true,
      msg: "",
    };
}

async function vacation_cut(id, DATETIME, columnName) {
  let [d, h] = DATETIME.split(" ");
  let date = new Date(`${d}T${h}.000Z`);
  try {
    let request = await Request.findOne({
      where: {
        id,
      },
      include: [
        { model: Requests_detail },
        // , {model :Employee , include : [Branch ,Position ] }
      ],
    });

    let from = "",
      to = "",
      newFrom = "",
      newTo = new Date(`${new Date().toISOString().split("T")[0]} 17:00:00`);

    // if (
    //   employee.Branch &&
    //   employee.Branch.name &&
    //   branches_9.includes(employee.Branch.name.trim())
    // ) {
    //   timeFrom = "09:00:00";
    //   timeTo = "17:00:00";
    //   forgiveness_evening_time = 15;
    //   forgiveness_morning_time = 15;
    // } else {
    //   if (employees_types.includes(employee.Position.en_name.trim())) {
    //     timeFrom = "08:00:00";
    //     timeTo = "17:00:00";
    //     forgiveness_evening_time = 10;
    //     forgiveness_morning_time = 30;
    //   } else {
    //     timeFrom = "08:00:00";
    //     timeTo = "16:00:00";
    //     forgiveness_evening_time = 10;
    //     forgiveness_morning_time = 15;
    //   }
    // }

    for (const { key, value } of request.Requests_details) {
      if (key === "from") {
        let [requestFromDate, requestFromTime] = value.split(" ");
        from = new Date(`${requestFromDate}T${requestFromTime}.000Z`);
      } else if (key === "to") {
        let [requestToDate, requestToTime] = value.split(" ");
        to = new Date(`${requestToDate}T${requestToTime}.000Z`);
      }
    }

    if (date >= from && date <= to) {
      //   // check if today within vaction
      let vacationDays = getNearstDayCount((to - from) / 86400000);
      let vacationDaysWereTaked = getNearstDayCount((date - from) / 86400000);
      let restOfDays = vacationDays - vacationDaysWereTaked;
      console.log({
        vacationDays,
        vacationDaysWereTaked,
        restOfDays,
      }); //TODO:
      const vacationAccumulator = await VacationAccumulator.findOne({
        where: {
          emp_id: request.emp_id,
        },
      });
      const vacation = await Vacation.findOne({
        where: {
          emp_id: request.emp_id,
          year: new Date().getFullYear(),
        },
      });

      let request_from = await Requests_detail.findOne({
        where: {
          request_id: id,
          key: "from",
        },
      });
      let [requestFromDate, requestFromTime] = date
        .toISOString()
        .split(".")[0]
        .split("T");
      newFrom = new Date(`${requestFromDate} ${requestFromTime}`);
      request_from.value = `${requestFromDate} ${requestFromTime}`;
      await request_from.save();

      let request_to = await Requests_detail.findOne({
        where: {
          request_id: id,
          key: "to",
        },
      });

      request_to.value = `${d} 17:00:00`;

      await request_to.save();

      const attendace = await Attendance.findOne({ request_id: request.id });
      if (attendace) {
        attendace.planned_in = newFrom;
        attendace.planned_out = newTo;
        attendace.is_exception = false;
        await attendace.save();
      }
      vacation[columnName] = vacation[columnName] - restOfDays;
      if (processConfig[request.process_id].affectBalanceFlag) {
        vacation.remaning = vacation.remaning + restOfDays;
        vacation.consumed = vacation.consumed - restOfDays;
        vacationAccumulator.count = vacationAccumulator.count + restOfDays;
      } else if (processConfig[request.process_id].increaseRemaningFlag) {
        vacation.remaning = vacation.remaning + restOfDays;
      }

      await vacation.save();
      await vacationAccumulator.save();

      request.vacation_cut = true;
      await request.save();

      return {
        valid: true,
        msg: "تم قطع الاجازة بنجاح",
      };
    } else
      return {
        valid: false,
        msg: "هذا اليوم ليس ضمن ايام الاجازة",
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

function getNearstDayCount(diffrenenceCount) {
  let start = 0.5;

  while (diffrenenceCount > start) {
    start += 0.5;
  }

  return start;
}

async function getPeopleInTheSameTeamWithinSpeceficEmployeeVacation(
  request_id
) {
  try {
    let condition = { name: "", value: "" },
      employessFoundedInSameTime = [];
    const request = await Request.findOne({
      where: {
        id: request_id,
        // state_id: 4,
        // action_id: 2,
      },
      include: [Requests_detail, Process],
    });
    if (request) {
      const {
        from: incomingRequestFrom,
        to: incomingRequestTo,
      } = getFromAndToFromRequestDetails(request);
      const employee = await Employee.findOne({
        where: {
          id: request.emp_id,
        },
        include: [EmployeeDetail],
      });
      if (employee && employee.EmployeeDetail) {
        if (employee.EmployeeDetail.team_id) {
          condition.name = "team_id";
          condition.value = employee.EmployeeDetail.team_id;
        } else if (employee.department_id) {
          condition.name = "department_id";
          condition.value = employee.department_id;
        }
      }
      // if (team_id !== null) {
      const employess = await Employee.findAll({
        where: {
          ...(condition.name === "department_id"
            ? { [condition.name]: condition.value }
            : {}),
        },
        include: [
          {
            model: EmployeeDetail,
            where: {
              ...(condition.name === "team_id"
                ? { [condition.name]: condition.value }
                : {}),
            },
          },
        ],
      });
      if (employess) {
        for (const emp of employess) {
          const employeeRequests = await Request.findAll({
            where: {
              emp_id: emp.id,
              state_id: 4,
              action_id: 2,
            },
            include: [{ model: Requests_detail }, { model: Process }],
          });
          // if (employeeRequests.length !== 0) {
          //   console.log({ employeeRequests });
          //   employessFoundedInSameTime.push(emp.id);
          // }

          if (employeeRequests.length !== 0) {
            for (const singleRequest of employeeRequests) {
              const { from, to } = getFromAndToFromRequestDetails(
                singleRequest
              );
              if (
                (incomingRequestTo >= from && incomingRequestTo <= to) ||
                (incomingRequestFrom >= from && incomingRequestFrom <= to) ||
                (incomingRequestFrom <= from && incomingRequestTo >= to)
              )
                employessFoundedInSameTime.push({
                  name: emp.ar_name,
                  code: emp.emp_code,
                  from,
                  to,
                  request_name: singleRequest.Process.name,
                  days: `${getNearstDayCount((to - from) / 86400000)} يوم`,
                });
              // if (from > incomingRequestTo || to < incomingRequestFrom) {
              // } else employessFoundedInSameTime.push(emp);
            }
          }
        }

        return {
          valid: true,
          data: employessFoundedInSameTime,
          msg: "تم تحميل البيانات بنجاح",
        };
      } else
        return {
          valid: false,
          msg: "لاتوجد موظفيين",
        };
      // }
      //  else
      //   return {
      //     valid: false,
      //     msg: "هذا الموظف غير ملحق بفريق",
      //   };
    } else
      return {
        valid: false,
        msg: "هذا الطلب غير موجود",
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

function getFromAndToFromRequestDetails(request) {
  let from, to;
  for (const { key, value } of request.Requests_details) {
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

async function checkIfOfficialVacationOrNot(from, to) {
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

module.exports = {
  createRequest: createRequest,
  getRequests: getRequests,
  updateRequest: updateRequest,
  delete_by_id: delete_by_id,
  get_by_emp_id_and_date: get_by_emp_id_and_date,
  vacation_cut: vacation_cut,
  getPeopleInTheSameTeamWithinSpeceficEmployeeVacation: getPeopleInTheSameTeamWithinSpeceficEmployeeVacation,
};
