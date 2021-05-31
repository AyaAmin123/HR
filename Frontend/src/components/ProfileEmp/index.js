import React, { useEffect, useState } from "react";
// import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PersonalBalance from "./PersonalBalance";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import { Tabs } from "antd";
import "./Profile.css";
import csx from "classnames";
import PersonalFile from "./PersonalFile";
// import History from "./History";
import { get } from "../../API";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import { useDispatch } from "react-redux";
const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    backgroundColor: "#93C020",
    color: "#FFF",
    width: "156px",
    boxShadow: "none",
    marginRight: "2.7rem",
    borderRadius: "2px",
    fontWeight: "600",
    fontSize: "18px",
  },
  paper: {
    padding: 20,
    textAlign: "center",
    color: theme.palette.text.secondary,
    // marginRight: 196,
    marginLeft: 35,
    marginTop: 22,
    direction: "rtl",
    border: "0.5px solid #b1b1b1",
    boxShadow: "none",
    borderRadius: "2px",
  },
  tableStyle: {
    paddingLeft: 32,
    // paddingRight: 32,
  },
  tabsStyle: {
    marginRight: 196,
  },
}));

export default function Profile(props) {
  const dispatch = useDispatch();
  const [data, set_data] = useState({});
  async function getEmpDetails(id) {
    dispatch(showLoading());
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      // eslint-disable-next-line no-unused-vars
      data: serverData,
    } = await get("employees/getById", { id });
    if (valid) {
      set_data(serverData);
      dispatch(openAlert("success", msg));
    } else {
      dispatch(openAlert("error", msg));
    }
    dispatch(hideLoading());
  }

  useEffect(() => {
    getEmpDetails(props.match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.id]);
  const classes = useStyles();
  const { TabPane } = Tabs;
  return (
    <Grid item xs={12}>
      <Tabs type="card" id="profile" className={csx(classes.tabsStyle)}>
        <TabPane tab="الملف الشخصى" key="1">
          <Grid container className={classes.tableStyle}>
            <Grid sm={12} item>
              <PersonalFile data={data} />
            </Grid>
          </Grid>
        </TabPane>
        {/* <TabPane tab="السجل" key="2">
          <History />
        </TabPane> */}
        <TabPane tab="رصيد الاجازات" key="3">
          <PersonalBalance emp_id={props.match.params.id} />
        </TabPane>
      </Tabs>
    </Grid>
  );
}
