const express = require("express");
const router = express();
const {
  get,
  getLatnessByMonthAndDay,
} = require("../controllers/latenes_controller");

router.get("/get_details", async (req, res) => {
  const { emp_id, from, to } = req.query;
  const result = await get(emp_id, from, to);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.get("/get_latness_by_month_and_day", async (req, res) => {
  const { emp_id } = req.user;
  const result = await getLatnessByMonthAndDay(emp_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
