import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import DeductionsTable from "./DeductionsTable";
// import { Tabs } from "antd";
import "./attendance.css";
// import csx from "classnames";
// import MeasuresTab from "./MeasuresTab";
import { Select } from "antd";
import { DatePicker } from "antd";
import { get, post } from "../../API";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import { Box } from "@material-ui/core";

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
    boxShadow: "none",
    borderRadius: "2px",
    fontWeight: "600",
    fontSize: "18px",
    marginRight: "3px",
  },
  paper: {
    padding: 20,
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginRight: 196,
    marginLeft: 35,
    marginTop: 22,
    direction: "rtl",
    border: "0.5px solid #b1b1b1",
    boxShadow: "none",
    borderRadius: "2px",
  },
  tableStyle: {
    paddingLeft: 32,
    paddingRight: 32,
  },
}));

export default function Attendance() {
  const classes = useStyles();
  const { Option } = Select;
  const {
    mainData: { monthlyCloseLookup },
  } = useSelector((store) => store);
  const dispatch = useDispatch(null);
  const [data, set_data] = useState({
    data: [],
    page: 0,
    per_page: 10,
    total: "",
  });

  const [monthlyClose, set_monthlyClose] = useState(null);
  const [year, set_year] = useState("");

  const getDeductions = async (pageNumber = 0) => {
    let tempYear = new Date(year).toISOString().split("T")[0].split("-")[0];

    dispatch(showLoading());
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data,
      page,
      per_page,
      total,
    } = await get("deduction/get_all", {
      date: `${tempYear}-${monthlyClose}`,
      page: pageNumber,
      per_page: 10,
    });
    if (valid) {
      set_data({ data, page, per_page, total });
      dispatch(openAlert("success", msg));
      dispatch(hideLoading());
    } else {
      set_data({ data: [], page: 0, per_page: 0, total: 0 });
      dispatch(openAlert("error", msg));
      dispatch(hideLoading());
    }
  };

  const calculateDeductions = async () => {
    dispatch(showLoading());
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "deduction/calculate_monthly_close",
      {}
    );
    if (valid) {
      dispatch(openAlert("success", msg));
      dispatch(hideLoading());
    } else {
      dispatch(openAlert("error", msg));
      dispatch(hideLoading());
    }
  };

  // department_id,
  // ar_name,
  // finger_print_id,
  // date,
  // page = 0,
  // per_page = 10,
  // const { TabPane } = Tabs;
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <CssBaseline />

        <Grid container spacing={2}>
          <Grid container style={{ marginTop: "13px" }}>
            <Grid
              item
              lg={1}
              xs={12}
              className="textLabel"
              style={{
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              <label>تقفيلة الشهر</label>
            </Grid>
            <Grid item xs={11} lg={4}>
              <Select
                value={monthlyClose}
                onChange={(d) => set_monthlyClose(d)}
                size="default"
                defaultValue="1"
                style={{ width: "100%", marginLeft: "20px" }}
              >
                {Object.keys(monthlyCloseLookup).map((key) => {
                  return <Option key={key}>{monthlyCloseLookup[key]}</Option>;
                })}
              </Select>
            </Grid>
            <Grid
              item
              lg={1}
              xs={12}
              className="textLabel"
              style={{
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              <label>سنة</label>
            </Grid>
            <Grid item xs={11} lg={4}>
              <DatePicker
                picker={"year"}
                value={year}
                onChange={(date, dateString) => set_year(date)}
                placeholder=""
                style={{ width: "100%", height: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={2}>
              <Button
                disabled={monthlyClose === null || year === ""}
                type="submit"
                fullWidth
                variant="contained"
                id="searchbtn"
                className={classes.submit}
                onClick={() => getDeductions()}
              >
                بحث
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Grid container className={classes.tableStyle}>
        <Grid sm={12} item style={{ marginRight: "160px" }}>
          <Box
            display="flex"
            justifyContent="flex-end"
            m={1}
            p={1}
            bgcolor="background.paper"
          >
            <Box p={1}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                id="searchbtn"
                className={classes.submit}
                onClick={() => calculateDeductions()}
              >
                حساب التقفيلة
              </Button>
            </Box>
          </Box>

          <DeductionsTable
            data={data}
            getDeductions={(pageNumber) => getDeductions(pageNumber)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

// {
//   /* <Grid container style={{ marginTop: "13px" }}>
// <Grid
//   item
//   lg={1}
//   xs={12}
//   className="textLabel"
//   style={{
//     fontSize: "14px",
//     marginTop: "10px",
//   }}
// >
//   <label>القسم</label>
// </Grid>
// <Grid item xs={11} lg={4}>
//   <Select
//     value={department_id}
//     onChange={(e) => set_department_id(e)}
//     size="default"
//     style={{ width: "100%", height: "100%" }}
//   >
//     {Object.keys(departments).map((key) => {
//       return <Option key={key}>{departments[key]}</Option>;
//     })}
//   </Select>
// </Grid>

// <Grid
//   item
//   lg={1}
//   xs={12}
//   className="textLabel"
//   style={{
//     fontSize: "14px",
//     marginTop: "10px",
//   }}
// >
//   <label>أسم الموظف</label>
// </Grid>
// <Grid item xs={11} lg={4}>
//   <TextField
//     autoComplete="fname"
//     name="firstName"
//     InputLabelProps={{
//       style: {
//         direction: "rtl",
//         width: "90%",
//       },
//     }}
//     InputProps={{
//       style: { height: "40px", fontSize: "15px" },
//     }}
//     value={ar_name}
//     onChange={({ target: { value } }) => {
//       set_ar_name(value);
//     }}
//     variant="outlined"
//     required
//     fullWidth
//     id="firstName"
//     autoFocus
//   />
// </Grid>
// </Grid>
// <Grid container style={{ marginTop: "13px" }}>
// <Grid
//   item
//   lg={1}
//   xs={6}
//   sm={2}
//   style={{ fontSize: "16px", marginTop: "10px" }}
// >
//   <label>الوظيفة</label>
// </Grid>
// <Grid item xs={12} lg={4}>
//   <Select
//     value={job}
//     onChange={(d) => set_job(d)}
//     size="default"
//     defaultValue="1"
//     style={{ width: "100%", marginLeft: "20px" }}
//   >
//     {Object.keys(jobs).map((key) => {
//       return <Option key={key}>{jobs[key]}</Option>;
//     })}
//   </Select>
// </Grid>
// <Grid
//   item
//   lg={1}
//   xs={6}
//   sm={2}
//   style={{ fontSize: "16px", marginTop: "10px" }}
// >
//   <label>الفرع</label>
// </Grid>
// <Grid item xs={12} lg={4}>
//   <Select
//     value={branch}
//     onChange={(d) => set_branch(d)}
//     size="default"
//     defaultValue="1"
//     style={{ width: "100%", marginLeft: "20px" }}
//   >
//     {Object.keys(branches).map((key) => {
//       return <Option key={key}>{branches[key]}</Option>;
//     })}
//   </Select>
// </Grid>
// </Grid>
//  */
// }
