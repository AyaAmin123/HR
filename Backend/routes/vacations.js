const express = require("express");
const { getVacationBalance } = require("../controllers/vacation_controller");
const router = express.Router();

router.get("/getVacationBalance", async (req, res) => {
  let { emp_id, year } = req.query;
  year = year ? year : new Date().getFullYear().toString();
  const result = await getVacationBalance(emp_id, year);
  res.status(200).send(result);
});

module.exports = router;
