const { Position } = require("../models/index");

async function create(
  ar_name,
  en_name,
  description,
  position_code,
  parent_position_id
) {
  try {
    const position = await Position.create({
      ar_name,
      en_name,
      description,
      position_code,
      parent_position_id,
    });
    return {
      valid: true,
      msg: "تم انشاء المركز  بنجاح",
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
  ar_name,
  en_name,
  description,
  position_code,
  parent_position_id
) {
  let updatedObj = {
    ...(ar_name === undefined ? {} : { ar_name }),
    ...(en_name === undefined ? {} : { en_name }),
    ...(description === undefined ? {} : { description }),
    ...(position_code === undefined ? {} : { position_code }),
    ...(parent_position_id === undefined ? {} : { parent_position_id }),
  };

  if (Object.keys(updatedObj).length === 0) {
    return {
      valid: false,
      msg:
        "ar_name en_name description position_code  parent_position_id يجب ادخال الحقول التي يتم تعديلها مثل",
    };
  }
  try {
    const result = await get_by_id(id);
    if (result.valid) {
      await Position.update(updatedObj, {
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
      await Position.destroy({
        where: {
          id,
        },
      });
      return {
        valid: true,
        msg: "تم مسح المركز بنجاح",
      };
    } else return result;
  } catch (error) {
    return {
      valid: false,
      msg: error.message,
    };
  }
}
async function get_all() {
  try {
    let positions = await Position.findAll();

    positions = positions.reduce((acc, cur) => {
      acc[cur.id] = cur.en_name;
      return acc;
    }, {});
    if (positions) {
      return {
        valid: true,
        msg: "",
        positions,
      };
    } else
      return {
        valid: false,
        msg: "لا يوجد مراكز",
      };
  } catch (error) {
    return {
      valid: false,
      msg: error.message,
    };
  }
}
async function get_by_id(id) {
  try {
    const position = await Position.findByPk(id);
    if (position) {
      return {
        valid: true,
        msg: "",
        position,
      };
    } else
      return {
        valid: false,
        msg: "هذا المركز غير موجود",
      };
  } catch (error) {
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
