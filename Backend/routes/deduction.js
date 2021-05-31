const express = require("express");
const router = express();
const {
  get,
  forgiveDeduction,
  calculateDeductionsToTheResignationDate,
  calculateMonthlyClose,
} = require("../controllers/deduction_controller");

router.get("/get_all", async (req, res) => {
  const { date, page = 0, per_page = 10 } = req.query;
  const result = await get(date, page, per_page);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.get("/get_dues_For_resigned_person", async (req, res) => {
  const { emp_id, end_date } = req.query;
  const result = await calculateDeductionsToTheResignationDate(
    emp_id,
    end_date
  );
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/forgive", async (req, res) => {
  const { id: user_id } = req.user;
  const { emp_id, date, monthlyClose } = req.body;
  const result = await forgiveDeduction(emp_id, date, monthlyClose, user_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/calculate_monthly_close", async (req, res) => {
  res.status(200).send({
    valid: true,
    msg: "سوف يتم اضافة التقفيلات",
  });
  await calculateMonthlyClose();
});

module.exports = router;
