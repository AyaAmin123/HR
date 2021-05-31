import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { DatePicker } from "antd";
import { post } from "../../API";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";

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
export default function AddAttendance() {
  const classes = useStyles();

  const dispatch = useDispatch(null);

  const [dateFrom, set_dateFrom] = useState(null);
  const [dateTo, set_dateTo] = useState(null);

  const convertDataToCompare = (date) => {
    if (date) {
      let tempDate = date.toISOString().split("T")[0];

      return new Date(new Date(`${tempDate} 00:00:00`) + "UTC");
    }
    return "";
  };

  const addAttendance = async () => {
    dispatch(showLoading());
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "att/addAttendance",
      {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      }
    );
    if (valid) {
      dispatch(hideLoading());
      dispatch(openAlert("success", msg));
    } else {
      dispatch(openAlert("error", msg));
    }
    dispatch(hideLoading());
  };
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
              <label>التاريخ من</label>
            </Grid>
            <Grid item xs={11} lg={4}>
              <DatePicker
                value={dateFrom}
                onChange={(date) => set_dateFrom(date)}
                placeholder=""
                style={{ width: "100%", height: "100%" }}
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
              <label>التاريخ الى</label>
            </Grid>
            <Grid item xs={11} lg={4}>
              <DatePicker
                value={dateTo}
                onChange={(date) => set_dateTo(date)}
                placeholder=""
                style={{ width: "100%", height: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={2}>
              <Button
                disabled={
                  !dateFrom ||
                  !dateTo ||
                  convertDataToCompare(dateTo) -
                    convertDataToCompare(dateFrom) <
                    0
                }
                type="submit"
                fullWidth
                variant="contained"
                id="searchbtn"
                className={classes.submit}
                onClick={addAttendance}
              >
                بحث
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
