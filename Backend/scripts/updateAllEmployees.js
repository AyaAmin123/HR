const xlsx = require("node-xlsx");
const { Employee, EmployeeDetail } = require("../models/index");
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

(async function update_data(params) {
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
          ...(arabicData[28] ? { blood_type: arabicData[28] } : {}),
          ...(arabicData[29] ? { military_service: arabicData[29] } : {}),
          ...(arabicData[30] ? { social_status: arabicData[30] } : {}),
          ...(englishData[49]
            ? { smart_previous_join_date: ExcelDateToJSDate(englishData[49]) }
            : {}),
          ...(arabicData[26] ? { nationality_name: arabicData[26] } : {}),
          ...(arabicData[27] ? { religion: arabicData[27] } : {}),
          ...(englishData[13]
            ? {
                is_direct_manager: englishData[13]
                  .toString()
                  .toLowerCase()
                  .includes("true")
                  ? true
                  : false,
              }
            : {}),
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
          ...(arabicData[8] ? { contract_type: arabicData[8] } : {}),
          ...(arabicData[16] ? { social_insurance_no: arabicData[16] } : {}),
          ...(arabicData[17] ? { bank_account_name: arabicData[17] } : {}),
          ...(arabicData[18] ? { bank_account_no: arabicData[18] } : {}),
          ...(englishData[31] ? { business_email: englishData[31] } : {}),
          ...(englishData[32] ? { personal_email: englishData[32] } : {}),
          ...(englishData[33] ? { mobile: englishData[33] } : {}),
          ...(englishData[34] ? { telephone: englishData[34] } : {}),
          ...(arabicData[35] ? { data_sheet_address: arabicData[35] } : {}),
          ...(arabicData[36] ? { national_id_address: arabicData[36] } : {}),
          ...(englishData[37] ? { national_id_no: englishData[37] } : {}),
          ...(arabicData[25] ? { gender: arabicData[25] } : {}),

          ...(collect_data_from_col(arabicData, data[1], 19, 23)
            ? {
                educational_qualification: collect_data_from_col(
                  arabicData,
                  data[1],
                  19,
                  23
                ),
              }
            : {}),
          ...(collect_data_from_col(arabicData, data[1], 40, 46)
            ? { family: collect_data_from_col(arabicData, data[1], 40, 46) }
            : {}),
          ...(collect_data_from_col(arabicData, data[1], 60, 64)
            ? {
                emergency_contacts: collect_data_from_col(
                  arabicData,
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
})();

function collect_data_from_col(englishData, headers, from, to) {
  let obj = {};
  for (let index = from; index <= to; index++) {
    obj[headers[index]] = englishData[index];
  }
  return Object.keys(obj).length === 0 ? null : JSON.stringify(obj);
}
