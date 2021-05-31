const express = require("express");
const { get_all } = require("../controllers/job_status_controller");
const router = express.Router();

router.get("/get_all", async (req, res) => {
  const result = await get_all();
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
