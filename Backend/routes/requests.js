const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  updateRequest,
  delete_by_id,
  get_by_emp_id_and_date,
  vacation_cut,
  getPeopleInTheSameTeamWithinSpeceficEmployeeVacation,
} = require("../controllers/request_controller");
const upload = require("../middlewares/upload_photo");
router.post("/create_request", async (req, res) => {
  const {
    process_id,
    requests_details,
    emp_id: emp_id_created_by_hr,
    isNewRequest,
  } = req.body;
  // if (req.file) {
  //   upload(req, res, (err) => {});
  // }
  const { emp_id, id: current_user_id, user_role_id } = req.user;

  const result = await createRequest(
    emp_id_created_by_hr ? emp_id_created_by_hr : emp_id,
    process_id,
    current_user_id,
    requests_details,
    isNewRequest,
    user_role_id
  );
  res.status(200).send(result);
});

router.post("/attachPhoto", upload, async (req, res) => {
  res.status(200).send({ valid: true, msg: "تم رفع الصورة بنجاح" });
});

router.post("/update_request", async (req, res) => {
  const { action_id, state_id, request_id } = req.body;
  const { id: current_user_id, user_role_id, emp_id } = req.user;

  const result = await updateRequest(
    request_id,
    action_id,
    state_id,
    current_user_id,
    user_role_id,
    emp_id
  );
  res.status(200).send(result);
});

router.get("/get_requests", async (req, res) => {
  const result = await getRequests(req.user, req.query);
  res.status(200).send(result);
});

router.get("/get_request_by_emp_id_and_date", async (req, res) => {
  const { createdAt } = req.query;
  const { emp_id } = req.user;
  const result = await get_by_emp_id_and_date(emp_id, createdAt);
  res.status(200).send(result);
});

router.post("/delete_request", async (req, res) => {
  const { request_id } = req.body;
  const { emp_id, current_user_id } = req.user;

  const result = await delete_by_id(request_id, emp_id, current_user_id);
  res.status(200).send(result);
});

router.post("/cut_vacation", async (req, res) => {
  const { request_id, date, columnName } = req.body;
  const { emp_id, current_user_id } = req.user;

  const result = await vacation_cut(request_id, date, columnName);
  res.status(200).send(result);
});

router.post(
  "/getPeopleInTheSameTeamWithinSpeceficEmployeeVacation",
  async (req, res) => {
    const { request_id } = req.body;
    const result = await getPeopleInTheSameTeamWithinSpeceficEmployeeVacation(
      request_id
    );
    res.status(200).send(result);
  }
);
module.exports = router;
