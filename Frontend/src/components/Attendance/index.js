import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import TableAttendance from "./TableAttendance";
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
let TableContext = "";
export default function Attendance() {
  const classes = useStyles();
  const { Option } = Select;
  const {
    mainData: {
      branches = {},
      departments = {},
      positions = {},
      latnessFilters = {},
    },
  } = useSelector((store) => store);
  const dispatch = useDispatch(null);
  const [data, set_data] = useState({
    data: [],
    page: 0,
    per_page: 10,
    total: "",
  });

  const [branch, set_branch] = useState(null);
  const [position_id, set_position_id] = useState(null);

  const [lateness_filter, set_lateness_filter] = useState(null);

  const [department_id, set_department_id] = useState("");
  const [ar_name, set_ar_name] = useState("");
  const [finger_print_id, set_finger_print_id] = useState("");
  const [date, set_date] = useState(null);

  const getAttendance = async (pageNumber = 0) => {
    let conditions = {
      ...(department_id ? { department_id } : {}),
      ...(ar_name ? { ar_name } : {}),
      ...(pageNumber ? { page: pageNumber } : {}),
      ...(finger_print_id ? { finger_print_id } : {}),
      ...(date ? { date: date.toISOString().split("T")[0] } : {}),
      ...(branch ? { branch_id: branch } : {}),
      ...(position_id ? { position_id } : {}),
      ...(lateness_filter ? { lateness_filter } : {}),
    };
    dispatch(showLoading());
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data,
      page,
      per_page,
      total,
    } = await get("att/get", { ...conditions });
    if (valid) {
      console.log({ data, page, per_page, total });
      set_data({ data, page, per_page, total });
      dispatch(openAlert("success", msg));
      dispatch(hideLoading());
    } else {
      set_data({ data: [], page: 0, per_page: 0, total: 0 });
      dispatch(openAlert("error", msg));
      dispatch(hideLoading());
    }

    // set_branch(null);
    // set_position_id(null);
    // set_department_id("");
    // set_ar_name("");
    // set_finger_print_id("");
  };
  function onChange(date, dateString) {
    set_date(date);
  }
  const update_actual_in_out = async () => {
    dispatch(showLoading());
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "att/update_actual_in_out",
      {
        date: date
          ? date.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
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
              <label>القسم</label>
            </Grid>
            <Grid item xs={11} lg={4}>
              <Select
                disabled={lateness_filter !== null}
                value={department_id}
                onChange={(e) => set_department_id(e)}
                size="default"
                style={{ width: "100%", height: "100%" }}
              >
                {Object.keys(departments).map((key) => {
                  return <Option key={key}>{departments[key]}</Option>;
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
              <label>أسم الموظف</label>
            </Grid>
            <Grid item xs={11} lg={4}>
              <TextField
                disabled={lateness_filter !== null}
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
                value={ar_name}
                onChange={({ target: { value } }) => {
                  set_ar_name(value);
                }}
                variant="outlined"
                required
                fullWidth
                id="firstName"
                autoFocus
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
              <label>الوظيفة</label>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Select
                disabled={lateness_filter !== null}
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
                disabled={lateness_filter !== null}
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
                disabled={lateness_filter !== null}
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
                value={finger_print_id}
                onChange={({ target: { value } }) => {
                  set_finger_print_id(value);
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
              <label>التاريخ</label>
            </Grid>
            <Grid item xs={11} lg={4}>
              <DatePicker
                value={date}
                onChange={onChange}
                placeholder=""
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
              <label>التاخيرات</label>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Select
                value={lateness_filter}
                onChange={(d) => set_lateness_filter(d)}
                size="default"
                defaultValue="1"
                style={{ width: "100%", marginLeft: "20px" }}
              >
                {Object.keys(latnessFilters).map((key) => {
                  return <Option key={key}>{latnessFilters[key]}</Option>;
                })}
              </Select>
            </Grid>
            <Grid item xs={12} md={12} lg={5}></Grid>
            <Grid item xs={12} md={12} lg={2}>
              <Button
                disabled={lateness_filter !== null && date === null}
                type="submit"
                fullWidth
                variant="contained"
                id="searchbtn"
                className={classes.submit}
                onClick={() => {
                  TableContext.setState({ current: 1 });
                  getAttendance();
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
                حضور وانصراف جميع الموظفين
              </Typography>
            </Box>
          </Box>

          <TableAttendance
            setContext={(context) => {
              TableContext = context;
            }}
            update_actual_in_out={update_actual_in_out}
            data={data}
            getAttendance={(pageNumber) => getAttendance(pageNumber)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

// <Grid item xs={12} id="attendance">
//   <Tabs type="card" className={csx(classes.tabsStyle)}>
//     <TabPane tab="الحضور والانصراف" key="1">
//       <Paper className={classes.paper}>
//         <CssBaseline />

//         <Grid container spacing={2}>
//           <Grid container style={{ marginBottom: "13px" }}>
//             <Grid
//               item
//               lg={1}
//               xs={12}
//               className="textLabel"
//               style={{
//                 fontSize: "14px",
//                 marginTop: "10px",
//               }}
//             >
//               <label>الفرع</label>
//             </Grid>
//             <Grid item xs={11} lg={4}>
//               <Select
//                 value={department_id}
//                 onChange={(e) => set_department_id(e)}
//                 size="default"
//                 style={{ width: "100%", height: "100%" }}
//               >
//                 {Object.keys(departments).map((key) => {
//                   return <Option key={key}>{departments[key]}</Option>;
//                 })}
//               </Select>
//             </Grid>

//             <Grid
//               item
//               lg={1}
//               xs={12}
//               className="textLabel"
//               style={{
//                 fontSize: "14px",
//                 marginTop: "10px",
//               }}
//             >
//               <label>أسم الموظف</label>
//             </Grid>
//             <Grid item xs={11} lg={4}>
//               <TextField
//                 autoComplete="fname"
//                 name="firstName"
//                 InputLabelProps={{
//                   style: {
//                     direction: "rtl",
//                     width: "90%",
//                   },
//                 }}
//                 InputProps={{
//                   style: { height: "40px", fontSize: "15px" },
//                 }}
//                 value={ar_name}
//                 onChange={({ target: { value } }) => {
//                   set_ar_name(value);
//                 }}
//                 variant="outlined"
//                 required
//                 fullWidth
//                 id="firstName"
//                 autoFocus
//               />
//             </Grid>
//           </Grid>
//           <Grid container>
//             <Grid
//               item
//               lg={1}
//               xs={12}
//               className="textLabel"
//               style={{
//                 fontSize: "14px",
//                 marginTop: "10px",
//               }}
//             >
//               <label>كود البصمة</label>
//             </Grid>
//             <Grid item xs={11} lg={4}>
//               <TextField
//                 variant="outlined"
//                 required
//                 InputProps={{
//                   style: { height: "40px", fontSize: "15px" },
//                 }}
//                 fullWidth
//                 InputLabelProps={{
//                   style: {
//                     direction: "rtl",
//                     width: "700px",
//                   },
//                 }}
//                 value={finger_print_id}
//                 onChange={({ target: { value } }) => {
//                   set_finger_print_id(value);
//                 }}
//                 id="email"
//                 name="email"
//                 autoComplete="email"
//               />
//             </Grid>
//             <Grid
//               item
//               lg={1}
//               xs={12}
//               className="textLabel"
//               style={{
//                 fontSize: "14px",
//                 marginTop: "10px",
//               }}
//             >
//               <label>التاريخ</label>
//             </Grid>
//             <Grid item xs={11} lg={4}>
//               <DatePicker
//                 value={date}
//                 onChange={onChange}
//                 placeholder=""
//                 style={{ width: "100%", height: "100%" }}
//               />
//             </Grid>
//             <Grid item xs={12} md={12} lg={2}>
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 id="searchbtn"
//                 className={classes.submit}
//                 onClick={() => getAttendance()}
//               >
//                 بحث
//               </Button>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Paper>
//       <Grid container className={classes.tableStyle}>
//         <Grid sm={12} item>
//           <Box
//             display="flex"
//             justifyContent="flex-start"
//             bgcolor="background.paper"
//           >
//             <Box p={1}>
//               <Typography
//                 style={{
//                   fontWeight: "600",
//                   fontSize: "18px",
//                   color: "#2B2D35",
//                   margin: "14px 0px",
//                 }}
//               >
//                 حضور وانصراف جميع الموظفين
//               </Typography>
//             </Box>
//           </Box>
//           <TableAttendance
//             data={data}
//             getAttendance={(pageNumber) => getAttendance(pageNumber)}
//           />
//         </Grid>
//       </Grid>
//     </TabPane>

//     {/* <TabPane tab="الاجراءات" key="2">
//       <MeasuresTab />
//     </TabPane> */}
//   </Tabs>

// </Grid>
