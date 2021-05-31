import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TableMyRequests from "./TableMyRequests";
import { Select } from "antd";
import "./requests.css";
import { DatePicker } from "antd";
import { useSelector } from "react-redux";
var childContext = "";
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

export default function MyRequests() {
  const classes = useStyles();
  const { Option } = Select;
  const [request_status, set_request_status] = useState("");
  const [request_type, set_request_type] = useState("");
  const [date_from, set_date_from] = useState("");
  const [date_to, set_date_to] = useState("");
  const { processes = {} } = useSelector((store) => store.mainData);
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <CssBaseline />

        <Grid container spacing={2}>
          <Grid container style={{ marginBottom: "13px" }}>
            <Grid
              item
              lg={1}
              sm={2}
              xs={6}
              style={{ fontSize: "16px", marginTop: "10px" }}
            >
              <label>حالة الطلب</label>
            </Grid>
            <Grid item xs={6} sm={10} lg={4}>
              <Select
                value={request_status}
                onChange={(d) => set_request_status(d)}
                size="default"
                defaultValue="1"
                style={{ width: "100%", marginLeft: "20px" }}
              >
                <Option key="">الكل</Option>
                <Option key="2">الموافق عليها</Option>
                <Option key="3">المرفوضة</Option>
                <Option key="4">الملغاة</Option>
              </Select>
            </Grid>
            <Grid
              item
              lg={1}
              xs={6}
              sm={2}
              style={{ fontSize: "16px", marginTop: "10px" }}
            >
              <label>نوع الطلب</label>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Select
                value={request_type}
                onChange={(d) => set_request_type(d)}
                size="default"
                defaultValue="1"
                style={{ width: "100%", marginLeft: "20px" }}
              >
                {Object.keys(processes).map((key) => {
                  return <Option key={key}>{processes[key]}</Option>;
                })}
              </Select>
            </Grid>
          </Grid>

          <Grid container style={{ marginBottom: "13px" }}>
            <Grid
              item
              lg={1}
              sm={2}
              xs={6}
              style={{ fontSize: "16px", marginTop: "10px" }}
            >
              <label>من</label>
            </Grid>
            <Grid item xs={6} sm={10} lg={4}>
              <DatePicker
                value={date_from}
                onChange={(date) => set_date_from(date)}
                placeholder=""
                style={{ width: "100%", height: "100%" }}
              />
            </Grid>
            <Grid
              item
              lg={1}
              xs={6}
              sm={2}
              style={{ fontSize: "16px", marginTop: "10px" }}
            >
              <label>الي</label>
            </Grid>
            <Grid item xs={12} lg={4}>
              <DatePicker
                value={date_to}
                onChange={(date) => set_date_to(date)}
                placeholder=""
                style={{ width: "100%", height: "100%" }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid lg={10}></Grid>
            <Grid item xs={12} sm={12} md={12} lg={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={date_from === "" || date_to === ""}
                className={classes.submit}
                onClick={() => {
                  childContext.getRequests({
                    ...(request_status ? { request_status } : {}),
                    ...(request_type ? { request_type } : {}),
                    ...(date_from
                      ? {
                          date_from: date_from.toISOString().split("T")[0],
                        }
                      : {}),
                    ...(date_to
                      ? { date_to: date_to.toISOString().split("T")[0] }
                      : {}),
                  });
                  set_request_status("");
                  set_request_type("");
                  set_date_from("");
                  set_date_to("");
                }}
              >
                بحث
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Grid container className={classes.tableStyle}>
        <Grid sm={12} item style={{ marginRight: "160px" }}>
          <TableMyRequests
            setChildContext={(context) => {
              childContext = context;
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
