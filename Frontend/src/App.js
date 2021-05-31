import React from "react";
import "./App.css";
import { Route, Router } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "antd/dist/antd.css";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import history from "./utilities/History";
import Mymodal from "./components/portal";
import {
  Login,
  Navbar,
  Attendance,
  BreadCrumbs,
  Employees,
  Home,
  MyAlert,
  PrivateRouter,
  Profile,
  Requests,
  Resignation,
  SelectedUser,
  ShowComponent,
  SideBar,
  Vacation,
  reducers,
  ResetPassword,
  Notifications,
  MyRequests,
  Deductions,
  OfficialHolidays,
  UpdateEmployee,
  UploadAttendaceFile,
  AddAttendance,
  JobStatus,
} from "./components";
const THEME = createMuiTheme({
  typography: {
    fontFamily: '"Cairo"',
    fontSize: 15,
    lineHeight: 1.5,
    letterSpacing: 0.32,
    useNextVariants: true,
    suppressDeprecationWarnings: true,
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={THEME}>
      <Provider store={createStore(reducers, applyMiddleware(thunk))}>
        <MyAlert />
        <Mymodal />
        <div className="App">
          <ShowComponent Component={<Navbar />} />
          <ShowComponent Component={<SideBar />} />
          <ShowComponent Component={<BreadCrumbs />} />
          <Router history={history}>
            <Route path="/hr" exact component={Login} />
            <PrivateRouter
              path="/hr/resetPassword"
              exact
              component={ResetPassword}
            />
            <PrivateRouter path="/hr/home" exact component={Home} />
            <PrivateRouter
              path="/hr/afterLogin"
              exact
              component={SelectedUser}
            />
            <PrivateRouter path="/hr/employees" exact component={Employees} />
            <PrivateRouter path="/hr/attendance" exact component={Attendance} />
            <PrivateRouter path="/hr/requests" exact component={Requests} />
            <PrivateRouter path="/hr/vacation" exact component={Vacation} />
            <PrivateRouter
              path="/hr/resignation"
              exact
              component={Resignation}
            />
            <PrivateRouter path="/hr/Profile/:id" exact component={Profile} />
            <PrivateRouter path="/hr/myRequests" exact component={MyRequests} />
            <PrivateRouter
              path="/hr/notifications"
              exact
              component={Notifications}
            />
            <PrivateRouter
              path="/hr/officialHolidays"
              exact
              component={OfficialHolidays}
            />
            <PrivateRouter path="/hr/deductions" exact component={Deductions} />
            <PrivateRouter
              path="/hr/update_employee"
              exact
              component={UpdateEmployee}
            />
            <PrivateRouter
              path="/hr/uploadAttendanceFile"
              exact
              component={UploadAttendaceFile}
            />

            <PrivateRouter
              path="/hr/addAttendance"
              exact
              component={AddAttendance}
            />
            <PrivateRouter path="/hr/jobStatus" exact component={JobStatus} />
          </Router>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
