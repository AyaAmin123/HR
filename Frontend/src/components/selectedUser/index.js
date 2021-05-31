import React from "react";
import "./styleSelectedUser.css";
import hr from "../images/emp.png";
import emp from "../images/hr.png";
import Axios from "../../API/api";
import { connect } from "react-redux";
import { showComponent } from "../actions/showComponent-action";
import { updateUserRole } from "../actions/userData-actions";
import History from "../../utilities/History";
import { setRoutes } from "../actions/routes-actions";
import { setPath } from "../actions/path-action";
class SelectedUser extends React.Component {
  component = (title, image, className, role, token, routes, path) => {
    return (
      <div className="logoandtext">
        <img
          src={image}
          alt="Logo"
          className={`${className}`}
          onClick={() => {
            Axios.defaults.headers.token = token;
            this.props.setPath(path);
            this.props.showComponent();
            this.props.updateUserRole(role);
            this.props.setRoutes(routes);
            History.push(routes[0]);
          }}
        />
        <div className="underlogo">
          <h4 className="text">{title}</h4>
          <div className="line"></div>
        </div>
      </div>
    );
  };
  componentDidMount = () => {
    const {
      routes: { miss_may },
      user_role_id,
    } = this.props.userData;
    if (user_role_id === 3) {
      this.props.setPath("الموظفيين");
      this.props.updateUserRole(3);
      this.props.setRoutes(miss_may);
      History.push(miss_may[0]);
      this.props.showComponent();
    }
  };

  render() {
    const { emp: token_emp, hr: token_hr } = this.props.userData.token;
    const {
      routes: { emp: routes_emp, hr: routes_hr },
    } = this.props.userData;

    return (
      <div className="container">
        <div className="content">
          {this.component(
            "موظف",
            emp,
            "imageEmp",
            1,
            token_emp,
            routes_emp,
            "اضافة طلب"
          )}
          {this.component(
            "موظف موارد بشرية",
            hr,
            "imageHr",
            2,
            token_hr,
            routes_hr,
            "الموظفيين"
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userData: state.userData,
  };
};

export default connect(mapStateToProps, {
  showComponent,
  updateUserRole,
  setRoutes,
  setPath,
})(SelectedUser);
