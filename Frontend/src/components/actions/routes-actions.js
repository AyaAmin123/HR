import Constants from "../../utilities/Constants";
export const setRoutes = (routes = []) => {
  return {
    type: Constants.setRoutes,
    payload: routes,
  };
};
