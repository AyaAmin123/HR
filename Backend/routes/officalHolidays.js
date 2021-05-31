const express = require("express");
const router = express.Router();
const {
  get_all,
  set_holiday,
} = require("../controllers/official_holidays_controller");

router.get("/get_all", async (req, res) => {
  const result = await get_all();
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/set_holiday", async (req, res) => {
  const { id: current_user_id } = req.user;
  const { from, to, holiday_type_id } = req.body;
  const result = await set_holiday(from, to, holiday_type_id, current_user_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
