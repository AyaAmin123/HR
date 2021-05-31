const express = require("express");
const router = express();
const {
  get_all,
  update,
} = require("../controllers/rest_allowances_controller");
router.post("/consume", async (req, res) => {
  const { id } = req.body;
  const result = await update(id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.get("/get_all", async (req, res) => {
  const { emp_id } = req.user;
  const result = await get_all(emp_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
