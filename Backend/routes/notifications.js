const express = require("express");
const router = express.Router();
const {
  get_notifications,
  //   create_notification,
  make_notification_read,
} = require("../controllers/notification_controller");
router.get("/getNotifications", async (req, res) => {
  const result = await get_notifications(req.user.id);
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});

// router.post("/createNotification", async (req, res) => {
//   const result = await create_notification();
//   if (result.valid) res.status(200).send(result);
//   else res.status(404).send(result);
// });

router.post("/readNotification", async (req, res) => {
  const { notification_id } = req.body;
  const result = await make_notification_read(req.user.id, notification_id); //req.user.id , notification_id
  if (result.valid) res.status(200).send(result);
  else res.status(404).send(result);
});
module.exports = router;
