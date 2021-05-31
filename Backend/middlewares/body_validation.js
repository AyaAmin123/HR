const { validations } = require("../utilities/validations");
const validationRoute = {
  "/auth/login": {
    email: ["required", "min%5"],
    password: ["required", "min%5"],
  },
  "/auth/register": {
    name: ["required", "min%5"],
    email: ["required", "min%5"],
    password: ["required", "min%5", "equal$confirm_password"],
    confirm_password: ["required", "min%5", "equal$password"],
    user_role_id: ["required", "number"],
  },
  "/auth/reset_password": {
    old_password: ["required", "min%5"],
    new_password: [
      "required",
      "min%5",
      "equal$confirm_new_password",
      "nEqual$old_password",
    ],
    confirm_new_password: [
      "required",
      "min%5",
      "equal$new_password",
      "nEqual$old_password",
    ],
  },
  "/lookup/branches/create": {
    name: ["required", "min%5"],
    description: ["required", "min%5"],
    branch_code: ["required", "positive"],
  },
  "/lookup/branches/update": {
    id: ["required", "positive"],
    name: ["nRequired", "min%5"],
    description: ["nRequired", "min%5"],
    branch_code: ["nRequired", "positive"],
    parent_branch_id: ["nRequired", "positive"],
  },
  "/lookup/branches/delete_by_id": {
    id: ["required", "positive"],
  },
  "/lookup/branches/get_by_id": {
    id: ["required", "positive"],
  },
  "/lookup/departments/create": {
    name: ["required", "min%5"],
    description: ["required", "min%5"],
    dep_code: ["required", "positive"],
    parent_dept_id: ["nRequired", "positive"],
  },
  "/lookup/departments/update": {
    id: ["required", "positive"],
    name: ["nRequired", "min%5"],
    description: ["nRequired", "min%5"],
    dep_code: ["nRequired", "positive"],
    parent_dept_id: ["nRequired", "positive"],
  },
  "/lookup/departments/delete_by_id": {
    id: ["required", "positive"],
  },
  "/lookup/departments/get_by_id": {
    id: ["required", "positive"],
  },
  "/lookup/positions/create": {
    ar_name: ["required", "min%5"],
    en_name: ["required", "min%5"],
    description: ["required", "positive"],
    position_code: ["nRequired", "positive"],
    parent_position_id: ["nRequired", "positive"],
  },
  "/lookup/positions/update": {
    id: ["required", "positive"],
    ar_name: ["nRequired", "min%5"],
    en_name: ["nRequired", "min%5"],
    description: ["required", "positive"],
    position_code: ["nRequired", "positive"],
    parent_position_id: ["nRequired", "positive"],
  },
  "/lookup/positions/delete_by_id": {
    id: ["required", "positive"],
  },
  "/lookup/positions/get_by_id": {
    id: ["required", "positive"],
  },
  "/employees/getById": {
    id: ["required", "positive"],
  },
  "/employees/get": {
    department_id: ["nRequired", "positive"],
    ar_name: ["nRequired", "string"],
    finger_print_id: ["nRequired", "positive"],
    join_date: ["nRequired", "date"],
  },
  "/employees/create": {
    en_name: ["required", "string", "min%5"],
    ar_name: ["required", "string", "min%5"],
    emp_code: ["required", "positive"],
    // position_id: ["required"],
    // finger_print_id: ["required"],
    join_date: ["required", "date"],
    actual_status: ["required", "positive"],
    department_id: ["required", "positive"],
    branch_id: ["required", "positive"],
  },
  "/employees/update": {
    id: ["required", "positive"],
    en_name: ["nRequired", "string", "min%5"],
    ar_name: ["nRequired", "string", "min%5"],
    emp_code: ["nRequired", "positive"],
    position_id: ["nRequired", "positive"],
    join_date: ["nRequired", "date"],
    actual_status: ["nRequired", "positive"],
    department_id: ["nRequired", "positive"],
    branch_id: ["nRequired", "positive"],
  },
  "/employees/delete_by_id": {
    id: ["required", "positive"],
  },
  "/notifications/readNotification": {
    notification_id: ["required", "positive"],
  },
  "/requests/create_request": {
    process_id: ["required", "positive"],
    requests_details: ["required", "object"],
  },
  "/requests/update_request": {
    request_id: ["required", "positive"],
    action_id: ["required", "positive"],
    state_id: ["required", "positive"],
  },
};
function body_validation(req, res, next) {
  // if (req.method != "POST") return next();
  var requestBody = Object.keys(req.body).length !== 0 ? req.body : req.query,
    error = [],
    route = req.url.split("?")[0];
  validationRoute[route] &&
    Object.keys(validationRoute[route]).forEach((param) => {
      let paramValidations = validationRoute[route][param];
      for (const paramValidation in paramValidations) {
        if (paramValidations[paramValidation].includes("%")) {
          let [validfunction, value] = paramValidations[paramValidation].split(
            "%"
          );
          let { state, msg } = validations[validfunction](
            requestBody[param],
            param,
            value
          );
          !state && error.push(msg);
        } else if (paramValidations[paramValidation].includes("$")) {
          let [validfunction, rightName] = paramValidations[
            paramValidation
          ].split("$");
          let { state, msg } = validations[validfunction](
            requestBody[param],
            param,
            requestBody[rightName] || rightName,
            rightName
          );
          !state && error.push(msg);
        } else {
          let { state, msg } = validations[paramValidations[paramValidation]](
            requestBody[param],
            param
          );
          if (paramValidations[paramValidation] === "nRequired" && state) {
            break;
          } else if (
            paramValidations[paramValidation] === "nRequired" &&
            !state
          )
            continue;
          else !state && error.push(msg);
        }
      }
    });
  error.length === 0
    ? next()
    : res.status(400).send({ valid: false, msg: error[0] });
}

module.exports = body_validation;
