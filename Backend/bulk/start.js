const { bulkProcesses } = require("./bulkProcess");
const { bulkStates } = require("./bulkStates");
const { bulkAction_types } = require("./bulkAction_types");
const { bulkResponsible_types } = require("./bulkResponsible_types");
const { bulkUserRoles } = require("./bulkUserRoles");

const { bulkDepartment } = require("./bulkDepartments");
const { bulkBranch } = require("./bulkBranches");
const { bulkHolidaysTypes } = require("./bulkHolidaysTypes");
const { bulkTransition } = require("./bulktransition");
const { bulkResposible_people } = require("./bulkResponsible_people");
(async function bulk() {
  const bulkProcessesValid = await bulkProcesses();
  const bulkStatesValid = await bulkStates();
  const bulkAction_typesValid = await bulkAction_types();

  const bulkResponsible_typesValid = await bulkResponsible_types();
  const bulkTransitionValid = await bulkTransition();

  const bulkUserRolesValid = await bulkUserRoles();

  const bulkHolidaysTypes_to_tableValid = await bulkHolidaysTypes();

  const bulkResposible_peopleValid = await bulkResposible_people();

  bulkProcessesValid &&
  bulkStatesValid &&
  bulkAction_typesValid &&
  bulkResponsible_typesValid &&
  bulkUserRolesValid &&
  // bulkDepartmentValid &&
  // bulkBranchValid &&
  bulkTransitionValid &&
  bulkResposible_peopleValid &&
  // bulkEntityValid &&
  // bulkActionValid &&
  // bulkEntity_Action_DescValid &&
  // bulkRelated_to_tableValid
  bulkHolidaysTypes_to_tableValid
    ? console.log("All data have been inserted successfully")
    : console.log("an error has occured");
})();

// const bulkDepartmentValid = await bulkDepartment();
// const bulkBranchValid = await bulkBranch();
// const bulkEntityValid = await bulkEntity();
// const bulkActionValid = await bulkAction();
// const bulkEntity_Action_DescValid = await bulkEntity_Action_Desc();
// const bulkAttendanceMisActionValid = await bulkAttendanceMisAction();
// const bulkRelated_to_tableValid = await bulkRelated_to_table();
