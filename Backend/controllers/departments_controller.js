const { Department } = require("../models/index");

async function create(name, description, dep_code, parent_dept_id) {
  try {
    const department = await Department.create({
      name,
      description,
      dep_code,
      parent_dept_id,
    });
    return {
      valid: true,
      msg: "تم انشاء القسم بنجاح",
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
async function update(id, name, description, dep_code, parent_dept_id) {
  let updatedObj = {
    ...(name === undefined ? {} : { name }),
    ...(description === undefined ? {} : { description }),
    ...(dep_code === undefined ? {} : { dep_code }),
    ...(parent_dept_id === undefined ? {} : { parent_dept_id }),
  };

  if (Object.keys(updatedObj).length === 0) {
    return {
      valid: false,
      msg:
        "parent_dept_id dep_code description name يجب ادخال الحقول التي يتم تعديلها مثل",
    };
  }
  try {
    const result = await get_by_id(id);
    if (result.valid) {
      await Department.update(updatedObj, {
        where: {
          id,
        },
      });
    } else return result;

    return {
      valid: true,
      msg: "تم التعديل بنجاح",
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
async function delete_by_id(id) {
  try {
    const result = await get_by_id(id);
    if (result.valid) {
      await Department.destroy({
        where: {
          id,
        },
      });
      return {
        valid: true,
        msg: "تم المسح بنجاح",
      };
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
async function get_all() {
  try {
    let departments = await Department.findAll();

    departments = departments.reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {});

    if (departments) {
      return {
        valid: true,
        msg: "",
        departments,
      };
    } else
      return {
        valid: false,
        msg: "لا يوجد اقسام",
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
async function get_by_id(id) {
  try {
    const department = await Department.findByPk(id);
    if (branche) {
      return {
        valid: true,
        msg: "",
        department,
      };
    } else
      return {
        valid: false,
        msg: "هذا القسم غير موجود",
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
  create: create,
  update: update,
  delete_by_id: delete_by_id,
  get_all: get_all,
  get_by_id: get_by_id,
};
