import React from "react";
// import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import { Tabs } from "antd";
import "../Profile.css";
// import csx from "classnames";
// eslint-disable-next-line no-unused-vars
import { Education, OtherData, PersonalData, WorkExp } from "./ExportFile";
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
  },
}));

export default function PersonalFile(props) {
  const classes = useStyles();
  const { TabPane } = Tabs;
  console.log(props.data);
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <Tabs defaultActiveKey="1" className="nestedTabs">
          <TabPane tab="البيانات الشخصية" key="1">
            <PersonalData data={props.data} />
          </TabPane>
          <TabPane tab="التعليم" key="2">
            <Education data={props.data} />
          </TabPane>
          {/* <TabPane tab=" خبرة العمل" key="3">
            <WorkExp data={props.data} />
          </TabPane> */}
          <TabPane tab=" فى حالة الطوارئ يرجى الاتصال ب " key="4">
            <OtherData data={props.data} />
          </TabPane>
        </Tabs>
      </Paper>
    </Grid>
  );
}
