import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { DatePicker } from "antd";
import TableEmp from "./TableEmp";
import "./employees.css";
import { useState } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import { Option } from "antd/lib/mentions";

// import History from "../../utilities/History";
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
var childContext = "";
export default function Employees() {
  const classes = useStyles();
  function onChange(date, dateString) {
    set_join_date(date);
  }

  const {
    mainData: { branches = {}, departments = {}, positions = {}, status = {} },
  } = useSelector((store) => store);

  const [ar_name, set_ar_name] = useState(null);
  const [emp_code, set_emp_code] = useState(null);
  const [join_date, set_join_date] = useState(null);
  const [actual_status, set_actual_status] = useState(null);

  const [department, set_department] = useState(null);
  const [branch, set_branch] = useState(null);
  const [position_id, set_position_id] = useState(null);
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <CssBaseline />
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid container>
              <Grid
                item
                lg={1}
                sm={2}
                xs={6}
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>اسم الموظف</label>
              </Grid>
              <Grid item xs={6} sm={10} lg={4}>
                <TextField
                  variant="outlined"
                  required
                  InputProps={{
                    style: { height: "40px", fontSize: "15px" },
                  }}
                  fullWidth
                  InputLabelProps={{
                    style: {
                      direction: "rtl",
                    },
                  }}
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={ar_name}
                  autoFocus
                  onChange={({ target: { value } }) => {
                    set_ar_name(value);
                  }}
                />
              </Grid>
              <Grid
                item
                lg={1}
                xs={6}
                sm={2}
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>الوظيفة</label>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Select
                  value={position_id}
                  onChange={(d) => set_position_id(d)}
                  size="default"
                  defaultValue="1"
                  style={{ width: "100%", marginLeft: "20px" }}
                >
                  {Object.keys(positions).map((key) => {
                    return <Option key={key}>{positions[key]}</Option>;
                  })}
                </Select>
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: "13px" }}>
              <Grid
                item
                lg={1}
                xs={6}
                sm={2}
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>القسم</label>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Select
                  value={department}
                  onChange={(d) => set_department(d)}
                  size="default"
                  defaultValue="1"
                  style={{ width: "100%", marginLeft: "20px" }}
                >
                  {Object.keys(departments).map((key) => {
                    return <Option key={key}>{departments[key]}</Option>;
                  })}
                </Select>
              </Grid>
              <Grid
                item
                lg={1}
                xs={6}
                sm={2}
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>الفرع</label>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Select
                  value={branch}
                  onChange={(d) => set_branch(d)}
                  size="default"
                  defaultValue="1"
                  style={{ width: "100%", marginLeft: "20px" }}
                >
                  {Object.keys(branches).map((key) => {
                    return <Option key={key}>{branches[key]}</Option>;
                  })}
                </Select>
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: "13px" }}>
              <Grid
                item
                lg={1}
                xs={6}
                sm={2}
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>كود الموظف</label>
              </Grid>
              <Grid item lg={4} xs={6} sm={10}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  InputLabelProps={{
                    style: {
                      direction: "rtl",
                      width: "90%",
                    },
                  }}
                  InputProps={{
                    style: { height: "40px", fontSize: "15px" },
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  value={emp_code}
                  onChange={({ target: { value } }) => {
                    set_emp_code(value);
                  }}
                />
              </Grid>

              <Grid
                item
                lg={1}
                sm={2}
                xs={6}
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>تاريخ التعيين</label>
              </Grid>
              <Grid item lg={4} xs={6} sm={10} className="dateFilter">
                <DatePicker
                  onChange={onChange}
                  placeholder=""
                  value={join_date}
                  style={{ width: "100%", height: "100%" }}
                />
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: "13px" }}>
              <Grid
                item
                lg={1}
                xs={6}
                sm={2}
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>الحالة</label>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Select
                  value={actual_status}
                  onChange={(param) => set_actual_status(param)}
                  size="default"
                  style={{ width: "100%", marginLeft: "20px" }}
                >
                  {Object.keys(status).map((key) => (
                    <Option key={key}>{status[key]}</Option>
                  ))}
                </Select>
              </Grid>
              <Grid item lg={5}></Grid>
              <Grid item xs={12} sm={12} md={12} lg={2}>
                <Button
                  id="searchBtn"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                  onClick={() => {
                    childContext.setState({ current: 1 });
                    childContext.getEmployees(0, {
                      ...(ar_name ? { ar_name } : {}),
                      ...(emp_code ? { emp_code } : {}),
                      ...(join_date
                        ? {
                            join_date: join_date.toISOString().split("T")[0],
                          }
                        : {}),
                      ...(department ? { department_id: department } : {}),
                      ...(branch ? { branch_id: branch } : {}),
                      ...(position_id ? { position_id } : {}),
                      ...(actual_status ? { actual_status } : {}),
                    });
                  }}
                >
                  بحث
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
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
              <Typography
                style={{
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "#2B2D35",
                }}
              >
                جميع الموظفين
              </Typography>
            </Box>
          </Box>
          {/* <Box display="flex" justifyContent="flex-start" m={1} p={1}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#FEA900",
                color: "#FFF",
                fontWeight: "600",
                fontSize: "18px",
                width: "196px",
                borderRadius: "2px",
                boxShadow: "none",
                marginLeft: "-15px",
              }}
            >
              إضافة موظف جديد
            </Button>
          </Box> */}

          <TableEmp
            setChildContext={(context) => {
              childContext = context;
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
