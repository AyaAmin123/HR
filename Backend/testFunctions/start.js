const fs = require("fs");
// const { get } = require("../controllers/deduction_controller");
// const { get } = require("../controllers/emp_penality_counts");
const { get } = require("../controllers/latenes_controller");
(async function () {
  // const result = await get();
  // const result = await get(1, "2020-11-11 00:00:00");
  const result = await get(1, "Oct./Nov", 2020);
  // "lateness_hours": 1.16,
  // "forgot_face_print": true,
  fs.writeFileSync("result.json", JSON.stringify(result));
})();
