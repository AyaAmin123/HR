const { User, Employee } = require("../models/index");
const bcrypt = require("bcrypt");
const { get_lookups } = require("./lookups_controller");
async function login(email, password) {
  const user = await User.findOne({
    where: {
      email: email,
    },
    include: [Employee],
  });
  if (user) {
    if (!user.Employee.actual_status) {
      return {
        valid: false,
        msg: "هذا المستخدم مستقيل",
      };
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return {
          valid: true,
          token: user.generate_token(),
          msg: "success",
          user: {
            email: user.email,
            name: user.name,
            user_role_id: user.user_role_id,
            emp_id: user.emp_id,
          },
          lookups: await get_lookups(),
          routes: user.generate_routes(),
        };
      } else {
        return {
          valid: false,
          msg: "البريد الالكتروني او كلمة المرور خاطئة",
        };
      }
    }
  } else {
    return {
      valid: false,
      msg: "مستخدم غير موجود",
    };
  }
}
async function register(name, email, password, user_role_id, emp_id) {
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    return {
      valid: false,
      msg: "هذا المستخدم موجود من قبل",
    };
  } else {
    let hashed_password = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: hashed_password,
      user_role_id,
      reset_password: true,
      emp_id,
    });
    return {
      valid: true,
      msg: "تم انشاء المستخدم بنجاح",
    };
  }
}
async function reset_password(email, old_password, new_password) {
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    const match = await bcrypt.compare(old_password, user.password);
    let hashed_password = await bcrypt.hash(new_password, 10);
    if (match) {
      const l = await User.update(
        { password: hashed_password },
        {
          where: {
            email: email,
          },
        }
      );

      return {
        valid: true,
        msg: "تم تغيير كلمة المرور بنجاح",
      };
    } else {
      return {
        valid: false,
        msg: "البريد الالكتروني او كلمة المرور خاطئة",
      };
    }
  } else {
    return {
      valid: false,
      msg: "هذا المستخدم غير موجود",
    };
  }
}
module.exports = {
  login: login,
  register: register,
  reset_password: reset_password,
};
