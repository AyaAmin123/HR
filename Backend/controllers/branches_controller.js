const { Branch } = require("../models/index");

async function create(name, description, branch_code, parent_branch_id) {
  try {
    const branch = await Branch.create({
      name,
      description,
      branch_code,
      parent_branch_id,
    });
    return {
      valid: true,
      msg: "تم انشاء الفرع بنجاح",
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
async function update(id, name, description, branch_code, parent_branch_id) {
  let updatedObj = {
    ...(name === undefined ? {} : { name }),
    ...(description === undefined ? {} : { description }),
    ...(branch_code === undefined ? {} : { branch_code }),
    ...(parent_branch_id === undefined ? {} : { parent_branch_id }),
  };

  if (Object.keys(updatedObj).length === 0) {
    return {
      valid: false,
      msg:
        "parent_branch_id branch_code description name يجب ادخال الحقول التي يتم تعديلها مثل",
    };
  }
  try {
    const result = await get_by_id(id);
    if (result.valid) {
      await Branch.update(updatedObj, {
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
      await Branch.destroy({
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
    let branches = await Branch.findAll();

    branches = branches.reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {});

    if (branches) {
      return {
        valid: true,
        msg: "",
        branches,
      };
    } else
      return {
        valid: false,
        msg: "لا يوجد فروع",
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
    const branche = await Branch.findByPk(id);
    if (branche) {
      return {
        valid: true,
        msg: "",
        branche,
      };
    } else
      return {
        valid: false,
        msg: "هذا الفرع غير موجود",
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
