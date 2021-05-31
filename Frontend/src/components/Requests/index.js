import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import TableRequests from "./TableRequests";
import { Select } from "antd";
import "./requests.css";
import { DatePicker } from "antd";
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
    marginRight: "5px",
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
    paddingTop: "30px",
  },
}));

export default function Employees() {
  const classes = useStyles();
  function onChange(date, dateString) {}
  // eslint-disable-next-line no-unused-vars
  const currencies = [
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
    {
      value: "BTC",
      label: "฿",
    },
    {
      value: "JPY",
      label: "¥",
    },
  ];
  const { Option } = Select;
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <CssBaseline />
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid container style={{ marginBottom: "13px" }}>
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
                <label>الحالة</label>
              </Grid>
              <Grid item lg={9} xs={11}>
                <Select
                  size="default"
                  defaultValue="1"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Option key="1">الكل</Option>
                  <Option key="2">الموافق عليها</Option>
                  <Option key="3">قيد الأنتظار</Option>
                  <Option key="4">المرفوضة</Option>
                </Select>
              </Grid>
            </Grid>
            <Grid container style={{ marginBottom: "13px" }}>
              <Grid
                className="textLabel"
                item
                lg={1}
                xs={12}
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                <label>الفرع</label>
              </Grid>
              <Grid item xs={11} lg={4}>
                <Select
                  size="default"
                  defaultValue="1"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Option key="1">تكنولوجيا المعلومات</Option>
                  <Option key="2">مشروع تجارى</Option>
                  <Option key="3">إعداد التقارير الفنية</Option>
                  <Option key="4">الموارد البشرية</Option>
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
                <label>الإدارة</label>
              </Grid>
              <Grid item xs={11} lg={4}>
                <Select
                  size="default"
                  defaultValue="1"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Option key="1">تكنولوجيا المعلومات</Option>
                  <Option key="2">مشروع تجارى</Option>
                  <Option key="3">إعداد التقارير الفنية</Option>
                  <Option key="4">الموارد البشرية</Option>
                </Select>
              </Grid>
            </Grid>
            <Grid container style={{ marginBottom: "13px" }}>
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
                <label>اسم الموظف</label>
              </Grid>
              <Grid item xs={11} lg={4}>
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
                      width: "700px",
                    },
                  }}
                  id="email"
                  name="email"
                  autoComplete="email"
                />
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
                <label>كود البصمة</label>
              </Grid>
              <Grid item xs={11} lg={4}>
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
                  autoFocus
                />
              </Grid>
            </Grid>
            <Grid container>
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
                <label>نوع الطلب</label>
              </Grid>
              <Grid item xs={11} lg={4}>
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
                      width: "700px",
                    },
                  }}
                  id="email"
                  name="email"
                  autoComplete="email"
                />
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
                <label>تاريخ التعيين</label>
              </Grid>
              <Grid item xs={11} lg={4}>
                <DatePicker
                  onChange={onChange}
                  placeholder=""
                  style={{ width: "100%", height: "100%" }}
                />
              </Grid>
              <Grid item xs={12} lg={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  id="searchbtn"
                  className={classes.submit}
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
          <TableRequests />
        </Grid>
      </Grid>
    </Grid>
  );
}
