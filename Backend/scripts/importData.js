const xlsx = require("node-xlsx");
const {
  Employee,
  EmployeeDetail,
  Department,
  Position,
  Branch,
  Team,
} = require("../models/index");
const { register } = require("../controllers/auth_controller");

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

  employeeData.position_history_en = row[4] || "";
  employeeData.position_history_ar = row[22] || "";

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
  row[1] === 101001 && (employeeData.EmployeeDetail.direct_manager_id = 2);

  const employee = await Employee.create(employeeData, {
    include: [EmployeeDetail],
  });
  if (employee.actual_status) {
    let user_role_id = 0;

    if (
      employee.en_name === "May Mohamed Osama El Mallawany" ||
      employee.en_name === "Nehal Mohamed Abd El Fattah Mohamed"
    )
      user_role_id = 3;
    else if (depart.name === "Human Resources") user_role_id = 2;
    else user_role_id = 1;
    await register(
      employee.ar_name,
      employee.en_name.split(" ").join("") + "@egyptsmartcards.com",
      "123456",
      user_role_id,
      employee.id
    );
  }

  return employee.id;
}

(async function insert_data() {
  var fs = require("fs");
  const [{ data }] = xlsx.parse(
    fs.readFileSync(`${__dirname}/../data/convertedData.xlsx`)
  );

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
            null,
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
})();
