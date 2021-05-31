import Constants from "../../utilities/Constants";
export default (userData = {}, action) => {
  switch (action.type) {
    case Constants.setUserData:
      return action.payload;
    case Constants.updateUserRole:
      return { ...userData, user_role_id: action.payload };
    default:
      return userData;
  }
};
