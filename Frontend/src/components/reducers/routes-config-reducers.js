import Constants from "../../utilities/Constants";
export default (routes = [], action) => {
  switch (action.type) {
    case Constants.setRoutes:
      return action.payload;
    default:
      return routes;
  }
};
