const { get_all: get_all_branches } = require("./branches_controller");
const { get_all: get_all_departments } = require("./departments_controller");
const { get_all: get_all_positions } = require("./positions_controller");
const { get_all: get_all_processes } = require("./processes");
const { get_all: get_all_holidays_types } = require("./holidays_types");

// const {
//   get_all: get_all_attendancemisactions,
// } = require("./attendancemisactions_controller");

async function get_lookups() {
  const result_branches = await get_all_branches();

  const result_departments = await get_all_departments();

  const result_positions = await get_all_positions();

  const result_processes = await get_all_processes();

  // const result_attendancemisactions = await get_all_attendancemisactions();

  const result_holidays_types = await get_all_holidays_types();

  const status = {
    0: "0",
    1: "1",
  };
  const processesRequirements = {
    1: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "معلومات اضافية",
      },
    },
    2: {
      date: {
        required: true,
        disabled: false,
        fromToday: true,
      },
      time: {
        required: true,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "نوع المامورية",
      },
    },
    3: {
      date: {
        required: false,
        disabled: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      currentTime: {
        required: true,
        disabled: true,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
    },
    4: {
      date: {
        required: true,
        disabled: true,
        fromToday: true,
      },
      time: {
        required: false,
        disabled: false,
      },
      currentTime: {
        required: false,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
    },
    5: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
    },

    6: {
      date: {
        required: true,
        disabled: true,
        fromToday: true,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
    },
    7: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },

      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
    },
    8: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: false,
        disabled: false,
        field_name: "السبب",
      },
    },
    9: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
      attach_file: true,
    },
    10: {
      date: {
        required: true,
        disabled: false,
        fromToday: true,
      },
      time: {
        required: false,
        disabled: false,
      },

      reason: {
        required: false,
        disabled: false,
        field_name: "السبب",
      },
    },

    11: {
      date: {
        required: true,
        disabled: false,
        fromToday: true,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: false,
        disabled: false,
        field_name: "السبب",
      },
    },
    12: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: false,
        disabled: false,
        field_name: "السبب",
      },
      attach_file: true,
    },
    13: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },

      reason: {
        required: false,
        disabled: false,
        field_name: "السبب",
      },
      attach_file: true,
    },
    14: {
      date: {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: false,
        disabled: false,
        field_name: "السبب",
      },
    },
    15: {
      date: {
        required: true,
        disabled: false,
        fromToday: true,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
    },
    16: {
      date: {
        required: true,
        disabled: false,
        fromToday: true,
      },
      time: {
        required: true,
        disabled: false,
      },
      reason: {
        required: true,
        disabled: false,
        field_name: "السبب",
      },
    },
    17: {
      date: {
        required: false,
        disabled: false,
      },
      time: {
        required: false,
        disabled: false,
      },
      reason: {
        required: false,
        disabled: false,
      },
      table: {
        required: true,
        disabled: false,
      },
    },
  };
  const processesCutness = {
    1: {
      canCut: true,
      columnName: "",
    },
    2: {
      canCut: false,
      columnName: "",
    },
    3: {
      canCut: false,
      columnName: "",
    },
    4: {
      canCut: false,
      columnName: "",
    },
    5: {
      canCut: true,
      columnName: "",
    },
    6: {
      canCut: false,
      columnName: "",
    },
    7: {
      canCut: false,
      columnName: "",
    },
    8: {
      canCut: false,
      columnName: "",
    },
    9: {
      canCut: true,
      columnName: "sick_vacation",
    },
    10: {
      canCut: false,
      columnName: "",
    },
    11: {
      canCut: false,
      columnName: "",
    },
    12: {
      canCut: false,
      columnName: "",
    },
    13: {
      canCut: true,
      columnName: "",
    },
    14: {
      canCut: false,
      columnName: "",
    },
    15: {
      canCut: false,
      columnName: "",
    },
    16: {
      canCut: false,
      columnName: "",
    },
    17: {
      canCut: false,
      columnName: "",
    },
  };
  const latnessFilters = {
    1: "التأخير صباحا و نسيان البصمة مساءا",
    2: "التأخير صباحا و الخروج مبكرا",
    3: "التأخير صباحا فقط",
    4: "الخروج مبكرا و نسيان البصمة صباحا",
    5: "الخروج مبكرا فقط",
    6: "عدم الحضور",
  };
  const monthlyCloseLookup = {
    "1-15": "Jan",
    "2-15": "Jan./Feb",
    "3-15": "Feb./Mar",
    "4-15": "Mar./Apr",
    "5-15": "Apr./May",
    "6-15": "May./Jun",
    "7-15": "Jun./Jul",
    "8-15": "Jul./Aug",
    "9-15": "Aug./Sept",
    "10-15": "Sept./Oct",
    "11-15": "Oct./Nov",
    "12-15": "Nov./Dec",
    "12-31": "Dec",
  };
  const vacation_types = {
    1: {
      name: "اجازات من الرصيد",
      data: [1, 4, 16, 2],
    },
    2: {
      name: "بدون راتب",
      data: [5, 6, 7, 8],
    },
    3: {
      name: "مرضي",
      data: [9],
    },
    4: {
      name: "اخري",
      data: [10, 11, 12, 13, 14, 15],
    },
    // 5: {
    //   name: "الميزات",
    //   data: [],
    // },
    6: {
      name: "استقالة",
      data: [3],
    },
  };

  if (
    result_branches.valid &&
    result_departments.valid &&
    result_positions.valid &&
    result_processes.valid &&
    // result_attendancemisactions.valid &&
    result_holidays_types.valid
  )
    return {
      branches: result_branches.branches,
      departments: result_departments.departments,
      positions: result_positions.positions,
      status: status,
      processes: result_processes.Processes,
      processesRequirements,
      // attendancemisactions: result_attendancemisactions.attendanceMisAction,
      monthlyCloseLookup,
      processesCutness,
      holidaysTypes: result_holidays_types.holidaysTypes,
      latnessFilters,
      vacation_types,
    };
  else return {};
}

module.exports = {
  get_lookups: get_lookups,
};
