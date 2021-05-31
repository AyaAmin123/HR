const express = require("express");
const router = express.Router();
const {
  create,
  update,
  delete_by_id,
  get_all,
  get_by_id,
} = require("../controllers/departments_controller");

router.post("/create", async (req, res) => {
  const { name, description, dep_code, parent_dept_id } = req.body;
  const result = await create(name, description, dep_code, parent_dept_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/update", async (req, res) => {
  const { id, name, description, dep_code, parent_dept_id } = req.body;
  const result = await update(id, name, description, dep_code, parent_dept_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/delete_by_id", async (req, res) => {
  const { id } = req.body;
  const result = await delete_by_id(id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.get("/get_all", async (req, res) => {
  const result = await get_all();
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.get("/get_by_id", async (req, res) => {
  const { id } = req.body;
  const result = await get_by_id(id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
