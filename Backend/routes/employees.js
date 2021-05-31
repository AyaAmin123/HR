const express = require("express");
const logger = require("../startup/logger");

// const async_middleware = require("../middlewares/async");

const {
  get,
  getById,
  create,
  update,
  delete_by_id,
  get_all,
  getByName,
  update_employee_using_Excel,
} = require("../controllers/employees_controller");
const upload = require("../middlewares/upload_file");

const router = express.Router();

router.get("/getById", async (req, res) => {
  const { id } = req.query;
  const result = await getById(id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.get("/get", async (req, res) => {
  const {
    actual_status,
    department_id,
    ar_name,
    finger_print_id,
    join_date,
    position_id,
    page,
    per_page,
    branch_id,
    emp_code,
  } = req.query;

  const result = await get(
    actual_status,
    department_id,
    ar_name,
    position_id,
    finger_print_id,
    join_date,
    branch_id,
    emp_code,
    page,
    per_page
  );
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/create", async (req, res) => {
  const {
    en_name,
    ar_name,
    emp_code,
    finger_print_id,
    position_id,
    join_date,
    actual_status,
    department_id,
    branch_id,
  } = req.body;
  const result = await create(
    en_name,
    ar_name,
    emp_code,
    finger_print_id,
    position_id,
    join_date,
    actual_status,
    department_id,
    branch_id
  );
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/update", async (req, res) => {
  const {
    id,
    en_name,
    ar_name,
    emp_code,
    finger_print_id,
    position_id,
    join_date,
    actual_status,
    department_id,
    branch_id,
  } = req.body;
  const result = await update(
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
  );
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/delete_by_id", async (req, res) => {
  const { id } = req.body;
  const result = await delete_by_id(id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.get("/get_all", async (req, res) => {
  const result = await get_all();
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post(
  "/update_employee_using_Excel",
  upload.single("file"),
  async (req, res) => {
    const { id: current_user_id } = req.user;
    const result = await update_employee_using_Excel(req.file, current_user_id);
    if (result.valid) res.status(200).send(result);
    else res.status(404).send(result);
  }
);

router.get("/getByName", async (req, res) => {
  const { ar_name } = req.query;
  const result = await getByName(ar_name);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
