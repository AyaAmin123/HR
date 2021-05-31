const xlsx = require("node-xlsx");
const {
  Employee,
  EmployeeDetail,
  Department,
  Position,
  Branch,
  Team,
} = require("../models/index");
const { config } = require("process");
const { Op } = require("sequelize");

function ExcelDateToJSDate(serial) {
  if (serial && typeof serial === "number") {
    var utc_days = Math.floor(serial - 25569) + 1;
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  } else return null;
}

async function prepare_employee_data(
  employeeData,
  row,
  direct_manager_id,
  team_id
) {
  if (row[0] === "Out") {
    employeeData.actual_status = 0;
  } else employeeData.actual_status = 1;
  employeeData.emp_code = row[1] || "";
  employeeData.en_name = row[2] || "";
  employeeData.join_date = ExcelDateToJSDate(row[7]);
  employeeData.EmployeeDetail.join_date = ExcelDateToJSDate(row[7]);
  employeeData.EmployeeDetail.birth_date = ExcelDateToJSDate(row[9]);
  employeeData.EmployeeDetail.remarks = row[15] || "";
  employeeData.ar_name = row[24] || "";

  direct_manager_id &&
    (employeeData.EmployeeDetail.direct_manager_id = direct_manager_id);

  team_id && (employeeData.EmployeeDetail.team_id = team_id);

  var depart = await Department.findOne({
    where: { name: row[6] },
  });
  if (!depart) {
    depart = await Department.create({ name: row[6] });
  }

  // positions
  var position = await Position.findOne({
    where: { en_name: row[3] },
  });
  if (!position) {
    if (row[23])
      position = await Position.create({
        en_name: row[3],
        ar_name: row[23],
      });
    else
      position = await Position.create({
        en_name: row[3],
        ar_name: "",
      });
  }

  // positions
  var branch = await Branch.findOne({ where: { name: row[5] } });
  if (!branch) {
    branch = await Branch.create({ name: row[5] });
  }

  employeeData.position_id = position.id;
  employeeData.branch_id = branch.id;
  employeeData.department_id = depart.id;

  const employee = await Employee.create(employeeData, {
    include: [EmployeeDetail],
  });
  return employee.id;
}

async function insert_data(params) {
  var fs = require("fs");
  var files = fs.readdirSync(`${__dirname}/../data/`);

  const [{ data }] = xlsx.parse(
    fs.readFileSync(`${__dirname}/../data/convertedData.xlsx`)
  );

  fs.writeFileSync("result.json", JSON.stringify(data));

  var employeeData = {
    en_name: null,
    ar_name: null,
    finger_print_id: null,
    position_id: null,
    join_date: null,
    actual_status: null,
    department_id: null,
    emp_code: null,
    branch_id: null,
    EmployeeDetail: {
      position_history_en: null,
      position_history_ar: null,
      remarks: null,
      birth_date: null,
      join_date: null,
      termination_date: null,
      probation_date: null,
      issue_date: null,
      expire_date: null,
      insurance_date: null,
      team_id: null,
    },
  };
  var count = 99999999999999999999999,
    direct_manager_id = null,
    team_id = null,
    teamCount = 0;

  for (let index = 0; index < data.length; index++) {
    if (index !== 0) {
      employeeData = {
        en_name: null,
        ar_name: null,
        finger_print_id: null,
        position_id: null,
        join_date: null,
        actual_status: null,
        department_id: null,
        branch_id: null,
        emp_code: null,
        EmployeeDetail: {
          position_history_en: null,
          position_history_ar: null,
          remarks: null,
          birth_date: null,
          join_date: null,
          termination_date: null,
          probation_date: null,
          issue_date: null,
          expire_date: null,
          insurance_date: null,
        },
      };
      let row = data[index];

      if (
        row[0] === undefined &&
        row[1] === undefined &&
        row[2].toString().includes("Team") &&
        row[3].toString().includes("Team")
      ) {
        count = 0;
        teamCount = row[4];
        var team = await Team.findOne({
          where: { name: row[2].toString() },
        });
        if (!team) {
          team = await Team.create({ name: row[2].toString() });
        }
        team_id = team.id;
      } else {
        if (count === 0) {
          direct_manager_id = await prepare_employee_data(
            employeeData,
            row,
            direct_manager_id,
            team_id
          );
          count++;
        } else if (count < teamCount) {
          await prepare_employee_data(
            employeeData,
            row,
            direct_manager_id,
            team_id
          );
          count++;
        } else {
          await prepare_employee_data(employeeData, row, null, null);
        }
      }
    }
  }

  // "No.",
  // "ID",
  // " Name",
  // "  Position",    // check
  // "  Position History",
  // "Branch", //check
  // "Department", //check
  // "Joining Date",
  // "Smart Working Years",
  // "Birthdate",
  // null,
  // "Actual",
  // "عدد موظفي الفرع",
  // "عدد القسم (في الشركة)",
  // "Resignation Date",
  // "Remarks",
  // null,
  // null,
  // null,
  // "تاريخ الميلاد",
  // "تاريخ التعيين",
  // "الفرع",
  // "التدرج الوظيفي",
  // "الوظيفة",
  // "الاسم",
  // "الكود",
  // "العدد"

  // let headers = data[0].data[0],
  //   headersDetails = data[0].data[1],
  //   englishData = data[0].data[2],
  //   arabicData = data[0].data[6];

  // let employeeData = {
  //   en_name: englishData[2],
  //   ar_name: arabicData[2],
  //   emp_code: "",
  //   finger_print_id: englishData[0],
  //   position_id: "",
  //   join_date: englishData[5],
  //   actual_status: 1,
  //   department_id: "",
  //   branch_id: "",
  // };

  // console.log(`${__dirname}/../data/`);
}

