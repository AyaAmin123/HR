import React from "react";
import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Input } from "antd";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import "./Resignation.css";
// import { Select } from "antd";
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
    marginLeft: 35,
    marginTop: 22,
    marginBottom: "-1px",
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

const Upload = () => {
  const classes = useStyles();
  const { TextArea } = Input;
  // const { Option } = Select;
  return (
    <Paper className={classes.paper}>
      <Grid sm={12} item>
        <Grid container spacing={2} style={{ marginBottom: "13px" }}>
          <Grid
            item
            className="textLabel"
            lg={1}
            xs={12}
            style={{ marginTop: "10px" }}
          >
            <label>اسم الموظف</label>
          </Grid>
          <Grid item xs={12} lg={5}>
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
            />
          </Grid>

          <Grid
            item
            className="textLabel"
            lg={1}
            xs={12}
            style={{ marginTop: "10px" }}
          >
            <label>كود الموظف</label>
          </Grid>
          <Grid item xs={12} lg={5}>
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
            />
          </Grid>
        </Grid>
        <Grid container style={{ marginBottom: "13px" }}>
          <Grid
            item
            className="textLabel"
            lg={1}
            xs={12}
            style={{
              marginTop: "10px",
            }}
          >
            <label>تحميل الأستقالة</label>
          </Grid>
          <Grid item xs={12} lg={11}>
            <TextField
              variant="outlined"
              type="file"
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
            />
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: "20px" }}>
          <Grid item lg={1} xs={12} className="textLabel">
            <Box p={1}>
              <Typography
                style={{
                  color: "#2B2D35",
                }}
              >
                السبب
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={11}>
            <TextArea rows={8} />
          </Grid>
          <Grid
            lg={12}
            style={{
              border: "0.3px solid rgb(220 220 220)",
              marginTop: "10rem",
            }}
          ></Grid>
          <Grid
            item
            xs={12}
            sm={12}
            style={{ textAlign: "left", paddingTop: "1rem" }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              إضافة
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default Upload;
