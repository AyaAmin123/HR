const attendence_api = require("../services/attendence_api");
(async () => {
  await attendence_api.employees();
})();
