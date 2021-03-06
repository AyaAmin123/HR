import React from "react";
import "./loginStyle.css";
import LoginImage from "../images/Login.png";
import SmartLogo from "../images/smartLogo.png";
import { MyTextField } from "./Field";
import { Checkbox } from "@material-ui/core";
import { connect } from "react-redux";
import { openAlert } from "../actions/alert-action";
import { showComponent } from "../actions/showComponent-action";
import { showLoading, hideLoading } from "../actions/loading-action";
import { post } from "../../API/index";
import Axios from "../../API/api";
import history from "../../utilities/History";
import { setPath } from "../actions/path-action";
import { setLookups } from "../actions/getMainData-action";
import { setUserData } from "../actions/userData-actions";
import { setRoutes } from "../actions/routes-actions";
import { showDiv } from "../actions/showDiv";
class Login extends React.Component {
  state = {
    email: "",
    password: "",
    disabledButton: true,
  };
  render() {
    const { password, email } = this.state;
    return (
      <div className="containerLogin">
        <div className="insidecontainer">
          <div className="form">
            <img src={SmartLogo} alt="Logo" style={{ marginBottom: "30px" }} />
            <MyTextField
              title="اسم المستخدم"
              value={email}
              onChange={({ target: { value } }) =>
                this.setState({ email: value })
              }
              onClickEnter={this._login}
            />
            <MyTextField
              title="كلمة المرور"
              value={password}
              onChange={({ target: { value } }) =>
                this.setState({ password: value })
              }
              type="password"
              onClickEnter={this._login}
            />
            <div className="beforeButton">
              <h5 className="resetPassword">هل نسيت كلمه السر؟</h5>
              <div className="resetRememberContainer">
                <h3 className="rememberMe">اذكرني دائما</h3>
                <Checkbox
                  size="small"
                  // checked={}
                  // onChange={}
                  name="checkedB"
                  style={{ color: "lightgrey" }}
                />
              </div>
            </div>
            <button
              disabled={this._buttonState()}
              onClick={this._login}
              className="buttonStyle"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>

        <img className="LoginImage" src={LoginImage} alt="Logo" />
      </div>
    );
  }

  _login = async () => {
    // this.props.showDiv();
    this.props.showLoading();
    const { email, password } = this.state;
    if (email.trim().length > 0 && password.trim().length > 0) {
      let {
        valid = false,
        msg = "لا يمكن الاتصال بالسيرفر",
        token,
        user,
        lookups,
        routes,
      } = await post("auth/login", {
        email,
        password,
      });
      if (valid) {
        this.props.setLookups(lookups);
        this.props.openAlert("success", msg);
        if (user.user_role_id === 2 || user.user_role_id === 3) {
          this.props.setUserData({ ...user, token, routes });
          Axios.defaults.headers.token = token.hr;
          history.push("/hr/afterLogin");
        } else {
          this.props.setPath("اضافة طلب");
          this.props.setUserData({ ...user, routes });
          Axios.defaults.headers.token = token;
          this.props.setRoutes(routes.emp);
          history.push(routes.emp[0]);
          this.props.showComponent();
        }
      } else this.props.openAlert("error", msg);
      this.props.hideLoading();
    }
  };
  _buttonState = () => {
    const { email, password, disabledButton } = this.state;
    return email.trim().length !== 0 && password.trim().length !== 0
      ? false
      : disabledButton;
  };
}

export default connect(null, {
  openAlert,
  showComponent,
  showDiv,
  setPath,
  showLoading,
  hideLoading,
  setLookups,
  setUserData,
  setRoutes,
})(Login);
