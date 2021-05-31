const express = require("express");
const {
  login,
  register,
  reset_password,
} = require("../controllers/auth_controller");
const router = express.Router();
router.post("/login", async (req, res) => {
  const { email = "", password = "" } = req.body;
  const result = await login(email, password);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/register", async (req, res) => {
  const { name, email, password, user_role_id } = req.body;
  const result = await register(name, email, password, user_role_id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

router.post("/reset_password", async (req, res) => {
  const { old_password, new_password } = req.body;
  const { email } = req.user;
  const result = await reset_password(email, old_password, new_password);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

module.exports = router;
