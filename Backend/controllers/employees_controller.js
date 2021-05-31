const {
  Employee,
  EmployeeDetail,
  Position,
  Branch,
  Department,
} = require("../models/index");
const { Op } = require("sequelize");
const { update_one_file } = require("../scripts/updateOneEmployee");
async function getById(id) {
  try {
    const employee = await Employee.findByPk(id, {
      include: [EmployeeDetail, Position, Branch, Department],
    });
    if (employee)
      return {
        valid: true,
        data: employee,
        msg: "تم ايجاد الموظف بنجاح",
      };
    else
      return {
        valid: false,
        msg: "لم يتم ايجاد الموظف",
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
async function getByName(name) {
  try {
    let condition = {
      [Op.or]: [
        { ar_name: { [Op.like]: `%${name}%` } },
        { en_name: { [Op.like]: `%${name}%` } },
      ],
    };
    const employee = await Employee.findOne({
      where: condition,
      attributes: ["id", "ar_name"],
    });
    if (employee)
      return {
        valid: true,
        data: employee,
        msg: "تم ايجاد الموظف بنجاح",
      };
    else
      return {
        valid: false,
        msg: "لم يتم ايجاد الموظف",
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
async function get(
  actual_status,
  department_id,
  ar_name,
  position_id,
  finger_print_id,
  join_date,
  branch_id,
  emp_code,
  page = 0,
  per_page = 10
) {
  try {
    let conditions = {
      ...(emp_code === undefined ? {} : { emp_code }),
      ...(department_id ? { department_id } : {}),
      ...(branch_id ? { branch_id } : {}),
      ...(ar_name ? { ar_name: { [Op.like]: `%${ar_name}%` } } : {}),
      ...(finger_print_id ? { finger_print_id } : {}),
      ...(position_id ? { position_id } : {}),
      ...(join_date
        ? {
            join_date: {
              [Op.between]: [`${join_date} 00:00:00`, `${join_date} 23:59:59`],
            },
          }
        : {}),
      ...(actual_status ? { actual_status } : {}),
    };

    const { count, rows } = await Employee.findAndCountAll({
      where: { ...conditions },
      offset: parseInt(page * per_page),
      limit: parseInt(per_page),
      include: [EmployeeDetail],
    });

    if (count !== 0)
      return {
        valid: true,
        page,
        per_page,
        data: rows,
        total: count,
        msg: "تم تحمبل البيانات بنجاح",
      };
    else
      return {
        valid: false,
        page,
        per_page,
        total: 0,
        msg: "لم يتم ايجاد موظفين",
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
async function get_all() {
  try {
    const { count, rows } = await Employee.findAndCountAll({
      include: [{ model: Branch, as: "Branch" }, { model: Position }],
      where: {
        actual_status: 1,
      },
    });

    if (count !== 0)
      return {
        valid: true,
        data: rows,
        msg: "تم تحمبل البيانات بنجاح",
      };
    else
      return {
        valid: false,
        msg: "لم يتم ايجاد موظفين",
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
async function create(
  en_name,
  ar_name,
  emp_code,
  finger_print_id,
  position_id,
  join_date,
  actual_status,
  department_id,
  branch_id
) {
  try {
    const employee = await Employee.create({
      en_name,
      ar_name,
      emp_code,
      finger_print_id,
      position_id,
      join_date,
      actual_status,
      department_id,
      branch_id,
    });
    if (employee)
      return {
        valid: true,
        msg: "تم انشاء الموظف بنجاح",
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
async function update(
  id,
  en_name,
  ar_name,
  emp_code,
  finger_print_id,
  position_id,
  join_date,
  actual_status,
  department_id,
  branch_id
) {
  try {
    let updatedObj = {
      ...(en_name === undefined ? {} : { en_name }),
      ...(ar_name === undefined ? {} : { ar_name }),
      ...(emp_code === undefined ? {} : { emp_code }),
      ...(finger_print_id === undefined ? {} : { finger_print_id }),
      ...(position_id === undefined ? {} : { position_id }),
      ...(join_date === undefined ? {} : { join_date }),
      ...(actual_status === undefined ? {} : { actual_status }),
      ...(department_id === undefined ? {} : { department_id }),
      ...(branch_id === undefined ? {} : { branch_id }),
    };
    const flag = await Employee.update(
      {
        ...updatedObj,
      },
      {
        where: {
          id,
        },
      }
    );
    if (flag[0] === 1)
      return {
        valid: true,
        msg: "تم تعديل الموظف بنجاح",
      };
    else {
      return {
        valid: false,
        msg: "لم يتم تعديل الموظف",
      };
    }
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
async function delete_by_id(id) {
  try {
    const flag = await Employee.destroy({
      where: {
        id,
      },
    });

    if (flag === 1)
      return {
        valid: true,
        msg: "تم مسح الموظف بنجاح",
      };
    else {
      return {
        valid: false,
        msg: "لم يتم مسح الموظف",
      };
    }
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

async function update_employee_using_Excel(file, current_user_id) {
  try {
    if (file !== undefined) {
      let path = __basedir + "/data/update_data/" + file.filename;
      const result = await update_one_file(path, current_user_id);
      return result;
    } else
      return {
        valid: false,
        msg: "الملف غير موجود",
      };
  } catch (error) {
    console.log(error.stack);
    return {
      valid: false,
      msg: error.message,
    };
  }
}
module.exports = {
  get: get,
  getById: getById,
  create: create,
  update: update,
  delete_by_id: delete_by_id,
  get_all: get_all,
  getByName,
  update_employee_using_Excel,
};
