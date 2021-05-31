import red1 from "./getMainData-reducer";
import red2 from "./alert-reducer";
import red3 from "./show-component-reducer";
import red4 from "./path-reducer";
import red5 from "./modal-reducer";
import red6 from "./userData-reducer";
import red7 from "./routes-config-reducers";
import { combineReducers } from "redux";

export default combineReducers({
  mainData: red1,
  alertOptions: red2,
  showComponent: red3,
  currentRoute: red4,
  modal: red5,
  userData: red6,
  routes: red7,
});
