const xlsx = require("node-xlsx");
const {
  Employee,
  EmployeeDetail,
  Department,
  Position,
  Branch,
  Team,
} = require("../models/index");
const { Op } = require("sequelize");
var myArgs = process.argv.slice(2);
console.log("myArgs: ", myArgs);
(async function import_insurance_date() {
  var fs = require("fs");
  const [{ data }] = xlsx.parse(
    fs.readFileSync(`${__dirname}/../data/convertedSocialInsurance.xlsx`)
  );
  // let [day, month, year] = data[0][1]
  //   .split("\n")[1]
  //   .replace("(", "")
  //   .replace(")", "")
  //   .split("/");
  let sheetDate = new Date(`2021-01-01T00:00:00.000Z`);
  let today = new Date(
    `${new Date().toISOString().split("T")[0]}T00:00:00.000Z`
  );
  let diffranceDays;
  if (myArgs.length !== 0 && myArgs[0] === "setInsurance") {
    diffranceDays = 0;
  } else diffranceDays = (today - sheetDate) / 86400000;

  for (let index = 0; index < data.length; index++) {
    if (index !== 0) {
      let row = data[index];
      let en_name = row[0];
      const employee = await Employee.findOne({
        where: {
          en_name: {
            [Op.like]: `%${en_name}%`,
          },
        },
      });
      if (row[1] && row[1].length !== 0) {
        let years = row[1].split(" ")[0],
          Months = row[1].split(" ")[2],
          Days = row[1].split(" ")[4];

        let days =
          parseInt(years) * 365.5 + parseInt(Months) * 30 + parseInt(Days);
        await EmployeeDetail.update(
          { insurance_days_count: days + diffranceDays },
          {
            where: {
              emp_id: employee.id,
            },
          }
        );
      }
    }
  }
})();
