const xlsx = require("node-xlsx");
const { Employee, EmployeeDetail } = require("../models/index");
const { Op } = require("sequelize");
const actionLogger = require("../utilities/actionLog");
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

function collect_data_from_col(englishData, headers, from, to) {
  let obj = {};
  for (let index = from; index <= to; index++) {
    obj[headers[index]] = englishData[index];
  }
  return Object.keys(obj).length === 0 ? null : JSON.stringify(obj);
}

async function update_one_file(path, current_user_id) {
  try {
    var fs = require("fs");

    const [{ data }] = xlsx.parse(fs.readFileSync(`${path}`));
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
    await actionLogger(
      employeeToBeUpdated.id,
      `لقد قام user بعمل تحديث للبيانات للموظف emp`,
      current_user_id
    );
    return {
      valid: true,
      msg: "تم تعديل الموظف بنجاح",
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
  update_one_file,
};
