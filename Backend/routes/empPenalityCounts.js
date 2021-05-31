const express = require("express");
const router = express();
const { get } = require("../controllers/emp_penality_counts");

router.get("/get_details", async (req, res) => {
  const { emp_id, date, monthlyClose } = req.query;
  const result = await get(emp_id, date, monthlyClose);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
