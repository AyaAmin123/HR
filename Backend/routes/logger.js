const express = require("express");
const router = express.Router();
const { get_logger } = require("../controllers/logger_controller");

router.get("/get", async (req, res) => {
  const { emp_id, user_role_id, id } = req.user;
  const { page = 0, per_page = 10 } = req.query;
  const result = await get_logger(emp_id, page, per_page, user_role_id, id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