async function update_data(params) {
  try {
    var fs = require("fs");
    var files = fs.readdirSync(`${__dirname}/../data/update_data/`);
    for (const file of files) {
      const [{ data }] = xlsx.parse(
        fs.readFileSync(`${__dirname}/../data/update_data//${file}`)
      );
      let englishData = data[2];
      let arabicData = data[6];
      let employee = null;
      if (englishData[14])
        employee = await Employee.findOne({
          where: {
            en_name: {
              [Op.like]: `%${englishData[14]}%`,
            },
          },
          include: [EmployeeDetail],
        });
      let employeeData = {
        mainData: {
          ...(englishData[2] ? { en_name: englishData[2] } : {}),
          ...(arabicData[2] ? { ar_name: arabicData[2] } : {}),
          ...(englishData[0] ? { finger_print_id: englishData[0] } : {}),
          ...(englishData[5]
            ? { join_date: ExcelDateToJSDate(englishData[5]) }
            : {}),
        },
        EmployeeDetail: {
          ...(englishData[28] ? { blood_type: englishData[28] } : {}),
          ...(englishData[29] ? { military_service: englishData[29] } : {}),
          ...(englishData[30] ? { social_status: englishData[30] } : {}),
          ...(englishData[49]
            ? { smart_previous_join_date: ExcelDateToJSDate(englishData[49]) }
            : {}),
          ...(englishData[26] ? { nationality_name: englishData[26] } : {}),
          ...(englishData[27] ? { religion: englishData[27] } : {}),
          ...(englishData[13] ? { is_direct_manager: englishData[13] } : {}),
          ...(englishData[4] ? { position_history_en: englishData[4] } : {}),
          ...(arabicData[4] ? { position_history_ar: arabicData[4] } : {}),
          ...(englishData[24]
            ? { birth_date: ExcelDateToJSDate(englishData[24]) }
            : {}),
          ...(englishData[5]
            ? { join_date: ExcelDateToJSDate(englishData[5]) }
            : {}),
          ...(englishData[7]
            ? { probation_date: ExcelDateToJSDate(englishData[7]) }
            : {}),
          ...(englishData[38]
            ? { issue_date: ExcelDateToJSDate(englishData[38]) }
            : {}),
          ...(englishData[39]
            ? { expire_date: ExcelDateToJSDate(englishData[39]) }
            : {}),
          ...(employee ? { team_id: employee.EmployeeDetail.team_id } : {}),
          ...(employee ? { direct_manager_id: employee.id } : {}),
          ...(englishData[8] ? { contract_type: englishData[8] } : {}),
          ...(englishData[16] ? { social_insurance_no: englishData[16] } : {}),
          ...(englishData[17] ? { bank_account_name: englishData[17] } : {}),
          ...(englishData[18] ? { bank_account_no: englishData[18] } : {}),
          ...(englishData[31] ? { business_email: englishData[31] } : {}),
          ...(englishData[32] ? { personal_email: englishData[32] } : {}),
          ...(englishData[33] ? { mobile: englishData[33] } : {}),
          ...(englishData[34] ? { telephone: englishData[34] } : {}),
          ...(englishData[35] ? { data_sheet_address: englishData[35] } : {}),
          ...(englishData[36] ? { national_id_address: englishData[36] } : {}),
          ...(englishData[37] ? { national_id_no: englishData[37] } : {}),
          ...(englishData[25] ? { gender: englishData[25] } : {}),

          ...(collect_data_from_col(englishData, data[1], 19, 23)
            ? {
                educational_qualification: collect_data_from_col(
                  englishData,
                  data[1],
                  19,
                  23
                ),
              }
            : {}),
          ...(collect_data_from_col(englishData, data[1], 40, 46)
            ? { family: collect_data_from_col(englishData, data[1], 40, 46) }
            : {}),
          ...(collect_data_from_col(englishData, data[1], 60, 64)
            ? {
                emergency_contacts: collect_data_from_col(
                  englishData,
                  data[1],
                  60,
                  64
                ),
              }
            : {}),
        },
      };

      let employeeToBeUpdated = await Employee.findOne({
        where: {
          en_name: {
            [Op.like]: `%${data[2][2]}%`,
          },
        },
      });
      if (employeeToBeUpdated) {
        let flag_main = await Employee.update(employeeData.mainData, {
          where: {
            id: employeeToBeUpdated.id,
          },
        });

        let flag_details = await EmployeeDetail.update(
          employeeData.EmployeeDetail,
          {
            where: {
              emp_id: employeeToBeUpdated.id,
            },
          }
        );
      }
      console.log({ employeeData: JSON.stringify(employeeData) });
    }
    console.log("data has been updated successfully");
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    console.log({ error: error.message });
  }
}

function collect_data_from_col(englishData, headers, from, to) {
  let obj = {};
  for (let index = from; index <= to; index++) {
    obj[headers[index]] = englishData[index];
  }
  return Object.keys(obj).length === 0 ? null : JSON.stringify(obj);
}
