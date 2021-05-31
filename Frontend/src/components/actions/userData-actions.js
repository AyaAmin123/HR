import Constants from "../../utilities/Constants";
export const setUserData = (userData) => {
  return {
    type: Constants.setUserData,
    payload: userData,
  };
};

export const updateUserRole = (role) => {
  return {
    type: Constants.updateUserRole,
    payload: role,
  };
};
