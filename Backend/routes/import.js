const express = require("express");
const {
  import_emp
} = require("../controllers/import_controller");
const router = express.Router();


router.post("/import_emp", async (req, res) => {
  const result = await import_emp();
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});



module.exports = router;
