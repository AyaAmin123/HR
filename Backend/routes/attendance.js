const express = require("express");
const axios = require("axios");
const {
  setFingerPrint,
  getAttendence,
  get,
  attendanceMisReport,
  forgiveAction,
  update_attendance_from_file,
} = require("../controllers/attendence_controller");
const {
  update_actual_in_and_out,
} = require("../scripts/update_actual_in_and_out");
const upload_attendance = require("../middlewares/upload_attendance");
const {
  insertRecords,
} = require("../scripts/attendanceScripts/addAttendanceTonight");

const router = express.Router();

router.get("/set-finger-print", async (req, res) => {
  const result = await setFingerPrint();
  res.status(200).send(result);
});
router.get("/get_attendance", async (req, res) => {
  const result = await getAttendence();
  res.status(200).send(result);
});

router.get("/get", async (req, res) => {
  const {
    department_id,
    ar_name,
    finger_print_id,
    date,
    branch_id,
    lateness_filter,
    page = 0,
    per_page = 10,
  } = req.query;
  const result = await get(
    lateness_filter,
    department_id,
    branch_id,
    ar_name,
    finger_print_id,
    date,
    page,
    per_page
  );
  res.status(200).send(result);
});

router.post("/update_mis_report", async (req, res) => {
  const {
    emp_id,
    month_year,
    affect_column,
    plus_or_minus,
    value,
    attendance_id,
  } = req.body;
  const result = await attendanceMisReport(
    attendance_id,
    emp_id,
    month_year,
    affect_column,
    plus_or_minus,
    value
  );
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/forgive_action", async (req, res) => {
  const { id: current_user_id } = req.user;
  const { id, emp_id } = req.body;
  const result = await forgiveAction(id, emp_id, current_user_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/update_actual_in_out", async (req, res) => {
  const { date } = req.body;
  console.log("here");
  const result = await update_actual_in_and_out(date);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/addAttendance", async (req, res) => {
  const { from, to } = req.body;
  res.status(200).send({
    valid: true,
    msg: "سيتم اضافة الحضور",
  });
  // const result = await insertRecords(from, to);
  // if (result.valid) res.status(200).send(result);
  // else res.status(404).send(result);
  await insertRecords(from, to);
});

router.post(
  "/update_attendance_from_file",
  upload_attendance.array("attendanceFiles", 30),
  async (req, res) => {
    res.status(200).send({
      valid: true,
      msg: "سيتم تحديث الحضور و الانصراف",
    });
    const { id: current_user_id } = req.user;
    const result = await update_attendance_from_file(
      req.files,
      current_user_id
    );
    // if (result.valid) res.status(200).send(result);
    // else res.status(404).send(result);
  }
);
module.exports = router;
