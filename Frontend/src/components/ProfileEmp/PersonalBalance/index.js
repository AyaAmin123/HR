import React, { useState } from "react";
// import { Collapse } from "antd";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
// import { UserOutlined } from "@ant-design/icons";
// import SubdirectoryArrowRightRoundedIcon from "@material-ui/icons/SubdirectoryArrowRightRounded";
// import Paper from "@material-ui/core/Paper";
// import { Avatar } from "antd";
import Divider from "@material-ui/core/Divider";
import { DatePicker } from "antd";
import { get } from "../../../API";
import { useDispatch } from "react-redux";
import { openAlert } from "../../actions/alert-action";
// import { CssBaseline, Paper } from "@material-ui/core";
// import Button from "@material-ui/core/Button";
const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    textAlign: "center",
  },
  gridData: {
    marginBottom: 20,
  },
  paper: {
    padding: 20,
    textAlign: "center",
    color: theme.palette.text.secondary,

    direction: "rtl",
    border: "0.5px solid #eaeaea",
    boxShadow: "none",
    borderRadius: "2px",
  },
}));

export default function PersonalBalance({ emp_id }) {
  const classes = useStyles();
  const dispatch = useDispatch(null);
  const [data, set_data] = useState({
    remaning: 0,
    consumed: 0,
    minus_march: 0,
    annual_vacation: 0,
    contingency_vacation: 0,
    last_year_vacation: 0,
    latenesHours: 0,
  });
  // const { Panel } = Collapse;

  async function getVacation(year) {
    const { valid, msg, data: dd } = await get("vacations/getVacationBalance", {
      emp_id,
      year,
    });
    getLatnesshours(dd);
    if (valid) {
      set_data({ ...dd });
      dispatch(openAlert("success", msg));
    } else dispatch(openAlert("error", msg));
  }

  async function getLatnesshours(dd) {
    const { valid, data: dataLatenesHours } = await get(
      "latenes/get_latness_by_month_and_day",
      {
        emp_id,
      }
    );

    if (valid) {
      set_data({ ...dd, latenesHours: dataLatenesHours });
    }
    //  else dispatch(openAlert("error", msg));
  }

  return (
    <div>
      {/* <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CssBaseline /> */}

      <Grid container style={{ marginBottom: "13px" }}>
        <Grid item xs={1}>
          <Typography variant="subtitle1" gutterBottom>
            سنة
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <DatePicker
            placeholder=""
            picker={"year"}
            style={{ width: "100%", height: "100%" }}
            onChange={(date, dateString) => {
              getVacation(dateString);
            }}
          />
        </Grid>
      </Grid>

      <Grid
        className={classes.gridData}
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            رصيد اجازات السنة الماضية :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {data.last_year_vacation} يوم
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            الايام التي تم استهلاكها :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {data.consumed}يوم
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            الايام التي تم استهلاكها من السنة الماضية :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {data.consumed >= data.last_year_vacation
              ? data.last_year_vacation
              : data.consumed}{" "}
            يوم
          </Typography>
        </Grid>

        {/* <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            رصيد الاجازات السنوى :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {data.remaning + data.consumed} يوم
          </Typography>
        </Grid> */}

        <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            الايام المخصومة بسبب شهر مارس :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {data.minus_march}يوم
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            رصيد الاجازات المتبقية قبل شهر مارس :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {data.remaning + data.minus_march}يوم
          </Typography>
        </Grid>

        {data.minus_march !== 0 && (
          <>
            <Grid item xs={3}>
              <Typography variant="subtitle1" gutterBottom>
                رصيد الاجازات المتبقية بعد شهر مارس :
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="subtitle2" gutterBottom>
                {data.remaning}يوم
              </Typography>
            </Grid>
          </>
        )}

        <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            رصيد العارضة المتبقية :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {6 - data.contingency_vacation}يوم
          </Typography>
        </Grid>

        <Grid item xs={12} style={{ margin: "30px 0px" }}>
          <Divider variant="middle" />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" gutterBottom>
            عدد ساعات التأخير :
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="subtitle2" gutterBottom>
            {data.latenesHours} ساعات
          </Typography>
        </Grid>
      </Grid>
      <div style={{ marginBottom: 20 }}>
        <Divider variant="middle" />
      </div>
      {/* </Paper>
      </Grid> */}
    </div>
  );
}
