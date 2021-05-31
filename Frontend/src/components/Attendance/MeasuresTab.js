import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import DateRangeIcon from "@material-ui/icons/DateRange";
import MeasuresTable from "./MeasuresTable";
import "./attendance.css";
import { DatePicker } from "antd";
import { Select } from "antd";
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

const MeasuresTab = () => {
  const onChange = (date, dateString) => {};
  const classes = useStyles();
  const { Option } = Select;
  return (
    <div>
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
                <label>الفرع</label>
              </Grid>
              <Grid item lg={9} xs={11}>
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
                <label>الحالة</label>
              </Grid>
              <Grid item xs={11} lg={4}>
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
                <label>التاريخ</label>
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
        <Grid sm={12} item>
          <Box
            display="flex"
            justifyContent="flex-start"
            bgcolor="background.paper"
          >
            <Box p={1}>
              <Typography
                style={{
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "#2B2D35",
                  margin: "14px 0px",
                }}
              >
                حضور وانصراف جميع الموظفين
              </Typography>
            </Box>
          </Box>
          <MeasuresTable />
        </Grid>
      </Grid>
    </div>
  );
};
export default MeasuresTab;
