import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Select } from "antd";
import { DatePicker } from "antd";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import { post } from "../../API";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
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
    marginTop: "22px",
    float: "left",
  },
  paper: {
    padding: 20,
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginRight: 196,
    marginLeft: 35,
    marginTop: 22,
    direction: "rtl",
    border: "0.5px solid #eaeaea",
    boxShadow: "none",
    borderRadius: "2px",
  },
  tableStyle: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: "30px",
  },
  pickerStyle: {
    width: "100%",
    "&:hover": {
      backgroundColor: "#f5f4e8",
    },
  },
}));

export default function OfficialHolidays(props) {
  const classes = useStyles();
  const dispatch = useDispatch(null);
  const {
    mainData: { holidaysTypes },
  } = useSelector((store) => store);

  const [holiday_type_id, set_holiday_type_id] = useState(null);
  const [from, set_from] = useState(null);
  const [to, set_to] = useState(null);

  const { Option } = Select;
  const createOfficialHoliday = async () => {
    dispatch(showLoading());
    let fromTemp, toTemp;
    fromTemp = `${from.toISOString().split("T")[0]} 00:00:00`;
    toTemp = `${to.toISOString().split("T")[0]} 23:59:59`;

    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "officalHolidays/set_holiday",
      {
        holiday_type_id: parseInt(holiday_type_id),
        from: fromTemp,
        to: toTemp,
      }
    );
    if (valid) {
      dispatch(openAlert("success", msg));
    } else {
      dispatch(openAlert("error", msg));
    }
    set_from(null);
    set_to(null);
    set_holiday_type_id(null);

    dispatch(hideLoading());
  };

  const convertDataToCompare = (date) => {
    if (date) {
      let tempDate = date.toISOString().split("T")[0];

      return new Date(new Date(`${tempDate} 00:00:00`) + "UTC");
    }
    return "";
  };
  const disableButton = () => {
    return from === null ||
      to === null ||
      convertDataToCompare(from) - convertDataToCompare(to) > 0 ||
      (to && to.toISOString() <= new Date().toISOString()) ||
      holiday_type_id === null
      ? true
      : false;
  };
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <CssBaseline />

        <Grid container spacing={2}>
          <Grid
            item
            lg={1}
            xs={12}
            className="textLabel"
            style={{
              marginTop: "10px",
            }}
          >
            <label>نوع الاجازة</label>
          </Grid>
          <Grid item xs={12} lg={11}>
            <Select
              size="default"
              placeholder="اختر نوع الاجازة"
              style={{ width: "100%", marginLeft: "20px" }}
              value={holiday_type_id}
              onChange={(e) => {
                set_holiday_type_id(e.toString());
              }}
            >
              {Object.keys(holidaysTypes).map((key) => {
                return (
                  <Option key={key.toString()}>{holidaysTypes[key]}</Option>
                );
              })}
            </Select>
          </Grid>
        </Grid>
        <Grid container style={{ marginBottom: "13px", marginTop: "20px" }}>
          <Grid
            item
            lg={1}
            className="textLabel"
            xs={12}
            style={{ fontSize: "16px", marginTop: "10px" }}
          >
            <label>التاريخ من</label>
          </Grid>
          <Grid item lg={5} xs={12} className="dateFilter">
            <DatePicker
              value={from}
              onChange={(date, dateString) => {
                set_from(date);
              }}
              placeholder=""
              style={{ width: "100%", height: "100%" }}
            />
          </Grid>

          <Grid
            item
            lg={1}
            xs={12}
            className="textLabel"
            style={{ fontSize: "16px", marginTop: "10px" }}
          >
            <label>التاريخ الى</label>
          </Grid>
          <Grid item lg={5} xs={12} className="dateFilter">
            <DatePicker
              value={to}
              onChange={(date, dateString) => set_to(date)}
              placeholder=""
              style={{ width: "100%", height: "100%" }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              disabled={disableButton()}
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={createOfficialHoliday}
            >
              إرسال
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
